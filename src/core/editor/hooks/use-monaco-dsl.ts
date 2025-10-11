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

import { useEffect, useState, useRef } from 'react';
import { useMonaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { initializeMonacoDSL } from '../index';
import { ErrorBus } from '../../error-bus';
import type { ProtoError, Severity } from '../../../types/errors';
import { SEVERITY_RANK } from '../../../types/errors';

/**
 * Custom hook to manage Monaco DSL initialization and diagnostics
 */
export function useMonacoDSL() {
  const monaco = useMonaco()
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const [isEditorMounted, setIsEditorMounted] = useState(false);

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
 * Format: [stage] message — hint
 */
function formatErrorMessage(err: ProtoError): string {
  let msg = `[${err.stage}] ${err.message}`;
  if (err.hint) {
    msg += ` — ${err.hint}`;
  }
  return msg;
}

/**
 * Converts Proto-Typed Severity to Monaco MarkerSeverity
 */
function toMonacoSeverity(severity: Severity): monaco.MarkerSeverity {
  switch (severity) {
    case 'fatal':
    case 'error':
      return monaco.MarkerSeverity.Error;
    case 'warning':
      return monaco.MarkerSeverity.Warning;
    case 'info':
      return monaco.MarkerSeverity.Info;
    default:
      return monaco.MarkerSeverity.Hint;
  }
}
