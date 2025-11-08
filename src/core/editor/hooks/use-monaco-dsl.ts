/**
 * React Hook: Monaco DSL Initialization + Diagnostics
 * 
 * Manages Monaco Editor initialization for the proto-typed DSL.
 * Handles language registration, theme setup, completion provider,
 * and integrates with ErrorBus for real-time error markers.
 * 
 * Usage:
 * ```tsx
 * const { monaco, isInitialized, error, editorRef } = useMonacoDSL();
 * 
 * if (error) return <ErrorDisplay error={error} />;
 * if (!isInitialized) return <LoadingSpinner />;
 * 
 * <Editor
 *   onMount={(editor) => editorRef.current = editor}
 *   // ... other props
 * />
 * ```
 * 
 * @returns {object} Monaco instance, initialization state, error state, and editor ref
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useMonaco } from '@monaco-editor/react';
import { initializeMonacoDSL } from '../index';
import { ErrorBus } from '../../error-bus';
import type { ProtoError, Severity } from '../../../types/errors';
import { SEVERITY_RANK } from '../../../types/errors';
import { runLintRules } from '../lint/lint-rules';
import type { LintContext } from '../lint/lint-rules';

/**
 * Custom hook to manage Monaco DSL initialization and diagnostics
 */
export function useMonacoDSL() {
  const monaco = useMonaco()
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const [isEditorMounted, setIsEditorMounted] = useState(false);
  const lintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!monaco || isInitialized) return;
    (async () => {
      try {
        await initializeMonacoDSL(monaco);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    })();
  }, [monaco, isInitialized]);

  // Run lint rules on content change (debounced)
  const runLint = useCallback((content: string) => {
    // Clear previous timeout
    if (lintTimeoutRef.current) {
      clearTimeout(lintTimeoutRef.current);
    }

    // Debounce lint execution (300ms after last change)
    lintTimeoutRef.current = setTimeout(() => {
      const lines = content.split('\n');
      const context: LintContext = {
        source: content,
        lines,
        existingErrors: ErrorBus.get().getAll(),
      };

      // Clear previous editor-stage lint errors
      ErrorBus.get().clear('editor');

      // Run lint rules and emit new errors
      const lintErrors = runLintRules(context);
      if (lintErrors.length > 0) {
        ErrorBus.get().bulk(lintErrors);
      }
    }, 300);
  }, []);

  // Subscribe to content changes for lint
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !isEditorMounted) return;

    const model = editor.getModel();
    if (!model) return;

    // Run initial lint
    runLint(model.getValue());

    // Subscribe to content changes
    const disposable = model.onDidChangeContent(() => {
      runLint(model.getValue());
    });

    return () => {
      disposable.dispose();
      if (lintTimeoutRef.current) {
        clearTimeout(lintTimeoutRef.current);
      }
    };
  }, [isEditorMounted, runLint]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !monaco || !isEditorMounted) return;
    const model = editor.getModel();
    if (!model) return;

    const applyMarkers = (errors: ProtoError[]) => {
      if (!errors.length) {
        monaco.editor.setModelMarkers(model, 'proto-typed', []);
        return;
      }

      const bestByLine = getBestErrorPerLine(errors);
      const markers = [...bestByLine.values()].map((err) => ({
        startLineNumber: err.line || 1,
        startColumn: err.column || 1,
        endLineNumber: err.line || 1,
        endColumn: model.getLineMaxColumn(err.line || 1),
        message: formatErrorMessage(err),
        severity: toMonacoSeverity(err.severity),
        source: `proto-typed-${err.stage}`,
      }));

      monaco.editor.setModelMarkers(model, 'proto-typed', markers);
    };

    // Subscribe will immediately call applyMarkers with current errors
    const unsubscribe = ErrorBus.get().subscribe(applyMarkers);
    
    return () => unsubscribe();
  }, [isInitialized, monaco, isEditorMounted]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    setIsEditorMounted(true);
  };

  return { monaco, isInitialized, error, editorRef, handleEditorMount };
}

// ============================================================
// Helper Functions for Diagnostics
// ============================================================

/**
 * Groups errors by line, keeping only the highest severity error per line
 * Prevents visual clutter from multiple markers on the same line
 */
function getBestErrorPerLine(errors: ProtoError[]): Map<number, ProtoError> {
  const bestByLine = new Map<number, ProtoError>();

  for (const err of errors) {
    if (!err.line) continue;

    const prev = bestByLine.get(err.line);
    if (!prev || SEVERITY_RANK[err.severity] > SEVERITY_RANK[prev.severity]) {
      bestByLine.set(err.line, err);
    }
  }

  return bestByLine;
}

/**
 * Formats error message for Monaco display
 * Enhanced format with stage badge, message, hint, and error code
 * Format: [STAGE] message — hint (code: ERROR_CODE)
 *
 * @version 0.0.2 - Enhanced with error code and better formatting
 */
function formatErrorMessage(err: ProtoError): string {
  // Stage badge with uppercase
  const stageBadge = `[${err.stage.toUpperCase()}]`;

  // Main message
  let msg = `${stageBadge} ${err.message}`;

  // Add node type context if available
  if (err.nodeType && !err.message.includes(err.nodeType)) {
    msg += ` (in ${err.nodeType})`;
  }

  // Add hint with clear separator
  if (err.hint) {
    msg += `\n💡 ${err.hint}`;
  }

  // Add error code for reference
  if (err.code) {
    msg += `\n📋 Error code: ${err.code}`;
  }

  return msg;
}

export enum MarkerSeverity {
    Hint = 1,
    Info = 2,
    Warning = 4,
    Error = 8
}

/**
 * Converts Proto-Typed Severity to Monaco MarkerSeverity
 */
function toMonacoSeverity(severity: Severity): MarkerSeverity {
  switch (severity) {
    case 'fatal':
    case 'error':
      return MarkerSeverity.Error;
    case 'warning':
      return MarkerSeverity.Warning;
    case 'info':
      return MarkerSeverity.Info;
    default:
      return MarkerSeverity.Hint;
  }
}
