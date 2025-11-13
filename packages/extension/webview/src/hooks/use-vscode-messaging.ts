/**
 * VS Code Messaging Hook
 * Encapsulates communication with VS Code extension host
 */

import { useEffect, useCallback, useRef } from 'react'
import type {
  AnyMessage,
  HostToWebviewMessage,
  WebviewToHostMessage,
} from '../messaging/message-types'

// VS Code API type
interface VsCodeApi {
  postMessage(message: WebviewToHostMessage): void
  setState(state: unknown): void
  getState(): unknown
}

declare global {
  interface Window {
    vscode?: VsCodeApi
    acquireVsCodeApi?: () => VsCodeApi
  }
}

// Singleton instance
let vsCodeApiInstance: VsCodeApi | undefined

function getVsCodeApi(): VsCodeApi {
  if (!vsCodeApiInstance) {
    if (window.vscode) {
      vsCodeApiInstance = window.vscode
    } else if (window.acquireVsCodeApi) {
      vsCodeApiInstance = window.acquireVsCodeApi()
    } else {
      throw new Error('VS Code API not available')
    }
  }
  return vsCodeApiInstance
}

type MessageHandler = (message: HostToWebviewMessage) => void

export function useVscodeMessaging() {
  const handlersRef = useRef<Map<string, MessageHandler[]>>(new Map())

  // Setup message listener
  useEffect(() => {
    const messageListener = (event: MessageEvent<AnyMessage>) => {
      const message = event.data

      if (!message || typeof message !== 'object' || !('type' in message)) {
        return
      }

      const handlers = handlersRef.current.get(message.type) || []
      handlers.forEach((handler) => {
        try {
          handler(message as HostToWebviewMessage)
        } catch (error) {
          console.error(`Error handling message ${message.type}:`, error)
        }
      })
    }

    window.addEventListener('message', messageListener)

    return () => {
      window.removeEventListener('message', messageListener)
    }
  }, [])

  // Register a handler for a specific message type
  const onMessage = useCallback(
    (type: string, handler: MessageHandler): (() => void) => {
      const handlers = handlersRef.current.get(type) || []
      handlers.push(handler)
      handlersRef.current.set(type, handlers)

      // Return cleanup function
      return () => {
        const currentHandlers = handlersRef.current.get(type) || []
        const index = currentHandlers.indexOf(handler)
        if (index > -1) {
          currentHandlers.splice(index, 1)
          if (currentHandlers.length === 0) {
            handlersRef.current.delete(type)
          } else {
            handlersRef.current.set(type, currentHandlers)
          }
        }
      }
    },
    []
  )

  // Send a message to the host
  const sendMessage = useCallback((message: WebviewToHostMessage) => {
    try {
      const api = getVsCodeApi()
      api.postMessage(message)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }, [])

  // Persist state
  const setState = useCallback((state: unknown) => {
    try {
      const api = getVsCodeApi()
      api.setState(state)
    } catch (error) {
      console.error('Error setting state:', error)
    }
  }, [])

  // Get persisted state
  const getState = useCallback((): unknown => {
    try {
      const api = getVsCodeApi()
      return api.getState()
    } catch (error) {
      console.error('Error getting state:', error)
      return undefined
    }
  }, [])

  return {
    onMessage,
    sendMessage,
    setState,
    getState,
  }
}
