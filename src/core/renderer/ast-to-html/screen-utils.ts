import { AstNode } from '../../../types/astNode';

/**
 * Generate layout classes for a screen based on its elements
 */
export function generateLayoutClasses(screen: AstNode): string[] {
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
export function separateScreenElements(screen: AstNode) {
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
export function getScreenVisibilityStyle(screenName: string, index: number, currentScreen?: string | null): string {
  if (currentScreen) {
    return screenName === currentScreen.toLowerCase() ? '' : 'style="display:none"';
  }
  return index === 0 ? '' : 'style="display:none"';
}
