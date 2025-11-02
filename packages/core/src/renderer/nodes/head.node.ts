/**
 * Head node renderer
 * Renders head configuration nodes (no-op as head is processed by theme-manager)
 */

import { AstNode } from '../../types/ast-node'

/**
 * @function renderHead
 * @description Renders a 'Head' AST node to its HTML representation.
 * This function is a no-op because head configuration is handled by the `customPropertiesManager`.
 * The head config is processed during AST rendering initialization and converted to CSS variables.
 *
 * @param {AstNode} _node - The 'Head' AST node (unused).
 * @returns {string} An empty string, as head doesn't produce direct HTML output.
 */
export function renderHead(_node: AstNode): string {
  // Head configuration is processed by customPropertiesManager
  // No HTML output is generated here
  return ''
}
