/**
 * Layout element builders for AST construction
 * Handles canonical preset layouts (no modifiers)
 * Also includes structural elements: List, Navigator, FAB, Separator
 */

import { parseNavigatorItem, parseListItem } from './core.builders';

type Context = {
  [key: string]: any;
};

/**
 * @function buildLayoutElement
 * @description Builds a 'Layout' AST node from the corresponding CST node.
 * It determines the specific layout type from the token (e.g., 'container', 'stack', 'row')
 * and processes any child elements.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the layout element.
 * @param {any} visitor - The CST visitor instance, used to visit child nodes.
 * @returns {object} A 'Layout' AST node.
 */
export function buildLayoutElement(ctx: Context, visitor: any) {
  const elements = [];
  
  // Determine layout type from token
  let layoutType: string;
  
  // Containers
  if (ctx.ContainerNarrow) layoutType = 'container-narrow';
  else if (ctx.ContainerWide) layoutType = 'container-wide';
  else if (ctx.ContainerFull) layoutType = 'container-full';
  else if (ctx.Container) layoutType = 'container';
  // Stacks
  else if (ctx.Stack) layoutType = 'stack';
  else if (ctx.StackTight) layoutType = 'stack-tight';
  else if (ctx.StackLoose) layoutType = 'stack-loose';
  else if (ctx.StackFlush) layoutType = 'stack-flush';
  // Rows
  else if (ctx.RowStart) layoutType = 'row-start';
  else if (ctx.RowCenter) layoutType = 'row-center';
  else if (ctx.RowBetween) layoutType = 'row-between';
  else if (ctx.RowEnd) layoutType = 'row-end';
  else if (ctx.Col) layoutType = 'col';
  // Grids
  else if (ctx.Grid2) layoutType = 'grid-2';
  else if (ctx.Grid3) layoutType = 'grid-3';
  else if (ctx.Grid4) layoutType = 'grid-4';
  else if (ctx.GridAuto) layoutType = 'grid-auto';
  // Cards
  else if (ctx.Card) layoutType = 'card';
  else if (ctx.CardCompact) layoutType = 'card-compact';
  else if (ctx.CardFeature) layoutType = 'card-feature';
  // Special
  else if (ctx.Header) layoutType = 'header';
  else if (ctx.Sidebar) layoutType = 'sidebar';
  else layoutType = 'container-narrow'; // fallback

  if (ctx.element && ctx.element.length > 0) {
    for (const el of ctx.element) {
      const elementAst = visitor.visit(el);
      if (elementAst) {
        elements.push(elementAst);
      }
    }
  }

  return {
    type: "Layout",
    id: "", // ID will be generated later
    props: { layoutType },
    children: elements
  };
}

/**
 * @function buildListElement
 * @description Builds a 'List' AST node that is templated with a component.
 * It handles the 'list $ComponentName:' syntax and parses the data items for the list.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the list element.
 * @returns {object} A 'List' AST node.
 */
export function buildListElement(ctx: Context) {
  // Extract component name from ComponentInstance token
  let componentName = "";
  if (ctx.ComponentInstance) {
    const instanceText = ctx.ComponentInstance[0].image;
    const match = instanceText.match(/\$([^\s\n\r:]+)/);
    if (match) {
      componentName = match[1];
    }
  }

  const dataItems: string[][] = [];

  // Handle data items (simple unordered list items with pipe-separated values)
  if (ctx.UnorderedListItem) {
    ctx.UnorderedListItem.forEach((item: any) => {
      const itemText = item.image;
      // Extract text after the dash and space: "- text" -> "text"
      const textMatch = itemText.match(/^-\s+(.+)$/);
      if (textMatch) {
        const content = textMatch[1];
        // Split by | for data columns
        const columns = content.split('|').map((col: string) => col.trim());
        dataItems.push(columns);
      }
    });
  }

  return {
    type: "List",
    id: "", // ID will be generated later
    props: {
      variant: "component",
      componentName,
      dataItems: dataItems
    },
    children: dataItems.map(columns => ({
      type: "UnorderedListItem",
      id: "",
      props: { columns },
      children: []
    }))
  };
}

/**
 * @function buildUnorderedListElement
 * @description Builds an 'UnorderedListItem' AST node from the corresponding CST node.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the list item.
 * @returns {object} An 'UnorderedListItem' AST node.
 */
export function buildUnorderedListElement(ctx: Context) {
  const listText = ctx.UnorderedListItem[0].image;
  const match = listText.match(/^-\s+(.+)$/);
  const content = match ? match[1] : listText;

  return {
    type: "UnorderedListItem",
    id: "", // ID will be generated later
    props: {
      text: content
    },
    children: []
  };
}

/**
 * @function buildNavigatorElement
 * @description Builds a 'Navigator' AST node from the corresponding CST node.
 * It parses the list of navigator items and their properties.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the navigator element.
 * @returns {object} A 'Navigator' AST node.
 */
export function buildNavigatorElement(ctx: Context) {
  const items: any[] = [];

  // Parse navigator items (UnorderedListItem tokens)
  if (ctx.UnorderedListItem) {
    ctx.UnorderedListItem.forEach((item: any) => {
      const itemText = item.image;
      const parsedItem = parseNavigatorItem(itemText);
      items.push(parsedItem);
    });
  }

  return {
    type: "Navigator",
    id: "", // ID will be generated later
    props: {},
    children: items
  };
}

/**
 * @function buildFABElement
 * @description Builds a 'Fab' (Floating Action Button) AST node from the corresponding CST node.
 * It parses the icon and destination for the FAB.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the FAB element.
 * @returns {object} A 'Fab' AST node.
 */
export function buildFABElement(ctx: Context) {
  const items: any[] = [];

  // Parse Fab item (should be single UnorderedListItem)
  if (ctx.UnorderedListItem && ctx.UnorderedListItem.length > 0) {
    const itemText = ctx.UnorderedListItem[0].image;
    
    // Parse "- icon | destination" pattern
    const parts = itemText.replace(/^-\s*/, '').split('|').map((s: string) => s.trim());
    
    if (parts.length >= 2) {
      items.push({
        icon: parts[0],
        destination: parts[1]
      });
    } else if (parts.length === 1) {
      // Only icon provided, no destination
      items.push({
        icon: parts[0],
        destination: ''
      });
    }
  }

  return {
    type: "Fab",
    id: "", // ID will be generated later
    props: {
      icon: items[0]?.icon || 'plus',
      destination: items[0]?.destination || ''
    },
    children: []
  };
}

/**
 * @function buildSeparatorElement
 * @description Builds a 'Separator' AST node from the corresponding CST node.
 *
 * @param {Context} _ctx - The Chevrotain CST node context for the separator element.
 * @returns {object} A 'Separator' AST node.
 */
export function buildSeparatorElement(_ctx: Context) {
  return {
    type: "Separator",
    id: "", // ID will be generated later
    props: {},
    children: []
  };
}

/**
 * @function buildNavItemElement
 * @description Legacy support function that builds a navigator element.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the nav item element.
 * @returns {object} A 'Navigator' AST node.
 */
export function buildNavItemElement(ctx: Context) {
  return buildNavigatorElement(ctx);
}
