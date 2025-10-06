/**
 * Monaco Language Definition for proto-typed DSL
 * 
 * Registers the DSL language with Monaco Editor and defines:
 * - Language configuration (brackets, auto-closing pairs, indentation)
 * - Monarch tokenizer for syntax highlighting
 * 
 * Tokenization rules match actual DSL syntax from copilot-instructions.md
 * 
 * @see copilot-instructions.md for complete DSL syntax reference
 */

import { DSL_LANGUAGE_ID } from '../constants';
import { Monaco } from '@monaco-editor/react';

/**
 * Register the proto-typed DSL language with Monaco Editor
 */
export function registerDSLLanguage(monaco: Monaco) {
  // Register the language
  monaco.languages.register({
    id: DSL_LANGUAGE_ID,
    extensions: ['.dsl', '.proto'],
    aliases: ['proto-typed DSL', 'dsl', 'proto-typed'],
  });

  /**
   * Monarch Tokenizer
   * Defines syntax highlighting rules based on actual DSL implementation
   */
  monaco.languages.setMonarchTokensProvider(DSL_LANGUAGE_ID, {
    tokenizer: {
      root: [
        // ========================================
        // VIEWS (screen, modal, drawer)
        // ========================================
        [/^(screen|modal|drawer)\s+\w+:/, 'keyword.view'],

        // ========================================
        // COMPONENTS
        // ========================================
        [/^component\s+\w+:/, 'keyword.component'],
        [/\$\w+/, 'variable.component'],       // $ComponentName
        [/%\w+/, 'variable.prop'],             // %propName

        // ========================================
        // STYLES
        // ========================================
        [/^styles:/, 'keyword.styles'],
        [/--[\w-]+/, 'variable.css'],          // --custom-property

        // ========================================
        // LAYOUTS (row, col, grid, container with modifiers)
        // Pattern: element-modifier1-modifier2:
        // ========================================
        [/\b(row|col|grid|container)(?:-[\w\d]+)*:/, 'keyword.layout'],

        // ========================================
        // STRUCTURES
        // ========================================
        [/\b(card)(?:-[\w\d]+)*:/, 'keyword.structure'],
        [/\b(header|navigator)(?:-[\w\d]+)*:/, 'keyword.structure'],
        [/\blist(?:\s+\$\w+)?:/, 'keyword.structure'],  // list: or list $Component:
        [/fab\{[\w-]+\}\([\w-]+\)/, 'keyword.structure'],  // fab{icon}(action)
        [/^---+/, 'delimiter.separator'],      // --- separator

        // ========================================
        // TYPOGRAPHY
        // ========================================
        [/^#{1,6}\s+/, 'markup.heading'],      // # to ######
        [/^>\s/, 'markup.paragraph'],          // >
        [/^>>\s/, 'markup.text'],              // >>
        [/^>>>\s/, 'markup.muted'],            // >>>
        [/^\*>\s/, 'markup.note'],             // *>
        [/^">\s/, 'markup.quote'],             // ">

        // ========================================
        // BUTTONS
        // Pattern: (@{1,3})([_+\-=!]?)\[text\](?:\{icon\})?(?:\(action\))?
        // ========================================
        [/@{1,3}[_+\-=!]?(?=\[)/, 'keyword.button'],

        // ========================================
        // LINKS & IMAGES
        // ========================================
        [/#(?=\[)/, 'keyword.link'],           // #[text](dest)
        [/!(?=\[)/, 'keyword.image'],          // ![alt](url)

        // ========================================
        // FORMS
        // ========================================
        [/___[*-]?:/, 'keyword.input'],        // ___, ___*, ___-
        [/\[[X\s]\]/, 'keyword.checkbox'],     // [X], [ ]
        [/\([X\s]\)/, 'keyword.radio'],        // (X), ( )

        // ========================================
        // NAVIGATOR ITEMS
        // Format: - text | destination or - text | icon | destination
        // ========================================
        [/^\s*-\s+i-\w+/, 'keyword.structure'], // - i-IconName (icon-first format)
        [/^\s*-\s+/, 'string'],                 // Regular list items

        // ========================================
        // DELIMITERS & SYMBOLS
        // ========================================
        [/\|/, 'delimiter.pipe'],              // Pipe separator (navigator, props)
        [/[\[\]]/, 'delimiter.bracket'],       // Square brackets
        [/[()]/, 'delimiter.parenthesis'],     // Parentheses
        [/[{}]/, 'delimiter.brace'],           // Curly braces
        [/:/, 'delimiter.colon'],              // Colon

        // ========================================
        // WHITESPACE
        // ========================================
        [/[ \t\r\n]+/, 'white'],
      ],
    },
  });

  /**
   * Language Configuration
   * Defines editor behavior for brackets, auto-closing, and indentation
   */
  monaco.languages.setLanguageConfiguration(DSL_LANGUAGE_ID, {
    // Bracket pairs for matching/highlighting
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],

    // Auto-closing pairs (when typing opening char, insert closing char)
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],

    // Surrounding pairs (when selecting text and typing opening char)
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],

    // Indentation rules
    indentationRules: {
      // Increase indent after lines ending with ':'
      increaseIndentPattern: /.*:$/,
      // Decrease indent on empty lines
      decreaseIndentPattern: /^\s*$/,
    },

    // Comments configuration (if needed in future)
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
  });
}
