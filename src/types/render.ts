/**
 * Render-related types and interfaces for the renderer pipeline
 * Consolidates all rendering options, configurations, and data structures
 */
import { AstNode } from './astNode';
import { RouteMetadata } from '../core/renderer/route-manager/types';

/**
 * Options for rendering AST to HTML
 */
export interface RenderOptions {
  currentScreen?: string | null;
  /** Route metadata context for client understanding */
  routeMetadata?: RouteMetadata;
  /** Available route targets for navigation */
  availableRoutes?: {
    screens: string[];
    modals: string[];
    drawers: string[];
    components: string[];
  };
}

/**
 * Processed AST data structure for rendering
 */
export interface ProcessedAstData {
  screens: AstNode[];
  components: AstNode[];
  modals: AstNode[];
  drawers: AstNode[];
}

/**
 * Screen rendering configuration
 */
export interface ScreenRenderConfig {
  screen: AstNode;
  index: number;
  currentScreen?: string | null;
}

/**
 * Node renderer function type
 */
export type NodeRenderer = (node: AstNode, context?: string) => string;

/**
 * Navigation target type
 */
export type NavigationType = 'internal' | 'external' | 'toggle' | 'back' | 'action';

/**
 * Element visibility state for modals and drawers
 */
export interface ElementState {
  id: string;
  type: 'modal' | 'drawer';
  isVisible: boolean;
}

/**
 * Render context for maintaining state during rendering
 */
export interface RenderContext {
  currentScreen?: string | null;
  elementStates: ElementState[];
  navigationHistory: string[];
}
