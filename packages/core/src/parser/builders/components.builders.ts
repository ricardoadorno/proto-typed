/**
 * Component system builders for AST construction
 * Handles component definitions and instances
 */

import type { CstNode } from 'chevrotain'
import { validateComponentName } from './builder-validation'
import type { CstContext, CstVisitor } from '../types'

/**
 * @function buildComponent
 * @description Builds a 'Component' AST node from the corresponding CST node.
 * This function is responsible for parsing a component definition, including its name and children.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the component.
 * @param {any} visitor - The CST visitor instance, used to visit child nodes.
 * @returns {object} A 'Component' AST node.
 */
export function buildComponent(ctx: CstContext, visitor: CstVisitor) {
  const nameToken = ctx.name?.[0] as
    | { image: string; startLine: number; startColumn: number }
    | undefined
  if (!nameToken) return { type: 'Component', id: '', props: {}, children: [] }

  const name = nameToken.image
  const line = nameToken.startLine
  const column = nameToken.startColumn

  // Validate component name format
  validateComponentName(visitor, name, line, column)

  const children = ctx.element
    ? ctx.element.map((el) => visitor.visit(el as CstNode))
    : []

  return {
    type: 'Component',
    id: '', // ID will be generated later
    props: { name },
    children,
  }
}

/**
 * @function buildComponentInstanceElement
 * @description Builds a 'ComponentInstance' AST node from the corresponding CST node.
 * This function handles the different ways a component can be instantiated, including with inline or list-based props.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the component instance.
 * @param {any} visitor - The CST visitor instance.
 * @returns {object} A 'ComponentInstance' AST node.
 */
export function buildComponentInstanceElement(
  ctx: CstContext,
  _visitor: CstVisitor
) {
  let componentName = ''
  let templateChildren: unknown[] = []

  // Extract component name from ComponentInstance token
  if (ctx.ComponentInstance && ctx.ComponentInstance[0]) {
    const instanceText = (ctx.ComponentInstance[0] as { image: string }).image
    const match = instanceText.match(/\$([^\s\n\r:]+)/)
    if (match) {
      componentName = match[1]
    }
  }

  // Handle inline props: $Foo: bar | zir
  if (ctx.inlineProps && ctx.inlineProps.length > 0) {
    const propsText = ctx.inlineProps
      .map((token) => (token as { image: string }).image)
      .join(' ')
    const propsList = propsText
      .split('|')
      .map((prop: string) => prop.trim())
      .filter((prop: string) => prop.length > 0)

    templateChildren = propsList.map((prop: string) => ({
      type: 'PropValue',
      props: { text: prop },
    }))
  }
  // Handle list props: $Foo:\n  - bar | zir
  else if (ctx.UnorderedListItem && ctx.UnorderedListItem.length > 0) {
    // Each list item can have multiple props separated by |
    ctx.UnorderedListItem.forEach((item) => {
      const itemText = (item as { image: string }).image
      // Remove leading dash and space: "- text" -> "text"
      const text = itemText.replace(/^-\s+/, '')

      // Split by | to get multiple props from one line
      const props = text
        .split('|')
        .map((prop: string) => prop.trim())
        .filter((prop: string) => prop.length > 0)

      // Add each prop as a separate PropValue
      props.forEach((prop: string) => {
        templateChildren.push({
          type: 'PropValue',
          props: { text: prop },
        })
      })
    })
  }

  return {
    type: 'ComponentInstance',
    id: '', // ID will be generated later
    props: {
      componentName,
      ...(templateChildren.length > 0 && { templateChildren }),
    },
    children: [],
  }
}
