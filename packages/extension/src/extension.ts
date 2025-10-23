import * as vscode from 'vscode'
import {
  parseAndBuildAst,
  astToHtmlStringPreview,
  RouteManager,
  createRouteManagerGateway,
} from '@proto-typed/core'
import { getWebviewContent } from './getWebviewContent'

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined

  // Logo URI que será reutilizado
  const logoPath = vscode.Uri.joinPath(context.extensionUri, 'logo.svg')

  // Route manager para gerenciar navegação (como no useParse)
  const routeManager = new RouteManager()
  const routeManagerGateway = createRouteManagerGateway(routeManager)
  let currentScreen: string | undefined = undefined

  function updateWebview() {
    if (!currentPanel) {
      return
    }

    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }

    const document = editor.document
    const text = document.getText()

    // Converte o URI do logo para uso no webview
    const logoUri = currentPanel.webview.asWebviewUri(logoPath)

    try {
      if (!text.trim()) {
        currentPanel.webview.html = getWebviewContent('', logoUri.toString())
        return
      }

      // Parse AST (como no useParse)
      const ast = parseAndBuildAst(text)

      // Initialize routes
      routeManagerGateway.initialize(ast)
      const metadata = routeManagerGateway.getRouteMetadata()

      // Determine current screen
      if (!currentScreen && metadata.defaultScreen) {
        currentScreen = metadata.defaultScreen
      }

      // Render usando astToHtmlStringPreview (como a web app)
      const renderResult = astToHtmlStringPreview(
        ast,
        { currentScreen },
        routeManager
      )

      currentPanel.webview.html = getWebviewContent(
        renderResult.html,
        logoUri.toString()
      )
    } catch (error) {
      console.error('Error parsing or rendering DSL:', error)
      const errorHtml = `<div style="padding: 20px; color: #ef4444;">
        <h3>Error rendering preview</h3>
        <pre style="background: #16171f; padding: 12px; border-radius: 8px; overflow-x: auto;">${String(error)}</pre>
      </div>`
      currentPanel.webview.html = getWebviewContent(
        errorHtml,
        logoUri.toString()
      )
    }
  }

  const disposable = vscode.commands.registerCommand(
    'proto-typed.showPreview',
    () => {
      const editor = vscode.window.activeTextEditor

      // Abre o preview ao lado do editor ativo
      const viewColumn = editor
        ? (editor.viewColumn || 0) + 1
        : vscode.ViewColumn.Two

      if (currentPanel) {
        currentPanel.reveal(viewColumn)
      } else {
        currentPanel = vscode.window.createWebviewPanel(
          'protoTypedPreview',
          'Proto-Typed Preview',
          viewColumn,
          {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [context.extensionUri],
          }
        )

        currentPanel.onDidDispose(
          () => {
            currentPanel = undefined
          },
          null,
          context.subscriptions
        )

        vscode.workspace.onDidChangeTextDocument((event) => {
          if (
            event.document.uri.toString() ===
            vscode.window.activeTextEditor?.document.uri.toString()
          ) {
            updateWebview()
          }
        })

        vscode.window.onDidChangeActiveTextEditor((editor) => {
          if (editor) {
            updateWebview()
          }
        })
      }
      updateWebview()
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}
