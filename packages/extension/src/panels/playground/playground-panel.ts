/**
 * Playground Panel
 * Manages the WebviewPanel for the playground experience
 */

import * as vscode from 'vscode'
import { MessageRouter } from '../../messaging/message-router'
import { TextDocumentSynchronizer } from '../../utils/text-document-synchronizer'
import { createMessage } from '../../messaging/message-types'
import type {
  DslUpdatePayload,
  StateRestorePayload,
  ThemeSyncPayload,
  HandshakeInitPayload,
} from '../../messaging/message-types'

export interface PlaygroundPanelOptions {
  extensionContext: vscode.ExtensionContext
  messageRouter: MessageRouter
  synchronizer: TextDocumentSynchronizer
}

/**
 * PlaygroundPanel manages the webview lifecycle and communication
 */
export class PlaygroundPanel implements vscode.Disposable {
  private panel: vscode.WebviewPanel
  private disposables: vscode.Disposable[] = []
  private options: PlaygroundPanelOptions
  private sessionId: string
  private isHandshakeComplete = false
  private pendingMessages: Array<{ type: string; payload: unknown }> = []
  private disposed = false
  private readonly onDidDisposeEmitter = new vscode.EventEmitter<void>()
  public readonly onDidDispose = this.onDidDisposeEmitter.event

  private constructor(
    panel: vscode.WebviewPanel,
    options: PlaygroundPanelOptions
  ) {
    this.panel = panel
    this.options = options
    this.sessionId = `session-${Date.now()}`

    this.setupPanel()
    this.setupMessageHandling()
  }

  /**
   * Create a new PlaygroundPanel or reveal existing one
   */
  static create(
    options: PlaygroundPanelOptions,
    viewColumn?: vscode.ViewColumn
  ): PlaygroundPanel {
    const column = viewColumn || vscode.ViewColumn.Beside

    const panel = vscode.window.createWebviewPanel(
      'protoTypedPlayground',
      'Proto-Typed Playground',
      { viewColumn: column, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(options.extensionContext.extensionUri, 'dist'),
          vscode.Uri.joinPath(options.extensionContext.extensionUri, 'media'),
          options.extensionContext.extensionUri,
        ],
        enableCommandUris: true,
        enableFindWidget: true,
      }
    )

    return new PlaygroundPanel(panel, options)
  }

  private setupPanel(): void {
    // Set initial HTML
    this.panel.webview.html = this.getWebviewHtml()

    // Handle panel disposal
    this.panel.onDidDispose(
      () => {
        // Emit before disposing internals so listeners can react
        this.onDidDisposeEmitter.fire()
        this.dispose()
      },
      null,
      this.disposables
    )

    // Send handshake after panel is ready
    setTimeout(() => {
      this.sendHandshake()
    }, 100)
  }

  private setupMessageHandling(): void {
    // Listen to messages from webview
    this.panel.webview.onDidReceiveMessage(
      async (message) => {
        // Handle handshake acknowledgment
        if (message.type === 'HANDSHAKE_ACK') {
          this.isHandshakeComplete = true
          console.log('🤝 [PlaygroundPanel] Handshake complete')

          // Send any pending messages
          this.flushPendingMessages()

          // Send initial DSL content
          const editor = vscode.window.activeTextEditor
          if (editor) {
            await this.sendDslUpdate(editor.document)
          }
        }

        // Route to message router
        await this.options.messageRouter.handleMessage(message, {
          panel: this.panel,
          document: vscode.window.activeTextEditor?.document,
          extensionContext: this.options.extensionContext,
        })
      },
      null,
      this.disposables
    )

    // Listen to synchronizer events
    this.disposables.push(
      this.options.synchronizer.onSync(async (event) => {
        await this.sendDslUpdate(event.document)
      })
    )
  }

  private sendHandshake(): void {
    const payload: HandshakeInitPayload = {
      sessionId: this.sessionId,
    }

    const message = createMessage('HANDSHAKE_INIT', payload)
    this.options.messageRouter.sendMessage(this.panel, message)
  }

  private flushPendingMessages(): void {
    if (this.pendingMessages.length > 0) {
      console.log(
        `📤 [PlaygroundPanel] Flushing ${this.pendingMessages.length} pending messages`
      )
      // For now, we'll just clear them since we send fresh DSL on handshake
      this.pendingMessages = []
    }
  }

  /**
   * Send DSL content update to webview
   */
  async sendDslUpdate(document: vscode.TextDocument): Promise<void> {
    // Queue message if handshake not complete
    if (!this.isHandshakeComplete) {
      this.pendingMessages.push({
        type: 'DSL_UPDATE',
        payload: { text: document.getText(), uri: document.uri.toString() },
      })
      return
    }

    const payload: DslUpdatePayload = {
      text: document.getText(),
      uri: document.uri.toString(),
      languageId: document.languageId,
    }

    const message = createMessage('DSL_UPDATE', payload)
    await this.options.messageRouter.sendMessage(this.panel, message)
  }

  /**
   * Send state restoration message
   */
  async sendStateRestore(dsl: string, screen: string | null): Promise<void> {
    const payload: StateRestorePayload = {
      dsl,
      screen,
    }

    const message = createMessage('STATE_RESTORE', payload)
    await this.options.messageRouter.sendMessage(this.panel, message)
  }

  /**
   * Send theme sync message
   */
  async sendThemeSync(themeId: string): Promise<void> {
    const payload: ThemeSyncPayload = {
      themeId,
    }

    const message = createMessage('THEME_SYNC', payload)
    await this.options.messageRouter.sendMessage(this.panel, message)
  }

  /**
   * Reveal the panel
   */
  reveal(column?: vscode.ViewColumn): void {
    this.panel.reveal(column, true)
  }

  /**
   * Get the webview HTML content
   */
  private getWebviewHtml(): string {
    const webview = this.panel.webview
    const extensionUri = this.options.extensionContext.extensionUri

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'index.js')
    )
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'index.css')
    )
    const logoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, 'logo.svg')
    )

    // Generate nonce for CSP
    const nonce = this.getNonce()

    return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline' https://cdn.tailwindcss.com; script-src 'nonce-${nonce}' ${webview.cspSource} 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com; img-src ${webview.cspSource} https: data:; font-src ${webview.cspSource};">
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio"></script>
    <script>
      tailwind.config = { 
        darkMode: 'class',
        theme: {
          extend: {}
        }
      };
    </script>
    
    <!-- Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    
    <link href="${styleUri}" rel="stylesheet">
    <title>Proto-Typed Playground</title>
    
    <style>
      /* Variáveis CSS do tema (shadcn dark) */
      :root {
        --background: #0f172a;
        --foreground: #e2e8f0;
        --fg-primary: #e2e8f0;
        --fg-secondary: #94a3b8;
        --card: #1e293b;
        --card-foreground: #e2e8f0;
        --primary: #8b5cf6;
        --primary-foreground: #ffffff;
        --secondary: #475569;
        --secondary-foreground: #f1f5f9;
        --muted: #334155;
        --muted-foreground: #94a3b8;
        --accent: #6366f1;
        --accent-foreground: #ffffff;
        --destructive: #ef4444;
        --destructive-foreground: #ffffff;
        --border: #334155;
        --border-muted: #475569;
        --input: #334155;
        --ring: #8b5cf6;
        --bg-raised: #243049;
        --radius: 0.5rem;
      }
      
      /* Garantir que telas ocultas não apareçam */
      .screen-container {
        width: 100%;
        height: 100%;
      }
    </style>
</head>
<body class="dark">
    <div id="root" data-logo="${logoUri}"></div>
    
    <script nonce="${nonce}">
        // Initialize VS Code API
        const vscode = acquireVsCodeApi();
        window.vscode = vscode;
        
        // Initialize Lucide icons quando disponível
        document.addEventListener('DOMContentLoaded', () => {
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
            
            // Re-initialize quando o DOM mudar (para conteúdo dinâmico)
            const observer = new MutationObserver(() => {
              lucide.createIcons();
            });
            
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
          }
        });
    </script>
    
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`
  }

  private getNonce(): string {
    let text = ''
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  /**
   * Dispose the panel and all resources
   */
  dispose(): void {
    if (this.disposed) {
      return
    }
    this.disposed = true
    // Best-effort dispose of the underlying panel if not already disposed
    try {
      this.panel.dispose()
    } catch {}
    this.disposables.forEach((d) => d.dispose())
    this.disposables = []
    this.onDidDisposeEmitter.dispose()
  }
}
