import { AstNode } from '../../../types/astNode';
import { elementStyles } from './styles';
import { generateNavigationAttributes } from '../navigationHelper';
import { isLucideIcon, getLucideSvg } from '../../../utils/icon-utils';

/**
 * Helper function to render an icon (either Lucide or regular text/emoji)
 */
function renderIcon(iconText: string): string {
  if (isLucideIcon(iconText)) {
    return getLucideSvg(iconText);
  }
  return iconText;
}

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
    // Other elements go to actions by default
    else {
      actionElements.push(renderedElement);
    }
  }
  
  const titleSection = titleElements.join('');
  
  return `<header class="${elementStyles.header}">${titleSection}${actionElements.join('')}</header>`;
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
          <span class="${elementStyles.navItemIcon}">${renderIcon(icon || '')}</span>
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
      <span class="${elementStyles.navItemIcon}">${renderIcon(navIcon || '')}</span>
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
      <span class="${elementStyles.drawerItemIcon}">${renderIcon(drawerIcon || '')}</span>
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
      const itemAttrs = generateNavigationAttributes(itemAction);        return `
        <div class="${elementStyles.fabItem}">
          ${itemLabel ? `<span class="${elementStyles.fabItemLabel}">${itemLabel}</span>` : ''}
          <button class="${elementStyles.fabItemBtn}" ${itemAttrs}>
            ${renderIcon(itemIcon || '')}
          </button>
        </div>
      `;
    }).join('');    return `
      <div class="${elementStyles.fabContainer}">
        <div class="fab-items-list">
          ${fabItemsHtml}
        </div>
        <button class="${elementStyles.fab}" onclick="toggleFAB(this)" ${fabAttrs}>
          ${renderIcon(fabIcon || '+')}
        </button>
      </div>
    `;  } else {
    return `
      <div class="${elementStyles.fabContainer}">
        <button class="${elementStyles.fab}" ${fabAttrs}>
          ${renderIcon(fabIcon || '+')}
        </button>
      </div>
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
        ${renderIcon(fabItemIcon || '')}
      </button>
      <span class="${elementStyles.fabItemLabel}">${fabItemLabel || ''}</span>
    </div>
  `;
}
