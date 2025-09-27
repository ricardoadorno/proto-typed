/**
 * Preview Strategy
 * Strategy for in-app preview rendering using the route manager
 */

import { AstNode } from '../../../../types/ast-node';
import { RenderOptions } from '../../../../types/render';
import { setComponentDefinitions } from '../../nodes/component-nodes';
import { renderNode } from '../../nodes/node-renderer';
import { RouteManager, RouteRenderContext } from '../route-manager';
import { renderAllScreens } from '../screen-renderer';

/**
 * Preview strategy for in-app preview rendering
 * This treats the container div as the "body" with appropriate styles
 */
export class StringPreviewStrategy {
  private routeManager: RouteManager;

  constructor(routeManager: RouteManager) {
    this.routeManager = routeManager;
  }

  /**
   * Render AST to HTML string for in-app preview
   */
  render(ast: AstNode | AstNode[], options: RenderOptions = {}): string {
    try {
      // Process routes through the route manager
      this.routeManager.processRoutes(ast, {
        currentScreen: options.currentScreen || undefined
      });

      // Set route context for navigation analysis
      this.routeManager.setRouteContext(this.routeManager.getRouteContext());

      // Create render context
      const context = this.routeManager.createRenderContext('preview', {
        currentScreen: options.currentScreen || undefined
      });

      const result = this.generatePreviewHtml(context);
      
      // Clear route context after rendering
      this.routeManager.clearRouteContext();
      
      return result;
    } catch (error: any) {
      // Clear route context on error
      this.routeManager.clearRouteContext();
      throw error;
    }
  }

  /**
   * Generate HTML for preview mode
   */
  private generatePreviewHtml(context: RouteRenderContext): string {
    const { routes } = context;
    
    // Register components with the renderer
    const componentRoutes = this.routeManager.getRoutesByType('component');
    const componentNodes = componentRoutes.map(route => route.node);
    setComponentDefinitions(componentNodes);
    
    // Render screens
    const screenRoutes = this.routeManager.getScreenRoutes();
    const screensHtml = renderAllScreens(
      screenRoutes.map(route => route.node),
      routes.currentScreen
    );
    
    // Render global elements (modals and drawers)
    const globalElementsHtml = this.renderGlobalElements();
    
    // Return wrapped HTML for preview (without script for in-app preview)
    return `<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white relative" data-preview-container="true">

    ${screensHtml}
    ${globalElementsHtml}

    </div>`;
  }

  /**
   * Render global elements (modals and drawers)
   */
  private renderGlobalElements(): string {
    const modalRoutes = this.routeManager.getRoutesByType('modal');
    const drawerRoutes = this.routeManager.getRoutesByType('drawer');
    
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
}