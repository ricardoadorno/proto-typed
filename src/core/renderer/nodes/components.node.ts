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
export function findComponentDefinitions(): AstNode[] {
  return globalComponentDefinitions;
}

/**
 * Recursively substitute props in any object
 */
export function substitutePropsRecursive(obj: any, props: string[]): any {
  if (typeof obj === 'string') {
    return substitutePropsInString(obj, props);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => substitutePropsRecursive(item, props));
  }
  
  if (obj && typeof obj === 'object') {
    const result = { ...obj };
    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        result[key] = substitutePropsRecursive(result[key], props);
      }
    }
    return result;
  }
  
  return obj;
}

/**
 * Substitute props in a string
 */
export function substitutePropsInString(text: string, props: string[]): string {
  let result = text;
  props.forEach((prop, index) => {
    const propPattern = new RegExp(`\\$prop${index + 1}\\b`, 'g');
    result = result.replace(propPattern, prop);
  });
  return result;
}

/**
 * Recursively substitute props in an element
 */
export function substitutePropsInElement(element: AstNode, props: string[]): AstNode {
  // Create a deep copy of the element
  const elementCopy = JSON.parse(JSON.stringify(element));
  
  // Apply prop substitution recursively
  return substitutePropsRecursive(elementCopy, props);
}

/**
 * Render component definition (stores for later use)
 */
export function renderComponent(_node: AstNode): string {
  // Component definitions don't render directly - they're stored for instantiation
  return '';
}

/**
 * Render component instance
 */
export function renderComponentInstance(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  if (!nodeRenderer) {
    console.warn('NodeRenderer is required for component instance rendering');
    return '';
  }
  
  const componentName = (node.props as any)?.componentName;
  const propValues = (node.props as any)?.props || [];
  
  if (!componentName) {
    console.warn('Component instance missing componentName');
    return '';
  }
  
  // Find the component definition
  const componentDef = globalComponentDefinitions.find(
    comp => (comp.props as any)?.name === componentName
  );
  
  if (!componentDef) {
    console.warn(`Component definition not found: ${componentName}`);
    return `<!-- Component not found: ${componentName} -->`;
  }
  
  // Render each element in the component with prop substitution
  const componentElements = componentDef.children || [];
  const renderedElements = componentElements.map(element => {
    const substitutedElement = substitutePropsInElement(element, propValues);
    return nodeRenderer(substitutedElement, context);
  }).join('\n');
  
  return `<div class="component-instance" data-component="${componentName}">${renderedElements}</div>`;
}