/**
 * LSP v3.17 Diagnostics Types (Phase 1-4)
 *
 * These types extend the base ProtoError with LSP-compliant
 * range-based positioning and code action support.
 */

/**
 * Position in a text document (0-based)
 */
export interface Position {
  line: number
  character: number
}

/**
 * Range in a text document
 */
export interface Range {
  start: Position
  end: Position
}

/**
 * Diagnostic severity levels (LSP v3.17)
 */
export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4,
}

/**
 * Additional metadata for diagnostics
 */
export interface CodeDescription {
  href: string
}

/**
 * Diagnostic tags (LSP v3.17)
 */
export enum DiagnosticTag {
  Unnecessary = 1,
  Deprecated = 2,
}

/**
 * Related information for diagnostics
 */
export interface DiagnosticRelatedInformation {
  location: {
    uri: string
    range: Range
  }
  message: string
}

/**
 * Code Action types (LSP v3.17)
 */
export type CodeActionKind =
  | 'quickfix'
  | 'refactor'
  | 'refactor.extract'
  | 'refactor.inline'
  | 'refactor.rewrite'
  | 'source'
  | 'source.organizeImports'
  | 'source.fixAll'
  | string

/**
 * Text edit for code actions
 */
export interface TextEdit {
  range: Range
  newText: string
}

/**
 * Workspace edit for code actions
 */
export interface WorkspaceEdit {
  changes?: Record<string, TextEdit[]>
}

/**
 * Command for code actions
 */
export interface Command {
  title: string
  command: string
  arguments?: any[]
}

/**
 * Code action
 */
export interface CodeAction {
  title: string
  kind?: CodeActionKind | string
  diagnostics?: any[]
  isPreferred?: boolean
  disabled?: { reason: string }
  edit?: WorkspaceEdit
  command?: Command
  data?: any
}

/**
 * Diagnostic with LSP support (extends ProtoError)
 */
export interface Diagnostic {
  range?: Range
  severity?: number // 1=Error, 2=Warning, 3=Info, 4=Hint
  code?: string | number
  codeDescription?: CodeDescription
  source?: string
  message: string
  tags?: DiagnosticTag[]
  relatedInformation?: DiagnosticRelatedInformation[]
  data?: any
}
