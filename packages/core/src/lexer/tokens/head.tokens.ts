import { createToken } from 'chevrotain'

// Head Configuration Tokens
export const Head = createToken({
  name: 'Head',
  pattern: /head\b/,
  label: 'head',
})

// Head section tokens
export const HeadColor = createToken({
  name: 'HeadColor',
  pattern: /color\b/,
  label: 'color',
})

export const HeadFont = createToken({
  name: 'HeadFont',
  pattern: /font\b/,
  label: 'font',
})

export const HeadTemplate = createToken({
  name: 'HeadTemplate',
  pattern: /template\b/,
  label: 'template',
})

// Color property tokens
export const ColorPrimary = createToken({
  name: 'ColorPrimary',
  pattern: /primary\b/,
  label: 'primary',
})

export const ColorSecondary = createToken({
  name: 'ColorSecondary',
  pattern: /secondary\b/,
  label: 'secondary',
})

export const ColorNeutral = createToken({
  name: 'ColorNeutral',
  pattern: /neutral\b/,
  label: 'neutral',
})

export const ColorAccent = createToken({
  name: 'ColorAccent',
  pattern: /accent\b/,
  label: 'accent',
})

// Font property tokens
export const FontBase = createToken({
  name: 'FontBase',
  pattern: /base\b/,
  label: 'base',
})

export const FontFamily = createToken({
  name: 'FontFamily',
  pattern: /family\b/,
  label: 'family',
})

// Template property tokens
export const TemplateDefault = createToken({
  name: 'TemplateDefault',
  pattern: /default\b/,
  label: 'default',
})

// Generic property value token (for color hex values, font names, component references)
export const PropertyValue = createToken({
  name: 'PropertyValue',
  pattern: /#[0-9A-Fa-f]{3,8}|\$[a-zA-Z][a-zA-Z0-9_]*|[a-zA-Z][a-zA-Z0-9_-]*/,
  label: 'property-value',
})
