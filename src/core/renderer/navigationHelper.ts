/**
 * Navigation Helper
 * Unifies navigation logic across the application using data-nav attributes
 */

export interface NavigationTarget {
  type: 'internal' | 'external' | 'action' | 'toggle' | 'back';
  value: string;
  isValid: boolean;
}

/**
 * Scroll Management Functions
 * Disable and enable body scroll when modals/drawers are open
 */
let scrollPosition = 0;
let scrollLockCount = 0;

function disableBodyScroll() {
  if (scrollLockCount === 0) {
    scrollPosition = window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('scroll-locked');
    
    // Also lock mobile containers if they exist
    const mobileContainers = document.querySelectorAll('.iphone-x, .browser-mockup');
    mobileContainers.forEach(container => {
      container.classList.add('scroll-locked');
    });
  }
  scrollLockCount++;
}

function enableBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  
  if (scrollLockCount === 0) {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.classList.remove('scroll-locked');
    
    // Remove lock from mobile containers
    const mobileContainers = document.querySelectorAll('.iphone-x, .browser-mockup');
    mobileContainers.forEach(container => {
      container.classList.remove('scroll-locked');
    });
    
    window.scrollTo(0, scrollPosition);
  }
}

/**
 * Navigation History Management
 * Track navigation history to enable back navigation
 */
let navigationHistory: string[] = [];
let currentScreenIndex = -1;

/**
 * Add a screen to navigation history
 */
export function addToHistory(screenName: string) {
  // Remove any screens after current position (when navigating after going back)
  navigationHistory = navigationHistory.slice(0, currentScreenIndex + 1);
  
  // Don't add the same screen consecutively
  if (navigationHistory[currentScreenIndex] !== screenName) {
    navigationHistory.push(screenName);
    currentScreenIndex++;
  }
}

/**
 * Navigate back to previous screen
 * Returns the previous screen name or null if no history
 */
export function navigateBack(): string | null {
  if (currentScreenIndex > 0) {
    currentScreenIndex--;
    return navigationHistory[currentScreenIndex];
  }
  return null;
}

/**
 * Get current screen from history
 */
function getCurrentScreen(): string | null {
  return currentScreenIndex >= 0 ? navigationHistory[currentScreenIndex] : null;
}

/**
 * Reset navigation history
 */
export function resetNavigationHistory() {
  navigationHistory = [];
  currentScreenIndex = -1;
}

/**
 * Get navigation history for debugging
 */
export function getNavigationHistory() {
  return {
    history: [...navigationHistory],
    currentIndex: currentScreenIndex,
    currentScreen: getCurrentScreen()
  };
}

/**
 * Analyze a navigation target to determine its type
 */
export function analyzeNavigationTarget(target: string | undefined): NavigationTarget {
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
 * Generate navigation attributes for HTML elements
 */
export function generateNavigationAttributes(target: string | undefined): string {
  const navTarget = analyzeNavigationTarget(target);
  
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
export function generateHrefAttribute(target: string | undefined): string {
  const navTarget = analyzeNavigationTarget(target);
  
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
 * Generate the JavaScript code for navigation handling
 */
export function generateNavigationScript(): string {
  return `
    // Navigation History Management
    let navigationHistory = [];
    let currentScreenIndex = -1;
    
    function addToHistory(screenName) {
      // Remove any screens after current position (when navigating after going back)
      navigationHistory = navigationHistory.slice(0, currentScreenIndex + 1);
      
      // Don't add the same screen consecutively
      if (navigationHistory[currentScreenIndex] !== screenName) {
        navigationHistory.push(screenName);
        currentScreenIndex++;
      }
    }
    
    function navigateBack() {
      if (currentScreenIndex > 0) {
        currentScreenIndex--;
        const previousScreen = navigationHistory[currentScreenIndex];
        navigateToScreen(previousScreen);
        return previousScreen;
      }
      return null;
    }
    
    function navigateToScreen(screenName) {
      const screens = document.querySelectorAll('.screen');
      screens.forEach(screen => {
        if (screen.className.includes(screenName.toLowerCase())) {
          screen.style.display = 'block';
        } else {
          screen.style.display = 'none';
        }
      });
      
      // Add to history only if not coming from back navigation
      if (screenName !== navigationHistory[currentScreenIndex]) {
        addToHistory(screenName);
      }
    }function toggleElement(elementName) {
      // Try to find element by ID patterns: drawer (unified), modal
      const drawer = document.querySelector('.drawer');
      const drawerElement = document.getElementById(\`drawer-\${elementName}\`);
      const modal = document.getElementById(\`modal-\${elementName}\`);
      
      // Handle drawer (unified concept)
      if (elementName === 'drawer' || elementName === 'Drawer' || !elementName) {
        // Try legacy drawer first (mobile-style)
        if (drawer) {
          const overlay = document.querySelector('.drawer-overlay');
          const isOpening = !drawer.classList.contains('open');
          
          drawer.classList.toggle('open');
          if (overlay) overlay.classList.toggle('open');
          
          // Manage scroll
          if (isOpening) {
            disableBodyScroll();
          } else {
            enableBodyScroll();
          }
          return;
        }      }
      
      // Handle named drawer elements
      if (drawerElement) {
        const isHidden = drawerElement.classList.contains('hidden');
        const content = drawerElement.querySelector('.drawer-content');
        
        if (isHidden) {
          drawerElement.classList.remove('hidden');
          if (content) {
            content.classList.add('translate-x-0');
            content.classList.remove('-translate-x-full');
          }
          disableBodyScroll();
        } else {
          if (content) {
            content.classList.remove('translate-x-0');
            content.classList.add('-translate-x-full');
          }
          setTimeout(() => {
            drawerElement.classList.add('hidden');
            enableBodyScroll();
          }, 300);
        }
        return;
      }
      
      // Handle modal
      if (modal) {
        const isOpening = modal.classList.contains('hidden');
        modal.classList.toggle('hidden');
        
        // Manage scroll
        if (isOpening) {
          disableBodyScroll();
        } else {
          enableBodyScroll();
        }
        return;
      }
      
      // Fallback: try generic element toggle
      const element = document.getElementById(elementName) || document.querySelector(\`.\${elementName}\`);
      if (element) {
        element.classList.toggle('hidden');
      }
    }
    
    // Handle navigation clicks with data-nav attributes
    document.addEventListener('click', function(e) {
      const target = e.target.closest('[data-nav]');
      if (!target) return;
      
      const navValue = target.getAttribute('data-nav');
      const navType = target.getAttribute('data-nav-type');
      
      if (!navValue) return;
        switch (navType) {        case 'internal':
          e.preventDefault();
          // Check if it's a modal or drawer first
          const modal = document.getElementById(\`modal-\${navValue}\`);
          const drawer = document.getElementById(\`drawer-\${navValue}\`);
          
          if (modal) {
            toggleElement(navValue);
          } else if (drawer) {
            toggleElement(navValue);
          } else {
            navigateToScreen(navValue);
          }
          break;
        case 'back':
          e.preventDefault();
          navigateBack();
          break;
        case 'external':
          e.preventDefault();
          window.open(navValue, '_blank', 'noopener,noreferrer');
          break;
        case 'action':
          e.preventDefault();
          try {
            new Function(navValue)();
          } catch (error) {
            console.error('Error executing navigation action:', error);
          }
          break;
        case 'toggle':
          e.preventDefault();
          // Extract element name from toggle commands          let elementName = '';
          if (navValue.includes('(')) {            // Handle toggleDrawer(), etc.
            const match = navValue.match(/toggle(\\w+)\\(\\)/);
            elementName = match ? match[1].toLowerCase() : 'drawer';
          } else if (navValue.includes('-')) {
            // Handle toggle-drawer, etc.
            elementName = navValue.split('-')[1] || 'drawer';
          } else {
            elementName = 'drawer'; // Default fallback
          }
          toggleElement(elementName);
          break;
      }
    });
      // Handle overlay clicks to close drawer/modal
    document.addEventListener('click', function(e) {
      if (e.target && e.target.classList.contains('drawer-overlay')) {
        const drawer = document.querySelector('.drawer');
        const overlay = document.querySelector('.drawer-overlay');
        if (drawer) drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        enableBodyScroll();
      }
      
      // Handle modal backdrop clicks to close modal
      if (e.target && e.target.classList.contains('modal-backdrop')) {
        const modal = e.target.closest('.modal');
        if (modal) {
          modal.classList.add('hidden');
          enableBodyScroll();
        }
      }
    });
  `;
}

/**
 * Centralized navigation click handler for React and HTML export
 * Handles all navigation types and updates UI accordingly
 * Accepts optional callbacks for internal navigation and toggle actions
 */
export function handleNavigationClick(
  e: React.MouseEvent<Element, MouseEvent> | MouseEvent,
  options?: {
    onInternalNavigate?: (screenName: string) => void;
    onToggle?: (elementName: string) => void;
    onBack?: () => void;
  }
) {
  const target = (e.target as Element).closest('[data-nav]');
  if (!target) return;

  const navValue = target.getAttribute('data-nav');
  const navType = target.getAttribute('data-nav-type');

  if (!navValue) return;

  // Always lowercase navValue for internal navigation to match screen IDs and rendering logic
  const normalizedNavValue = navType === 'internal' && navValue ? navValue.toLowerCase() : navValue;
  if (target.tagName === 'A' || navType === 'internal' || navType === 'toggle' || navType === 'action' || navType === 'back') {
    if (typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
  }
  switch (navType) {
    case 'internal':
      // Add to history before navigating
      addToHistory(normalizedNavValue);
      
      // Debug: log callback
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
      break;
    case 'back':
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
      break;case 'toggle':
      // Extract element name from toggle commands
      let elementName = '';
      if (navValue.includes('(')) {
        // Handle toggleDrawer(), etc.
        const match = navValue.match(/toggle(\\w+)\\(\\)/);
        elementName = match ? match[1].toLowerCase() : 'drawer';
      } else if (navValue.includes('-')) {
        // Handle toggle-drawer, etc.
        elementName = navValue.split('-')[1] || 'drawer';
      } else {
        elementName = 'drawer'; // Default fallback
      }
      
      if (options && options.onToggle) {
        options.onToggle(elementName);      } else {
        // Fallback: DOM manipulation for toggle
        const drawer = document.querySelector('.drawer');
        const drawerElement = document.getElementById(`drawer-${elementName}`);
        const modal = document.getElementById(`modal-${elementName}`);
        
        if (elementName === 'drawer' && drawer) {
          const overlay = document.querySelector('.drawer-overlay');
          const isOpening = !drawer.classList.contains('open');
          
          drawer.classList.toggle('open');
          if (overlay) overlay.classList.toggle('open');
          
          // Manage scroll
          if (isOpening) {
            disableBodyScroll();
          } else {
            enableBodyScroll();
          }
        } else if (drawerElement) {
          const isHidden = drawerElement.classList.contains('hidden');
          const content = drawerElement.querySelector('.drawer-content');
          
          if (isHidden) {
            drawerElement.classList.remove('hidden');
            if (content) {
              content.classList.add('translate-x-0');
              content.classList.remove('-translate-x-full');
            }
            disableBodyScroll();
          } else {
            if (content) {
              content.classList.remove('translate-x-0');
              content.classList.add('-translate-x-full');
            }
            setTimeout(() => {
              drawerElement.classList.add('hidden');
              enableBodyScroll();
            }, 300);
          }
        } else if (modal) {
          const isOpening = modal.classList.contains('hidden');
          modal.classList.toggle('hidden');
          
          // Manage scroll
          if (isOpening) {
            disableBodyScroll();
          } else {
            enableBodyScroll();
          }
        }
      }
      break;
    case 'external':
      window.open(navValue, '_blank', 'noopener,noreferrer');
      break;
    case 'action':
      try {
        new Function(navValue)();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error executing navigation action:', error);
      }
      break;
  }
}

/**
 * Check if an element is a modal or drawer by searching through AST nodes
 */
export function findElementType(elementName: string, allNodes: any[]): 'modal' | 'drawer' | 'screen' | null {
  const lowerName = elementName.toLowerCase();
  
  // Search for modal
  const isModal = allNodes.some(node => 
    node.type === 'modal' && node.name?.toLowerCase() === lowerName
  );
  
  if (isModal) return 'modal';
  
  // Search for drawer
  const isDrawer = allNodes.some(node => 
    node.type === 'drawer' && node.name?.toLowerCase() === lowerName
  );
  
  if (isDrawer) return 'drawer';
  
  // Search for screen
  const isScreen = allNodes.some(node => 
    node.type === 'screen' && node.name?.toLowerCase() === lowerName
  );
  
  if (isScreen) return 'screen';
  
  return null;
}

/**
 * Get the actual element name with original case
 */
export function getActualElementName(elementName: string, allNodes: any[]): string {
  const lowerName = elementName.toLowerCase();
  
  // Find the node with matching name (case-insensitive)
  const foundNode = allNodes.find(node => 
    (node.type === 'modal' || node.type === 'drawer' || node.type === 'screen') && 
    node.name?.toLowerCase() === lowerName
  );
  
  return foundNode?.name || elementName;
}

/**
 * Toggle a drawer element
 */
export function toggleDrawer(drawerName: string): boolean {
  const drawerContainer = document.getElementById(`drawer-${drawerName}`);
  
  if (!drawerContainer) {
    console.warn(`Drawer ${drawerName} not found`);
    return false;
  }
  
  const isHidden = drawerContainer.classList.contains('hidden');
  const drawerContent = drawerContainer.querySelector('.drawer-content');
  
  if (isHidden) {
    // Show drawer
    drawerContainer.classList.remove('hidden');
    disableBodyScroll();
    
    if (drawerContent) {
      setTimeout(() => {
        drawerContent.classList.remove('-translate-x-full');
        drawerContent.classList.add('translate-x-0');
      }, 50);
    }
  } else {
    // Hide drawer
    enableBodyScroll();
    
    if (drawerContent) {
      drawerContent.classList.remove('translate-x-0');
      drawerContent.classList.add('-translate-x-full');
    }
    
    setTimeout(() => {
      drawerContainer.classList.add('hidden');
    }, 300);
  }
  
  return true;
}

/**
 * Toggle a modal element
 */
export function toggleModal(modalName: string): boolean {
  const modal = document.getElementById(`modal-${modalName}`);
  
  if (!modal) {
    console.warn(`Modal ${modalName} not found`);
    return false;
  }
  
  const isHidden = modal.classList.contains('hidden');
  
  if (isHidden) {
    modal.classList.remove('hidden');
    disableBodyScroll();
  } else {
    modal.classList.add('hidden');
    enableBodyScroll();
  }
  
  return true;
}

/**
 * Handle navigation to different types of elements (screen, modal, drawer)
 * Returns true if navigation was handled, false if it should be passed to external handler
 */
export function handleElementNavigation(
  elementName: string, 
  allNodes: any[]
): { handled: boolean; elementType: string | null; actualName: string } {
  const elementType = findElementType(elementName, allNodes);
  const actualName = getActualElementName(elementName, allNodes);
  
  if (!elementType) {
    return { handled: false, elementType: null, actualName };
  }
  
  switch (elementType) {
    case 'modal':
      addToHistory(actualName);
      toggleModal(actualName);
      return { handled: true, elementType: 'modal', actualName };
      
    case 'drawer':
      toggleDrawer(actualName);
      return { handled: true, elementType: 'drawer', actualName };
      
    case 'screen':
      addToHistory(actualName);
      return { handled: false, elementType: 'screen', actualName };
      
    default:
      return { handled: false, elementType: null, actualName };
  }
}