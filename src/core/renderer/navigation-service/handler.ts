/**
 * Navigation Click Handler
 * Centralized navigation click handler for React and HTML export
 */
import { NavigationHandlerOptions } from './types';
import { addToHistory, navigateBack } from './history';
import { toggleModal, toggleDrawer, toggleElement, closeOpenOverlaysOnButtonClick } from './toggles';

/**
 * Centralized navigation click handler for React and HTML export
 * Handles all navigation types and updates UI accordingly
 */
export function handleNavigationClick(
  e: React.MouseEvent<Element, MouseEvent> | MouseEvent,
  options?: NavigationHandlerOptions
): void {
  const target = (e.target as Element).closest('[data-nav]');
  if (!target) return;

  const navValue = target.getAttribute('data-nav');
  const navType = target.getAttribute('data-nav-type');

  if (!navValue) return;

  // Prevent default behavior for all navigation clicks except external links
  if (navType !== 'external') {
    if (typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
  }
  // Always lowercase navValue for internal navigation to match screen IDs and rendering logic
  const normalizedNavValue = navType === 'internal' && navValue ? navValue.toLowerCase() : navValue;

  // Close any open overlays before performing the navigation action
  // Exception: don't close overlays if the action is to open the same modal/drawer
  const isOpeningModal = navType === 'internal' && (document.getElementById(`modal-${normalizedNavValue}`) || document.getElementById(`modal-${navValue}`));
  const isOpeningDrawer = navType === 'internal' && (document.getElementById(`drawer-${normalizedNavValue}`) || document.getElementById(`drawer-${navValue}`));
  
  if (!isOpeningModal && !isOpeningDrawer) {
    closeOpenOverlaysOnButtonClick();
  }

  switch (navType) {
    case 'internal':
      handleInternalNavigation(normalizedNavValue, navValue, options);
      break;
      
    case 'back':
      handleBackNavigation(options);
      break;
      
    case 'toggle':
      handleToggleNavigation(navValue, options);
      break;
      
    case 'external':
      handleExternalNavigation(navValue);
      break;
      
    case 'action':
      handleActionNavigation(navValue);
      break;
  }
}

/**
 * Handle internal navigation (screens, modals, drawers)
 */
function handleInternalNavigation(
  normalizedNavValue: string,
  originalNavValue: string,
  options?: NavigationHandlerOptions
): void {
  // Check if the target is actually a modal or drawer before treating as screen navigation
  const modalElement = document.getElementById(`modal-${normalizedNavValue}`);
  const drawerElement = document.getElementById(`drawer-${normalizedNavValue}`);
  
  // Also check without the prefix in case of direct element names
  const directModalElement = document.getElementById(`modal-${originalNavValue}`);
  const directDrawerElement = document.getElementById(`drawer-${originalNavValue}`);
    
  if (modalElement || directModalElement) {
    // Handle modal toggle
    const modalName = modalElement ? normalizedNavValue : originalNavValue;
    toggleModal(modalName);
  } else if (drawerElement || directDrawerElement) {
    // Handle drawer toggle
    const drawerName = drawerElement ? normalizedNavValue : originalNavValue;
    toggleDrawer(drawerName);
  } else {
    // Regular screen navigation
    addToHistory(normalizedNavValue);
    
    if (options && options.onInternalNavigate) {
      options.onInternalNavigate(normalizedNavValue);
    } else {
      // Fallback: show/hide screens by DOM manipulation
      const screenElements = document.querySelectorAll('.screen');
      screenElements.forEach(screen => {
        (screen as HTMLElement).style.display = 'none';
      });
      const targetScreen = document.getElementById(`${normalizedNavValue}-screen`);
      if (targetScreen) {
        targetScreen.style.display = 'block';
      }
    }
  }
}

/**
 * Handle back navigation
 */
function handleBackNavigation(options?: NavigationHandlerOptions): void {
  const previousScreen = navigateBack();
  if (previousScreen) {
    if (options && options.onBack) {
      options.onBack();
    } else if (options && options.onInternalNavigate) {
      options.onInternalNavigate(previousScreen);
    } else {
      // Fallback: DOM manipulation
      const screenElements = document.querySelectorAll('.screen');
      screenElements.forEach(screen => {
        (screen as HTMLElement).style.display = 'none';
      });
      const targetScreen = document.getElementById(`${previousScreen}-screen`);
      if (targetScreen) {
        targetScreen.style.display = 'block';
      }
    }
  }
}

/**
 * Handle toggle navigation (drawers, modals)
 */
function handleToggleNavigation(navValue: string, options?: NavigationHandlerOptions): void {
  // Extract element name from toggle commands
  let elementName = '';
  if (navValue.includes('(')) {
    // Handle toggleDrawer(), etc.
    const match = navValue.match(/toggle(\w+)\(\)/);
    elementName = match ? match[1].toLowerCase() : 'drawer';
  } else if (navValue.includes('-')) {
    // Handle toggle-drawer, etc.
    elementName = navValue.split('-')[1] || 'drawer';
  } else {
    elementName = 'drawer'; // Default fallback
  }
  
  if (options && options.onToggle) {
    options.onToggle(elementName);      
  } else {
    // Use the centralized toggle function
    toggleElement(elementName);
  }
}

/**
 * Handle external navigation
 */
function handleExternalNavigation(navValue: string): void {
  window.open(navValue, '_blank', 'noopener,noreferrer');
}

/**
 * Handle action navigation (JavaScript execution)
 */
function handleActionNavigation(navValue: string): void {
  try {
    new Function(navValue)();
  } catch (error) {
    console.error('Error executing navigation action:', error);
  }
}
