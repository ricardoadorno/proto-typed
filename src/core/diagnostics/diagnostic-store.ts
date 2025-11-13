/**
 * Diagnostic Store - Document-Scoped Diagnostics Storage
 *
 * This module provides document-scoped diagnostic storage following the
 * LSP publishDiagnostics pattern. Each document (URI) has its own set
 * of diagnostics that can be updated independently.
 *
 * **Design Inspired By:**
 * - LSP's textDocument/publishDiagnostics notification pattern
 * - Volar's multi-project diagnostic management
 * - VS Code's diagnostic collection API
 *
 * **Key Features:**
 * - URI-based scoping (one diagnostic set per file)
 * - Version tracking for staleness detection
 * - Pub/Sub pattern for reactive updates
 * - Automatic deduplication per document
 * - Backward compatible with ErrorBus
 *
 * @see https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_publishDiagnostics
 */

import type { ProtoError } from '../../types/errors'

// ============================================================
// Types
// ============================================================

/**
 * Diagnostic entry for a single document.
 *
 * Matches LSP's PublishDiagnosticsParams structure.
 */
export interface DiagnosticEntry {
  /**
   * The URI of the document (file path or virtual URI).
   */
  uri: string

  /**
   * The diagnostics for this document.
   */
  diagnostics: ProtoError[]

  /**
   * Optional version number of the document.
   * Used to detect stale diagnostics.
   */
  version?: number
}

/**
 * Listener callback type for diagnostic updates.
 */
export type DiagnosticListener = (uri: string, diagnostics: ProtoError[]) => void

/**
 * Global listener callback type (all documents).
 */
export type GlobalDiagnosticListener = (allDiagnostics: Map<string, ProtoError[]>) => void

// ============================================================
// Diagnostic Store (Singleton)
// ============================================================

/**
 * Document-scoped diagnostic storage with pub/sub pattern.
 *
 * This is the new, LSP-aligned diagnostic storage that replaces
 * the global error pool with per-document diagnostic collections.
 *
 * **Migration from ErrorBus:**
 * - ErrorBus had global error array
 * - DiagnosticStore has per-URI diagnostic arrays
 * - Enables multi-file editing scenarios
 * - Aligns with LSP publishDiagnostics pattern
 */
export class DiagnosticStore {
  private static instance: DiagnosticStore

  /**
   * Storage: Map<URI, DiagnosticEntry>
   */
  private store: Map<string, DiagnosticEntry> = new Map()

  /**
   * Per-URI listeners: Map<URI, Listener[]>
   */
  private uriListeners: Map<string, DiagnosticListener[]> = new Map()

  /**
   * Global listeners (notified on any change)
   */
  private globalListeners: GlobalDiagnosticListener[] = []

  // ==========================================================
  // SINGLETON PATTERN
  // ==========================================================

  private constructor() {
    // Private constructor
  }

  static get(): DiagnosticStore {
    if (!DiagnosticStore.instance) {
      DiagnosticStore.instance = new DiagnosticStore()
    }
    return DiagnosticStore.instance
  }

  // ==========================================================
  // PUBLISH DIAGNOSTICS (LSP-Style API)
  // ==========================================================

  /**
   * Publish diagnostics for a document (LSP-style).
   *
   * This is the primary API for updating diagnostics.
   * Follows LSP's textDocument/publishDiagnostics pattern:
   * - Sending empty array clears diagnostics
   * - Always replaces previous diagnostics (no merging)
   * - Notifies all subscribers
   *
   * @param uri - Document identifier (file:///path/to/file.dsl)
   * @param diagnostics - Array of diagnostics (empty to clear)
   * @param version - Optional document version
   *
   * @example
   * ```typescript
   * // Publish diagnostics
   * store.publishDiagnostics('file:///main.dsl', [
   *   { code: 'PT-LINT-1001', severity: 'error', ... }
   * ])
   *
   * // Clear diagnostics
   * store.publishDiagnostics('file:///main.dsl', [])
   * ```
   */
  publishDiagnostics(uri: string, diagnostics: ProtoError[], version?: number): void {
    // Deduplicate diagnostics within this document
    const deduped = this.deduplicateDiagnostics(diagnostics)

    // Store entry
    this.store.set(uri, {
      uri,
      diagnostics: deduped,
      version
    })

    // Notify subscribers
    this.notifyUri(uri, deduped)
    this.notifyGlobal()
  }

  /**
   * Publish diagnostics for multiple documents at once.
   *
   * More efficient than calling publishDiagnostics multiple times
   * because it batches notifications.
   *
   * @param entries - Array of { uri, diagnostics, version }
   */
  publishMany(entries: Array<{ uri: string; diagnostics: ProtoError[]; version?: number }>): void {
    for (const { uri, diagnostics, version } of entries) {
      const deduped = this.deduplicateDiagnostics(diagnostics)
      this.store.set(uri, { uri, diagnostics: deduped, version })
      this.notifyUri(uri, deduped)
    }

    // Single global notification for batch
    this.notifyGlobal()
  }

  // ==========================================================
  // QUERY API
  // ==========================================================

  /**
   * Get diagnostics for a specific document.
   *
   * @param uri - Document identifier
   * @returns Array of diagnostics (empty if none)
   */
  getDiagnostics(uri: string): ProtoError[] {
    return this.store.get(uri)?.diagnostics || []
  }

  /**
   * Get diagnostic entry (includes version) for a document.
   *
   * @param uri - Document identifier
   * @returns DiagnosticEntry or undefined
   */
  getEntry(uri: string): DiagnosticEntry | undefined {
    return this.store.get(uri)
  }

  /**
   * Get all diagnostics across all documents.
   *
   * @returns Map<URI, ProtoError[]>
   */
  getAllDiagnostics(): Map<string, ProtoError[]> {
    const result = new Map<string, ProtoError[]>()
    for (const [uri, entry] of this.store.entries()) {
      result.set(uri, entry.diagnostics)
    }
    return result
  }

  /**
   * Get all diagnostic entries (includes versions).
   *
   * @returns Map<URI, DiagnosticEntry>
   */
  getAllEntries(): Map<string, DiagnosticEntry> {
    return new Map(this.store)
  }

  /**
   * Get total count of diagnostics across all documents.
   */
  getTotalCount(): number {
    let count = 0
    for (const entry of this.store.values()) {
      count += entry.diagnostics.length
    }
    return count
  }

  /**
   * Get count of diagnostics for a specific document.
   */
  getCount(uri: string): number {
    return this.store.get(uri)?.diagnostics.length || 0
  }

  /**
   * Check if any document has diagnostics.
   */
  hasAnyDiagnostics(): boolean {
    for (const entry of this.store.values()) {
      if (entry.diagnostics.length > 0) {
        return true
      }
    }
    return false
  }

  /**
   * Check if a specific document has diagnostics.
   */
  hasDiagnostics(uri: string): boolean {
    const entry = this.store.get(uri)
    return entry !== undefined && entry.diagnostics.length > 0
  }

  // ==========================================================
  // CLEAR API
  // ==========================================================

  /**
   * Clear diagnostics for a specific document.
   *
   * Equivalent to publishDiagnostics(uri, [])
   */
  clearDiagnostics(uri: string): void {
    this.publishDiagnostics(uri, [])
  }

  /**
   * Clear diagnostics for multiple documents.
   */
  clearMany(uris: string[]): void {
    for (const uri of uris) {
      this.store.delete(uri)
      this.notifyUri(uri, [])
    }
    this.notifyGlobal()
  }

  /**
   * Clear all diagnostics across all documents.
   */
  clearAll(): void {
    const uris = Array.from(this.store.keys())
    this.store.clear()

    // Notify all URIs that they're now empty
    for (const uri of uris) {
      this.notifyUri(uri, [])
    }

    this.notifyGlobal()
  }

  // ==========================================================
  // SUBSCRIPTION API
  // ==========================================================

  /**
   * Subscribe to diagnostics for a specific document.
   *
   * The callback is immediately called with current diagnostics.
   *
   * @param uri - Document identifier
   * @param callback - Called when diagnostics change
   * @returns Unsubscribe function
   *
   * @example
   * ```typescript
   * const unsubscribe = store.subscribe('file:///main.dsl', (uri, diagnostics) => {
   *   console.log(`Diagnostics for ${uri}:`, diagnostics)
   * })
   *
   * // Later: unsubscribe()
   * ```
   */
  subscribe(uri: string, callback: DiagnosticListener): () => void {
    // Get or create listener array for this URI
    if (!this.uriListeners.has(uri)) {
      this.uriListeners.set(uri, [])
    }

    const listeners = this.uriListeners.get(uri)!
    listeners.push(callback)

    // Immediately notify with current diagnostics
    try {
      const current = this.getDiagnostics(uri)
      callback(uri, current)
    } catch (error) {
      console.error('Error in DiagnosticStore initial notify:', error)
    }

    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }

      // Clean up empty listener arrays
      if (listeners.length === 0) {
        this.uriListeners.delete(uri)
      }
    }
  }

  /**
   * Subscribe to all diagnostic changes (global listener).
   *
   * The callback is immediately called with all current diagnostics.
   *
   * @param callback - Called when any diagnostics change
   * @returns Unsubscribe function
   *
   * @example
   * ```typescript
   * const unsubscribe = store.subscribeAll((allDiagnostics) => {
   *   console.log(`Total diagnostics:`, allDiagnostics.size)
   * })
   * ```
   */
  subscribeAll(callback: GlobalDiagnosticListener): () => void {
    this.globalListeners.push(callback)

    // Immediately notify with current state
    try {
      callback(this.getAllDiagnostics())
    } catch (error) {
      console.error('Error in DiagnosticStore global initial notify:', error)
    }

    // Return unsubscribe function
    return () => {
      const index = this.globalListeners.indexOf(callback)
      if (index > -1) {
        this.globalListeners.splice(index, 1)
      }
    }
  }

  // ==========================================================
  // PRIVATE: Deduplication
  // ==========================================================

  /**
   * Deduplicate diagnostics using the same algorithm as ErrorBus.
   *
   * Key: code|line|column|messagePrefix
   */
  private deduplicateDiagnostics(diagnostics: ProtoError[]): ProtoError[] {
    const seen = new Set<string>()
    const result: ProtoError[] = []

    for (const diag of diagnostics) {
      const key = this.getDiagnosticKey(diag)
      if (!seen.has(key)) {
        seen.add(key)
        result.push(diag)
      }
    }

    return result
  }

  /**
   * Generate deduplication key for a diagnostic.
   */
  private getDiagnosticKey(diag: ProtoError): string {
    const msgPrefix = diag.message.slice(0, 16)
    const line = diag.line ?? diag.range?.start.line ?? '?'
    const column = diag.column ?? diag.range?.start.character ?? '?'
    return `${diag.code}|${line}|${column}|${msgPrefix}`
  }

  // ==========================================================
  // PRIVATE: Notifications
  // ==========================================================

  /**
   * Notify listeners for a specific URI.
   */
  private notifyUri(uri: string, diagnostics: ProtoError[]): void {
    const listeners = this.uriListeners.get(uri)
    if (!listeners || listeners.length === 0) return

    for (const callback of listeners) {
      try {
        callback(uri, [...diagnostics])
      } catch (error) {
        console.error('Error in DiagnosticStore URI listener:', error)
      }
    }
  }

  /**
   * Notify global listeners.
   */
  private notifyGlobal(): void {
    if (this.globalListeners.length === 0) return

    const allDiagnostics = this.getAllDiagnostics()

    for (const callback of this.globalListeners) {
      try {
        callback(allDiagnostics)
      } catch (error) {
        console.error('Error in DiagnosticStore global listener:', error)
      }
    }
  }

  // ==========================================================
  // DEBUG
  // ==========================================================

  /**
   * Debug utility to inspect store state.
   */
  debug(): void {
    console.group('🗂️  DiagnosticStore Debug')
    console.log('Total documents:', this.store.size)
    console.log('Total diagnostics:', this.getTotalCount())
    console.log('Documents with diagnostics:')

    for (const [uri, entry] of this.store.entries()) {
      console.log(`  ${uri}: ${entry.diagnostics.length} diagnostic(s)`)
    }

    console.log('Listeners:')
    console.log(`  URI listeners: ${this.uriListeners.size}`)
    console.log(`  Global listeners: ${this.globalListeners.length}`)

    console.groupEnd()
  }
}

// ==========================================================
// EXPORT: Singleton instance for convenience
// ==========================================================
export const diagnosticStore = DiagnosticStore.get()
