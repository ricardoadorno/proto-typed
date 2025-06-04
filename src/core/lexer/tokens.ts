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

export const Component = createToken({
  name: "Component",
  pattern: /@component/
});

export const Modal = createToken({
  name: "Modal", 
  pattern: /modal/
});

export const ComponentInstance = createToken({
  name: "ComponentInstance",
  pattern: /\$([a-zA-Z_][a-zA-Z0-9_]*)/
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



// Layout Family Tokens
export const Row = createToken({ 
  name: "Row", 
  pattern: /row/ 
});

export const Col = createToken({ 
  name: "Col", 
  pattern: /col/ 
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

export const BottomNav = createToken({
  name: "BottomNav",
  pattern: /bottom_nav/
});

export const Drawer = createToken({
  name: "Drawer",
  pattern: /drawer/
});

export const NavItem = createToken({
  name: "NavItem",
  pattern: /nav_item\s+\[([^\]]+)\]\{([^}]+)\}(?:\(([^)]+)\))?/
});

export const DrawerItem = createToken({
  name: "DrawerItem", 
  pattern: /drawer_item\s+\[([^\]]+)\]\{([^}]+)\}(?:\(([^)]+)\))?/
});

export const FAB = createToken({
  name: "FAB",
  pattern: /fab\s+\{([^}]+)\}/
});

export const FABItem = createToken({
  name: "FABItem", 
  pattern: /fab_item\s+\[([^\]]+)\]\{([^}]+)\}(?:\(([^)]+)\))?/
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
  pattern: /@\[([^\]]+)\](?:\{([^}]+)\})?(?:\(([^)]+)\))?/ 
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

// Complex list item with images and subtexts (legacy support)
export const ListItem = createToken({
  name: "ListItem",
  pattern: /(?:\r\n|\r|\n|\s)*-\s+\[([^\]]+)\]([^{]+)\{([^}]+)\}\[([^\]]+)\]/
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
  ComponentInstance,  NavItem,
  DrawerItem,
  FABItem,
  FAB,
  Input,
  Button,
  Row,
  Col,
  List,
  Card,
  Header,
  BottomNav,
  Drawer,
  Separator,
  BlankLine,
  SelectField,
  Text,
  Note,
  Quote,
  Heading,
  Link,
  Image,  Equals,
  Colon,
  Identifier,OrderedListItem,
  ListItem, // More specific pattern must come before UnorderedListItem
  UnorderedListItem,
  RadioOption,
  Checkbox
];