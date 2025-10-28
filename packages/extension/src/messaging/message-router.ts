/**
 * Message Router
 * Routes and validates messages between host and webview
 */

import * as vscode from 'vscode'
import {
  AnyMessage,
  WebviewToHostMessage,
  HostToWebviewMessage,
  isMessageEnvelope,
  isValidVersion,
  MESSAGE_VERSION,
} from './message-types'

type MessageHandler<T extends WebviewToHostMessage = WebviewToHostMessage> = (
  message: T,
  context: MessageContext
) => void | Promise<void>

export interface MessageContext {
  panel: vscode.WebviewPanel
  document?: vscode.TextDocument
  extensionContext: vscode.ExtensionContext
}

export interface MessageRouterOptions {
  logMessages?: boolean
  telemetry?: boolean
}

/**
 * MessageRouter manages bidirectional communication with webviews
 */
export class MessageRouter {
  private handlers = new Map<string, MessageHandler[]>()
  private messageCount = 0
  private options: MessageRouterOptions

  constructor(options: MessageRouterOptions = {}) {
    this.options = {
      logMessages: true,
      telemetry: false,
      ...options,
    }
  }

  /**
   * Register a handler for a specific message type
   */
  registerHandler<T extends WebviewToHostMessage>(
    type: T['type'],
    handler: MessageHandler<T>
  ): vscode.Disposable {
    const handlers = this.handlers.get(type) || []
    handlers.push(handler as MessageHandler)
    this.handlers.set(type, handlers)

    if (this.options.logMessages) {
      console.log(`📝 [MessageRouter] Registered handler for: ${type}`)
    }

    // Return disposable to unregister
    return {
      dispose: () => {
        const currentHandlers = this.handlers.get(type) || []
        const index = currentHandlers.indexOf(handler as MessageHandler)
        if (index > -1) {
          currentHandlers.splice(index, 1)
          if (currentHandlers.length === 0) {
            this.handlers.delete(type)
          }
        }
      },
    }
  }

  /**
   * Handle incoming message from webview
   */
  async handleMessage(
    message: unknown,
    context: MessageContext
  ): Promise<void> {
    // Validate message structure
    if (!isMessageEnvelope(message)) {
      console.error('❌ [MessageRouter] Invalid message structure:', message)
      return
    }

    // Validate version
    if (!isValidVersion(message)) {
      console.error(
        `❌ [MessageRouter] Version mismatch. Expected ${MESSAGE_VERSION}, got ${message.version}`
      )
      return
    }

    this.messageCount++

    if (this.options.logMessages) {
      const timestamp = new Date(message.timestamp).toLocaleTimeString()
      console.log(
        `📨 [${timestamp}] ${message.type}${message.requestId ? ` (${message.requestId})` : ''}`
      )
    }

    // Route to handlers
    const handlers = this.handlers.get(message.type)
    if (!handlers || handlers.length === 0) {
      if (this.options.logMessages) {
        console.warn(`⚠️  [MessageRouter] No handlers for: ${message.type}`)
      }
      return
    }

    // Execute all handlers
    const promises = handlers.map((handler) =>
      Promise.resolve(handler(message as WebviewToHostMessage, context))
    )

    try {
      await Promise.all(promises)
    } catch (error) {
      console.error(`❌ [MessageRouter] Error handling ${message.type}:`, error)
    }
  }

  /**
   * Send message to webview
   */
  async sendMessage(
    panel: vscode.WebviewPanel,
    message: HostToWebviewMessage
  ): Promise<boolean> {
    try {
      const success = await panel.webview.postMessage(message)

      if (this.options.logMessages) {
        const timestamp = new Date(message.timestamp).toLocaleTimeString()
        const status = success ? '✅' : '❌'
        console.log(
          `${status} [${timestamp}] Sent: ${message.type}${message.requestId ? ` (${message.requestId})` : ''}`
        )
      }

      return success
    } catch (error) {
      console.error(`❌ [MessageRouter] Error sending ${message.type}:`, error)
      return false
    }
  }

  /**
   * Get telemetry stats
   */
  getStats() {
    return {
      totalMessages: this.messageCount,
      registeredHandlers: Array.from(this.handlers.keys()),
      handlerCounts: Object.fromEntries(
        Array.from(this.handlers.entries()).map(([type, handlers]) => [
          type,
          handlers.length,
        ])
      ),
    }
  }

  /**
   * Reset stats (useful for tests)
   */
  resetStats() {
    this.messageCount = 0
  }

  /**
   * Dispose all handlers
   */
  dispose() {
    this.handlers.clear()
    if (this.options.logMessages) {
      console.log('🗑️  [MessageRouter] Disposed')
    }
  }
}

/**
 * Global router instance (can be replaced with dependency injection)
 */
let globalRouter: MessageRouter | undefined

export function getGlobalRouter(): MessageRouter {
  if (!globalRouter) {
    globalRouter = new MessageRouter()
  }
  return globalRouter
}

export function setGlobalRouter(router: MessageRouter): void {
  globalRouter = router
}
