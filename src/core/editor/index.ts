import { Monaco } from '@monaco-editor/react';
import { registerDSLCompletionProvider } from './completion/dsl-completion';
import { registerDSLLanguage } from './language/dsl-language';
import { registerDSLTheme } from './theme/dsl-theme';

// Re-export components and hooks
export { DSLEditor } from './components/dsl-editor';
export { useMonacoDSL } from './hooks/use-monaco-dsl';

/**
 * Initialize Monaco DSL language and features
 * This function should be called from beforeMount callback
 */
export function initializeMonacoDSL(monaco: Monaco) {
  registerDSLLanguage(monaco);
  registerDSLTheme(monaco);
  registerDSLCompletionProvider(monaco);
}

/**
 * Configure Monaco editor options for DSL
 */
export function getDSLEditorOptions() {
  return {
    fontSize: 14,
    minimap: { enabled: false },
    wordWrap: "on" as const,
    wrappingIndent: "same" as const,
    lineNumbers: "on" as const,
    padding: { top: 16, bottom: 16 },
    fontFamily: "'JetBrains Mono', 'Fira Code', Monaco, 'Cascadia Code', monospace",
    lineHeight: 1.6,
    cursorBlinking: "smooth" as const,
    smoothScrolling: true,
    contextmenu: true,
    scrollBeyondLastLine: false,
    bracketPairColorization: { enabled: true },
    autoIndent: "full" as const,
    formatOnPaste: true,
    formatOnType: true,
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showFunctions: true,
      showConstructors: true,
      showFields: true,
      showVariables: true,
      showClasses: true,
      showStructs: true,
      showInterfaces: true,
      showModules: true,
      showProperties: true,
      showEvents: true,
      showOperators: true,
      showUnits: true,
      showValues: true,
      showConstants: true,
      showEnums: true,
      showEnumMembers: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showFolders: true,
      showTypeParameters: true,
      showUsers: true,
      showIssues: true,
    },
  };
}
