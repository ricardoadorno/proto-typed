/**
 * Navigation Helper
 * Unifies navigation logic across the application using data-nav attributes
 */

export interface NavigationTarget {
  type: 'internal' | 'external' | 'action' | 'drawer-toggle';
  value: string;
  isValid: boolean;
}

/**
 * Analyze a navigation target to determine its type
 */
export function analyzeNavigationTarget(target: string | undefined): NavigationTarget {
  if (!target || target.trim() === '') {
    return { type: 'internal', value: '', isValid: false };
  }

  const trimmedTarget = target.trim();

  // Check for drawer toggle action
  if (trimmedTarget === 'toggleDrawer()' || trimmedTarget === 'toggle-drawer') {
    return { type: 'drawer-toggle', value: 'toggleDrawer()', isValid: true };
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
    case 'drawer-toggle':
      attributes.push(`data-nav-type="drawer-toggle"`);
      break;
  }

  return attributes.join(' ');
}

/**
 * Generate onclick handler for navigation based on target type
 * Returns empty string to rely on React event handling in App.tsx
 */
// Deprecated: No longer used, kept for compatibility
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateOnClickHandler(target: string | undefined): string {
  // Return empty string to rely on React event handling through data-nav attributes
  // This prevents "function not defined" errors in React context
  return '';
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
    function navigateToScreen(screenName) {
      const screens = document.querySelectorAll('.screen');
      screens.forEach(screen => {
        if (screen.className.includes(screenName.toLowerCase())) {
          screen.style.display = 'block';
        } else {
          screen.style.display = 'none';
        }
      });
    }
    
    function toggleDrawer() {
      const drawer = document.querySelector('.drawer');
      const overlay = document.querySelector('.drawer-overlay');
      
      if (drawer) {
        drawer.classList.toggle('open');
      }
      
      if (overlay) {
        overlay.classList.toggle('open');
      }
    }
    
    function closeDrawer() {
      const drawer = document.querySelector('.drawer');
      const overlay = document.querySelector('.drawer-overlay');
      
      if (drawer) {
        drawer.classList.remove('open');
      }
      
      if (overlay) {
        overlay.classList.remove('open');
      }
    }
    
    // Handle navigation clicks with data-nav attributes
    document.addEventListener('click', function(e) {
      const target = e.target.closest('[data-nav]');
      if (!target) return;
      
      const navValue = target.getAttribute('data-nav');
      const navType = target.getAttribute('data-nav-type');
      
      if (!navValue) return;
      
      switch (navType) {
        case 'internal':
          e.preventDefault();
          navigateToScreen(navValue);
          break;
        case 'external':
          e.preventDefault();
          window.open(navValue, '_blank', 'noopener,noreferrer');
          break;
        case 'action':
          e.preventDefault();
          try {
            // Execute the action in the global scope
            new Function(navValue)();
          } catch (error) {
            console.error('Error executing navigation action:', error);
          }
          break;
        case 'drawer-toggle':
          e.preventDefault();
          toggleDrawer();
          break;
      }
    });
    
    // Legacy support for existing data-screen-link attributes
    document.addEventListener('click', function(e) {
      if (e.target && e.target.tagName === 'A' && e.target.hasAttribute('data-screen-link')) {
        e.preventDefault();
        const screenName = e.target.getAttribute('data-screen-link');
        if (screenName) {
          navigateToScreen(screenName);
        }
      }    });
    
    // Handle overlay clicks to close drawer
    document.addEventListener('click', function(e) {
      if (e.target && e.target.classList.contains('drawer-overlay')) {
        closeDrawer();
      }
    });
  `;
}

/**
 * Generate the showScreen function for backward compatibility
 */
export function generateLegacyNavigationScript(): string {
  return `
    function showScreen(screenName) {
      navigateToScreen(screenName);
    }
  `;
}

/**
 * Generate complete navigation script including both new and legacy support
 */
export function generateCompleteNavigationScript(): string {
  return generateNavigationScript() + generateLegacyNavigationScript();
}

/**
 * Centralized navigation click handler for React and HTML export
 * Handles all navigation types and updates UI accordingly
 * Accepts optional callbacks for internal navigation and drawer toggling
 */
export function handleNavigationClick(
  e: React.MouseEvent<Element, MouseEvent> | MouseEvent,
  options?: {
    onInternalNavigate?: (screenName: string) => void;
    onDrawerToggle?: () => void;
  }
) {
  const target = (e.target as Element).closest('[data-nav]');
  if (!target) return;

  const navValue = target.getAttribute('data-nav');
  const navType = target.getAttribute('data-nav-type');

  if (!navValue) return;

  // Always lowercase navValue for internal navigation to match screen IDs and rendering logic
  const normalizedNavValue = navType === 'internal' && navValue ? navValue.toLowerCase() : navValue;

  // Debug: log navigation event
  // eslint-disable-next-line no-console
  console.log('[Navigation] navType:', navType, 'navValue:', navValue, 'normalizedNavValue:', normalizedNavValue, 'target:', target);

  if (target.tagName === 'A' || navType === 'internal' || navType === 'drawer-toggle' || navType === 'action') {
    if (typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
  }

  switch (navType) {
    case 'internal':
      // Debug: log callback
      if (options && options.onInternalNavigate) {
        // eslint-disable-next-line no-console
        console.log('[Navigation] Calling onInternalNavigate with', normalizedNavValue);
        options.onInternalNavigate(normalizedNavValue);
      } else {
        // Fallback: show/hide screens by DOM manipulation
        const screenElements = document.querySelectorAll('.screen');
        screenElements.forEach(screen => {
          (screen as HTMLElement).style.display = 'none';
        });
        const targetScreen = document.getElementById(`${normalizedNavValue}-screen`);
        // eslint-disable-next-line no-console
        console.log('[Navigation] Fallback DOM navigation to', `${normalizedNavValue}-screen`, 'found:', !!targetScreen);
        if (targetScreen) {
          targetScreen.style.display = 'block';
        }
      }
      break;
    case 'drawer-toggle':
      if (options && options.onDrawerToggle) {
        options.onDrawerToggle();
      } else {
        const drawer = document.querySelector('.drawer');
        const overlay = document.querySelector('.drawer-overlay');
        if (drawer) drawer.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
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