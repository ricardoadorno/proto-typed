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
export function substitutePropsRecursive(obj: any, props: string[], namedMap?: Record<string, string>): any {
  if (typeof obj === 'string') {
    return substitutePropsInString(obj, namedMap);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => substitutePropsRecursive(item, props, namedMap));
  }

  if (obj && typeof obj === 'object') {
    const result: Record<string, any> = Array.isArray(obj) ? [...obj] : { ...obj };
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result[key] = substitutePropsRecursive(result[key], props, namedMap);
      }
    }
    return result;
  }

  return obj;
}

/**
 * Substitute props in a string
 */
export function substitutePropsInString(text: string, namedMap?: Record<string, string>): string {
  let result = text;

  // 2. Named: %name, %email etc.
  if (namedMap) {
    Object.entries(namedMap).forEach(([name, value]) => {
      const pattern = new RegExp(`%${name}\\b`, 'g');
      result = result.replace(pattern, value);
    });
  }

  return result;
}

/**
 * Recursively substitute props in an element
 */
export function substitutePropsInElement(element: AstNode, props: string[], propNames?: string[]): AstNode {
  // Deep copy
  const elementCopy = JSON.parse(JSON.stringify(element));

  // Build named map if names provided
  let namedMap: Record<string, string> | undefined;
  if (propNames && propNames.length) {
    namedMap = {};
    propNames.forEach((name, idx) => {
      if (name) namedMap![name] = props[idx] ?? '';
    });
  }

  return substitutePropsRecursive(elementCopy, props, namedMap);
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
  const templateChildren = (node.props as any)?.templateChildren || [];
  
  // Convert templateChildren to propValues for backward compatibility
  // templateChildren can be PropValue nodes or UnorderedListItem nodes
  const propValues: string[] = templateChildren.map((child: any) => {
    if (child.type === 'PropValue') {
      return child.props?.text || '';
    } else if (child.type === 'UnorderedListItem') {
      return child.props?.text || '';
    }
    return '';
  }).filter((text: string) => text.length > 0);
  
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

  // Attempt to derive prop names from placeholders (%name) present in template
  // Scan first pass of stringified node for %identifier tokens
  const templateText = JSON.stringify(componentElements);
  const placeholderMatches = Array.from(templateText.matchAll(/%([a-zA-Z_][a-zA-Z0-9_]*)/g));
  const orderedUniqueNames: string[] = [];
  placeholderMatches.forEach(m => {
    const nm = m[1];
    if (!orderedUniqueNames.includes(nm)) orderedUniqueNames.push(nm);
  });

  const renderedElements = componentElements.map(element => {
    const substitutedElement = substitutePropsInElement(element, propValues, orderedUniqueNames);
    return nodeRenderer(substitutedElement, context);
  }).join('\n');
  
  return `<div class="component-instance" data-component="${componentName}">${renderedElements}</div>`;
}