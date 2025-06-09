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
  
  // Separate header, content, FAB, and bottom nav for proper positioning
  const headerElements = node.elements?.filter(element => element.type === 'Header') || [];
  const fabElements = node.elements?.filter(element => element.type === 'FAB') || [];
  const bottomNavElements = node.elements?.filter(element => element.type === 'BottomNav') || [];
  const contentElements = node.elements?.filter(element => 
    element.type !== 'Header' && element.type !== 'FAB' && element.type !== 'BottomNav'
  ) || [];
  
  const headerHtml = headerElements
    ?.map(element => nodeRenderer(element))
    .join('\n') || '';
    
  const contentHtml = contentElements
    ?.filter(element => element != null)
    .map(element => nodeRenderer(element))
    .join('\n      ') || '';
    
  const fabHtml = fabElements
    ?.map(element => nodeRenderer(element))
    .join('\n') || '';
    
  const bottomNavHtml = bottomNavElements
    ?.map(element => nodeRenderer(element))
    .join('\n') || '';
  
  const screenClasses = getScreenClasses([screenName.toLowerCase(), ...layoutClasses]);
  
  return `
  <div class="${screenClasses}" style="display: flex; flex-direction: column; min-height: 100vh; position: relative;">
      ${headerHtml}
      <div style="flex: 1; padding: 1rem; position: relative;">
        ${contentHtml}
        ${fabHtml}
      </div>
      ${bottomNavHtml}
  </div>
  `.trim();
}
