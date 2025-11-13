import { createToken } from 'chevrotain'

// Meta Configuration Tokens
export const Meta = createToken({
  name: 'Meta',
  pattern: /meta\b/,
  label: 'meta',
})

// Meta property tokens
export const MetaVersion = createToken({
  name: 'MetaVersion',
  pattern: /version\b/,
  label: 'version',
})

export const MetaTitle = createToken({
  name: 'MetaTitle',
  pattern: /title\b/,
  label: 'title',
})

// Generic property value token for meta values (strings, numbers, etc.)
export const MetaValue = createToken({
  name: 'MetaValue',
  pattern: /"[^"]*"|'[^']*'|[a-zA-Z0-9._-]+/,
  label: 'meta-value',
})
