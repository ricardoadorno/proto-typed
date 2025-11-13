/**
 * Phase 4: Code Actions & Quick Fixes
 *
 * This module provides automated fixes for common diagnostic issues,
 * following LSP's code action pattern. Users can apply one-click fixes
 * directly from the editor.
 *
 * Inspired by:
 * - VS Code's Quick Fix system
 * - ESLint's --fix functionality
 * - Rust Analyzer's code actions
 * - TypeScript's quick fixes
 *
 * @example
 * ```typescript
 * const diagnostic: ProtoError = {
 *   code: 'PT-LINT-1001',
 *   message: 'Component "Header" is not defined',
 *   // ... other fields
 * }
 *
 * const actions = getCodeActions(diagnostic, documentUri)
 * // Returns quick fixes like "Create component Header"
 * ```
 */

import type { ProtoError } from '../../types/errors'
import type {
  CodeAction,
  CodeActionKind,
  WorkspaceEdit,
  TextEdit,
  Range,
  Position
} from '../../types/diagnostics'

// ============================================================
// Code Action Provider Interface
// ============================================================

/**
 * Context for code action generation
 */
export interface CodeActionContext {
  /**
   * The diagnostic that triggered the code action request
   */
  diagnostic: ProtoError

  /**
   * URI of the document
   */
  documentUri: string

  /**
   * Full document text (optional, for more sophisticated fixes)
   */
  documentText?: string

  /**
   * Additional context data (e.g., AST, symbols, etc.)
   */
  data?: any
}

/**
 * A provider that can generate code actions for specific diagnostics
 */
export interface CodeActionProvider {
  /**
   * Diagnostic codes that this provider handles
   */
  diagnosticCodes: string[]

  /**
   * Generate code actions for a diagnostic
   * @returns Array of code actions or empty array if none available
   */
  provideCodeActions(context: CodeActionContext): CodeAction[]
}

// ============================================================
// Code Action Registry
// ============================================================

/**
 * Global registry of code action providers
 */
const codeActionProviders: CodeActionProvider[] = []

/**
 * Register a code action provider
 */
export function registerCodeActionProvider(provider: CodeActionProvider): void {
  codeActionProviders.push(provider)
}

/**
 * Get all code actions for a diagnostic
 *
 * @param diagnostic - The diagnostic to fix
 * @param documentUri - URI of the document
 * @param documentText - Optional document text for context
 * @returns Array of available code actions
 */
export function getCodeActions(
  diagnostic: ProtoError,
  documentUri: string,
  documentText?: string
): CodeAction[] {
  if (!diagnostic.code) {
    return []
  }

  const context: CodeActionContext = {
    diagnostic,
    documentUri,
    documentText
  }

  const actions: CodeAction[] = []

  // Find providers that handle this diagnostic code
  for (const provider of codeActionProviders) {
    if (provider.diagnosticCodes.includes(diagnostic.code)) {
      try {
        const providerActions = provider.provideCodeActions(context)
        actions.push(...providerActions)
      } catch (error) {
        console.error(`Code action provider error for ${diagnostic.code}:`, error)
      }
    }
  }

  return actions
}

/**
 * Get all code actions for multiple diagnostics
 *
 * @param diagnostics - Array of diagnostics
 * @param documentUri - URI of the document
 * @param documentText - Optional document text
 * @returns Map of diagnostic to code actions
 */
export function getCodeActionsForDiagnostics(
  diagnostics: ProtoError[],
  documentUri: string,
  documentText?: string
): Map<ProtoError, CodeAction[]> {
  const map = new Map<ProtoError, CodeAction[]>()

  for (const diagnostic of diagnostics) {
    const actions = getCodeActions(diagnostic, documentUri, documentText)
    if (actions.length > 0) {
      map.set(diagnostic, actions)
    }
  }

  return map
}

// ============================================================
// Helper Functions for Creating Code Actions
// ============================================================

/**
 * Create a simple text edit
 */
export function createTextEdit(range: Range, newText: string): TextEdit {
  return { range, newText }
}

/**
 * Create a workspace edit with changes to a single document
 */
export function createWorkspaceEdit(
  documentUri: string,
  edits: TextEdit[]
): WorkspaceEdit {
  return {
    changes: {
      [documentUri]: edits
    }
  }
}

/**
 * Create a quick fix code action
 *
 * @param title - Title shown to user (e.g., "Add missing component")
 * @param diagnostic - The diagnostic this fixes
 * @param edit - The workspace edit to apply
 * @param isPreferred - Whether this is the preferred fix
 * @returns Complete code action
 */
export function createQuickFix(
  title: string,
  diagnostic: ProtoError,
  edit: WorkspaceEdit,
  isPreferred = false
): CodeAction {
  return {
    title,
    kind: 'quickfix' as CodeActionKind,
    diagnostics: [diagnostic as any],  // Cast to LSP Diagnostic
    edit,
    isPreferred
  }
}

/**
 * Create an insertion edit at a specific position
 */
export function createInsertionEdit(
  position: Position,
  text: string
): TextEdit {
  return {
    range: {
      start: position,
      end: position
    },
    newText: text
  }
}

/**
 * Create a deletion edit for a range
 */
export function createDeletionEdit(range: Range): TextEdit {
  return {
    range,
    newText: ''
  }
}

/**
 * Create a replacement edit
 */
export function createReplacementEdit(
  range: Range,
  newText: string
): TextEdit {
  return {
    range,
    newText
  }
}

// ============================================================
// Built-in Code Action Providers (Phase 4)
// ============================================================

/**
 * Provider for PT-LINT-1001: Undefined Component
 *
 * Provides quick fixes:
 * 1. Create component definition
 * 2. Fix component name typo (future)
 */
class UndefinedComponentProvider implements CodeActionProvider {
  diagnosticCodes = ['PT-LINT-1001']

  provideCodeActions(context: CodeActionContext): CodeAction[] {
    const { diagnostic, documentUri } = context
    const actions: CodeAction[] = []

    // Extract component name from message
    const match = diagnostic.message.match(/Component "([^"]+)" is not defined/)
    if (!match) {
      return actions
    }

    const componentName = match[1]

    // Quick Fix 1: Create component definition
    const insertPosition: Position = { line: 0, character: 0 }
    const componentTemplate = `component ${componentName}:\n  # TODO: Implement component\n\n`

    const edit = createWorkspaceEdit(documentUri, [
      createInsertionEdit(insertPosition, componentTemplate)
    ])

    actions.push(
      createQuickFix(
        `Create component "${componentName}"`,
        diagnostic,
        edit,
        true  // Preferred action
      )
    )

    return actions
  }
}

/**
 * Provider for PT-LINT-1002: Undefined Navigation Target
 *
 * Provides quick fixes:
 * 1. Create screen definition
 * 2. Create modal definition
 * 3. Create drawer definition
 */
class UndefinedNavigationProvider implements CodeActionProvider {
  diagnosticCodes = ['PT-LINT-1002']

  provideCodeActions(context: CodeActionContext): CodeAction[] {
    const { diagnostic, documentUri } = context
    const actions: CodeAction[] = []

    // Extract destination name from message
    const match = diagnostic.message.match(/Navigation target "([^"]+)" does not exist/)
    if (!match) {
      return actions
    }

    const targetName = match[1]
    const insertPosition: Position = { line: 0, character: 0 }

    // Quick Fix 1: Create screen
    const screenTemplate = `screen ${targetName}:\n  # TODO: Implement screen\n\n`
    const screenEdit = createWorkspaceEdit(documentUri, [
      createInsertionEdit(insertPosition, screenTemplate)
    ])
    actions.push(
      createQuickFix(
        `Create screen "${targetName}"`,
        diagnostic,
        screenEdit,
        true  // Preferred
      )
    )

    // Quick Fix 2: Create modal
    const modalTemplate = `modal ${targetName}:\n  # TODO: Implement modal\n\n`
    const modalEdit = createWorkspaceEdit(documentUri, [
      createInsertionEdit(insertPosition, modalTemplate)
    ])
    actions.push(
      createQuickFix(
        `Create modal "${targetName}"`,
        diagnostic,
        modalEdit
      )
    )

    // Quick Fix 3: Create drawer
    const drawerTemplate = `drawer ${targetName}:\n  # TODO: Implement drawer\n\n`
    const drawerEdit = createWorkspaceEdit(documentUri, [
      createInsertionEdit(insertPosition, drawerTemplate)
    ])
    actions.push(
      createQuickFix(
        `Create drawer "${targetName}"`,
        diagnostic,
        drawerEdit
      )
    )

    return actions
  }
}

/**
 * Provider for PT-LINT-2001 & PT-LINT-2002: Unused Definitions
 *
 * Provides quick fixes:
 * 1. Remove unused definition (requires range information)
 * 2. Add @unused comment to suppress warning
 */
class UnusedDefinitionProvider implements CodeActionProvider {
  diagnosticCodes = ['PT-LINT-2001', 'PT-LINT-2002']

  provideCodeActions(context: CodeActionContext): CodeAction[] {
    const { diagnostic, documentUri } = context
    const actions: CodeAction[] = []

    // If diagnostic has range, offer to delete
    if (diagnostic.range) {
      const deletionEdit = createWorkspaceEdit(documentUri, [
        createDeletionEdit(diagnostic.range)
      ])

      const isView = diagnostic.code === 'PT-LINT-2001'
      const entityType = isView ? 'view' : 'component'

      actions.push(
        createQuickFix(
          `Remove unused ${entityType}`,
          diagnostic,
          deletionEdit,
          false
        )
      )
    }

    // Quick Fix 2: Add suppression comment
    // (This would require AST position information for accurate placement)

    return actions
  }
}

// ============================================================
// Initialize Default Providers
// ============================================================

/**
 * Register all built-in code action providers
 * Call this during initialization
 */
export function registerDefaultCodeActionProviders(): void {
  registerCodeActionProvider(new UndefinedComponentProvider())
  registerCodeActionProvider(new UndefinedNavigationProvider())
  registerCodeActionProvider(new UnusedDefinitionProvider())
}

// Auto-register on module load
registerDefaultCodeActionProviders()
