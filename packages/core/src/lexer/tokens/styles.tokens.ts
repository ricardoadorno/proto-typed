import { createToken } from 'chevrotain'

// Styles Configuration Tokens
export const Styles = createToken({
  name: 'Styles',
  pattern: /styles/,
  label: 'styles',
})

// Custom CSS property token
export const CssProperty = createToken({
  name: 'CssProperty',
  pattern: /--[a-zA-Z-]+:\s*[^;]+;/,
  label: '--css-property: value;',
})
