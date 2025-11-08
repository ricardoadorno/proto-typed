/**
 * LSP Diagnostics - Convert ProtoErrors to LSP Diagnostics
 *
 * Converts errors from ErrorBus to LSP diagnostic format.
 */

import type { ProtoError } from '../../types/errors';
import type { Diagnostic, LintResult } from './types';
import { errorToDiagnostic, DiagnosticSeverity } from './types';
import { ErrorBus } from '../error-bus';

/**
 * Get diagnostics from ErrorBus
 *
 * @param errorBus ErrorBus instance
 * @param documentUri Optional document URI for related information
 * @returns LintResult with diagnostics
 */
export function getDiagnosticsFromErrorBus(
  errorBus: ErrorBus,
  documentUri?: string
): LintResult {
  const errors = errorBus.getAll();
  const diagnostics = errors.map((error) => errorToDiagnostic(error, documentUri));

  const result: LintResult = {
    diagnostics,
    errorCount: diagnostics.filter(
      (d) => d.severity === DiagnosticSeverity.Error
    ).length,
    warningCount: diagnostics.filter(
      (d) => d.severity === DiagnosticSeverity.Warning
    ).length,
    hintCount: diagnostics.filter(
      (d) =>
        d.severity === DiagnosticSeverity.Information ||
        d.severity === DiagnosticSeverity.Hint
    ).length,
  };

  return result;
}

/**
 * Convert array of ProtoErrors to diagnostics
 *
 * @param errors Array of ProtoErrors
 * @param documentUri Optional document URI
 * @returns Array of LSP Diagnostics
 */
export function convertErrorsToDiagnostics(
  errors: ProtoError[],
  documentUri?: string
): Diagnostic[] {
  return errors.map((error) => errorToDiagnostic(error, documentUri));
}

/**
 * Filter diagnostics by severity
 *
 * @param diagnostics Array of diagnostics
 * @param severity Severity to filter by
 * @returns Filtered diagnostics
 */
export function filterDiagnosticsBySeverity(
  diagnostics: Diagnostic[],
  severity: DiagnosticSeverity
): Diagnostic[] {
  return diagnostics.filter((d) => d.severity === severity);
}

/**
 * Get diagnostic summary
 *
 * @param diagnostics Array of diagnostics
 * @returns Summary object with counts
 */
export function getDiagnosticSummary(diagnostics: Diagnostic[]): {
  total: number;
  errors: number;
  warnings: number;
  information: number;
  hints: number;
} {
  return {
    total: diagnostics.length,
    errors: diagnostics.filter((d) => d.severity === DiagnosticSeverity.Error)
      .length,
    warnings: diagnostics.filter((d) => d.severity === DiagnosticSeverity.Warning)
      .length,
    information: diagnostics.filter(
      (d) => d.severity === DiagnosticSeverity.Information
    ).length,
    hints: diagnostics.filter((d) => d.severity === DiagnosticSeverity.Hint)
      .length,
  };
}
