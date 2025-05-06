import { createToken, Lexer } from "chevrotain";

// Whitespace & Formatting Tokens
export const WhiteSpace = createToken({
  name: "Spaces",
  pattern: / +/,
  group: Lexer.SKIPPED,
});

export const NewLine = createToken({
  name: "Newline",
  pattern: /\n|\r\n?/,
  group: "nl",
});

export const BlankLine = createToken({ 
  name: "BlankLine", 
  pattern: /\r?\n\s*\r?\n/ 
});

// Configuration & Structural Tokens
export const Screen = createToken({ 
  name: "Screen", 
  pattern: /@screen/ 
});

export const Equals = createToken({ 
  name: "Equals", 
  pattern: /=/ 
});

export const Colon = createToken({ 
  name: "Colon", 
  pattern: /:/ 
});

export const Identifier = createToken({ 
  name: "Identifier", 
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/ 
});

export const StringLiteral = createToken({ 
  name: "StringLiteral", 
  pattern: /"[^"]*"/ 
});

// Layout Family Tokens
export const Row = createToken({ 
  name: "Row", 
  pattern: /row/ 
});

export const Col = createToken({ 
  name: "Col", 
  pattern: /col/ 
});

export const Card = createToken({ 
  name: "Card", 
  pattern: /card/ 
});

export const Separator = createToken({ 
  name: "Separator", 
  pattern: /---/ 
});

// Input Family Tokens
export const Input = createToken({ 
  name: "Input", 
  pattern: /___[\*\-]?(?::([a-zA-Z0-9_\s]+))?(?:\(([^\)]+)\))?(?:\[([^\]]*)\])?/
});

export const RadioOption = createToken({
  name: "RadioOption",
  pattern: /(?:\r\n|\r|\n|\s)*\([xX ]?\)\s+([^\n\r]+)/
});

export const SelectField = createToken({
  name: "SelectField",
  pattern: /(?:\r\n|\r|\n|\s)*<\[([^\]]+)\]>(?:\r\n|\r|\n|\s)*/
});

// Interactive Element Tokens
export const Button = createToken({ 
  name: "Button", 
  pattern: /@\[([^\]]+)\](?:\(([^)]+)\))?/ 
});

export const Link = createToken({
  name: "Link",
  pattern: /#\[([^\]]+)\](?:\(([^)]+)\))?/
});

export const Image = createToken({ 
  name: "Image", 
  pattern: /!\[([^\]]+)\](?:\(([^)]+)\))?/ 
});

// Content Element Tokens
export const Heading = createToken({
  name: "Heading",
  pattern: /(?:\r\n|\r|\n|\s)*#{1,6}(?!#)\s+([^\n\r#[\]"=:]+)/
});

export const Text = createToken({
  name: "Text",
  pattern: /(?:\r\n|\r|\n|\s)*>\s+([^\n\r]+)/
});

export const Note = createToken({
  name: "Note",
  pattern: /\*>\s+([^\n\r]+)/
});

export const Quote = createToken({
  name: "Quote",
  pattern: /">\s+([^\n\r]+)/
});

export const OrderedListItem = createToken({
  name: "OrderedListItem",
  pattern: /(?:\r\n|\r|\n|\s)*\d+\.\s+([^\n\r]+)/
});

export const UnorderedListItem = createToken({
  name: "UnorderedListItem",
  pattern: /(?:\r\n|\r|\n|\s)*-\s+([^\n\r]+)/
});

// Standalone Checkbox token
export const Checkbox = createToken({ 
  name: "Checkbox", 
  pattern: /\[([ xX]?)\](?:\s+([^\n\r]+))/ 
});

// All tokens array - order matters for matching precedence
export const allTokens = [
  NewLine,
  WhiteSpace,
  Screen,
  Input,
  Button,
  Row,
  Col,
  Card,
  Separator,
  BlankLine,
  SelectField,
  Text,
  Note,
  Quote,
  Heading,
  Link,
  Image,
  Equals,
  Colon,
  StringLiteral,
  Identifier,
  OrderedListItem,
  UnorderedListItem,
  RadioOption,
  Checkbox,
];