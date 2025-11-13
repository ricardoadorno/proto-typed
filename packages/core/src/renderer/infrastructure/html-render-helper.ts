/**
 * Screen Rendering Functions
 * Functions for rendering screens in different contexts
 */

import {
  AstNode,
  ViewProps,
  LayoutProps,
  ComponentInstanceProps,
} from '../../types/ast-node.js'
import { ScreenRenderConfig } from '../../types/render.js'
import { renderNode } from '../core/node-renderer.js'
import { RouteManager } from '../core/route-manager.js'
import { customPropertiesManager } from '../core/theme-manager.js'
import { isHeaderComponentName } from '../nodes/components.node.js'

/**
 * Render a single screen to HTML with full configuration
 */
function renderScreen(config: ScreenRenderConfig): string {
  const { screen, index, currentScreen, routeManager } = config

  const screenName = (screen.props as ViewProps)?.name || '' // Nome original preservado
  const style = getScreenVisibilityStyle(screenName, index, currentScreen)
  const { headerElements, fabElements, navigatorElements, contentElements } =
    separateScreenElements(screen)

  const headerHtml =
    headerElements.map((element: AstNode) => renderNode(element)).join('\n') ||
    "<span class='block h-12'></span>"
  const contentHtml =
    contentElements
      .filter((element: AstNode | null) => element != null)
      .map((element: AstNode) => renderNode(element))
      .join('\n      ') || ''
  const fabHtml =
    fabElements.map((element: AstNode) => renderNode(element)).join('\n') || ''
  const navigatorHtml =
    navigatorElements
      .map((element: AstNode) => renderNode(element))
      .join('\n') || ''

  // Apply global template if configured in head
  const headConfig = customPropertiesManager.getHeadConfig()
  const globalTemplate = headConfig.template?.default

  let screenContent = `
  <div id="${screenName}-screen" class="relative overflow-hidden h-full" ${style}>
      ${headerHtml}
      <div class="h-full overflow-auto">
      ${contentHtml}
      </div>
      ${fabHtml}
      ${navigatorHtml}
  </div>`

  // If global template is defined, wrap the screen content with it
  if (globalTemplate && routeManager) {
    screenContent = applyGlobalTemplate(
      screenContent,
      globalTemplate,
      routeManager as RouteManager
    )
  }

  return screenContent
}

/**
 * Render all screens to HTML
 */
export function renderAllScreens(
  screens: AstNode[],
  currentScreen?: string | null,
  routeManager?: RouteManager
): string {
  return screens
    .filter((screen) => screen && (screen.props as ViewProps)?.name)
    .map((screen, index) =>
      renderScreen({
        screen,
        index,
        currentScreen,
        routeManager,
      })
    )
    .join('\n')
}

/**
 * Render a single screen to HTML for document export with enhanced styling
 */
export function renderScreenForDocument(
  screen: AstNode,
  index: number,
  currentScreen?: string | null,
  routeManager?: RouteManager
): string {
  const screenName = (screen.props as ViewProps)?.name || ''
  // If a currentScreen is explicitly provided, use that for visibility, else fall back to first screen visible
  const style = currentScreen
    ? screenName === currentScreen
      ? ''
      : 'style="display:none"'
    : index === 0
      ? ''
      : 'style="display:none"'

  const elementsHtml =
    screen.children
      ?.filter((element: AstNode) => {
        // Keep all elements except named modals and drawers (they'll be rendered globally)
        if (element.type === 'Modal' || element.type === 'Drawer') {
          // Only filter out elements that have names (global elements)
          return !(element.props as ViewProps)?.name
        }
        return element != null
      })
      .map((element) => renderNode(element))
      .join('\n      ') || ''

  // Apply global template if configured in head
  const headConfig = customPropertiesManager.getHeadConfig()
  const globalTemplate = headConfig.template?.default

  let screenContent = `
  <div id="${screenName}-screen" data-screen="${screenName}" class="relative"  ${style}>
      ${elementsHtml}
  </div>`

  // If global template is defined, wrap the screen content with it
  if (globalTemplate && routeManager) {
    screenContent = applyGlobalTemplate(
      screenContent,
      globalTemplate,
      routeManager
    )
  }

  return screenContent
}

/**
 * Separate screen elements by type for proper positioning
 */
function separateScreenElements(screen: AstNode) {
  const isHeaderComponent = (element: AstNode): boolean => {
    if (element.type !== 'ComponentInstance') {
      return false
    }

    const componentName = (element.props as ComponentInstanceProps)
      ?.componentName
    return isHeaderComponentName(componentName)
  }

  const headerElements =
    screen.children?.filter(
      (element: AstNode) =>
        (element.type === 'Layout' &&
          (element.props as LayoutProps)?.layoutType === 'header') ||
        isHeaderComponent(element)
    ) || []
  const fabElements =
    screen.children?.filter((element: AstNode) => element.type === 'Fab') || []
  const navigatorElements =
    screen.children?.filter(
      (element: AstNode) => element.type === 'Navigator'
    ) || []
  const contentElements =
    screen.children?.filter(
      (element: AstNode) =>
        !(
          element.type === 'Layout' &&
          (element.props as LayoutProps)?.layoutType === 'header'
        ) &&
        !isHeaderComponent(element) &&
        element.type !== 'Fab' &&
        element.type !== 'Navigator' &&
        // Exclude named modals and drawers (they'll be rendered globally)
        !(element.type === 'Modal' && (element.props as ViewProps)?.name) &&
        !(element.type === 'Drawer' && (element.props as ViewProps)?.name)
    ) || []

  return { headerElements, fabElements, navigatorElements, contentElements }
}

/**
 * Determine screen visibility style
 */
function getScreenVisibilityStyle(
  screenName: string,
  index: number,
  currentScreen?: string | null
): string {
  if (currentScreen) {
    return screenName === currentScreen ? '' : 'style="display:none"'
  }
  return index === 0 ? '' : 'style="display:none"'
}

/**
 * Render global elements (modals and drawers)
 */
export function renderGlobalElements(routeManager: RouteManager): string {
  const modalRoutes = routeManager.getRoutesByType('modal')
  const drawerRoutes = routeManager.getRoutesByType('drawer')

  const modalsHtml =
    modalRoutes.length > 0
      ? modalRoutes.map((route) => renderNode(route.node)).join('\n')
      : ''

  const drawersHtml =
    drawerRoutes.length > 0
      ? drawerRoutes.map((route) => renderNode(route.node)).join('\n')
      : ''

  if (modalsHtml || drawersHtml) {
    return '\n\n' + [modalsHtml, drawersHtml].filter(Boolean).join('\n') + '\n'
  }

  return ''
}

/**
 * Apply global template to screen content
 * Finds the component definition and renders it with screen content injected
 */
function applyGlobalTemplate(
  screenContent: string,
  templateComponentName: string,
  routeManager: RouteManager
): string {
  // Remove $ prefix if present
  const componentName = templateComponentName.startsWith('$')
    ? templateComponentName.slice(1)
    : templateComponentName

  // Get component definitions from route manager
  const componentRoutes = routeManager.getRoutesByType('component')
  const componentDef = componentRoutes.find((route: { node: AstNode }) => {
    const props = route.node.props as { name?: string }
    return props.name === componentName
  })

  if (!componentDef) {
    console.warn(
      `Global template component not found: ${componentName}, rendering screen without template`
    )
    return screenContent
  }

  // Render the component template, replacing placeholders with screen content
  const componentNode = componentDef.node
  const templateHtml = renderComponentWithContent(componentNode, screenContent)

  return templateHtml
}

/**
 * Render component template with injected content
 * Looks for a special placeholder (e.g., heading with text "Content Here") to inject screen content
 */
function renderComponentWithContent(
  componentNode: AstNode,
  screenContent: string
): string {
  // Render the component's children (not the component itself, as it's just a definition)
  const children = componentNode.children || []
  const componentHtml = children.map((child) => renderNode(child)).join('\n')

  // Replace the placeholder with screen content
  // Look for the heading "Content Here" in the HTML
  const placeholderPattern =
    /<h[1-6][^>]*>Content Here<\/h[1-6]>|<h[1-6][^>]*>\s*Content Here\s*<\/h[1-6]>/gi
  const resultHtml = componentHtml.replace(placeholderPattern, screenContent)

  return resultHtml
}
