import { AstNode } from '../../../types/ast-node';

/**
 * Render styles element
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
 * Render CSS property element
 */
export function renderCssProperty(node: AstNode): string {
  const props = node.props as any;
  const property = props?.property || '';
  const value = props?.value || '';
  
  return `${property}: ${value};`;
}