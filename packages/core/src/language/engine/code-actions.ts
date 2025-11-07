import type {
  CodeAction,
  CodeActionParams,
  Range,
} from 'vscode-languageserver-protocol'
import { CodeActionKind, TextEdit } from 'vscode-languageserver-types'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { DiagnosticWithData } from './diagnostics'

export function getCodeActions(
  params: CodeActionParams,
  document: TextDocument
): CodeAction[] {
  const actions: CodeAction[] = []
  const diagnostics = params.context.diagnostics as DiagnosticWithData[]

  for (const diagnostic of diagnostics) {
    switch (diagnostic.code) {
      case 'PTD102': {
        const action = fixMissingColon(document, diagnostic)
        if (action) {
          actions.push(action)
        }
        break
      }
      case 'PTD103': {
        const action = fixMissingIndent(document, diagnostic)
        if (action) {
          actions.push(action)
        }
        break
      }
      default:
        break
    }
  }

  return actions
}

function fixMissingColon(
  document: TextDocument,
  diagnostic: DiagnosticWithData
): CodeAction | null {
  const { line } = diagnostic.range.start
  const { end, text } = getLineInfo(document, line)
  if (text.trimEnd().endsWith(':')) {
    return null
  }

  return {
    title: 'Inserir ":" no final da declaração',
    kind: CodeActionKind.QuickFix,
    diagnostics: [diagnostic],
    edit: {
      changes: {
        [document.uri]: [TextEdit.insert(end, ':')],
      },
    },
  }
}

function fixMissingIndent(
  document: TextDocument,
  diagnostic: DiagnosticWithData
): CodeAction | null {
  const line = diagnostic.range.start.line

  return {
    title: 'Adicionar indentação esperada',
    kind: CodeActionKind.QuickFix,
    diagnostics: [diagnostic],
    edit: {
      changes: {
        [document.uri]: [TextEdit.insert({ line, character: 0 }, '\t')],
      },
    },
  }
}

function getLineInfo(
  document: TextDocument,
  line: number
): { text: string; end: Range['end'] } {
  const fullText = document.getText()
  const startOffset = document.offsetAt({ line, character: 0 })
  let endOffset = fullText.indexOf('\n', startOffset)
  if (endOffset === -1) {
    endOffset = fullText.length
  }
  const text = fullText.slice(startOffset, endOffset)
  const end = document.positionAt(endOffset)
  return { text, end }
}
