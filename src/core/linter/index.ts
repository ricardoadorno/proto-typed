/**
 * Linter Module - Public API
 *
 * Exports all linting-related functionality:
 * - lintDocument: Main linting function
 * - Utility functions for working with lint results
 */

export {
  lintDocument,
  getAllDiagnostics,
  hasErrors,
  hasWarnings,
  getLintSummary,
  type LintResult,
} from './linter';
