import { Editor } from '@monaco-editor/react';
import { useMonacoDSL } from '../hooks/use-monaco-dsl';
import { getDSLEditorOptions } from '../index';
import { DSL_LANGUAGE_ID } from '../constants';
import { LoadingSpinner } from '../../../components/ui';

interface DSLEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    height?: string;
    theme?: string;
}

/**
 * Monaco Editor component configured specifically for the Proto-type DSL
 */
export function DSLEditor({
    value,
    onChange,
    height = "100%",
    theme = "proto-type-dark"
}: DSLEditorProps) {
    const { isInitialized, error } = useMonacoDSL();

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900/20">
                <div className="text-center">
                    <div className="text-red-600 dark:text-red-400 mb-2">Failed to initialize editor</div>
                    <div className="text-sm text-red-500 dark:text-red-300">{error}</div>
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
        />
    );
}
