import { AstNode } from '../../../types/astNode';
import { getScreenClasses } from './styles';

/**
 * Render screen element
 */
export function renderScreen(node: AstNode, nodeRenderer: (node: AstNode, context?: string) => string): string {
  const screenName = node.name || '';
  
  // Check if screen has header, bottom nav, or FAB to add appropriate classes
  const hasHeader = node.elements?.some(element => element.type === 'Header') || false;
  const hasBottomNav = node.elements?.some(element => element.type === 'BottomNav') || false;
  const hasFAB = node.elements?.some(element => element.type === 'FAB') || false;
  
  const layoutClasses = [];
  if (hasHeader) layoutClasses.push('has-header');
  if (hasBottomNav) layoutClasses.push('has-bottom-nav');
  if (hasFAB) layoutClasses.push('has-fab');
  
  // Separate FAB elements from other elements for proper positioning
  const fabElements = node.elements?.filter(element => element.type === 'FAB') || [];
  const otherElements = node.elements?.filter(element => element.type !== 'FAB') || [];
  
  const elementsHtml = otherElements
    ?.filter(element => element != null)
    .map(element => nodeRenderer(element))
    .join('\n      ') || '';
    
  const fabHtml = fabElements
    ?.map(element => nodeRenderer(element))
    .join('\n      ') || '';
  
  const screenClasses = getScreenClasses([screenName.toLowerCase(), ...layoutClasses]);
  
  return `
  <div class="${screenClasses}" style="display: flex; flex-direction: column; min-height: 100vh;">
      <div style="flex: 1;">
        ${elementsHtml}
      </div>
      ${fabHtml}
  </div>
  `.trim();
}
