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
  // Set a very basic monarch tokenizer to avoid any reference issues
  monaco.languages.setMonarchTokensProvider(DSL_LANGUAGE_ID, {
    tokenizer: {
      root: [
        [/^(screen|modal|drawer)\s/, 'keyword.screen'],
        [/(component)\s/, 'keyword.component'],

        [/\b(container|grid|flex|card|row|col|section|list):\s*$/, 'tag'],
        [/\b(header|navigator|fab):\s*$/, 'tag'],
        [/\blist:\s*$/, 'tag'],
        [/\bavatar\b/, 'tag'],

        [/(#{1,6})\s+/, 'typography.heading'],
        [/>/, 'typography'],
        [/\*>/, 'typography'],
        [/\">/, 'typography.quote'],

        [/@[\w+=-]|@(?=\[)/, 'type'],
        [/#(?=\[)/, 'type'],
        [/!(?=\[)/, 'variable'],

        [/\$\w+/, 'variable.component'],
        [/\(([^}]+)\)/, 'variable.name'],
        [/(\S+):/, 'variable.name'],

        [/___[*-]?:/, 'number'],

        [/\[[X\s]\]/, 'constructor'],
        [/\([X\s]\)/, 'constructor'],

        [/^\s*-/, 'string'],
        [/^\s*\d+\./, 'string'],

        [/---+/, 'delimiter'],
        [/--(?!-)/, 'delimiter'],
        [/[\[\]()]/, 'delimiter.bracket'],

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
