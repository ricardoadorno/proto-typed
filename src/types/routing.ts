/**
 * Route Manager Types
 * Defines the unified route system for screens and global elements
 */

import { AstNode } from './ast-node';

/**
 * Base route interface for all navigation elements
 */
export interface BaseRoute {
  /** Unique identifier for the route */
  id: string;
  /** Display name */
  name: string;
  /** The original AST node */
  node: AstNode;
  /** Route type discriminator */
  type: 'screen' | 'modal' | 'drawer' | 'component';
}

/**
 * Screen route - represents a full screen/page
 */
export interface ScreenRoute extends BaseRoute {
  type: 'screen';
  /** Whether this is the default/initial screen */
  isDefault: boolean;
  /** Screen index for navigation ordering */
  index: number;
}

/**
 * Global route - represents modals, drawers, and other overlay elements
 */
export interface GlobalRoute extends BaseRoute {
  type: 'modal' | 'drawer' | 'component';
  /** Whether this element should be initially visible */
  isVisible: boolean;
  /** Parent screen context if applicable */
  parentScreen?: string;
}

/**
 * Collection of all routes in the application
 */
export interface RouteCollection {
  /** Screen routes indexed by name */
  screens: Map<string, ScreenRoute>;
  /** Global routes (modals, drawers) indexed by name */
  globals: Map<string, GlobalRoute>;
  /** Default screen identifier */
  defaultScreen?: string;
  /** Currently active screen */
  currentScreen?: string;
}

/**
 * Route processing options
 */
export interface RouteProcessingOptions {
  /** Current active screen for rendering */
  currentScreen?: string;
  /** Default screen if none specified */
  defaultScreen?: string;
}

/**
 * Route rendering context
 */
export interface RouteRenderContext {
  /** Collection of all routes */
  routes: RouteCollection;
  /** Rendering mode */
  mode: 'preview' | 'document';
  /** Additional options */
  options?: RouteProcessingOptions;
}

/**
 * Simplified route information for client consumption
 */
export interface RouteInfo {
  /** Route identifier */
  id: string;
  /** Display name */
  name: string;
  /** Route type */
  type: 'screen' | 'modal' | 'drawer' | 'component';
  /** Whether this route is currently active/visible */
  isActive?: boolean;
  /** Whether this is the default screen */
  isDefault?: boolean;
  /** Screen index (for screens only) */
  index?: number;
}

/**
 * Unified route metadata for client context understanding
 */
export interface RouteMetadata {
  /** Available screens */
  screens: RouteInfo[];
  /** Available components */
  components: RouteInfo[];
  /** Available modals */
  modals: RouteInfo[];
  /** Available drawers */
  drawers: RouteInfo[];
  /** Default screen identifier */
  defaultScreen?: string;
  /** Currently active screen */
  currentScreen?: string;
  /** Total count of all routes */
  totalRoutes: number;
  /** Navigation history */
  navigationHistory: string[];
  /** Current position in navigation history */
  currentHistoryIndex: number;
  /** Whether back navigation is possible */
  canNavigateBack: boolean;
}

/**
 * Available routes information for navigation analysis
 */
export interface RouteContext {
  screens: string[];
  modals: string[];
  drawers: string[];
  components: string[];
}

/**
 * Navigation target analysis result
 */
export interface NavigationTarget {
  type: 'internal' | 'external' | 'action' | 'toggle' | 'back';
  value: string;
  isValid: boolean;
}