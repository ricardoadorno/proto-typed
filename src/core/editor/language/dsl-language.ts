import { DSL_LANGUAGE_ID } from '../constants';
import { Monaco } from '@monaco-editor/react';

/**
 * Register the Proto-type DSL language with Monaco Editor
 */
export function registerDSLLanguage(monaco: Monaco) {
  // Register the language
  monaco.languages.register({
    id: DSL_LANGUAGE_ID,
    extensions: ['.dsl', '.proto'],
    aliases: ['Proto-type DSL', 'dsl', 'proto-type'],
  });
  // Set a very basic monarch tokenizer to avoid any reference issues
  monaco.languages.setMonarchTokensProvider(DSL_LANGUAGE_ID, {
    tokenizer: {
      root: [
        // Layout components - specific highlighting for container elements
        [/\b(container|grid|flex|card|row|col|section):\s*$/, 'tag'],
        
        // Mobile components
        [/\b(header|bottom_nav|fab|nav_item|drawer_item):\s*$/, 'tag'],
        
        // Named UI elements (modal, drawer)
        [/\b(modal|drawer)\s+\w+:\s*$/, 'keyword.named-ui-element'],
          // Basic patterns using only standard Monaco tokens        
        [/(screen)\s/, 'keyword.screen'],
        [/(component)\s/, 'keyword.component'],
        [/@\[.*?\]/, 'type'],          // buttons
        [/#\[.*?\]/, 'type'],        // links  
        [/\(([^}]+)\)/, 'variable.name'],        
        [/\$\w+/, 'variable.name'],    // variables like $LoginForm
        [/!\[.*?\]/, 'variable'],      // images
        [/___[*-]?:/, 'number'],       // inputs
        [/\[[X ]\]/, 'constructor'],   // checkboxes        [/\([X ]\)/, 'constructor'],   // radio buttons
        [/---+/, 'delimiter'],         // separators
        [/--(?!-)/, 'delimiter'],      // empty div (exactly two dashes)
        [/>/, 'string'],               // text content
        [/\*>/, 'comment'],            // note text
        [/\">/, 'string.quote'],       // quote text
        [/(\S+):/, 'variable.name'],            // colons
        [/:/, 'delimiter'],            // colons
        [/[\[\]()]/, 'delimiter.bracket'], // brackets nd parentheses
        [/\[[X\s]\]/, 'constructor'],
        [/\([X\s]\)/, 'constructor'],
        
        // List components
        [/\blist:\s*$/, 'tag'],
        [/\bprogress\b/, 'tag'],
        [/\bbadge\b/, 'tag'],
        [/\bavatar\b/, 'tag'],
        
        // List items
        [/^\s*-/, 'string'],
        [/^\s*\d+\./, 'string'],
        [/[ \t\r\n]+/, 'white'],         // whitespace
      ],
    },
  });

  // Configure language settings
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
  });
}
