import { createToken } from "chevrotain";

// Structural Layout Tokens - Complex content structures
export const List = createToken({ 
  name: "List", 
  pattern: /list/
});

export const Card = createToken({ 
  name: "Card", 
  pattern: /card/ 
});

export const Header = createToken({
  name: "Header",
  pattern: /header/
});

export const Navigator = createToken({
  name: "Navigator",
  pattern: /navigator/
});

export const OrderedListItem = createToken({
  name: "OrderedListItem",
  pattern: /\d+\.\s+([^\n\r]+)/
});

export const UnorderedListItem = createToken({
  name: "UnorderedListItem",
  pattern: /-\s+([^\n\r]+)/
});

export const FAB = createToken({
  name: "FAB",
  pattern: /fab\s+\{([^}]+)\}\s+([^\n\r]+)/
});

export const Separator = createToken({
  name: "Separator", 
  pattern: /---/ 
});