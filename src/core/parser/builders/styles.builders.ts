/**
 * Styles and theming builders for AST construction
 * Handles style configurations and custom CSS properties
 */

import { type CstNode, type IToken } from "chevrotain";
import { AstNode } from "../../../types/ast-node";

type Context = {
  [key: string]: any;
};

/**
 * Build styles configuration node from CST context
 */
export function buildStyles(ctx: Context): AstNode {
  const styleDeclarations: AstNode[] = [];
  
  if (ctx.styleDeclaration) {
    for (const decl of ctx.styleDeclaration) {
      const styleNode = buildStyleDeclarationFromCst(decl as CstNode);
      if (styleNode) {
        styleDeclarations.push(styleNode);
      }
    }
  }

  return {
    type: 'Styles',
    id: "", // ID will be generated later
    props: {},
    children: styleDeclarations
  };
}

/**
 * Build style declaration from CST node (internal helper)
 */
function buildStyleDeclarationFromCst(cstNode: CstNode): AstNode | null {
  if (!cstNode || !cstNode.children || !cstNode.children.CssProperty) {
    return null;
  }

  const cssPropertyToken = cstNode.children.CssProperty[0] as IToken;
  const cssText = cssPropertyToken.image;
  
  // Parse CSS property: --property-name: value;
  const match = cssText.match(/^--([a-zA-Z-]+):\s*([^;]+);?$/);
  
  if (match) {
    const propertyName = match[1];
    const propertyValue = match[2].trim();
    
    return {
      type: 'CssProperty',
      id: "", // ID will be generated later
      props: {
        property: propertyName,
        value: propertyValue
      },
      children: []
    };
  }
  
  return null;
}

/**
 * Build style declaration from context (for direct usage)
 */
export function buildStyleDeclaration(ctx: Context): AstNode | null {
  if (!ctx.CssProperty || !ctx.CssProperty[0]) {
    return null;
  }

  const cssPropertyToken = ctx.CssProperty[0];
  const cssText = cssPropertyToken.image;
  
  // Parse CSS property: --property-name: value;
  const match = cssText.match(/^--([a-zA-Z-]+):\s*([^;]+);?$/);
  
  if (match) {
    const propertyName = match[1];
    const propertyValue = match[2].trim();
    
    return {
      type: 'CssProperty',
      id: "", // ID will be generated later
      props: {
        property: propertyName,
        value: propertyValue
      },
      children: []
    };
  }
  
  return null;
}