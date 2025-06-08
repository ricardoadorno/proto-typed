import { AstNode } from '../../../types/astNode';
import { elementStyles } from './styles';
import { generateNavigationAttributes } from '../navigationHelper';

/**
 * Render header element
 */
export function renderHeader(node: AstNode, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const headerElements = node.elements && nodeRenderer ? 
    node.elements.flat().map(element => nodeRenderer(element, 'header')).join('\n') : '';
  return `<header class="${elementStyles.header}">${headerElements}</header>`;
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
          <span class="mb-1">${icon || ''}</span>
          <span>${label || ''}</span>
        </button>
      `;
    }
    return '';
  }).join('') || '';
  return `<nav class="${elementStyles.bottomNav}" style="margin-top: auto; order: 999;">${navItems}</nav>`;
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
      <span class="mb-1">${navIcon || ''}</span>
      <span>${navLabel || ''}</span>
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
      <span class="mr-3 text-lg">${drawerIcon || ''}</span>
      <span>${drawerLabel || ''}</span>
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
          <button class="${elementStyles.fabItemBtn} w-12 h-12 rounded-full text-lg" ${itemAttrs}>
            ${itemIcon || ''}
          </button>
          ${itemLabel ? `<span class="fab-item-label">${itemLabel}</span>` : ''}
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
