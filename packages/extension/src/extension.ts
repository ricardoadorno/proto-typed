import * as vscode from 'vscode'
import { parseAndBuildAst, astToHtmlDocument } from '@proto-typed/core'
import { createCompletionProvider } from './language/completion'

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined
  let updateTimeout: ReturnType<typeof setTimeout> | undefined = undefined

  // Register language features
  context.subscriptions.push(createCompletionProvider())

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

    try {
      if (!text.trim()) {
        currentPanel.webview.html = `<!DOCTYPE html>
        <html lang="en" class="dark">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Proto-Typed Preview</title>
        </head>
        <body style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: #e2e8f0; font-family: system-ui;">
            <div style="text-align: center;">
                <h2>Empty Document</h2>
                <p>Start typing to see the preview</p>
            </div>
        </body>
        </html>`
        return
      }

      // Parse AST
      const ast = parseAndBuildAst(text)

      // Render using astToHtmlDocument (generates complete standalone HTML with navigation)
      let htmlDocument = astToHtmlDocument(ast)

      // Debug logging (visible in Extension Host console)
      const timestamp = new Date().toLocaleTimeString()
      console.log('\n🔄 [' + timestamp + '] Preview Updated')
      console.log('   📄 File:', editor.document.fileName.split(/[\\/]/).pop())
      console.log('   📏 HTML size:', htmlDocument.length, 'chars')
      console.log('   ✅ Ready to render')

      // Inject CSP meta tag for webview security
      const cspMetaTag = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' https://cdn.tailwindcss.com; script-src 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com; img-src https: data:; font-src https:;">`
      htmlDocument = htmlDocument.replace('<head>', '<head>\n  ' + cspMetaTag)

      // Inject console log indicator into the webview
      const consoleIndicator = `
      <script>
        console.log('🎨 Webview loaded at ${timestamp}');
        console.log('📱 Proto-Typed Preview Active');
      </script>
      `
      htmlDocument = htmlDocument.replace(
        '</body>',
        consoleIndicator + '\n</body>'
      )

      // Use the complete HTML document with CSP
      currentPanel.webview.html = htmlDocument
    } catch (error) {
      console.error('\n❌ ERROR parsing or rendering:')
      console.error('   ', error)
      console.error('   File:', editor.document.fileName)
      currentPanel.webview.html = `<!DOCTYPE html>
      <html lang="en" class="dark">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error</title>
          <style>
            body { 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              background: #0f172a; 
              color: #e2e8f0; 
              font-family: system-ui;
              padding: 20px;
            }
            pre {
              background: #16171f;
              padding: 12px;
              border-radius: 8px;
              overflow-x: auto;
              max-width: 800px;
            }
          </style>
      </head>
      <body>
          <div>
              <h3 style="color: #ef4444;">Error rendering preview</h3>
              <pre>${String(error)}</pre>
          </div>
      </body>
      </html>`
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
            enableCommandUris: true,
            // Allow loading from CDNs
            enableFindWidget: true,
          }
        )

        currentPanel.onDidDispose(
          () => {
            currentPanel = undefined
          },
          null,
          context.subscriptions
        )

        // Real-time update with debounce (updates while typing)
        vscode.workspace.onDidChangeTextDocument((event) => {
          if (
            event.document.uri.toString() ===
            vscode.window.activeTextEditor?.document.uri.toString()
          ) {
            // Clear previous timeout
            if (updateTimeout) {
              clearTimeout(updateTimeout)
            }

            // Update after 300ms of no typing (debounce)
            updateTimeout = setTimeout(() => {
              console.log('⌨️  Text changed, updating preview...')
              updateWebview()
            }, 300)
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
