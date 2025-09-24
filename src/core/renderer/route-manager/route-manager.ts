/**
 * Route Manager
 * Central service for managing all application routes (screens, modals, drawers)
 */

import { AstNode } from '../../../types/astNode';
import { 
  RouteCollection, 
  ScreenRoute, 
  GlobalRoute, 
  RouteProcessingOptions,
  RouteRenderContext 
} from './types';

export type { RouteRenderContext } from './types';

/**
 * Central route management service
 */
export class RouteManager {
  private routes: RouteCollection;

  constructor() {
    this.routes = {
      screens: new Map(),
      globals: new Map(),
    };
  }

  /**
   * Process AST nodes and organize them into a unified route collection
   */
  processRoutes(ast: AstNode | AstNode[], options: RouteProcessingOptions = {}): RouteCollection {
    const nodes = Array.isArray(ast) ? ast : [ast];
    
    // Reset routes
    this.routes = {
      screens: new Map(),
      globals: new Map(),
    };

    // Process each node type
    this.processScreenRoutes(nodes, options);
    this.processGlobalRoutes(nodes);
    this.processComponentRoutes(nodes);
    
    // Set current screen from options or default to first screen
    this.routes.currentScreen = options.currentScreen || this.routes.defaultScreen;

    return this.routes;
  }

  /**
   * Get the current route collection
   */
  getRoutes(): RouteCollection {
    return this.routes;
  }

  /**
   * Get a specific screen route
   */
  getScreenRoute(name: string): ScreenRoute | undefined {
    return this.routes.screens.get(name.toLowerCase());
  }

  /**
   * Get a specific global route
   */
  getGlobalRoute(name: string): GlobalRoute | undefined {
    return this.routes.globals.get(name.toLowerCase());
  }

  /**
   * Get all screen routes as array
   */
  getScreenRoutes(): ScreenRoute[] {
    return Array.from(this.routes.screens.values());
  }

  /**
   * Get all global routes as array
   */
  getGlobalRoutes(): GlobalRoute[] {
    return Array.from(this.routes.globals.values());
  }

  /**
   * Get routes by type
   */
  getRoutesByType(type: 'modal' | 'drawer' | 'component'): GlobalRoute[] {
    return this.getGlobalRoutes().filter(route => route.type === type);
  }

  /**
   * Create render context for adapters
   */
  createRenderContext(mode: 'preview' | 'document', options?: RouteProcessingOptions): RouteRenderContext {
    return {
      routes: this.routes,
      mode,
      options
    };
  }

  /**
   * Process screen nodes into screen routes
   */
  private processScreenRoutes(nodes: AstNode[], options: RouteProcessingOptions): void {
    const screenNodes = nodes.filter(node => node.type === 'screen');
    
    screenNodes.forEach((screen, index) => {
      if (!screen.name) return; // Skip unnamed screens
      
      const screenName = screen.name.toLowerCase();
      const isDefault = index === 0 || screenName === options.defaultScreen?.toLowerCase();
      
      const screenRoute: ScreenRoute = {
        id: screenName,
        name: screen.name,
        node: screen,
        type: 'screen',
        isDefault,
        index
      };

      this.routes.screens.set(screenName, screenRoute);
      
      // Set default screen
      if (isDefault && !this.routes.defaultScreen) {
        this.routes.defaultScreen = screenName;
      }
    });
  }

  /**
   * Process global element nodes (modals, drawers) into global routes
   */
  private processGlobalRoutes(nodes: AstNode[]): void {
    const globalNodes = nodes.filter(node => 
      (node.type === 'modal' || node.type === 'drawer') && node.name
    );
    
    globalNodes.forEach(globalNode => {
      if (!globalNode.name) return; // Skip unnamed global elements
      
      const globalName = globalNode.name.toLowerCase();
      
      const globalRoute: GlobalRoute = {
        id: globalName,
        name: globalNode.name,
        node: globalNode,
        type: globalNode.type as 'modal' | 'drawer',
        isVisible: false, // Global elements are hidden by default
      };

      this.routes.globals.set(globalName, globalRoute);
    });
  }

  /**
   * Process component nodes into global routes (components are treated as global reusable elements)
   */
  private processComponentRoutes(nodes: AstNode[]): void {
    const componentNodes = nodes.filter(node => node.type === 'component' && node.name);
    
    componentNodes.forEach(componentNode => {
      if (!componentNode.name) return; // Skip unnamed components
      
      const componentName = componentNode.name.toLowerCase();
      
      const componentRoute: GlobalRoute = {
        id: componentName,
        name: componentNode.name,
        node: componentNode,
        type: 'component',
        isVisible: false, // Components are not directly visible, they're instantiated
      };

      this.routes.globals.set(componentName, componentRoute);
    });
  }
}

/**
 * Global route manager instance
 */
export const routeManager = new RouteManager();