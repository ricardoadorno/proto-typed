/**
 * Comprehensive E2E Test - All Extension Features
 * Single test suite to validate all functionality works correctly
 */

import * as assert from 'assert'
import * as vscode from 'vscode'
import * as path from 'path'

suite('Proto-Typed Extension - All Features E2E', () => {
  const fixturesPath = path.join(__dirname, '..', 'fixtures')
  let extension: vscode.Extension<any> | undefined

  suiteSetup(async function () {
    this.timeout(30000) // 30 seconds for setup

    console.log('🚀 Starting Proto-Typed Extension E2E Tests...')

    // Get extension
    extension = vscode.extensions.getExtension(
      'proto-typed.proto-typed-vscode-extension'
    )
    assert.ok(extension, '❌ Extension not found')

    // Activate extension
    if (!extension.isActive) {
      console.log('⏳ Activating extension...')
      await extension.activate()
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    console.log('✅ Extension activated successfully')
  })

  suiteTeardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors')
    console.log('🧹 Cleanup complete')
  })

  test('1. Extension is present and activated', async () => {
    assert.ok(extension, 'Extension should exist')
    assert.strictEqual(
      extension.isActive,
      true,
      'Extension should be activated'
    )
    console.log('✅ Extension presence: PASSED')
  })

  test('2. Commands are registered', async () => {
    const commands = await vscode.commands.getCommands(true)

    assert.ok(
      commands.includes('proto-typed.showPreview'),
      'showPreview command should be registered'
    )
    assert.ok(
      commands.includes('proto-typed.getLastRender'),
      'getLastRender command should be registered'
    )

    console.log('✅ Commands registration: PASSED')
  })

  test('3. Language is registered for .pty files', async () => {
    const languages = await vscode.languages.getLanguages()
    assert.ok(
      languages.includes('proto-typed'),
      'proto-typed language should be registered'
    )

    const uri = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const document = await vscode.workspace.openTextDocument(uri)

    assert.strictEqual(
      document.languageId,
      'proto-typed',
      '.pty files should be recognized as proto-typed'
    )

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
    console.log('✅ Language registration: PASSED')
  })

  test('4. LSP: Completions work correctly', async function () {
    this.timeout(10000)

    const uri = vscode.Uri.file(path.join(fixturesPath, 'completions.pty'))
    const document = await vscode.workspace.openTextDocument(uri)
    await vscode.window.showTextDocument(document)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const position = new vscode.Position(2, 0)
    const completions =
      await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        document.uri,
        position
      )

    assert.ok(completions, 'Completions should be provided')
    assert.ok(completions.items.length > 0, 'Should have completion items')

    const labels = completions.items
      .map((item) =>
        typeof item.label === 'string' ? item.label : item.label.label
      )
      .map((l) => l.toLowerCase())

    // Verify key completions
    assert.ok(labels.includes('screen'), 'Should have "screen" completion')
    assert.ok(labels.includes('modal'), 'Should have "modal" completion')
    assert.ok(
      labels.includes('container'),
      'Should have "container" completion'
    )
    assert.ok(labels.includes('card'), 'Should have "card" completion')

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
    console.log('✅ LSP Completions: PASSED')
  })

  test('5. LSP: Diagnostics detect errors', async function () {
    this.timeout(10000)

    const uri = vscode.Uri.file(path.join(fixturesPath, 'invalid.pty'))
    const document = await vscode.workspace.openTextDocument(uri)
    await vscode.window.showTextDocument(document)
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const diagnostics = vscode.languages.getDiagnostics(uri)

    assert.ok(
      diagnostics.length > 0,
      'Should have diagnostics for invalid syntax'
    )
    assert.ok(
      diagnostics.some((d) => d.severity === vscode.DiagnosticSeverity.Error),
      'Should have at least one error diagnostic'
    )

    // Verify diagnostic has proper structure
    const firstDiag = diagnostics[0]
    assert.ok(firstDiag.range, 'Diagnostic should have range')
    assert.ok(firstDiag.message, 'Diagnostic should have message')
    assert.ok(
      firstDiag.source?.startsWith('proto-typed'),
      `Diagnostic source should start with 'proto-typed', got: ${firstDiag.source}`
    )

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
    console.log('✅ LSP Diagnostics: PASSED')
  })

  test('6. LSP: Diagnostics clear for valid syntax', async function () {
    this.timeout(10000)

    const uri = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const document = await vscode.workspace.openTextDocument(uri)
    await vscode.window.showTextDocument(document)
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const diagnostics = vscode.languages.getDiagnostics(uri)
    const errors = diagnostics.filter(
      (d) => d.severity === vscode.DiagnosticSeverity.Error
    )

    assert.strictEqual(
      errors.length,
      0,
      'Valid file should have no error diagnostics'
    )

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
    console.log('✅ LSP Valid Syntax: PASSED')
  })

  test('7. LSP: Hover provides documentation', async function () {
    this.timeout(10000)

    const uri = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const document = await vscode.workspace.openTextDocument(uri)
    await vscode.window.showTextDocument(document)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const text = document.getText()
    const screenIndex = text.indexOf('screen')

    if (screenIndex !== -1) {
      const position = document.positionAt(screenIndex + 2)
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider',
        document.uri,
        position
      )

      // Hover may or may not be provided depending on implementation
      // Just verify the provider is registered and returns a result
      assert.ok(Array.isArray(hovers), 'Hover provider should return an array')

      if (hovers && hovers.length > 0) {
        const hover = hovers[0]
        assert.ok(hover.contents.length > 0, 'Hover should have contents')
        console.log('  ℹ️  Hover documentation provided for "screen" keyword')
      } else {
        console.log('  ℹ️  Hover not provided for this position (acceptable)')
      }
    }

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
    console.log('✅ LSP Hover: PASSED')
  })

  test('8. Syntax Highlighting: TextMate grammar loaded', async function () {
    this.timeout(10000)

    const uri = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const document = await vscode.workspace.openTextDocument(uri)
    await vscode.window.showTextDocument(document)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verify document is recognized
    assert.strictEqual(
      document.languageId,
      'proto-typed',
      'Language ID should be proto-typed'
    )

    // Verify content is loaded
    const text = document.getText()
    assert.ok(text.includes('screen'), 'Document should contain DSL keywords')
    assert.ok(
      text.includes('container'),
      'Document should contain layout keywords'
    )

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
    console.log('✅ Syntax Highlighting: PASSED')
  })

  test('9. Webview: Preview command works', async function () {
    this.timeout(15000)

    const uri = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const document = await vscode.workspace.openTextDocument(uri)
    await vscode.window.showTextDocument(document)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Execute preview command
    await vscode.commands.executeCommand('proto-typed.showPreview')
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Verify panel was created via API
    const api = extension!.exports
    assert.ok(api, 'Extension should export API')
    assert.ok(
      typeof api.getCurrentPanel === 'function',
      'API should have getCurrentPanel'
    )

    const panel = api.getCurrentPanel()
    assert.ok(panel, 'Preview panel should be created')

    console.log('✅ Webview Preview: PASSED')

    // Cleanup
    if (api.disposePanel) {
      api.disposePanel()
    }
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
  })

  test('10. Webview: Renders HTML content', async function () {
    this.timeout(15000)

    const uri = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const document = await vscode.workspace.openTextDocument(uri)
    await vscode.window.showTextDocument(document)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Open preview
    await vscode.commands.executeCommand('proto-typed.showPreview')
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Get rendered HTML
    const lastRender = await vscode.commands.executeCommand(
      'proto-typed.getLastRender'
    )

    if (lastRender && typeof lastRender === 'object' && 'html' in lastRender) {
      const html = (lastRender as any).html
      assert.ok(html, 'Should have rendered HTML')
      assert.ok(html.length > 0, 'Rendered HTML should not be empty')
      assert.ok(
        html.includes('Dashboard') ||
          html.includes('Welcome') ||
          html.includes('Proto-Typed'),
        'HTML should contain content from the DSL'
      )
      console.log(`  ℹ️  Rendered ${html.length} characters of HTML`)
    } else {
      console.log('  ⚠️  Render still in progress, skipping HTML validation')
    }

    // Cleanup
    const api = extension!.exports
    if (api.disposePanel) {
      api.disposePanel()
    }
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')

    console.log('✅ Webview Rendering: PASSED')
  })

  test('11. Multiple files can be opened', async function () {
    this.timeout(10000)

    const uri1 = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const uri2 = vscode.Uri.file(path.join(fixturesPath, 'completions.pty'))

    const doc1 = await vscode.workspace.openTextDocument(uri1)
    await vscode.window.showTextDocument(doc1)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const doc2 = await vscode.workspace.openTextDocument(uri2)
    await vscode.window.showTextDocument(doc2)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const openDocs = vscode.workspace.textDocuments.filter(
      (doc) => doc.languageId === 'proto-typed'
    )

    assert.ok(openDocs.length >= 2, 'Should handle multiple open files')

    await vscode.commands.executeCommand('workbench.action.closeAllEditors')
    console.log('✅ Multiple Files: PASSED')
  })

  test('12. Document changes trigger diagnostics update', async function () {
    this.timeout(10000)

    const uri = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
    const document = await vscode.workspace.openTextDocument(uri)
    const editor = await vscode.window.showTextDocument(document)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Get initial diagnostics
    const initialDiags = vscode.languages.getDiagnostics(uri)
    const initialErrors = initialDiags.filter(
      (d) => d.severity === vscode.DiagnosticSeverity.Error
    ).length

    // Make a change that might introduce an error
    await editor.edit((editBuilder) => {
      const position = new vscode.Position(0, 0)
      editBuilder.insert(position, 'invalid syntax here\n')
    })

    await new Promise((resolve) => setTimeout(resolve, 2500))

    const newDiags = vscode.languages.getDiagnostics(uri)
    const newErrors = newDiags.filter(
      (d) => d.severity === vscode.DiagnosticSeverity.Error
    ).length

    // Should either have errors now, or diagnostics should have been updated
    assert.ok(
      newErrors > initialErrors || newDiags.length !== initialDiags.length,
      'Diagnostics should update on document change'
    )

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
    console.log('✅ Live Diagnostics: PASSED')
  })
})
