/**
 * View container builders for AST construction
 * Handles screens, modals, and drawers
 */

import type { CstNode } from 'chevrotain'
import { validateViewName } from './builder-validation'
import type { CstContext, CstVisitor, IToken } from '../types'

/**
 * @function buildScreen
 * @description Builds a 'Screen' AST node from the corresponding CST node.
 * It extracts the screen's name and processes its child elements.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the screen.
 * @param {any} visitor - The CST visitor instance, used to visit child nodes.
 * @returns {object} A 'Screen' AST node.
 */
export function buildScreen(ctx: CstContext, visitor: CstVisitor) {
  const nameToken = ctx.name?.[0] as IToken | undefined
  if (!nameToken) return { type: 'Screen', id: '', props: {}, children: [] }

  const name = nameToken.image
  const line = nameToken.startLine ?? 0
  const column = nameToken.startColumn ?? 0

  // Validate screen name format
  validateViewName(visitor, name, 'Screen', line, column)

  const children = ctx.element
    ? ctx.element.map((el) => visitor.visit(el as CstNode))
    : []

  return {
    type: 'Screen',
    id: '', // ID will be generated later
    props: { name },
    children,
  }
}

/**
 * @function buildModal
 * @description Builds a 'Modal' AST node from the corresponding CST node.
 * It extracts the modal's name and processes its child elements.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the modal.
 * @param {any} visitor - The CST visitor instance, used to visit child nodes.
 * @returns {object} A 'Modal' AST node.
 */
export function buildModal(ctx: CstContext, visitor: CstVisitor) {
  const nameToken = ctx.name?.[0] as IToken | undefined
  if (!nameToken) return { type: 'Modal', id: '', props: {}, children: [] }

  const name = nameToken.image
  const line = nameToken.startLine ?? 0
  const column = nameToken.startColumn ?? 0

  // Validate modal name format
  validateViewName(visitor, name, 'Modal', line, column)

  const children = ctx.element
    ? ctx.element.map((el) => visitor.visit(el as CstNode))
    : []

  return {
    type: 'Modal',
    id: '', // ID will be generated later
    props: { name },
    children,
  }
}

/**
 * @function buildDrawer
 * @description Builds a 'Drawer' AST node from the corresponding CST node.
 * It extracts the drawer's name and processes its child elements.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the drawer.
 * @param {any} visitor - The CST visitor instance, used to visit child nodes.
 * @returns {object} A 'Drawer' AST node.
 */
export function buildDrawer(ctx: CstContext, visitor: CstVisitor) {
  const nameToken = ctx.name?.[0] as IToken | undefined
  if (!nameToken) return { type: 'Drawer', id: '', props: {}, children: [] }

  const name = nameToken.image
  const line = nameToken.startLine ?? 0
  const column = nameToken.startColumn ?? 0

  // Validate drawer name format
  validateViewName(visitor, name, 'Drawer', line, column)

  const children = ctx.element
    ? ctx.element.map((el) => visitor.visit(el as CstNode))
    : []

  return {
    type: 'Drawer',
    id: '', // ID will be generated later
    props: { name },
    children,
  }
}
