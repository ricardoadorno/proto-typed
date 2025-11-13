/**
 * ErrorBus V2 - Backward Compatible Diagnostic Management
 *
 * This is an enhanced version of ErrorBus that:
 * 1. Maintains 100% backward compatibility with existing ErrorBus API
 * 2. Internally uses DiagnosticStore for document-scoped storage
 * 3. Adds new document-scoped methods for modern usage
 * 4. Provides migration path from global to document-scoped diagnostics
 *
 * **Migration Strategy:**
 * - Old API (emit, bulk, subscribe) works exactly as before
 * - New API (publishDiagnostics, subscribeToDocument) available
 * - Internal storage migrated to document-scoped model
 * - Default URI used for legacy global operations
 *
 * **Phase 2 Goals:**
 * - Enable multi-file editing
 * - Align with LSP publishDiagnostics pattern
 * - No breaking changes to existing code
 */

import type { ProtoError, Stage } from '../types/errors'
import { DiagnosticStore } from './diagnostics/diagnostic-store'

// ============================================================
// Constants
// ============================================================

/**
 * Default URI for legacy global error operations.
 * Used when no URI is specified (backward compatibility).
 */
const DEFAULT_URI = 'file:///default.dsl'

// ============================================================
// ErrorBus V2 (Singleton)
// ============================================================

/**
 * Enhanced ErrorBus with document-scoped diagnostics.
 *
 * **Backward Compatible API (V1):**
 * - `emit(error)` - Add single error (global)
 * - `bulk(errors)` - Add multiple errors (global)
 * - `clear(stage?)` - Clear errors (global)
 * - `subscribe(callback)` - Subscribe to errors (global)
 * - `getAll()` - Get all errors (global)
 * - `getByStage(stage)` - Get errors by stage (global)
 *
 * **New Document-Scoped API (V2):**
 * - `publishDiagnostics(uri, diagnostics)` - LSP-style publish
 * - `getDiagnostics(uri)` - Get diagnostics for document
 * - `clearDiagnostics(uri)` - Clear diagnostics for document
 * - `subscribeToDocument(uri, callback)` - Subscribe to document
 * - `getAllDocuments()` - Get all document URIs
 */
export class ErrorBus {
  private static instance: ErrorBus
  private store: DiagnosticStore

  // ==========================================================
  // SINGLETON PATTERN
  // ==========================================================

  private constructor() {
    this.store = DiagnosticStore.get()
  }

  static get(): ErrorBus {
    if (!ErrorBus.instance) {
      ErrorBus.instance = new ErrorBus()
    }
    return ErrorBus.instance
  }

  // ==========================================================
  // V1 API: BACKWARD COMPATIBLE (Global Operations)
  // ==========================================================

  /**
   * Emit a single error (V1 API - backward compatible).
   *
   * Uses default URI for global error storage.
   *
   * @param err - The error to add
   * @deprecated Use publishDiagnostics(uri, diagnostics) for document-scoped errors
   */
  emit(err: ProtoError): void {
    const current = this.store.getDiagnostics(DEFAULT_URI)
    this.store.publishDiagnostics(DEFAULT_URI, [...current, err])
  }

  /**
   * Add multiple errors at once (V1 API - backward compatible).
   *
   * Uses default URI for global error storage.
   *
   * @param errs - Array of errors to add
   * @deprecated Use publishDiagnostics(uri, diagnostics) for document-scoped errors
   */
  bulk(errs: ProtoError[]): void {
    const current = this.store.getDiagnostics(DEFAULT_URI)
    this.store.publishDiagnostics(DEFAULT_URI, [...current, ...errs])
  }

  /**
   * Clear errors (V1 API - backward compatible).
   *
   * @param stage - Optional stage to filter by
   * @deprecated Use clearDiagnostics(uri) for document-scoped clearing
   */
  clear(stage?: Stage): void {
    if (stage) {
      // Filter by stage
      const current = this.store.getDiagnostics(DEFAULT_URI)
      const filtered = current.filter(e => e.stage !== stage)
      this.store.publishDiagnostics(DEFAULT_URI, filtered)
    } else {
      // Clear all
      this.store.clearDiagnostics(DEFAULT_URI)
    }
  }

  /**
   * Get all errors (V1 API - backward compatible).
   *
   * Returns errors from default URI (global storage).
   *
   * @returns Array of all errors
   * @deprecated Use getDiagnostics(uri) for document-scoped retrieval
   */
  getAll(): ProtoError[] {
    return this.store.getDiagnostics(DEFAULT_URI)
  }

  /**
   * Get errors by stage (V1 API - backward compatible).
   *
   * @param stage - The stage to filter by
   * @returns Array of errors for that stage
   * @deprecated Use getDiagnostics(uri) + filter for document-scoped filtering
   */
  getByStage(stage: Stage): ProtoError[] {
    const all = this.store.getDiagnostics(DEFAULT_URI)
    return all.filter(e => e.stage === stage)
  }

  /**
   * Check if there are fatal errors (V1 API - backward compatible).
   *
   * @returns True if any error has fatal severity
   * @deprecated Use getDiagnostics(uri) + check for document-scoped checking
   */
  hasFatalErrors(): boolean {
    const all = this.store.getDiagnostics(DEFAULT_URI)
    return all.some(e => e.severity === 'fatal')
  }

  /**
   * Get total error count (V1 API - backward compatible).
   *
   * @returns Number of errors
   * @deprecated Use getCount(uri) for document-scoped counting
   */
  count(): number {
    return this.store.getCount(DEFAULT_URI)
  }

  /**
   * Subscribe to error changes (V1 API - backward compatible).
   *
   * Callback is immediately called with current errors.
   *
   * @param cb - Callback function
   * @returns Unsubscribe function
   * @deprecated Use subscribeToDocument(uri, callback) for document-scoped subscriptions
   */
  subscribe(cb: (errors: ProtoError[]) => void): () => void {
    return this.store.subscribe(DEFAULT_URI, (_uri, diagnostics) => {
      cb(diagnostics)
    })
  }

  // ==========================================================
  // V2 API: DOCUMENT-SCOPED (New, Recommended)
  // ==========================================================

  /**
   * Publish diagnostics for a document (V2 API - LSP-style).
   *
   * This is the recommended API for new code.
   * Follows LSP's textDocument/publishDiagnostics pattern.
   *
   * @param uri - Document identifier (e.g., 'file:///path/to/file.dsl')
   * @param diagnostics - Array of diagnostics (empty to clear)
   * @param version - Optional document version
   *
   * @example
   * ```typescript
   * errorBus.publishDiagnostics('file:///main.dsl', [
   *   { code: 'PT-LINT-1001', severity: 'error', message: '...', ... }
   * ])
   * ```
   */
  publishDiagnostics(uri: string, diagnostics: ProtoError[], version?: number): void {
    this.store.publishDiagnostics(uri, diagnostics, version)
  }

  /**
   * Get diagnostics for a specific document (V2 API).
   *
   * @param uri - Document identifier
   * @returns Array of diagnostics for that document
   */
  getDiagnostics(uri: string): ProtoError[] {
    return this.store.getDiagnostics(uri)
  }

  /**
   * Clear diagnostics for a specific document (V2 API).
   *
   * @param uri - Document identifier
   */
  clearDiagnostics(uri: string): void {
    this.store.clearDiagnostics(uri)
  }

  /**
   * Subscribe to diagnostics for a specific document (V2 API).
   *
   * @param uri - Document identifier
   * @param callback - Called when diagnostics change
   * @returns Unsubscribe function
   */
  subscribeToDocument(uri: string, callback: (uri: string, diagnostics: ProtoError[]) => void): () => void {
    return this.store.subscribe(uri, callback)
  }

  /**
   * Subscribe to all diagnostic changes across all documents (V2 API).
   *
   * @param callback - Called when any diagnostics change
   * @returns Unsubscribe function
   */
  subscribeAll(callback: (allDiagnostics: Map<string, ProtoError[]>) => void): () => void {
    return this.store.subscribeAll(callback)
  }

  /**
   * Get all document URIs that have diagnostics (V2 API).
   *
   * @returns Array of URIs
   */
  getAllDocuments(): string[] {
    const all = this.store.getAllDiagnostics()
    return Array.from(all.keys()).filter(uri => uri !== DEFAULT_URI)
  }

  /**
   * Get all diagnostics across all documents (V2 API).
   *
   * @returns Map<URI, ProtoError[]>
   */
  getAllDiagnosticsByDocument(): Map<string, ProtoError[]> {
    return this.store.getAllDiagnostics()
  }

  /**
   * Get total count of diagnostics across all documents (V2 API).
   *
   * @returns Total number of diagnostics
   */
  getTotalCount(): number {
    return this.store.getTotalCount()
  }

  /**
   * Check if any document has diagnostics (V2 API).
   *
   * @returns True if any document has diagnostics
   */
  hasAnyDiagnostics(): boolean {
    return this.store.hasAnyDiagnostics()
  }

  /**
   * Check if a specific document has diagnostics (V2 API).
   *
   * @param uri - Document identifier
   * @returns True if document has diagnostics
   */
  hasDiagnostics(uri: string): boolean {
    return this.store.hasDiagnostics(uri)
  }

  // ==========================================================
  // MIGRATION HELPERS
  // ==========================================================

  /**
   * Get the default URI used for legacy global operations.
   *
   * Useful for migration to document-scoped API.
   *
   * @returns The default URI
   */
  getDefaultUri(): string {
    return DEFAULT_URI
  }

  /**
   * Check if ErrorBus is using legacy global mode.
   *
   * Returns true if all diagnostics are in the default URI and
   * no other documents have diagnostics.
   *
   * @returns True if in legacy mode
   */
  isLegacyMode(): boolean {
    const all = this.store.getAllDiagnostics()

    // Count URIs with actual diagnostics (non-empty)
    let nonEmptyCount = 0
    let hasDefaultWithDiagnostics = false

    for (const [uri, diagnostics] of all.entries()) {
      if (diagnostics.length > 0) {
        nonEmptyCount++
        if (uri === DEFAULT_URI) {
          hasDefaultWithDiagnostics = true
        }
      }
    }

    // Legacy mode: only default URI has diagnostics
    return nonEmptyCount === 1 && hasDefaultWithDiagnostics
  }

  // ==========================================================
  // DEBUG
  // ==========================================================

  /**
   * Debug utility (V1 API - backward compatible).
   */
  debug(): void {
    console.group('🚌 ErrorBus V2 Debug')
    console.log('Mode:', this.isLegacyMode() ? 'Legacy (global)' : 'Document-scoped')
    console.log('Total documents:', this.store.getAllDiagnostics().size)
    console.log('Total diagnostics:', this.getTotalCount())

    if (this.isLegacyMode()) {
      console.log('Legacy diagnostics:', this.getAll().length)
    } else {
      console.log('Documents:')
      const all = this.store.getAllDiagnostics()
      for (const [uri, diagnostics] of all.entries()) {
        console.log(`  ${uri}: ${diagnostics.length} diagnostic(s)`)
      }
    }

    console.groupEnd()
  }
}

// ==========================================================
// EXPORT: Singleton instance
// ==========================================================
export const errorBus = ErrorBus.get()
