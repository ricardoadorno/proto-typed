/**
 * Monaco Editor Theme for proto-typed DSL
 * 
 * Defines dark theme optimized for DSL syntax highlighting.
 * Token colors align with actual DSL implementation in dsl-language.ts
 * 
 * Design Philosophy:
 * - Dark mode only (no light theme support)
 * - High contrast for readability
 * - Semantic color mapping (views = red, components = green, buttons = blue, etc.)
 * 
 * @see dsl-language.ts for token definitions
 * @see constants.ts for token type mapping
 */

import { Monaco } from '@monaco-editor/react';

/**
 * Register custom dark theme for the DSL
 * Colors chosen for optimal contrast and semantic meaning
 */
export function registerDSLTheme(monaco: Monaco) {
  monaco.editor.defineTheme('proto-typed-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // ========================================
      // VIEWS (screen, modal, drawer)
      // ========================================
      { token: 'keyword.view', foreground: 'ff6b6b', fontStyle: 'bold' },
      { token: 'entity.name.view', foreground: '00d9ff', fontStyle: 'bold' },  // Bright cyan for route names

      // ========================================
      // COMPONENTS
      // ========================================
      { token: 'keyword.component', foreground: 'ff6b6b', fontStyle: 'bold' },
      { token: 'entity.name.component', foreground: '4ade80', fontStyle: 'bold' },  
      { token: 'variable.component', foreground: '4ade80', fontStyle: 'bold' },  // $ComponentName
      { token: 'variable.prop', foreground: 'f59e0b', fontStyle: 'italic' },     // %propName

      // ========================================
      // STYLES
      // ========================================
      { token: 'keyword.styles', foreground: 'a78bfa', fontStyle: 'bold' },
      { token: 'variable.css', foreground: '8b5cf6' },  // CSS custom properties

      // ========================================
      // LAYOUTS (row, col, grid, container, fab)
      // ========================================
      { token: 'keyword.layout', foreground: 'ec4899', fontStyle: 'bold' },

      // ========================================
      // STRUCTURES (list, card, header)
      // Note: navigator has no special highlighting, fab moved to layouts
      // ========================================
      { token: 'keyword.structure', foreground: 'ec4899', fontStyle: 'bold' },

      // ========================================
      // TYPOGRAPHY
      // ========================================
      { token: 'markup.heading', foreground: '34d399', fontStyle: 'bold' },      // # to ######
      { token: 'markup.paragraph', foreground: '34d399' },                       // >
      { token: 'markup.text', foreground: '34d399' },                            // >>
      { token: 'markup.muted', foreground: '6ee7b7' },                           // >>>
      { token: 'markup.note', foreground: '34d399', fontStyle: 'italic' },       // *>
      { token: 'markup.quote', foreground: '34d399', fontStyle: 'italic' },      // ">
      { token: 'markup.list', foreground: 'fbbf24' },                            // - (list items)

      // ========================================
      // BUTTONS
      // ========================================
      { token: 'keyword.button', foreground: '60a5fa', fontStyle: 'bold' },

      // ========================================
      // LINKS & IMAGES
      // ========================================
      { token: 'keyword.link', foreground: '60a5fa', fontStyle: 'bold' },        // #[text](dest)
      { token: 'keyword.image', foreground: '60a5fa' },                          // ![alt](url)
      { token: 'entity.name.icon', foreground: 'ff8c00' },    // i-IconName (bright cyan)

      // ========================================
      // FORMS
      // ========================================
      { token: 'keyword.input', foreground: 'a855f7' },                          // ___, ___*, ___-
      { token: 'keyword.checkbox', foreground: 'a855f7', fontStyle: 'bold' },    // [X], [ ]
      { token: 'keyword.radio', foreground: 'a855f7', fontStyle: 'bold' },       // (X), ( )

      // ========================================
      // DELIMITERS & SYMBOLS
      // ========================================
      { token: 'delimiter.separator', foreground: 'ffe66d' },                    // ---
      { token: 'delimiter.pipe', foreground: 'ffe66d' },                         // |
      { token: 'delimiter.bracket', foreground: 'ffe66d' },                      // [ ]
      { token: 'delimiter.parenthesis', foreground: 'ffe66d' },                  // ( )
      { token: 'delimiter.brace', foreground: 'ffe66d' },                        // { }
      { token: 'delimiter.colon', foreground: 'ffe66d' },                        // :

      // ========================================
      // GENERAL TOKENS
      // ========================================
      { token: 'string', foreground: 'e2e8f0' },                                 // General strings/text
      { token: 'identifier', foreground: '4ecdc4' },                             // Identifiers
    ],

    // ========================================
    // EDITOR COLORS (UI elements)
    // ========================================
    colors: {
      'editor.background': '#0f172a',                    // Dark slate background
      'editor.foreground': '#e2e8f0',                    // Light text
      'editorLineNumber.foreground': '#475569',          // Muted line numbers
      'editorLineNumber.activeForeground': '#94a3b8',    // Active line number
      'editor.selectionBackground': '#334155',           // Selection highlight
      'editor.inactiveSelectionBackground': '#1e293b',   // Inactive selection
      'editorCursor.foreground': '#60a5fa',              // Blue cursor
      'editor.findMatchBackground': '#fbbf2480',         // Find match (yellow, transparent)
      'editor.findMatchHighlightBackground': '#f59e0b40',// Find highlight (orange, transparent)
      'editorBracketMatch.background': '#334155',        // Bracket match background
      'editorBracketMatch.border': '#60a5fa',            // Bracket match border
      'editorIndentGuide.background': '#1e293b',         // Indent guides
      'editorIndentGuide.activeBackground': '#334155',   // Active indent guide
    },
  });
}
