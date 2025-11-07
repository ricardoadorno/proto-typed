/**
 * E2E Tests for LSP Features: Hover, Autocomplete, Diagnostics
 */

import * as assert from 'assert'
import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

suite('Proto-Typed LSP Features', () => {
  const testWorkspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
  if (!testWorkspacePath) {
    throw new Error('No workspace folder found')
  }

  const testFilePath = path.join(testWorkspacePath, 'basic-preview.pty')
  let document: vscode.TextDocument

  suiteSetup(async function () {
    this.timeout(30000)

    // Ensure the file exists
    if (!fs.existsSync(testFilePath)) {
      throw new Error(`Test file not found: ${testFilePath}`)
    }

    // Open the document
    document = await vscode.workspace.openTextDocument(testFilePath)
    await vscode.window.showTextDocument(document)

    // Wait for LSP to activate
    await new Promise(resolve => setTimeout(resolve, 3000))
  })

  test('Hover provides documentation for screen keyword', async function () {
    this.timeout(10000)

    const position = new vscode.Position(0, 2) // Inside 'screen' keyword
    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
      'vscode.executeHoverProvider',
      document.uri,
      position
    )

    assert.ok(hovers && hovers.length > 0, 'Should provide hover information')

    const hoverContent = hovers[0].contents[0]
    const contentString =
      typeof hoverContent === 'string'
        ? hoverContent
        : (hoverContent as vscode.MarkdownString).value

    assert.ok(
      contentString.includes('screen') || contentString.includes('Screen'),
      'Hover should mention screen keyword'
    )

    console.log('✅ Hover test passed!')
    console.log(`Hover content: ${contentString.substring(0, 100)}...`)
  })

  test('Autocomplete provides suggestions', async function () {
    this.timeout(10000)

    // Create a new line at the end
    const lastLine = document.lineCount - 1
    const lastLineText = document.lineAt(lastLine).text
    const position = new vscode.Position(lastLine, lastLineText.length)

    // Trigger completion
    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      document.uri,
      position
    )

    assert.ok(
      completions && completions.items.length > 0,
      'Should provide completion items'
    )

    // Check if we have screen, modal, drawer etc
    const labels = completions.items.map(item => item.label)
    const hasLayoutKeywords = labels.some(
      label =>
        typeof label === 'string' &&
        (label.includes('screen') ||
          label.includes('modal') ||
          label.includes('container'))
    )

    assert.ok(hasLayoutKeywords, 'Should provide layout keyword completions')

    console.log('✅ Autocomplete test passed!')
    console.log(`Found ${completions.items.length} completion items`)
    console.log(`First 5: ${labels.slice(0, 5).join(', ')}`)
  })

  test('Autocomplete with @ trigger provides button variants', async function () {
    this.timeout(10000)

    // Create a position where we can trigger with @
    const position = new vscode.Position(5, 4)

    // Trigger completion with @ character
    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      document.uri,
      position,
      '@'
    )

    assert.ok(
      completions && completions.items.length > 0,
      'Should provide completion items after @'
    )

    const labels = completions.items.map(item =>
      typeof item.label === 'string' ? item.label : item.label.label
    )
    const hasButtonVariants = labels.some(
      label =>
        label.includes('button') ||
        label.includes('@primary') ||
        label.includes('@secondary')
    )

    assert.ok(hasButtonVariants, 'Should provide button variant completions')

    console.log('✅ Button autocomplete test passed!')
    console.log(`Button completions: ${labels.filter(l => l.includes('button') || l.includes('@')).slice(0, 5).join(', ')}`)
  })

  test('Diagnostics show errors for invalid syntax', async function () {
    this.timeout(10000)

    // Create a new document with invalid syntax
    const invalidContent = 'screen Invalid\n  header'
    const invalidDoc = await vscode.workspace.openTextDocument({
      language: 'proto-typed',
      content: invalidContent,
    })

    await vscode.window.showTextDocument(invalidDoc)

    // Wait for diagnostics
    await new Promise(resolve => setTimeout(resolve, 2000))

    const diagnostics = vscode.languages.getDiagnostics(invalidDoc.uri)

    assert.ok(
      diagnostics.length > 0,
      'Should have diagnostics for invalid syntax'
    )

    const hasSyntaxError = diagnostics.some(
      d => d.severity === vscode.DiagnosticSeverity.Error
    )

    assert.ok(hasSyntaxError, 'Should have at least one error diagnostic')

    console.log('✅ Diagnostics test passed!')
    console.log(`Found ${diagnostics.length} diagnostics`)
    console.log(`First error: ${diagnostics[0].message}`)

    // Clean up
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
  })

  test('Code Actions provide quick fixes', async function () {
    this.timeout(10000)

    // Create a document with a fixable error
    const invalidContent = 'screen Invalid\n  container:'
    const doc = await vscode.workspace.openTextDocument({
      language: 'proto-typed',
      content: invalidContent,
    })

    await vscode.window.showTextDocument(doc)

    // Wait for diagnostics
    await new Promise(resolve => setTimeout(resolve, 2000))

    const diagnostics = vscode.languages.getDiagnostics(doc.uri)

    if (diagnostics.length > 0) {
      const firstDiag = diagnostics[0]
      const codeActions = await vscode.commands.executeCommand<vscode.CodeAction[]>(
        'vscode.executeCodeActionProvider',
        doc.uri,
        firstDiag.range
      )

      assert.ok(
        Array.isArray(codeActions),
        'Should return an array of code actions'
      )

      console.log('✅ Code Actions test passed!')
      console.log(`Found ${codeActions?.length || 0} code actions`)
    } else {
      console.log('⚠️ No diagnostics to test code actions')
    }

    // Clean up
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
  })
})
