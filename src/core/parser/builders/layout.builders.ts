/**
 * Layout element builders for AST construction
 * Handles containers, rows, columns, and grids
 */

import { parseLayoutModifiers } from './utils.builders';

type Context = {
  [key: string]: any;
};

/**
 * Build container element from context
 */
export function buildContainerElement(ctx: Context, visitor: any) {
  const elements = [];
  
  // Extract modifiers from the Container token
  const containerToken = ctx.Container[0];
  const modifiers = parseLayoutModifiers(containerToken.image);

  if (ctx.element && ctx.element.length > 0) {
    for (const el of ctx.element) {
      const elementAst = visitor.visit(el);
      if (elementAst) {
        elements.push(elementAst);
      }
    }
  }

  return {
    type: "Container",
    modifiers,
    elements
  };
}

/**
 * Build row element from context
 */
export function buildRowElement(ctx: Context, visitor: any) {
  const elements = [];
  
  // Extract modifiers from the Row token
  const rowToken = ctx.Row[0];
  const modifiers = parseLayoutModifiers(rowToken.image);

  // Get elements directly from element subrules
  if (ctx.element && ctx.element.length > 0) {
    for (const el of ctx.element) {
      const elementAst = visitor.visit(el);
      
      if (elementAst) {
        elements.push(elementAst);
      }
    }
  }

  return {
    type: "Row",
    modifiers,
    elements
  };
}

/**
 * Build column element from context
 */
export function buildColumnElement(ctx: Context, visitor: any) {
  const elements = [];
  
  // Extract modifiers from the Col token
  const colToken = ctx.Col[0];
  const modifiers = parseLayoutModifiers(colToken.image);

  // Get elements directly from element subrules
  if (ctx.element && ctx.element.length > 0) {
    for (const el of ctx.element) {
      const elementAst = visitor.visit(el);
      
      if (elementAst) {
        elements.push(elementAst);
      }
    }
  }

  return {
    type: "Col",
    modifiers,
    elements
  };
}

/**
 * Build grid element from context
 */
export function buildGridElement(ctx: Context, visitor: any) {
  const elements = [];
  
  // Extract modifiers from the Grid token
  const gridToken = ctx.Grid[0];
  const modifiers = parseLayoutModifiers(gridToken.image);

  if (ctx.element && ctx.element.length > 0) {
    for (const el of ctx.element) {
      const elementAst = visitor.visit(el);
      if (elementAst) {
        elements.push(elementAst);
      }
    }
  }

  return {
    type: "Grid",
    modifiers,
    elements
  };
}