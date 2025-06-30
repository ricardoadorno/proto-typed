import { Editor } from '@monaco-editor/react';
import { useMonacoDSL } from '../hooks/use-monaco-dsl';
import { getDSLEditorOptions } from '../index';
import { DSL_LANGUAGE_ID } from '../constants';
import { LoadingSpinner } from '../../../components/ui';
import { ParsedError } from '../../../types/errors';
import { useEffect, useRef } from 'react';
import { Monaco } from '@monaco-editor/react';

interface DSLEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    height?: string;
    theme?: string;
    errors?: ParsedError[];
}

/**
 * Update Monaco editor error markers for a specific editor instance
 */
function updateErrorMarkers(monaco: Monaco, editor: any, errors: ParsedError[]) {
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    const markers = errors.map(error => {
        const line = error.location?.line || 1;
        const column = error.location?.column || 1;
        const lineLength = model.getLineLength(line);

        return {
            startLineNumber: line,
            endLineNumber: line,
            startColumn: column,
            endColumn: Math.min(column + 10, lineLength + 1),
            message: `${error.title}: ${error.message}${error.suggestion ? `\n💡 ${error.suggestion}` : ''}`,
            severity: monaco.MarkerSeverity.Error,
            source: 'DSL Parser'
        };
    });

    monaco.editor.setModelMarkers(model, 'dsl-parser', markers);
}

/**
 * Monaco Editor component configured specifically for the proto-typedd DSL
 */
export function DSLEditor({
    value,
    onChange,
    height = "100%",
    theme = "proto-typedd-dark",
    errors = []
}: DSLEditorProps) {
    const { monaco, isInitialized, error } = useMonacoDSL();
    const editorRef = useRef<any>(null);

    // Update error markers when errors change
    useEffect(() => {
        if (monaco && editorRef.current && isInitialized) {
            updateErrorMarkers(monaco, editorRef.current, errors);
        }
    }, [monaco, errors, isInitialized]);

    const handleEditorDidMount = (editor: any, monacoInstance: Monaco) => {
        editorRef.current = editor;
        // Set initial error markers if any exist
        if (errors.length > 0) {
            updateErrorMarkers(monacoInstance, editor, errors);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-red-900/20">
                <div className="text-center">
                    <div className="text-red-400 mb-2">Failed to initialize editor</div>
                    <div className="text-sm text-red-300">{error}</div>
                </div>
            </div>
        );
    }

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner message="Loading DSL editor..." />
            </div>
        );
    }

    return (
        <Editor
            height={height}
            language={DSL_LANGUAGE_ID}
            theme={theme}
            value={value}
            onChange={onChange}
            options={getDSLEditorOptions()}
            onMount={handleEditorDidMount}
        />
    );
}
