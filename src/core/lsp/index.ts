/**
 * LSP Module - Language Server Protocol Implementation
 *
 * Provides lint, format, and code action functionality for the DSL.
 * Can be used in Monaco Editor or a standalone LSP server.
 *
 * @module lsp
 *
 * @example
 * ```typescript
 * import { lint, format, getCodeActions } from './core/lsp';
 *
 * // Lint code
 * const lintResult = lint('Screen Home:\n  Button primary: Click');
 * console.log(lintResult.diagnostics);
 *
 * // Format code
 * const formatted = format('Screen Home:\nButton primary:Click', { tabSize: 2, insertSpaces: true });
 *
 * // Get code actions for fixes
 * const actions = getCodeActions(lintResult.diagnostics, documentText);
 * ```
 */

// ============================================================
// TYPES
// ============================================================
export type {
  Position,
  Range,
  Diagnostic,
  DiagnosticRelatedInformation,
  Location,
  TextEdit,
  CodeAction,
  WorkspaceEdit,
  Command,
  FormattingOptions,
  DocumentFormattingResult,
  LintResult,
} from './types';

export {
  DiagnosticSeverity,
  DiagnosticTag,
  CodeActionKind,
  severityToLSP,
  errorToDiagnostic,
  createPosition,
  createRange,
  createTextEdit,
} from './types';

// ============================================================
// DIAGNOSTICS
// ============================================================
export {
  getDiagnosticsFromErrorBus,
  convertErrorsToDiagnostics,
  filterDiagnosticsBySeverity,
  getDiagnosticSummary,
} from './diagnostics';

// ============================================================
// LINTER
// ============================================================
export type { LintOptions } from './linter';

export {
  lint,
  lintErrors,
  lintErrorsAndWarnings,
  hasErrors,
  isValid,
} from './linter';

// ============================================================
// FORMATTER
// ============================================================
export type { FormatOptions } from './formatter';

export {
  format,
  formatRange,
  needsFormatting,
} from './formatter';

// ============================================================
// CODE ACTIONS
// ============================================================
export {
  getCodeActionsForDiagnostic,
  getAllCodeActions,
  getCodeActionsForRange,
  createFixAllAction,
} from './code-actions';

// ============================================================
// CONVENIENCE API
// ============================================================

import { lint } from './linter';
import { format } from './formatter';
import { getAllCodeActions } from './code-actions';
import type { LintResult, FormattingOptions, CodeAction } from './types';

/**
 * Complete LSP analysis - lint, format, and get code actions
 *
 * @param text DSL code to analyze
 * @param documentUri Optional document URI
 * @param formatOptions Optional formatting options
 * @returns Complete analysis result
 */
export function analyze(
  text: string,
  documentUri?: string,
  formatOptions?: FormattingOptions
): {
  lint: LintResult;
  format: ReturnType<typeof format>;
  codeActions: CodeAction[];
} {
  const lintResult = lint(text, documentUri);
  const formatResult = format(text, formatOptions);
  const codeActions = getAllCodeActions(lintResult.diagnostics, text);

  return {
    lint: lintResult,
    format: formatResult,
    codeActions,
  };
}

/**
 * LSP Server API - Main entry point for LSP functionality
 */
export const LSP = {
  // Linting
  lint,

  // Formatting
  format,

  // Code Actions
  getCodeActions: getAllCodeActions,

  // Complete analysis
  analyze,
} as const;

// ============================================================
// DEFAULT EXPORT
// ============================================================
export default LSP;
