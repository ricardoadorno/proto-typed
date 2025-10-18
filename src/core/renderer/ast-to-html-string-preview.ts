import { AstNode } from '../../types/ast-node';
import { RenderOptions } from '../../types/render';
import { ProtoError } from '../../types/errors';
import { routeManager } from './core/route-manager';
import { customPropertiesManager } from './core/theme-manager';
import { resetRenderErrors, getRenderErrors } from './core/node-renderer';
import { setComponentDefinitions } from './nodes/components.node';
import { renderAllScreens, renderGlobalElements } from './infrastructure/html-render-helper';

/**
 * Result of rendering with errors collected
 */
export interface RenderResult {
  html: string;
  errors: ProtoError[];
}

/**
 * Convert AST to HTML string representation with pagination for in-app preview
 * This version treats the container div as the "body" by adding appropriate styles
 * 
 * @returns Object with html string and collected render errors
 */
export function astToHtmlStringPreview(ast: AstNode | AstNode[], options: RenderOptions = {}): RenderResult {
  try {
    // Reset render errors before starting
    resetRenderErrors();
    
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

    const html = generatePreviewHtml(context);
    
    // Collect render errors after rendering
    const errors = getRenderErrors();
    
    // Clear route context after rendering
    routeManager.clearRouteContext();
    
    return { html, errors };
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
  return `
  <div data-preview-container="true" class="h-full w-full overflow-auto">
    ${scopedStyles}
    ${screensHtml}
    ${globalElementsHtml}

    </div>`;
}


