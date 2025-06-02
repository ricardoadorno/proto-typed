import { DSL_LANGUAGE_ID, DSL_TOKEN_TYPES } from '../constants';
import * as monaco from 'monaco-editor';

/**
 * Register the Proto-type DSL language with Monaco Editor
 */
export function registerDSLLanguage() {
  // Register the language
  monaco.languages.register({
    id: DSL_LANGUAGE_ID,
    extensions: ['.dsl', '.proto'],
    aliases: ['Proto-type DSL', 'dsl', 'proto-type'],
  });

  // Set the monarch tokenizer with corrected rules
  monaco.languages.setMonarchTokensProvider(DSL_LANGUAGE_ID, {
    tokenizer: {
      root: [
        // Complex patterns first (most specific to least specific)
        
        // Screen declarations - complete pattern
        [/@screen\s+([A-Za-z_]\w*)\s*(\{[^}]*\})?\s*:/, [
          DSL_TOKEN_TYPES.screen,
          DSL_TOKEN_TYPES.identifier,
          DSL_TOKEN_TYPES.attribute
        ]],
        
        // Buttons @[text]{icon}(action) - handle all parts as one token for now
        [/@\[[^\]]+\](\{[^}]*\})?(\([^)]*\))?/, DSL_TOKEN_TYPES.button],
        
        // Links #[text](destination)
        [/#\[[^\]]+\](\([^)]*\))?/, DSL_TOKEN_TYPES.link],
        
        // Images ![alt](url)
        [/!\[[^\]]*\](\([^)]*\))?/, DSL_TOKEN_TYPES.image],
        
        // Input fields with all variants
        [/___[\*\-]?:[^(]+(\([^)]*\))(\[.*\])?/, DSL_TOKEN_TYPES.input],
        
        // Mobile elements with parameters
        [/(nav_item|drawer_item)\s+\[[^\]]+\]\{[^}]*\}(\([^)]*\))?/, DSL_TOKEN_TYPES.mobile],
        
        // Layout elements (before generic identifiers)
        [/\b(container|card|row|col|section|sidebar|grid|flex|list)(?=\s*:)/, DSL_TOKEN_TYPES.layout],
        
        // Mobile container elements
        [/\b(header|bottom_nav|drawer|fab)(?=\s*:)/, DSL_TOKEN_TYPES.mobile],
        
        // Display elements with attributes
        [/\b(progress|badge|avatar)\s+(\{[^}]*\}|"[^"]*")/, DSL_TOKEN_TYPES.attribute],
        
        // Headings (# to ######)
        [/#{1,6}\s+.*$/, DSL_TOKEN_TYPES.heading],
        
        // Text content types
        [/>\s+.*$/, DSL_TOKEN_TYPES.text],
        [/\*>\s+.*$/, DSL_TOKEN_TYPES.note],
        [/\">\s+.*$/, DSL_TOKEN_TYPES.quote],
        
        // Checkboxes and radio buttons
        [/\[[X\s]\]\s+.*$/, DSL_TOKEN_TYPES.checkbox],
        [/\([X\s]\)\s+.*$/, DSL_TOKEN_TYPES.radio],
        
        // List items
        [/^\s*-\s+.*$/, DSL_TOKEN_TYPES.text],
        [/^\s*\d+\.\s+.*$/, DSL_TOKEN_TYPES.text],
        
        // Separators
        [/---+/, DSL_TOKEN_TYPES.separator],
        
        // Attributes (after more specific rules)
        [/\{[^}]*\}/, DSL_TOKEN_TYPES.attribute],
        
        // URLs
        [/(https?:\/\/[^\s\)]+)/, DSL_TOKEN_TYPES.url],
        
        // Generic identifiers (before delimiters)
        [/[A-Za-z_]\w*(?=\s*:)/, DSL_TOKEN_TYPES.identifier],
        
        // Delimiters (most generic - should be last)
        [/:/, DSL_TOKEN_TYPES.colon],
        [/\[/, DSL_TOKEN_TYPES.brackets],
        [/\]/, DSL_TOKEN_TYPES.brackets],
        [/\(/, DSL_TOKEN_TYPES.parentheses],
        [/\)/, DSL_TOKEN_TYPES.parentheses],
        [/\{/, DSL_TOKEN_TYPES.braces],
        [/\}/, DSL_TOKEN_TYPES.braces],
        
        // Whitespace
        [/[ \t\r\n]+/, DSL_TOKEN_TYPES.whitespace],
        
        // Fallback identifier
        [/[a-zA-Z_]\w*/, DSL_TOKEN_TYPES.identifier],
      ],
    },
  });

  // Configure language settings (no comments since DSL doesn't use them)
  monaco.languages.setLanguageConfiguration(DSL_LANGUAGE_ID, {
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    indentationRules: {
      increaseIndentPattern: /.*:$/,
      decreaseIndentPattern: /^\s*$/,
    },
    folding: {
      markers: {
        start: /^\s*.*:$/,
        end: /^\s*\S/, // End when we find a line with content at same or less indentation
      },
    },
  });
}
