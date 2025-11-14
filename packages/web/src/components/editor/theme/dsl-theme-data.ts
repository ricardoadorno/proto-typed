export const DSL_THEME_NAME = 'proto-typed-dark' as const

interface TokenRule {
  token: string | string[]
  foreground: string
  fontStyle?: string
}

export const DSL_TOKEN_RULES: TokenRule[] = [
  // Meta & Head Configuration
  { token: 'entity.name.tag.pty', foreground: '#a78bfa', fontStyle: 'bold' }, // meta:, head:
  { token: 'entity.name.type.pty', foreground: '#8b5cf6', fontStyle: 'bold' }, // color:, font:
  { token: 'variable.other.property.pty', foreground: '#00d9ff' }, // primary, secondary, base, family
  { token: 'constant.numeric.color.hex.pty', foreground: '#4ade80' }, // #3b82f6
  { token: 'constant.numeric.pty', foreground: '#34d399' }, // 16, 0.0.1
  { token: 'string.quoted.double.pty', foreground: '#fbbf24' }, // "text"
  { token: 'string.quoted.single.pty', foreground: '#fbbf24' }, // 'text'
  { token: 'string.unquoted.pty', foreground: '#e2e8f0' }, // > paragraph text

  // Views
  { token: 'keyword.control.pty', foreground: '#ff6b6b', fontStyle: 'bold' }, // screen, modal, drawer
  { token: 'entity.name.class.pty', foreground: '#00d9ff', fontStyle: 'bold' }, // View names
  { token: 'keyword.view', foreground: '#ff6b6b', fontStyle: 'bold' },
  { token: 'entity.name.view', foreground: '#00d9ff', fontStyle: 'bold' },

  // Components
  { token: 'keyword.component', foreground: '#ff6b6b', fontStyle: 'bold' },
  { token: 'entity.name.function.pty', foreground: '#4ade80', fontStyle: 'bold' }, // Component names
  {
    token: 'entity.name.component',
    foreground: '#4ade80',
    fontStyle: 'bold',
  },
  { token: 'variable.other.constant.pty', foreground: '#4ade80', fontStyle: 'bold' }, // $Component
  { token: 'variable.component', foreground: '#4ade80', fontStyle: 'bold' },
  { token: 'variable.parameter.pty', foreground: '#f59e0b', fontStyle: 'italic' }, // %propName
  { token: 'variable.prop', foreground: '#f59e0b', fontStyle: 'italic' },

  // Styles
  { token: 'keyword.styles', foreground: '#a78bfa', fontStyle: 'bold' },
  { token: 'keyword.other.pty', foreground: '#a78bfa', fontStyle: 'bold' }, // styles:
  { token: 'support.constant.property-name.pty', foreground: '#8b5cf6' }, // --custom-prop
  { token: 'variable.css', foreground: '#8b5cf6' },

  // Layouts
  { token: 'storage.type.pty', foreground: '#ec4899', fontStyle: 'bold' }, // container, stack, row, etc
  { token: 'keyword.layout', foreground: '#ec4899', fontStyle: 'bold' },

  // Structures
  { token: 'keyword.structure', foreground: '#ec4899', fontStyle: 'bold' },
  { token: 'keyword.operator.symbol.pty', foreground: '#ffe66d' }, // -, ---, :

  // Typography
  { token: 'markup.heading.pty', foreground: '#a78bfa', fontStyle: 'bold' }, // # ## ### ####
  { token: 'markup.heading.content.pty', foreground: '#e2e8f0', fontStyle: 'bold' },
  { token: 'markup.heading', foreground: '#a78bfa', fontStyle: 'bold' },
  { token: 'markup.paragraph', foreground: '#e2e8f0' },
  { token: 'markup.text', foreground: '#e2e8f0' },
  { token: 'markup.italic.pty', foreground: '#94a3b8', fontStyle: 'italic' }, // >> small text
  { token: 'markup.bold.pty', foreground: '#f59e0b', fontStyle: 'bold' }, // **> note
  { token: 'markup.note.pty', foreground: '#fbbf24', fontStyle: 'italic' },
  { token: 'markup.quote.pty', foreground: '#8b5cf6', fontStyle: 'italic' }, // *> quote
  { token: 'markup.list', foreground: '#ffe66d' },
  { token: 'punctuation.definition.pty', foreground: '#64748b' }, // >, >>, >>>

  // Buttons
  { token: 'support.function.pty', foreground: '#60a5fa', fontStyle: 'bold' }, // @primary, @ghost
  { token: 'keyword.button', foreground: '#60a5fa', fontStyle: 'bold' },

  // Links & Images
  { token: 'keyword.link', foreground: '#60a5fa', fontStyle: 'bold' },
  { token: 'keyword.image', foreground: '#60a5fa' },
  { token: 'entity.name.type.pty', foreground: '#60a5fa' }, // URLs, destinations
  { token: 'entity.name.icon', foreground: '#ff8c00' },

  // Forms
  { token: 'string.pty', foreground: '#a855f7' }, // ___email, ___password
  { token: 'keyword.input', foreground: '#a855f7' },
  { token: 'constant.language.boolean.pty', foreground: '#4ade80' }, // [X], ( )
  { token: 'keyword.checkbox', foreground: '#a855f7', fontStyle: 'bold' },
  { token: 'keyword.radio', foreground: '#a855f7', fontStyle: 'bold' },

  // Comments
  { token: 'comment.line.pty', foreground: '#475569', fontStyle: 'italic' }, // //

  // Delimiters & symbols
  { token: 'punctuation.separator.pty', foreground: '#64748b' }, // :
  { token: 'delimiter.separator', foreground: '#ffe66d' },
  { token: 'delimiter.pipe', foreground: '#ffe66d' },
  { token: 'delimiter.bracket', foreground: '#ffe66d' },
  { token: 'delimiter.parenthesis', foreground: '#ffe66d' },
  { token: 'delimiter.brace', foreground: '#ffe66d' },
  { token: 'delimiter.colon', foreground: '#ffe66d' },

  // General tokens
  { token: 'string', foreground: '#e2e8f0' },
  { token: 'identifier', foreground: '#4ecdc4' },
]

export const DSL_EDITOR_COLORS: Record<string, string> = {
  'editor.background': '#0f172a',
  'editor.foreground': '#e2e8f0',
  'editorLineNumber.foreground': '#475569',
  'editorLineNumber.activeForeground': '#94a3b8',
  'editor.selectionBackground': '#334155',
  'editor.inactiveSelectionBackground': '#1e293b',
  'editorCursor.foreground': '#60a5fa',
  'editor.findMatchBackground': '#fbbf2480',
  'editor.findMatchHighlightBackground': '#f59e0b40',
  'editorBracketMatch.background': '#334155',
  'editorBracketMatch.border': '#60a5fa',
  'editorIndentGuide.background': '#1e293b',
  'editorIndentGuide.activeBackground': '#334155',
}
