import { AstNode } from '../../../types/astNode';
import { ProcessedAstData } from '../../../types/render';

/**
 * Parse and separate AST nodes into screens, components, and global elements
 */
export function processAstNodes(ast: AstNode | AstNode[]): ProcessedAstData {
  const nodes = Array.isArray(ast) ? ast : [ast];
  
  const screens = nodes.filter(node => node.type === 'screen');
  const components = nodes.filter(node => node.type === 'component');
  
  // Extract global modals and drawers directly from root nodes (they are now global singletons)
  const globalModals = nodes.filter(node => node.type === 'modal' && node.name);
  const globalDrawers = nodes.filter(node => node.type === 'drawer' && node.name);
  
  return { screens, components, globalModals, globalDrawers };
}
