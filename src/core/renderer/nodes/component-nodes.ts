import { AstNode } from '../../../types/ast-node';
import { globalDataGateway } from '../core/data-gateway';

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
export function substitutePropsRecursive(obj: any, props: string[], dataObject?: any): any {
  if (typeof obj === 'string') {
    return substitutePropsInString(obj, props, dataObject);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => substitutePropsRecursive(item, props, dataObject));
  }
  
  if (obj && typeof obj === 'object') {
    const result = { ...obj };
    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        result[key] = substitutePropsRecursive(result[key], props, dataObject);
      }
    }
    return result;
  }
  
  return obj;
}

/**
 * Recursively substitute props in an element
 */
export function substitutePropsInElement(element: AstNode, props: string[], dataObject?: any): AstNode {
  // Create a deep copy of the element
  const elementCopy = JSON.parse(JSON.stringify(element));
  
  // Recursively substitute in all string properties
  return substitutePropsRecursive(elementCopy, props, dataObject);
}

/**
 * Render component declaration (not directly rendered)
 */
export function renderComponent(_node: AstNode): string {
  // Components are stored but not directly rendered - they're instantiated
  return '';
}

/**
 * Render component instance with props support and data source integration
 */
export async function renderComponentInstance(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): Promise<string> {
  const componentName = node.name;
  const instanceProps = (node as any).props || [];
  const dataSource = (node as any).dataSource;
  const components = findComponentDefinitions();
  const componentDef = components.find(comp => comp.name === componentName);
  
  if (!componentDef) {
    throw new Error(`Component not found: ${componentName}`);
  }
  
  if (!nodeRenderer) {
    console.warn('Node renderer not provided to component instance');
    return '';
  }

  let dataProps: string[] = [];
  let dataObject: any = null;

  // If component has a data source, fetch data from Data Gateway
  if (dataSource && dataSource.type === 'session_storage' && dataSource.key) {
    try {
      await globalDataGateway.initialize();
      const result = await globalDataGateway.query.get(dataSource.key);
      
      if (result.success && result.data) {
        dataObject = result.data;
        // Convert data object to props array format for backward compatibility
        // This will be used alongside the variable substitution
      }
    } catch (error) {
      console.warn(`Failed to fetch data for component ${componentName} from key ${dataSource.key}:`, error);
    }
  }

  // Combine instance props with data props
  const allProps = [...instanceProps, ...dataProps];
  
  const componentElements = componentDef.elements || [];
  
  // Render each element with prop substitution
  const renderedElements = componentElements.map(element => {
    // Create a copy of the element with props substituted
    const elementWithSubstitution = substitutePropsInElement(element, allProps, dataObject);
    return nodeRenderer(elementWithSubstitution, context);
  });
  
  return renderedElements.join('\n');
}

/**
 * Synchronous version for backward compatibility - will render without data source
 */
export function renderComponentInstanceSync(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const componentName = node.name;
  const instanceProps = (node as any).props || [];
  const dataSource = (node as any).dataSource;
  const components = findComponentDefinitions();
  const componentDef = components.find(comp => comp.name === componentName);
  
  if (!componentDef) {
    throw new Error(`Component not found: ${componentName}`);
  }
  
  if (!nodeRenderer) {
    console.warn('Node renderer not provided to component instance');
    return '';
  }

  // If component has a data source, show a placeholder for now
  if (dataSource && dataSource.type === 'session_storage' && dataSource.key) {
    return `<div class="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-2 rounded">
      <strong>${componentName}</strong>: Loading data from "${dataSource.key}"...
      <small class="block text-blue-600">Data will load asynchronously</small>
    </div>`;
  }

  const componentElements = componentDef.elements || [];
  
  // Render each element with prop substitution
  const renderedElements = componentElements.map(element => {
    // Create a copy of the element with props substituted
    const elementWithSubstitution = substitutePropsInElement(element, instanceProps);
    return nodeRenderer(elementWithSubstitution, context);
  });
  
  return renderedElements.join('\n');
}

/**
 * Substitute %prop variables in a string with actual values
 */
function substitutePropsInString(str: string, props: string[], dataObject?: any): string {
  // Replace %0, %1, %2, etc. with corresponding prop values (zero-indexed)
  let result = str.replace(/%(\d+)/g, (match, index) => {
    const propIndex = parseInt(index, 10);
    return propIndex < props.length ? props[propIndex] : match;
  });
  
  // Replace named variables %prop with data from dataObject if available
  if (dataObject) {
    result = result.replace(/%([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, varName) => {
      // Check if the variable exists in dataObject
      if (dataObject.hasOwnProperty(varName)) {
        const value = dataObject[varName];
        return typeof value === 'string' ? value : String(value);
      }
      
      // Fallback to positional props if not found in dataObject
      const propIndex = props.length > 0 ? 0 : -1;
      return propIndex >= 0 && propIndex < props.length ? props[propIndex] : match;
    });
  } else {
    // Original behavior: replace named variables with positional props
    let propIndex = 0;
    result = result.replace(/%([a-zA-Z_][a-zA-Z0-9_]*)/g, () => {
      const value = propIndex < props.length ? props[propIndex] : '';
      propIndex++;
      return value;
    });
  }
  
  return result;
}
