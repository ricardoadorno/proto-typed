/**
 * Route Manager
 * Central service for managing all application routes (screens, modals, drawers)
 */

import { AstNode, ViewProps, ComponentProps } from '../../types/ast-node'
import {
  RouteCollection,
  ScreenRoute,
  GlobalRoute,
  RouteProcessingOptions,
  RouteRenderContext,
  RouteMetadata,
  RouteInfo,
  RouteContext,
} from '../../types/routing'

/**
 * Central route management service
 */
export class RouteManager {
  private routes: RouteCollection
  private navigationHistory: string[] = []
  private currentHistoryIndex: number = -1
  private currentRouteContext: RouteContext | undefined = undefined

  constructor() {
    this.routes = {
      screens: new Map(),
      globals: new Map(),
    }
  }

  /**
   * Recursively find all nodes of a specific type in the AST
   */
  private findNodesByType(nodes: AstNode[], nodeType: string): AstNode[] {
    const found: AstNode[] = []

    for (const node of nodes) {
      if (node.type === nodeType) {
        found.push(node)
      }

      // Recursively search in children
      if (node.children && node.children.length > 0) {
        found.push(...this.findNodesByType(node.children, nodeType))
      }
    }

    return found
  }

  /**
   * Process AST nodes and organize them into a unified route collection
   */
  processRoutes(
    ast: AstNode | AstNode[],
    options: RouteProcessingOptions = {}
  ): RouteCollection {
    const nodes = Array.isArray(ast) ? ast : [ast]

    // Store current screen IDs to check if structure changed
    const previousScreenIds = new Set(this.routes.screens.keys())

    // Reset routes
    this.routes = {
      screens: new Map(),
      globals: new Map(),
    }

    // Process each node type
    this.processScreenRoutes(nodes, options)
    this.processGlobalRoutes(nodes)
    this.processComponentRoutes(nodes)

    // Set current screen from options or default to first screen
    this.routes.currentScreen =
      options.currentScreen || this.routes.defaultScreen

    // Check if screen structure has changed
    const newScreenIds = new Set(this.routes.screens.keys())
    const screenStructureChanged =
      previousScreenIds.size !== newScreenIds.size ||
      !Array.from(previousScreenIds).every((id) => newScreenIds.has(id))

    // Reset navigation history only if screen structure changed or if history is empty
    if (screenStructureChanged || this.navigationHistory.length === 0) {
      this.resetNavigationHistory()
      if (this.routes.currentScreen) {
        this.initializeNavigationHistory(this.routes.currentScreen)
      }
    } else if (this.routes.currentScreen) {
      // Screen structure didn't change, just ensure current screen is set correctly
      // But don't reset the navigation history
      this.routes.currentScreen =
        options.currentScreen || this.routes.defaultScreen
    }

    return this.routes
  }

  /**
   * Get the current route collection
   */
  getRoutes(): RouteCollection {
    return this.routes
  }

  /**
   * Get a specific screen route
   */
  getScreenRoute(name: string): ScreenRoute | undefined {
    return this.routes.screens.get(name)
  }

  /**
   * Get a specific global route
   */
  getGlobalRoute(name: string): GlobalRoute | undefined {
    return this.routes.globals.get(name)
  }

  /**
   * Get all screen routes as array
   */
  getScreenRoutes(): ScreenRoute[] {
    return Array.from(this.routes.screens.values())
  }

  /**
   * Get all global routes as array
   */
  getGlobalRoutes(): GlobalRoute[] {
    return Array.from(this.routes.globals.values())
  }

  /**
   * Get routes by type
   */
  getRoutesByType(type: 'modal' | 'drawer' | 'component'): GlobalRoute[] {
    return this.getGlobalRoutes().filter((route) => route.type === type)
  }

  /**
   * Get route context for navigation analysis
   */
  getRouteContext(): RouteContext {
    return {
      screens: Array.from(this.routes.screens.keys()),
      modals: this.getRoutesByType('modal').map((route) => route.name),
      drawers: this.getRoutesByType('drawer').map((route) => route.name),
      components: this.getRoutesByType('component').map((route) => route.name),
    }
  }

  /**
   * Create render context for adapters
   */
  createRenderContext(
    mode: 'preview' | 'document',
    options?: RouteProcessingOptions
  ): RouteRenderContext {
    return {
      routes: this.routes,
      mode,
      options,
    }
  }

  /**
   * Get unified route metadata for client consumption
   * Provides a simplified view of all available routes organized by type
   */
  getMetadata(): RouteMetadata {
    const screens: RouteInfo[] = Array.from(this.routes.screens.values()).map(
      (screen) => ({
        id: screen.id,
        name: screen.name,
        type: screen.type,
        isActive: screen.name === this.routes.currentScreen,
        isDefault: screen.isDefault,
        index: screen.index,
      })
    )

    const components: RouteInfo[] = this.getRoutesByType('component').map(
      (component) => ({
        id: component.id,
        name: component.name,
        type: component.type,
        isActive: false, // Components are not directly active
      })
    )

    const modals: RouteInfo[] = this.getRoutesByType('modal').map((modal) => ({
      id: modal.id,
      name: modal.name,
      type: modal.type,
      isActive: modal.isVisible,
    }))

    const drawers: RouteInfo[] = this.getRoutesByType('drawer').map(
      (drawer) => ({
        id: drawer.id,
        name: drawer.name,
        type: drawer.type,
        isActive: drawer.isVisible,
      })
    )

    const totalRoutes =
      screens.length + components.length + modals.length + drawers.length

    return {
      screens,
      components,
      modals,
      drawers,
      defaultScreen: this.routes.defaultScreen,
      currentScreen: this.routes.currentScreen,
      totalRoutes,
      navigationHistory: [...this.navigationHistory],
      currentHistoryIndex: this.currentHistoryIndex,
      canNavigateBack: this.currentHistoryIndex > 0,
    }
  }

  /**
   * Navigation History Management
   */

  /**
   * Add a screen to navigation history
   */
  addToHistory(screenName: string): void {
    // Remove any screens after current position (when navigating after going back)
    this.navigationHistory = this.navigationHistory.slice(
      0,
      this.currentHistoryIndex + 1
    )

    // Don't add the same screen consecutively
    if (this.navigationHistory[this.currentHistoryIndex] !== screenName) {
      this.navigationHistory.push(screenName)
      this.currentHistoryIndex++
    }
  }

  /**
   * Initialize navigation history with the current screen (for initial page load)
   */
  private initializeNavigationHistory(screenName: string): void {
    if (this.navigationHistory.length === 0) {
      this.navigationHistory.push(screenName)
      this.currentHistoryIndex = 0
    }
  }

  /**
   * Set the initial screen and initialize navigation history
   * This should be called when the app first loads
   */
  setInitialScreen(screenName: string): void {
    this.resetNavigationHistory()
    this.initializeNavigationHistory(screenName)
    this.routes.currentScreen = screenName
  }

  /**
   * Set the current screen (used during navigation)
   */
  setCurrentScreen(screenName: string): void {
    this.routes.currentScreen = screenName

    // Ensure navigation history is synchronized with current screen
    // Only update history if this screen is not already the current item
    if (
      this.currentHistoryIndex < 0 ||
      this.navigationHistory[this.currentHistoryIndex] !== screenName
    ) {
      // Check if screen exists in history
      const existingIndex = this.navigationHistory.findIndex(
        (screen) => screen === screenName
      )
      if (existingIndex >= 0) {
        // Screen exists in history, jump to it
        this.currentHistoryIndex = existingIndex
      }
      // Don't automatically add to history here, let addToHistory be called explicitly
    }
  }

  /**
   * Navigate back to previous screen
   * Returns the previous screen name or null if no history
   */
  navigateBack(): string | null {
    if (this.currentHistoryIndex > 0) {
      this.currentHistoryIndex--
      return this.navigationHistory[this.currentHistoryIndex]
    }
    return null
  }

  /**
   * Get current screen from history
   */
  getCurrentScreen(): string | null {
    // Prefer the explicitly set currentScreen, fallback to history
    if (this.routes.currentScreen) {
      return this.routes.currentScreen
    }
    return this.currentHistoryIndex >= 0
      ? this.navigationHistory[this.currentHistoryIndex]
      : null
  }

  /**
   * Get current screen index
   */
  getCurrentScreenIndex(): number {
    return this.currentHistoryIndex
  }

  /**
   * Get full navigation history
   */
  getNavigationHistory(): string[] {
    return [...this.navigationHistory]
  }

  /**
   * Reset navigation history
   */
  resetNavigationHistory(): void {
    this.navigationHistory = []
    this.currentHistoryIndex = -1
  }

  /**
   * Route Context Management
   */

  /**
   * Set the current route context for rendering
   */
  setRouteContext(context: RouteContext): void {
    this.currentRouteContext = context
  }

  /**
   * Get the current route context
   */
  getCurrentRouteContext(): RouteContext | undefined {
    return this.currentRouteContext
  }

  /**
   * Clear the route context
   */
  clearRouteContext(): void {
    this.currentRouteContext = undefined
  }

  /**
   * Process screen nodes into screen routes
   */
  private processScreenRoutes(
    nodes: AstNode[],
    options: RouteProcessingOptions
  ): void {
    const screenNodes = this.findNodesByType(nodes, 'Screen')

    screenNodes.forEach((screen, index) => {
      const props = screen.props as ViewProps
      if (!props?.name) return // Skip unnamed screens

      const screenName = props.name
      const isDefault = index === 0 || screenName === options.defaultScreen

      const screenRoute: ScreenRoute = {
        id: screenName,
        name: screenName,
        node: screen,
        type: 'screen',
        isDefault,
        index,
      }

      this.routes.screens.set(screenName, screenRoute)

      // Set default screen
      if (isDefault && !this.routes.defaultScreen) {
        this.routes.defaultScreen = screenName
      }
    })
  }

  /**
   * Process global element nodes (modals, drawers) into global routes
   */
  private processGlobalRoutes(nodes: AstNode[]): void {
    const modalNodes = this.findNodesByType(nodes, 'Modal')
    const drawerNodes = this.findNodesByType(nodes, 'Drawer')
    const globalNodes = [...modalNodes, ...drawerNodes]

    globalNodes.forEach((globalNode) => {
      const props = globalNode.props as ViewProps
      if (!props?.name) return // Skip unnamed global elements

      const globalName = props.name

      const globalRoute: GlobalRoute = {
        id: globalName,
        name: globalName,
        node: globalNode,
        type: globalNode.type.toLowerCase() as 'modal' | 'drawer',
        isVisible: false, // Global elements are hidden by default
      }

      this.routes.globals.set(globalName, globalRoute)
    })
  }

  /**
   * Process component nodes into global routes (components are treated as global reusable elements)
   */
  private processComponentRoutes(nodes: AstNode[]): void {
    const componentNodes = this.findNodesByType(nodes, 'Component')

    componentNodes.forEach((componentNode) => {
      const props = componentNode.props as ComponentProps
      if (!props?.name) return // Skip unnamed components

      const componentName = props.name

      const componentRoute: GlobalRoute = {
        id: componentName,
        name: componentName,
        node: componentNode,
        type: 'component',
        isVisible: false, // Components are not directly visible, they're instantiated
      }

      this.routes.globals.set(componentName, componentRoute)
    })
  }
}

/**
 * Global route manager instance
 */
export const routeManager = new RouteManager()
