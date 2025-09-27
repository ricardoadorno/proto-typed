import { AstNode } from '../../types/astNode';
import { RenderOptions } from '../../types/render';
import { StringPreviewStrategy } from './route-manager/strategy/string-preview-strategy';
import { routeManager } from './route-manager/route-manager';

/**
 * Convert AST to HTML string representation with pagination for in-app preview
 * This version treats the container div as the "body" by adding appropriate styles
 */
export function astToHtmlStringPreview(ast: AstNode | AstNode[], options: RenderOptions = {}): string {
  const stringPreviewStrategy = new StringPreviewStrategy(routeManager);
  
  // Process routes to extract metadata
  routeManager.processRoutes(ast, { currentScreen: options.currentScreen || undefined });
  
  // Get metadata for client context
  const routeMetadata = routeManager.getMetadata();
  
  // Create enhanced render options with metadata
  const enhancedOptions: RenderOptions = {
    ...options,
    routeMetadata,
    availableRoutes: {
      screens: routeMetadata.screens.map(screen => screen.id),
      modals: routeMetadata.modals.map(modal => modal.id),
      drawers: routeMetadata.drawers.map(drawer => drawer.id),
      components: routeMetadata.components.map(component => component.id),
    }
  };
  
  return stringPreviewStrategy.render(ast, enhancedOptions);
}

/**
 * Get route metadata from processed AST without rendering
 * Useful for clients that need context information only
 */
export function getRouteMetadata(ast: AstNode | AstNode[], currentScreen?: string) {
  console.log('getRouteMetadata called with currentScreen:', currentScreen);
  routeManager.processRoutes(ast, { currentScreen });
  const metadata = routeManager.getMetadata();
  console.log('getRouteMetadata returning metadata:', metadata);
  return metadata;
}