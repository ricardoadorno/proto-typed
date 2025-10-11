/**
 * Monaco Editor Integration for proto-typed DSL
 * 
 * This module provides the complete Monaco Editor setup for the DSL:
 * - Language registration (syntax, tokenization)
 * - Theme configuration (dark mode)
 * - Completion provider (IntelliSense)
 * - Editor options (optimized for DSL editing)
 * 
 * Main exports:
 * - DSLEditor: React component for the editor
 * - useMonacoDSL: Hook for Monaco initialization
 * - initializeMonacoDSL: Setup function for Monaco features
 * - getDSLEditorOptions: Default editor configuration
 * 
 * Usage:
 * ```tsx
 * import { DSLEditor } from '@/core/editor';
 * 
 *  * @example
 * ```tsx
 * <DSLEditor value={code} onChange={setCode} />
 * ```
 * ```
 */

import { Monaco } from '@monaco-editor/react';
import { registerDSLCompletionProvider } from './completion/dsl-completion';
import { registerDSLLanguage } from './language/dsl-language';
import { registerDSLTheme } from './theme/dsl-theme';

// Re-export components and hooks
export { DSLEditor } from './components/dsl-editor';
export { useMonacoDSL } from './hooks/use-monaco-dsl';

/**
 * Initialize Monaco DSL language and features
 * 
 * This function should be called once when Monaco is loaded.
 * It registers the DSL language, theme, and completion provider.
 * 
 * @param monaco - Monaco instance from @monaco-editor/react
 */
export function initializeMonacoDSL(monaco: Monaco) {
  registerDSLLanguage(monaco);
  registerDSLTheme(monaco);
  registerDSLCompletionProvider(monaco);
}

/**
 * Get optimized Monaco editor options for DSL editing
 * 
 * Returns configuration object with:
 * - Monospace font optimized for code
 * - Disabled minimap for cleaner UI
 * - Word wrap enabled for long lines
 * - Enhanced suggestions (IntelliSense)
 * - Auto-indentation and formatting
 * 
 * @returns Monaco editor options object
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
    // CRITICAL: Enable glyph margin for error markers icons
    glyphMargin: true,
    // Enable line decorations for inline markers
    lineDecorationsWidth: 10,
    // Enable folding (useful for complex structures)
    folding: true,
    // Enable overview ruler to show error positions
    overviewRulerLanes: 3,
    // Ensure hover is enabled to show error messages
    hover: {
      enabled: true,
      delay: 300,
    },
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
