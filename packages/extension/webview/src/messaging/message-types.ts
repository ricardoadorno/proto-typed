/**
 * Message types for webview (mirrored from host)
 * This file should be kept in sync with packages/extension/src/messaging/message-types.ts
 */

export const MESSAGE_VERSION = 1 as const

export interface MessageEnvelope<Type extends string, Payload> {
  type: Type
  version: typeof MESSAGE_VERSION
  timestamp: number
  payload: Payload
  requestId?: string
}

// Host → Webview Messages
export interface DslUpdatePayload {
  text: string
  uri: string
  languageId: string
}
export type DslUpdateMessage = MessageEnvelope<'DSL_UPDATE', DslUpdatePayload>

export interface StateRestorePayload {
  dsl: string
  screen: string | null
}
export type StateRestoreMessage = MessageEnvelope<
  'STATE_RESTORE',
  StateRestorePayload
>

export interface ThemeSyncPayload {
  themeId: string
}
export type ThemeSyncMessage = MessageEnvelope<'THEME_SYNC', ThemeSyncPayload>

export interface HandshakeInitPayload {
  sessionId: string
}
export type HandshakeInitMessage = MessageEnvelope<
  'HANDSHAKE_INIT',
  HandshakeInitPayload
>

// Webview → Host Messages
export interface RequestExportPayload {
  html: string
  suggestedFileName: string
}
export type RequestExportMessage = MessageEnvelope<
  'REQUEST_EXPORT',
  RequestExportPayload
>

export interface RequestSetTextPayload {
  text: string
  reason: 'example-select' | 'restore'
}
export type RequestSetTextMessage = MessageEnvelope<
  'REQUEST_SET_TEXT',
  RequestSetTextPayload
>

export interface LogEventPayload {
  level: 'info' | 'warn' | 'error'
  message: string
  data?: unknown
}
export type LogEventMessage = MessageEnvelope<'LOG_EVENT', LogEventPayload>

export interface NavigationUpdatePayload {
  screen: string
}
export type NavigationUpdateMessage = MessageEnvelope<
  'NAVIGATION_UPDATE',
  NavigationUpdatePayload
>

export interface HandshakeAckPayload {
  sessionId: string
  capabilities: string[]
}
export type HandshakeAckMessage = MessageEnvelope<
  'HANDSHAKE_ACK',
  HandshakeAckPayload
>

export interface AckPayload {
  requestId: string
  success: boolean
  message?: string
}
export type AckMessage = MessageEnvelope<'ACK', AckPayload>

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
  | AckMessage

export type AnyMessage = HostToWebviewMessage | WebviewToHostMessage

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
