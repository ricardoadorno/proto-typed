import { AstNode } from '../../../types/ast-node';

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
    throw new Error(`Component not found: ${componentName}`);
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
