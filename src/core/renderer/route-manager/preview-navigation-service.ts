/**
 * Preview Navigation Service
 * Handles all navigation interactions within the preview panel
 */

import { elementToggleService } from './element-toggle-service';
import { routeManager } from './route-manager';

export interface NavigationEvent {
  target: string;
  type: 'internal' | 'toggle' | 'back' | 'unknown';
  element: HTMLElement;
  allDataAttributes: Record<string, string>;
}

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

export class PreviewNavigationService {
  private handlers: NavigationHandlers | null = null;

  /**
   * Set navigation handlers
   */
  setHandlers(handlers: NavigationHandlers): void {
    this.handlers = handlers;
  }

  /**
   * Initialize navigation with the current screen
   * Should be called when the preview first loads
   */
  initializeNavigation(currentScreen: string): void {
    console.log('Initializing navigation with screen:', currentScreen);
    routeManager.setInitialScreen(currentScreen);
    
    // Debug: Show initial navigation state
    const navState = this.getNavigationState();
    console.log('Initial navigation state:', navState);
  }

  /**
   * Handle preview navigation click events
   */
  handleNavigationClick(e: React.MouseEvent): void {
    const target = e.target as HTMLElement;
    const navElement = target.closest('[data-nav]');

    if (!navElement) return;

    e.preventDefault();
    e.stopPropagation();

    const navTarget = navElement.getAttribute('data-nav');
    const navType = navElement.getAttribute('data-nav-type');

    const navigationEvent: NavigationEvent = {
      target: navTarget || '',
      type: this.determineNavigationType(navType),
      element: navElement as HTMLElement,
      allDataAttributes: Object.fromEntries(
        Array.from(navElement.attributes)
          .filter(attr => attr.name.startsWith('data-'))
          .map(attr => [attr.name, attr.value])
      )
    };

    console.log('Preview navigation click:', navigationEvent);

    if (!navTarget) return;

    this.processNavigation(navigationEvent);
  }

  /**
   * Reset navigation history
   */
  resetNavigationHistory(): void {
    console.log('Resetting navigation history');
    routeManager.resetNavigationHistory();
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
   * Process navigation based on type
   */
  private processNavigation(event: NavigationEvent): void {
    switch (event.type) {
      case 'internal':
        this.handleScreenNavigation(event.target);
        break;
      
      case 'toggle':
        this.handleElementToggle(event.target);
        break;
      
      case 'back':
        this.handleBackNavigation();
        break;
      
      default:
        // Default behavior for elements without explicit type
        console.log('Default navigation - attempting toggle for:', event.target);
        this.handleElementToggle(event.target);
        break;
    }
  }

  /**
   * Handle screen navigation
   */
  private handleScreenNavigation(screenName: string): void {
    console.log('Navigating to screen:', screenName);
    
    // Only add to history if it's different from current screen
    const currentScreen = routeManager.getCurrentScreen();
    console.log('Current screen before navigation:', currentScreen);
    
    if (currentScreen !== screenName) {
      console.log('Adding to history:', screenName);
      routeManager.addToHistory(screenName);
      
      // Debug: Show updated navigation state
      const navState = this.getNavigationState();
      console.log('Updated navigation state:', navState);
    } else {
      console.log('Screen is the same as current, not adding to history');
    }
    
    if (this.handlers?.onScreenNavigation) {
      this.handlers.onScreenNavigation(screenName);
    } else {
      console.warn('No screen navigation handler configured');
    }
  }

  /**
   * Handle element toggle (modal/drawer)
   */
  private handleElementToggle(elementName: string): void {
    console.log('Toggling element:', elementName);
    
    const result = elementToggleService.toggleElement(elementName);
    
    if (result.success) {
      console.log(`Element ${elementName} toggled to ${result.newState}`);
    } else {
      console.warn(`Failed to toggle element: ${elementName}`);
    }
  }

  /**
   * Handle back navigation
   */
  private handleBackNavigation(): void {
    console.log('Back navigation');
    
    // Debug: Check current navigation state
    const navState = this.getNavigationState();
    console.log('Current navigation state:', navState);
    
    // Try to navigate back using route manager
    const previousScreen = routeManager.navigateBack();
    console.log('Previous screen from routeManager:', previousScreen);
    
    if (previousScreen && this.handlers?.onScreenNavigation) {
      console.log(`Navigating back to screen: ${previousScreen}`);
      this.handlers.onScreenNavigation(previousScreen);
    } else if (this.handlers?.onBackNavigation) {
      // Fallback to custom handler if provided
      console.log('Using fallback onBackNavigation handler');
      this.handlers.onBackNavigation();
    } else {
      console.log('No previous screen in history or no back navigation handler configured');
    }
  }

  /**
   * Determine navigation type from data attribute
   */
  private determineNavigationType(navType: string | null): 'internal' | 'toggle' | 'back' | 'unknown' {
    switch (navType) {
      case 'internal':
        return 'internal';
      case 'toggle':
        return 'toggle';
      case 'back':
        return 'back';
      default:
        return 'unknown';
    }
  }

  /**
   * Create a click handler function for React components
   */
  createClickHandler(): (e: React.MouseEvent) => void {
    return (e: React.MouseEvent) => this.handleNavigationClick(e);
  }

}

// Create a singleton instance
export const previewNavigationService = new PreviewNavigationService();