/* @vitest-environment node */

import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { TextDocument } from 'vscode-languageserver-textdocument'
import {
  parseAndBuildAst,
  ErrorBus,
  ERROR_CODES,
  sanitizeErrorMessage,
  type ProtoError,
  type AstWithErrors,
} from '@proto-typed/core'
import {
  createEngine,
  type LanguageHost,
} from '@proto-typed/core/language'

function createLanguageHost(): LanguageHost {
  const bus = ErrorBus.get()
  const errorCache = new Map<string, ProtoError[]>()

  return {
    parse(text, uri) {
      let ast: unknown = null
      let errors: ProtoError[] = []
      try {
        const parsed = parseAndBuildAst(text)
        const astWithErrors = parsed as AstWithErrors
        if ('__errors' in astWithErrors && Array.isArray(astWithErrors.__errors)) {
          errors = [...(astWithErrors.__errors as ProtoError[])]
          delete (astWithErrors as Partial<AstWithErrors>).__errors
        }
        ast = parsed
      } catch (error) {
        errors = [
          {
            stage: 'editor',
            severity: 'fatal',
            code: ERROR_CODES.EDIT_FATAL_ERROR,
            message: sanitizeErrorMessage(error),
          },
        ]
        ast = null
      }

      errorCache.set(uri, errors)
      bus.clear()
      for (const cached of errorCache.values()) {
        if (cached.length) {
          bus.bulk(cached)
        }
      }

      return { ast, errors }
    },
  }
}

// Determine workspace root based on where tests are running from
const cwd = process.cwd()
const workspaceRoot = cwd.endsWith('packages/extension') || cwd.endsWith('packages\\extension')
  ? path.resolve(cwd, 'test-workspace')
  : path.resolve(cwd, 'packages/extension/test-workspace')

const sampleDsl = fs.readFileSync(
  path.join(workspaceRoot, 'basic-preview.pty'),
  'utf8'
)

describe('VS Code Language Engine snapshots', () => {
  it('provides deterministic completions', () => {
    const host = createLanguageHost()
    const engine = createEngine(host)
    const uri = 'file:///basic-preview.pty'
    const doc = TextDocument.create(uri, 'proto-typed', 1, sampleDsl)
    engine.open(doc)

    const completions = engine.getCompletions({
      textDocument: { uri },
      position: { line: 0, character: 0 },
      context: { triggerKind: 1 },
    })

    const normalized = completions.items.slice(0, 4).map((item) => ({
      label: typeof item.label === 'string' ? item.label : item.label.label,
      kind: item.kind,
      insertText: item.insertText,
      insertTextFormat: item.insertTextFormat,
    }))

    expect(normalized).toMatchInlineSnapshot(`
      [
        {
          "insertText": "screen \${1:ScreenName}:
      	$0",
          "insertTextFormat": 2,
          "kind": 14,
          "label": "screen",
        },
        {
          "insertText": "modal \${1:ModalName}:
      	$0",
          "insertTextFormat": 2,
          "kind": 14,
          "label": "modal",
        },
        {
          "insertText": "drawer \${1:DrawerName}:
      	$0",
          "insertTextFormat": 2,
          "kind": 14,
          "label": "drawer",
        },
        {
          "insertText": "component \${1:ComponentName}:
      	$0",
          "insertTextFormat": 2,
          "kind": 7,
          "label": "component",
        },
      ]
    `)
  })

  it('emits diagnostics for invalid DSL', () => {
    const host = createLanguageHost()
    const engine = createEngine(host)
    const uri = 'file:///invalid.pty'
    const doc = TextDocument.create(uri, 'proto-typed', 1, 'screen Invalid\n  header')
    engine.open(doc)
    const diagnostics = engine.getDiagnostics(uri).map((diag) => ({
      message: diag.message,
      code: diag.code,
      severity: diag.severity,
    }))

    expect(diagnostics).toMatchInlineSnapshot(`
      [
        {
          "code": "PTD101",
          "message": "Expecting --> : <-- but found --> '  ' <--",
          "severity": 1,
        },
      ]
    `)
  })

  it('provides hover for screen keyword', () => {
    const host = createLanguageHost()
    const engine = createEngine(host)
    const uri = 'file:///hover-test.pty'
    const dslText = 'screen Home:\n  container:\n    # Welcome'
    const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
    engine.open(doc)

    const hover = engine.getHover({
      textDocument: { uri },
      position: { line: 0, character: 2 },
    })

    expect(hover).toBeTruthy()
    expect(hover?.contents).toMatchInlineSnapshot(`
      {
        "kind": "markdown",
        "value": "**screen**

      Defines a top-level screen/page.

      \`\`\`pty
      screen Dashboard:
      	header:
      		# Welcome
      \`\`\`",
      }
    `)
  })

  it('provides hover for container keyword', () => {
    const host = createLanguageHost()
    const engine = createEngine(host)
    const uri = 'file:///hover-container.pty'
    const dslText = 'screen Home:\n  container:\n    > Text'
    const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
    engine.open(doc)

    const hover = engine.getHover({
      textDocument: { uri },
      position: { line: 1, character: 4 },
    })

    expect(hover).toBeTruthy()
    expect(hover?.contents).toMatchInlineSnapshot(`
      {
        "kind": "markdown",
        "value": "**container**

      Outer layout container that controls width and padding.

      \`container:\`",
      }
    `)
  })

  it('provides hover for button variant', () => {
    const host = createLanguageHost()
    const engine = createEngine(host)
    const uri = 'file:///hover-button.pty'
    const dslText = 'screen Home:\n  container:\n    @primary[Submit](action)'
    const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
    engine.open(doc)

    const hover = engine.getHover({
      textDocument: { uri },
      position: { line: 2, character: 6 },
    })

    expect(hover).toBeTruthy()
    expect(hover?.contents).toMatchInlineSnapshot(`
      {
        "kind": "markdown",
        "value": "**Primary button**

      High-emphasis button.

      \`@primary[Text](action)\`",
      }
    `)
  })

  it('returns null hover for unknown token', () => {
    const host = createLanguageHost()
    const engine = createEngine(host)
    const uri = 'file:///hover-unknown.pty'
    const dslText = 'screen Home:\n  unknownKeyword:\n    > Text'
    const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
    engine.open(doc)

    const hover = engine.getHover({
      textDocument: { uri },
      position: { line: 1, character: 4 },
    })

    expect(hover).toBeNull()
  })

  it('provides code actions for diagnostics', () => {
    const host = createLanguageHost()
    const engine = createEngine(host)
    const uri = 'file:///code-actions.pty'
    const dslText = 'screen Home\n  container:'
    const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
    engine.open(doc)

    const diagnostics = engine.getDiagnostics(uri)
    expect(diagnostics.length).toBeGreaterThan(0)

    const firstDiagnostic = diagnostics[0]
    const actions = engine.getCodeActions({
      textDocument: { uri },
      range: firstDiagnostic.range,
      context: { diagnostics: [firstDiagnostic] },
    })

    expect(Array.isArray(actions)).toBe(true)
  })

  it('handles document lifecycle events', () => {
    const host = createLanguageHost()
    const engine = createEngine(host)
    const uri = 'file:///lifecycle.pty'
    const doc1 = TextDocument.create(uri, 'proto-typed', 1, 'screen Invalid\n  header')
    const doc2 = TextDocument.create(uri, 'proto-typed', 2, 'screen Valid:\n  container:')

    engine.open(doc1)
    let diagnostics1 = engine.getDiagnostics(uri)
    expect(diagnostics1.length).toBeGreaterThan(0)

    engine.update(doc2)
    let diagnostics2 = engine.getDiagnostics(uri)
    expect(diagnostics2.length).toBe(0)

    engine.close(uri)
    let diagnostics3 = engine.getDiagnostics(uri)
    expect(diagnostics3.length).toBe(0)
  })

  it('provides completions with trigger characters', () => {
    const host = createLanguageHost()
    const engine = createEngine(host)
    const uri = 'file:///completions-trigger.pty'
    const doc = TextDocument.create(uri, 'proto-typed', 1, 'screen Home:\n  container:\n    @')
    engine.open(doc)

    const completions = engine.getCompletions({
      textDocument: { uri },
      position: { line: 2, character: 5 },
      context: { triggerKind: 2, triggerCharacter: '@' },
    })

    expect(completions.items.length).toBeGreaterThan(0)
    const buttonCompletions = completions.items.filter(
      (item) => typeof item.label === 'string' && item.label.startsWith('button')
    )
    expect(buttonCompletions.length).toBeGreaterThan(0)
  })
})
