/**
 * Route Manager
 * Unified route system for screens and global elements
 */

// Export types
export type {
  BaseRoute,
  ScreenRoute,
  GlobalRoute,
  RouteCollection,
  RouteProcessingOptions,
  RouteRenderContext
} from './types';

// Export navigation types
export type { NavigationTarget } from './navigation-analyzer';

// Export the route manager class and global instance
export { RouteManager, routeManager } from './route-manager';

// Export screen rendering functions
export {
  renderScreen,
  screenToHtml,
  renderAllScreens,
  renderScreenForDocument
} from './screen-renderer';

// Export navigation functions
export { analyzeNavigationTarget, type RouteContext } from './navigation-analyzer';
export { 
  generateNavigationAttributes, 
  generateHrefAttribute, 
  generateNavigationDataAttributes 
} from './navigation-attributes';
export {
  addToHistory,
  navigateBack,
  getCurrentScreen,
  getCurrentScreenIndex,
  getNavigationHistory,
  resetNavigationHistory
} from './navigation-history';
export { setRouteContext, getRouteContext, clearRouteContext } from './route-context';

// Export adapters (will be added after they are created)
// export { PreviewAdapter } from './adapters/preview-adapter';
// export { DocumentAdapter } from './adapters/document-adapter';