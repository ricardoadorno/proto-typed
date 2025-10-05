/**
 * View container builders for AST construction
 * Handles screens, modals, and drawers
 */

import type { CstNode } from "chevrotain";

type Context = {
  [key: string]: any;
};

/**
 * Build screen element from context
 */
export function buildScreen(ctx: Context, visitor: any) {
  const name = ctx.name[0].image;
  const elements = ctx.element ? ctx.element.map((el: CstNode) => visitor.visit(el)) : [];

  return {
    type: "screen",
    name,
    elements
  };
}

/**
 * Build modal element from context
 */
export function buildModal(ctx: Context, visitor: any) {
  const name = ctx.name[0].image;
  const elements = ctx.element ? ctx.element.map((el: CstNode) => visitor.visit(el)) : [];

  return {
    type: "modal",
    name,
    elements
  };
}

/**
 * Build drawer element from context
 */
export function buildDrawer(ctx: Context, visitor: any) {
  const name = ctx.name[0].image;
  const elements = ctx.element ? ctx.element.map((el: CstNode) => visitor.visit(el)) : [];

  return {
    type: "drawer",
    name,
    elements
  };
}