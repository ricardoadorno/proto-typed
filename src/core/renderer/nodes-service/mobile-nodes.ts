import { AstNode } from '../../../types/astNode';
import { elementStyles } from './styles';
import { generateNavigationAttributes } from '../navigation-service';
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
  
  // Render all content elements inside the header
  const content = node.elements.flat()
    .map(element => nodeRenderer(element, 'header'))
    .join('');
  
  return `<header class="${elementStyles.header}">${content}</header>`;
}

/**
 * Render navigator element
 */
export function renderNavigator(node: AstNode): string {
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
  return `<nav class="${elementStyles.navigator}">${navItems}</nav>`;
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
  const { icon: fabIcon, href: fabHref } = fabProps || {};
  const fabAttrs = generateNavigationAttributes(fabHref);
  
  return `
    <div class="${elementStyles.fabContainer}">
      <button class="${elementStyles.fab}" ${fabAttrs}>
        ${renderIcon(fabIcon || '+')}
      </button>
    </div>
  `;
}
