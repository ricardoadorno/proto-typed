import { AstNode } from '../../../types/astNode';
import { renderNode } from '../node-renderer';

/**
 * Render global modals and drawers HTML
 */
export function renderGlobalElements(modals: AstNode[], drawers: AstNode[]): string {
  const modalsHtml = modals.length > 0 
    ? modals.map(modal => renderNode(modal)).join('\n') 
    : '';
  
  const drawersHtml = drawers.length > 0 
    ? drawers.map(drawer => renderNode(drawer)).join('\n') 
    : '';
  
  if (modalsHtml || drawersHtml) {
    return '\n\n' + [modalsHtml, drawersHtml].filter(Boolean).join('\n') + '\n';
  }
  
  return '';
}
