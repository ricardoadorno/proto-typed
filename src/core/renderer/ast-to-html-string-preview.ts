import { AstNode } from '../../types/ast-node';
import { RenderOptions } from '../../types/render';
import { routeManager } from './core/route-manager';
import { setComponentDefinitions } from './nodes/component-nodes';
import { renderAllScreens, renderGlobalElements } from './infrastructure/html-render-helper';

/**
 * Convert AST to HTML string representation with pagination for in-app preview
 * This version treats the container div as the "body" by adding appropriate styles
 */
export function astToHtmlStringPreview(ast: AstNode | AstNode[], options: RenderOptions = {}): string {
  try {
    // Process routes through the route manager
    routeManager.processRoutes(ast, {
      currentScreen: options.currentScreen || undefined
    });

    // Set route context for navigation analysis
    routeManager.setRouteContext(routeManager.getRouteContext());

    // Create render context
    const context = routeManager.createRenderContext('preview', {
      currentScreen: options.currentScreen || undefined
    });

    const result = generatePreviewHtml(context);
    
    // Clear route context after rendering
    routeManager.clearRouteContext();
    
    return result;
  } catch (error: any) {
    // Clear route context on error
    routeManager.clearRouteContext();
    throw error;
  }
}

/**
 * Generate HTML for preview mode
 */
function generatePreviewHtml(context: any): string {
  const { routes } = context;
  
  // Register components with the renderer
  const componentRoutes = routeManager.getRoutesByType('component');
  const componentNodes = componentRoutes.map(route => route.node);
  setComponentDefinitions(componentNodes);
  
  // Render screens
  const screenRoutes = routeManager.getScreenRoutes();
  const screensHtml = renderAllScreens(
    screenRoutes.map(route => route.node),
    routes.currentScreen
  );
  
  // Render global elements (modals and drawers)
  const globalElementsHtml = renderGlobalElements(routeManager);
  
  // Return wrapped HTML for preview (without script for in-app preview)
  return `<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white relative" data-preview-container="true">

    ${screensHtml}
    ${globalElementsHtml}

    </div>`;
}


