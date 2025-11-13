import type * as monacoEditor from 'monaco-editor'
// Shiki integration is optional and handled externally via registerGrammar
import {
  createEngine,
  type LanguageHost,
  TRIGGER_CHARACTERS,
} from '../engine/engine.js'
import {
  getLanguageConfiguration,
  getTextMateGrammar,
} from '../grammar/index.js'
import type {
  CodeAction,
  CodeActionParams,
  CompletionItem,
  CompletionList,
  CompletionParams,
  Diagnostic,
  DocumentFormattingParams,
  Hover,
  HoverParams,
  Range,
  TextEdit,
} from 'vscode-languageserver-protocol'
import { InsertTextFormat } from 'vscode-languageserver-types'
import { TextDocument } from 'vscode-languageserver-textdocument'

export interface MonacoAdapterOptions {
  languageId?: string
  scopeName?: string
  registerGrammar?: (args: {
    monaco: typeof monacoEditor
    editor: monacoEditor.editor.IStandaloneCodeEditor
    grammar: ReturnType<typeof getTextMateGrammar>
    configuration: ReturnType<typeof getLanguageConfiguration>
    languageId: string
    scopeName: string
  }) => Promise<void> | void
  // External grammar registration hook (e.g., using Shiki)
}

export async function attachToMonaco(
  monaco: typeof monacoEditor,
  editor: monacoEditor.editor.IStandaloneCodeEditor,
  host: LanguageHost,
  options: MonacoAdapterOptions = {}
): Promise<void> {
  const languageId = options.languageId ?? 'proto-typed'
  const scopeName = options.scopeName ?? 'source.pty'

  registerLanguage(monaco, languageId)

  const engine = createEngine(host)
  const model = editor.getModel()
  if (!model) {
    throw new Error('Monaco editor does not have a model attached')
  }

  const toTextDocument = (
    monacoModel: monacoEditor.editor.ITextModel
  ): TextDocument =>
    TextDocument.create(
      monacoModel.uri.toString(),
      languageId,
      monacoModel.getVersionId(),
      monacoModel.getValue()
    )

  engine.open(toTextDocument(model))

  const grammar = getTextMateGrammar()
  if (options.registerGrammar) {
    await options.registerGrammar({
      monaco,
      editor,
      grammar,
      configuration: getLanguageConfiguration(),
      languageId,
      scopeName,
    })
  }

  const disposables: monacoEditor.IDisposable[] = []

  disposables.push(
    model.onDidChangeContent(() => {
      engine.update(toTextDocument(model))
    })
  )

  disposables.push(
    editor.onDidChangeModel((event) => {
      if (event.oldModelUrl) {
        engine.close(event.oldModelUrl.toString())
      }
      const newModel = editor.getModel()
      if (newModel) {
        engine.open(toTextDocument(newModel))
      }
    })
  )

  disposables.push(
    editor.onDidDispose(() => {
      disposables.forEach((d) => d.dispose())
      engine.close(model.uri.toString())
    })
  )

  // Capture the cleanup function returned by onDiagnostics to prevent memory leaks
  const unsubscribeDiagnostics = engine.onDiagnostics((uri, diagnostics) => {
    const targetModel = monaco.editor.getModel(monaco.Uri.parse(uri))
    if (!targetModel) {
      return
    }
    const markers = diagnostics.map((diagnostic) =>
      toMonacoMarker(monaco, diagnostic)
    )
    monaco.editor.setModelMarkers(targetModel, languageId, markers)
  })
  disposables.push({ dispose: unsubscribeDiagnostics })

  monaco.languages.registerCompletionItemProvider(languageId, {
    triggerCharacters: [...TRIGGER_CHARACTERS],
    provideCompletionItems(model, position, context) {
      const range = getCompletionRange(model, position)
      const params: CompletionParams = {
        textDocument: { uri: model.uri.toString() },
        position: {
          line: position.lineNumber - 1,
          character: position.column - 1,
        },
        context: {
          triggerCharacter: context.triggerCharacter ?? undefined,
          triggerKind:
            context.triggerKind ===
            monaco.languages.CompletionTriggerKind.TriggerCharacter
              ? 2
              : 1,
        },
      }
      const list = engine.getCompletions(params)
      return toMonacoCompletionList(monaco, list, range)
    },
  })

  monaco.languages.registerHoverProvider(languageId, {
    provideHover(model, position) {
      const params: HoverParams = {
        textDocument: { uri: model.uri.toString() },
        position: {
          line: position.lineNumber - 1,
          character: position.column - 1,
        },
      }
      return toMonacoHover(monaco, engine.getHover(params))
    },
  })

  monaco.languages.registerCodeActionProvider(
    languageId,
    {
      provideCodeActions(model, range, context) {
        const params: CodeActionParams = {
          textDocument: { uri: model.uri.toString() },
          range: toLspRange(range),
          context: {
            // Monaco's CodeActionContext.only is typed as string | undefined,
            // while LSP expects string[] | undefined.
            only: context.only ? [context.only] : undefined,
            diagnostics: context.markers.map((marker) =>
              toLspDiagnostic(
                monaco,
                marker,
                engine.getDiagnostics(model.uri.toString())
              )
            ),
          },
        }
        const actions = engine.getCodeActions(params)
        return {
          actions: actions.map((action) => toMonacoCodeAction(monaco, action)),
          dispose: () => undefined,
        }
      },
    },
    { providedCodeActionKinds: ['quickfix'] }
  )

  if (engine.format) {
    monaco.languages.registerDocumentFormattingEditProvider(languageId, {
      provideDocumentFormattingEdits(model, options, _token) {
        const params: DocumentFormattingParams = {
          textDocument: { uri: model.uri.toString() },
          options: {
            tabSize: options.tabSize,
            insertSpaces: options.insertSpaces,
          },
        }
        const edits = engine.format!(params)
        // Monaco expects TextEdit[] here, not ISingleEditOperation[]
        return edits.map((edit) => toMonacoTextEdit(monaco, edit))
      },
    })
  }
}

function registerLanguage(monaco: typeof monacoEditor, languageId: string) {
  const configuration =
    getLanguageConfiguration() as monacoEditor.languages.LanguageConfiguration
  monaco.languages.register({
    id: languageId,
    aliases: ['Proto-Typed', 'proto-typed'],
    extensions: ['.pty'],
  })
  monaco.languages.setLanguageConfiguration(languageId, configuration)
}

function toMonacoMarker(
  monaco: typeof monacoEditor,
  diagnostic: Diagnostic
): monacoEditor.editor.IMarkerData {
  return {
    code: diagnostic.code != null ? String(diagnostic.code) : undefined,
    severity: toMonacoSeverity(monaco, diagnostic.severity),
    message: diagnostic.message,
    startLineNumber: diagnostic.range.start.line + 1,
    startColumn: diagnostic.range.start.character + 1,
    endLineNumber: diagnostic.range.end.line + 1,
    endColumn: diagnostic.range.end.character + 1,
    source: diagnostic.source ?? 'proto-typed',
  }
}

function toMonacoSeverity(
  monaco: typeof monacoEditor,
  severity: Diagnostic['severity']
): monacoEditor.MarkerSeverity {
  switch (severity) {
    case 1:
      return monaco.MarkerSeverity.Error
    case 2:
      return monaco.MarkerSeverity.Warning
    case 3:
      return monaco.MarkerSeverity.Info
    default:
      return monaco.MarkerSeverity.Hint
  }
}

function toMonacoCompletionList(
  monaco: typeof monacoEditor,
  list: CompletionList,
  range: monacoEditor.IRange
): monacoEditor.languages.CompletionList {
  return {
    incomplete: list.isIncomplete ?? false,
    suggestions: list.items.map((item) =>
      toMonacoCompletionItem(monaco, item, range)
    ),
  }
}

function toMonacoCompletionItem(
  monaco: typeof monacoEditor,
  item: CompletionItem,
  range: monacoEditor.IRange
): monacoEditor.languages.CompletionItem {
  const label =
    typeof item.label === 'string'
      ? item.label
      : (item.label as { label: string }).label
  const suggestion: monacoEditor.languages.CompletionItem = {
    label,
    kind: item.kind as monacoEditor.languages.CompletionItemKind,
    insertText: item.insertText ?? label,
    sortText: item.sortText,
    filterText: item.filterText,
    detail: item.detail,
    // Provide a minimal valid range to satisfy strict typings
    range,
  }

  if (item.insertTextFormat === InsertTextFormat.Snippet) {
    suggestion.insertTextRules =
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
  }

  if (item.documentation) {
    if (typeof item.documentation === 'string') {
      suggestion.documentation = item.documentation
    } else if (item.documentation.kind === 'markdown') {
      suggestion.documentation = {
        value: item.documentation.value,
        isTrusted: true,
      }
    } else {
      suggestion.documentation = item.documentation.value
    }
  }
  return suggestion
}

function getCompletionRange(
  model: monacoEditor.editor.ITextModel,
  position: monacoEditor.Position
): monacoEditor.IRange {
  const word = model.getWordUntilPosition(position)
  return {
    startLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endLineNumber: position.lineNumber,
    endColumn: word.endColumn,
  }
}

function toMonacoHover(
  monaco: typeof monacoEditor,
  hover: Hover | null
): monacoEditor.languages.Hover | undefined {
  if (!hover || !hover.contents) {
    return undefined
  }

  const contents = Array.isArray(hover.contents)
    ? hover.contents.map((entry) => toMonacoHoverContent(monaco, entry))
    : [toMonacoHoverContent(monaco, hover.contents)]

  return {
    contents,
    range: hover.range ? toMonacoRange(hover.range) : undefined,
  }
}

function toMonacoHoverContent(
  monaco: typeof monacoEditor,
  entry: Hover['contents']
): monacoEditor.IMarkdownString {
  if (!entry) {
    return { value: '' }
  }
  if (typeof entry === 'string') {
    return { value: entry }
  }
  if ('kind' in entry && entry.kind === 'markdown') {
    return {
      value: entry.value,
      isTrusted: true,
    }
  }
  if ('kind' in entry && entry.kind === 'plaintext') {
    return { value: entry.value }
  }
  return { value: '' }
}

function toMonacoCodeAction(
  monaco: typeof monacoEditor,
  action: CodeAction
): monacoEditor.languages.CodeAction {
  const monacoAction: monacoEditor.languages.CodeAction = {
    title: action.title,
    kind: action.kind ?? 'quickfix',
  }
  if (action.diagnostics) {
    monacoAction.diagnostics = action.diagnostics.map((diag) =>
      toMonacoMarker(monaco, diag)
    )
  }
  if (action.edit) {
    monacoAction.edit = toMonacoWorkspaceEdit(monaco, action.edit)
  }
  if (action.command) {
    monacoAction.command = {
      id: action.command.command,
      title: action.command.title ?? action.title,
      arguments: action.command.arguments,
    }
  }
  if (action.isPreferred) {
    monacoAction.isPreferred = true
  }
  return monacoAction
}

function toMonacoWorkspaceEdit(
  monaco: typeof monacoEditor,
  edit: CodeAction['edit']
): monacoEditor.languages.WorkspaceEdit {
  const edits: unknown[] = []
  Object.entries(edit?.changes ?? {}).forEach(([uri, textEdits]) => {
    const resource = monaco.Uri.parse(uri)
    textEdits.forEach((textEdit) => {
      const workspaceTextEdit = {
        resource,
        edit: {
          range: toMonacoRange(textEdit.range),
          text: textEdit.newText,
        },
      }
      edits.push(workspaceTextEdit as unknown)
    })
  })
  return { edits } as monacoEditor.languages.WorkspaceEdit
}

function toMonacoRange(range: Range): monacoEditor.IRange {
  return {
    startLineNumber: range.start.line + 1,
    startColumn: range.start.character + 1,
    endLineNumber: range.end.line + 1,
    endColumn: range.end.character + 1,
  }
}

function toMonacoTextEdit(
  _monaco: typeof monacoEditor,
  edit: TextEdit
): monacoEditor.languages.TextEdit {
  return {
    range: toMonacoRange(edit.range),
    text: edit.newText,
  }
}

function toLspRange(range: monacoEditor.IRange): Range {
  return {
    start: {
      line: range.startLineNumber - 1,
      character: range.startColumn - 1,
    },
    end: { line: range.endLineNumber - 1, character: range.endColumn - 1 },
  }
}

function toLspDiagnostic(
  monaco: typeof monacoEditor,
  marker: monacoEditor.editor.IMarkerData,
  existing: Diagnostic[]
): Diagnostic {
  const candidate = existing.find(
    (diag) =>
      diag.message === marker.message &&
      diag.range.start.line === marker.startLineNumber - 1 &&
      diag.range.start.character === marker.startColumn - 1
  )
  if (candidate) {
    return candidate
  }
  return {
    message: marker.message,
    range: toLspRange({
      startLineNumber: marker.startLineNumber,
      startColumn: marker.startColumn,
      endLineNumber: marker.endLineNumber ?? marker.startLineNumber,
      endColumn: marker.endColumn ?? marker.startColumn + 1,
    }),
    severity:
      marker.severity === monaco.MarkerSeverity.Error
        ? 1
        : marker.severity === monaco.MarkerSeverity.Warning
          ? 2
          : 3,
    code:
      typeof marker.code === 'string'
        ? marker.code
        : typeof marker.code === 'number'
          ? String(marker.code)
          : (marker.code as { value?: string } | undefined)?.value,
    source: marker.source,
  }
}
// End of adapter. Syntax highlighting registration may be provided externally.
