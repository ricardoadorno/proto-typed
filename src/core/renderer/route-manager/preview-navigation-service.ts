/**
 * Route Manager Gateway
 * Simplified API gateway for SPA clients to interact with the Route Manager
 */

import { routeManager } from './route-manager';
import { RouteMetadata, RouteCollection, RouteRenderContext, RouteProcessingOptions } from '../../../types/routing';
import { AstNode } from '../../../types/ast-node';

export interface NavigationHandlers {
  onScreenNavigation: (screenName: string) => void;
  onBackNavigation?: () => void;
}

export interface NavigationState {
  history: string[];
  currentIndex: number;
  currentScreen: string | null;
  canGoBack: boolean;
}

/**
 * Route Manager Gateway - Simple API for SPA clients
 * Provides a clean interface to interact with the underlying Route Manager
 */
export class RouteManagerGateway {
  private handlers: NavigationHandlers | null = null;

  // ========================================
  // Core API Methods
  // ========================================

  /**
   * Initialize the route system with AST nodes
   */
  initialize(ast: AstNode | AstNode[], options: RouteProcessingOptions = {}): RouteCollection {
    return routeManager.processRoutes(ast, options);
  }

  /**
   * Set navigation event handlers
   */
  setHandlers(handlers: NavigationHandlers): void {
    this.handlers = handlers;
  }

  /**
   * Initialize navigation with the current screen
   */
  initializeNavigation(currentScreen: string): void {
    routeManager.setInitialScreen(currentScreen);
  }

  // ========================================
  // Route Information API
  // ========================================

  /**
   * Get complete route metadata
   */
  getRouteMetadata(): RouteMetadata {
    return routeManager.getMetadata();
  }

  /**
   * Get all routes collection
   */
  getRoutes(): RouteCollection {
    return routeManager.getRoutes();
  }

  /**
   * Get specific screen route
   */
  getScreenRoute(name: string) {
    return routeManager.getScreenRoute(name);
  }

  /**
   * Get specific global route (modal/drawer/component)
   */
  getGlobalRoute(name: string) {
    return routeManager.getGlobalRoute(name);
  }

  /**
   * Get routes by type
   */
  getRoutesByType(type: 'modal' | 'drawer' | 'component') {
    return routeManager.getRoutesByType(type);
  }

  /**
   * Create render context for adapters
   */
  createRenderContext(mode: 'preview' | 'document', options?: RouteProcessingOptions): RouteRenderContext {
    return routeManager.createRenderContext(mode, options);
  }

  // ========================================
  // Navigation API
  // ========================================

  /**
   * Navigate to a specific screen
   */
  navigateToScreen(screenName: string): boolean {
    const currentScreen = routeManager.getCurrentScreen();
    
    if (currentScreen !== screenName) {
      routeManager.addToHistory(screenName);
      
      if (this.handlers?.onScreenNavigation) {
        this.handlers.onScreenNavigation(screenName);
        return true;
      }
    }
    
    return false;
  }

  /**
   * Navigate back to previous screen
   */
  navigateBack(): boolean {
    const previousScreen = routeManager.navigateBack();
    
    if (previousScreen && this.handlers?.onScreenNavigation) {
      this.handlers.onScreenNavigation(previousScreen);
      return true;
    }
    
    if (this.handlers?.onBackNavigation) {
      this.handlers.onBackNavigation();
      return true;
    }
    
    return false;
  }

  /**
   * Get current navigation state
   */
  getNavigationState(): NavigationState {
    return {
      history: routeManager.getNavigationHistory(),
      currentIndex: routeManager.getCurrentScreenIndex(),
      currentScreen: routeManager.getCurrentScreen(),
      canGoBack: routeManager.getCurrentScreenIndex() > 0
    };
  }

  /**
   * Reset navigation history
   */
  resetNavigation(): void {
    routeManager.resetNavigationHistory();
  }


  // ========================================
  // DOM Interaction API
  // ========================================

  /**
   * Toggle modal visibility by name
   */
  toggleModal(elementName: string): boolean {
    const modal = document.getElementById(`modal-${elementName}`);
    if (!modal) return false;

    const isHidden = modal.classList.contains('hidden');
    
    if (isHidden) {
      modal.classList.remove('hidden');
      this.setupModalBackdropHandler(modal);
    } else {
      modal.classList.add('hidden');
    }
    
    return true;
  }

  /**
   * Toggle drawer visibility by name
   */
  toggleDrawer(elementName: string): boolean {
    const drawer = document.getElementById(`drawer-${elementName}`);
    if (!drawer) return false;

    const isHidden = drawer.classList.contains('hidden');
    const content = drawer.querySelector('.drawer-content');

    if (isHidden) {
      drawer.classList.remove('hidden');
      if (content) {
        content.classList.add('translate-x-0');
        content.classList.remove('-translate-x-full');
      }
      this.setupDrawerOverlayHandler(drawer, content as HTMLElement);
    } else {
      if (content) {
        content.classList.remove('translate-x-0');
        content.classList.add('-translate-x-full');
      }
      setTimeout(() => drawer.classList.add('hidden'), 300);
    }
    
    return true;
  }

  /**
   * Handle navigation click events from DOM
   */
  handleNavigationClick(e: React.MouseEvent): void {
    const navElement = (e.target as HTMLElement).closest('[data-nav]');
    if (!navElement) return;

    e.preventDefault();
    e.stopPropagation();

    const navTarget = navElement.getAttribute('data-nav');
    const navType = navElement.getAttribute('data-nav-type');
    
    if (!navTarget) return;

    switch (navType) {
      case 'internal':
        this.navigateToScreen(navTarget);
        break;
      case 'toggle':
        this.toggleElement(navTarget);
        break;
      case 'back':
        this.navigateBack();
        break;
      default:
        this.toggleElement(navTarget);
        break;
    }
  }

  /**
   * Create a click handler function for React components
   */
  createClickHandler(): (e: React.MouseEvent) => void {
    return (e: React.MouseEvent) => this.handleNavigationClick(e);
  }

  // ========================================
  // Private Helper Methods
  // ========================================

  private toggleElement(elementName: string): void {
    // Try modal first, then drawer
    if (!this.toggleModal(elementName)) {
      this.toggleDrawer(elementName);
    }
  }

  private setupModalBackdropHandler(modal: HTMLElement): void {
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          modal.classList.add('hidden');
        }
      });
    }
  }

  private setupDrawerOverlayHandler(drawer: HTMLElement, content: HTMLElement | null): void {
    const overlay = drawer.querySelector('.drawer-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          if (content) {
            content.classList.remove('translate-x-0');
            content.classList.add('-translate-x-full');
          }
          setTimeout(() => drawer.classList.add('hidden'), 300);
        }
      });
    }
  }

}

// Create a singleton instance
export const routeManagerGateway = new RouteManagerGateway();

// Legacy alias for backwards compatibility
export const previewNavigationService = routeManagerGateway;