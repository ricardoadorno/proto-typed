/**
 * Component system builders for AST construction
 * Handles component definitions and instances
 */

import type { CstNode } from "chevrotain";
import { validateComponentName } from './builder-validation';

type Context = {
  [key: string]: any;
};

/**
 * Build component element from context
 */
export function buildComponent(ctx: Context, visitor: any) {
  const nameToken = ctx.name[0];
  const name = nameToken.image;
  const line = nameToken.startLine;
  const column = nameToken.startColumn;
  
  // Validate component name format
  validateComponentName(visitor, name, line, column);
  
  const children = ctx.element ? ctx.element.map((el: CstNode) => visitor.visit(el)) : [];

  return {
    type: "Component",
    id: "", // ID will be generated later
    props: { name },
    children
  };
}

/**
 * Build component instance element from context
 * Handles all variations:
 * - $Foo (simple)
 * - $Foo: bar | zir (inline props)
 * - $Foo:\n  - bar | zir (list props)
 */
export function buildComponentInstanceElement(ctx: Context, visitor: any) {
  let componentName = "";
  let templateChildren: any[] = [];
  
  // Extract component name from ComponentInstance token
  if (ctx.ComponentInstance) {
    const instanceText = ctx.ComponentInstance[0].image;
    const match = instanceText.match(/\$([^\s\n\r:]+)/);
    if (match) {
      componentName = match[1];
    }
  }
  
  // Handle inline props: $Foo: bar | zir
  if (ctx.inlineProps && ctx.inlineProps.length > 0) {
    const propsText = ctx.inlineProps.map((token: any) => token.image).join(' ');
    const propsList = propsText.split('|').map((prop: string) => prop.trim()).filter((prop: string) => prop.length > 0);
    
    templateChildren = propsList.map((prop: string) => ({
      type: "PropValue",
      props: { text: prop }
    }));
  }
  // Handle list props: $Foo:\n  - bar | zir
  else if (ctx.UnorderedListItem && ctx.UnorderedListItem.length > 0) {
    // Each list item can have multiple props separated by |
    ctx.UnorderedListItem.forEach((item: any) => {
      const itemText = item.image;
      // Remove leading dash and space: "- text" -> "text"
      const text = itemText.replace(/^-\s+/, '');
      
      // Split by | to get multiple props from one line
      const props = text.split('|').map((prop: string) => prop.trim()).filter((prop: string) => prop.length > 0);
      
      // Add each prop as a separate PropValue
      props.forEach((prop: string) => {
        templateChildren.push({
          type: "PropValue",
          props: { text: prop }
        });
      });
    });
  }
  
  return {
    type: "ComponentInstance",
    id: "", // ID will be generated later
    props: { 
      componentName,
      ...(templateChildren.length > 0 && { templateChildren })
    },
    children: []
  };
}
