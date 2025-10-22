import { Editor, EditorProps } from '@monaco-editor/react';
import { useMonacoDSL } from '../hooks/use-monaco-dsl';
import { getDSLEditorOptions } from '../index';
import { DSL_LANGUAGE_ID } from '../constants';
import { LoadingSpinner } from '@proto-typed/shared';

interface DSLEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    options?: EditorProps['options'];
}

export function DSLEditor({ value, onChange, options }: DSLEditorProps) {
    const { dslConfigured, loading, error } = useMonacoDSL();

    if (loading) {
        return <LoadingSpinner message="Editor loading..." />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="text-red-500">Error loading editor: {error.message}</span>
            </div>
        );
    }

    if (!dslConfigured) {
        return <LoadingSpinner message="Configuring editor..." />;
    }

    return (
        <Editor
            value={value}
            onChange={onChange}
            language={DSL_LANGUAGE_ID}
            options={{ ...getDSLEditorOptions(), ...options }}
            className="h-full w-full"
        />
    );
}
