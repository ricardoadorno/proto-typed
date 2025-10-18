import * as vscode from "vscode";
import {
  parseAndBuildAst,
  astToHtmlStringPreview,
  routeManagerGateway,
  DSL_LANGUAGE_ID,
  computeLineOffsets,
  protoErrorToDiag,
  extractAndClearErrors,
  type AstNode,
  type RouteMetadata,
  type Diag
} from "@proto-typed/core";
import type { ProtoError } from "@proto-typed/core";
import { registerDiagnostics } from "./diagnostics";

interface PanelState {
  ast: AstNode | AstNode[] | null;
  currentScreen: string | null;
  metadata: RouteMetadata | null;
  parseDiagnostics: Diag[];
  lineOffsets: number[];
  textLength: number;
}

export function activate(context: vscode.ExtensionContext) {
  registerDiagnostics(context);

  const command = vscode.commands.registerCommand("protoTyped.preview", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== DSL_LANGUAGE_ID) {
      vscode.window.showErrorMessage("Nenhum editor ativo de Proto-Typed.");
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "protoTypedPreview",
      "Proto-Typed Preview",
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      { enableScripts: true }
    );

    const jsUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, "media", "webview.js")
    );
    panel.webview.html = getHtml(panel, jsUri);

    const state: PanelState = {
      ast: null,
      currentScreen: null,
      metadata: null,
      parseDiagnostics: [],
      lineOffsets: [0],
      textLength: 0
    };

    const sendPreview = () => {
      let html = "";
      let renderDiagnostics: Diag[] = [];

      if (state.ast) {
        const renderResult = astToHtmlStringPreview(state.ast, {
          currentScreen: state.currentScreen ?? undefined
        });
        html = renderResult.html;
        renderDiagnostics = (renderResult.errors ?? []).map(err =>
          protoErrorToDiag(err, state.lineOffsets, state.textLength)
        );
      }

      const diagnostics = [...state.parseDiagnostics, ...renderDiagnostics];
      state.metadata = routeManagerGateway.getRouteMetadata();

      void panel.webview.postMessage({
        type: "preview:update",
        html,
        diagnostics,
        metadata: state.metadata,
        currentScreen: state.currentScreen
      });
    };

    const computeDiagnostics = (errors: ProtoError[], lineOffsets: number[], length: number) =>
      errors.map(error => protoErrorToDiag(error, lineOffsets, length));

    const resetState = () => {
      state.ast = null;
      state.currentScreen = null;
      state.metadata = null;
      state.parseDiagnostics = [];
      state.lineOffsets = [0];
      state.textLength = 0;
      routeManagerGateway.resetNavigation();
      void panel.webview.postMessage({
        type: "preview:update",
        html: "",
        diagnostics: [],
        metadata: null,
        currentScreen: null
      });
    };

    const determineCurrentScreen = (metadata: RouteMetadata, desired: string | null) => {
      if (!metadata.screens.length) {
        return null;
      }
      const names = metadata.screens.map(screen => screen.name);
      if (desired && names.includes(desired)) {
        return desired;
      }
      return metadata.defaultScreen ?? names[0] ?? null;
    };

    const handleDocument = async (doc: vscode.TextDocument) => {
      if (doc.languageId !== DSL_LANGUAGE_ID) {
        return;
      }

      const text = doc.getText();
      state.lineOffsets = computeLineOffsets(text);
      state.textLength = text.length;

      if (!text.trim()) {
        resetState();
        return;
      }

      try {
        const ast = parseAndBuildAst(text);
        const parseErrors = extractAndClearErrors(ast);
        state.parseDiagnostics = computeDiagnostics(parseErrors, state.lineOffsets, state.textLength);

        routeManagerGateway.resetNavigation();
        routeManagerGateway.initialize(ast);
        const metadata = routeManagerGateway.getRouteMetadata();
        const currentScreen = determineCurrentScreen(metadata, state.currentScreen);

        state.ast = ast;
        state.metadata = metadata;
        state.currentScreen = currentScreen;

        routeManagerGateway.setHandlers({
          onScreenNavigation(screenName) {
            state.currentScreen = screenName;
            state.metadata = routeManagerGateway.getRouteMetadata();
            sendPreview();
          },
          onBackNavigation() {
            const meta = routeManagerGateway.getRouteMetadata();
            state.metadata = meta;
            state.currentScreen = meta.currentScreen ?? state.currentScreen;
            sendPreview();
          }
        });

        if (currentScreen) {
          routeManagerGateway.initializeNavigation(currentScreen);
        }

        sendPreview();
      } catch (error) {
        resetState();
        const message = error instanceof Error ? error.message : String(error);
        void panel.webview.postMessage({
          type: "preview:update",
          html: "",
          diagnostics: [{ message, stage: "compile" }],
          metadata: null,
          currentScreen: null
        });
      }
    };

    panel.webview.onDidReceiveMessage(message => {
      if (!state.ast) {
        return;
      }
      if (message?.type === "nav:navigate" && typeof message.screen === "string") {
        routeManagerGateway.navigateToScreen(message.screen);
      } else if (message?.type === "nav:back") {
        routeManagerGateway.navigateBack();
      }
    });

    await handleDocument(editor.document);

    let timer: NodeJS.Timeout | undefined;
    const changeSub = vscode.workspace.onDidChangeTextDocument(event => {
      if (event.document.uri.toString() !== editor.document.uri.toString()) {
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        void handleDocument(event.document);
      }, 120);
    });

    const activeSub = vscode.window.onDidChangeActiveTextEditor(activeEditor => {
      if (!activeEditor) {
        return;
      }
      if (activeEditor.document.uri.toString() === editor.document.uri.toString()) {
        void handleDocument(activeEditor.document);
      }
    });

    panel.onDidDispose(() => {
      changeSub.dispose();
      activeSub.dispose();
    });
  });

  context.subscriptions.push(command);
}

function getHtml(panel: vscode.WebviewPanel, jsUri: vscode.Uri) {
  const nonce = String(Date.now());
  return `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy"
      content="default-src 'none'; img-src ${panel.webview.cspSource} data:;
               script-src 'nonce-${nonce}' https://cdn.tailwindcss.com https://unpkg.com;
               style-src ${panel.webview.cspSource} 'unsafe-inline';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Proto-Typed Preview</title>
    <style>
      :root {
        color-scheme: dark;
        --bg-main: #0b0b0c;
        --bg-surface: #101015;
        --border-muted: rgba(139,92,246,0.25);
        --accent: rgba(139,92,246,0.85);
        --radius: 2.5rem;
      }
      * { box-sizing: border-box; }
      body {
        background: radial-gradient(circle at top, rgba(22,24,34,0.75), #040406);
        color: #e6e6e6;
        font: 13px/1.55 "Inter", ui-sans-serif, system-ui;
        margin: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .app-shell {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      .status-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: .75rem;
        padding: .75rem 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        background: rgba(12,12,16,0.85);
        backdrop-filter: blur(16px);
        font-size: 12px;
        letter-spacing: .24em;
        text-transform: uppercase;
      }
      .status-bar .status { flex: 1; }
      .status-bar .ok { color:#a5d6a7 }
      .status-bar .err { color:#ef9a9a }
      .status-bar .screen-label {
        font-weight: 600;
        letter-spacing: .18em;
        color: rgba(214,199,255,0.9);
        text-transform: uppercase;
        font-size: 11px;
      }
      .preview-wrapper {
        flex: 1;
        padding: 1.75rem 1.5rem 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .device-frame {
        position: relative;
        width: 375px;
        height: 812px;
        border-radius: var(--radius);
        border: 1px solid var(--border-muted);
        box-shadow:
          0 0 0 6px rgba(17,18,26,0.8),
          0 38px 72px rgba(12,14,24,0.45);
        background: var(--bg-main);
        overflow: hidden;
      }
      .device-notch {
        position: absolute;
        z-index: 2;
        inset: 0;
        height: 36px;
        display: flex;
        justify-content: center;
      }
      .device-notch-shape {
        content: "";
        display: block;
        width: 58%;
        height: 32px;
        background: var(--bg-main);
        border-bottom-left-radius: 24px;
        border-bottom-right-radius: 24px;
        box-shadow: inset 0 -2px 6px rgba(0,0,0,0.35);
      }
      .device-speaker {
        position: absolute;
        top: 10px;
        left: 50%;
        width: 70px;
        height: 6px;
        border-radius: 6px;
        background: #1c1d26;
        transform: translateX(-50%);
        box-shadow: inset 0 -1px 1px rgba(255,255,255,0.12);
        z-index: 3;
      }
      .device-camera {
        position: absolute;
        top: 10px;
        left: 50%;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        transform: translateX(90px);
        background: #181a22;
        box-shadow: inset 0 -1px 4px rgba(0,0,0,0.6);
        z-index: 3;
      }
      .device-camera::after {
        content: "";
        position: absolute;
        inset: 3px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(46,46,70,0.8) 60%);
        box-shadow: inset 0 -1px 2px rgba(0,0,0,0.4);
      }
      .device-home {
        position: absolute;
        bottom: 14px;
        left: 50%;
        width: 140px;
        height: 4px;
        border-radius: 999px;
        background: rgba(169,175,191,0.35);
        transform: translateX(-50%);
        z-index: 3;
      }
      .device-screen {
        position: absolute;
        inset: 32px 14px 20px;
        border-radius: calc(var(--radius) - 18px);
        background: var(--bg-main);
        overflow: hidden;
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,0.06),
          inset 0 0 24px rgba(0,0,0,0.4);
      }
      .device-screen-glow {
        position: absolute;
        inset: -30%;
        background: radial-gradient(circle at 20% 0%, rgba(120,93,255,0.24), transparent 50%);
        opacity: 0.45;
        pointer-events: none;
      }
      .device-content-viewport {
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: var(--bg-main);
        contain: paint;
      }
      .device-content-inner {
        min-height: 100%;
        transform-origin: top center;
        background: var(--bg-main);
        color: inherit;
        width: 100%;
        height: 100%;
      }
      .preview-content {
        width: 100%;
        height: 100%;
        overflow: auto;
        border-radius: 1.5rem;
        background: var(--bg-main);
      }
    </style>
  </head>
  <body>
    <div id="proto-typed-root"></div>
    <script nonce="${nonce}">
      window.tailwind = window.tailwind || {};
      window.tailwind.config = { darkMode: 'class', theme: { extend: {} } };
    </script>
    <script nonce="${nonce}" src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
    <script nonce="${nonce}" src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script nonce="${nonce}" src="${jsUri}"></script>
  </body>
</html>`;
}

export function deactivate() {
  // Nothing to clean up explicitly.
}
