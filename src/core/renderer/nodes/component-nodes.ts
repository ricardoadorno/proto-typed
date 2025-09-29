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
 * Render component instance with props support
 */
export function renderComponentInstance(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const componentName = node.name;
  const instanceProps = (node as any).props || [];
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
  
  // Render each element with prop substitution
  return componentElements
    .map(element => {
      // Create a copy of the element with props substituted
      const elementWithSubstitution = substitutePropsInElement(element, instanceProps);
      return nodeRenderer(elementWithSubstitution, context);
    })
    .join('\n');
}

/**
 * Recursively substitute %prop variables with actual prop values
 */
function substitutePropsInElement(element: AstNode, props: string[]): AstNode {
  // Create a deep copy of the element
  const elementCopy = JSON.parse(JSON.stringify(element));
  
  // Recursively substitute in all string properties
  return substitutePropsRecursive(elementCopy, props);
}

/**
 * Recursively substitute props in any object
 */
function substitutePropsRecursive(obj: any, props: string[]): any {
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
 * Substitute %prop variables in a string with actual values
 */
function substitutePropsInString(str: string, props: string[]): string {
  // Replace %0, %1, %2, etc. with corresponding prop values (zero-indexed)
  let result = str.replace(/%(\d+)/g, (match, index) => {
    const propIndex = parseInt(index, 10);
    return propIndex < props.length ? props[propIndex] : match;
  });
  
  // Replace named variables %prop with positional props
  // We'll use a simple mapping: first occurrence = props[0], second = props[1], etc.
  let propIndex = 0;
  result = result.replace(/%([a-zA-Z_][a-zA-Z0-9_]*)/g, () => {
    const value = propIndex < props.length ? props[propIndex] : '';
    propIndex++;
    return value;
  });
  
  return result;
}
