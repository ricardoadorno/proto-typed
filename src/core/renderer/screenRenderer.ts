import { AstNode } from '../../types/astNode';
import { nodeToHtml } from './nodeRenderer';

/**
 * Convert a single screen to HTML
 */
export function screenToHtml(screen: AstNode): string {
  const screenName = screen.name || '';
  
  // Check if screen has header, bottom nav, or drawer to add appropriate classes
  const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
  const hasBottomNav = screen.elements?.some(element => element.type === 'BottomNav') || false;
  const hasDrawer = screen.elements?.some(element => element.type === 'Drawer') || false;
  
  const layoutClasses = [];
  if (hasHeader) layoutClasses.push('has-header');
  if (hasBottomNav) layoutClasses.push('has-bottom-nav');
    const elementsHtml = screen.elements
    ?.filter(element => element != null)
    .map(element => nodeToHtml(element))
    .join('\n      ') || '';
  
  // Add drawer overlay if drawer is present
  const drawerOverlay = hasDrawer ? '\n      <div class="drawer-overlay"></div>' : '';
  
  return `
  <div class="screen container ${screenName.toLowerCase()} ${layoutClasses.join(' ')}">
      ${elementsHtml}${drawerOverlay}
  </div>
  `.trim();
}