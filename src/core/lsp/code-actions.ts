/**
 * LSP Code Actions - Quick Fixes and Refactorings
 *
 * Provides code actions (quick fixes) for diagnostics using the suggestions system.
 */

import type { Diagnostic, CodeAction, TextEdit, Range } from './types';
import { CodeActionKind, createRange, createTextEdit } from './types';
import {
  suggestButtonVariant,
  suggestButtonSize,
  suggestInputType,
  suggestLayoutModifier,
} from '../utils/suggestions';
import { ERROR_CODES } from '../../types/errors';

/**
 * Get code actions for a diagnostic
 *
 * @param diagnostic Diagnostic to get actions for
 * @param documentText Full document text
 * @returns Array of code actions
 */
export function getCodeActionsForDiagnostic(
  diagnostic: Diagnostic,
  documentText: string
): CodeAction[] {
  const actions: CodeAction[] = [];

  // Extract the invalid value from the diagnostic range
  const invalidValue = extractTextFromRange(documentText, diagnostic.range);

  // Generate quick fixes based on error code
  switch (diagnostic.code) {
    case ERROR_CODES.BLD_INVALID_MODIFIERS:
      actions.push(...getLayoutModifierActions(diagnostic, invalidValue));
      break;

    case ERROR_CODES.BLD_INVALID_PROPS:
      actions.push(...getInvalidPropsActions(diagnostic, invalidValue));
      break;

    case ERROR_CODES.BLD_MISSING_REQUIRED:
      actions.push(...getMissingRequiredActions(diagnostic, invalidValue));
      break;

    default:
      // No specific actions for this error code
      break;
  }

  return actions;
}

/**
 * Get code actions for layout modifiers
 */
function getLayoutModifierActions(
  diagnostic: Diagnostic,
  invalidValue: string
): CodeAction[] {
  const actions: CodeAction[] = [];
  const suggestion = suggestLayoutModifier(invalidValue);

  if (suggestion) {
    actions.push({
      title: `Change to '${suggestion}'`,
      kind: CodeActionKind.QuickFix,
      diagnostics: [diagnostic],
      isPreferred: true,
      edit: {
        changes: {
          '': [createTextEdit(diagnostic.range, suggestion)],
        },
      },
    });
  }

  return actions;
}

/**
 * Get code actions for invalid props
 */
function getInvalidPropsActions(
  diagnostic: Diagnostic,
  invalidValue: string
): CodeAction[] {
  const actions: CodeAction[] = [];
  const message = diagnostic.message.toLowerCase();

  // Check if it's a button variant error
  if (message.includes('button') && message.includes('variant')) {
    const suggestion = suggestButtonVariant(invalidValue);
    if (suggestion) {
      actions.push({
        title: `Change to '${suggestion}'`,
        kind: CodeActionKind.QuickFix,
        diagnostics: [diagnostic],
        isPreferred: true,
        edit: {
          changes: {
            '': [createTextEdit(diagnostic.range, suggestion)],
          },
        },
      });
    }
  }

  // Check if it's a button size error
  if (message.includes('button') && message.includes('size')) {
    const suggestion = suggestButtonSize(invalidValue);
    if (suggestion) {
      actions.push({
        title: `Change to '${suggestion}'`,
        kind: CodeActionKind.QuickFix,
        diagnostics: [diagnostic],
        isPreferred: true,
        edit: {
          changes: {
            '': [createTextEdit(diagnostic.range, suggestion)],
          },
        },
      });
    }
  }

  // Check if it's an input type error
  if (message.includes('input') && message.includes('type')) {
    const suggestion = suggestInputType(invalidValue);
    if (suggestion) {
      actions.push({
        title: `Change to '${suggestion}'`,
        kind: CodeActionKind.QuickFix,
        diagnostics: [diagnostic],
        isPreferred: true,
        edit: {
          changes: {
            '': [createTextEdit(diagnostic.range, suggestion)],
          },
        },
      });
    }
  }

  return actions;
}

/**
 * Get code actions for missing required props
 */
function getMissingRequiredActions(
  diagnostic: Diagnostic,
  _invalidValue: string
): CodeAction[] {
  const actions: CodeAction[] = [];
  const message = diagnostic.message;

  // Extract missing property names from message
  const match = message.match(/missing required properties: (.+)/i);
  if (match) {
    const missingProps = match[1].split(',').map((p) => p.trim());

    // Create action to add missing properties
    actions.push({
      title: `Add missing properties: ${missingProps.join(', ')}`,
      kind: CodeActionKind.QuickFix,
      diagnostics: [diagnostic],
      isPreferred: true,
      // Note: This would require more context to implement properly
      // For now, we just suggest what's missing
    });
  }

  return actions;
}

/**
 * Extract text from a range in the document
 */
function extractTextFromRange(documentText: string, range: Range): string {
  const lines = documentText.split('\n');
  const startLine = range.start.line;
  const endLine = range.end.line;
  const startChar = range.start.character;
  const endChar = range.end.character;

  if (startLine === endLine) {
    return lines[startLine]?.substring(startChar, endChar) ?? '';
  }

  // Multi-line range
  const startLineText = lines[startLine]?.substring(startChar) ?? '';
  const endLineText = lines[endLine]?.substring(0, endChar) ?? '';
  const middleLines = lines.slice(startLine + 1, endLine);

  return [startLineText, ...middleLines, endLineText].join('\n');
}

/**
 * Get all code actions for a document
 *
 * @param diagnostics All diagnostics for the document
 * @param documentText Full document text
 * @returns Array of all code actions
 */
export function getAllCodeActions(
  diagnostics: Diagnostic[],
  documentText: string
): CodeAction[] {
  const actions: CodeAction[] = [];

  for (const diagnostic of diagnostics) {
    const diagnosticActions = getCodeActionsForDiagnostic(diagnostic, documentText);
    actions.push(...diagnosticActions);
  }

  return actions;
}

/**
 * Get code actions for a specific range
 *
 * @param diagnostics All diagnostics for the document
 * @param range Range to get actions for
 * @param documentText Full document text
 * @returns Array of code actions for the range
 */
export function getCodeActionsForRange(
  diagnostics: Diagnostic[],
  range: Range,
  documentText: string
): CodeAction[] {
  // Filter diagnostics that intersect with the range
  const relevantDiagnostics = diagnostics.filter((d) =>
    rangesIntersect(d.range, range)
  );

  const actions: CodeAction[] = [];

  for (const diagnostic of relevantDiagnostics) {
    const diagnosticActions = getCodeActionsForDiagnostic(diagnostic, documentText);
    actions.push(...diagnosticActions);
  }

  return actions;
}

/**
 * Check if two ranges intersect
 */
function rangesIntersect(a: Range, b: Range): boolean {
  // Check if ranges don't intersect, then negate
  const noIntersect =
    a.end.line < b.start.line ||
    (a.end.line === b.start.line && a.end.character < b.start.character) ||
    b.end.line < a.start.line ||
    (b.end.line === a.start.line && b.end.character < a.start.character);

  return !noIntersect;
}

/**
 * Create a "fix all" code action
 *
 * @param diagnostics All diagnostics
 * @param documentText Document text
 * @returns Code action that fixes all auto-fixable issues
 */
export function createFixAllAction(
  diagnostics: Diagnostic[],
  documentText: string
): CodeAction | null {
  const edits: TextEdit[] = [];

  // Collect all auto-fixable edits
  for (const diagnostic of diagnostics) {
    const actions = getCodeActionsForDiagnostic(diagnostic, documentText);
    const preferredAction = actions.find((a) => a.isPreferred);

    if (preferredAction?.edit?.changes) {
      const actionEdits = Object.values(preferredAction.edit.changes).flat();
      edits.push(...actionEdits);
    }
  }

  if (edits.length === 0) {
    return null;
  }

  return {
    title: `Fix all auto-fixable issues (${edits.length})`,
    kind: CodeActionKind.SourceFixAll,
    edit: {
      changes: {
        '': edits,
      },
    },
  };
}
