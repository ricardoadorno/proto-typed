import { createToken } from "chevrotain";

// Structural Layout Tokens - Complex content structures
// Card and Header now support layout modifiers like other layout elements:
// 
// Supported syntax patterns:
// - card, card-w50, card-center-p4, card-wfull-center-stretch-p4
// - header, header-h100, header-start-m2, header-h100-start-baseline-m2
//
// Modifiers include:
// - Sizing: w[number], h[number], wfull, hfull, wauto, hauto
// - Justify: start, end, center, between, around, evenly  
// - Align: start, end, center, stretch, baseline
// - Spacing: p[number], m[number], px[number], py[number], mx[number], my[number]

export const List = createToken({ 
  name: "List", 
  pattern: /list/
});

export const Card = createToken({ 
  name: "Card", 
  pattern: /card(?:-[a-zA-Z0-9-]*)?/ 
});

export const Header = createToken({
  name: "Header",
  pattern: /header(?:-[a-zA-Z0-9-]*)?/
});

export const Navigator = createToken({
  name: "Navigator",
  pattern: /navigator/
});

export const UnorderedListItem = createToken({
  name: "UnorderedListItem",
  pattern: /-\s+([^\n\r]+)/
});

export const FAB = createToken({
  name: "FAB",
  pattern: /fab\{([^}]+)\}\(([^)]+)\)/
});

export const Separator = createToken({
  name: "Separator", 
  pattern: /---/ 
});