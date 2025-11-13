/**
 * LSP-Aligned Diagnostic Types
 *
 * These types align with the Language Server Protocol (LSP) v3.17 specification
 * for diagnostics, while maintaining compatibility with our existing ProtoError system.
 *
 * @see https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#diagnostic
 */

// ============================================================
// LSP Core Types
// ============================================================

/**
 * Position in a text document expressed as zero-based line and character offset.
 * A position is between two characters like an 'insert' cursor in an editor.
 *
 * LSP Spec: 0-based indexing (line 0, character 0 is document start)
 */
export interface Position {
  /**
   * Line position in a document (zero-based).
   */
  line: number

  /**
   * Character offset on a line in a document (zero-based).
   * Assuming that the line is represented as a string, the `character` value
   * represents the gap between the `character` and `character + 1`.
   *
   * If the character value is greater than the line length it defaults back
   * to the line length.
   */
  character: number
}

/**
 * A range in a text document expressed as (zero-based) start and end positions.
 * A range is comparable to a selection in an editor. Therefore the end position is exclusive.
 */
export interface Range {
  /**
   * The range's start position.
   */
  start: Position

  /**
   * The range's end position.
   */
  end: Position
}

/**
 * Diagnostic severity as defined by LSP.
 */
export enum DiagnosticSeverity {
  /**
   * Reports an error.
   */
  Error = 1,

  /**
   * Reports a warning.
   */
  Warning = 2,

  /**
   * Reports an information.
   */
  Information = 3,

  /**
   * Reports a hint.
   */
  Hint = 4
}

/**
 * Diagnostic tag to annotate a diagnostic.
 * Added in LSP 3.15.0
 */
export enum DiagnosticTag {
  /**
   * Unused or unnecessary code.
   * Clients are allowed to render diagnostics with this tag faded out
   * or with a special decoration.
   */
  Unnecessary = 1,

  /**
   * Deprecated or obsolete code.
   * Clients are allowed to render diagnostics with this tag strike through.
   */
  Deprecated = 2
}

/**
 * Structure to capture a description for an error code.
 * Added in LSP 3.16.0
 */
export interface CodeDescription {
  /**
   * A URI to open with more information about the diagnostic error.
   */
  href: string
}

/**
 * Represents a location inside a resource, such as a line inside a text file.
 */
export interface Location {
  /**
   * Resource identifier (file path or virtual URI).
   * Optional for same-file references.
   */
  uri?: string

  /**
   * The range inside the resource.
   */
  range: Range
}

/**
 * Represents a related message and source code location for a diagnostic.
 * This should be used to point to code locations that cause or are related
 * to a diagnostics, e.g when duplicating a symbol in a scope.
 *
 * Added in LSP 3.7.0
 */
export interface DiagnosticRelatedInformation {
  /**
   * The location of this related diagnostic information.
   */
  location: Location

  /**
   * The message of this related diagnostic information.
   */
  message: string
}

/**
 * LSP-compliant Diagnostic structure.
 *
 * Represents a diagnostic, such as a compiler error or warning.
 * Diagnostic objects are only valid in the scope of a resource.
 */
export interface Diagnostic {
  /**
   * The range at which the message applies.
   */
  range: Range

  /**
   * The diagnostic's severity. Can be omitted. If omitted it is up to the
   * client to interpret diagnostics as error, warning, info or hint.
   */
  severity?: DiagnosticSeverity

  /**
   * The diagnostic's code, which might appear in the user interface.
   */
  code?: string | number

  /**
   * An optional property to describe the error code.
   *
   * @since 3.16.0
   */
  codeDescription?: CodeDescription

  /**
   * A human-readable string describing the source of this diagnostic,
   * e.g. 'typescript' or 'super lint'.
   */
  source?: string

  /**
   * The diagnostic's message.
   */
  message: string

  /**
   * Additional metadata about the diagnostic.
   *
   * @since 3.15.0
   */
  tags?: DiagnosticTag[]

  /**
   * An array of related diagnostic information, e.g. when symbol-names within
   * a scope collide all definitions can be marked via this property.
   *
   * @since 3.7.0
   */
  relatedInformation?: DiagnosticRelatedInformation[]

  /**
   * A data entry field that is preserved between a
   * `textDocument/publishDiagnostics` notification and
   * `textDocument/codeAction` request.
   *
   * Used to pass additional context for code actions.
   *
   * @since 3.16.0
   */
  data?: unknown
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Create a Position object
 */
export function createPosition(line: number, character: number): Position {
  return { line, character }
}

/**
 * Create a Range object
 */
export function createRange(
  startLine: number,
  startCharacter: number,
  endLine: number,
  endCharacter: number
): Range {
  return {
    start: createPosition(startLine, startCharacter),
    end: createPosition(endLine, endCharacter)
  }
}

/**
 * Create a Range from a start position and length
 */
export function createRangeFromLength(
  line: number,
  character: number,
  length: number
): Range {
  return {
    start: createPosition(line, character),
    end: createPosition(line, character + length)
  }
}

/**
 * Convert 1-based line/column to 0-based Position
 * (Monaco uses 1-based, LSP uses 0-based)
 */
export function toZeroBased(line: number, column: number): Position {
  return createPosition(
    Math.max(0, line - 1),
    Math.max(0, column - 1)
  )
}

/**
 * Convert 0-based Position to 1-based line/column
 * (LSP uses 0-based, Monaco uses 1-based)
 */
export function toOneBased(position: Position): { line: number; column: number } {
  return {
    line: position.line + 1,
    column: position.character + 1
  }
}

/**
 * Check if a position is inside a range
 */
export function isPositionInRange(position: Position, range: Range): boolean {
  if (position.line < range.start.line || position.line > range.end.line) {
    return false
  }

  if (position.line === range.start.line && position.character < range.start.character) {
    return false
  }

  if (position.line === range.end.line && position.character > range.end.character) {
    return false
  }

  return true
}

/**
 * Check if two ranges overlap
 */
export function rangesOverlap(a: Range, b: Range): boolean {
  return (
    isPositionInRange(a.start, b) ||
    isPositionInRange(a.end, b) ||
    isPositionInRange(b.start, a) ||
    isPositionInRange(b.end, a)
  )
}

/**
 * Compare two positions
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export function comparePositions(a: Position, b: Position): number {
  if (a.line < b.line) return -1
  if (a.line > b.line) return 1
  if (a.character < b.character) return -1
  if (a.character > b.character) return 1
  return 0
}

/**
 * Compare two ranges by their start position
 */
export function compareRanges(a: Range, b: Range): number {
  const startCompare = comparePositions(a.start, b.start)
  if (startCompare !== 0) return startCompare
  return comparePositions(a.end, b.end)
}
