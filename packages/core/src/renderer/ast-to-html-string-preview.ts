import {
  RouteManager,
  routeManager as defaultRouteManager,
} from './core/route-manager'
import { customPropertiesManager } from './core/theme-manager'
import { resetRenderErrors, getRenderErrors } from './core/node-renderer'
import { setComponentDefinitions } from './nodes/components.node'
import {
  renderAllScreens,
  renderGlobalElements,
} from './infrastructure/html-render-helper'
import { NavigationMediator } from './infrastructure/navigation-mediator'
import { ProtoError } from '../types/errors'
import { AstNode } from '../types/ast-node'
import { RenderOptions } from '../types/render'

/**
 * Result of rendering with errors collected
 */
export interface RenderResult {
  html: string
  errors: ProtoError[]
}

/**
 * Convert AST to HTML string representation with pagination for in-app preview
 * This version treats the container div as the "body" by adding appropriate styles
 *
 * @returns Object with html string and collected render errors
 */
export function astToHtmlStringPreview(
  ast: AstNode | AstNode[],
  options: RenderOptions = {},
  manager: RouteManager = defaultRouteManager
): RenderResult {
  try {
    // Reset render errors before starting
    resetRenderErrors()

    // Reset and process custom properties for this preview
    customPropertiesManager.reset()

    // Process styles first to configure custom properties
    const astArray = Array.isArray(ast) ? ast : [ast]
    const stylesNodes = astArray.filter((node) => node.type === 'Styles')
    customPropertiesManager.processStylesConfig(stylesNodes)

    // Process routes through the route manager
    manager.processRoutes(ast, {
      currentScreen: options.currentScreen || undefined,
    })

    // Set route context for navigation analysis
    manager.setRouteContext(manager.getRouteContext())

    // Create render context
    const context = manager.createRenderContext('preview', {
      currentScreen: options.currentScreen || undefined,
    })

    NavigationMediator.setActiveRouteManager(manager)
    const html = generatePreviewHtml(context, manager)

    // Collect render errors after rendering
    const errors = getRenderErrors()

    // Clear route context after rendering
    manager.clearRouteContext()
    NavigationMediator.resetRouteManager()

    return { html, errors }
  } catch (error: unknown) {
    // Clear route context on error
    manager.clearRouteContext()
    NavigationMediator.resetRouteManager()
    throw error
  }
}

interface PreviewContext {
  routes: Array<{ name: string; path: string; node: unknown }>
  [key: string]: unknown
}

/**
 * Generate HTML for preview mode
 */
function generatePreviewHtml(
  context: PreviewContext,
  manager: RouteManager
): string {
  const { routes } = context

  // Register components with the renderer
  const componentRoutes = manager.getRoutesByType('component')
  const componentNodes = componentRoutes.map((route) => route.node)
  setComponentDefinitions(componentNodes)

  // Render screens
  const screenRoutes = manager.getScreenRoutes()
  const screensHtml = renderAllScreens(
    screenRoutes.map((route) => route.node),
    routes.currentScreen
  )

  // Render global elements (modals and drawers)
  const globalElementsHtml = renderGlobalElements(manager)

  // Generate complete CSS variables for scoped styling (theme + custom)
  const allVariables = customPropertiesManager.generateAllCssVariables(true)
  const scopedStyles = allVariables
    ? `
    <style>
      [data-preview-container="true"] {
${allVariables}
        /* Use CSS variables instead of hardcoded colors */
        background: var(--background);
        color: var(--foreground);
        min-height: 100vh;
        position: relative;
      }
    </style>`
    : ''

  // Return wrapped HTML for preview with only theme-based styling
  return `
  <div data-preview-container="true" class="h-full w-full overflow-auto">
    ${scopedStyles}
    ${screensHtml}
    ${globalElementsHtml}

    </div>`
}
