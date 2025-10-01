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
    type: 'styles',
    props: {},
    elements: styleDeclarations
  };
}

/**
 * Build individual style declaration from context
 */
export function buildStyleDeclaration(ctx: Context): AstNode | null {
  // Handle custom CSS property
  if (ctx.CssProperty) {
    const cssToken = ctx.CssProperty[0] as IToken;
    const cssMatch = cssToken.image.match(/--([a-zA-Z-]+):\s*([^;]+);/);
    
    if (cssMatch) {
      return {
        type: 'css-property',
        props: {
          property: cssMatch[1],
          value: cssMatch[2].trim()
        },
        elements: []
      };
    }
  }

  return null;
}

/**
 * Build individual style declaration from CST node (internal helper)
 */
function buildStyleDeclarationFromCst(cst: CstNode): AstNode | null {
  // Handle custom CSS property
  if (cst.children.CssProperty) {
    const cssToken = cst.children.CssProperty[0] as IToken;
    const cssMatch = cssToken.image.match(/--([a-zA-Z-]+):\s*([^;]+);/);
    
    if (cssMatch) {
      return {
        type: 'css-property',
        props: {
          property: cssMatch[1],
          value: cssMatch[2].trim()
        },
        elements: []
      };
    }
  }

  return null;
}