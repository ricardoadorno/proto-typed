🎯 OBJETIVO

Transformar o repo proto-typed em um workspace com 3 pacotes:

@proto-typed/core — API pura (tokenize/parse/AST/render/compile).

@proto-typed/cli — CLI que exporta .pty → .html.

proto-typed-vscode — Extensão VS Code para .pty com botão no editor + LIVE PREVIEW em Webview (atualiza ao digitar) + diagnósticos.

O README afirma pipeline Lexer → Parser → AST → Renderer, editor Monaco e Export; usaremos isso como contrato do core. 
GitHub

✅ ASSUNÇÕES

Node 18+ (ou 20+), npm ou pnpm (workspaces).

O código atual do core está em src/core/** (lexer/parser/renderer) e pode ser reexportado.

O compile(text) retornará { html, diagnostics }, onde diagnostics tem {message, startOffset, endOffset}.

📦 PASSO 0 — Habilitar Workspaces no repositório

Editar package.json (raiz):

{
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "pnpm -r build",
    "lint": "pnpm -r lint"
  }
}


Criar pastas:

packages/
  core/
  cli/
  vscode-extension/

🧠 PASSO 1 — Pacote @proto-typed/core

Objetivo: expor API estável do compilador (reaproveitando seu src/core/**). O README já define a pipeline. 
GitHub

Arquivos:

packages/core/
  package.json
  tsconfig.json
  src/index.ts


packages/core/package.json:

{
  "name": "@proto-typed/core",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "exports": { ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" } },
  "scripts": {
    "build": "tsup src/index.ts --dts --format=esm --clean",
    "lint": "eslint ."
  },
  "dependencies": {
    "chevrotain": "^11.0.3"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.6.0",
    "eslint": "^9.0.0"
  }
}


packages/core/src/index.ts (fachada — adapte os imports aos seus nomes reais em src/core/**):

// Reexporte a sua engine real:
export { tokenize } from "../../../src/core/lexer";        // ajuste o caminho
export { parse, buildAst } from "../../../src/core/parser";
export { renderHtml } from "../../../src/core/renderer";

// Convenção de alto nível: compila texto → { html, diagnostics }
export type Diag = { message: string; startOffset?: number; endOffset?: number };
export type CompileOptions = { standaloneHtml?: boolean };

export async function compile(text: string, opts: CompileOptions = {}) {
  // 1) tokenize/parse/ast (use sua pipeline)
  const ast = buildAst(parse(tokenize(text)));
  // 2) render
  const html = await renderHtml(ast, opts);
  // 3) colete erros (se houver) e converta para offsets
  const diagnostics: Diag[] = []; // integre dos seus estágios, se já existirem
  return { html, diagnostics };
}


Se preferir mover src/core/** para packages/core/src/**, faça agora e ajuste os imports.

🖥️ PASSO 2 — Pacote @proto-typed/cli (export .pty → .html)

O README menciona “Export” (download HTML). Vamos formalizar um CLI que gera HTML standalone. 
GitHub

Arquivos:

packages/cli/
  package.json
  tsconfig.json
  src/cli.ts


packages/cli/package.json:

{
  "name": "@proto-typed/cli",
  "version": "0.1.0",
  "type": "module",
  "bin": { "proto-typed": "dist/cli.js" },
  "scripts": {
    "build": "tsup src/cli.ts --format=esm --dts --clean",
    "dev": "tsx src/cli.ts",
    "lint": "eslint ."
  },
  "dependencies": {
    "@proto-typed/core": "workspace:*",
    "globby": "^14.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.6.0",
    "tsx": "^4.7.0",
    "eslint": "^9.0.0"
  }
}


packages/cli/src/cli.ts:

#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, extname, basename } from "node:path";
import { globby } from "globby";
import { compile } from "@proto-typed/core";

const args = process.argv.slice(2);
const outIdx = args.indexOf("-o");
const outDir = outIdx >= 0 ? resolve(args[outIdx + 1]) : resolve("dist");
const inputs = args.filter(a => !a.startsWith("-"));
if (inputs.length === 0) {
  console.error("Usage: proto-typed <fileOrGlob.pty> [-o dist]");
  process.exit(1);
}

const main = async () => {
  const files = (await globby(inputs)).filter(f => extname(f) === ".pty");
  mkdirSync(outDir, { recursive: true });
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    const { html, diagnostics } = await compile(text, { standaloneHtml: true });
    const outFile = resolve(outDir, basename(f).replace(/\.pty$/, ".html"));
    writeFileSync(outFile, html, "utf8");
    const issues = diagnostics?.length ?? 0;
    console.log(`✓ ${f} → ${outFile}${issues ? `  (${issues} issues)` : ""}`);
  }
};
main().catch(e => { console.error(e); process.exit(1); });

🧩 PASSO 3 — Extensão VS Code (proto-typed-vscode) com LIVE PREVIEW

Extensão que:
• reconhece .pty; • adiciona botão no topo direito; • abre Webview; • live preview (atualiza enquanto digita); • diagnósticos.

3.1 Estrutura
packages/vscode-extension/
  package.json
  tsconfig.json
  src/extension.ts
  src/diagnostics.ts
  media/preview-light.svg
  media/preview-dark.svg
  media/webview.js
  language-configuration.json
  syntaxes/minilang.tmLanguage.json   (opcional, rascunho)

3.2 package.json
{
  "name": "proto-typed-vscode",
  "displayName": "Proto-Typed",
  "publisher": "seuPublisher",
  "version": "0.1.0",
  "engines": { "vscode": "^1.95.0" },
  "categories": ["Programming Languages"],
  "activationEvents": [
    "onLanguage:protoTyped",
    "onCommand:protoTyped.preview"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "languages": [
      {
        "id": "protoTyped",
        "aliases": ["Proto-Typed", "protoTyped"],
        "extensions": [".pty"],
        "configuration": "./language-configuration.json"
      }
    ],
    "commands": [
      {
        "command": "protoTyped.preview",
        "title": "Proto-Typed: Preview",
        "icon": { "light": "media/preview-light.svg", "dark": "media/preview-dark.svg" }
      }
    ],
    "menus": {
      "editor/title": [
        {
          "command": "protoTyped.preview",
          "group": "navigation",
          "when": "resourceLangId == protoTyped"
        }
      ]
    }
  },
  "scripts": {
    "build": "esbuild src/extension.ts --bundle --outfile=out/extension.js --platform=node --external:vscode --format=cjs",
    "lint": "eslint ."
  },
  "devDependencies": {
    "esbuild": "^0.23.0",
    "typescript": "^5.6.0",
    "@types/vscode": "^1.95.0",
    "eslint": "^9.0.0"
  },
  "dependencies": {
    "@proto-typed/core": "workspace:*"
  }
}

3.3 language-configuration.json
{
  "comments": { "lineComment": "//" },
  "brackets": [["{","}"],["[","]"],["(",")"]],
  "autoClosingPairs": [
    { "open": "\"", "close": "\"" },
    { "open": "'", "close": "'" },
    { "open": "(", "close": ")" },
    { "open": "[", "close": "]" },
    { "open": "{", "close": "}" }
  ]
}

3.4 Diagnósticos — src/diagnostics.ts
import * as vscode from "vscode";
import { compile } from "@proto-typed/core";

export function registerDiagnostics(ctx: vscode.ExtensionContext) {
  const coll = vscode.languages.createDiagnosticCollection("protoTyped");
  ctx.subscriptions.push(coll);

  async function refresh(doc: vscode.TextDocument) {
    if (doc.languageId !== "protoTyped") return;
    const { diagnostics } = await compile(doc.getText());
    const toVs = (d: any) => {
      const start = doc.positionAt(d.startOffset ?? 0);
      const end   = doc.positionAt(d.endOffset ?? (d.startOffset ?? 0) + 1);
      const diag = new vscode.Diagnostic(new vscode.Range(start, end), d.message || "Error", vscode.DiagnosticSeverity.Error);
      return diag;
    };
    coll.set(doc.uri, (diagnostics ?? []).map(toVs));
  }

  vscode.workspace.onDidOpenTextDocument(refresh, null, ctx.subscriptions);
  vscode.workspace.onDidChangeTextDocument(e => refresh(e.document), null, ctx.subscriptions);
  vscode.workspace.textDocuments.forEach(refresh);

  return coll;
}

3.5 LIVE PREVIEW — src/extension.ts
import * as vscode from "vscode";
import { compile } from "@proto-typed/core";
import { registerDiagnostics } from "./diagnostics";

export function activate(context: vscode.ExtensionContext) {
  registerDiagnostics(context);

  const cmd = vscode.commands.registerCommand("protoTyped.preview", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { vscode.window.showErrorMessage("Nenhum editor ativo."); return; }

    const panel = vscode.window.createWebviewPanel(
      "protoTypedPreview",
      "Proto-Typed Preview",
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      { enableScripts: true }
    );

    const jsUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "media", "webview.js"));
    panel.webview.html = getHtml(panel, jsUri);

    // função que compila e envia ao preview
    const sendUpdate = async (doc: vscode.TextDocument) => {
      if (!doc || doc.languageId !== "protoTyped") return;
      const { html, diagnostics } = await compile(doc.getText(), { standaloneHtml: true });
      panel.webview.postMessage({ type: "preview:update", html, diagnostics });
    };

    // 1) primeira renderização
    await sendUpdate(editor.document);

    // 2) LIVE: atualiza ao digitar (debounce simples)
    let timer: NodeJS.Timeout | undefined;
    const changeSub = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() !== editor.document.uri.toString()) return;
      clearTimeout(timer);
      timer = setTimeout(() => sendUpdate(e.document), 80); // 80ms debounce
    });

    // 3) Troca de aba: se usuário mudar o editor ativo, atualiza (se .pty)
    const activeSub = vscode.window.onDidChangeActiveTextEditor(ed => {
      if (ed?.document?.languageId === "protoTyped") sendUpdate(ed.document);
    });

    panel.onDidDispose(() => { changeSub.dispose(); activeSub.dispose(); });
  });

  context.subscriptions.push(cmd);
}

function getHtml(panel: vscode.WebviewPanel, jsUri: vscode.Uri) {
  const nonce = String(Date.now());
  return /* html */`
  <!doctype html>
  <html lang="pt-br">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${panel.webview.cspSource} data:;
                 script-src 'nonce-${nonce}'; style-src ${panel.webview.cspSource} 'unsafe-inline';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Proto-Typed Preview</title>
      <style>
        :root { color-scheme: dark; }
        body { background: #0b0b0c; color: #e6e6e6; font: 13px/1.5 ui-sans-serif, system-ui; margin:0; }
        header { display:flex; align-items:center; gap:.5rem; padding:.5rem .75rem; border-bottom:1px solid #222; }
        header .ok { color:#a5d6a7 } header .err { color:#ef9a9a }
        iframe { width: 100%; height: calc(100vh - 42px); border:0; background:#111; }
      </style>
    </head>
    <body>
      <header>
        <strong>Preview</strong>
        <span id="status">Aguardando…</span>
      </header>
      <iframe id="frame" sandbox="allow-scripts allow-same-origin"></iframe>
      <script nonce="${nonce}" src="${jsUri}"></script>
    </body>
  </html>`;
}

3.6 Webview runtime — media/webview.js
(function () {
  const vscode = acquireVsCodeApi();
  const frame = document.getElementById("frame");
  const status = document.getElementById("status");

  function setStatus(ok, msg) {
    status.textContent = msg;
    status.className = ok ? "ok" : "err";
  }

  window.addEventListener("message", (e) => {
    const { type, html, diagnostics } = e.data || {};
    if (type !== "preview:update") return;

    try {
      // html aqui já é standalone (Tailwind CDN etc.) conforme o core
      frame.srcdoc = html;
      const issues = (diagnostics?.length ?? 0);
      if (issues === 0) setStatus(true, "✓ Sem erros");
      else setStatus(false, `✗ ${issues} erro(s)`);
    } catch (err) {
      setStatus(false, "Falha ao renderizar");
    }
  });
})();


Resultado: Live Preview atualiza com debounce a cada edição, reflete HTML gerado pelo seu renderer do core e exibe contagem de erros. O README reforça “Real-time Preview” e “Export” — a extensão replica essa experiência no VS Code. 
GitHub

🎨 (Opcional) Highlight inicial

Se quiser um highlight rápido (TextMate) até implementar semantic tokens:

syntaxes/minilang.tmLanguage.json (rascunho):

{
  "scopeName": "source.proto-typed",
  "patterns": [
    { "match": "\\b(screen|modal|drawer)\\b", "name": "keyword.control.proto-typed" },
    { "match": "@[a-zA-Z-]+(-xs|-sm|-md|-lg)?\\[.*?\\]\\([^)]*\\)", "name": "entity.name.function.proto-typed" },
    { "match": "\"([^\"\\\\]|\\\\.)*\"", "name": "string.quoted.double.proto-typed" },
    { "match": "^\\s*#.+$", "name": "markup.heading.proto-typed" }
  ]
}


E adicione grammars no contributes se quiser.

🧪 PASSO 4 — Scripts DX na raiz

No package.json (raiz), além do build:

{
  "scripts": {
    "build": "pnpm -r build",
    "export:html": "proto-typed src/**/*.pty -o dist",
    "ext:build": "pnpm -w packages/vscode-extension build"
  }
}

🚀 PASSO 5 — Validação (DoD)

pnpm -r build compila core, cli e extensão sem erros.

Abrir VS Code, F5 (modo extensão):

Abrir *.pty → ver botão no canto superior direito.

Rodar Proto-Typed: Preview → abre Webview.

Live Preview: ao digitar, iframe atualiza; status mostra erros (0/≥1).

CLI: proto-typed examples/*.pty -o dist → gera .html standalone.

O comportamento de lexer/parser/renderer + real-time preview é consistente com o que o README descreve (Monaco + Real-time Preview + Export). 
GitHub

📌 NOTAS FINAIS

Diagnósticos: ajuste startOffset/endOffset para refletir corretamente suas regiões de erro; se o parser já fornece linha/coluna, converta para offset ou para Range diretamente.

Performance: se o renderer for pesado, aumente o debounce (p.ex. 120–200ms).

Segurança Webview: o HTML gerado é injetado em srcdoc; mantenha-o autocontido (CDNs permitidos pelo seu renderer).

Icone de arquivo .pty no Explorer/aba: só via File Icon Theme (opcional; usuário precisa ativar). Isso é uma limitação do VS Code; a extensão não consegue substituir o tema do usuário (use botão e status bar para identidade visual).