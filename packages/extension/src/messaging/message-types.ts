/**
 * Message Protocol for Host ↔ Webview Communication
 * Version 1 - Initial implementation
 */

export const MESSAGE_VERSION = 1 as const

/**
 * Base envelope for all messages
 */
export interface MessageEnvelope<Type extends string, Payload> {
  type: Type
  version: typeof MESSAGE_VERSION
  timestamp: number
  payload: Payload
  requestId?: string // For correlating responses (ACK/NACK)
}

/**
 * Host → Webview Events
 */

// Update DSL content from editor
export interface DslUpdatePayload {
  text: string
  uri: string
  languageId: string
}
export type DslUpdateMessage = MessageEnvelope<'DSL_UPDATE', DslUpdatePayload>

// Restore previous state
export interface StateRestorePayload {
  dsl: string
  screen: string | null
}
export type StateRestoreMessage = MessageEnvelope<
  'STATE_RESTORE',
  StateRestorePayload
>

// Sync theme from VS Code
export interface ThemeSyncPayload {
  themeId: string
}
export type ThemeSyncMessage = MessageEnvelope<'THEME_SYNC', ThemeSyncPayload>

// Handshake initialization from host
export interface HandshakeInitPayload {
  sessionId: string
}
export type HandshakeInitMessage = MessageEnvelope<
  'HANDSHAKE_INIT',
  HandshakeInitPayload
>

/**
 * Webview → Host Events
 */

// Request HTML export
export interface RequestExportPayload {
  html: string
  suggestedFileName: string
}
export type RequestExportMessage = MessageEnvelope<
  'REQUEST_EXPORT',
  RequestExportPayload
>

// Request to set text in editor
export interface RequestSetTextPayload {
  text: string
  reason: 'example-select' | 'restore'
}
export type RequestSetTextMessage = MessageEnvelope<
  'REQUEST_SET_TEXT',
  RequestSetTextPayload
>

// Log events for debugging
export interface LogEventPayload {
  level: 'info' | 'warn' | 'error'
  message: string
  data?: unknown
}
export type LogEventMessage = MessageEnvelope<'LOG_EVENT', LogEventPayload>

// Navigation update
export interface NavigationUpdatePayload {
  screen: string
}
export type NavigationUpdateMessage = MessageEnvelope<
  'NAVIGATION_UPDATE',
  NavigationUpdatePayload
>

// Handshake acknowledgment from webview
export interface HandshakeAckPayload {
  sessionId: string
  capabilities: string[]
}
export type HandshakeAckMessage = MessageEnvelope<
  'HANDSHAKE_ACK',
  HandshakeAckPayload
>

// Render complete notification (used for testing/snapshots)
export interface RenderCompletePayload {
  html: string
  screen: string | null
  errors: string[]
  uri?: string
  metadata?: unknown
}
export type RenderCompleteMessage = MessageEnvelope<
  'RENDER_COMPLETE',
  RenderCompletePayload
>

// Generic acknowledgment
export interface AckPayload {
  requestId: string
  success: boolean
  message?: string
}
export type AckMessage = MessageEnvelope<'ACK', AckPayload>

/**
 * Union types for all messages
 */
export type HostToWebviewMessage =
  | DslUpdateMessage
  | StateRestoreMessage
  | ThemeSyncMessage
  | HandshakeInitMessage

export type WebviewToHostMessage =
  | RequestExportMessage
  | RequestSetTextMessage
  | LogEventMessage
  | NavigationUpdateMessage
  | HandshakeAckMessage
  | RenderCompleteMessage
  | AckMessage

export type AnyMessage = HostToWebviewMessage | WebviewToHostMessage

/**
 * Type guards
 */
export function isMessageEnvelope(data: unknown): data is AnyMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    'version' in data &&
    'timestamp' in data &&
    'payload' in data
  )
}

export function isValidVersion(message: AnyMessage): boolean {
  return message.version === MESSAGE_VERSION
}

/**
 * Message factory helpers
 */
export function createMessage<Type extends string, Payload>(
  type: Type,
  payload: Payload,
  requestId?: string
): MessageEnvelope<Type, Payload> {
  return {
    type,
    version: MESSAGE_VERSION,
    timestamp: Date.now(),
    payload,
    requestId,
  }
}
