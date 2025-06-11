/**
 * Navigation Script Generator
 * Generate JavaScript code for navigation handling in HTML exports
 */

/**
 * Generate the JavaScript code for navigation handling
 */
export function generateNavigationScript(): string {
  return `
    // Navigation History Management
    let navigationHistory = [];
    let currentScreenIndex = -1;
    
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
        if (screen.className.includes(screenName.toLowerCase())) {
          screen.style.display = 'block';
        } else {
          screen.style.display = 'none';
        }
      });
      
      if (screenName !== navigationHistory[currentScreenIndex]) {
        addToHistory(screenName);
      }
    }

    function toggleElement(elementName) {
      const drawer = document.querySelector('.drawer');
      const drawerElement = document.getElementById(\`drawer-\${elementName}\`);
      const modal = document.getElementById(\`modal-\${elementName}\`);
      
      if (elementName === 'drawer' || elementName === 'Drawer' || !elementName) {
        if (drawer) {
          const overlay = document.querySelector('.drawer-overlay');
          drawer.classList.toggle('open');
          if (overlay) overlay.classList.toggle('open');
          return;
        }
      }
        
      if (drawerElement) {
        const isHidden = drawerElement.classList.contains('hidden');
        const content = drawerElement.querySelector('.drawer-content');
        
        if (isHidden) {
          drawerElement.classList.remove('hidden');
          if (content) {
            content.classList.add('translate-x-0');
            content.classList.remove('-translate-x-full');
          }
        } else {
          if (content) {
            content.classList.remove('translate-x-0');
            content.classList.add('-translate-x-full');
          }
          setTimeout(() => {
            drawerElement.classList.add('hidden');
          }, 300);
        }
        return;
      }
        
      if (modal) {
        modal.classList.toggle('hidden');
        return;
      }
      
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
          let elementName = '';
          if (navValue.includes('(')) {
            const match = navValue.match(/toggle(\\w+)\\(\\)/);
            elementName = match ? match[1].toLowerCase() : 'drawer';
          } else if (navValue.includes('-')) {
            elementName = navValue.split('-')[1] || 'drawer';
          } else {
            elementName = 'drawer';
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
      }
      
      if (e.target && e.target.classList.contains('modal-backdrop')) {
        const modal = e.target.closest('.modal');
        if (modal) {
          modal.classList.add('hidden');
        }
      }
    });
  `;
}

/**
 * Generate a lightweight version of the navigation script
 */
export function generateLightNavigationScript(): string {
  return `
    // Basic Navigation Handler
    document.addEventListener('click', function(e) {
      const target = e.target.closest('[data-nav]');
      if (!target) return;
      
      const navValue = target.getAttribute('data-nav');
      const navType = target.getAttribute('data-nav-type');
      
      if (!navValue) return;
      
      if (navType === 'external') {
        window.open(navValue, '_blank', 'noopener,noreferrer');
      } else {
        e.preventDefault();
      }
    });
  `;
}
