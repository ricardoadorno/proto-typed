/**
 * Content structure builders for AST construction
 * Handles lists, cards, separators, and ordered/unordered lists
 */

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
        const match = itemText.match(/-\s+(.+)/);
        if (match) {
          const text = match[1].trim();
          // Split by | and clean up props
          const props = text.split('|').map((prop: string) => prop.trim()).filter((prop: string) => prop.length > 0);
          dataItems.push(props);
        }
      });
    }

    return {
      type: "List",
      props: {
        componentName: componentName,
        dataItems: dataItems
      }
    };
  } else {
    // Regular list
    const items: any[] = [];

    // Handle simple unordered list items using UnorderedListItem
    if (ctx.UnorderedListItem) {
      ctx.UnorderedListItem.forEach((item: any) => {
        const itemText = item.image;
        // Extract text after the dash and space: "- text" -> "text"
        const match = itemText.match(/-\s+(.+)/);
        if (match) {
          const text = match[1].trim();
          items.push({
            type: "ListItem",
            props: {
              text: text
            }
          });
        }
      });
    }

    return {
      type: "List",
      elements: items
    };
  }
}

/**
 * Build card element from context
 */
export function buildCardElement(ctx: Context, visitor: any) {
  const elements = [];

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
    type: "Card",
    props: {
      className: "card"
    },
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
export function buildOrderedListElement(ctx: Context) {
  const items = ctx.OrderedListItem.map((item: any) => {
    const match = item.image.match(/\d+\.\s+([^\n\r]+)/);
    return match ? match[1].trim() : '';
  });

  return {
    type: "OrderedList",
    props: {
      items
    }
  };
}

/**
 * Build unordered list element from context
 */
export function buildUnorderedListElement(ctx: Context) {
  let items: any[] = [];
  
  // Handle UnorderedListItem tokens  
  if (ctx.UnorderedListItem) {
    items = items.concat(ctx.UnorderedListItem.map((item: any) => {
      const match = item.image.match(/-\s+([^\n\r]+)/);
      return {
        type: "simple",
        text: match ? match[1].trim() : ''
      };
    }));
  }

  return {
    type: "UnorderedList",
    props: {
      items
    }
  };
}