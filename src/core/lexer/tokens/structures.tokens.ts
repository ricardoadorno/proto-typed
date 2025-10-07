import { createToken } from "chevrotain";

// Structural Tokens - Complex content structures
// List and Navigator provide structured content organization

export const List = createToken({ 
  name: "List", 
  pattern: /list/
});

export const Navigator = createToken({
  name: "Navigator",
  pattern: /navigator/
});

export const UnorderedListItem = createToken({
  name: "UnorderedListItem",
  pattern: /-\s+[^\n\r]+/
});

export const FAB = createToken({
  name: "FAB",
  pattern: /fab\{([^}]+)\}\(([^)]+)\)/
});

export const Separator = createToken({
  name: "Separator", 
  pattern: /---/ 
});