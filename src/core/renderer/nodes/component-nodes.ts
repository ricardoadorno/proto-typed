import { AstNode } from '../../../types/astNode';

// Global variable to store component definitions
let globalComponentDefinitions: AstNode[] = [];

/**
 * Set the available component definitions
 */
export function setComponentDefinitions(components: AstNode[]) {
  globalComponentDefinitions = components;
}

/**
 * Find all component definitions that are available in the current context
 */
function findComponentDefinitions(): AstNode[] {
  return globalComponentDefinitions;
}

/**
 * Render component declaration (not directly rendered)
 */
export function renderComponent(_node: AstNode): string {
  // Components are stored but not directly rendered - they're instantiated
  return '';
}

/**
 * Render component instance
 */
export function renderComponentInstance(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const componentName = node.name;
  const components = findComponentDefinitions();
  const componentDef = components.find(comp => comp.name === componentName);
  
  if (!componentDef) {
    console.warn(`Component not found: ${componentName}`);
    return `<div class="component-instance error" data-component="${componentName}">Component not found: ${componentName}</div>`;
  }
  
  if (!nodeRenderer) {
    console.warn('Node renderer not provided to component instance');
    return '';
  }
  
  const componentElements = componentDef.elements || [];
  return componentElements
    .map(element => nodeRenderer(element, context))
    .join('\n');
}

/**
 * Render modal element
 */
export function renderModal(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const modalElements = node.elements && nodeRenderer ? 
    node.elements.map(el => nodeRenderer(el, context)).join('\n') : '';
  
  return `<div class="modal hidden" id="modal-${node.name}" data-modal="${node.name}">
    <div class="modal-backdrop absolute inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative" >
        <button class="modal-close absolute top-4 right-4 text-gray-500 hover:text-gray-700" data-nav="${node.name}" data-nav-type="internal">&times;</button>
        ${modalElements}
      </div>
    </div>
  </div>`;
}

/**
 * Render drawer element
 */
export function renderDrawer(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  // Only handle named drawers (modern pattern)
  if (!node.name) {
    console.warn('Drawer element requires a name. Legacy unnamed drawers are deprecated.');
    return '';
  }

  const drawerElements = node.elements && nodeRenderer ? 
    node.elements.map(el => nodeRenderer(el, context)).join('\n') : '';
    
  return `<div class="drawer-container hidden" id="drawer-${node.name}" data-drawer="${node.name}">
    <div class="drawer-overlay absolute inset-0 bg-black/30  z-[1050]"></div>
    <aside class="drawer-content absolute top-0 left-0 z-[1100] w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out">
      <div class="p-4">
        <button class="drawer-close absolute top-4 right-4 text-gray-500 hover:text-gray-700" data-nav="${node.name}" data-nav-type="internal">&times;</button>
        ${drawerElements}
      </div>
    </aside>
  </div>`;
}
