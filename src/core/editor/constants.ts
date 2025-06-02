// Define the language ID
export const DSL_LANGUAGE_ID = 'proto-type-dsl';

// Token types for syntax highlighting
export const DSL_TOKEN_TYPES = {
  // Structural tokens
  screen: 'keyword.screen',
  colon: 'delimiter.colon',
  identifier: 'identifier',
  
  // Layout elements
  layout: 'keyword.layout',
  container: 'keyword.container',
  
  // Typography
  heading: 'markup.heading',
  text: 'string.text',
  note: 'markup.note',
  quote: 'markup.quote',
  
  // Interactive elements
  button: 'keyword.button',
  link: 'keyword.link',
  image: 'keyword.image',
  
  // Form elements
  input: 'keyword.input',
  checkbox: 'keyword.checkbox',
  radio: 'keyword.radio',
  select: 'keyword.select',
  
  // Mobile elements
  mobile: 'keyword.mobile',
  
  // Attributes and values
  attribute: 'attribute.name',
  attributeValue: 'attribute.value',
  url: 'string.url',
  action: 'string.action',
  
  // Symbols
  brackets: 'delimiter.bracket',
  parentheses: 'delimiter.parenthesis',
  braces: 'delimiter.brace',
  separator: 'delimiter.separator',
  
  // Comments and whitespace
  comment: 'comment',
  whitespace: 'white'
} as const;
