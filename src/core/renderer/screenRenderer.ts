import { AstNode } from '../../types/astNode';
import { nodeToHtml } from './nodeRenderer';

/**
 * Convert a single screen to HTML
 */
export function screenToHtml(screen: AstNode): string {
  const screenName = screen.name || '';
  
  const elementsHtml = screen.elements
    ?.filter(element => element != null)
    .map(element => nodeToHtml(element))
    .join('\n      ') || '';
  
  return `
  <div class="screen container ${screenName.toLowerCase()}">
      ${elementsHtml}
  </div>
  `.trim();
}