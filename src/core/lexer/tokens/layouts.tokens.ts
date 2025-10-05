import { createToken } from "chevrotain";

// Layout Primitives - Basic layout containers with modifiers
// The token patterns are now simple and clean, capturing the base keyword plus optional modifiers.
// The complex parsing logic for modifiers is handled in the parser and AST builder.
// 
// Supported syntax patterns:
// - row, row-w50, row-center-p4, row-w50-center-stretch-p4
// - col, col-h100, col-start-m2, col-h100-start-baseline-m2  
// - grid, grid-cols3, grid-gap4-p2, grid-cols3-gap4-center-p2
// - container, container-wfull, container-center-p8, container-wfull-center-p8
//
// Modifiers include:
// - Sizing: w[number], h[number], wfull, hfull, wauto, hauto
// - Justify: start, end, center, between, around, evenly  
// - Align: start, end, center, stretch, baseline
// - Spacing: p[number], m[number], px[number], py[number], mx[number], my[number]
// - Grid: gap[number], cols[1-12]

export const Row = createToken({ 
  name: "Row", 
  pattern: /row(?:-[a-zA-Z0-9-]*)?/
});

export const Col = createToken({ 
  name: "Col", 
  pattern: /col(?:-[a-zA-Z0-9-]*)?/
});

export const Grid = createToken({
  name: "Grid",
  pattern: /grid(?:-[a-zA-Z0-9-]*)?/
});

export const Container = createToken({
  name: "Container",
  pattern: /container(?:-[a-zA-Z0-9-]*)?/
});