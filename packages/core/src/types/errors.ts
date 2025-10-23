export type Severity = 'info' | 'warning' | 'error' | 'fatal'

export const SEVERITY_RANK: Record<Severity, number> = {
  info: 1,
  warning: 2,
  error: 3,
  fatal: 4,
}

export type Stage = 'lexer' | 'parser' | 'builder' | 'renderer' | 'editor'

export interface ProtoErrorBase {
  stage: Stage
  code: string
  severity: Severity
  message: string
  hint?: string
  line?: number
  column?: number
  length?: number
  nodeId?: string
  sourceSnippet?: string
  fatal?: boolean
  messageKey?: string
  messageParams?: Record<string, string | number>
}

export type ProtoError =
  | (ProtoErrorBase & {
      stage: 'lexer'
      token?: string
      expected?: string[]
    })
  | (ProtoErrorBase & {
      stage: 'parser'
      rule?: string
      unexpected?: string
      expected?: string[]
    })
  | (ProtoErrorBase & {
      stage: 'builder'
      builder?: string
      nodeType?: string
    })
  | (ProtoErrorBase & {
      stage: 'renderer'
      nodeType?: string
      component?: string
      recoverable?: boolean
    })
  | (ProtoErrorBase & {
      stage: 'editor'
      source?: 'monaco' | 'runtime'
    })

export const ERROR_CODES = {
  LEX_INVALID_TOKEN: 'PT-LEX-1001',
  LEX_UNEXPECTED_CHAR: 'PT-LEX-1002',
  PARSE_SYNTAX_ERROR: 'PT-PARSE-1001',
  PARSE_EXPECTED_NAME: 'PT-PARSE-1002',
  PARSE_EXPECTED_COLON: 'PT-PARSE-1003',
  PARSE_EXPECTED_INDENT: 'PT-PARSE-1004',
  PARSE_UNEXPECTED_TOKEN: 'PT-PARSE-1005',
  BLD_INVALID_MODIFIERS: 'PT-BLD-2001',
  BLD_INVALID_PROPS: 'PT-BLD-2002',
  BLD_MISSING_REQUIRED: 'PT-BLD-2003',
  REND_GENERIC_ERROR: 'PT-REND-3001',
  REND_MISSING_PROP: 'PT-REND-3002',
  REND_INVALID_NAV: 'PT-REND-3003',
  REND_COMPONENT_ERROR: 'PT-REND-3004',
  EDIT_FATAL_ERROR: 'PT-EDIT-4001',
  EDIT_MONACO_ERROR: 'PT-EDIT-4002',
} as const

export function isMoreSevere(a: Severity, b: Severity): boolean {
  return SEVERITY_RANK[a] > SEVERITY_RANK[b]
}

export function sanitizeErrorMessage(error: unknown, maxLength = 80): string {
  const rawMsg = error instanceof Error ? error.message : String(error)
  return rawMsg.split('\n')[0].slice(0, maxLength)
}
