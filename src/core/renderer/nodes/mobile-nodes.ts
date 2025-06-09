import { AstNode } from '../../../types/astNode';
import { elementStyles } from './styles';
import { generateNavigationAttributes } from '../navigationHelper';

/**
 * Render header element
 */
export function renderHeader(node: AstNode, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  if (!node.elements || !nodeRenderer) {
    return `<header class="${elementStyles.header}"></header>`;
  }
  
  // Separate title and action elements
  const titleElements: string[] = [];
  const actionElements: string[] = [];
  
  for (const element of node.elements.flat()) {
    const renderedElement = nodeRenderer(element, 'header');
    
    // Check if it's a heading (title)
    if (element.type.startsWith('Heading')) {
      const titleContent = renderedElement.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g, '$1');
      titleElements.push(`<div class="${elementStyles.headerTitle}">${titleContent}</div>`);
    }
    // Check if it's a button (action)
    else if (element.type === 'Button') {
      const buttonContent = renderedElement.replace(/class="[^"]*"/g, `class="${elementStyles.headerButton}"`);
      actionElements.push(buttonContent);
    }
    // Other elements go to actions by default
    else {
      actionElements.push(renderedElement);
    }
  }
  
  const titleSection = titleElements.join('');
  const actionSection = actionElements.length > 0 
    ? `<div class="${elementStyles.headerActions}">${actionElements.join('')}</div>`
    : '';
  
  return `<header class="${elementStyles.header}">${titleSection}${actionSection}</header>`;
}

/**
 * Render bottom navigation element
 */
export function renderBottomNav(node: AstNode): string {
  const navItems = node.elements?.map(item => {
    if (item.type === 'NavItem') {
      const navItemProps = item.props as any;
      const { label, icon, action } = navItemProps || {};
      const navAttrs = generateNavigationAttributes(action);
      
      return `
        <button class="${elementStyles.navItem}" ${navAttrs}>
          <span class="${elementStyles.navItemIcon}">${icon || ''}</span>
          <span class="${elementStyles.navItemLabel}">${label || ''}</span>
        </button>
      `;
    }
    return '';
  }).join('') || '';
  return `<nav class="${elementStyles.bottomNav}">${navItems}</nav>`;
}

/**
 * Render navigation item element
 */
export function renderNavItem(node: AstNode): string {
  const navItemProps = node.props as any;
  const { label: navLabel, icon: navIcon, action: navAction } = navItemProps || {};
  const navItemAttrs = generateNavigationAttributes(navAction);
  
  return `
    <button class="${elementStyles.navItem}" ${navItemAttrs}>
      <span class="${elementStyles.navItemIcon}">${navIcon || ''}</span>
      <span class="${elementStyles.navItemLabel}">${navLabel || ''}</span>
    </button>
  `;
}

/**
 * Render drawer item element
 */
export function renderDrawerItem(node: AstNode): string {
  const drawerItemProps = node.props as any;
  const { label: drawerLabel, icon: drawerIcon, action: drawerAction } = drawerItemProps || {};
  const drawerItemAttrs = generateNavigationAttributes(drawerAction);
  
  return `
    <button class="${elementStyles.drawerItem}" ${drawerItemAttrs}>
      <span class="${elementStyles.drawerItemIcon}">${drawerIcon || ''}</span>
      <span class="${elementStyles.drawerItemLabel}">${drawerLabel || ''}</span>
    </button>
  `;
}

/**
 * Render FAB (Floating Action Button) element
 */
export function renderFAB(node: AstNode): string {
  const fabProps = node.props as any;
  const { icon: fabIcon, action: fabAction } = fabProps || {};
  const fabAttrs = generateNavigationAttributes(fabAction);
  
  const fabItems = node.elements?.filter(el => el.type === 'FABItem') || [];
  
  if (fabItems.length > 0) {
    const fabItemsHtml = fabItems.map(item => {
      const itemProps = item.props as any;
      const { icon: itemIcon, label: itemLabel, action: itemAction } = itemProps || {};
      const itemAttrs = generateNavigationAttributes(itemAction);
        return `
        <div class="${elementStyles.fabItem}">
          ${itemLabel ? `<span class="${elementStyles.fabItemLabel}">${itemLabel}</span>` : ''}
          <button class="${elementStyles.fabItemBtn}" ${itemAttrs}>
            ${itemIcon || ''}
          </button>
        </div>
      `;
    }).join('');
    
    return `
      <div class="fab-container">
        <div class="fab-items-list">
          ${fabItemsHtml}
        </div>
        <button class="${elementStyles.fab}" onclick="toggleFAB(this)" ${fabAttrs}>
          ${fabIcon || '+'}
        </button>
      </div>
    `;
  } else {
    return `
      <button class="${elementStyles.fab}" ${fabAttrs}>
        ${fabIcon || '+'}
      </button>
    `;
  }
}

/**
 * Render FAB item element
 */
export function renderFABItem(node: AstNode): string {
  const fabItemProps = node.props as any;
  const { icon: fabItemIcon, label: fabItemLabel, action: fabItemAction } = fabItemProps || {};
  const fabItemAttrs = generateNavigationAttributes(fabItemAction);
  
  return `
    <div class="${elementStyles.fabItem}">
      <button class="${elementStyles.fabItemBtn}" ${fabItemAttrs}>
        ${fabItemIcon || ''}
      </button>
      <span class="${elementStyles.fabItemLabel}">${fabItemLabel || ''}</span>
    </div>
  `;
}
