/**
 * Monaco Editor Constants for proto-typed DSL
 * 
 * This file defines core constants for Monaco Editor integration.
 * Token types align with actual DSL syntax documented in copilot-instructions.md
 * 
 * @see copilot-instructions.md for complete DSL syntax reference
 */

// Language identifier for Monaco Editor registration
export const DSL_LANGUAGE_ID = 'proto-typed-dsl';

/**
 * Token types for syntax highlighting based on actual DSL implementation
 * Maps to tokens defined in src/core/lexer/tokens/
 */
export const DSL_TOKEN_TYPES = {
  // Views (views.tokens.ts)
  screen: 'keyword.view',
  modal: 'keyword.view',
  drawer: 'keyword.view',
  
  // Typography (primitives.tokens.ts)
  heading: 'markup.heading',         // # to ######
  paragraph: 'markup.paragraph',     // >
  text: 'markup.text',               // >>
  mutedText: 'markup.muted',         // >>>
  note: 'markup.note',               // *>
  quote: 'markup.quote',             // ">
  
  // Buttons (primitives.tokens.ts)
  // Pattern: (@{1,3})([_+\-=!]?)\[text\](?:\{icon\})?(?:\(action\))?
  button: 'keyword.button',          // @, @@, @@@ with variants
  
  // Links & Images (primitives.tokens.ts)
  link: 'keyword.link',              // #[text](dest)
  image: 'keyword.image',            // ![alt](url)
  
  // Layouts (layouts.tokens.ts)
  // All support inline modifiers: row-w50-center-p4:
  row: 'keyword.layout',
  col: 'keyword.layout',
  grid: 'keyword.layout',
  container: 'keyword.layout',
  
  // Structures (structures.tokens.ts)
  list: 'keyword.structure',
  card: 'keyword.structure',
  header: 'keyword.structure',
  navigator: 'keyword.structure',
  fab: 'keyword.structure',
  separator: 'delimiter.separator',  // ---
  
  // Forms (inputs.tokens.ts)
  // Pattern: ___[\*\-]?(?::Label)?(?:\{Placeholder\})?(?:\[Options\])?
  input: 'keyword.input',            // ___, ___*, ___-
  checkbox: 'keyword.checkbox',      // [X], [ ]
  radio: 'keyword.radio',            // (X), ( )
  
  // Components (components.tokens.ts)
  component: 'keyword.component',    // component Name:
  componentInstance: 'variable.component', // $ComponentName
  componentProp: 'variable.prop',    // %propName
  
  // Styles (styles.tokens.ts)
  styles: 'keyword.styles',          // styles:
  cssVariable: 'variable.css',       // --custom-property
  
  // Delimiters and symbols
  colon: 'delimiter.colon',
  brackets: 'delimiter.bracket',     // [ ]
  parentheses: 'delimiter.parenthesis', // ( )
  braces: 'delimiter.brace',         // { }
  pipe: 'delimiter.pipe',            // | (used in navigator and component props)
  
  // Values and identifiers
  identifier: 'identifier',
  url: 'string.url',
  action: 'string.action',
  
  // Whitespace
  whitespace: 'white'
} as const;
