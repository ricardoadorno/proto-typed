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
        // Basic patterns using only standard Monaco tokens
        [/@\w+/, 'keyword'],           // @screen, @component, etc.
        [/#\w*/, 'metatag'],           // headings
        [/@\[.*?\]/, 'type'],          // buttons
        [/#\[.*?\]/, 'string'],        // links  
        [/!\[.*?\]/, 'variable'],      // images
        [/___[*-]?:/, 'number'],       // inputs
        [/\[[X ]\]/, 'constructor'],   // checkboxes
        [/\([X ]\)/, 'constructor'],   // radio buttons
        [/\{.*?\}/, 'attribute'],      // attributes
        [/---+/, 'delimiter'],         // separators
        [/>/, 'string'],               // text content
        [/\*>/, 'comment'],            // note text
        [/\">/, 'string.quote'],       // quote text
        [/:/, 'delimiter'],            // colons
        [/[\[\]()]/, 'delimiter.bracket'], // brackets and parentheses
        [/\[[X\s]\]/, 'constructor'],
        [/\([X\s]\)/, 'constructor'],
        
        // List items
        [/^\s*-/, 'string'],
        [/^\s*\d+\./, 'string'],
          [/\w+/, 'identifier'],           // any word
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
