/**
 * Proto-Typed Extension
 * VS Code extension with webview playground
 */

import * as vscode from 'vscode'
import type { LanguageHost } from '@proto-typed/core/language' with { 'resolution-mode': 'import' }
import type {
  ProtoError,
  AstWithErrors,
} from '@proto-typed/core' with { 'resolution-mode': 'import' }
import { MessageRouter } from './messaging/message-router.js'
import { TextDocumentSynchronizer } from './utils/text-document-synchronizer.js'
import { PlaygroundPanel } from './panels/playground/playground-panel.js'
import { createMessage } from './messaging/message-types.js'
import type {
  RequestExportMessage,
  RequestSetTextMessage,
  LogEventMessage,
  NavigationUpdateMessage,
  RenderCompleteMessage,
} from './messaging/message-types.js'

// Dynamic imports for ESM core package (loaded in activate())
let coreLanguage:
  | typeof import('@proto-typed/core/language', {
      with: { 'resolution-mode': 'import' }
    })
  | null = null
let core:
  | typeof import('@proto-typed/core', {
      with: { 'resolution-mode': 'import' }
    })
  | null = null

let currentPanel: PlaygroundPanel | undefined = undefined
let messageRouter: MessageRouter | undefined = undefined
let synchronizer: TextDocumentSynchronizer | undefined = undefined
interface RenderSnapshot {
  html: string
  screen: string | null
  errors: string[]
  uri?: string
  timestamp: number
}
let lastRenderSnapshot: RenderSnapshot | null = null

function createLanguageHost(): {
  host: LanguageHost
  clear: (uri: string) => void
  dispose: () => void
} {
  if (!core) {
    throw new Error('Core module not loaded')
  }

  const bus = core.ErrorBus.get()
  const errorCache = new Map<string, ProtoError[]>()

  const host: LanguageHost = {
    parse(text: string, uri: string) {
      if (!core) {
        throw new Error('Core module not loaded')
      }

      let ast: unknown = null
      let errors: ProtoError[] = []

      try {
        const parsed = core.parseAndBuildAst(text)
        const astWithErrors = parsed as AstWithErrors
        if (
          '__errors' in astWithErrors &&
          Array.isArray(astWithErrors.__errors)
        ) {
          errors = [...(astWithErrors.__errors as ProtoError[])]
          delete (astWithErrors as Partial<AstWithErrors>).__errors
        }
        ast = parsed
      } catch (error) {
        const message = core.sanitizeErrorMessage(error)
        errors = [
          {
            stage: 'editor',
            severity: 'fatal',
            code: core.ERROR_CODES.EDIT_FATAL_ERROR,
            message,
          },
        ]
        ast = null
      }

      errorCache.set(uri, errors)
      rebuildErrorBus(bus, errorCache)
      return { ast, errors }
    },

    onErrors(uri: string, cb: (errors: ProtoError[]) => void) {
      return bus.subscribe(() => {
        cb(errorCache.get(uri) ?? [])
      })
    },
  }

  return {
    host,
    clear(uri: string) {
      errorCache.delete(uri)
      rebuildErrorBus(bus, errorCache)
    },
    dispose() {
      errorCache.clear()
      bus.clear()
    },
  }
}

function rebuildErrorBus(bus: any, cache: Map<string, ProtoError[]>) {
  bus.clear()
  for (const errors of cache.values()) {
    if (errors.length) {
      bus.bulk(errors)
    }
  }
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('🚀 [Proto-Typed] Extension activating...')

  // Dynamically import ESM core modules
  try {
    coreLanguage = await import('@proto-typed/core/language')
    core = await import('@proto-typed/core')
    console.log('✅ [Proto-Typed] Core modules loaded')
  } catch (error) {
    console.error('❌ [Proto-Typed] Failed to load core modules:', error)
    vscode.window.showErrorMessage('Failed to load Proto-Typed core modules')
    return
  }

  const languageIntegration = createLanguageHost()
  coreLanguage.activateVSCodeAdapter(vscode, context, languageIntegration.host)

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

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((doc) => {
      if (doc.languageId === 'proto-typed') {
        languageIntegration.clear(doc.uri.toString())
      }
    })
  )

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

  // Register test command to expose lastRenderSnapshot (for E2E tests)
  const getLastRenderCommand = vscode.commands.registerCommand(
    'proto-typed.getLastRender',
    () => {
      return lastRenderSnapshot
    }
  )

  context.subscriptions.push(showPreviewCommand)
  context.subscriptions.push(getLastRenderCommand)
  context.subscriptions.push(messageRouter)
  context.subscriptions.push(synchronizer)
  context.subscriptions.push({
    dispose: () => languageIntegration.dispose(),
  })

  console.log('✅ [Proto-Typed] Extension activated')

  return {
    getCurrentPanel: () => currentPanel,
    getRouter: () => messageRouter,
    getLastRenderedHtml: () => lastRenderSnapshot?.html ?? null,
    resetLastRenderedHtml: () => {
      lastRenderSnapshot = null
    },
    disposePanel: () => {
      if (currentPanel) {
        currentPanel.dispose()
        currentPanel = undefined
      }
    },
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

  // Capture render results for snapshot tests
  messageRouter.registerHandler(
    'RENDER_COMPLETE',
    (message: RenderCompleteMessage) => {
      lastRenderSnapshot = {
        html: message.payload.html,
        screen: message.payload.screen,
        errors: message.payload.errors,
        uri: message.payload.uri,
        timestamp: Date.now(),
      }
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
