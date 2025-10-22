import { AstNode } from '../../types/ast-node';

/**
 * @function renderStyles
 * @description Renders a 'Styles' AST node to its HTML representation, which is a `<style>` block.
 * This function is a no-op because styles are handled by the `customPropertiesManager`.
 *
 * @param {AstNode} node - The 'Styles' AST node.
 * @returns {string} An empty string.
 */
export function renderStyles(node: AstNode): string {
  const props = node.props as any;
  const cssProperties = props?.cssProperties || [];
  
  if (cssProperties.length === 0) {
    return '';
  }
  
  const cssText = cssProperties
    .map((prop: any) => `${prop.property}: ${prop.value};`)
    .join('\n  ');
  
  return `<style>\n  ${cssText}\n</style>`;
}

/**
 * @function renderCssProperty
 * @description Renders a 'CssProperty' AST node to its CSS representation.
 *
 * @param {AstNode} node - The 'CssProperty' AST node.
 * @returns {string} The CSS property string.
 */
export function renderCssProperty(node: AstNode): string {
  const props = node.props as any;
  const property = props?.property || '';
  const value = props?.value || '';
  
  return `${property}: ${value};`;
}
