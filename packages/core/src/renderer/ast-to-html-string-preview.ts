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

    // Process head configuration first to configure custom properties
    // The AST may be a single root node (e.g. Screen) that contains Head as a child,
    // so collect Head nodes recursively from the provided AST(s).
    const astArray = Array.isArray(ast) ? ast : [ast]

    const collectByType = (nodes: AstNode[], type: string): AstNode[] => {
      const results: AstNode[] = []
      for (const n of nodes) {
        if (!n) continue
        if (n.type === type) {
          results.push(n)
        }
        if (n.children && n.children.length > 0) {
          results.push(...collectByType(n.children, type))
        }
      }
      return results
    }

    const headNodes = collectByType(astArray, 'Head')
    customPropertiesManager.processHeadConfig(headNodes)

    // Process routes through the route manager
    manager.processRoutes(ast, {
      currentScreen: options.currentScreen || undefined,
    })

    // Set route context for navigation analysis
    manager.setRouteContext(manager.getRouteContext())

    // Create render context
    const renderContext = manager.createRenderContext('preview', {
      currentScreen: options.currentScreen || undefined,
    })

    // Convert RouteRenderContext to PreviewContext for backward compatibility
    const screenRoutes = manager.getScreenRoutes()
    const context: PreviewContext = {
      routes: screenRoutes.map((route) => ({
        name: route.name,
        path: route.name,
        node: route.node,
        currentScreen: renderContext.routes.currentScreen,
      })),
      currentScreen: renderContext.routes.currentScreen,
    }

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
  routes: Array<{
    name: string
    path: string
    node: unknown
    currentScreen?: string | null
  }>
  [key: string]: unknown
}

/**
 * Generate HTML for preview mode
 */
function generatePreviewHtml(
  context: PreviewContext,
  manager: RouteManager
): string {
  // Register components with the renderer
  const componentRoutes = manager.getRoutesByType('component')
  const componentNodes = componentRoutes.map((route) => route.node)
  setComponentDefinitions(componentNodes)

  // Render screens
  const screenRoutes = manager.getScreenRoutes()
  const currentScreen =
    (context.currentScreen as string | null | undefined) || null
  const screensHtml = renderAllScreens(
    screenRoutes.map((route) => route.node),
    currentScreen,
    manager
  )

  // Render global elements (modals and drawers)
  const globalElementsHtml = renderGlobalElements(manager)

  // Generate complete CSS variables for scoped styling (theme + custom + head overrides)
  const allVariables = customPropertiesManager.generateAllCssVariables(true)
  const headOverrides = customPropertiesManager.generateHeadThemeOverrides()
  const googleFontsLink = customPropertiesManager.generateGoogleFontsLink()

  const scopedStyles = allVariables
    ? `
    ${googleFontsLink ? googleFontsLink : ''}
    <style>
      [data-preview-container="true"] {
${allVariables}
${headOverrides ? headOverrides : ''}
        /* Use CSS variables instead of hardcoded colors */
        background: var(--background);
        color: var(--foreground);
        min-height: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    </style>`
    : ''

  // Return wrapped HTML for preview with only theme-based styling
  return `
  <div data-preview-container="true" class="h-full w-full">
    ${scopedStyles}
    <div class="preview-scroll">
      ${screensHtml}
      ${globalElementsHtml}
    </div>
  </div>`
}
