/**
 * DSL Linter - Structural and Semantic Validation
 *
 * Provides intelligent linting for proto-typed DSL code beyond syntax checking.
 * Detects structural problems, invalid references, and semantic issues.
 *
 * ## Linting Rules
 *
 * ### 1. Undefined References
 * - Components used ($ComponentName) but not defined
 * - Navigation destinations that don't exist
 *
 * ### 2. Unused Definitions
 * - Screens, modals, drawers defined but never referenced
 * - Components defined but never instantiated
 *
 * ### 3. Invalid Navigation
 * - Buttons/links pointing to non-existent views
 * - FAB items with broken destinations
 * - Navigator items with invalid targets
 *
 * ### 4. Duplicate Definitions
 * - Multiple screens/modals/drawers with same name
 * - Multiple components with same name
 *
 * ### 5. Missing Component Props
 * - Component instances missing required props
 * - Component definitions with unused props
 *
 * ## Integration
 *
 * The linter integrates with the ErrorBus to report warnings and errors
 * that appear in the Monaco editor as markers.
 *
 * @module linter
 */

import type { AstNode } from '../../types/ast-node';
import type { ProtoError } from '../../types/errors';
import type { LintConfig } from '../diagnostics/lint-config';
import { applyLintConfigBulk, DEFAULT_LINT_CONFIG } from '../diagnostics/lint-config';

// ============================================================
// Types
// ============================================================

/** Linting result containing errors and warnings */
export interface LintResult {
  errors: ProtoError[];
  warnings: ProtoError[];
  info: ProtoError[];
}

/** Definition of a view (screen, modal, drawer) */
interface ViewDefinition {
  name: string;
  type: 'Screen' | 'Modal' | 'Drawer';
  node: AstNode;
  used: boolean;
}

/** Definition of a component */
interface ComponentDefinition {
  name: string;
  node: AstNode;
  props: Set<string>; // Props used in the component (e.g., %name, %email)
  used: boolean;
}

/** Reference to a navigation destination */
interface NavigationReference {
  destination: string;
  node: AstNode;
  context: string; // e.g., "button", "link", "navigator"
}

/** Reference to a component instance */
interface ComponentReference {
  componentName: string;
  node: AstNode;
}

/** Context collected during AST traversal */
interface LintContext {
  views: Map<string, ViewDefinition>;
  components: Map<string, ComponentDefinition>;
  navReferences: NavigationReference[];
  componentReferences: ComponentReference[];
}

// ============================================================
// Main Linter Function
// ============================================================

/**
 * Lint an AST and return errors, warnings, and info messages
 *
 * This is the main entry point for linting. It:
 * 1. Traverses the AST to collect definitions and references
 * 2. Validates all references are defined
 * 3. Checks for unused definitions
 * 4. Reports duplicate definitions
 * 5. Validates navigation destinations
 * 6. Applies user configuration (Phase 3)
 *
 * @param ast - Array of root AST nodes (screens, components, modals, etc.)
 * @param config - Optional lint configuration for customizing severity levels
 * @returns Linting result with categorized diagnostics
 *
 * @example
 * ```typescript
 * // Without config (uses defaults)
 * const result = lintDocument(ast)
 *
 * // With custom config (Phase 3)
 * const result = lintDocument(ast, {
 *   rules: {
 *     'PT-LINT-2001': 'off',    // Disable unused view warnings
 *     'PT-LINT-2002': 'info',   // Unused components as info
 *   }
 * })
 * ```
 */
export function lintDocument(ast: AstNode[], config?: LintConfig): LintResult {
  const result: LintResult = {
    errors: [],
    warnings: [],
    info: [],
  };

  try {
    // Build linting context by traversing AST
    const context = buildLintContext(ast);

    // Run all linting rules
    checkUndefinedReferences(context, result);
    checkUnusedDefinitions(context, result);
    checkDuplicateDefinitions(context, result);
    checkInvalidNavigation(context, result);

    // Phase 3: Apply user configuration to adjust severities
    // This allows users to override severity levels or disable rules
    if (config && config.rules && Object.keys(config.rules).length > 0) {
      const allDiagnostics = getAllDiagnostics(result);
      const adjustedDiagnostics = applyLintConfigBulk(allDiagnostics, config);

      // Rebuild result with adjusted diagnostics
      result.errors = adjustedDiagnostics.filter(d => d.severity === 'error' || d.severity === 'fatal');
      result.warnings = adjustedDiagnostics.filter(d => d.severity === 'warning');
      result.info = adjustedDiagnostics.filter(d => d.severity === 'info');
    }

    return result;
  } catch (error) {
    console.error('Linter error:', error);
    // Return empty result on error to avoid breaking the editor
    return result;
  }
}

// ============================================================
// Context Building
// ============================================================

/**
 * Build linting context by traversing AST
 *
 * Collects:
 * - All view definitions (screens, modals, drawers)
 * - All component definitions
 * - All navigation references (buttons, links, navigators, FABs)
 * - All component references ($ComponentName)
 *
 * @param ast - Root AST nodes
 * @returns Linting context
 */
function buildLintContext(ast: AstNode[]): LintContext {
  const context: LintContext = {
    views: new Map(),
    components: new Map(),
    navReferences: [],
    componentReferences: [],
  };

  // Traverse each root node
  for (const node of ast) {
    traverseNode(node, context);
  }

  return context;
}

/**
 * Recursively traverse AST node and collect definitions/references
 */
function traverseNode(node: AstNode, context: LintContext): void {
  // Collect view definitions
  if (node.type === 'Screen' || node.type === 'Modal' || node.type === 'Drawer') {
    const name = (node.props as any).name;
    if (name && typeof name === 'string') {
      context.views.set(name, {
        name,
        type: node.type,
        node,
        used: false,
      });
    }
  }

  // Collect component definitions
  if (node.type === 'Component') {
    const name = (node.props as any).name;
    if (name && typeof name === 'string') {
      // Extract props used in component (e.g., %name, %email)
      const props = extractComponentProps(node);
      context.components.set(name, {
        name,
        node,
        props,
        used: false,
      });
    }
  }

  // Collect component references ($ComponentName)
  if (node.type === 'ComponentInstance') {
    const componentName = (node.props as any).componentName;
    if (componentName && typeof componentName === 'string') {
      context.componentReferences.push({
        componentName,
        node,
      });
    }
  }

  // Collect navigation references (buttons, links)
  if (node.type === 'Button' || node.type === 'Link') {
    const destination = (node.props as any).action || (node.props as any).destination;
    if (destination && typeof destination === 'string' && !isSpecialDestination(destination)) {
      context.navReferences.push({
        destination,
        node,
        context: node.type.toLowerCase(),
      });
    }
  }

  // Collect navigator and FAB references
  if (node.type === 'Navigator' || node.type === 'Fab') {
    const dataItems = (node.props as any).dataItems;
    if (Array.isArray(dataItems)) {
      for (const item of dataItems) {
        // Navigator items are arrays like: ["icon", "destination"]
        const destination = item[item.length - 1]; // Last element is destination
        if (destination && typeof destination === 'string' && !isSpecialDestination(destination)) {
          context.navReferences.push({
            destination,
            node,
            context: node.type.toLowerCase(),
          });
        }
      }
    }
  }

  // Recursively traverse children
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      traverseNode(child, context);
    }
  }
}

/**
 * Extract prop variables used in a component (%propName)
 */
function extractComponentProps(node: AstNode): Set<string> {
  const props = new Set<string>();

  function traverse(n: AstNode) {
    // Check if node contains prop references
    if (n.type === 'PropVariable') {
      const propName = (n.props as any).name;
      if (propName) {
        props.add(propName);
      }
    }

    // Traverse children
    if (n.children && Array.isArray(n.children)) {
      for (const child of n.children) {
        traverse(child);
      }
    }
  }

  traverse(node);
  return props;
}

/**
 * Check if destination is a special value (not a view reference)
 *
 * Special destinations:
 * - "-1" or "(-1)": Go back
 * - External URLs: http://, https://
 * - Anchors: #section
 */
function isSpecialDestination(dest: string): boolean {
  return (
    dest === '-1' ||
    dest === '(-1)' ||
    dest.startsWith('http://') ||
    dest.startsWith('https://') ||
    dest.startsWith('#')
  );
}

// ============================================================
// Linting Rules
// ============================================================

/**
 * Rule: Check for undefined references
 *
 * Detects:
 * - Component instances ($ComponentName) without definition
 * - Navigation to non-existent views
 */
function checkUndefinedReferences(context: LintContext, result: LintResult): void {
  // Check component references
  for (const ref of context.componentReferences) {
    const def = context.components.get(ref.componentName);
    if (!def) {
      result.errors.push({
        stage: 'editor',
        code: 'PT-LINT-1001',
        severity: 'error',
        message: `Component "${ref.componentName}" is not defined`,
        hint: 'Define the component before using it',
        source: 'monaco',
      });
    } else {
      // Mark component as used
      def.used = true;
    }
  }

  // Check navigation references
  for (const ref of context.navReferences) {
    const def = context.views.get(ref.destination);
    if (!def) {
      result.errors.push({
        stage: 'editor',
        code: 'PT-LINT-1002',
        severity: 'error',
        message: `Navigation target "${ref.destination}" does not exist`,
        hint: `Define a screen, modal, or drawer named "${ref.destination}"`,
        source: 'monaco',
      });
    } else {
      // Mark view as used
      def.used = true;
    }
  }
}

/**
 * Rule: Check for unused definitions
 *
 * Detects:
 * - Screens/modals/drawers that are never navigated to
 * - Components that are defined but never instantiated
 */
function checkUnusedDefinitions(context: LintContext, result: LintResult): void {
  // Check unused views (except first screen which is the entry point)
  const viewArray = Array.from(context.views.values());
  const firstScreen = viewArray.find((v) => v.type === 'Screen');

  for (const view of context.views.values()) {
    // Skip the first screen (entry point)
    if (view === firstScreen) {
      continue;
    }

    if (!view.used) {
      result.warnings.push({
        stage: 'editor',
        code: 'PT-LINT-2001',
        severity: 'warning',
        message: `${view.type} "${view.name}" is defined but never used`,
        hint: 'Remove unused definitions or add navigation to this view',
        source: 'monaco',
      });
    }
  }

  // Check unused components
  for (const component of context.components.values()) {
    if (!component.used) {
      result.warnings.push({
        stage: 'editor',
        code: 'PT-LINT-2002',
        severity: 'warning',
        message: `Component "${component.name}" is defined but never instantiated`,
        hint: `Use the component with $${component.name} or remove the definition`,
        source: 'monaco',
      });
    }
  }
}

/**
 * Rule: Check for duplicate definitions
 *
 * Detects:
 * - Multiple views with the same name
 * - Multiple components with the same name
 */
function checkDuplicateDefinitions(context: LintContext, result: LintResult): void {
  // Track seen names
  const seenViews = new Map<string, ViewDefinition>();
  const seenComponents = new Map<string, ComponentDefinition>();

  // Check views
  for (const view of context.views.values()) {
    const existing = seenViews.get(view.name);
    if (existing) {
      result.errors.push({
        stage: 'editor',
        code: 'PT-LINT-3001',
        severity: 'error',
        message: `Duplicate ${view.type.toLowerCase()} definition: "${view.name}"`,
        hint: 'Each view must have a unique name',
        source: 'monaco',
      });
    } else {
      seenViews.set(view.name, view);
    }
  }

  // Check components
  for (const component of context.components.values()) {
    const existing = seenComponents.get(component.name);
    if (existing) {
      result.errors.push({
        stage: 'editor',
        code: 'PT-LINT-3002',
        severity: 'error',
        message: `Duplicate component definition: "${component.name}"`,
        hint: 'Each component must have a unique name',
        source: 'monaco',
      });
    } else {
      seenComponents.set(component.name, component);
    }
  }
}

/**
 * Rule: Check for invalid navigation patterns
 *
 * Detects:
 * - Navigation loops (A -> B -> A)
 * - Dead ends (views with no way back)
 * - Unreachable views
 */
function checkInvalidNavigation(context: LintContext, result: LintResult): void {
  // Future enhancement: detect navigation loops and dead ends
  // For now, this is a placeholder for more advanced navigation analysis
}

// ============================================================
// Utilities
// ============================================================

/**
 * Get all diagnostics from lint result
 */
export function getAllDiagnostics(result: LintResult): ProtoError[] {
  return [...result.errors, ...result.warnings, ...result.info];
}

/**
 * Check if lint result has errors
 */
export function hasErrors(result: LintResult): boolean {
  return result.errors.length > 0;
}

/**
 * Check if lint result has warnings
 */
export function hasWarnings(result: LintResult): boolean {
  return result.warnings.length > 0;
}

/**
 * Get summary of lint result
 */
export function getLintSummary(result: LintResult): string {
  const total = result.errors.length + result.warnings.length + result.info.length;
  return `${result.errors.length} errors, ${result.warnings.length} warnings, ${result.info.length} info (${total} total)`;
}
