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
  RouteRenderContext,
  RouteMetadata,
  RouteInfo,
  RouteContext,
  NavigationTarget
} from './types';

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
export { 
  analyzeNavigationTarget,
  generateNavigationAttributes, 
  generateHrefAttribute, 
  generateNavigationDataAttributes 
} from './navigation-attributes';

// Export preview navigation services
export { 
  PreviewNavigationService, 
  previewNavigationService, 
  type NavigationEvent, 
  type NavigationHandlers,
  type NavigationState
} from './preview-navigation-service';
export { 
  ElementToggleService, 
  elementToggleService, 
  type ToggleState, 
  type ToggleResult 
} from './element-toggle-service';
