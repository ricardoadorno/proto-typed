/**
 * Navigation Service
 * Unified navigation logic for the application using data-nav attributes
 */

// Export types
export type { NavigationTarget, NavigationHandlerOptions } from './types';

// Export history management functions
export {
  addToHistory,
  navigateBack,
  getCurrentScreen,
  resetNavigationHistory,
  getNavigationHistory,
  getCurrentScreenIndex
} from './history';

// Export navigation analysis functions
export {
  analyzeNavigationTarget,
} from './analyzer';

// Export attribute generation functions
export {
  generateNavigationAttributes,
  generateHrefAttribute,
  generateNavigationDataAttributes
} from './attributes';

// Export UI toggle functions
export {
  toggleDrawer,
  toggleModal,
  toggleElement,
  closeAllDrawers,
  closeAllModals,
  hasOpenDrawer,
  hasOpenModal,
  hasOpenOverlay,
  closeOpenOverlaysOnButtonClick
} from './toggles';

// Export main navigation handler
export {
  handleNavigationClick
} from './handler';

// Export script generation functions
export {
  generateNavigationScript,
} from './script-generator';
