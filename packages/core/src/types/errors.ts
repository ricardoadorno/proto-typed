import type {
  Range,
  CodeDescription,
  DiagnosticTag,
  DiagnosticRelatedInformation
} from './diagnostics';

export type Severity = 'info' | 'warning' | 'error' | 'fatal';

export const SEVERITY_RANK: Record<Severity, number> = {
  info: 1,
  warning: 2,
  error: 3,
  fatal: 4,
};

export type Stage = 'lexer' | 'parser' | 'builder' | 'renderer' | 'editor';

/**
 * Base interface for Proto-Typed diagnostics.
 *
 * **LSP Alignment**: This interface is being enhanced to align with the
 * Language Server Protocol v3.17 specification while maintaining backward
 * compatibility with existing code.
 *
 * **Migration Notes**:
 * - `line`, `column`, `length` are DEPRECATED - use `range` instead
 * - New LSP-aligned fields are optional during transition period
 * - Both old and new formats will be supported for 2-3 versions
 */
export interface ProtoErrorBase {
  // ========================================
  // CORE FIELDS (Stable)
  // ========================================

  stage: Stage;
  code: string;
  severity: Severity;
  message: string;

  // ========================================
  // LEGACY POSITION FIELDS (Deprecated)
  // ========================================

  /**
   * @deprecated Use `range.start.line` instead (note: range is 0-based)
   * Line number where the error occurs (1-based indexing)
   */
  line?: number;

  /**
   * @deprecated Use `range.start.character` instead (note: range is 0-based)
   * Column number where the error occurs (1-based indexing)
   */
  column?: number;

  /**
   * @deprecated Use `range.end.character - range.start.character` instead
   * Length of the error span in characters
   */
  length?: number;

  // ========================================
  // CUSTOM FIELDS (Proto-Typed Specific)
  // ========================================

  /**
   * Suggested fix or hint for resolving the error.
   * This is a Proto-Typed extension (not part of standard LSP).
   *
   * For automated fixes, use `data.fixes` instead.
   */
  hint?: string;

  nodeId?: string;
  sourceSnippet?: string;
  fatal?: boolean;
  messageKey?: string;
  messageParams?: Record<string, string | number>;

  // ========================================
  // LSP-ALIGNED FIELDS (New, Optional)
  // ========================================

  /**
   * The range at which the message applies (LSP-compliant).
   * Uses 0-based line and character indexing.
   *
   * @since LSP v3.0
   */
  range?: Range;

  /**
   * Source of this diagnostic (e.g., 'proto-typed-lexer', 'proto-typed-lint').
   * More descriptive than `stage` alone.
   *
   * @since LSP v3.0
   */
  source?: string;

  /**
   * Link to documentation explaining this error code.
   *
   * Example: { href: 'https://proto-typed.dev/errors/PT-LINT-1001' }
   *
   * @since LSP v3.16
   */
  codeDescription?: CodeDescription;

  /**
   * Additional metadata tags (Unnecessary, Deprecated).
   * Used to render diagnostics with special decorations.
   *
   * @since LSP v3.15
   */
  tags?: DiagnosticTag[];

  /**
   * Related diagnostic information (e.g., duplicate definitions, cross-references).
   * Helps users understand the full context of an error.
   *
   * @since LSP v3.7
   */
  relatedInformation?: DiagnosticRelatedInformation[];

  /**
   * Arbitrary data for code actions and quick fixes.
   * Preserved between diagnostics and code action requests.
   *
   * Example:
   * ```typescript
   * data: {
   *   fixes: [
   *     { title: 'Add missing import', edit: {...} }
   *   ]
   * }
   * ```
   *
   * @since LSP v3.16
   */
  data?: unknown;
}

export type ProtoError =
  | (ProtoErrorBase & {
      stage: 'lexer';
      token?: string;
      expected?: string[];
    })
  | (ProtoErrorBase & {
      stage: 'parser';
      rule?: string;
      unexpected?: string;
      expected?: string[];
    })
  | (ProtoErrorBase & {
      stage: 'builder';
      builder?: string;
      nodeType?: string;
    })
  | (ProtoErrorBase & {
      stage: 'renderer';
      nodeType?: string;
      component?: string;
      recoverable?: boolean;
    })
  | (ProtoErrorBase & {
      stage: 'editor';
      source?: 'monaco' | 'runtime';
    });

export const ERROR_CODES = {
  LEX_INVALID_TOKEN: 'PT-LEX-1001',
  LEX_UNEXPECTED_CHAR: 'PT-LEX-1002',
  PARSE_SYNTAX_ERROR: 'PT-PARSE-1001',
  PARSE_EXPECTED_NAME: 'PT-PARSE-1002',
  PARSE_EXPECTED_COLON: 'PT-PARSE-1003',
  PARSE_EXPECTED_INDENT: 'PT-PARSE-1004',
  PARSE_UNEXPECTED_TOKEN: 'PT-PARSE-1005',
  BLD_INVALID_MODIFIERS: 'PT-BLD-2001',
  BLD_INVALID_PROPS: 'PT-BLD-2002',
  BLD_MISSING_REQUIRED: 'PT-BLD-2003',
  REND_GENERIC_ERROR: 'PT-REND-3001',
  REND_MISSING_PROP: 'PT-REND-3002',
  REND_INVALID_NAV: 'PT-REND-3003',
  REND_COMPONENT_ERROR: 'PT-REND-3004',
  EDIT_FATAL_ERROR: 'PT-EDIT-4001',
  EDIT_MONACO_ERROR: 'PT-EDIT-4002',
} as const;

export function isMoreSevere(a: Severity, b: Severity): boolean {
  return SEVERITY_RANK[a] > SEVERITY_RANK[b];
}

export function sanitizeErrorMessage(error: unknown, maxLength = 80): string {
  const rawMsg = error instanceof Error ? error.message : String(error);
  return rawMsg.split('\n')[0].slice(0, maxLength);
}
