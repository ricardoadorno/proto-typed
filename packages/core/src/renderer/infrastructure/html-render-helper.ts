/**
 * Screen Rendering Functions
 * Functions for rendering screens in different contexts
 */

import { AstNode } from '@proto-typed/shared'; //ast-node';
import { ScreenRenderConfig } from '@proto-typed/shared'; //render';
import { renderNode } from '../core/node-renderer';
import { RouteManager } from '../core/route-manager';

/**
 * Render a single screen to HTML with full configuration
 */
function renderScreen(config: ScreenRenderConfig): string {
  const { screen, index, currentScreen } = config;
  
  const screenName = (screen.props as any)?.name || ''; // Nome original preservado
  const style = getScreenVisibilityStyle(screenName, index, currentScreen);
  const { headerElements, fabElements, navigatorElements, contentElements } = separateScreenElements(screen);
  
  const headerHtml = headerElements.map((element: any) => renderNode(element)).join('\n') || "<span class='block h-12'></span>";
  const contentHtml = contentElements
    .filter((element: any) => element != null)
    .map((element: any) => renderNode(element))
    .join('\n      ') || '';
  const fabHtml = fabElements.map((element: any) => renderNode(element)).join('\n') || '';
  const navigatorHtml = navigatorElements.map((element: any) => renderNode(element)).join('\n') || '';

  return `
  <div id="${screenName}-screen" class="relative overflow-hidden h-full" ${style}>
      ${headerHtml}
      <div class="h-full overflow-auto">
      ${contentHtml}
      </div>
      ${fabHtml}
      ${navigatorHtml}
  </div>`;
}

/**
 * Render all screens to HTML
 */
export function renderAllScreens(screens: AstNode[], currentScreen?: string | null): string {
  return screens
    .filter(screen => screen && (screen.props as any)?.name)
    .map((screen, index) => renderScreen({
      screen,
      index,
      currentScreen
    }))
    .join('\n\n');
}

/**
 * Render a single screen to HTML for document export with enhanced styling
 */
export function renderScreenForDocument(screen: AstNode, index: number, currentScreen?: string | null): string {
  const screenName = (screen.props as any)?.name || '';
  // If a currentScreen is explicitly provided, use that for visibility, else fall back to first screen visible
  const style = currentScreen
    ? (screenName === currentScreen ? '' : 'style="display:none"')
    : (index === 0 ? '' : 'style="display:none"');

  const elementsHtml = screen.children
    ?.filter((element: any) => {
      // Keep all elements except named modals and drawers (they'll be rendered globally)
      if (element.type === 'Modal' || element.type === 'Drawer') {
        // Only filter out elements that have names (global elements)
        return !(element.props as any)?.name;
      }
      return element != null;
    })
    .map(element => renderNode(element))
    .join('\n      ') || '';

  // Add Tailwind container and screen classes, and id for navigation
  return `
  <div id="${screenName}-screen" data-screen="${screenName}" class="relative"  ${style}>
      ${elementsHtml}
  </div>`;
}

/**
 * Separate screen elements by type for proper positioning
 */
function separateScreenElements(screen: AstNode) {
  const headerElements = screen.children?.filter((element: any) => element.type === 'Header') || [];
  const fabElements = screen.children?.filter((element: any) => element.type === 'Fab') || [];
  const navigatorElements = screen.children?.filter((element: any) => element.type === 'Navigator') || [];
  const contentElements = screen.children?.filter((element: any) => 
    element.type !== 'Header' && 
    element.type !== 'Fab' && 
    element.type !== 'Navigator' &&
    // Exclude named modals and drawers (they'll be rendered globally)
    !(element.type === 'Modal' && (element.props as any)?.name) &&
    !(element.type === 'Drawer' && (element.props as any)?.name)
  ) || [];
  
  return { headerElements, fabElements, navigatorElements, contentElements };
}

/**
 * Determine screen visibility style
 */
function getScreenVisibilityStyle(screenName: string, index: number, currentScreen?: string | null): string {
  if (currentScreen) {
    return screenName === currentScreen ? '' : 'style="display:none"';
  }
  return index === 0 ? '' : 'style="display:none"';
}

/**
 * Render global elements (modals and drawers)
 */
export function renderGlobalElements(routeManager: RouteManager): string {
  const modalRoutes = routeManager.getRoutesByType('modal');
  const drawerRoutes = routeManager.getRoutesByType('drawer');
  
  const modalsHtml = modalRoutes.length > 0 
    ? modalRoutes.map(route => renderNode(route.node)).join('\n') 
    : '';
  
  const drawersHtml = drawerRoutes.length > 0 
    ? drawerRoutes.map(route => renderNode(route.node)).join('\n') 
    : '';
  
  if (modalsHtml || drawersHtml) {
    return '\n\n' + [modalsHtml, drawersHtml].filter(Boolean).join('\n') + '\n';
  }
  
  return '';
}