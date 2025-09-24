/**
 * Route Context Storage
 * Temporary solution to share route context across rendering functions
 */

import type { RouteContext } from './navigation-analyzer';

let currentRouteContext: RouteContext | undefined = undefined;

/**
 * Set the current route context for rendering
 */
export function setRouteContext(context: RouteContext): void {
  currentRouteContext = context;
}

/**
 * Get the current route context
 */
export function getRouteContext(): RouteContext | undefined {
  return currentRouteContext;
}

/**
 * Clear the route context
 */
export function clearRouteContext(): void {
  currentRouteContext = undefined;
}