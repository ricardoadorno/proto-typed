/**
 * Proto-Typed Extension
 * VS Code extension with webview playground
 */

import * as vscode from 'vscode'
import { createCompletionProvider } from './language/completion'
import { MessageRouter } from './messaging/message-router'
import { TextDocumentSynchronizer } from './utils/text-document-synchronizer'
import { PlaygroundPanel } from './panels/playground/playground-panel'
import { createMessage } from './messaging/message-types'
import type {
  RequestExportMessage,
  RequestSetTextMessage,
  LogEventMessage,
  NavigationUpdateMessage,
} from './messaging/message-types'

let currentPanel: PlaygroundPanel | undefined = undefined
let messageRouter: MessageRouter | undefined = undefined
let synchronizer: TextDocumentSynchronizer | undefined = undefined

export function activate(context: vscode.ExtensionContext) {
  console.log('🚀 [Proto-Typed] Extension activating...')

  // Initialize message router
  messageRouter = new MessageRouter({
    logMessages: true,
    telemetry: false,
  })

  // Initialize synchronizer for proto-typed files
  synchronizer = new TextDocumentSynchronizer({
    debounceMs: 300,
    filterLanguageIds: ['proto-typed'],
    logChanges: true,
  })

  // Register language features
  context.subscriptions.push(createCompletionProvider())

  // Register message handlers
  setupMessageHandlers(context)

  // Register command to show preview
  const showPreviewCommand = vscode.commands.registerCommand(
    'proto-typed.showPreview',
    () => {
      const editor = vscode.window.activeTextEditor
      const viewColumn = editor
        ? (editor.viewColumn || 0) + 1
        : vscode.ViewColumn.Two

      if (currentPanel) {
        currentPanel.reveal(viewColumn)
      } else {
        if (!messageRouter || !synchronizer) {
          vscode.window.showErrorMessage('Extension not properly initialized')
          return
        }

        const previousEditor = vscode.window.activeTextEditor

        currentPanel = PlaygroundPanel.create(
          {
            extensionContext: context,
            messageRouter,
            synchronizer,
          },
          viewColumn
        )

        console.log('✅ [Proto-Typed] Playground panel created')

        // Restore focus to previous editor so new files open in the editor column
        if (previousEditor) {
          vscode.window.showTextDocument(
            previousEditor.document,
            previousEditor.viewColumn,
            false
          )
        }

        // Clear reference when user closes the webview to avoid "Webview is disposed"
        currentPanel.onDidDispose(() => {
          currentPanel = undefined
        })
      }
    }
  )

  context.subscriptions.push(showPreviewCommand)
  context.subscriptions.push(messageRouter)
  context.subscriptions.push(synchronizer)

  console.log('✅ [Proto-Typed] Extension activated')

  return {
    getCurrentPanel: () => currentPanel,
    getRouter: () => messageRouter,
  }
}

function setupMessageHandlers(context: vscode.ExtensionContext): void {
  if (!messageRouter || !synchronizer) {
    return
  }

  // Handle export requests
  messageRouter.registerHandler(
    'REQUEST_EXPORT',
    async (message: RequestExportMessage) => {
      const { html, suggestedFileName } = message.payload

      try {
        const uri = await vscode.window.showSaveDialog({
          defaultUri: vscode.Uri.file(suggestedFileName),
          filters: {
            'HTML Files': ['html'],
          },
        })

        if (uri) {
          await vscode.workspace.fs.writeFile(uri, Buffer.from(html, 'utf-8'))
          vscode.window.showInformationMessage(`Exported to ${uri.fsPath}`)
        }
      } catch (error) {
        console.error('❌ Error exporting HTML:', error)
        vscode.window.showErrorMessage(
          `Failed to export: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }
  )

  // Handle text set requests (e.g., from example selection)
  messageRouter.registerHandler(
    'REQUEST_SET_TEXT',
    async (message: RequestSetTextMessage) => {
      const { text, reason } = message.payload

      try {
        const success = await synchronizer!.applyText(text, reason)
        if (!success) {
          vscode.window.showWarningMessage('Failed to update editor text')
        }
      } catch (error) {
        console.error('❌ Error applying text:', error)
      }
    }
  )

  // Handle log events
  messageRouter.registerHandler('LOG_EVENT', (message: LogEventMessage) => {
    const { level, message: logMessage, data } = message.payload

    const prefix = `[Webview] ${logMessage}`
    const dataStr = data ? ` ${JSON.stringify(data)}` : ''

    switch (level) {
      case 'info':
        console.log(`ℹ️  ${prefix}${dataStr}`)
        break
      case 'warn':
        console.warn(`⚠️  ${prefix}${dataStr}`)
        break
      case 'error':
        console.error(`❌ ${prefix}${dataStr}`)
        // Show error to user for critical issues
        if (logMessage.includes('Parse error')) {
          // Don't show every parse error as it would be annoying while typing
          // Just log it
        } else {
          vscode.window.showErrorMessage(`Webview Error: ${logMessage}`)
        }
        break
    }
  })

  // Handle navigation updates (just log for now)
  messageRouter.registerHandler(
    'NAVIGATION_UPDATE',
    (message: NavigationUpdateMessage) => {
      console.log(`🧭 [Navigation] Screen: ${message.payload.screen}`)
    }
  )
}

export function deactivate() {
  console.log('🛑 [Proto-Typed] Extension deactivating...')

  if (currentPanel) {
    currentPanel.dispose()
    currentPanel = undefined
  }

  if (synchronizer) {
    synchronizer.dispose()
    synchronizer = undefined
  }

  if (messageRouter) {
    messageRouter.dispose()
    messageRouter = undefined
  }

  console.log('✅ [Proto-Typed] Extension deactivated')
}
