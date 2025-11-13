/**
 * Diagnostic Factory - Create LSP-compliant diagnostics
 *
 * This module provides convenient factory functions for creating ProtoError
 * diagnostics that are both backward-compatible (old `line`/`column` format)
 * and forward-compatible (new LSP `range` format).
 *
 * **Usage**:
 * ```typescript
 * import { createDiagnostic } from '@/core/diagnostics'
 *
 * const diagnostic = createDiagnostic({
 *   code: 'PT-LINT-1001',
 *   severity: 'error',
 *   message: 'Component "Foo" is not defined',
 *   range: createRange(4, 2, 4, 6)  // 0-based
 * })
 * ```
 */

import type { ProtoError, Severity, Stage } from '../../types/errors'
import type { Range, DiagnosticTag, DiagnosticRelatedInformation } from '../../types/diagnostics'
import { createRange, toOneBased } from '../../types/diagnostics'
import { getErrorInfo } from './error-registry'

// ============================================================
// Factory Functions
// ============================================================

export interface CreateDiagnosticOptions {
  // Required fields
  code: string
  severity: Severity
  message: string

  // Position (provide either range OR line/column)
  range?: Range
  line?: number  // 1-based (legacy format)
  column?: number  // 1-based (legacy format)
  length?: number  // Length in characters

  // Stage/Source
  stage?: Stage
  source?: string  // Overrides auto-generated source from stage

  // Additional context
  hint?: string
  nodeId?: string
  sourceSnippet?: string

  // LSP-specific
  tags?: DiagnosticTag[]
  relatedInformation?: DiagnosticRelatedInformation[]
  data?: unknown

  // Auto-populate from registry
  includeDocumentation?: boolean  // Default: true
}

/**
 * Create a diagnostic with both legacy and LSP-compliant fields
 *
 * This factory function:
 * 1. Accepts either old format (line/column) or new format (range)
 * 2. Populates BOTH formats for backward compatibility
 * 3. Auto-generates source from stage
 * 4. Auto-adds codeDescription from ERROR_REGISTRY
 * 5. Returns a fully-formed ProtoError
 */
export function createDiagnostic(options: CreateDiagnosticOptions): ProtoError {
  const {
    code,
    severity,
    message,
    range,
    line,
    column,
    length,
    stage,
    source,
    hint,
    nodeId,
    sourceSnippet,
    tags,
    relatedInformation,
    data,
    includeDocumentation = true
  } = options

  // Infer stage from code if not provided
  const inferredStage = stage || inferStageFromCode(code)

  // Generate source from stage
  const generatedSource = source || generateSource(inferredStage, code)

  // Build base diagnostic
  const diagnostic: ProtoError = {
    stage: inferredStage,
    code,
    severity,
    message,
    source: generatedSource
  } as ProtoError

  // ========================================
  // Handle Position (dual format support)
  // ========================================

  if (range) {
    // New format provided: range → also populate legacy fields
    diagnostic.range = range
    const oneBasedStart = toOneBased(range.start)
    diagnostic.line = oneBasedStart.line
    diagnostic.column = oneBasedStart.column
    diagnostic.length = range.end.character - range.start.character
  } else if (line !== undefined && column !== undefined) {
    // Legacy format provided: line/column → also create range
    diagnostic.line = line
    diagnostic.column = column
    diagnostic.length = length

    // Convert to 0-based range
    const zeroBasedLine = line - 1
    const zeroBasedCol = column - 1
    const rangeLength = length || 1

    diagnostic.range = createRange(
      zeroBasedLine,
      zeroBasedCol,
      zeroBasedLine,
      zeroBasedCol + rangeLength
    )
  }

  // ========================================
  // Add Optional Fields
  // ========================================

  if (hint) diagnostic.hint = hint
  if (nodeId) diagnostic.nodeId = nodeId
  if (sourceSnippet) diagnostic.sourceSnippet = sourceSnippet
  if (tags && tags.length > 0) diagnostic.tags = tags
  if (relatedInformation && relatedInformation.length > 0) {
    diagnostic.relatedInformation = relatedInformation
  }
  if (data !== undefined) diagnostic.data = data

  // ========================================
  // Auto-populate Documentation URL
  // ========================================

  if (includeDocumentation) {
    const errorInfo = getErrorInfo(code)
    if (errorInfo) {
      diagnostic.codeDescription = {
        href: errorInfo.url
      }

      // If no hint was provided, try to use first fix from registry
      if (!hint && errorInfo.fixes && errorInfo.fixes.length > 0) {
        diagnostic.hint = errorInfo.fixes[0]
      }
    }
  }

  return diagnostic
}

/**
 * Create a diagnostic from legacy format (line, column, length)
 *
 * Convenience wrapper for creating diagnostics with old-style position data.
 */
export function createLegacyDiagnostic(
  code: string,
  severity: Severity,
  message: string,
  line: number,
  column: number,
  length?: number,
  hint?: string
): ProtoError {
  return createDiagnostic({
    code,
    severity,
    message,
    line,
    column,
    length,
    hint
  })
}

/**
 * Create a diagnostic from range (LSP format)
 *
 * Convenience wrapper for creating diagnostics with new-style range data.
 */
export function createRangeDiagnostic(
  code: string,
  severity: Severity,
  message: string,
  range: Range,
  hint?: string
): ProtoError {
  return createDiagnostic({
    code,
    severity,
    message,
    range,
    hint
  })
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Infer stage from error code prefix
 *
 * Examples:
 * - PT-LEX-1001 → 'lexer'
 * - PT-PARSE-2001 → 'parser'
 * - PT-LINT-3001 → 'editor' (linter is part of editor stage)
 */
function inferStageFromCode(code: string): Stage {
  const upper = code.toUpperCase()

  if (upper.includes('LEX')) return 'lexer'
  if (upper.includes('PARSE')) return 'parser'
  if (upper.includes('BLD')) return 'builder'
  if (upper.includes('REND')) return 'renderer'
  if (upper.includes('LINT') || upper.includes('EDIT')) return 'editor'

  // Default to editor for unknown codes
  return 'editor'
}

/**
 * Generate source field from stage and code
 *
 * Examples:
 * - 'lexer' + 'PT-LEX-1001' → 'proto-typed-lexer'
 * - 'editor' + 'PT-LINT-2001' → 'proto-typed-lint'
 */
function generateSource(stage: Stage, code: string): string {
  // Special case: linter codes get their own source
  if (code.includes('LINT')) {
    return 'proto-typed-lint'
  }

  // Map stage to source
  switch (stage) {
    case 'lexer':
      return 'proto-typed-lexer'
    case 'parser':
      return 'proto-typed-parser'
    case 'builder':
      return 'proto-typed-builder'
    case 'renderer':
      return 'proto-typed-renderer'
    case 'editor':
      return 'proto-typed-editor'
    default:
      return 'proto-typed'
  }
}

// ============================================================
// Batch Creation
// ============================================================

/**
 * Create multiple diagnostics at once
 *
 * Useful when you have a batch of errors to create with similar structure.
 */
export function createDiagnostics(
  options: CreateDiagnosticOptions[]
): ProtoError[] {
  return options.map(opt => createDiagnostic(opt))
}

/**
 * Enhance an existing ProtoError with LSP fields
 *
 * Takes a legacy-format ProtoError and adds the new LSP fields.
 * Useful for migrating existing error creation code.
 */
export function enhanceDiagnostic(error: ProtoError): ProtoError {
  // If already has range, nothing to do
  if (error.range) {
    return error
  }

  // Create range from legacy fields
  if (error.line !== undefined && error.column !== undefined) {
    const zeroBasedLine = error.line - 1
    const zeroBasedCol = error.column - 1
    const length = error.length || 1

    error.range = createRange(
      zeroBasedLine,
      zeroBasedCol,
      zeroBasedLine,
      zeroBasedCol + length
    )
  }

  // Add source if missing
  if (!error.source) {
    error.source = generateSource(error.stage, error.code)
  }

  // Add codeDescription if missing
  if (!error.codeDescription) {
    const errorInfo = getErrorInfo(error.code)
    if (errorInfo) {
      error.codeDescription = {
        href: errorInfo.url
      }
    }
  }

  return error
}

/**
 * Enhance a batch of diagnostics
 */
export function enhanceDiagnostics(errors: ProtoError[]): ProtoError[] {
  return errors.map(err => enhanceDiagnostic(err))
}
