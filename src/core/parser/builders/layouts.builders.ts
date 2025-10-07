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
 * Build layout element from context using canonical presets
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
 * Build list element from context
 */
export function buildListElement(ctx: Context) {
  // Check if there's a component name (list $ComponentName:)
  const hasComponent = ctx.componentName && ctx.componentName.length > 0;
  
  if (hasComponent) {
    // List with component template
    const token = ctx.componentName[0];
    // Match ComponentInstanceWithProps pattern: $ComponentName: (ignore props part)
    const match = token.image.match(/\$([a-zA-Z_][a-zA-Z0-9_]*)/);
    const componentName = match ? match[1] : '';

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
      id: "", // ID will be generated posteriormente
      props: {
        variant: "component",
        // Mantém propriedade antiga para retrocompatibilidade
        component: componentName,
        // Nova propriedade explícita
        componentName,
        // Fornece dados crus também para renderer otimizado
        dataItems: dataItems
      },
      // Mantém children como representação detalhada para outros usos
      children: dataItems.map(columns => ({
        type: "UnorderedListItem",
        id: "",
        props: { columns },
        children: []
      }))
    };
  } else {
    // Regular list with advanced parsing for links and buttons
    const items: any[] = [];

    if (ctx.UnorderedListItem) {
      ctx.UnorderedListItem.forEach((item: any) => {
        const itemText = item.image;
        const parsedItem = parseListItem(itemText);
        items.push(parsedItem);
      });
    }

    return {
      type: "List",
      id: "", // ID will be generated later
      props: {
        variant: "advanced"
      },
      children: items
    };
  }
}

/**
 * Build unordered list element from context
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
 * Build navigator element from context
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
 * Build Fab (Floating Action Button) element from context
 * Pattern: fab:
 *   - icon | destination
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
 * Build separator element from context
 */
export function buildSeparatorElement(_ctx: Context) {
  return {
    type: "Separator",
    id: "", // ID will be generated later
    props: {},
    children: []
  };
}

// Legacy support functions
export function buildNavItemElement(ctx: Context) {
  return buildNavigatorElement(ctx);
}