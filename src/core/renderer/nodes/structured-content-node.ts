import { AstNode } from '../../../types/ast-node';
import { elementStyles, getCardInlineStyles, getListInlineStyles, getListItemInlineStyles } from './styles/styles';
import { findComponentDefinitions, substitutePropsInElement } from './component-nodes';

/**
 * Render ordered list element
 */
export function renderOrderedList(node: AstNode): string {
  const props = node.props as any;
  const olItems = (props?.items || [])
    .map((item: string) => `<li class="${elementStyles.listItem}">${item}</li>`)
    .join('\n');
  return `<ol class="${elementStyles.orderedList}" style="${getListInlineStyles()}">${olItems}</ol>`;
}

/**
 * Render unordered list element
 */
export function renderUnorderedList(node: AstNode): string {
  const props = node.props as any;
  const ulItems = (props?.items || [])
    .map((item: any) => {
      // Handle object items with text property
      if (typeof item === 'object' && item.text) {
        return `<li class="${elementStyles.listItem}">${item.text}</li>`;
      }
      // Handle string items (fallback)
      return `<li class="${elementStyles.listItem}">${item}</li>`;
    })
    .join('\n');
  return `<ul class="${elementStyles.unorderedList}" style="${getListInlineStyles()}">${ulItems}</ul>`;
}

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
      return `<div style="color: var(--destructive);">Error: Node renderer not provided</div>`;
    }    // Render each data item using the component as template
    const renderedItems = dataItems.map((itemProps: string[]) => {
      const componentElements = componentDef.elements || [];
      return componentElements
        .map((element: AstNode) => {
          // Create a copy of the element with props substituted
          const elementWithSubstitution = substitutePropsInElement(element, itemProps);
          return nodeRenderer(elementWithSubstitution, context);
        })
        .join('\n');
    }).join('\n');

    return `<div class="space-y-3">${renderedItems}</div>`;
  }
  
  // Regular list rendering
  const listItems = node.elements && nodeRenderer ? 
    node.elements.flat().map(item => nodeRenderer(item, context)).join('\n') : '';
  return `<div class="space-y-3">${listItems}</div>`;
}

/**
 * Render list item element
 */
export function renderListItem(node: AstNode): string {
  const props = node.props as any;
  const { text } = props || {};
  
  return `
    <div class="${elementStyles.simpleListItem}" style="${getListItemInlineStyles()}">
      <span style="color: var(--foreground);">${text || ''}</span>
    </div>  `;
}

/**
 * Render header element
 */
export function renderHeader(node: AstNode, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  if (!node.elements || !nodeRenderer) {
    return `<header class="${elementStyles.header}"></header>`;
  }
  
  // Render all content elements inside the header
  const content = node.elements.flat()
    .map(element => nodeRenderer(element, 'header'))
    .join('');
  
  return `<header class="${elementStyles.header}">${content}</header>`;
}

/**
 * Render card element
 */
export function renderCard(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const cardElements = node.elements && nodeRenderer ? 
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<article class="${elementStyles.card}" style="${getCardInlineStyles()}">${cardElements}</article>`;
}