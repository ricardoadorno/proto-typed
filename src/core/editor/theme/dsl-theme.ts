import { Monaco } from '@monaco-editor/react';

/**
 * Define custom dark theme for the DSL
 */
export function registerDSLTheme(monaco: Monaco) {// Define only the dark theme
  monaco.editor.defineTheme('proto-type-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // DSL specific tokens using standard Monaco token types
      { token: 'keyword', foreground: 'ff6b6b', fontStyle: 'bold' },        // @screen and layout
      { token: 'type', foreground: '60a5fa', fontStyle: 'bold' },           // buttons
      { token: 'string', foreground: '34d399' },                            // links and text
      { token: 'variable', foreground: 'f472b6' },                          // images
      { token: 'number', foreground: 'a855f7' },                            // inputs
      { token: 'tag', foreground: 'ec4899', fontStyle: 'bold' },            // mobile elements
      { token: 'attribute', foreground: '8b5cf6' },                         // attributes
      { token: 'metatag', foreground: '95e1d3', fontStyle: 'bold' },        // headings
      { token: 'comment', foreground: 'fbbf24', fontStyle: 'italic' },      // notes
      { token: 'string.quote', foreground: 'a78bfa', fontStyle: 'italic' }, // quotes
      { token: 'constructor', foreground: '10b981' },                       // checkboxes/radio
      { token: 'delimiter', foreground: 'ffe66d' },                         // separators and colons
      { token: 'delimiter.bracket', foreground: 'ffe66d' },                 // brackets
      { token: 'delimiter.curly', foreground: 'ffe66d' },                   // braces
      { token: 'string.uri', foreground: '06b6d4', fontStyle: 'underline' }, // URLs
      { token: 'identifier', foreground: '4ecdc4' },                        // identifiers
    ],
    colors: {
      'editor.background': '#0f172a',
      'editor.foreground': '#e2e8f0',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#94a3b8',
      'editor.selectionBackground': '#334155',
      'editor.inactiveSelectionBackground': '#1e293b',
      'editorCursor.foreground': '#60a5fa',
      'editor.findMatchBackground': '#fbbf24',
      'editor.findMatchHighlightBackground': '#f59e0b',
    },
  });
}
