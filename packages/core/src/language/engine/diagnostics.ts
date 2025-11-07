import { ERROR_CODES, type ProtoError } from '../../types/errors'
import type { Diagnostic, Range } from 'vscode-languageserver-protocol'
import { DiagnosticSeverity } from 'vscode-languageserver-types'
import { TextDocument } from 'vscode-languageserver-textdocument'

const DEFAULT_CODE = 'PTD000'

const CODE_MAP: Record<string, string> = {
  [ERROR_CODES.PARSE_SYNTAX_ERROR]: 'PTD101',
  [ERROR_CODES.PARSE_EXPECTED_COLON]: 'PTD102',
  [ERROR_CODES.PARSE_EXPECTED_INDENT]: 'PTD103',
  [ERROR_CODES.PARSE_EXPECTED_NAME]: 'PTD104',
  [ERROR_CODES.PARSE_UNEXPECTED_TOKEN]: 'PTD105',
  [ERROR_CODES.LEX_INVALID_TOKEN]: 'PTD201',
  [ERROR_CODES.LEX_UNEXPECTED_CHAR]: 'PTD202',
  [ERROR_CODES.BLD_INVALID_MODIFIERS]: 'PTD301',
  [ERROR_CODES.BLD_INVALID_PROPS]: 'PTD302',
  [ERROR_CODES.BLD_MISSING_REQUIRED]: 'PTD303',
  [ERROR_CODES.REND_GENERIC_ERROR]: 'PTD401',
  [ERROR_CODES.REND_MISSING_PROP]: 'PTD402',
  [ERROR_CODES.REND_INVALID_NAV]: 'PTD403',
  [ERROR_CODES.REND_COMPONENT_ERROR]: 'PTD404',
  [ERROR_CODES.EDIT_FATAL_ERROR]: 'PTD501',
  [ERROR_CODES.EDIT_MONACO_ERROR]: 'PTD502',
  [ERROR_CODES.DSL_DEPRECATED_LINK]: 'PTD601',
}

export interface DiagnosticWithData extends Diagnostic {
  data?: {
    coreError: ProtoError
  }
}

export function mapCoreErrorsToDiagnostics(
  errors: ProtoError[],
  document: TextDocument
): DiagnosticWithData[] {
  return errors.map((error) => {
    const range = toRange(error, document)
    const severity = toSeverity(error)
    const message = error.hint
      ? `${error.message} — ${error.hint}`
      : error.message

    return {
      range,
      severity,
      message,
      source: `proto-typed/${error.stage}`,
      code: CODE_MAP[error.code] ?? DEFAULT_CODE,
      data: { coreError: error },
    }
  })
}

function toRange(error: ProtoError, document: TextDocument): Range {
  const zeroLine = Math.max((error.line ?? 1) - 1, 0)
  const zeroChar = Math.max((error.column ?? 1) - 1, 0)
  const start = { line: zeroLine, character: zeroChar }
  const startOffset = document.offsetAt(start)

  const errorLength =
    error.length && error.length > 0
      ? error.length
      : guessTokenLength(document, startOffset)
  const endOffset = Math.min(
    document.getText().length,
    startOffset + errorLength
  )
  const end = document.positionAt(endOffset)

  return { start, end }
}

function guessTokenLength(document: TextDocument, startOffset: number): number {
  const text = document.getText()
  if (startOffset >= text.length) {
    return 1
  }

  const endOfLine = text.indexOf('\n', startOffset)
  const limit = endOfLine === -1 ? text.length : endOfLine
  let offset = startOffset

  while (offset < limit && !/\s/.test(text[offset])) {
    offset += 1
  }

  return Math.max(offset - startOffset, 1)
}

function toSeverity(error: ProtoError): DiagnosticSeverity {
  switch (error.severity) {
    case 'fatal':
    case 'error':
      return DiagnosticSeverity.Error
    case 'warning':
      return DiagnosticSeverity.Warning
    case 'info':
    default:
      return DiagnosticSeverity.Information
  }
}
