/**
 * Navigation and overlay element builders for AST construction
 * Handles screens, modals, drawers, navigation, and FAB elements
 */

import { parseNavigatorItem, parseDrawerItem } from './utils.builders';
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
 * Build component element from context
 */
export function buildComponent(ctx: Context, visitor: any) {
  const name = ctx.name[0].image;
  const elements = ctx.element ? ctx.element.map((el: CstNode) => visitor.visit(el)) : [];

  return {
    type: "component",
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

  // Handle simple unordered list items
  if (ctx.UnorderedListItem) {
    ctx.UnorderedListItem.forEach((item: any) => {
      const itemText = item.image;
      const drawerItem = parseDrawerItem(itemText);
      if (drawerItem) {
        items.push(drawerItem);
      }
    });
  }

  return {
    type: "drawer",
    name,
    elements: items
  };
}

/**
 * Build header element from context
 */
export function buildHeaderElement(ctx: Context, visitor: any) {
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
    type: "Header",
    props: {
      className: "header"
    },
    elements
  };
}

/**
 * Build navigator element from context
 */
export function buildNavigatorElement(ctx: Context) {
  const items: any[] = [];

  // Handle simple unordered list items
  if (ctx.UnorderedListItem) {
    ctx.UnorderedListItem.forEach((item: any) => {
      const itemText = item.image;
      const navItem = parseNavigatorItem(itemText);
      if (navItem) {
        items.push(navItem);
      }
    });
  }

  return {
    type: "Navigator",
    props: {
      className: "navigator"
    },
    elements: items
  };
}

/**
 * Build FAB element from context
 */
export function buildFABElement(ctx: Context) {
  const fabText = ctx.FAB[0].image;
  // Pattern: fab {icon} text
  const match = fabText.match(/fab\s+\{([^}]+)\}\s+([^\n\r]+)/);
  
  if (match) {
    const [, icon, text] = match;
    return {
      type: "FAB",
      props: {
        icon: icon.trim(),
        text: text.trim(),
        href: text.trim() // Text acts as the link action
      }
    };
  }
  
  return null;
}

/**
 * Build nav item element from context
 */
export function buildNavItemElement(ctx: Context) {
  const itemText = ctx.NavItem[0].image;
  // Pattern: nav_item [label]{icon}(action)
  const match = itemText.match(/nav_item\s+\[([^\]]+)\]\{([^}]+)\}(?:\(([^)]+)\))?/);
  
  if (match) {
    const [, label, icon, action] = match;
    return {
      type: "NavItem",
      props: {
        label: label.trim(),
        icon: icon.trim(),
        action: action ? action.trim() : ''
      }
    };
  }
  
  return null;
}

/**
 * Build drawer item element from context
 */
export function buildDrawerItemElement(ctx: Context) {
  const itemText = ctx.DrawerItem[0].image;
  // Pattern: drawer_item [label]{icon}(action)
  const match = itemText.match(/drawer_item\s+\[([^\]]+)\]\{([^}]+)\}(?:\(([^)]+)\))?/);
  
  if (match) {
    const [, label, icon, action] = match;
    return {
      type: "DrawerItem",
      props: {
        label: label.trim(),
        icon: icon.trim(),
        action: action ? action.trim() : ''
      }
    };
  }
  
  return null;
}

/**
 * Build component instance element from context
 */
export function buildComponentInstanceElement(ctx: Context) {
  // Handle component instance with props: $ComponentName: prop1 | prop2 | prop3
  if (ctx.ComponentInstanceWithProps && ctx.ComponentInstanceWithProps.length > 0) {
    const token = ctx.ComponentInstanceWithProps[0];
    const match = token.image.match(/\$([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.+)/);
    if (match) {
      const componentName = match[1];
      const propsString = match[2].trim();
      
      // Split props by | and clean them up
      const props = propsString.split('|').map((prop: string) => prop.trim()).filter((prop: string) => prop.length > 0);
      
      return {
        type: "component_instance",
        name: componentName,
        props: props
      };
    }
  }
  
  // Handle simple component instance: $ComponentName
  if (ctx.ComponentInstance && ctx.ComponentInstance.length > 0) {
    const token = ctx.ComponentInstance[0];
    const match = token.image.match(/\$([a-zA-Z_][a-zA-Z0-9_]*)/);
    const componentName = match ? match[1] : '';

    return {
      type: "component_instance",
      name: componentName,
      props: []
    };
  }

  return null;
}