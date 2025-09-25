/**
 * HTML Attribute Generators
 * Generate navigation-related HTML attributes for elements
 */
import { routeManager } from './route-manager';
import { RouteContext, NavigationTarget } from './types';

/**
 * Generate navigation attributes for HTML elements
 */
export function generateNavigationAttributes(target: string | undefined, routes?: RouteContext): string {
  const routeContext = routes || routeManager.getCurrentRouteContext();
  const navTarget = analyzeNavigationTarget(target, routeContext);
  
  if (!navTarget.isValid) {
    return '';
  }

  const attributes = [`data-nav="${navTarget.value}"`];
  
  switch (navTarget.type) {
    case 'internal':
      attributes.push(`data-nav-type="internal"`);
      break;
    case 'external':
      attributes.push(`data-nav-type="external"`);
      break;
    case 'action':
      attributes.push(`data-nav-type="action"`);
      break;
    case 'toggle':
      attributes.push(`data-nav-type="toggle"`);
      break;
    case 'back':
      attributes.push(`data-nav-type="back"`);
      break;
  }

  return attributes.join(' ');
}

/**
 * Generate href attribute for links
 */
export function generateHrefAttribute(target: string | undefined, routes?: RouteContext): string {
  const routeContext = routes || routeManager.getCurrentRouteContext();
  const navTarget = analyzeNavigationTarget(target, routeContext);
  
  if (!navTarget.isValid) {
    return 'href="#"';
  }

  switch (navTarget.type) {
    case 'internal':
      return `href="#${navTarget.value}"`;
    case 'external':
      return `href="${navTarget.value}"`;
    case 'action':
      return 'href="#"'; // Actions don't use href
    default:
      return 'href="#"';
  }
}

/**
 * Generate navigation data attributes as an object
 */
export function generateNavigationDataAttributes(target: string | undefined, routes?: RouteContext): Record<string, string> {
  const routeContext = routes || routeManager.getCurrentRouteContext();
  const navTarget = analyzeNavigationTarget(target, routeContext);
  
  if (!navTarget.isValid) {
    return {};
  }

  return {
    'data-nav': navTarget.value,
    'data-nav-type': navTarget.type
  };
}


/**
 * Navigation Analysis
 * Analyze navigation targets to determine their type and validity
 */

/**
 * Analyze a navigation target to determine its type
 */
export function analyzeNavigationTarget(target: string | undefined, routes?: RouteContext): NavigationTarget {
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