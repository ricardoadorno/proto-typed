/**
 * Meta configuration builders for AST construction
 * Handles meta configurations (version, title)
 */

import { type CstNode, type IToken } from 'chevrotain'
import { AstNode } from '../../types/ast-node'
import type { CstContext } from '../../types/parser'

/**
 * @function buildMeta
 * @description Builds a 'Meta' AST node from the corresponding CST node.
 * This function processes meta configuration properties (version, title).
 *
 * @param {Context} ctx - The Chevrotain CST node context for the meta block.
 * @returns {AstNode} A 'Meta' AST node.
 */
export function buildMeta(ctx: CstContext): AstNode {
  const metaProperties: AstNode[] = []

  // Process meta properties
  if (ctx.metaProperty) {
    for (const prop of ctx.metaProperty) {
      const metaProp = buildMetaProperty(prop as CstNode)
      if (metaProp) {
        metaProperties.push(metaProp)
      }
    }
  }

  return {
    type: 'Meta',
    id: '',
    props: {},
    children: metaProperties,
  }
}

/**
 * @function buildMetaProperty
 * @description Builds a meta property AST node (version, title)
 */
function buildMetaProperty(cstNode: CstNode): AstNode | null {
  if (!cstNode || !cstNode.children) {
    return null
  }

  const children = cstNode.children
  let propertyName = ''
  let propertyValue = ''

  // Determine which meta property it is
  if (children.MetaVersion) {
    propertyName = 'version'
  } else if (children.MetaTitle) {
    propertyName = 'title'
  }

  // Get the value - check both Identifier and MetaValue
  if (children.Identifier) {
    const valueToken = children.Identifier[0] as IToken
    propertyValue = valueToken.image
  } else if (children.MetaValue) {
    const valueToken = children.MetaValue[0] as IToken
    // Remove quotes if present
    propertyValue = valueToken.image.replace(/^["']|["']$/g, '')
  }

  return {
    type: 'MetaProperty',
    id: '',
    props: {
      name: propertyName,
      value: propertyValue,
    },
    children: [],
  }
}
