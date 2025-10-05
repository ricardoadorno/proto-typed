import { AstNode } from '../../types/ast-node';
import { RenderOptions } from '../../types/render';
import { routeManager } from './core/route-manager';
import { customPropertiesManager } from './core/theme-manager';
import { setComponentDefinitions } from './nodes/components.node';
import { renderAllScreens, renderGlobalElements } from './infrastructure/html-render-helper';

/**
 * Convert AST to HTML string representation with pagination for in-app preview
 * This version treats the container div as the "body" by adding appropriate styles
 */
export function astToHtmlStringPreview(ast: AstNode | AstNode[], options: RenderOptions = {}): string {
  try {
    // Reset and process custom properties for this preview
    customPropertiesManager.reset();
    
    // Process styles first to configure custom properties
    const astArray = Array.isArray(ast) ? ast : [ast];
    const stylesNodes = astArray.filter(node => node.type === 'Styles');
    customPropertiesManager.processStylesConfig(stylesNodes);

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
  
  // Generate complete CSS variables for scoped styling (theme + custom)
  const allVariables = customPropertiesManager.generateAllCssVariables(true);
  const scopedStyles = allVariables ? `
    <style>
      [data-preview-container="true"] {
${allVariables}
        /* Use CSS variables instead of hardcoded colors */
        background: var(--background);
        color: var(--foreground);
        min-height: 100vh;
        position: relative;
      }
    </style>` : '';
  
  // Return wrapped HTML for preview with only theme-based styling
  return `${scopedStyles}<div data-preview-container="true">

    ${screensHtml}
    ${globalElementsHtml}

    </div>`;
}


