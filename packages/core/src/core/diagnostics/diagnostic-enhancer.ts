/**
 * Diagnostic Enhancer - Attaches Code Actions to Diagnostics
 *
 * This module enhances diagnostics by attaching available code actions
 * to their `data` field, following LSP patterns.
 *
 * The `data` field is used to store code actions that can fix the diagnostic,
 * making them available to the editor for quick fixes.
 */

import type { ProtoError } from '../../types/errors'
import type { CodeAction } from '../../types/diagnostics'
import { getCodeActions } from './code-actions'

/**
 * Enhance a diagnostic by attaching available code actions
 *
 * @param diagnostic - The diagnostic to enhance
 * @param documentUri - URI of the document
 * @param documentText - Optional document text for context
 * @returns Enhanced diagnostic with code actions in data field
 *
 * @example
 * ```typescript
 * const diagnostic: ProtoError = {
 *   code: 'PT-LINT-1001',
 *   message: 'Component "Header" is not defined',
 *   // ... other fields
 * }
 *
 * const enhanced = enhanceWithCodeActions(diagnostic, 'file:///app.dsl')
 * // enhanced.data.codeActions contains available fixes
 * ```
 */
export function enhanceWithCodeActions(
  diagnostic: ProtoError,
  documentUri: string,
  documentText?: string
): ProtoError {
  const codeActions = getCodeActions(diagnostic, documentUri, documentText)

  if (codeActions.length === 0) {
    return diagnostic
  }

  return {
    ...diagnostic,
    data: {
      ...(diagnostic.data || {}),
      codeActions
    }
  }
}

/**
 * Enhance multiple diagnostics with code actions
 *
 * @param diagnostics - Array of diagnostics to enhance
 * @param documentUri - URI of the document
 * @param documentText - Optional document text
 * @returns Array of enhanced diagnostics
 *
 * @example
 * ```typescript
 * const diagnostics = lintDocument(ast)
 * const enhanced = enhanceDiagnosticsWithCodeActions(
 *   diagnostics,
 *   'file:///app.dsl'
 * )
 * errorBus.publishDiagnostics(uri, enhanced)
 * ```
 */
export function enhanceDiagnosticsWithCodeActions(
  diagnostics: ProtoError[],
  documentUri: string,
  documentText?: string
): ProtoError[] {
  return diagnostics.map(diagnostic =>
    enhanceWithCodeActions(diagnostic, documentUri, documentText)
  )
}

/**
 * Check if a diagnostic has code actions available
 *
 * @param diagnostic - The diagnostic to check
 * @returns True if code actions are available
 */
export function hasCodeActions(diagnostic: ProtoError): boolean {
  return (
    diagnostic.data !== undefined &&
    diagnostic.data !== null &&
    typeof diagnostic.data === 'object' &&
    'codeActions' in diagnostic.data &&
    Array.isArray((diagnostic.data as any).codeActions) &&
    (diagnostic.data as any).codeActions.length > 0
  )
}

/**
 * Get code actions from an enhanced diagnostic
 *
 * @param diagnostic - The diagnostic
 * @returns Array of code actions or empty array
 */
export function getCodeActionsFromDiagnostic(diagnostic: ProtoError): CodeAction[] {
  if (!hasCodeActions(diagnostic)) {
    return []
  }

  return (diagnostic.data as any).codeActions
}

/**
 * Get preferred code action from a diagnostic
 *
 * Preferred actions are marked with `isPreferred: true` and are
 * typically used for "auto-fix" commands.
 *
 * @param diagnostic - The diagnostic
 * @returns Preferred code action or undefined
 */
export function getPreferredCodeAction(diagnostic: ProtoError): CodeAction | undefined {
  const actions = getCodeActionsFromDiagnostic(diagnostic)
  return actions.find(action => action.isPreferred)
}

/**
 * Count total code actions across multiple diagnostics
 *
 * @param diagnostics - Array of diagnostics
 * @returns Total number of available code actions
 */
export function countCodeActions(diagnostics: ProtoError[]): number {
  return diagnostics.reduce((count, diagnostic) => {
    return count + getCodeActionsFromDiagnostic(diagnostic).length
  }, 0)
}
