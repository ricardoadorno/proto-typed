/**
 * Text Document Synchronizer
 * Manages synchronization of text documents with debounce to avoid flooding
 */

import * as vscode from 'vscode'

export interface SyncEvent {
  document: vscode.TextDocument
  timestamp: number
}

export type SyncHandler = (event: SyncEvent) => void | Promise<void>

export interface SynchronizerOptions {
  debounceMs?: number
  filterLanguageIds?: string[]
  logChanges?: boolean
}

/**
 * TextDocumentSynchronizer observes document changes and emits debounced events
 */
export class TextDocumentSynchronizer implements vscode.Disposable {
  private disposables: vscode.Disposable[] = []
  private debounceTimer?: ReturnType<typeof setTimeout>
  private handlers: SyncHandler[] = []
  private options: Required<SynchronizerOptions>
  private isApplyingInternal = false
  private lastSyncedUri?: string

  constructor(options: SynchronizerOptions = {}) {
    this.options = {
      debounceMs: 300,
      filterLanguageIds: [],
      logChanges: true,
      ...options,
    }

    this.setupListeners()
  }

  private setupListeners(): void {
    // Listen to text document changes
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((event) => {
        // Skip if we're applying internal changes to avoid loops
        if (this.isApplyingInternal) {
          return
        }

        const activeEditor = vscode.window.activeTextEditor
        if (!activeEditor) {
          return
        }

        // Only sync if it's the active document
        if (
          event.document.uri.toString() !== activeEditor.document.uri.toString()
        ) {
          return
        }

        // Filter by language ID if specified
        if (
          this.options.filterLanguageIds.length > 0 &&
          !this.options.filterLanguageIds.includes(event.document.languageId)
        ) {
          return
        }

        this.scheduleSync(event.document)
      })
    )

    // Listen to active editor changes
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
          // Filter by language ID if specified
          if (
            this.options.filterLanguageIds.length > 0 &&
            !this.options.filterLanguageIds.includes(editor.document.languageId)
          ) {
            return
          }

          // Immediately sync when switching documents
          this.syncNow(editor.document)
        }
      })
    )
  }

  /**
   * Schedule a sync with debounce
   */
  private scheduleSync(document: vscode.TextDocument): void {
    // Clear previous timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    // Schedule new sync
    this.debounceTimer = setTimeout(() => {
      this.syncNow(document)
    }, this.options.debounceMs)
  }

  /**
   * Sync immediately without debounce
   */
  private async syncNow(document: vscode.TextDocument): Promise<void> {
    const uri = document.uri.toString()

    if (this.options.logChanges) {
      const timestamp = new Date().toLocaleTimeString()
      console.log(
        `🔄 [${timestamp}] Syncing: ${document.fileName.split(/[\\/]/).pop()}`
      )
    }

    const event: SyncEvent = {
      document,
      timestamp: Date.now(),
    }

    this.lastSyncedUri = uri

    // Execute all handlers
    const promises = this.handlers.map((handler) =>
      Promise.resolve(handler(event))
    )

    try {
      await Promise.all(promises)
    } catch (error) {
      console.error('❌ [Synchronizer] Error executing handlers:', error)
    }
  }

  /**
   * Register a sync handler
   */
  onSync(handler: SyncHandler): vscode.Disposable {
    this.handlers.push(handler)

    return {
      dispose: () => {
        const index = this.handlers.indexOf(handler)
        if (index > -1) {
          this.handlers.splice(index, 1)
        }
      },
    }
  }

  /**
   * Apply text to the active editor (marks as internal to avoid loop)
   */
  async applyText(text: string, reason: string): Promise<boolean> {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      console.warn('⚠️  [Synchronizer] No active editor to apply text')
      return false
    }

    this.isApplyingInternal = true

    try {
      const success = await editor.edit((editBuilder) => {
        const document = editor.document
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(document.getText().length)
        )
        editBuilder.replace(fullRange, text)
      })

      if (success && this.options.logChanges) {
        console.log(`✏️  [Synchronizer] Applied text (${reason})`)
      }

      return success
    } catch (error) {
      console.error('❌ [Synchronizer] Error applying text:', error)
      return false
    } finally {
      // Reset flag after a short delay to ensure the change event has been processed
      setTimeout(() => {
        this.isApplyingInternal = false
      }, 100)
    }
  }

  /**
   * Force sync the current active document
   */
  forceSyncNow(): void {
    const editor = vscode.window.activeTextEditor
    if (editor) {
      this.syncNow(editor.document)
    }
  }

  /**
   * Get the last synced URI
   */
  getLastSyncedUri(): string | undefined {
    return this.lastSyncedUri
  }

  /**
   * Dispose all listeners
   */
  dispose(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    this.disposables.forEach((d) => d.dispose())
    this.disposables = []
    this.handlers = []
  }
}
