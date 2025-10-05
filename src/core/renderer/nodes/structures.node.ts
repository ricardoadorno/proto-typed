import { AstNode } from '../../../types/ast-node';
import { elementStyles, getCardInlineStyles, getListInlineStyles, getUnorderedListInlineStyles } from './styles/styles';
import { findComponentDefinitions, substitutePropsInElement } from './components.node';

/**
 * Render list element
 */
export function renderList(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const props = node.props as any;
  
  // Check if this is a list with component template
  if (props?.componentName && props?.dataItems) {
    const { componentName, dataItems } = props;
    
    if (!componentName || !dataItems || !Array.isArray(dataItems)) {
      return '<div style="color: var(--destructive);">Error: Invalid list with component data</div>';
    }

    const components = findComponentDefinitions();
    const componentDef = components.find((comp: any) => comp.name === componentName);
    
    if (!componentDef) {
      return `<div style="color: var(--destructive);">Error: Component "${componentName}" not found</div>`;
    }

    if (!nodeRenderer) {
      return '<div style="color: var(--destructive);">Error: NodeRenderer required for list rendering</div>';
    }

    // Render each data item using the component template
    const listItems = dataItems.map((dataItem: string[]) => {
      const componentElements = componentDef.children || [];
      
      return componentElements.map(element => {
        const substitutedElement = substitutePropsInElement(element, dataItem);
        return nodeRenderer(substitutedElement, context);
      }).join('\n');
    }).join('\n');

    return `<div class="${elementStyles.unorderedList}" style="${getListInlineStyles()}">${listItems}</div>`;
  }
  
  // Render children as list items
  const listElements = node.children && nodeRenderer ? 
    node.children.map(child => nodeRenderer(child, context)).join('\n') : '';
  
  return `<div class="${elementStyles.unorderedList}" style="${getListInlineStyles()}">${listElements}</div>`;
}

/**
 * Render list item element
 */
export function renderListItem(node: AstNode): string {
  const props = node.props as any;
  const itemContent = props?.text || '';
  
  return `<li class="${elementStyles.listItem}" style="${getUnorderedListInlineStyles()}">${itemContent}</li>`;
}

/**
 * Render card element
 */
export function renderCard(node: AstNode, _context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const cardElements = node.children && nodeRenderer ? 
    node.children.map(child => nodeRenderer(child, 'card')).join('\n') : '';
  
  return `<div class="${elementStyles.card}" style="${getCardInlineStyles()}">${cardElements}</div>`;
}

/**
 * Render header element
 */
export function renderHeader(node: AstNode, nodeRenderer: (node: AstNode, context?: string) => string): string {
  const headerElements = node.children ? 
    node.children.map(child => nodeRenderer(child, 'header')).join('\n') : '';
  
  return `<header class="${elementStyles.header}">${headerElements}</header>`;
}

/**
 * Render separator element
 */
export function renderSeparator(): string {
  return `<hr class="${elementStyles.separator}" />`;
}