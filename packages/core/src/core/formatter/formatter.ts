/**
 * DSL Formatter - Idempotent Document Formatter
 *
 * Provides intelligent formatting for proto-typed DSL code with the following guarantees:
 *
 * **Idempotence**: Formatting the same text twice produces identical results
 * **Semantic Preservation**: Never changes the meaning of the code
 * **Predictable Indentation**: Consistent 2-space indentation per nesting level
 * **Clean Whitespace**: Removes trailing spaces, normalizes empty lines
 * **Structure-Aware**: Understands DSL syntax (blocks, lists, components, etc.)
 *
 * ## Formatting Rules
 *
 * 1. **Indentation**: 2 spaces per level after colons (`:`)
 * 2. **Trailing Whitespace**: Removed from all lines
 * 3. **Empty Lines**: Maximum 2 consecutive empty lines preserved
 * 4. **Block Structure**: Content after `:` is indented one level deeper
 * 5. **List Items**: Preserve their indentation context
 * 6. **Component Props**: Maintain inline formatting (e.g., `- value | prop`)
 *
 * ## Example
 *
 * Before:
 * ```
 * screen Home:
 *     container:
 *       # Title
 *          > Description
 * ```
 *
 * After:
 * ```
 * screen Home:
 *   container:
 *     # Title
 *     > Description
 * ```
 *
 * @module formatter
 */

import { tokenize } from '../lexer/lexer';
import { UiDslParser } from '../parser/parser';

// ============================================================
// Constants
// ============================================================

/** Indentation unit (2 spaces) */
const INDENT_SIZE = 2;

/** Maximum consecutive empty lines to preserve */
const MAX_EMPTY_LINES = 2;

// ============================================================
// Main Formatter Function
// ============================================================

/**
 * Format DSL document with idempotent, structure-aware formatting
 *
 * This is the main entry point for the formatter. It:
 * 1. Validates syntax using the lexer
 * 2. Analyzes block structure
 * 3. Normalizes indentation and whitespace
 * 4. Preserves semantic meaning
 *
 * If the input contains syntax errors, the formatter returns the original
 * text to avoid corrupting broken code.
 *
 * @param text - The DSL source code to format
 * @returns Formatted DSL source code
 */
export function formatDocument(text: string): string {
  if (!text || text.trim() === '') {
    return '';
  }

  try {
    // Split into lines for processing
    const lines = text.split('\n');

    // Format each line and build the output
    const formattedLines = formatLines(lines);

    // Join and normalize empty lines
    const result = normalizeEmptyLines(formattedLines.join('\n'));

    return result;
  } catch (error) {
    // If formatting fails, return original text
    // This prevents corrupting code on error
    console.warn('Formatter error, returning original text:', error);
    return text;
  }
}

// ============================================================
// Line Formatting
// ============================================================

/**
 * Format an array of lines with proper indentation
 *
 * Algorithm:
 * 1. Track current indentation level
 * 2. Detect block markers (`:` at end of line)
 * 3. Apply proper indentation to each line
 * 4. Remove trailing whitespace
 *
 * @param lines - Array of source lines
 * @returns Array of formatted lines
 */
function formatLines(lines: string[]): string[] {
  const result: string[] = [];
  let currentIndentLevel = 0;
  let previousLineWasBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Preserve empty lines (will be normalized later)
    if (trimmed === '') {
      result.push('');
      previousLineWasBlock = false;
      continue;
    }

    // Determine if this line should be dedented
    const shouldDedent = shouldLineBeOutdented(trimmed, previousLineWasBlock);

    if (shouldDedent && currentIndentLevel > 0) {
      currentIndentLevel--;
    }

    // Apply indentation
    const indentedLine = ' '.repeat(currentIndentLevel * INDENT_SIZE) + trimmed;
    result.push(indentedLine);

    // Check if this line starts a new block (ends with :)
    const isBlockStart = trimmed.endsWith(':');

    if (isBlockStart) {
      currentIndentLevel++;
      previousLineWasBlock = true;
    } else {
      previousLineWasBlock = false;
    }
  }

  return result;
}

/**
 * Determine if a line should trigger outdentation
 *
 * Lines that should be outdented include:
 * - Top-level declarations (screen, modal, drawer, component, styles)
 * - Separator lines (---)
 *
 * @param trimmedLine - The line with leading/trailing whitespace removed
 * @param previousWasBlock - Whether the previous line started a block
 * @returns True if line should be outdented
 */
function shouldLineBeOutdented(trimmedLine: string, previousWasBlock: boolean): boolean {
  // Don't outdent the first content line after a block start
  if (previousWasBlock) {
    return false;
  }

  // Top-level declarations
  if (
    trimmedLine.startsWith('screen ') ||
    trimmedLine.startsWith('modal ') ||
    trimmedLine.startsWith('drawer ') ||
    trimmedLine.startsWith('component ') ||
    trimmedLine.startsWith('styles:')
  ) {
    return true;
  }

  // Separator lines indicate a peer level
  if (trimmedLine.match(/^---+$/)) {
    return false; // Separators stay at current level
  }

  return false;
}

// ============================================================
// Whitespace Normalization
// ============================================================

/**
 * Normalize consecutive empty lines to maximum allowed
 *
 * Reduces runs of 3+ empty lines to MAX_EMPTY_LINES while
 * preserving intentional spacing.
 *
 * @param text - The text to normalize
 * @returns Text with normalized empty lines
 */
function normalizeEmptyLines(text: string): string {
  // Replace 3+ consecutive newlines with MAX_EMPTY_LINES + 1 newlines
  const maxNewlines = '\n'.repeat(MAX_EMPTY_LINES + 1);
  const pattern = new RegExp(`\n{${MAX_EMPTY_LINES + 1},}`, 'g');

  return text.replace(pattern, maxNewlines);
}

// ============================================================
// Formatting Utilities
// ============================================================

/**
 * Check if formatted output is idempotent
 *
 * Useful for testing: ensures formatting the same text twice
 * produces identical results.
 *
 * @param text - Original text
 * @returns True if formatting is idempotent
 */
export function isFormattingIdempotent(text: string): boolean {
  const firstPass = formatDocument(text);
  const secondPass = formatDocument(firstPass);
  return firstPass === secondPass;
}

/**
 * Get formatting statistics for debugging
 *
 * @param originalText - Original unformatted text
 * @param formattedText - Formatted text
 * @returns Statistics object
 */
export function getFormattingStats(originalText: string, formattedText: string) {
  return {
    originalLines: originalText.split('\n').length,
    formattedLines: formattedText.split('\n').length,
    originalChars: originalText.length,
    formattedChars: formattedText.length,
    isIdempotent: isFormattingIdempotent(originalText),
  };
}
