import { AstNode } from '../../types/ast-node'

interface CssProperty {
  property: string
  value: string
}

interface StylesProps {
  cssProperties?: CssProperty[]
}

/**
 * @function renderStyles
 * @description Renders a 'Styles' AST node to its HTML representation, which is a `<style>` block.
 * This function is a no-op because styles are handled by the `customPropertiesManager`.
 *
 * @param {AstNode} node - The 'Styles' AST node.
 * @returns {string} An empty string.
 */
export function renderStyles(node: AstNode): string {
  const props = node.props as StylesProps
  const cssProperties = props?.cssProperties || []

  if (cssProperties.length === 0) {
    return ''
  }

  const cssText = cssProperties
    .map((prop: CssProperty) => `${prop.property}: ${prop.value};`)
    .join('\n  ')

  return `<style>\n  ${cssText}\n</style>`
}

/**
 * @function renderCssProperty
 * @description Renders a 'CssProperty' AST node to its CSS representation.
 *
 * @param {AstNode} node - The 'CssProperty' AST node.
 * @returns {string} The CSS property string.
 */
export function renderCssProperty(node: AstNode): string {
  const props = node.props as CssProperty
  const property = props?.property || ''
  const value = props?.value || ''

  return `${property}: ${value};`
}
