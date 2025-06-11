import { AstNode } from '../../../types/astNode';
import { ProcessedAstData } from '../../../types/render';

/**
 * Parse and separate AST nodes into screens and components
 */
export function processAstNodes(ast: AstNode | AstNode[]): ProcessedAstData {
  const nodes = Array.isArray(ast) ? ast : [ast];
  
  const screens = nodes.filter(node => node.type === 'Screen' || node.type === 'screen');
  const components = nodes.filter(node => node.type === 'component');
  
  // Extract global modals and drawers from all screens
  const globalModals: AstNode[] = [];
  const globalDrawers: AstNode[] = [];
  
  screens.forEach(screen => {
    const modalElements = screen.elements?.filter(element => 
      element.type?.toLowerCase() === 'modal' && element.name
    ) || [];
    const drawerElements = screen.elements?.filter(element => 
      element.type?.toLowerCase() === 'drawer' && element.name
    ) || [];
    
    globalModals.push(...modalElements);
    globalDrawers.push(...drawerElements);
  });
  
  return { screens, components, globalModals, globalDrawers };
}
