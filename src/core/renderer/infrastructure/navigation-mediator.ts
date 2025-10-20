/**
 * Navigation Mediator
 * Mediates between route manager and node renderer for navigation-related operations
 */
import { RouteManager, routeManager as defaultRouteManager } from '../core/route-manager';
import { RouteContext, NavigationTarget } from '../../../types/routing';

/**
 * Navigation Mediator - Central hub for navigation analysis and attribute generation
 */
export class NavigationMediator {
  private static activeRouteManager: RouteManager = defaultRouteManager;

  static setActiveRouteManager(manager: RouteManager) {
    this.activeRouteManager = manager;
  }

  static resetRouteManager() {
    this.activeRouteManager = defaultRouteManager;
  }

  private static getRouteManager(): RouteManager {
    return this.activeRouteManager ?? defaultRouteManager;
  }

  /**
   * Analyze a navigation target to determine its type and validity
   */
  static analyzeNavigationTarget(target: string | undefined, routes?: RouteContext): NavigationTarget {
    if (!target || target.trim() === '') {
      return { type: 'internal', value: '', isValid: false };
    }
    const trimmedTarget = target.trim();

    // Check for back navigation
    if (trimmedTarget === '-1') {
      return { type: 'back', value: trimmedTarget, isValid: true };
    }

    // Check for toggle actions (drawer, modal, etc.)
    if (trimmedTarget.match(/^toggle\w*\(\)$/) || trimmedTarget.match(/^toggle-\w+$/)) {
      return { type: 'toggle', value: trimmedTarget, isValid: true };
    }

    // Check if target matches a modal or drawer name
    if (routes) {
      if (routes.modals.includes(trimmedTarget) || routes.drawers.includes(trimmedTarget)) {
        return { type: 'toggle', value: trimmedTarget, isValid: true };
      }
    }

    // Check if it's an external URL
    if (trimmedTarget.includes('://') || trimmedTarget.startsWith('mailto:')) {
      return { type: 'external', value: trimmedTarget, isValid: true };
    }

    // Check if it's a JavaScript action (contains parentheses or dots)
    if (trimmedTarget.includes('(') || trimmedTarget.includes('.')) {
      return { type: 'action', value: trimmedTarget, isValid: true };
    }

    // Otherwise, it's an internal screen navigation
    return { type: 'internal', value: trimmedTarget, isValid: true };
  }

  /**
   * Generate href attribute value for links based on navigation target analysis
   */
  static generateHrefValue(target: string | undefined, routes?: RouteContext): string {
    const routeContext = routes || this.getRouteManager().getCurrentRouteContext();
    const navTarget = this.analyzeNavigationTarget(target, routeContext);
    
    if (!navTarget.isValid) {
      return '#';
    }

    switch (navTarget.type) {
      case 'internal':
        return `#${navTarget.value}`;
      case 'external':
        return navTarget.value;
      case 'action':
      case 'toggle':
      case 'back':
      default:
        return '#';
    }
  }

  /**
   * Generate navigation data attributes for HTML elements
   */
  static generateNavDataAttributes(target: string | undefined, routes?: RouteContext): Record<string, string> {
    const routeContext = routes || this.getRouteManager().getCurrentRouteContext();
    const navTarget = this.analyzeNavigationTarget(target, routeContext);
    
    if (!navTarget.isValid) {
      return {};
    }

    const attributes: Record<string, string> = {
      'data-nav': navTarget.value,
      'data-nav-type': navTarget.type
    };

    return attributes;
  }

  /**
   * Convert data attributes object to HTML attribute string
   */
  static attributesToString(attributes: Record<string, string>): string {
    return Object.entries(attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
  }

  /**
   * Generate complete navigation attributes string for HTML elements
   */
  static generateNavigationAttributes(target: string | undefined, routes?: RouteContext): string {
    const routeContext = routes || this.getRouteManager().getCurrentRouteContext();
    const attributes = this.generateNavDataAttributes(target, routeContext);
    
    return this.attributesToString(attributes);
  }

  /**
   * Generate href attribute string for links
   */
  static generateHrefAttribute(target: string | undefined, routes?: RouteContext): string {
    const routeContext = routes || this.getRouteManager().getCurrentRouteContext();
    const hrefValue = this.generateHrefValue(target, routeContext);
    
    return `href="${hrefValue}"`;
  }

  /**
   * Get current route context from route manager
   */
  static getCurrentRouteContext(): RouteContext {
    const context = this.getRouteManager().getCurrentRouteContext();
    if (!context) {
      return { screens: [], modals: [], drawers: [], components: [] };
    }
    return context;
  }

  /**
   * Check if a target is a valid navigation target
   */
  static isValidNavigationTarget(target: string | undefined, routes?: RouteContext): boolean {
    const routeContext = routes || this.getRouteManager().getCurrentRouteContext();
    const navTarget = this.analyzeNavigationTarget(target, routeContext);
    return navTarget.isValid;
  }
}
