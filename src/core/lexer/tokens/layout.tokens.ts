import { createToken } from "chevrotain";

// Layout Primitives with Modifiers
// Syntax: layout-modifier1-modifier2-...:
// Modifiers:
// - Sizing: w[number], h[number], wfull, hfull, wauto, hauto
// - Justify: start, end, center, between, around, evenly  
// - Align: start, end, center, stretch, baseline
// - Spacing: p[number], m[number], px[number], py[number], mx[number], my[number]
export const Row = createToken({ 
  name: "Row", 
  pattern: /row(?:(-(?:w(?:\d+|full|auto)|h(?:\d+|full|auto)|start|end|center|between|around|evenly|stretch|baseline|p(?:x|y|l|r|t|b)?\d+|m(?:x|y|l|r|t|b)?\d+|gap\d+|cols(?:1[0-2]|[1-9])))*)?/
});

export const Col = createToken({ 
  name: "Col", 
  pattern: /col(?:(-(?:w(?:\d+|full|auto)|h(?:\d+|full|auto)|start|end|center|between|around|evenly|stretch|baseline|p(?:x|y|l|r|t|b)?\d+|m(?:x|y|l|r|t|b)?\d+|gap\d+|cols(?:1[0-2]|[1-9])))*)?/
});

export const Grid = createToken({
  name: "Grid",
  pattern: /grid(?:(-(?:w(?:\d+|full|auto)|h(?:\d+|full|auto)|start|end|center|between|around|evenly|stretch|baseline|p(?:x|y|l|r|t|b)?\d+|m(?:x|y|l|r|t|b)?\d+|gap\d+|cols(?:1[0-2]|[1-9])))*)?/
});

export const Container = createToken({
  name: "Container",
  pattern: /container(?:(-(?:w(?:\d+|full|auto)|h(?:\d+|full|auto)|start|end|center|between|around|evenly|stretch|baseline|p(?:x|y|l|r|t|b)?\d+|m(?:x|y|l|r|t|b)?\d+|gap\d+|cols(?:1[0-2]|[1-9])))*)?/
});