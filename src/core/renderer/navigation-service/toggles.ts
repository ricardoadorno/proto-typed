/**
 * UI Element Toggles
 * Functions to toggle modal and drawer elements
 */

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
    
    if (drawerContent) {
      drawerContent.classList.add('translate-x-0');
      drawerContent.classList.remove('-translate-x-full');
    }
  } else {
    // Hide drawer
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
  // Try both with and without the modal- prefix
  let modal = document.getElementById(`modal-${modalName}`);
  if (!modal) {
    modal = document.getElementById(modalName);
  }
  
  if (!modal) {
    console.warn(`Modal ${modalName} not found`);
    return false;
  }
  
  const isHidden = modal.classList.contains('hidden');
  if (isHidden) {
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
  
  return true;
}

/**
 * Toggle any UI element (drawer, modal, or generic element)
 */
export function toggleElement(elementName: string): boolean {
  const drawer = document.querySelector('.drawer');
  const drawerElement = document.getElementById(`drawer-${elementName}`);
  const modal = document.getElementById(`modal-${elementName}`);
  
  // Handle legacy drawer toggle
  if (elementName === 'drawer' || elementName === 'Drawer' || !elementName) {
    if (drawer) {
      const overlay = document.querySelector('.drawer-overlay');
      drawer.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
      return true;
    }
  }
    
  // Handle specific drawer element
  if (drawerElement) {
    return toggleDrawer(elementName);
  }
    
  // Handle modal element
  if (modal) {
    return toggleModal(elementName);
  }
  
  // Handle generic element toggle
  const element = document.getElementById(elementName) || document.querySelector(`.${elementName}`);
  if (element) {
    element.classList.toggle('hidden');
    return true;
  }
  
  console.warn(`Element ${elementName} not found`);
  return false;
}

/**
 * Close all open drawers
 */
export function closeAllDrawers(): void {
  const drawers = document.querySelectorAll('[id^="drawer-"]');
  drawers.forEach(drawer => {
    const drawerContent = drawer.querySelector('.drawer-content');
    if (drawerContent) {
      drawerContent.classList.remove('translate-x-0');
      drawerContent.classList.add('-translate-x-full');
    }
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 300);
  });
  
  // Handle legacy drawer
  const legacyDrawer = document.querySelector('.drawer');
  const overlay = document.querySelector('.drawer-overlay');
  if (legacyDrawer) legacyDrawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

/**
 * Close all open modals
 */
export function closeAllModals(): void {
  const modals = document.querySelectorAll('[id^="modal-"]');
  modals.forEach(modal => {
    modal.classList.add('hidden');
  });
}
