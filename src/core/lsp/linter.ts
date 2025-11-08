/**
 * LSP Linter - Lint DSL Code
 *
 * Provides linting functionality using existing parser and validation.
 */

import { parseAndBuildAst } from '../parser/parse-and-build-ast';
import { ErrorBus } from '../error-bus';
import type { LintResult } from './types';
import { getDiagnosticsFromErrorBus } from './diagnostics';

/**
 * Lint options
 */
export interface LintOptions {
  /** Whether to include warnings */
  includeWarnings?: boolean;
  /** Whether to include information */
  includeInformation?: boolean;
  /** Whether to include hints */
  includeHints?: boolean;
  /** Maximum number of diagnostics to return */
  maxDiagnostics?: number;
}

/**
 * Lint DSL code
 *
 * Parses the code and returns diagnostics based on errors collected
 * from lexer, parser, and builder validation.
 *
 * @param text DSL code to lint
 * @param documentUri Optional document URI
 * @param options Lint options
 * @returns LintResult with diagnostics
 *
 * @example
 * ```typescript
 * const result = lint('Screen Home:\n  Button primary: Click me');
 * console.log(result.diagnostics);
 * console.log(`Errors: ${result.errorCount}, Warnings: ${result.warningCount}`);
 * ```
 */
export function lint(
  text: string,
  documentUri?: string,
  options: LintOptions = {}
): LintResult {
  const {
    includeWarnings = true,
    includeInformation = true,
    includeHints = true,
    maxDiagnostics,
  } = options;

  // Create a new error bus for this lint run
  const errorBus = ErrorBus.get();

  // Clear previous errors
  errorBus.clear();

  // Parse and build AST - this will collect errors
  try {
    parseAndBuildAst(text);
  } catch (error) {
    // Errors are already collected in ErrorBus
    // No need to throw
  }

  // Get diagnostics from error bus
  let result = getDiagnosticsFromErrorBus(errorBus, documentUri);

  // Filter diagnostics based on options
  if (!includeWarnings) {
    result.diagnostics = result.diagnostics.filter(
      (d) => d.severity !== 2 // DiagnosticSeverity.Warning
    );
    result.warningCount = 0;
  }

  if (!includeInformation) {
    result.diagnostics = result.diagnostics.filter(
      (d) => d.severity !== 3 // DiagnosticSeverity.Information
    );
  }

  if (!includeHints) {
    result.diagnostics = result.diagnostics.filter(
      (d) => d.severity !== 4 // DiagnosticSeverity.Hint
    );
  }

  // Limit diagnostics if maxDiagnostics is set
  if (maxDiagnostics && result.diagnostics.length > maxDiagnostics) {
    result.diagnostics = result.diagnostics.slice(0, maxDiagnostics);
  }

  return result;
}

/**
 * Lint and return only errors
 *
 * @param text DSL code to lint
 * @param documentUri Optional document URI
 * @returns LintResult with only errors
 */
export function lintErrors(text: string, documentUri?: string): LintResult {
  return lint(text, documentUri, {
    includeWarnings: false,
    includeInformation: false,
    includeHints: false,
  });
}

/**
 * Lint and return only errors and warnings
 *
 * @param text DSL code to lint
 * @param documentUri Optional document URI
 * @returns LintResult with errors and warnings
 */
export function lintErrorsAndWarnings(
  text: string,
  documentUri?: string
): LintResult {
  return lint(text, documentUri, {
    includeWarnings: true,
    includeInformation: false,
    includeHints: false,
  });
}

/**
 * Check if code has any errors
 *
 * @param text DSL code to check
 * @returns true if code has errors
 */
export function hasErrors(text: string): boolean {
  const result = lintErrors(text);
  return result.errorCount > 0;
}

/**
 * Check if code is valid (no errors)
 *
 * @param text DSL code to check
 * @returns true if code is valid
 */
export function isValid(text: string): boolean {
  return !hasErrors(text);
}
