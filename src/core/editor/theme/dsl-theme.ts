import { DSL_LANGUAGE_ID, DSL_TOKEN_TYPES } from '../constants';
import * as monaco from 'monaco-editor';

/**
 * Define custom dark theme for the DSL
 */
export function registerDSLTheme() {
  // Define only the dark theme
  monaco.editor.defineTheme('proto-type-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // Structural elements
      { token: DSL_TOKEN_TYPES.screen, foreground: 'ff6b6b', fontStyle: 'bold' },
      { token: DSL_TOKEN_TYPES.identifier, foreground: '4ecdc4' },
      { token: DSL_TOKEN_TYPES.colon, foreground: 'ffe66d' },
      
      // Typography
      { token: DSL_TOKEN_TYPES.heading, foreground: '95e1d3', fontStyle: 'bold' },
      { token: DSL_TOKEN_TYPES.text, foreground: 'd1d5db' },
      { token: DSL_TOKEN_TYPES.note, foreground: 'fbbf24', fontStyle: 'italic' },
      { token: DSL_TOKEN_TYPES.quote, foreground: 'a78bfa', fontStyle: 'italic' },
      
      // Interactive elements
      { token: DSL_TOKEN_TYPES.button, foreground: '60a5fa', fontStyle: 'bold' },
      { token: DSL_TOKEN_TYPES.link, foreground: '34d399', fontStyle: 'underline' },
      { token: DSL_TOKEN_TYPES.image, foreground: 'f472b6' },
      
      // Form elements
      { token: DSL_TOKEN_TYPES.input, foreground: 'a855f7' },
      { token: DSL_TOKEN_TYPES.checkbox, foreground: '10b981' },
      { token: DSL_TOKEN_TYPES.radio, foreground: '10b981' },
      { token: DSL_TOKEN_TYPES.select, foreground: 'a855f7' },
      
      // Layout elements
      { token: DSL_TOKEN_TYPES.layout, foreground: 'f59e0b', fontStyle: 'bold' },
      { token: DSL_TOKEN_TYPES.mobile, foreground: 'ec4899', fontStyle: 'bold' },
      
      // Attributes and values
      { token: DSL_TOKEN_TYPES.attribute, foreground: '8b5cf6' },
      { token: DSL_TOKEN_TYPES.attributeValue, foreground: 'fb7185' },
      { token: DSL_TOKEN_TYPES.url, foreground: '06b6d4', fontStyle: 'underline' },
      { token: DSL_TOKEN_TYPES.action, foreground: 'fbbf24' },
      
      // Delimiters
      { token: DSL_TOKEN_TYPES.brackets, foreground: 'ffe66d' },
      { token: DSL_TOKEN_TYPES.parentheses, foreground: 'ffe66d' },
      { token: DSL_TOKEN_TYPES.braces, foreground: 'ffe66d' },
      { token: DSL_TOKEN_TYPES.separator, foreground: '6b7280', fontStyle: 'bold' },
      
      // Comments
      { token: DSL_TOKEN_TYPES.comment, foreground: '6b7280', fontStyle: 'italic' },
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
