import { EditorProps } from '@monaco-editor/react';
import { Monaco } from '@monaco-editor/react';
import { registerDSLLanguage } from './language/dsl-language';
import { registerDSLTheme } from './theme/dsl-theme';
import { registerDSLCompletionProvider } from './completion/dsl-completion';

export { DSLEditor } from './components/dsl-editor';

let dslInitialized = false;

export function initializeMonacoDSL(monaco: Monaco) {
    if (dslInitialized) {
        return;
    }

    registerDSLLanguage(monaco);
    registerDSLTheme(monaco);
    registerDSLCompletionProvider(monaco);

    dslInitialized = true;
}

export function getDSLEditorOptions(): EditorProps['options'] {
    return {
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'off',
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        wordWrap: 'on',
        wrappingIndent: 'indent',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        renderLineHighlight: 'none',
        scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden'
        },
    };
}
