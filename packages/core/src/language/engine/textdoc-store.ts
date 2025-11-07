import { TextDocument } from 'vscode-languageserver-textdocument'
import type { Diagnostic } from 'vscode-languageserver-protocol'
import type { ProtoError } from '../../types/errors'

export interface DocumentState {
  document: TextDocument
  ast: unknown
  errors: ProtoError[]
  diagnostics: Diagnostic[]
}

export class TextDocumentStore {
  private readonly documents = new Map<string, DocumentState>()

  open(
    document: TextDocument,
    initial?: Partial<Omit<DocumentState, 'document'>>
  ): DocumentState {
    const state: DocumentState = {
      document,
      ast: initial?.ast ?? null,
      errors: initial?.errors ?? [],
      diagnostics: initial?.diagnostics ?? [],
    }
    this.documents.set(document.uri, state)
    return state
  }

  update(document: TextDocument): DocumentState | undefined {
    const existing = this.documents.get(document.uri)
    if (!existing) {
      return undefined
    }
    existing.document = document
    return existing
  }

  close(uri: string): void {
    this.documents.delete(uri)
  }

  get(uri: string): DocumentState | undefined {
    return this.documents.get(uri)
  }

  setDiagnostics(
    uri: string,
    diagnostics: Diagnostic[],
    errors: ProtoError[],
    ast: unknown
  ): void {
    const state = this.documents.get(uri)
    if (!state) {
      return
    }
    state.diagnostics = diagnostics
    state.errors = errors
    state.ast = ast
  }

  values(): IterableIterator<DocumentState> {
    return this.documents.values()
  }
}
