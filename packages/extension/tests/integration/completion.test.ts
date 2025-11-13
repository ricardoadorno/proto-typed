/**
 * Integration Tests: Completion Provider
 * Tests autocomplete functionality for Proto-Typed DSL
 */

import * as assert from 'assert'
import * as vscode from 'vscode'
import * as path from 'path'
import { waitFor } from '../helpers/test-utils'

suite('Completion Provider Integration Tests', () => {
  const fixturesPath = path.join(__dirname, '..', 'fixtures')
  let document: vscode.TextDocument

  suiteSetup(async () => {
    // Activate extension
    const ext = vscode.extensions.getExtension(
      'proto-typed.proto-typed-vscode-extension'
    )
    if (ext && !ext.isActive) {
      await ext.activate()
    }
  })

  setup(async () => {
    const uri = vscode.Uri.file(path.join(fixturesPath, 'completions.pty'))
    document = await vscode.workspace.openTextDocument(uri)
    await vscode.window.showTextDocument(document)

    // Wait for language server to initialize
    // A more robust condition would check LSP client status, but for now,
    // we'll just wait a reasonable amount of time.
    await waitFor(
      async () => true,
      5000,
      100,
      'Language server did not initialize in time'
    )
  })

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
  })

  test('Should provide view completions at start of line', async () => {
    const position = new vscode.Position(2, 0) // Empty line
    const completions =
      await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        document.uri,
        position
      )

    assert.ok(completions, 'Completions should be provided')
    assert.ok(completions.items.length > 0, 'Should have completion items')

    // Check for view keywords
    const labels = completions.items.map((item) =>
      item.label.toString().toLowerCase()
    )
    assert.ok(labels.includes('screen'), 'Should include "screen" completion')
    assert.ok(labels.includes('modal'), 'Should include "modal" completion')
    assert.ok(labels.includes('drawer'), 'Should include "drawer" completion')
    assert.ok(
      labels.includes('component'),
      'Should include "component" completion'
    )
  })

  test('Should provide button completions after @ trigger', async () => {
    // Insert @ character to trigger completions
    const edit = new vscode.WorkspaceEdit()
    const position = new vscode.Position(3, 2)
    edit.insert(document.uri, position, '@')
    await vscode.workspace.applyEdit(edit)

    await waitFor(
      async () => {
        const completions =
          await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            document.uri,
            position.translate(0, 1),
            '@'
          )
        return completions && completions.items.length > 0
      },
      2000,
      50,
      'Completions not ready after @ trigger'
    )

    const completions =
      await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        document.uri,
        position.translate(0, 1),
        '@'
      )

    assert.ok(completions, 'Completions should be provided after @')

    const labels = completions.items.map((item) =>
      item.label.toString().toLowerCase()
    )
    assert.ok(
      labels.some(
        (label) => label.includes('button') || label.includes('primary')
      ),
      'Should include button-related completions'
    )
  })

  test('Should provide link completions after # trigger', async () => {
    const edit = new vscode.WorkspaceEdit()
    const position = new vscode.Position(3, 2)
    edit.insert(document.uri, position, '#')
    await vscode.workspace.applyEdit(edit)

    await waitFor(
      async () => {
        const completions =
          await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            document.uri,
            position.translate(0, 1),
            '#'
          )
        return completions && completions.items.length > 0
      },
      2000,
      50,
      'Completions not ready after # trigger'
    )

    const completions =
      await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        document.uri,
        position.translate(0, 1),
        '#'
      )

    assert.ok(completions, 'Completions should be provided after #')
    assert.ok(
      completions.items.length > 0,
      'Should have completion items after #'
    )
  })

  test('Should provide input completions after _ trigger', async () => {
    const edit = new vscode.WorkspaceEdit()
    const position = new vscode.Position(3, 2)
    await waitFor(
      async () => {
        const completions =
          await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            document.uri,
            position.translate(0, 3),
            '_'
          )
        return completions && completions.items.length > 0
      },
      2000,
      50,
      'Completions not ready after _ trigger'
    )

    const completions =
      await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        document.uri,
        position.translate(0, 3),
        '_'
      )

    assert.ok(completions, 'Completions should be provided after ___')

    const labels = completions.items.map((item) =>
      item.label.toString().toLowerCase()
    )
    assert.ok(
      labels.some(
        (label) => label.includes('input') || label.includes('password')
      ),
      'Should include input-related completions'
    )
  })

  test('Should provide layout completions', async () => {
    const position = new vscode.Position(2, 2)
    const completions =
      await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        document.uri,
        position
      )

    assert.ok(completions, 'Completions should be provided')

    const labels = completions.items.map((item) =>
      item.label.toString().toLowerCase()
    )
    assert.ok(
      labels.includes('container'),
      'Should include "container" completion'
    )
    assert.ok(labels.includes('card'), 'Should include "card" completion')
    assert.ok(labels.includes('stack'), 'Should include "stack" completion')
    assert.ok(labels.includes('row'), 'Should include "row" completion')
    assert.ok(labels.includes('grid'), 'Should include "grid" completion')
  })

  test('Should provide component prop completions after %', async () => {
    const edit = new vscode.WorkspaceEdit()
    const position = new vscode.Position(3, 2)
    edit.insert(document.uri, position, '%')
    await vscode.workspace.applyEdit(edit)

    await waitFor(
      async () => {
        const completions =
          await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            document.uri,
            position.translate(0, 1),
            '%'
          )
        return completions && completions.items.length > 0
      },
      2000,
      50,
      'Completions not ready after % trigger'
    )

    const completions =
      await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        document.uri,
        position.translate(0, 1),
        '%'
      )

    assert.ok(completions, 'Completions should be provided after %')

    const labels = completions.items.map((item) =>
      item.label.toString().toLowerCase()
    )
    assert.ok(
      labels.some((label) => label.includes('prop')),
      'Should include prop-related completions'
    )
  })

  test('Completion items should have proper snippet support', async () => {
    const position = new vscode.Position(2, 0)
    const completions =
      await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        document.uri,
        position
      )

    const screenCompletion = completions.items.find(
      (item) => item.label.toString().toLowerCase() === 'screen'
    )

    assert.ok(screenCompletion, 'Should find screen completion')
    assert.ok(
      screenCompletion.insertText instanceof vscode.SnippetString,
      'Screen completion should use snippet'
    )
  })

  test('Completion items should have documentation', async () => {
    const position = new vscode.Position(2, 0)
    const completions =
      await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        document.uri,
        position
      )

    const screenCompletion = completions.items.find(
      (item) => item.label.toString().toLowerCase() === 'screen'
    )

    assert.ok(screenCompletion, 'Should find screen completion')
    assert.ok(
      screenCompletion.documentation,
      'Completion should have documentation'
    )
  })
})
