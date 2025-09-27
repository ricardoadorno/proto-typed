/**
 * Screen Rendering Functions
 * Functions for rendering screens in different contexts
 */

import { AstNode } from '../../../types/ast-node';
import { ScreenRenderConfig } from '../../../types/render';
import { renderNode } from '../nodes/node-renderer';

/**
 * Render a single screen to HTML with full configuration
 */
export function renderScreen(config: ScreenRenderConfig): string {
  const { screen, index, currentScreen } = config;
  
  const screenName = screen.name?.toLowerCase() || '';
  const style = getScreenVisibilityStyle(screenName, index, currentScreen);
  const layoutClasses = generateLayoutClasses(screen);
  const { headerElements, fabElements, navigatorElements, contentElements } = separateScreenElements(screen);
  
  const headerHtml = headerElements.map(element => renderNode(element)).join('\n') || '';
  const contentHtml = contentElements
    .filter(element => element != null)
    .map(element => renderNode(element))
    .join('\n      ') || '';
  const fabHtml = fabElements.map(element => renderNode(element)).join('\n') || '';
  const navigatorHtml = navigatorElements.map(element => renderNode(element)).join('\n') || '';

  return `
  <div id="${screenName}-screen" class="screen container ${screenName} ${layoutClasses.join(' ')} flex flex-col min-h-screen relative" ${style}>
      ${headerHtml}
      <div class="min-h-[812px] flex-1 p-4 py-10 relative">
        ${contentHtml}
      </div>
      ${fabHtml}
      ${navigatorHtml}
  </div>`;
}

/**
 * Convert a single screen to HTML (simplified version for component usage)
 * This is used by nodeRenderer for individual screen rendering
 */
export function screenToHtml(screen: AstNode): string {
  const screenName = screen.name || '';
  const layoutClasses = generateLayoutClasses(screen);
  const { headerElements, fabElements, navigatorElements, contentElements } = separateScreenElements(screen);
  
  const headerHtml = headerElements.map(element => renderNode(element)).join('\n') || '';
  const contentHtml = contentElements
    .filter(element => element != null)
    .map(element => renderNode(element))
    .join('\n      ') || '';
  const fabHtml = fabElements.map(element => renderNode(element)).join('\n') || '';
  const navigatorHtml = navigatorElements.map(element => renderNode(element)).join('\n') || '';

  return `
  <div class="screen container ${screenName.toLowerCase()} ${layoutClasses.join(' ')} flex flex-col min-h-full relative">
      ${headerHtml}
      <div class="flex-1 p-4 relative">
        ${contentHtml}
      </div>
      ${fabHtml}
      ${navigatorHtml}
  </div>
  `.trim();
}

/**
 * Render all screens to HTML
 */
export function renderAllScreens(screens: AstNode[], currentScreen?: string | null): string {
  return screens
    .filter(screen => screen && screen.name)
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
export function renderScreenForDocument(screen: AstNode, index: number): string {
  const screenName = screen.name?.toLowerCase() || '';
  const style = index === 0 ? '' : 'style="display:none"';
  const layoutClasses = generateLayoutClasses(screen);

  const elementsHtml = screen.elements
    ?.filter(element => {
      // Keep all elements except named modals and drawers (they'll be rendered globally)
      if (element.type === 'modal' || element.type === 'drawer') {
        // Only filter out elements that have names (global elements)
        return !element.name;
      }
      return element != null;
    })
    .map(element => renderNode(element))
    .join('\n      ') || '';

  // Add Tailwind container and screen classes, and id for navigation
  return `
  <div id="${screenName}-screen" class="screen container mx-auto  ${screenName} ${layoutClasses.join(' ')}" ${style}>
      ${elementsHtml}
  </div>`;
}

/**
 * Generate layout classes for a screen based on its elements
 */
function generateLayoutClasses(screen: AstNode): string[] {
  const layoutClasses: string[] = [];
  
  const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
  const hasNavigator = screen.elements?.some(element => element.type === 'Navigator') || false;
  const hasFAB = screen.elements?.some(element => element.type === 'FAB') || false;
  
  if (hasHeader) layoutClasses.push('has-header');
  if (hasNavigator) layoutClasses.push('has-navigator');
  if (hasFAB) layoutClasses.push('has-fab');
  
  return layoutClasses;
}

/**
 * Separate screen elements by type for proper positioning
 */
function separateScreenElements(screen: AstNode) {
  const headerElements = screen.elements?.filter(element => element.type === 'Header') || [];
  const fabElements = screen.elements?.filter(element => element.type === 'FAB') || [];
  const navigatorElements = screen.elements?.filter(element => element.type === 'Navigator') || [];
  const contentElements = screen.elements?.filter(element => 
    element.type !== 'Header' && 
    element.type !== 'FAB' && 
    element.type !== 'Navigator' &&
    // Exclude named modals and drawers (they'll be rendered globally)
    !(element.type === 'modal' && element.name) &&
    !(element.type === 'drawer' && element.name)
  ) || [];
  
  return { headerElements, fabElements, navigatorElements, contentElements };
}

/**
 * Determine screen visibility style
 */
function getScreenVisibilityStyle(screenName: string, index: number, currentScreen?: string | null): string {
  if (currentScreen) {
    return screenName === currentScreen.toLowerCase() ? '' : 'style="display:none"';
  }
  return index === 0 ? '' : 'style="display:none"';
}