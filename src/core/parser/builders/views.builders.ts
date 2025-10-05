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
export function buildDrawer(ctx: Context) {
  const name = ctx.name[0].image;
  const items: any[] = [];

  // Parse drawer items (UnorderedListItem tokens)
  if (ctx.UnorderedListItem) {
    ctx.UnorderedListItem.forEach((item: any) => {
      const itemText = item.image;
      
      // Parse drawer item format: "- text (destination)"
      const match = itemText.match(/^-\s+(.+?)\s*\(([^)]+)\)/);
      if (match) {
        items.push({
          text: match[1].trim(),
          destination: match[2].trim()
        });
      } else {
        // Simple text item without destination
        const textMatch = itemText.match(/^-\s+(.+)/);
        if (textMatch) {
          items.push({
            text: textMatch[1].trim(),
            destination: null
          });
        }
      }
    });
  }

  return {
    type: "drawer",
    name,
    items
  };
}