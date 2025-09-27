import { AstNode } from '../../../types/ast-node';
import { getLucideSvg, isLucideIcon } from '../../../utils';
import { NavigationMediator } from '../helpers/navigation-mediator';
import { elementStyles, getScreenClasses } from './styles';

/**
 * Render modal element
 */
export function renderModal(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const modalElements = node.elements && nodeRenderer ? 
    node.elements.map(el => nodeRenderer(el, context)).join('\n') : '';
  
  return `<div class="modal hidden" id="modal-${node.name}" data-modal="${node.name}">
    <div class="modal-backdrop absolute inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative" >
        <button class="modal-close absolute top-4 right-4 text-gray-500 hover:text-gray-700" data-nav="${node.name}" data-nav-type="toggle">&times;</button>
        ${modalElements}
      </div>
    </div>
  </div>`;
}

/**
 * Render drawer element
 */
export function renderDrawer(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  // Only handle named drawers (modern pattern)
  if (!node.name) {
    console.warn('Drawer element requires a name. Legacy unnamed drawers are deprecated.');
    return '';
  }

  const drawerElements = node.elements && nodeRenderer ? 
    node.elements.map(el => nodeRenderer(el, context)).join('\n') : '';
    
  return `<div class="drawer-container hidden" id="drawer-${node.name}" data-drawer="${node.name}">
    <div class="drawer-overlay absolute inset-0 bg-black/30  z-[1050]"></div>
    <aside class="drawer-content absolute top-0 left-0 z-[1100] w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out">
      <div class="p-4">
        <button class="drawer-close absolute top-4 right-4 text-gray-500 hover:text-gray-700" data-nav="${node.name}" data-nav-type="toggle">&times;</button>
        ${drawerElements}
      </div>
    </aside>
  </div>`;
}

/**
 * Render screen element
 */
export function renderScreen(node: AstNode, nodeRenderer: (node: AstNode, context?: string) => string): string {
  const screenName = node.name || '';
  
  // Check if screen has header, bottom nav, or FAB to add appropriate classes
  const hasHeader = node.elements?.some(element => element.type === 'Header') || false;
  const hasNavigator = node.elements?.some(element => element.type === 'Navigator') || false;
  const hasFAB = node.elements?.some(element => element.type === 'FAB') || false;
  
  const layoutClasses = [];
  if (hasHeader) layoutClasses.push('has-header');
  if (hasNavigator) layoutClasses.push('has-navigator');
  if (hasFAB) layoutClasses.push('has-fab');
  
  // Separate header, content, FAB, and bottom nav for proper positioning
  const headerElements = node.elements?.filter(element => element.type === 'Header') || [];
  const fabElements = node.elements?.filter(element => element.type === 'FAB') || [];
  const navigatorElements = node.elements?.filter(element => element.type === 'Navigator') || [];
  const contentElements = node.elements?.filter(element => 
    element.type !== 'Header' && element.type !== 'FAB' && element.type !== 'Navigator'
  ) || [];
  
  const headerHtml = headerElements
    ?.map(element => nodeRenderer(element))
    .join('\n') || '';
    
  const contentHtml = contentElements
    ?.filter(element => element != null)
    .map(element => nodeRenderer(element))
    .join('\n      ') || '';
    
  const fabHtml = fabElements
    ?.map(element => nodeRenderer(element))
    .join('\n') || '';
    
  const navigatorHtml = navigatorElements
    ?.map(element => nodeRenderer(element))
    .join('\n') || '';
  
  const screenClasses = getScreenClasses([screenName.toLowerCase(), ...layoutClasses]);
  
  return `
  <div class="${screenClasses}" style="display: flex; flex-direction: column; min-height: 100vh; position: relative;">
      ${headerHtml}
      <div style="flex: 1; padding: 1rem; position: relative;">
        ${contentHtml}
        ${fabHtml}
      </div>
      ${navigatorHtml}
  </div>
  `.trim();
}

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
 * Render navigator element
 */
export function renderNavigator(node: AstNode): string {
  const navItems = node.elements?.map(item => {
    if (item.type === 'NavItem') {
      const navItemProps = item.props as any;
      const { label, icon, action } = navItemProps || {};
      const navAttrs = NavigationMediator.generateNavigationAttributes(action);
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
  const navItemAttrs = NavigationMediator.generateNavigationAttributes(navAction);
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
  const drawerItemAttrs = NavigationMediator.generateNavigationAttributes(drawerAction);
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
  const fabAttrs = NavigationMediator.generateNavigationAttributes(fabHref);
  
  return `
    <div class="${elementStyles.fabContainer}">
      <button class="${elementStyles.fab}" ${fabAttrs}>
        ${renderIcon(fabIcon || '+')}
      </button>
    </div>
  `;
}