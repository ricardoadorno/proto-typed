import type * as vscode from 'vscode'
import {
  createEngine,
  TRIGGER_CHARACTERS,
  type LanguageHost,
} from '../engine/engine.js'
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
  SemanticTokensParams,
  TextEdit,
} from 'vscode-languageserver-protocol'
import { InsertTextFormat } from 'vscode-languageserver-types'
import { TextDocument } from 'vscode-languageserver-textdocument'

export function activateVSCodeAdapter(
  vscodeApi: typeof vscode,
  context: vscode.ExtensionContext,
  host: LanguageHost
): void {
  const engine = createEngine(host)
  const collection =
    vscodeApi.languages.createDiagnosticCollection('proto-typed')
  context.subscriptions.push(collection)

  // Capture the cleanup function returned by onDiagnostics to prevent memory leaks
  const unsubscribeDiagnostics = engine.onDiagnostics((uri, diagnostics) => {
    const vscodeUri = vscodeApi.Uri.parse(uri)
    collection.set(
      vscodeUri,
      diagnostics.map((diag) => toVsCodeDiagnostic(vscodeApi, diag))
    )
  })
  context.subscriptions.push({ dispose: unsubscribeDiagnostics })

  // Defer initial parsing to avoid blocking activation
  // setTimeout(() => {
  //   vscodeApi.workspace.textDocuments
  //     .filter(isProtoTypedDocument)
  //     .forEach((doc) => engine.open(toLspDocument(doc)))
  // }, 100)

  context.subscriptions.push(
    vscodeApi.workspace.onDidOpenTextDocument((doc) => {
      if (!isProtoTypedDocument(doc)) {
        return
      }
      engine.open(toLspDocument(doc))
    }),
    vscodeApi.workspace.onDidChangeTextDocument((event) => {
      const doc = event.document
      if (!isProtoTypedDocument(doc)) {
        return
      }
      engine.update(toLspDocument(doc))
    }),
    vscodeApi.workspace.onDidCloseTextDocument((doc) => {
      if (!isProtoTypedDocument(doc)) {
        return
      }
      engine.close(doc.uri.toString())
      collection.delete(doc.uri)
    })
  )

  context.subscriptions.push(
    vscodeApi.languages.registerCompletionItemProvider(
      { language: 'proto-typed', scheme: 'file' },
      {
        provideCompletionItems(document, position, _token, contextProvide) {
          const params: CompletionParams = {
            textDocument: { uri: document.uri.toString() },
            position: { line: position.line, character: position.character },
            context: {
              triggerKind: toTriggerKind(
                vscodeApi,
                contextProvide.triggerKind
              ) as 1 | 2 | 3,
              triggerCharacter: contextProvide.triggerCharacter ?? undefined,
            },
          }
          const result = engine.getCompletions(params)
          return toVsCompletionList(vscodeApi, result)
        },
      },
      ...TRIGGER_CHARACTERS
    )
  )

  context.subscriptions.push(
    vscodeApi.languages.registerHoverProvider('proto-typed', {
      provideHover(document, position) {
        const params: HoverParams = {
          textDocument: { uri: document.uri.toString() },
          position: { line: position.line, character: position.character },
        }
        return toVsHover(vscodeApi, engine.getHover(params))
      },
    })
  )

  context.subscriptions.push(
    vscodeApi.languages.registerCodeActionsProvider(
      'proto-typed',
      {
        provideCodeActions(document, range, contextProvide) {
          const params: CodeActionParams = {
            textDocument: { uri: document.uri.toString() },
            range: toLspRange(range),
            context: {
              diagnostics: contextProvide.diagnostics.map((diag) =>
                toLspDiagnostic(
                  diag,
                  engine.getDiagnostics(document.uri.toString())
                )
              ),
              only: contextProvide.only
                ? [contextProvide.only.value]
                : undefined,
            },
          }
          return engine
            .getCodeActions(params)
            .map((action) => toVsCodeAction(vscodeApi, document, action))
        },
      },
      {
        providedCodeActionKinds: [vscodeApi.CodeActionKind.QuickFix],
      }
    )
  )

  if (engine.provideSemanticTokens) {
    const legend = new vscodeApi.SemanticTokensLegend([], [])
    context.subscriptions.push(
      vscodeApi.languages.registerDocumentSemanticTokensProvider(
        { language: 'proto-typed' },
        {
          provideDocumentSemanticTokens(document) {
            const params: SemanticTokensParams = {
              textDocument: { uri: document.uri.toString() },
            }
            const tokens = engine.provideSemanticTokens!(params)
            if (!tokens) {
              return new vscodeApi.SemanticTokens(new Uint32Array())
            }
            return new vscodeApi.SemanticTokens(Uint32Array.from(tokens.data))
          },
        },
        legend
      )
    )
  }

  if (engine.format) {
    context.subscriptions.push(
      vscodeApi.languages.registerDocumentFormattingEditProvider(
        'proto-typed',
        {
          provideDocumentFormattingEdits(document) {
            const params: DocumentFormattingParams = {
              textDocument: { uri: document.uri.toString() },
              options: {
                tabSize: 2,
                insertSpaces: true,
              },
            }
            const edits = engine.format!(params)
            return edits.map((edit) => toVsTextEdit(vscodeApi, edit))
          },
        }
      )
    )
  }
}

function isProtoTypedDocument(doc: vscode.TextDocument): boolean {
  return doc.languageId === 'proto-typed'
}

function toLspDocument(doc: vscode.TextDocument): TextDocument {
  return TextDocument.create(
    doc.uri.toString(),
    doc.languageId,
    doc.version,
    doc.getText()
  )
}

function toTriggerKind(
  vscodeApi: typeof vscode,
  kind: vscode.CompletionTriggerKind | undefined
): number {
  switch (kind) {
    case vscodeApi.CompletionTriggerKind.TriggerCharacter:
      return 2
    case vscodeApi.CompletionTriggerKind.TriggerForIncompleteCompletions:
      return 3
    default:
      return 1
  }
}

function toVsCompletionList(
  vscodeApi: typeof vscode,
  list: CompletionList
): vscode.CompletionList {
  const items = list.items.map((item) => toVsCompletionItem(vscodeApi, item))
  return new vscodeApi.CompletionList(items, list.isIncomplete)
}

function toVsCompletionItem(
  vscodeApi: typeof vscode,
  item: CompletionItem
): vscode.CompletionItem {
  const label =
    typeof item.label === 'string'
      ? item.label
      : (item.label as { label: string }).label
  const completion = new vscodeApi.CompletionItem(
    label,
    item.kind as number | undefined as vscode.CompletionItemKind
  )
  if (item.insertTextFormat === InsertTextFormat.Snippet) {
    completion.insertText = new vscodeApi.SnippetString(
      item.insertText ?? label
    )
  } else if (item.insertText) {
    completion.insertText = item.insertText
  }
  if (item.detail) {
    completion.detail = item.detail
  }
  if (item.sortText) {
    completion.sortText = item.sortText
  }
  if (item.filterText) {
    completion.filterText = item.filterText
  }
  if (item.documentation) {
    if (typeof item.documentation === 'string') {
      completion.documentation = item.documentation
    } else if (item.documentation.kind === 'markdown') {
      completion.documentation = new vscodeApi.MarkdownString(
        item.documentation.value
      )
    } else {
      completion.documentation = item.documentation.value
    }
  }
  return completion
}

function toVsHover(
  vscodeApi: typeof vscode,
  hover: Hover | null
): vscode.Hover | null {
  if (!hover) {
    return null
  }

  if (!hover.contents) {
    return null
  }

  if (Array.isArray(hover.contents)) {
    const contents = hover.contents.map((entry) =>
      toVsHoverContent(vscodeApi, entry)
    )
    return new vscodeApi.Hover(contents)
  }

  return new vscodeApi.Hover(toVsHoverContent(vscodeApi, hover.contents))
}

function toVsHoverContent(
  vscodeApi: typeof vscode,
  content: Hover['contents']
): vscode.MarkdownString | string {
  if (!content) {
    return ''
  }

  if (typeof content === 'string') {
    return content
  }

  if ('kind' in content && content.kind === 'markdown') {
    return new vscodeApi.MarkdownString(content.value)
  }

  if ('kind' in content && content.kind === 'plaintext') {
    return content.value
  }

  return ''
}

function toLspRange(range: vscode.Range): Range {
  return {
    start: { line: range.start.line, character: range.start.character },
    end: { line: range.end.line, character: range.end.character },
  }
}

function toVsCodeAction(
  vscodeApi: typeof vscode,
  document: vscode.TextDocument,
  action: CodeAction
): vscode.CodeAction {
  const codeAction = new vscodeApi.CodeAction(
    action.title,
    toVsCodeActionKind(vscodeApi, action.kind)
  )
  if (action.diagnostics) {
    codeAction.diagnostics = action.diagnostics.map((diag) =>
      toVsCodeDiagnostic(vscodeApi, diag)
    )
  }
  if (action.edit) {
    const edit = new vscodeApi.WorkspaceEdit()
    Object.entries(action.edit.changes ?? {}).forEach(([uri, edits]) => {
      const target = vscodeApi.Uri.parse(uri)
      edits.forEach((textEdit) => {
        edit.replace(
          target,
          toVsRange(vscodeApi, textEdit.range),
          textEdit.newText
        )
      })
    })
    codeAction.edit = edit
  }
  if (action.command) {
    codeAction.command = {
      title: action.command.title ?? action.title,
      command: action.command.command,
      arguments: action.command.arguments,
    }
  }
  if (action.isPreferred) {
    codeAction.isPreferred = true
  }
  if (action.kind) {
    codeAction.kind = toVsCodeActionKind(vscodeApi, action.kind)
  }
  return codeAction
}

function toVsCodeActionKind(
  vscodeApi: typeof vscode,
  kind: CodeAction['kind']
): vscode.CodeActionKind | undefined {
  if (!kind) {
    return undefined
  }
  switch (kind) {
    case 'quickfix':
    case 'quickFix':
      return vscodeApi.CodeActionKind.QuickFix
    default:
      return vscodeApi.CodeActionKind.Empty.append(kind)
  }
}

function toVsCodeDiagnostic(
  vscodeApi: typeof vscode,
  diagnostic: Diagnostic
): vscode.Diagnostic {
  const vsRange = toVsRange(vscodeApi, diagnostic.range)
  const severity = toVsSeverity(vscodeApi, diagnostic.severity)
  const diag = new vscodeApi.Diagnostic(vsRange, diagnostic.message, severity)
  diag.source = diagnostic.source
  if (diagnostic.code !== undefined) {
    diag.code = diagnostic.code as string | number
  }
  return diag
}

function toVsSeverity(
  vscodeApi: typeof vscode,
  severity: Diagnostic['severity']
): vscode.DiagnosticSeverity {
  switch (severity) {
    case 1:
      return vscodeApi.DiagnosticSeverity.Error
    case 2:
      return vscodeApi.DiagnosticSeverity.Warning
    case 3:
      return vscodeApi.DiagnosticSeverity.Information
    case 4:
      return vscodeApi.DiagnosticSeverity.Hint
    default:
      return vscodeApi.DiagnosticSeverity.Information
  }
}

function toVsRange(vscodeApi: typeof vscode, range: Range): vscode.Range {
  return new vscodeApi.Range(
    new vscodeApi.Position(range.start.line, range.start.character),
    new vscodeApi.Position(range.end.line, range.end.character)
  )
}

function toVsTextEdit(
  vscodeApi: typeof vscode,
  edit: TextEdit
): vscode.TextEdit {
  return new vscodeApi.TextEdit(toVsRange(vscodeApi, edit.range), edit.newText)
}

function toLspDiagnostic(
  diagnostic: vscode.Diagnostic,
  stored: Diagnostic[]
): Diagnostic {
  const match = stored.find((candidate) =>
    isSameDiagnostic(candidate, diagnostic)
  )
  if (match) {
    return match
  }
  return {
    range: toLspRange(diagnostic.range),
    message: diagnostic.message,
    severity: toLspSeverity(diagnostic.severity),
    source: diagnostic.source,
    code:
      typeof diagnostic.code === 'object'
        ? diagnostic.code.value
        : diagnostic.code,
  }
}

function isSameDiagnostic(
  candidate: Diagnostic,
  diagnostic: vscode.Diagnostic
): boolean {
  return (
    candidate.message === diagnostic.message &&
    candidate.range.start.line === diagnostic.range.start.line &&
    candidate.range.start.character === diagnostic.range.start.character &&
    candidate.range.end.line === diagnostic.range.end.line &&
    candidate.range.end.character === diagnostic.range.end.character &&
    candidate.code ===
      (typeof diagnostic.code === 'object'
        ? diagnostic.code.value
        : diagnostic.code)
  )
}

function toLspSeverity(
  severity: vscode.DiagnosticSeverity | undefined
): Diagnostic['severity'] {
  // Map vscode.DiagnosticSeverity enum values (0-3) to LSP severity (1-4)
  switch (severity) {
    case 0: // vscode.DiagnosticSeverity.Error
      return 1
    case 1: // vscode.DiagnosticSeverity.Warning
      return 2
    case 2: // vscode.DiagnosticSeverity.Information
      return 3
    case 3: // vscode.DiagnosticSeverity.Hint
      return 4
    default:
      return 3
  }
}
