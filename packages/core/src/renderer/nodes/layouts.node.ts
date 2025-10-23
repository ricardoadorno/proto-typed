import {
  elementStyles,
  getListInlineStyles,
  getUnorderedListInlineStyles,
  getFabInlineStyles,
  getNavigatorInlineStyles,
} from './styles/styles'
import {
  findComponentDefinitions,
  substitutePropsInElement,
} from './components.node'
import { NavigationMediator } from '../infrastructure/navigation-mediator'
import type {
  AstNode,
  LayoutProps,
  ListProps,
  ComponentProps,
  FabProps,
} from '../../types/ast-node'
import {
  getLucideSvg,
  isLucideIcon,
  renderTextWithIcons,
} from '../../utils/icon-utils'

/**
 * @const LAYOUT_PRESETS
 * @description A record mapping layout types to their corresponding Tailwind CSS classes.
 * This provides a set of predefined, canonical layouts.
 */
const LAYOUT_PRESETS: Record<string, string> = {
  // Containers
  container: 'max-w-5xl mx-auto px-4',
  'container-narrow': 'max-w-2xl mx-auto px-4',
  'container-wide': 'max-w-7xl mx-auto px-6',
  'container-full': 'w-full',

  // Stacks (Vertical)
  stack: 'flex flex-col gap-4',
  'stack-tight': 'flex flex-col gap-2',
  'stack-loose': 'flex flex-col gap-8',
  'stack-flush': 'flex flex-col',

  // Rows (Horizontal)
  'row-start': 'flex items-center gap-4',
  'row-center': 'flex items-center justify-center gap-4',
  'row-between': 'flex items-center justify-between',
  'row-end': 'flex items-center justify-end gap-4',

  // Grids
  'grid-2': 'grid grid-cols-2 gap-4',
  'grid-3': 'grid grid-cols-3 gap-4',
  'grid-4': 'grid grid-cols-4 gap-4',
  'grid-auto': 'grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4',

  // Cards
  card: 'border rounded-lg p-6',
  'card-compact': 'border rounded-lg p-4',
  'card-feature': 'border-2 rounded-xl p-8 shadow-lg',

  // Special
  header:
    'sticky top-0 left-0 right-0 z-10 bg-background px-6  flex items-center justify-between min-h-[4rem] border-b border-border',
  sidebar: 'h-full fixed border-r p-4 pt-8',
}

/**
 * @function getLayoutInlineStyles
 * @description Gets the inline styles for a layout based on its type.
 * @private
 *
 * @param {string} layoutType - The type of the layout.
 * @returns {string} The inline style string.
 */
function getLayoutInlineStyles(layoutType: string): string {
  // Only cards, header, and sidebar get background colors
  // All other layouts (stacks, grids, containers, rows) are transparent

  if (layoutType.startsWith('card')) {
    return 'background-color: var(--card); color: var(--card-foreground); border-color: var(--border);'
  }

  if (layoutType === 'sidebar') {
    return 'background-color: var(--background); border-color: var(--border);'
  }

  // Transparent for stacks, grids, containers, rows
  return ''
}

/**
 * @function renderLayout
 * @description Renders a 'Layout' AST node to its HTML representation using a canonical preset.
 *
 * @param {AstNode} node - The 'Layout' AST node.
 * @param {(node: AstNode, context?: string) => string} _render - The main node renderer function.
 * @returns {string} The HTML string for the layout element.
 */
export function renderLayout(
  node: AstNode,
  _render: (node: AstNode, context?: string) => string
): string {
  const { layoutType } = node.props as LayoutProps
  const classes = LAYOUT_PRESETS[layoutType] || ''
  const styles = getLayoutInlineStyles(layoutType)

  const content = node.children.map((child) => _render(child)).join('\n')

  // Use semantic HTML tags for header
  if (layoutType === 'header') {
    return `<header class="${classes}" style="${styles}">${content}</header>`
  }

  // Use nav tag for sidebar
  if (layoutType === 'sidebar') {
    return `<nav class="${classes}" style="${styles}">${content}</nav>`
  }

  return `<div class="${classes}" style="${styles}">${content}</div>`
}

/**
 * @function renderList
 * @description Renders a 'List' AST node to its HTML representation.
 * It can render a simple list of items or a list based on a component template.
 *
 * @param {AstNode} node - The 'List' AST node.
 * @param {string} [context] - The rendering context.
 * @param {(node: AstNode, context?: string) => string} [nodeRenderer] - The main node renderer function.
 * @returns {string} The HTML string for the list.
 */
export function renderList(
  node: AstNode,
  context?: string,
  nodeRenderer?: (node: AstNode, context?: string) => string
): string {
  const props = node.props as ListProps & {
    component?: string
    variant?: string
    columns?: string[]
  }

  // Normalização de propriedades
  const componentName: string | undefined =
    props.componentName || props.component
  let dataItems: string[][] | undefined = props?.dataItems

  // Caso não exista dataItems mas seja variant component, derivar de children
  if (!dataItems && props.variant === 'component' && node.children?.length) {
    dataItems = node.children
      .map(
        (child) => (child.props as ListProps & { columns?: string[] }).columns
      )
      .filter(Boolean) as string[][]
  }

  // Lista baseada em template de componente
  if (componentName && Array.isArray(dataItems)) {
    if (!nodeRenderer) {
      return '<div style="color: var(--destructive);">Error: NodeRenderer required for list rendering</div>'
    }

    const components = findComponentDefinitions()
    const componentDef = components.find(
      (comp: AstNode) => (comp.props as ComponentProps).name === componentName
    )

    if (!componentDef) {
      return `<div style="color: var(--destructive);">Error: Component "${componentName}" not found</div>`
    }

    const componentElements = componentDef.children || []

    // Pré-extração ordenada de placeholders para manter comportamento consistente com instâncias isoladas
    const templateText = JSON.stringify(componentElements)
    const placeholderMatches = Array.from(
      templateText.matchAll(/%([a-zA-Z_][a-zA-Z0-9_]*)/g)
    )
    const orderedUniqueNames: string[] = []
    placeholderMatches.forEach((m) => {
      const nm = m[1]
      if (!orderedUniqueNames.includes(nm)) orderedUniqueNames.push(nm)
    })

    // Renderização de cada linha de dados
    const listItems = dataItems
      .map((rowValues: string[]) => {
        return componentElements
          .map((element) => {
            const substituted = substitutePropsInElement(
              element,
              rowValues,
              orderedUniqueNames
            )
            return nodeRenderer(substituted, context)
          })
          .join('\n')
      })
      .join('\n')

    return `<div class="${elementStyles.unorderedList}" style="${getListInlineStyles()}">${listItems}</div>`
  }

  // Render children as list items
  const listElements =
    node.children && nodeRenderer
      ? node.children.map((child) => nodeRenderer(child, context)).join('\n')
      : ''

  return `<div class="${elementStyles.unorderedList}" style="${getListInlineStyles()}">${listElements}</div>`
}

/**
 * @function renderListItem
 * @description Renders an 'UnorderedListItem' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'UnorderedListItem' AST node.
 * @returns {string} The HTML string for the list item.
 */
export function renderListItem(node: AstNode): string {
  const props = node.props as { text?: string }
  const itemContent = props.text || ''

  return `<li class="${elementStyles.listItem}" style="${getUnorderedListInlineStyles()}">${itemContent}</li>`
}

/**
 * @function renderSeparator
 * @description Renders a 'Separator' AST node to its HTML representation.
 *
 * @returns {string} The HTML string for the separator.
 */
export function renderSeparator(): string {
  return `<hr class="${elementStyles.separator}" />`
}

/**
 * @function renderFAB
 * @description Renders a 'Fab' (Floating Action Button) AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Fab' AST node.
 * @returns {string} The HTML string for the FAB.
 */
export function renderFAB(node: AstNode): string {
  const props = node.props as FabProps & { destination?: string }
  const icon = props.icon || 'plus'
  const destination = props.destination || ''

  // Generate navigation attributes using NavigationMediator
  const navAttrs = NavigationMediator.generateNavigationAttributes(destination)

  // Handle icon rendering - can be lucide icon or text
  const iconHtml = isLucideIcon(icon)
    ? getLucideSvg(icon)
    : renderTextWithIcons(icon)

  return `
    <div class="${elementStyles.fabContainer}">
      <button class="${elementStyles.fab}" style="${getFabInlineStyles()}" ${navAttrs}>
        ${iconHtml}
      </button>
    </div>
  `
}

/**
 * @function renderNavigator
 * @description Renders a 'Navigator' (Bottom Navigation) AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Navigator' AST node.
 * @returns {string} The HTML string for the navigator.
 */
export function renderNavigator(node: AstNode): string {
  const items = node.children || []

  const navItems = items
    .map((item: AstNode) => {
      const itemProps = item.props as {
        text?: string
        icon?: string
        destination?: string
      }
      const text = itemProps.text || ''
      const icon = itemProps.icon || ''
      const destination = itemProps.destination || ''

      // Generate navigation action if destination is provided
      const navigationAttrs = destination
        ? NavigationMediator.generateNavigationAttributes(destination)
        : ''

      // Build content based on what's available
      let content = ''

      if (icon && text) {
        // Both icon and text - stack them vertically
        // Icon is always just an icon reference (no embedded text)
        const iconHtml = isLucideIcon(icon) ? getLucideSvg(icon) : icon
        // Text might have embedded icons, so use renderTextWithIcons
        const textHtml = renderTextWithIcons(text)

        content = `
        <div class="${elementStyles.navItemIcon}">${iconHtml}</div>
        <div class="${elementStyles.navItemLabel}">${textHtml}</div>
      `
      } else if (icon) {
        // Only icon - center it (no embedded icons expected here)
        const iconHtml = isLucideIcon(icon) ? getLucideSvg(icon) : icon
        content = `<div class="${elementStyles.navItemIcon}" style="margin-bottom: 0;">${iconHtml}</div>`
      } else if (text) {
        // Only text - might have embedded icons
        const textHtml = renderTextWithIcons(text)
        content = `<div class="${elementStyles.navItemLabel}" style="margin-top: 0;">${textHtml}</div>`
      }

      return `
      <button class="${elementStyles.navItem}" style="${getNavigatorInlineStyles()}" ${navigationAttrs}>
        ${content}
      </button>
    `
    })
    .join('')

  return `
    <nav class="${elementStyles.navigator}" style="${getNavigatorInlineStyles()}">
      ${navItems}
    </nav>`
}
