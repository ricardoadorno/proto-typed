/**
 * Preview Adapter
 * Adapter for in-app preview rendering using the route manager
 */

import { RouteRenderContext, RouteManager } from '../route-manager';
import { AstNode } from '../../../../types/astNode';
import { RenderOptions } from '../../../../types/render';
import { setComponentDefinitions } from '../../nodes-service/component-nodes';
import { renderAllScreens } from '../../ast-to-html/screen-renderer';
import { renderNode } from '../../nodes-service/node-renderer';
import { generateNavigationScript } from '../script-generator';

/**
 * Preview adapter for in-app preview rendering
 * This treats the container div as the "body" with appropriate styles
 */
export class PreviewAdapter {
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

      // Create render context
      const context = this.routeManager.createRenderContext('preview', {
        currentScreen: options.currentScreen || undefined
      });

      return this.generatePreviewHtml(context);
    } catch (error: any) {
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
    
    // Generate navigation script
    const navigationScript = generateNavigationScript();

    // Return wrapped HTML for preview
    return `<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">

    ${screensHtml}
    ${globalElementsHtml}

    <script>
      ${navigationScript}
    </script>
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