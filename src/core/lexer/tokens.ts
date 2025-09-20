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
  pattern: /screen/ 
});

export const Component = createToken({
  name: "Component",
  pattern: /component/
});

export const Modal = createToken({
  name: "Modal", 
  pattern: /modal/
});

export const ComponentInstance = createToken({
  name: "ComponentInstance",
  pattern: /\$([^\s\n\r]+)/
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
  pattern: /[^\s\n\r:{}[\]()]+/ 
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

export const Grid = createToken({
  name: "Grid",
  pattern: /grid/
});

export const Container = createToken({
  name: "Container",
  pattern: /container/
});

export const List = createToken({ 
  name: "List", 
  pattern: /list/ 
});

export const Card = createToken({ 
  name: "Card", 
  pattern: /card/ 
});

// Mobile Layout Tokens
export const Header = createToken({
  name: "Header",
  pattern: /header/
});

export const Navigator = createToken({
  name: "Navigator",
  pattern: /navigator/
});

export const Drawer = createToken({
  name: "Drawer",
  pattern: /drawer/
});



export const FAB = createToken({
  name: "FAB",
  pattern: /fab\s+\{([^}]+)\}\s+([^\n\r]+)/
});

export const Separator = createToken({
  name: "Separator", 
  pattern: /---/ 
});

export const EmptyDiv = createToken({
  name: "EmptyDiv",
  pattern: /--(?!-)/  // Matches exactly two dashes, not three or more
});

// Input Family Tokens
export const Input = createToken({ 
  name: "Input", 
  pattern: /___[\*\-]?(?::([^\n\r:{}[\]]+))?(?:\{([^}]+)\})?(?:\[([^\]]*)\])?/
});

export const RadioOption = createToken({
  name: "RadioOption",
  pattern: /\([xX ]?\)\s+([^\n\r]+)/
});

// Interactive Element Tokens
export const Button = createToken({ 
  name: "Button", 
  pattern: /@([_+\-=!]?)\[([^\]]+)\](?:\{([^}]+)\})?(?:\(([^)]+)\))?/ 
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
  pattern: /#{1,6}(?!#)\s+([^\n\r#[\]"=:]+)/
});

export const Text = createToken({
  name: "Text",
  pattern: />\s+([^\n\r]+)/
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
  pattern: /\d+\.\s+([^\n\r]+)/
});

export const UnorderedListItem = createToken({
  name: "UnorderedListItem",
  pattern: /-\s+([^\n\r]+)/
});

// Advanced list item with flexible syntax: - [link_text](link)text{subtitle}[btn](action)[btn](action)
// Matches list items that contain either square brackets (links/buttons) or curly braces (subtitles)
export const AdvancedListItem = createToken({
  name: "AdvancedListItem",
  pattern: /-\s+(?=.*(?:\[[^\]]*\]|\{[^}]*\})).*/
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
  Component,
  Modal,
  ComponentInstance,
  FAB,
  Input,
  Button,
  Row,
  Col,
  Grid,
  Container,
  List,
  Card,
  Header,
  Navigator,
  Drawer,
  Separator,
  EmptyDiv,
  BlankLine,
  Text,
  Note,
  Quote,
  Heading,
  Link,
  Image,
  OrderedListItem,
  AdvancedListItem, // Most specific pattern must come first
  UnorderedListItem,
  RadioOption,
  Checkbox,
  Equals,
  Colon,
  Identifier
];