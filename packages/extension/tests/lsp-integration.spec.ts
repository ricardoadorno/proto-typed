/* @vitest-environment node */

import { describe, it, expect, beforeEach } from 'vitest'
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
  type LanguageEngine,
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
        if (
          '__errors' in astWithErrors &&
          Array.isArray(astWithErrors.__errors)
        ) {
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

describe('LSP Integration Tests - Comprehensive', () => {
  let host: LanguageHost
  let engine: LanguageEngine

  beforeEach(() => {
    host = createLanguageHost()
    engine = createEngine(host)
  })

  describe('Hover Functionality', () => {
    it('should provide hover for screen keyword at various positions', () => {
      const uri = 'file:///hover-screen.pty'
      const dslText = 'screen Home:\n  container:\n    # Welcome'
      const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
      engine.open(doc)

      // Test at start of 'screen'
      const hover1 = engine.getHover({
        textDocument: { uri },
        position: { line: 0, character: 0 },
      })
      expect(hover1).toBeTruthy()
      expect(hover1?.contents).toHaveProperty('kind', 'markdown')
      expect((hover1?.contents as any).value).toContain('**screen**')

      // Test at middle of 'screen'
      const hover2 = engine.getHover({
        textDocument: { uri },
        position: { line: 0, character: 3 },
      })
      expect(hover2).toBeTruthy()
      expect((hover2?.contents as any).value).toContain('**screen**')

      // Test at end of 'screen'
      const hover3 = engine.getHover({
        textDocument: { uri },
        position: { line: 0, character: 5 },
      })
      expect(hover3).toBeTruthy()
      expect((hover3?.contents as any).value).toContain('**screen**')
    })

    it('should provide hover for all layout keywords', () => {
      const keywords = [
        { keyword: 'container', line: 1, char: 4 },
        { keyword: 'row', line: 2, char: 6 },
        { keyword: 'col', line: 3, char: 8 },
        { keyword: 'card', line: 4, char: 10 },
      ]

      const dslText = `screen Home:
  container:
    row:
      col:
        card:
          # Test`

      const uri = 'file:///hover-layouts.pty'
      const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
      engine.open(doc)

      for (const { keyword, line, char } of keywords) {
        const hover = engine.getHover({
          textDocument: { uri },
          position: { line, character: char },
        })
        expect(
          hover,
          `Hover for ${keyword} at line ${line}, char ${char} should not be null`
        ).toBeTruthy()
        expect((hover?.contents as any).value).toContain(`**${keyword}**`)
      }
    })

    it('should provide hover for grid keyword specifically', () => {
      const uri = 'file:///hover-grid.pty'
      const dslText = 'screen Home:\n  container:\n    grid:\n      > Test'
      const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
      engine.open(doc)

      const hover = engine.getHover({
        textDocument: { uri },
        position: { line: 2, character: 6 },
      })
      expect(hover).toBeTruthy()
      expect((hover?.contents as any).value).toContain('**grid**')
    })

    it('should provide hover for button variants', () => {
      const buttons = [
        '@primary',
        '@secondary',
        '@ghost',
        '@outline',
        '@destructive',
        '@success',
        '@warning',
      ]

      for (const button of buttons) {
        const dslText = `screen Home:\n  container:\n    ${button}[Click](action)`
        const uri = `file:///hover-${button}.pty`
        const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
        engine.open(doc)

        const hover = engine.getHover({
          textDocument: { uri },
          position: { line: 2, character: 6 },
        })
        expect(hover, `Hover for ${button} should not be null`).toBeTruthy()
        expect((hover?.contents as any).value).toContain('button')
      }
    })

    it('should return null for non-keyword text', () => {
      const uri = 'file:///hover-text.pty'
      const dslText = 'screen Home:\n  container:\n    > Some random text'
      const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
      engine.open(doc)

      const hover = engine.getHover({
        textDocument: { uri },
        position: { line: 2, character: 10 }, // In middle of 'Some'
      })
      expect(hover).toBeNull()
    })
  })

  describe('Autocomplete/Completion Functionality', () => {
    it('should provide completions at start of line', () => {
      const uri = 'file:///completion-start.pty'
      const dslText = 'screen Home:\n  container:\n    '
      const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
      engine.open(doc)

      const completions = engine.getCompletions({
        textDocument: { uri },
        position: { line: 2, character: 4 },
        context: { triggerKind: 1 },
      })

      expect(completions.items.length).toBeGreaterThan(0)
      const labels = completions.items.map((item) =>
        typeof item.label === 'string' ? item.label : item.label.label
      )
      expect(labels).toContain('screen')
      expect(labels).toContain('container')
      expect(labels).toContain('row')
    })

    it('should provide button completions after @ trigger', () => {
      const uri = 'file:///completion-button.pty'
      const dslText = 'screen Home:\n  container:\n    @'
      const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
      engine.open(doc)

      const completions = engine.getCompletions({
        textDocument: { uri },
        position: { line: 2, character: 5 },
        context: { triggerKind: 2, triggerCharacter: '@' },
      })

      expect(completions.items.length).toBeGreaterThan(0)
      const labels = completions.items.map((item) =>
        typeof item.label === 'string' ? item.label : item.label.label
      )

      // Should include button completions
      const buttonLabels = labels.filter(
        (l) => l.includes('button') || l.includes('@')
      )
      expect(
        buttonLabels.length,
        'Should have button completions'
      ).toBeGreaterThan(0)
    })

    it('should provide form input completions after ___ trigger', () => {
      const uri = 'file:///completion-input.pty'
      const dslText = 'screen Home:\n  container:\n    ___'
      const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
      engine.open(doc)

      const completions = engine.getCompletions({
        textDocument: { uri },
        position: { line: 2, character: 7 },
        context: { triggerKind: 2, triggerCharacter: '_' },
      })

      expect(completions.items.length).toBeGreaterThan(0)
      const labels = completions.items.map((item) =>
        typeof item.label === 'string' ? item.label : item.label.label
      )

      // Should include form input completions
      const inputLabels = labels.filter(
        (l) => l.includes('input') || l.includes('___')
      )
      expect(
        inputLabels.length,
        'Should have input completions'
      ).toBeGreaterThan(0)
    })

    it('should provide completions with snippet format', () => {
      const uri = 'file:///completion-snippet.pty'
      const dslText = ''
      const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
      engine.open(doc)

      const completions = engine.getCompletions({
        textDocument: { uri },
        position: { line: 0, character: 0 },
        context: { triggerKind: 1 },
      })

      const screenCompletion = completions.items.find((item) => {
        const label =
          typeof item.label === 'string' ? item.label : item.label.label
        return label === 'screen'
      })

      expect(screenCompletion).toBeTruthy()
      expect(screenCompletion?.insertText).toBeTruthy()
      expect(screenCompletion?.insertTextFormat).toBe(2) // Snippet format
      expect(screenCompletion?.insertText).toContain('${1')
    })
  })

  describe('Diagnostics', () => {
    it('should emit diagnostics for syntax errors', () => {
      const uri = 'file:///diagnostics-error.pty'
      const dslText = 'screen Invalid\n  header'
      const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)

      let diagnosticsEmitted = false
      let emittedDiagnostics: any[] = []

      const unsubscribe = engine.onDiagnostics((emittedUri, diagnostics) => {
        if (emittedUri === uri) {
          diagnosticsEmitted = true
          emittedDiagnostics = diagnostics
        }
      })

      engine.open(doc)

      expect(diagnosticsEmitted, 'Diagnostics should be emitted').toBe(true)
      expect(emittedDiagnostics.length).toBeGreaterThan(0)
      expect(emittedDiagnostics[0].severity).toBe(1) // Error

      unsubscribe()
    })

    it('should clear diagnostics for valid DSL', () => {
      const uri = 'file:///diagnostics-valid.pty'
      const dslText = 'screen Home:\n  container:\n    # Welcome'
      const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)

      let emittedDiagnostics: any[] = []

      const unsubscribe = engine.onDiagnostics((emittedUri, diagnostics) => {
        if (emittedUri === uri) {
          emittedDiagnostics = diagnostics
        }
      })

      engine.open(doc)

      expect(emittedDiagnostics.length).toBe(0)

      unsubscribe()
    })
  })

  describe('Document Lifecycle', () => {
    it('should handle open, update, and close events', () => {
      const uri = 'file:///lifecycle-test.pty'

      // Open with error
      const doc1 = TextDocument.create(uri, 'proto-typed', 1, 'screen Invalid')
      engine.open(doc1)
      let diag1 = engine.getDiagnostics(uri)
      expect(diag1.length).toBeGreaterThan(0)

      // Update to valid
      const doc2 = TextDocument.create(
        uri,
        'proto-typed',
        2,
        'screen Valid:\n  container:'
      )
      engine.update(doc2)
      let diag2 = engine.getDiagnostics(uri)
      expect(diag2.length).toBe(0)

      // Close
      engine.close(uri)
      let diag3 = engine.getDiagnostics(uri)
      expect(diag3.length).toBe(0)
    })
  })

  describe('Code Actions', () => {
    it('should provide code actions for diagnostics', () => {
      const uri = 'file:///code-actions-test.pty'
      const dslText = 'screen Invalid\n  container:'
      const doc = TextDocument.create(uri, 'proto-typed', 1, dslText)
      engine.open(doc)

      const diagnostics = engine.getDiagnostics(uri)
      expect(diagnostics.length).toBeGreaterThan(0)

      const actions = engine.getCodeActions({
        textDocument: { uri },
        range: diagnostics[0].range,
        context: { diagnostics: [diagnostics[0]] },
      })

      expect(Array.isArray(actions)).toBe(true)
    })
  })
})
