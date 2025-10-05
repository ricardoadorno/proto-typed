/**
 * Structure element builders for AST construction
 * Handles lists, cards, separators, headers, navigators, and FAB elements
 */

import { parseNavigatorItem, parseListItem } from './core.builders';

type Context = {
  [key: string]: any;
};

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
        const textMatch = itemText.match(/^-\s+(.+)/);
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
      props: {
        variant: "component",
        component: componentName
      },
      elements: dataItems.map(columns => ({
        type: "ListDataItem",
        props: { columns }
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
      props: {
        variant: "advanced"
      },
      elements: items
    };
  }
}

/**
 * Build card element from context
 */
export function buildCardElement(ctx: Context, visitor: any) {
  const elements = [];

  if (ctx.element && ctx.element.length > 0) {
    for (const el of ctx.element) {
      const elementAst = visitor.visit(el);
      if (elementAst) {
        elements.push(elementAst);
      }
    }
  }

  return {
    type: "Card",
    props: {},
    elements
  };
}

/**
 * Build separator element from context
 */
export function buildSeparatorElement(_ctx: Context) {
  return {
    type: "Separator",
    props: {}
  };
}

/**
 * Build ordered list element from context
 */
/**
 * Build unordered list element from context
 */
export function buildUnorderedListElement(ctx: Context) {
  const listText = ctx.UnorderedListItem[0].image;
  const match = listText.match(/^-\s+(.+)/);
  const content = match ? match[1] : listText;

  return {
    type: "UnorderedList",
    props: {
      items: [content]
    }
  };
}/**
 * Build header element from context
 */
export function buildHeaderElement(ctx: Context, visitor: any) {
  const elements = [];

  if (ctx.element && ctx.element.length > 0) {
    for (const el of ctx.element) {
      const elementAst = visitor.visit(el);
      if (elementAst) {
        elements.push(elementAst);
      }
    }
  }

  return {
    type: "Header",
    props: {},
    elements
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
    props: {},
    elements: items
  };
}

/**
 * Build FAB (Floating Action Button) element from context
 */
export function buildFABElement(ctx: Context) {
  const fabText = ctx.FAB[0].image;
  
  // Parse fab {icon} text pattern
  const match = fabText.match(/fab\s+\{([^}]+)\}\s+([^\n\r]+)/);
  
  if (match) {
    const icon = match[1];
    const action = match[2];
    
    return {
      type: "FAB",
      props: {
        icon,
        action
      }
    };
  }
  
  return {
    type: "FAB",
    props: {
      icon: "plus",
      action: ""
    }
  };
}

// Legacy support functions
export function buildNavItemElement(ctx: Context) {
  return buildNavigatorElement(ctx);
}

export function buildDrawerItemElement(ctx: Context) {
  return buildNavigatorElement(ctx);
}