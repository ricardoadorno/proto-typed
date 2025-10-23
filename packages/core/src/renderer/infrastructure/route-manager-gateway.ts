/**
 * Route Manager Gateway
 * Simplified API gateway for SPA clients to interact with the Route Manager
 */

import { AstNode } from '../../types/ast-node'
import {
  RouteCollection,
  RouteMetadata,
  RouteProcessingOptions,
  RouteRenderContext,
} from '../../types/routing'
import {
  RouteManager,
  routeManager as defaultRouteManager,
} from '../core/route-manager'
import type { MouseEvent } from 'react'

export interface NavigationHandlers {
  onScreenNavigation: (screenName: string) => void
  onBackNavigation?: () => void
}

export interface NavigationState {
  history: string[]
  currentIndex: number
  currentScreen: string | null
  canGoBack: boolean
}

/**
 * Route Manager Gateway - Simple API for SPA clients
 * Provides a clean interface to interact with the underlying Route Manager
 */
export class RouteManagerGateway {
  constructor(private readonly routeManager: RouteManager) {}

  private handlers: NavigationHandlers | null = null
  // Cached click handler to avoid recreating the function on every render
  private clickHandler?: (e: MouseEvent) => void

  // ========================================
  // Core API Methods
  // ========================================

  /**
   * Initialize the route system with AST nodes
   */
  initialize(
    ast: AstNode | AstNode[],
    options: RouteProcessingOptions = {}
  ): RouteCollection {
    return this.routeManager.processRoutes(ast, options)
  }

  /**
   * Set navigation event handlers
   */
  setHandlers(handlers: NavigationHandlers): void {
    this.handlers = handlers
  }

  /**
   * Initialize navigation with the current screen
   */
  initializeNavigation(currentScreen: string): void {
    this.routeManager.setInitialScreen(currentScreen)
  }

  // ========================================
  // Route Information API
  // ========================================

  /**
   * Get complete route metadata
   */
  getRouteMetadata(): RouteMetadata {
    return this.routeManager.getMetadata()
  }

  /**
   * Get all routes collection
   */
  getRoutes(): RouteCollection {
    return this.routeManager.getRoutes()
  }

  /**
   * Get specific screen route
   */
  getScreenRoute(name: string) {
    return this.routeManager.getScreenRoute(name)
  }

  /**
   * Get specific global route (modal/drawer/component)
   */
  getGlobalRoute(name: string) {
    return this.routeManager.getGlobalRoute(name)
  }

  /**
   * Get routes by type
   */
  getRoutesByType(type: 'modal' | 'drawer' | 'component') {
    return this.routeManager.getRoutesByType(type)
  }

  /**
   * Create render context for adapters
   */
  createRenderContext(
    mode: 'preview' | 'document',
    options?: RouteProcessingOptions
  ): RouteRenderContext {
    return this.routeManager.createRenderContext(mode, options)
  }

  // ========================================
  // Navigation API
  // ========================================

  /**
   * Navigate to a specific screen
   */
  navigateToScreen(screenName: string): boolean {
    const currentScreen = this.routeManager.getCurrentScreen()

    if (currentScreen !== screenName) {
      // Check if the screen exists before navigating
      const screenRoute = this.routeManager.getScreenRoute(screenName)
      if (!screenRoute) {
        console.warn(`Screen "${screenName}" does not exist`)
        return false
      }

      // First set the current screen, then add to history
      this.routeManager.setCurrentScreen(screenName)
      this.routeManager.addToHistory(screenName)

      if (this.handlers?.onScreenNavigation) {
        this.handlers.onScreenNavigation(screenName)
        return true
      }
    }

    return false
  }

  /**
   * Navigate back to previous screen
   */
  navigateBack(): boolean {
    const previousScreen = this.routeManager.navigateBack()

    if (previousScreen) {
      // Update the route manager's current screen state
      this.routeManager.setCurrentScreen(previousScreen)

      if (this.handlers?.onScreenNavigation) {
        this.handlers.onScreenNavigation(previousScreen)
        return true
      }
    }

    if (this.handlers?.onBackNavigation) {
      this.handlers.onBackNavigation()
      return true
    }

    return false
  }

  /**
   * Get current navigation state
   */
  getNavigationState(): NavigationState {
    return {
      history: this.routeManager.getNavigationHistory(),
      currentIndex: this.routeManager.getCurrentScreenIndex(),
      currentScreen: this.routeManager.getCurrentScreen(),
      canGoBack: this.routeManager.getCurrentScreenIndex() > 0,
    }
  }

  /**
   * Reset navigation history
   */
  resetNavigation(): void {
    this.routeManager.resetNavigationHistory()
  }

  // ========================================
  // DOM Interaction API
  // ========================================

  /**
   * Toggle modal visibility by name
   */
  toggleModal(elementName: string): boolean {
    const modal = document.getElementById(`modal-${elementName}`)
    if (!modal) return false

    const isHidden = modal.classList.contains('hidden')

    if (isHidden) {
      modal.classList.remove('hidden')
      this.setupModalBackdropHandler(modal)
    } else {
      modal.classList.add('hidden')
    }

    return true
  }

  /**
   * Toggle drawer visibility by name
   */
  toggleDrawer(elementName: string): boolean {
    const drawer = document.getElementById(`drawer-${elementName}`)
    if (!drawer) return false

    const isHidden = drawer.classList.contains('hidden')
    const content = drawer.querySelector('.drawer') // Changed from '.drawer-content' to '.drawer'

    if (isHidden) {
      drawer.classList.remove('hidden')
      if (content) {
        content.classList.add('translate-x-0')
        content.classList.remove('-translate-x-full')
      }
      this.setupDrawerOverlayHandler(drawer, content as HTMLElement)
    } else {
      if (content) {
        content.classList.remove('translate-x-0')
        content.classList.add('-translate-x-full')
      }
      setTimeout(() => drawer.classList.add('hidden'), 300)
    }

    return true
  }

  /**
   * Handle navigation click events from DOM
   */
  handleNavigationClick(e: MouseEvent): void {
    const navElement = (e.target as HTMLElement).closest('[data-nav]')
    if (!navElement) return

    e.preventDefault()
    e.stopPropagation()

    const navTarget = navElement.getAttribute('data-nav')
    const navType = navElement.getAttribute('data-nav-type')

    if (!navTarget) return

    switch (navType) {
      case 'internal':
        this.navigateToScreen(navTarget)
        break
      case 'toggle':
        this.toggleElement(navTarget)
        break
      case 'back':
        this.navigateBack()
        break
      default:
        this.toggleElement(navTarget)
        break
    }
  }

  /**
   * Create a click handler function for React components
   */
  createClickHandler(): (e: MouseEvent) => void {
    if (!this.clickHandler) {
      // Store a stable reference so React can optimize and we don't attach new listeners unnecessarily
      this.clickHandler = (e: MouseEvent) => this.handleNavigationClick(e)
    }
    return this.clickHandler
  }

  // ========================================
  // Route Context API
  // ========================================

  /**
   * Get route context for navigation analysis
   */
  getRouteContext() {
    return this.routeManager.getRouteContext()
  }

  /**
   * Set route context
   */
  setRouteContext(context: unknown) {
    this.routeManager.setRouteContext(context)
  }

  /**
   * Clear route context
   */
  clearRouteContext() {
    this.routeManager.clearRouteContext()
  }

  // ========================================
  // Utility API
  // ========================================

  /**
   * Check if a screen exists
   */
  hasScreen(screenName: string): boolean {
    return this.routeManager.getScreenRoute(screenName) !== undefined
  }

  /**
   * Check if a global element exists
   */
  hasGlobalElement(elementName: string): boolean {
    return this.routeManager.getGlobalRoute(elementName) !== undefined
  }

  /**
   * Get all screen names
   */
  getScreenNames(): string[] {
    return this.routeManager.getScreenRoutes().map((route) => route.name)
  }

  /**
   * Get all modal names
   */
  getModalNames(): string[] {
    return this.routeManager.getRoutesByType('modal').map((route) => route.name)
  }

  /**
   * Get all drawer names
   */
  getDrawerNames(): string[] {
    return this.routeManager
      .getRoutesByType('drawer')
      .map((route) => route.name)
  }

  /**
   * Get all component names
   */
  getComponentNames(): string[] {
    return this.routeManager
      .getRoutesByType('component')
      .map((route) => route.name)
  }

  // ========================================
  // Private Helper Methods
  // ========================================

  private toggleElement(elementName: string): void {
    // Try modal first, then drawer
    if (!this.toggleModal(elementName)) {
      this.toggleDrawer(elementName)
    }
  }

  private setupModalBackdropHandler(modal: HTMLElement): void {
    const backdrop = modal.querySelector('.modal-backdrop')
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          modal.classList.add('hidden')
        }
      })
    }
  }

  private setupDrawerOverlayHandler(
    drawer: HTMLElement,
    content: HTMLElement | null
  ): void {
    const overlay = drawer.querySelector('.drawer-overlay')
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          if (content) {
            content.classList.remove('translate-x-0')
            content.classList.add('-translate-x-full')
          }
          setTimeout(() => drawer.classList.add('hidden'), 300)
        }
      })
    }
  }
}

export const createRouteManagerGateway = (routeManager?: RouteManager) =>
  new RouteManagerGateway(routeManager ?? new RouteManager())

// Create a singleton instance for legacy/global usage
export const routeManagerGateway = new RouteManagerGateway(defaultRouteManager)
