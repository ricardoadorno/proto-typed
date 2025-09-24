/**
 * Element Toggle Service
 * Handles toggling of modal and drawer elements
 */

export interface ToggleState {
  isVisible: boolean;
  element: HTMLElement | null;
  type: 'modal' | 'drawer';
}

export interface ToggleResult {
  success: boolean;
  elementName: string;
  newState: 'visible' | 'hidden';
  element?: HTMLElement;
}

export class ElementToggleService {
  private activeElements = new Set<string>();

  /**
   * Toggle a modal or drawer element
   */
  toggleElement(elementName: string): ToggleResult {
    console.log('Looking for elements:', {
      elementName,
      modalId: `modal-${elementName}`,
      drawerId: `drawer-${elementName}`
    });

    const modal = document.getElementById(`modal-${elementName}`);
    const drawer = document.getElementById(`drawer-${elementName}`);

    console.log('Found elements:', { modal, drawer });

    // Try to find elements by data attributes as fallback
    if (!modal && !drawer) {
      const modalByData = document.querySelector(`[data-modal="${elementName}"]`);
      const drawerByData = document.querySelector(`[data-drawer="${elementName}"]`);
      console.log('Fallback search:', { modalByData, drawerByData });
    }

    if (modal) {
      return this.toggleModal(elementName, modal);
    }

    if (drawer) {
      return this.toggleDrawer(elementName, drawer);
    }

    console.warn('No modal or drawer found for element:', elementName);
    return {
      success: false,
      elementName,
      newState: 'hidden'
    };
  }

  /**
   * Toggle modal visibility
   */
  private toggleModal(elementName: string, modal: HTMLElement): ToggleResult {
    const isHidden = modal.classList.contains('hidden');
    console.log('Modal state:', { isHidden, classList: Array.from(modal.classList) });

    if (isHidden) {
      modal.classList.remove('hidden');
      this.activeElements.add(elementName);
      
      // Add backdrop click handler
      const backdrop = modal.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            modal.classList.add('hidden');
            this.activeElements.delete(elementName);
          }
        });
      }

      return {
        success: true,
        elementName,
        newState: 'visible',
        element: modal
      };
    } else {
      modal.classList.add('hidden');
      this.activeElements.delete(elementName);

      return {
        success: true,
        elementName,
        newState: 'hidden',
        element: modal
      };
    }
  }

  /**
   * Toggle drawer visibility
   */
  private toggleDrawer(elementName: string, drawer: HTMLElement): ToggleResult {
    const isHidden = drawer.classList.contains('hidden');
    const content = drawer.querySelector('.drawer-content');

    console.log('Drawer state:', {
      isHidden,
      classList: Array.from(drawer.classList),
      contentClasses: content ? Array.from(content.classList) : null
    });

    if (isHidden) {
      drawer.classList.remove('hidden');
      this.activeElements.add(elementName);

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
              this.activeElements.delete(elementName);
            }, 300);
          }
        });
      }

      return {
        success: true,
        elementName,
        newState: 'visible',
        element: drawer
      };
    } else {
      this.activeElements.delete(elementName);

      if (content) {
        content.classList.remove('translate-x-0');
        content.classList.add('-translate-x-full');
      }
      
      setTimeout(() => {
        drawer.classList.add('hidden');
      }, 300);

      return {
        success: true,
        elementName,
        newState: 'hidden',
        element: drawer
      };
    }
  }

  /**
   * Check if an element is currently active/visible
   */
  isElementActive(elementName: string): boolean {
    return this.activeElements.has(elementName);
  }

  /**
   * Get all currently active elements
   */
  getActiveElements(): string[] {
    return Array.from(this.activeElements);
  }

  /**
   * Hide all active elements
   */
  hideAllElements(): void {
    for (const elementName of this.activeElements) {
      this.toggleElement(elementName);
    }
  }
}

// Create a singleton instance
export const elementToggleService = new ElementToggleService();