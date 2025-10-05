import { AstNode } from '../../../types/ast-node';
import { elementStyles, getCardInlineStyles, getListInlineStyles, getUnorderedListInlineStyles, getFabInlineStyles, getNavigatorInlineStyles } from './styles/styles';
import { findComponentDefinitions, substitutePropsInElement } from './components.node';
import { NavigationMediator } from '../infrastructure/navigation-mediator';
import { isLucideIcon, getLucideSvg } from '../../../utils/icon-utils';

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

/**
 * Render FAB (Floating Action Button) element
 */
export function renderFAB(node: AstNode): string {
  const props = node.props as any;
  const icon = props?.icon || 'plus';
  const action = props?.action || '';
  
  // Generate navigation attributes using NavigationMediator
  const navAttrs = NavigationMediator.generateNavigationAttributes(action);
  
  return `
    <div class="${elementStyles.fabContainer}">
      <button class="${elementStyles.fab}" style="${getFabInlineStyles()}" ${navAttrs}>
        ${icon}
      </button>
    </div>
  `;
}

/**
 * Render Navigator (Bottom Navigation) element
 */
export function renderNavigator(node: AstNode): string {
  const items = node.children || [];
  
  const navItems = items.map((item: any) => {
    const text = item.props?.text || '';
    const icon = item.props?.icon || '';
    const destination = item.props?.destination || '';
    
    // Generate navigation action if destination is provided
    const navigationAttrs = destination ? NavigationMediator.generateNavigationAttributes(destination) : '';
    
    // Helper function to render text or icon
    const renderTextOrIcon = (content: string, className: string, extraStyle: string = '') => {
      if (!content) return '';
      
      if (isLucideIcon(content)) {
        // It's a Lucide icon name, render as SVG
        const svgContent = getLucideSvg(content);
        return `<div class="${className}" style="${extraStyle}">${svgContent}</div>`;
      } else {
        // It's regular text (could be emoji or text)
        return `<div class="${className}" style="${extraStyle}">${content}</div>`;
      }
    };
    
    // Build content based on what's available
    let content = '';
    
    if (icon && text) {
      // Both icon and text - stack them vertically
      content = `
        ${renderTextOrIcon(icon, elementStyles.navItemIcon)}
        ${renderTextOrIcon(text, elementStyles.navItemLabel)}
      `;
    } else if (icon) {
      // Only icon - center it
      content = renderTextOrIcon(icon, elementStyles.navItemIcon, 'margin-bottom: 0;');
    } else if (text) {
      // Only text - center it
      content = renderTextOrIcon(text, elementStyles.navItemLabel, 'margin-top: 0;');
    }
    
    return `
      <button class="${elementStyles.navItem}" style="${getNavigatorInlineStyles()}" ${navigationAttrs}>
        ${content}
      </button>
    `;
  }).join('');
  
  return `
    <nav class="${elementStyles.navigator}" style="${getNavigatorInlineStyles()}">
      ${navItems}
    </nav>
  `;
}