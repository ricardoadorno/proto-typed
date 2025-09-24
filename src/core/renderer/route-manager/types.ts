/**
 * Route Manager Types
 * Defines the unified route system for screens and global elements
 */

import { AstNode } from '../../../types/astNode';

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