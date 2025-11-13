/**
 * E2E Tests: Extension Activation and Commands
 * Tests the core extension functionality end-to-end
 */

import * as assert from 'assert'
import * as vscode from 'vscode'
import * as path from 'path'
import { waitFor } from '../helpers/test-utils'

suite('Extension E2E Tests', () => {
  const fixturesPath = path.join(__dirname, '..', 'fixtures')

  suiteSetup(async () => {
    const ext = vscode.extensions.getExtension(
      'proto-typed.proto-typed-vscode-extension'
    )
    if (ext && !ext.isActive) {
      await ext.activate()
    }
  })

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors')
  })

  test('Extension should be present', () => {
    const ext = vscode.extensions.getExtension(
      'proto-typed.proto-typed-vscode-extension'
    )
    assert.ok(ext, 'Extension should be installed')
  })

  test('Extension should activate', async () => {
    const ext = vscode.extensions.getExtension(
      'proto-typed.proto-typed-vscode-extension'
    )
    assert.ok(ext, 'Extension should be installed')

    if (!ext.isActive) {
      await ext.activate()
    }

    assert.strictEqual(ext.isActive, true, 'Extension should be activated')
  })

  test('Extension should register proto-typed.showPreview command', async () => {
    const commands = await vscode.commands.getCommands(true)
    assert.ok(
      commands.includes('proto-typed.showPreview'),
      'Command proto-typed.showPreview should be registered'
    )
  })

  test('Extension should register proto-typed.getLastRender command', async () => {
    const commands = await vscode.commands.getCommands(true)
    assert.ok(
      commands.includes('proto-typed.getLastRender'),
      'Command proto-typed.getLastRender should be registered'
    )
  })

  test('Extension should register proto-typed language', async () => {
    const languages = await vscode.languages.getLanguages()
    assert.ok(
      languages.includes('proto-typed'),
      'Language proto-typed should be registered'
    )
  })

  test('Should recognize .pty files as proto-typed language', async () => {
    const uri = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const document = await vscode.workspace.openTextDocument(uri)

    assert.strictEqual(
      document.languageId,
      'proto-typed',
      '.pty files should be recognized as proto-typed language'
    )

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
  })

  test('Extension should provide completion provider', async () => {
    const uri = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const document = await vscode.workspace.openTextDocument(uri)
    await vscode.window.showTextDocument(document)

    const position = new vscode.Position(0, 0)

    await waitFor(
      async () => {
        const completions =
          await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            document.uri,
            position
          )
        return completions && completions.items.length > 0
      },
      2000,
      50,
      'Completions not ready in time'
    )

    const completions =
      await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        document.uri,
        position
      )

    assert.ok(completions, 'Completion provider should be registered')
    assert.ok(completions.items.length > 0, 'Should provide completions')

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
  })

  test('Extension should provide hover information', async () => {
    const uri = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const document = await vscode.workspace.openTextDocument(uri)
    await vscode.window.showTextDocument(document)

    const text = document.getText()
    const screenIndex = text.indexOf('screen')
    const position = document.positionAt(screenIndex + 2)

    await waitFor(
      async () => {
        const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
          'vscode.executeHoverProvider',
          document.uri,
          position
        )
        // Hover provider should be registered (may or may not provide hover for specific position)
        return Array.isArray(hovers)
      },
      2000,
      50,
      'Hover not ready in time'
    )

    const hoversResult = await vscode.commands.executeCommand<vscode.Hover[]>(
      'vscode.executeHoverProvider',
      document.uri,
      position
    )

    // Hover provider should be registered (may or may not provide hover for specific position)
    assert.ok(
      Array.isArray(hoversResult),
      'Hover provider should be registered'
    )

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
  })

  test('Extension should provide diagnostics', async () => {
    const uri = vscode.Uri.file(path.join(fixturesPath, 'invalid.pty'))
    const document = await vscode.workspace.openTextDocument(uri)
    await vscode.window.showTextDocument(document)

    await waitFor(
      async () => {
        return vscode.languages.getDiagnostics(uri).length > 0
      },
      5000,
      100,
      'Diagnostics not provided in time'
    )

    const diagnosticsResult = vscode.languages.getDiagnostics(uri)
    assert.ok(
      diagnosticsResult.length > 0,
      'Should provide diagnostics for invalid file'
    )

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
  })

  test('Extension API should be available', async () => {
    const ext = vscode.extensions.getExtension(
      'proto-typed.proto-typed-vscode-extension'
    )
    assert.ok(ext, 'Extension should be installed')

    if (!ext.isActive) {
      await ext.activate()
    }

    const api = ext.exports
    assert.ok(api, 'Extension should export API')
    assert.ok(typeof api === 'object', 'API should be an object')
  })

  test('Extension should handle multiple file openings', async () => {
    const ext = vscode.extensions.getExtension(
      'proto-typed.proto-typed-vscode-extension'
    )
    if (ext && !ext.isActive) {
      await ext.activate()
    }

    const uri1 = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const uri2 = vscode.Uri.file(path.join(fixturesPath, 'completions.pty'))

    const doc1 = await vscode.workspace.openTextDocument(uri1)
    await waitFor(
      async () => {
        return (
          vscode.workspace.textDocuments.filter(
            (doc) => doc.languageId === 'proto-typed'
          ).length >= 1
        )
      },
      2000,
      50,
      'First document not opened in time'
    )

    const doc2 = await vscode.workspace.openTextDocument(uri2)
    await vscode.window.showTextDocument(doc2)

    await waitFor(
      async () => {
        return (
          vscode.workspace.textDocuments.filter(
            (doc) => doc.languageId === 'proto-typed'
          ).length >= 2
        )
      },
      2000,
      50,
      'Second document not opened in time'
    )

    // Both documents should be open
    const openDocs = vscode.workspace.textDocuments.filter(
      (doc) => doc.languageId === 'proto-typed'
    )

    assert.ok(openDocs.length >= 2, 'Should handle multiple open files')

    await vscode.commands.executeCommand('workbench.action.closeAllEditors')
  })
})
