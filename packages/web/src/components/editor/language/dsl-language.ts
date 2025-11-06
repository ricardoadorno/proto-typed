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

import { DSL_LANGUAGE_ID } from '../constants'
import { Monaco } from '@monaco-editor/react'

/**
 * Register the proto-typed DSL language with Monaco Editor
 */
export function registerDSLLanguage(monaco: Monaco) {
  // Register the language
  monaco.languages.register({
    id: DSL_LANGUAGE_ID,
    extensions: ['.dsl', '.proto'],
    aliases: ['proto-typed DSL', 'dsl', 'proto-typed'],
  })

  /**
   * Monarch Tokenizer
   * Defines syntax highlighting rules based on actual DSL implementation
   */
  monaco.languages.setMonarchTokensProvider(DSL_LANGUAGE_ID, {
    tokenizer: {
      root: [
        // ========================================
        // VIEWS (screen, modal, drawer)
        // Capture keyword and name separately for different colors
        // ========================================
        [
          /^(screen|modal|drawer)(\s+)(\w+)(:)/,
          ['keyword.view', 'white', 'entity.name.view', 'delimiter.colon'],
        ],

        // ========================================
        // COMPONENTS
        // Capture keyword and name separately for different colors
        // Only highlight $ComponentName if it starts with uppercase letter
        // ========================================
        [
          /^(component)(\s+)(\w+)(:)/,
          [
            'keyword.component',
            'white',
            'entity.name.component',
            'delimiter.colon',
          ],
        ],
        [/\$[A-Z]\w*/, 'variable.component'], // $ComponentName (only if starts with uppercase)
        [/%\w+/, 'variable.prop'], // %propName

        // ========================================
        // STYLES
        // ========================================
        [/^styles:/, 'keyword.styles'],
        [/--[\w-]+/, 'variable.css'], // --custom-property

        // ========================================
        // LAYOUTS (Canonical Presets)
        // Containers, Stacks, Rows, Grids, Cards, Special layouts
        // Pattern: exact preset names (no modifiers)
        // ========================================
        [
          /\b(container-narrow|container-wide|container-full|container)\b/,
          'keyword.layout',
        ],
        [/\b(stack-none|stack-flush|stack-tight|stack-loose|stack)\b/, 'keyword.layout'],
        [/\b(row-start|row-center|row-between|row-end|row)\b/, 'keyword.layout'],
        [/\b(grid-2|grid-3|grid-4|grid-responsive|grid-auto|grid)\b/, 'keyword.layout'],
        [/\b(layer-overlay|layer-sticky|layer-fixed|layer-absolute|layer-relative|layer-static)\b/, 'keyword.layout'],
        [/\b(scroll-x|scroll-y|scroll-auto|scroll-hidden)\b/, 'keyword.layout'],
        [/\b(card-compact|card-feature|card)\b/, 'keyword.layout'],
        [/\b(sidebar)\b/, 'keyword.layout'],
        [/\b(navigator|list|fab)\b/, 'keyword.layout'],

        // ========================================
        // STRUCTURES (header and separator)
        // Note: list, card, navigator moved to layouts section
        // ========================================
        [/\b(header)\b/, 'keyword.structure'],
        [/^\s*---+/, 'delimiter.separator'], // --- separator

        // ========================================
        // TYPOGRAPHY
        // ========================================
        [/^\s*#{1,4}\s+/, 'markup.heading'], // # to ####
        [/^\s*\*\*>\s/, 'markup.note'], // **> note
        [/^\s*\*(?!\*)>\s/, 'markup.quote'], // *> blockquote
        [/^\s*>>>\s/, 'markup.muted'], // >>> (must be before >>)
        [/^\s*>>\s/, 'markup.text'], // >> small
        [/^\s*>\s/, 'markup.paragraph'], // > paragraph

        // ========================================
        // BUTTONS
        // New system: @variant-size[text](action)
        // Variants: @primary, @secondary, @outline, @ghost, @destructive, @success, @warning
        // Sizes: -small, -icon, -large (optional, default without modifier)
        // ========================================
        [
          /@(primary|secondary|outline|ghost|destructive|success|warning)(?:-(small|icon|large))?(?=\[)/,
          'keyword.button',
        ],
        [/@(?=\[)/, 'keyword.button'], // Default button (no variant specified)

        // ========================================
        // ROUTE REFERENCES in Links/Buttons
        // Pattern: ](RouteReference) where RouteReference starts with capital letter
        // Must come BEFORE generic delimiters to capture properly
        // ========================================
        [/\](\()([A-Z]\w*)(\))/, 'entity.name.view'],

        // ========================================
        // LINKS & IMAGES
        // ========================================
        [/(?<!\!)\[[^\]]+\]\(([^)]+)\)/, 'keyword.link'], // [text](destination)
        [/!(?:rounded|circle)(?:-\d+x\d+)?(?=\[)/, 'keyword.image'], // !rounded[alt](url), !circle-64x64[alt](url)
        [/!(?=\[)/, 'keyword.image'], // ![alt](url)

        // ========================================
        // FORMS
        // Highlight specific input types when followed by the new bracket syntax
        // ========================================
        [/___(?:email)(?=\s*\[)/i, 'keyword.input.email'],
        [/___(?:password)(?=\s*\[)/i, 'keyword.input.password'],
        [/___(?:date)(?=\s*\[)/i, 'keyword.input.date'],
        [/___(?:number)(?=\s*\[)/i, 'keyword.input.number'],
        [/___(?:textarea)(?=\s*\[)/i, 'keyword.input.textarea'],
        [/___(?=\s*\[)/, 'keyword.input'],
        [/\[[X\s]\]/, 'keyword.checkbox'], // [X], [ ]
        [/^\s*\([X\s]\)/, 'keyword.radio'], // (X), ( ) at start of line only

        // ========================================
        // ICONS
        // Pattern: <space>i-IconName<space>
        // Highlight icon references like "i-Home" or "i-Settings"
        // ========================================
        [/\bi-[A-Z]\w*\b/, 'entity.name.icon'], // Icon references like i-Home, i-Settings

        // ========================================
        // LIST & NAVIGATOR ITEMS
        // Format: - text | destination or - text | icon | destination
        // ========================================
        [/^\s*-\s+/, 'markup.list'], // Regular list items (-)

        // ========================================
        // DELIMITERS & SYMBOLS
        // Note: Parentheses only highlighted in specific contexts:
        // - Radio buttons: (X), ( ) at start of line
        // - Route references: ](RouteRef)
        // Generic parentheses have no color
        // ========================================
        [/\|/, 'delimiter.pipe'], // Pipe separator (navigator, props)
        [/[[\]]/, 'delimiter.bracket'], // Square brackets
        [/[{}]/, 'delimiter.brace'], // Curly braces
        [/:/, 'delimiter.colon'], // Colon

        // ========================================
        // WHITESPACE
        // ========================================
        [/[ \t\r\n]+/, 'white'],
      ],
    },
  })

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
  })
}
