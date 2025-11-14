import { ERROR_CODES, type ProtoError } from '../../types/errors.js'
import {
  type CodeAction,
  type CodeActionParams,
  type CompletionList,
  type CompletionParams,
  type Diagnostic,
  type DocumentFormattingParams,
  type Hover,
  type HoverParams,
  type SemanticTokens,
  type SemanticTokensParams,
  type TextEdit,
} from 'vscode-languageserver-protocol'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { getCodeActions } from './code-actions.js'
import { getCompletions, TRIGGER_CHARACTERS } from './completions.js'
import { mapCoreErrorsToDiagnostics } from './diagnostics.js'
import { getHover } from './hover.js'
import { getSemanticTokens } from './semantic-tokens.js'
import { TextDocumentStore } from './textdoc-store.js'

export interface LanguageHost {
  parse(text: string, uri: string): { ast: unknown; errors: ProtoError[] }
  onErrors?(uri: string, cb: (errors: ProtoError[]) => void): () => void
}

export interface LanguageEngine {
  open(doc: TextDocument): void
  update(doc: TextDocument): void
  close(uri: string): void

  getDiagnostics(uri: string): Diagnostic[]
  getCompletions(params: CompletionParams): CompletionList
  getHover(params: HoverParams): Hover | null
  getCodeActions(params: CodeActionParams): CodeAction[]

  provideSemanticTokens?(params: SemanticTokensParams): SemanticTokens | null
  format?(params: DocumentFormattingParams): TextEdit[]
  onDiagnostics(
    listener: (uri: string, diagnostics: Diagnostic[]) => void
  ): () => void
}

interface SubscriptionRecord {
  dispose(): void
}

export { TRIGGER_CHARACTERS }

export function createEngine(host: LanguageHost): LanguageEngine {
  const store = new TextDocumentStore()
  const subscriptions = new Map<string, SubscriptionRecord>()
  const diagnosticListeners = new Set<
    (uri: string, diagnostics: Diagnostic[]) => void
  >()

  function ensureParsed(uri: string): void {
    const state = store.get(uri)
    if (!state) {
      return
    }

    try {
      const result = host.parse(state.document.getText(), uri)
      const errors = result.errors ?? []
      const diagnostics = mapCoreErrorsToDiagnostics(errors, state.document)
      store.setDiagnostics(uri, diagnostics, errors, result.ast)
      notifyDiagnostics(uri, diagnostics)
    } catch (error: unknown) {
      const fallbackError = createFallbackError(uri, error)
      const diagnostics = mapCoreErrorsToDiagnostics(
        [fallbackError],
        state.document
      )
      store.setDiagnostics(uri, diagnostics, [fallbackError], null)
      notifyDiagnostics(uri, diagnostics)
    }
  }

  function subscribeToHost(uri: string): void {
    if (!host.onErrors) {
      return
    }

    const dispose = host.onErrors(uri, (errors) => {
      const state = store.get(uri)
      if (!state) {
        return
      }
      const diagnostics = mapCoreErrorsToDiagnostics(errors, state.document)
      store.setDiagnostics(uri, diagnostics, errors, state.ast)
      notifyDiagnostics(uri, diagnostics)
    })

    subscriptions.set(uri, { dispose })
  }

  function notifyDiagnostics(uri: string, diagnostics: Diagnostic[]): void {
    for (const listener of diagnosticListeners) {
      listener(uri, diagnostics)
    }
  }

  return {
    open(document) {
      store.open(document)
      subscribeToHost(document.uri)
      ensureParsed(document.uri)
    },

    update(document) {
      const existing = store.get(document.uri)
      if (!existing) {
        store.open(document)
        subscribeToHost(document.uri)
      } else {
        store.update(document)
      }
      ensureParsed(document.uri)
    },

    close(uri) {
      store.close(uri)
      const subscription = subscriptions.get(uri)
      if (subscription) {
        subscription.dispose()
        subscriptions.delete(uri)
      }
    },

    getDiagnostics(uri) {
      return store.get(uri)?.diagnostics ?? []
    },

    getCompletions(params) {
      const uri = params.textDocument.uri
      const state = store.get(uri)
      if (!state) {
        return { isIncomplete: false, items: [] }
      }
      return getCompletions(params, state.document)
    },

    getHover(params) {
      const uri = params.textDocument.uri
      const state = store.get(uri)
      if (!state) {
        return null
      }
      return getHover(params, state.document)
    },

    getCodeActions(params) {
      const uri = params.textDocument.uri
      const state = store.get(uri)
      if (!state) {
        return []
      }
      return getCodeActions(params, state.document)
    },

    provideSemanticTokens(params) {
      const uri = params.textDocument.uri
      const state = store.get(uri)
      if (!state) {
        return null
      }
      return getSemanticTokens(params, state.document)
    },

    format(_params) {
      return []
    },

    onDiagnostics(listener) {
      diagnosticListeners.add(listener)
      for (const state of store.values()) {
        listener(state.document.uri, state.diagnostics)
      }
      return () => diagnosticListeners.delete(listener)
    },
  }
}

function createFallbackError(uri: string, cause: unknown): ProtoError {
  const message =
    cause instanceof Error
      ? cause.message
      : `Unexpected engine failure for ${uri}`
  return {
    stage: 'editor',
    severity: 'fatal',
    code: ERROR_CODES.EDIT_FATAL_ERROR,
    message,
  }
}
