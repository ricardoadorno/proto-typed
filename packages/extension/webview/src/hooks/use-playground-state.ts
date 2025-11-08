/**
 * Playground State Hook
 * Manages DSL parsing, metadata, and state synchronization
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  parseAndBuildAst,
  astToHtmlStringPreview,
  astToHtmlDocument,
  createRouteManagerGateway,
  RouteManager,
  type RouteMetadata,
  type AstNode,
} from '@proto-typed/core'
import { useVscodeMessaging } from './use-vscode-messaging'
import { createMessage } from '../messaging/message-types'
import type {
  DslUpdateMessage,
  HandshakeInitMessage,
  StateRestoreMessage,
} from '../messaging/message-types'

export interface PlaygroundState {
  dsl: string
  html: string
  metadata: RouteMetadata | null
  currentScreen: string | null
  errors: string[]
  isLoading: boolean
}

export function usePlaygroundState() {
  const { onMessage, sendMessage, setState, getState } = useVscodeMessaging()

  // Create route manager instances (similar to web playground)
  const localRouteManager = useMemo(() => new RouteManager(), [])
  const routeManagerGateway = useMemo(
    () => createRouteManagerGateway(localRouteManager),
    [localRouteManager]
  )

  const [state, setStateLocal] = useState<PlaygroundState>({
    dsl: '',
    html: '',
    metadata: null,
    currentScreen: null,
    errors: [],
    isLoading: false,
  })

  const parseTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const lastDslRef = useRef<string>('')
  const astRef = useRef<AstNode | AstNode[]>([])
  const activeUriRef = useRef<string | null>(null)

  // Parse DSL and update state
  const handleParse = useCallback(
    (text: string, targetScreen?: string | null) => {
      if (text === lastDslRef.current && !targetScreen) {
        return // Skip if DSL hasn't changed
      }

      lastDslRef.current = text

      // Clear any pending parse
      if (parseTimeoutRef.current) {
        clearTimeout(parseTimeoutRef.current)
      }

      // Use requestIdleCallback if available, otherwise setTimeout
      const scheduleWork = (callback: () => void) => {
        if ('requestIdleCallback' in window) {
          ;(window as any).requestIdleCallback(callback, { timeout: 100 })
        } else {
          setTimeout(callback, 0)
        }
      }

      setStateLocal((prev) => ({ ...prev, isLoading: true, errors: [] }))

      scheduleWork(() => {
        try {
          // Normalize indentation and newlines so parser behaves consistently across environments
          const normalizedText = text
            .replace(/\r\n?/g, '\n') // CRLF -> LF
            .replace(/\t/g, '  ') // tabs -> 2 spaces
            .replace(/\u00A0/g, ' ') // NBSP -> space

          if (!normalizedText.trim()) {
            const emptyState: PlaygroundState = {
              dsl: normalizedText,
              html: '',
              metadata: {
                screens: [],
                components: [],
                modals: [],
                drawers: [],
                defaultScreen: undefined,
                currentScreen: undefined,
                totalRoutes: 0,
                navigationHistory: [],
                currentHistoryIndex: -1,
                canNavigateBack: false,
              },
              currentScreen: null,
              errors: [],
              isLoading: false,
            }
            setStateLocal(emptyState)
            routeManagerGateway.initialize([] as AstNode[])
            routeManagerGateway.resetNavigation()
            sendMessage(
              createMessage('RENDER_COMPLETE', {
                html: '',
                screen: null,
                errors: [],
                uri: activeUriRef.current ?? undefined,
                metadata: emptyState.metadata,
              })
            )
            return
          }

          // Parse AST
          const ast = parseAndBuildAst(normalizedText)
          astRef.current = ast

          // Initialize routes to get metadata
          routeManagerGateway.initialize(ast)
          const newMetadata = routeManagerGateway.getRouteMetadata()

          // Determine current screen
          let newCurrentScreen: string | null
          if (targetScreen) {
            newCurrentScreen = targetScreen
          } else if (newMetadata.screens.length === 0) {
            newCurrentScreen = null
          } else if (state.currentScreen) {
            const screenExists = newMetadata.screens.some(
              (screen) => screen.name === state.currentScreen
            )
            newCurrentScreen = screenExists
              ? state.currentScreen
              : newMetadata.defaultScreen || null
          } else {
            newCurrentScreen = newMetadata.defaultScreen || null
          }

          // Render HTML
          const result = astToHtmlStringPreview(
            ast,
            { currentScreen: newCurrentScreen || undefined },
            localRouteManager
          )

          const newState: PlaygroundState = {
            dsl: normalizedText,
            html: result.html,
            metadata: newMetadata,
            currentScreen: newCurrentScreen,
            errors: result.errors?.map((e) => e.message) || [],
            isLoading: false,
          }

          setStateLocal(newState)
          sendMessage(
            createMessage('RENDER_COMPLETE', {
              html: result.html,
              screen: newState.currentScreen,
              errors: newState.errors,
              uri: activeUriRef.current ?? undefined,
              metadata: newState.metadata,
            })
          )

          // Persist state
          setState({
            dsl: normalizedText,
            screen: newCurrentScreen,
          })

          // Log success
          sendMessage(
            createMessage('LOG_EVENT', {
              level: 'info',
              message: 'Parse successful',
              data: {
                screens: newMetadata.screens.length,
                currentScreen: newCurrentScreen,
              },
            })
          )
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error)

          setStateLocal((prev) => ({
            ...prev,
            errors: [errorMessage],
            isLoading: false,
          }))

          // Log error
          sendMessage(
            createMessage('LOG_EVENT', {
              level: 'error',
              message: 'Parse error',
              data: { error: errorMessage },
            })
          )
          sendMessage(
            createMessage('RENDER_COMPLETE', {
              html: '',
              screen: state.currentScreen,
              errors: [errorMessage],
              uri: activeUriRef.current ?? undefined,
            })
          )
        }
      })
    },
    [
      sendMessage,
      setState,
      routeManagerGateway,
      localRouteManager,
      state.currentScreen,
    ]
  )

  // Navigate to a specific screen
  const navigateToScreen = useCallback(
    (screenName: string) => {
      if (state.dsl) {
        handleParse(state.dsl, screenName)

        // Notify host
        sendMessage(
          createMessage('NAVIGATION_UPDATE', {
            screen: screenName,
          })
        )
      }
    },
    [state.dsl, handleParse, sendMessage]
  )

  // Export HTML
  const exportHtml = useCallback(() => {
    if (!astRef.current) {
      return
    }

    // Use astToHtmlDocument for full standalone HTML with Tailwind CDN
    const fullHtml = astToHtmlDocument(astRef.current, {
      currentScreen: state.currentScreen || undefined,
      isDarkMode: true,
    })

    const fileName = `proto-typed-${Date.now()}.html`
    sendMessage(
      createMessage('REQUEST_EXPORT', {
        html: fullHtml,
        suggestedFileName: fileName,
      })
    )
  }, [state.currentScreen, sendMessage])

  // Handle handshake
  useEffect(() => {
    const cleanup = onMessage(
      'HANDSHAKE_INIT',
      (message: HandshakeInitMessage) => {
        console.log('🤝 Handshake received:', message.payload.sessionId)

        // Send acknowledgment
        sendMessage(
          createMessage('HANDSHAKE_ACK', {
            sessionId: message.payload.sessionId,
            capabilities: ['parse', 'navigate', 'export'],
          })
        )

        // Try to restore previous state
        const savedState = getState() as
          | { dsl?: string; screen?: string }
          | undefined
        if (savedState?.dsl) {
          handleParse(savedState.dsl, savedState.screen || null)
        }
      }
    )

    return cleanup
  }, [onMessage, sendMessage, getState, handleParse])

  // Handle DSL updates from host
  useEffect(() => {
    const cleanup = onMessage('DSL_UPDATE', (message: DslUpdateMessage) => {
      const { text, uri } = message.payload
      activeUriRef.current = uri
      handleParse(text)
    })

    return cleanup
  }, [onMessage, handleParse])

  // Handle state restoration
  useEffect(() => {
    const cleanup = onMessage(
      'STATE_RESTORE',
      (message: StateRestoreMessage) => {
        const { dsl, screen } = message.payload
        handleParse(dsl, screen)
      }
    )

    return cleanup
  }, [onMessage, handleParse])

  return {
    ...state,
    navigateToScreen,
    exportHtml,
  }
}
