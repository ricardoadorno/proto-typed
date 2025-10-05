/**
 * Component system builders for AST construction
 * Handles component definitions and instances
 */

import type { CstNode } from "chevrotain";

type Context = {
  [key: string]: any;
};

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
 * Build component instance element from context
 */
export function buildComponentInstanceElement(ctx: Context) {
  // Handle ComponentInstanceWithProps or ComponentInstance
  if (ctx.ComponentInstanceWithProps) {
    const instanceText = ctx.ComponentInstanceWithProps[0].image;
    // Pattern: $ComponentName: prop1 | prop2 | prop3
    const match = instanceText.match(/\$([^\s\n\r:]+):\s*(.+)/);
    
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
  
  if (ctx.ComponentInstance) {
    const instanceText = ctx.ComponentInstance[0].image;
    // Pattern: $ComponentName
    const match = instanceText.match(/\$([^\s\n\r:]+)/);
    
    if (match) {
      const componentName = match[1];
      
      return {
        type: "component_instance",
        name: componentName,
        props: []
      };
    }
  }
  
  return null;
}