export const DSL_THEME_NAME = 'proto-typed-dark' as const

interface TokenRule {
  token: string | string[]
  foreground: string
  fontStyle?: string
}

export const DSL_TOKEN_RULES: TokenRule[] = [
  // Views
  { token: 'keyword.view', foreground: '#ff6b6b', fontStyle: 'bold' },
  { token: 'entity.name.view', foreground: '#00d9ff', fontStyle: 'bold' },

  // Components
  { token: 'keyword.component', foreground: '#ff6b6b', fontStyle: 'bold' },
  {
    token: 'entity.name.component',
    foreground: '#4ade80',
    fontStyle: 'bold',
  },
  { token: 'variable.component', foreground: '#4ade80', fontStyle: 'bold' },
  { token: 'variable.prop', foreground: '#f59e0b', fontStyle: 'italic' },

  // Styles
  { token: 'keyword.styles', foreground: '#a78bfa', fontStyle: 'bold' },
  { token: 'variable.css', foreground: '#8b5cf6' },

  // Layouts
  { token: 'keyword.layout', foreground: '#ec4899', fontStyle: 'bold' },

  // Structures
  { token: 'keyword.structure', foreground: '#ec4899', fontStyle: 'bold' },

  // Typography
  { token: 'markup.heading', foreground: '#34d399', fontStyle: 'bold' },
  { token: 'markup.paragraph', foreground: '#34d399' },
  { token: 'markup.text', foreground: '#34d399' },
  { token: 'markup.muted', foreground: '#6ee7b7' },
  { token: 'markup.note', foreground: '#34d399', fontStyle: 'italic' },
  { token: 'markup.quote', foreground: '#34d399', fontStyle: 'italic' },
  { token: 'markup.list', foreground: '#fbbf24' },

  // Buttons
  { token: 'keyword.button', foreground: '#60a5fa', fontStyle: 'bold' },

  // Links & Images
  { token: 'keyword.link', foreground: '#60a5fa', fontStyle: 'bold' },
  { token: 'keyword.image', foreground: '#60a5fa' },
  { token: 'entity.name.icon', foreground: '#ff8c00' },

  // Forms
  { token: 'keyword.input', foreground: '#a855f7' },
  { token: 'keyword.checkbox', foreground: '#a855f7', fontStyle: 'bold' },
  { token: 'keyword.radio', foreground: '#a855f7', fontStyle: 'bold' },

  // Delimiters & symbols
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
