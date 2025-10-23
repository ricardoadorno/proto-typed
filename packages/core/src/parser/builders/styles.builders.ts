/**
 * Styles and theming builders for AST construction
 * Handles style configurations and custom CSS properties
 */

import { type CstNode, type IToken } from 'chevrotain'
import { AstNode } from '../../types/ast-node'
import type { CstContext } from '../types'

/**
 * @function buildStyles
 * @description Builds a 'Styles' AST node from the corresponding CST node.
 * This function processes a block of style declarations.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the styles block.
 * @returns {AstNode} A 'Styles' AST node.
 */
export function buildStyles(ctx: CstContext): AstNode {
  const styleDeclarations: AstNode[] = []

  if (ctx.styleDeclaration) {
    for (const decl of ctx.styleDeclaration) {
      const styleNode = buildStyleDeclarationFromCst(decl as CstNode)
      if (styleNode) {
        styleDeclarations.push(styleNode)
      }
    }
  }

  return {
    type: 'Styles',
    id: '', // ID will be generated later
    props: {},
    children: styleDeclarations,
  }
}

/**
 * @function buildStyleDeclarationFromCst
 * @description An internal helper function to build a 'CssProperty' AST node from a CST node.
 * @private
 *
 * @param {CstNode} cstNode - The CST node for a single style declaration.
 * @returns {AstNode | null} A 'CssProperty' AST node, or null if parsing fails.
 */
function buildStyleDeclarationFromCst(cstNode: CstNode): AstNode | null {
  if (!cstNode || !cstNode.children || !cstNode.children.CssProperty) {
    return null
  }

  const cssPropertyToken = cstNode.children.CssProperty[0] as IToken
  const cssText = cssPropertyToken.image

  // Parse CSS property: --property-name: value;
  const match = cssText.match(/^--([a-zA-Z-]+):\s*([^;]+);?$/)

  if (match) {
    const propertyName = match[1]
    const propertyValue = match[2].trim()

    return {
      type: 'CssProperty',
      id: '', // ID will be generated later
      props: {
        property: propertyName,
        value: propertyValue,
      },
      children: [],
    }
  }

  return null
}

/**
 * @function buildStyleDeclaration
 * @description Builds a 'CssProperty' AST node from the corresponding CST node.
 * This is used for directly processing a style declaration.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the style declaration.
 * @returns {AstNode | null} A 'CssProperty' AST node, or null if parsing fails.
 */
export function buildStyleDeclaration(ctx: CstContext): AstNode | null {
  if (!ctx.CssProperty || !ctx.CssProperty[0]) {
    return null
  }

  const cssPropertyToken = ctx.CssProperty[0]
  const cssText = (cssPropertyToken as IToken).image

  // Parse CSS property: --property-name: value;
  const match = cssText.match(/^--([a-zA-Z-]+):\s*([^;]+);?$/)

  if (match) {
    const propertyName = match[1]
    const propertyValue = match[2].trim()

    return {
      type: 'CssProperty',
      id: '', // ID will be generated later
      props: {
        property: propertyName,
        value: propertyValue,
      },
      children: [],
    }
  }

  return null
}
