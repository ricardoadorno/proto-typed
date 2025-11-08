/**
 * LSP Types - Language Server Protocol Type Definitions
 *
 * Defines types for LSP diagnostics, code actions, and formatting.
 */

import type { ProtoError, Severity } from '../../types/errors';

/**
 * LSP Diagnostic Severity
 * Maps to VSCode DiagnosticSeverity
 */
export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4,
}

/**
 * Position in a text document
 */
export interface Position {
  /** Line position (0-based) */
  line: number;
  /** Character position (0-based) */
  character: number;
}

/**
 * Range in a text document
 */
export interface Range {
  /** Start position */
  start: Position;
  /** End position */
  end: Position;
}

/**
 * LSP Diagnostic
 * Represents a problem in source code
 */
export interface Diagnostic {
  /** Range where the diagnostic applies */
  range: Range;
  /** Severity of the diagnostic */
  severity: DiagnosticSeverity;
  /** Diagnostic code (e.g., 'PT-LEX-1001') */
  code?: string;
  /** Source of the diagnostic (e.g., 'proto-typed') */
  source?: string;
  /** Diagnostic message */
  message: string;
  /** Additional related information */
  relatedInformation?: DiagnosticRelatedInformation[];
  /** Tags for the diagnostic */
  tags?: DiagnosticTag[];
}

/**
 * Diagnostic tags
 */
export enum DiagnosticTag {
  /** Unused or unnecessary code */
  Unnecessary = 1,
  /** Deprecated code */
  Deprecated = 2,
}

/**
 * Related diagnostic information
 */
export interface DiagnosticRelatedInformation {
  /** Location of the related information */
  location: Location;
  /** Message of the related information */
  message: string;
}

/**
 * Location in a text document
 */
export interface Location {
  /** URI of the document */
  uri: string;
  /** Range in the document */
  range: Range;
}

/**
 * Text edit - represents a change to a text document
 */
export interface TextEdit {
  /** Range to replace */
  range: Range;
  /** New text */
  newText: string;
}

/**
 * Code action kind
 */
export enum CodeActionKind {
  /** Empty kind */
  Empty = '',
  /** Quick fix */
  QuickFix = 'quickfix',
  /** Refactor */
  Refactor = 'refactor',
  /** Refactor extract */
  RefactorExtract = 'refactor.extract',
  /** Refactor inline */
  RefactorInline = 'refactor.inline',
  /** Refactor rewrite */
  RefactorRewrite = 'refactor.rewrite',
  /** Source */
  Source = 'source',
  /** Source organize imports */
  SourceOrganizeImports = 'source.organizeImports',
  /** Source fix all */
  SourceFixAll = 'source.fixAll',
}

/**
 * Code action - represents a change to be applied
 */
export interface CodeAction {
  /** Title of the code action */
  title: string;
  /** Kind of the code action */
  kind?: CodeActionKind;
  /** Diagnostics that this code action resolves */
  diagnostics?: Diagnostic[];
  /** Edit to be applied */
  edit?: WorkspaceEdit;
  /** Command to be executed */
  command?: Command;
  /** Whether this is the preferred action */
  isPreferred?: boolean;
}

/**
 * Workspace edit
 */
export interface WorkspaceEdit {
  /** Changes to existing documents */
  changes?: { [uri: string]: TextEdit[] };
}

/**
 * Command
 */
export interface Command {
  /** Title of the command */
  title: string;
  /** Command identifier */
  command: string;
  /** Arguments for the command */
  arguments?: any[];
}

/**
 * Formatting options
 */
export interface FormattingOptions {
  /** Size of a tab in spaces */
  tabSize: number;
  /** Prefer spaces over tabs */
  insertSpaces: boolean;
  /** Trim trailing whitespace */
  trimTrailingWhitespace?: boolean;
  /** Insert final newline */
  insertFinalNewline?: boolean;
  /** Trim final newlines */
  trimFinalNewlines?: boolean;
}

/**
 * Document formatting result
 */
export type DocumentFormattingResult = TextEdit[] | null;

/**
 * Lint result
 */
export interface LintResult {
  /** Diagnostics found */
  diagnostics: Diagnostic[];
  /** Number of errors */
  errorCount: number;
  /** Number of warnings */
  warningCount: number;
  /** Number of hints */
  hintCount: number;
}

/**
 * Convert ProtoError severity to LSP DiagnosticSeverity
 */
export function severityToLSP(severity: Severity): DiagnosticSeverity {
  switch (severity) {
    case 'fatal':
    case 'error':
      return DiagnosticSeverity.Error;
    case 'warning':
      return DiagnosticSeverity.Warning;
    case 'info':
      return DiagnosticSeverity.Information;
    default:
      return DiagnosticSeverity.Hint;
  }
}

/**
 * Convert ProtoError to LSP Diagnostic
 */
export function errorToDiagnostic(error: ProtoError, documentUri?: string): Diagnostic {
  const line = (error.line ?? 1) - 1; // Convert to 0-based
  const character = (error.column ?? 1) - 1; // Convert to 0-based
  const length = error.length ?? 1;

  const diagnostic: Diagnostic = {
    range: {
      start: { line, character },
      end: { line, character: character + length },
    },
    severity: severityToLSP(error.severity),
    code: error.code,
    source: 'proto-typed',
    message: error.hint ? `${error.message}\n💡 ${error.hint}` : error.message,
  };

  return diagnostic;
}

/**
 * Create a Position
 */
export function createPosition(line: number, character: number): Position {
  return { line, character };
}

/**
 * Create a Range
 */
export function createRange(
  startLine: number,
  startChar: number,
  endLine: number,
  endChar: number
): Range {
  return {
    start: createPosition(startLine, startChar),
    end: createPosition(endLine, endChar),
  };
}

/**
 * Create a TextEdit
 */
export function createTextEdit(range: Range, newText: string): TextEdit {
  return { range, newText };
}
