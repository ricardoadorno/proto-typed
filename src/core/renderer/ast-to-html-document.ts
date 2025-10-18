import { AstNode } from '../../types/ast-node';
import { routeManager } from './core/route-manager';
import { customPropertiesManager } from './core/theme-manager';
import { setComponentDefinitions } from './nodes/components.node';
import { renderGlobalElements, renderScreenForDocument } from './infrastructure/html-render-helper';
import { RenderOptions } from '../../types/render';

/**
 * Generate a complete HTML document with all screens
 */
export function astToHtmlDocument(ast: AstNode | AstNode[], options: RenderOptions = {}): string {
  try {
    // Reset custom properties manager for each document generation
    customPropertiesManager.reset();
    
    // Process styles first to configure custom properties
    const astArray = Array.isArray(ast) ? ast : [ast];
    const stylesNodes = astArray.filter(node => node.type === 'Styles');
    customPropertiesManager.processStylesConfig(stylesNodes);
    
    // Process routes through the route manager with possible currentScreen
    routeManager.processRoutes(ast, {
      currentScreen: options.currentScreen || undefined
    });

    // Set route context for navigation analysis
    routeManager.setRouteContext(routeManager.getRouteContext());

    // Create render context
    const context = routeManager.createRenderContext('document', {
      currentScreen: options.currentScreen || undefined
    });

    const result = generateDocumentHtml(context);

    // Clear after
    routeManager.clearRouteContext();
    return result;
  } catch (error: any) {
    routeManager.clearRouteContext();
    throw error;
  }
}

/**
 * Generate full HTML document
 */
function generateDocumentHtml(context: any): string {
  const { routes } = context;
  // Register components with the renderer
  const componentRoutes = routeManager.getRoutesByType('component');
  const componentNodes = componentRoutes.map(route => route.node);
  setComponentDefinitions(componentNodes);
  
  // Generate screens HTML with visibility styles using currentScreen from context
  const screenRoutes = routeManager.getScreenRoutes();
  const screensHtml = screenRoutes
    .filter(route => route.node && route.name)
    .map((route, index) => renderScreenForDocument(route.node, index, routes.currentScreen))
    .join('\n\n');
  
  // Render global elements
  const globalElementsHtml = renderGlobalElements(routeManager);
  
  // Generate navigation script
  const navigationScript = generateNavigationScript();

  // Create the full HTML document
  return generateHtmlDocumentTemplate(screensHtml, globalElementsHtml, navigationScript);
}



/**
 * Generate HTML document template
 */
function generateHtmlDocumentTemplate(
  screensHtml: string,
  globalElementsHtml: string,
  navigationScript: string
): string {
  const scripts = {
    tailwindCdn: `<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>`,
    tailwindConfig: `<script>tailwind.config = { darkMode: 'class', theme: { extend: {} } };</script>`,
    darkModeScript: `<script>document.documentElement.classList.add('dark');</script>`,
    lucideScript: `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>`,
    lucideInitScript: `<script>
      document.addEventListener('DOMContentLoaded', function() {
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    </script>`
  }

  // Generate CSS variables from theme and custom properties
  const allVariables = customPropertiesManager.generateAllCssVariables(true); // Dark mode

  return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${scripts.tailwindCdn}
  ${scripts.tailwindConfig}
  ${scripts.lucideScript}
  <title>Exported Screens - ${customPropertiesManager.getCurrentThemeName()} theme</title>
  <style>
    :root {
${allVariables}
    }
    
    html, body { 
      min-height: 100%; 
      background: var(--background);
      color: var(--foreground);
    }
    .screen { transition: background 0.3s; }
  </style>
</head>
<body class="min-h-screen">  ${screensHtml}${globalElementsHtml}  ${scripts.darkModeScript}
  ${scripts.lucideInitScript}  <script>
    ${navigationScript}
  </script>
</body>
</html>  `.trim();
}

/**
 * Generate the JavaScript code for navigation handling
 */
function generateNavigationScript(): string {
  return `
    // Navigation History Management
    let navigationHistory = [];
    let currentScreenIndex = -1;
    
    // Initialize navigation with the first visible screen
    function initializeNavigation() {
      const screens = document.querySelectorAll('.screen');
      for (const screen of screens) {
        if (screen.style.display !== 'none') {
          const screenClass = Array.from(screen.classList).find(cls => 
            cls !== 'screen' && cls !== 'container' && cls !== 'mx-auto'
          );
          if (screenClass) {
            addToHistory(screenClass);
            break;
          }
        }
      }
    }
      
    function addToHistory(screenName) {
      navigationHistory = navigationHistory.slice(0, currentScreenIndex + 1);
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
        if (screen.getAttribute('data-screen') === screenName) {
          screen.style.display = 'block';
        } else {
          screen.style.display = 'none';
        }
      });
      
      if (screenName !== navigationHistory[currentScreenIndex]) {
        addToHistory(screenName);
      }
    }

    // Helper functions for checking open overlays
    function hasOpenDrawer() {
      // Check for named drawers
      const drawers = document.querySelectorAll('[id^="drawer-"]');
      for (const drawer of drawers) {
        if (!drawer.classList.contains('hidden')) {
          return true;
        }
      }
      
      return false;
    }

    function hasOpenModal() {
      const modals = document.querySelectorAll('[id^="modal-"]');
      for (const modal of modals) {
        if (!modal.classList.contains('hidden')) {
          return true;
        }
      }
      return false;
    }

    function hasOpenOverlay() {
      return hasOpenDrawer() || hasOpenModal();
    }

    function closeAllDrawers() {
      // Updated: new drawer structure uses root .drawer-container with overlay + aside
      const drawers = document.querySelectorAll('[id^="drawer-"]');
      drawers.forEach(drawer => {
        const aside = drawer.querySelector('aside');
        if (aside) {
          aside.classList.add('-translate-x-full');
          aside.classList.remove('translate-x-0');
          // Delay hiding container to allow transition
          setTimeout(() => drawer.classList.add('hidden'), 250);
        } else {
          drawer.classList.add('hidden');
        }
      });
    }

    function closeAllModals() {
      const modals = document.querySelectorAll('[id^="modal-"]');
      modals.forEach(modal => {
        modal.classList.add('hidden');
      });
    }

    function closeOpenOverlaysOnButtonClick() {
      if (hasOpenOverlay()) {
        closeAllModals();
        closeAllDrawers();
      }
    }

    function toggleElement(elementName) {
      if (!elementName) return;
      // Updated drawer/modal toggling aligned with new markup from views.node.ts
      const drawerContainer = document.getElementById('drawer-' + elementName); // .drawer-container root
      if (drawerContainer) {
        const aside = drawerContainer.querySelector('aside');
        const isHidden = drawerContainer.classList.contains('hidden');
        if (isHidden) {
          drawerContainer.classList.remove('hidden');
          if (aside) {
            // Start off-screen then bring in next frame
            aside.classList.add('-translate-x-full');
            requestAnimationFrame(() => {
              aside.classList.remove('-translate-x-full');
              aside.classList.add('translate-x-0');
            });
          }
        } else {
          if (aside) {
            aside.classList.remove('translate-x-0');
            aside.classList.add('-translate-x-full');
            setTimeout(() => drawerContainer.classList.add('hidden'), 250);
          } else {
            drawerContainer.classList.add('hidden');
          }
        }
        return;
      }
      const modal = document.getElementById('modal-' + elementName);
      if (modal) {
        modal.classList.toggle('hidden');
        return;
      }
      // Fallback legacy support: attempt generic element id / class
      const element = document.getElementById(elementName) || document.querySelector('.' + elementName);
      if (element) element.classList.toggle('hidden');
    }
      // Handle navigation clicks with data-nav attributes
    document.addEventListener('click', function(e) {
      const target = e.target.closest('[data-nav]');
      if (!target) return;
      
      const navValue = target.getAttribute('data-nav');
      const navType = target.getAttribute('data-nav-type');
      
      if (!navValue) return;

      // Close any open overlays before performing the navigation action
      // Exception: don't close overlays if the action is to open the same modal/drawer
      const isOpeningModal = navType === 'internal' && document.getElementById(\`modal-\${navValue}\`);
      const isOpeningDrawer = navType === 'internal' && document.getElementById(\`drawer-\${navValue}\`);
      
      if (!isOpeningModal && !isOpeningDrawer) {
        closeOpenOverlaysOnButtonClick();
      }
        
      switch (navType) {
        case 'internal':
          e.preventDefault();
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
            // Navigation action failed silently
          }
          break;
        case 'toggle':
          e.preventDefault();
          // Simplified: navValue directly represents the drawer/modal name now
          // Maintain legacy pattern support (toggleName()) if detected
          let directName = navValue;
          if (/^toggle\w+\(\)$/.test(navValue)) {
            const m = navValue.match(/^toggle(\w+)\(\)$/);
            directName = m ? m[1].toLowerCase() : navValue;
          }
          toggleElement(directName);
          break;
      }
    });
      
    // Handle overlay clicks to close drawer/modal
    document.addEventListener('click', function(e) {
      if (e.target && e.target.classList.contains('drawer-overlay')) {
        const container = e.target.closest('[id^="drawer-"]');
        if (container) {
          const aside = container.querySelector('aside');
          if (aside) {
            aside.classList.remove('translate-x-0');
            aside.classList.add('-translate-x-full');
            setTimeout(() => container.classList.add('hidden'), 250);
          } else {
            container.classList.add('hidden');
          }
        }
      }
      if (e.target && e.target.classList.contains('modal-backdrop')) {
        const modal = e.target.closest('.modal');
        if (modal) modal.classList.add('hidden');
      }
    });
    
    // Initialize navigation history when page loads
    document.addEventListener('DOMContentLoaded', function() {
      initializeNavigation();
    });
    
    // Fallback initialization if DOMContentLoaded has already fired
    if (document.readyState === 'loading') {
      // DOMContentLoaded listener above will handle it
    } else {
      // DOM is already ready, initialize immediately
      initializeNavigation();
    }
  `;
}