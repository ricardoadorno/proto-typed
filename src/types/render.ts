/**
 * Render-related types and interfaces for the renderer pipeline
 * Consolidates all rendering options, configurations, and data structures
 */
import { AstNode } from './astNode';

/**
 * Options for rendering AST to HTML
 */
export interface RenderOptions {
  currentScreen?: string | null;
}

/**
 * Processed AST data structure for rendering
 */
export interface ProcessedAstData {
  screens: AstNode[];
  components: AstNode[];
  globalModals: AstNode[];
  globalDrawers: AstNode[];
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
 * Navigation handler options for click events
 */
export interface NavigationHandlerOptions {
  onInternalNavigate?: (screenName: string) => void;
  onToggle?: (elementName: string) => void;
  onBack?: () => void;
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
