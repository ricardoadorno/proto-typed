import { AstNode } from '../../types/astNode';
import { nodeToHtml, setComponentDefinitions } from './nodeRenderer';
import { RenderOptions } from '../../types/renderOptions';

/**
 * Convert AST to HTML string representation with pagination for in-app preview
 */
export function astToHtml(ast: AstNode | AstNode[], { currentScreen }: RenderOptions = {}): string {
  const nodes = Array.isArray(ast) ? ast : [ast];
  
  if (nodes.length === 0) return '';
  
  // Separate screens and components
  const screens = nodes.filter(node => node.type === 'Screen' || node.type === 'screen');
  const components = nodes.filter(node => node.type === 'component');
  
  // Register components with the renderer
  setComponentDefinitions(components);
  
  // Check if any screen has a drawer - if so, extract it and make it global
  let globalDrawer: AstNode | null = null;
  
  screens.forEach(screen => {
    const drawerElement = screen.elements?.find(element => element.type === 'Drawer');
    if (drawerElement && !globalDrawer) {
      globalDrawer = drawerElement;
    }
  });
  // Generate the HTML for all screens, with unique IDs and display:none (except currentScreen or first screen)
  const screensHtml = screens
    .filter(screen => screen && screen.name)
    .map((screen, index) => {
      const screenName = screen.name?.toLowerCase() || '';
      const style = currentScreen ? (screenName === currentScreen.toLowerCase() ? '' : 'style="display:none"')
      : (index === 0 ? '' : 'style="display:none"') 
      
      // Check if screen has header or bottom nav to add appropriate classes
      const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
      const hasBottomNav = screen.elements?.some(element => element.type === 'BottomNav') || false;
      
      const layoutClasses = [];
      if (hasHeader) layoutClasses.push('has-header');
      if (hasBottomNav) layoutClasses.push('has-bottom-nav');
      if (globalDrawer) layoutClasses.push('has-drawer');
      
      // Filter out drawer elements from individual screens since we'll render it globally
      const elementsHtml = screen.elements
        ?.filter(element => element != null && element.type !== 'Drawer')
        .map(element => nodeToHtml(element))
        .join('\n      ') || '';
      
      return `
  <div id="${screenName}-screen" class="screen container ${screenName} ${layoutClasses.join(' ')}" ${style}>
      ${elementsHtml}
  </div>`;
    })
    .join('\n\n');
  
  // Add global drawer if it exists
  const globalDrawerHtml = globalDrawer ? `\n\n${nodeToHtml(globalDrawer)}\n<div class="drawer-overlay"></div>` : '';
  
  return `${screensHtml}${globalDrawerHtml}`;
}

// Export the document renderer function
export { astToHtmlDocument } from './documentRenderer';