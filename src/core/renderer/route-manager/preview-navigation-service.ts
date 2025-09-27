/**
 * Preview Navigation Service
 * Handles all navigation interactions within the preview panel
 */

import { routeManager } from './route-manager';

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
    const navElement = (e.target as HTMLElement).closest('[data-nav]');
    if (!navElement) return;

    e.preventDefault();
    e.stopPropagation();

    const navTarget = navElement.getAttribute('data-nav');
    const navType = navElement.getAttribute('data-nav-type');
    
    if (!navTarget) return;

    // Direct navigation based on type
    switch (navType) {
      case 'internal':
        this.handleScreenNavigation(navTarget);
        break;
      case 'toggle':
        this.handleElementToggle(navTarget);
        break;
      case 'back':
        this.handleBackNavigation();
        break;
      default:
        this.handleElementToggle(navTarget);
        break;
    }
  }

  /**
   * Reset navigation history
   */
  resetNavigationHistory(): void {
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
   * Handle element toggle (modal/drawer) - toggles the specific named element
   */
  private handleElementToggle(elementName: string): void {
    console.log('Toggling element:', elementName);
    
    // Look for specific modal or drawer by name
    const modal = document.getElementById(`modal-${elementName}`);
    const drawer = document.getElementById(`drawer-${elementName}`);
    
    console.log('Found elements:', { modal, drawer });
    
    if (modal) {
      this.toggleModal(elementName, modal);
      return;
    }
    
    if (drawer) {
      this.toggleDrawer(elementName, drawer);
      return;
    }
    
    console.warn('No modal or drawer found for element:', elementName);
  }

  /**
   * Toggle modal visibility
   */
  private toggleModal(elementName: string, modal: HTMLElement): void {
    const isHidden = modal.classList.contains('hidden');
    console.log('Modal state:', { elementName, isHidden, classList: Array.from(modal.classList) });

    if (isHidden) {
      modal.classList.remove('hidden');
      
      // Add backdrop click handler
      const backdrop = modal.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            modal.classList.add('hidden');
          }
        });
      }
      
      console.log(`Modal ${elementName} opened`);
    } else {
      modal.classList.add('hidden');
      console.log(`Modal ${elementName} closed`);
    }
  }

  /**
   * Toggle drawer visibility
   */
  private toggleDrawer(elementName: string, drawer: HTMLElement): void {
    const isHidden = drawer.classList.contains('hidden');
    const content = drawer.querySelector('.drawer-content');

    console.log('Drawer state:', {
      elementName,
      isHidden,
      classList: Array.from(drawer.classList),
      contentClasses: content ? Array.from(content.classList) : null
    });

    if (isHidden) {
      drawer.classList.remove('hidden');

      if (content) {
        content.classList.add('translate-x-0');
        content.classList.remove('-translate-x-full');
      }

      // Add backdrop click handler
      const overlay = drawer.querySelector('.drawer-overlay');
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            if (content) {
              content.classList.remove('translate-x-0');
              content.classList.add('-translate-x-full');
            }
            setTimeout(() => {
              drawer.classList.add('hidden');
            }, 300);
          }
        });
      }

      console.log(`Drawer ${elementName} opened`);
    } else {
      if (content) {
        content.classList.remove('translate-x-0');
        content.classList.add('-translate-x-full');
      }
      
      setTimeout(() => {
        drawer.classList.add('hidden');
      }, 300);

      console.log(`Drawer ${elementName} closed`);
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
   * Create a click handler function for React components
   */
  createClickHandler(): (e: React.MouseEvent) => void {
    return (e: React.MouseEvent) => this.handleNavigationClick(e);
  }

}

// Create a singleton instance
export const previewNavigationService = new PreviewNavigationService();