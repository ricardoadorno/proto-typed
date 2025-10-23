import type {
  AstNode,
  ComponentProps,
  ComponentInstanceProps,
} from '../../types/ast-node'

// Global variable to store component definitions
let globalComponentDefinitions: AstNode[] = []

/**
 * @function setComponentDefinitions
 * @description Sets the available component definitions that can be used for rendering.
 *
 * @param {AstNode[]} components - An array of 'Component' AST nodes.
 */
export function setComponentDefinitions(components: AstNode[]) {
  globalComponentDefinitions = components
}

/**
 * @function findComponentDefinitions
 * @description Finds all component definitions that are available in the current context.
 *
 * @returns {AstNode[]} An array of 'Component' AST nodes.
 */
export function findComponentDefinitions(): AstNode[] {
  return globalComponentDefinitions
}

/**
 * @function substitutePropsRecursive
 * @description Recursively traverses an object or array and substitutes property placeholders in any string values found.
 *
 * @param {unknown} obj - The object or array to process.
 * @param {string[]} props - An array of property values to substitute.
 * @param {Record<string, string>} [namedMap] - An optional map of named properties to their values.
 * @returns {unknown} The processed object or array with substituted properties.
 */
export function substitutePropsRecursive(
  obj: unknown,
  props: string[],
  namedMap?: Record<string, string>
): unknown {
  if (typeof obj === 'string') {
    return substitutePropsInString(obj, namedMap)
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => substitutePropsRecursive(item, props, namedMap))
  }

  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = Array.isArray(obj)
      ? [...obj]
      : { ...obj }
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result[key] = substitutePropsRecursive(result[key], props, namedMap)
      }
    }
    return result
  }

  return obj
}

/**
 * @function substitutePropsInString
 * @description Substitutes property placeholders (e.g., `%name`) in a string with their corresponding values.
 *
 * @param {string} text - The string to perform substitutions on.
 * @param {Record<string, string>} [namedMap] - An optional map of named properties to their values.
 * @returns {string} The string with substituted properties.
 */
export function substitutePropsInString(
  text: string,
  namedMap?: Record<string, string>
): string {
  let result = text

  // 2. Named: %name, %email etc.
  if (namedMap) {
    Object.entries(namedMap).forEach(([name, value]) => {
      const pattern = new RegExp(`%${name}\\b`, 'g')
      result = result.replace(pattern, value)
    })
  }

  return result
}

/**
 * @function substitutePropsInElement
 * @description Recursively substitutes property placeholders in an AST node.
 *
 * @param {AstNode} element - The AST node to process.
 * @param {string[]} props - An array of property values.
 * @param {string[]} [propNames] - An optional array of property names.
 * @returns {AstNode} The processed AST node with substituted properties.
 */
export function substitutePropsInElement(
  element: AstNode,
  props: string[],
  propNames?: string[]
): AstNode {
  // Deep copy
  const elementCopy = JSON.parse(JSON.stringify(element))

  // Build named map if names provided
  let namedMap: Record<string, string> | undefined
  if (propNames && propNames.length) {
    namedMap = {}
    propNames.forEach((name, idx) => {
      if (name) namedMap![name] = props[idx] ?? ''
    })
  }

  return substitutePropsRecursive(elementCopy, props, namedMap)
}

/**
 * @function renderComponent
 * @description Renders a component definition. Component definitions themselves do not produce any output,
 * as they are only templates. This function is a no-op.
 *
 * @param {AstNode} _node - The 'Component' AST node.
 * @returns {string} An empty string.
 */
export function renderComponent(_node: AstNode): string {
  // Component definitions don't render directly - they're stored for instantiation
  return ''
}

/**
 * @function renderComponentInstance
 * @description Renders an instance of a component. It finds the component's definition,
 * substitutes the provided properties into the component's template, and then renders the result.
 *
 * @param {AstNode} node - The 'ComponentInstance' AST node.
 * @param {string} [context] - The rendering context.
 * @param {(node: AstNode, context?: string) => string} [nodeRenderer] - The main node renderer function, used to render the component's children.
 * @returns {string} The rendered HTML of the component instance.
 */
export function renderComponentInstance(
  node: AstNode,
  context?: string,
  nodeRenderer?: (node: AstNode, context?: string) => string
): string {
  if (!nodeRenderer) {
    console.warn('NodeRenderer is required for component instance rendering')
    return ''
  }

  const instanceProps = node.props as ComponentInstanceProps & {
    templateChildren?: AstNode[]
  }
  const componentName = instanceProps.componentName
  const templateChildren = instanceProps.templateChildren || []

  // Convert templateChildren to propValues for backward compatibility
  // templateChildren can be PropValue nodes or UnorderedListItem nodes
  const propValues: string[] = templateChildren
    .map((child: AstNode) => {
      if (child.type === 'PropValue') {
        return (child.props as { text?: string }).text || ''
      } else if (child.type === 'UnorderedListItem') {
        return (child.props as { text?: string }).text || ''
      }
      return ''
    })
    .filter((text: string) => text.length > 0)

  if (!componentName) {
    console.warn('Component instance missing componentName')
    return ''
  }

  // Find the component definition
  const componentDef = globalComponentDefinitions.find(
    (comp) => (comp.props as ComponentProps).name === componentName
  )

  if (!componentDef) {
    console.warn(`Component definition not found: ${componentName}`)
    return `<!-- Component not found: ${componentName} -->`
  }

  // Render each element in the component with prop substitution
  const componentElements = componentDef.children || []

  // Attempt to derive prop names from placeholders (%name) present in template
  // Scan first pass of stringified node for %identifier tokens
  const templateText = JSON.stringify(componentElements)
  const placeholderMatches = Array.from(
    templateText.matchAll(/%([a-zA-Z_][a-zA-Z0-9_]*)/g)
  )
  const orderedUniqueNames: string[] = []
  placeholderMatches.forEach((m) => {
    const nm = m[1]
    if (!orderedUniqueNames.includes(nm)) orderedUniqueNames.push(nm)
  })

  const renderedElements = componentElements
    .map((element) => {
      const substitutedElement = substitutePropsInElement(
        element,
        propValues,
        orderedUniqueNames
      )
      return nodeRenderer(substitutedElement, context)
    })
    .join('\n')

  return `<div class="component-instance" data-component="${componentName}">${renderedElements}</div>`
}
