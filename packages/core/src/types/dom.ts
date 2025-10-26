/**
 * DOM Event Types
 * Custom type definitions for DOM events to avoid React dependency in core
 */

/**
 * Mouse Event type - Compatible with React.MouseEvent and DOM MouseEvent
 * Contains all common properties needed for click handling
 */
export interface MouseEvent<T = Element> {
  target: EventTarget | null
  currentTarget: EventTarget & T
  preventDefault(): void
  stopPropagation(): void
  button: number
  buttons: number
  clientX: number
  clientY: number
  pageX: number
  pageY: number
  screenX: number
  screenY: number
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  detail: number
  type: string
  bubbles: boolean
  cancelable: boolean
  timeStamp: number
  defaultPrevented: boolean
  isTrusted: boolean
}
