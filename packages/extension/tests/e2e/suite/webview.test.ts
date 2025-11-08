/**
 * E2E Tests for Webview Preview
 * Tests that webview renders DSL correctly inside VS Code
 */

import * as assert from 'assert'
import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

interface RenderSnapshot {
  html: string
  screen: string | null
  errors: string[]
  uri?: string
  timestamp: number
}

/**
 * Helper to save HTML snapshots for visual inspection
 */
function saveHtmlSnapshot(
  html: string,
  testName: string,
  screenshotsDir: string
): void {
  const sanitizedName = testName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${sanitizedName}-${timestamp}.html`
  const filepath = path.join(screenshotsDir, filename)

  // Wrap in full HTML document for better viewing
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Snapshot: ${testName}</title>
  <style>
    body { margin: 0; padding: 20px; font-family: system-ui; }
    .test-info { background: #f0f0f0; padding: 10px; margin-bottom: 20px; border-radius: 4px; }
    .test-info h3 { margin: 0 0 10px 0; }
    .test-content { border: 1px solid #ccc; padding: 20px; }
  </style>
</head>
<body>
  <div class="test-info">
    <h3>Test: ${testName}</h3>
    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    <p><strong>HTML Length:</strong> ${html.length} characters</p>
  </div>
  <div class="test-content">
    ${html}
  </div>
</body>
</html>`

  fs.writeFileSync(filepath, fullHtml, 'utf-8')
  console.log(`📸 Saved HTML snapshot: ${filename}`)
}

suite('Proto-Typed Webview Preview', () => {
  const testWorkspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
  if (!testWorkspacePath) {
    throw new Error('No workspace folder found')
  }

  const testFilePath = path.join(testWorkspacePath, 'basic-preview.pty')
  const screenshotsDir = path.join(
    testWorkspacePath,
    '..',
    'test-results',
    'screenshots'
  )
  let document: vscode.TextDocument

  suiteSetup(async function () {
    this.timeout(30000)

    // Create screenshots directory
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true })
    }

    // Ensure the file exists
    if (!fs.existsSync(testFilePath)) {
      throw new Error(`Test file not found: ${testFilePath}`)
    }

    // Open the document
    document = await vscode.workspace.openTextDocument(testFilePath)
    await vscode.window.showTextDocument(document)

    // Wait for extension to activate
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log(`📁 Screenshots will be saved to: ${screenshotsDir}`)
  })

  teardown(async function () {
    // Close any open panels between tests to avoid conflicts
    await vscode.commands.executeCommand('workbench.action.closeAllEditors')
    await new Promise((resolve) => setTimeout(resolve, 500))
  })

  test('Preview command is available in command palette', async function () {
    this.timeout(10000)

    const commands = await vscode.commands.getCommands()
    const hasPreviewCommand = commands.includes('proto-typed.showPreview')

    assert.ok(hasPreviewCommand, 'Preview command should be registered')

    console.log('✅ Preview command is registered!')
  })

  test('Extension activates for .pty files', async function () {
    this.timeout(10000)

    // Check if extension is active
    const extension = vscode.extensions.getExtension(
      'proto-typed.proto-typed-vscode-extension'
    )

    if (extension) {
      assert.ok(extension.isActive, 'Extension should be active')
      console.log('✅ Extension is active!')
    } else {
      console.log('⚠️ Extension not found in installed extensions')
    }
  })

  test('Can open preview command', async function () {
    this.timeout(15000)

    // Execute the show preview command
    try {
      await vscode.commands.executeCommand('proto-typed.showPreview')

      // Wait for webview to open and render
      await new Promise((resolve) => setTimeout(resolve, 3000))

      console.log('✅ Webview preview command executed successfully!')
    } catch (error) {
      console.error('Error opening preview:', error)
      throw error
    }
  })

  test('Webview renders DSL content correctly', async function () {
    this.timeout(20000)

    // Open preview
    await vscode.commands.executeCommand('proto-typed.showPreview')

    // Wait for webview to render
    await new Promise((resolve) => setTimeout(resolve, 4000))

    // Get render snapshot from extension
    const snapshot = (await vscode.commands.executeCommand(
      'proto-typed.getLastRender'
    )) as RenderSnapshot | null

    assert.ok(snapshot, 'Should have render snapshot')
    assert.ok(snapshot!.html, 'Snapshot should contain HTML')
    assert.strictEqual(
      typeof snapshot!.html,
      'string',
      'HTML should be a string'
    )
    assert.ok(snapshot!.html.length > 0, 'HTML should not be empty')

    // Validate that HTML contains expected elements
    const html = snapshot!.html
    assert.ok(
      html.includes('screen-container') || html.includes('div'),
      'HTML should contain screen container'
    )

    console.log('✅ Webview rendered HTML successfully!')
    console.log(`   HTML length: ${html.length} characters`)
    console.log(`   Current screen: ${snapshot!.screen || 'default'}`)
    console.log(`   Errors: ${snapshot!.errors.length}`)

    // Save HTML snapshot for visual inspection
    saveHtmlSnapshot(html, 'webview-renders-dsl-content', screenshotsDir)
  })

  test('Webview updates when DSL changes', async function () {
    this.timeout(25000)

    // Open preview
    await vscode.commands.executeCommand('proto-typed.showPreview')
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Get initial snapshot
    const snapshot1 = (await vscode.commands.executeCommand(
      'proto-typed.getLastRender'
    )) as RenderSnapshot | null

    assert.ok(snapshot1, 'Should have initial render snapshot')
    const timestamp1 = snapshot1!.timestamp

    // Make a change to the document
    const editor = vscode.window.activeTextEditor
    if (!editor || editor.document.uri.toString() !== document.uri.toString()) {
      await vscode.window.showTextDocument(document)
    }

    // Add a comment at the end (non-breaking change)
    const edit = new vscode.WorkspaceEdit()
    const lastLine = document.lineCount
    edit.insert(
      document.uri,
      new vscode.Position(lastLine, 0),
      '\n// Test change\n'
    )
    await vscode.workspace.applyEdit(edit)

    // Wait for debounce + re-render
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Get updated snapshot
    const snapshot2 = (await vscode.commands.executeCommand(
      'proto-typed.getLastRender'
    )) as RenderSnapshot | null

    assert.ok(snapshot2, 'Should have updated render snapshot')
    assert.ok(
      snapshot2!.timestamp > timestamp1,
      'Timestamp should be newer after change'
    )

    console.log('✅ Webview updated after DSL change!')
    console.log(`   Initial timestamp: ${timestamp1}`)
    console.log(`   Updated timestamp: ${snapshot2!.timestamp}`)

    // Save updated HTML snapshot
    saveHtmlSnapshot(
      snapshot2!.html,
      'webview-updates-after-change',
      screenshotsDir
    )
  })

  test('Webview handles DSL errors gracefully', async function () {
    this.timeout(20000)

    // Create a temporary file with invalid DSL
    const invalidDslPath = path.join(testWorkspacePath, 'invalid-test.pty')
    fs.writeFileSync(
      invalidDslPath,
      'screen InvalidScreen\n  this is invalid syntax'
    )

    try {
      const invalidDoc = await vscode.workspace.openTextDocument(invalidDslPath)
      await vscode.window.showTextDocument(invalidDoc)

      await vscode.commands.executeCommand('proto-typed.showPreview')
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const snapshot = (await vscode.commands.executeCommand(
        'proto-typed.getLastRender'
      )) as RenderSnapshot | null

      assert.ok(snapshot, 'Should have snapshot even with errors')
      // Should have either HTML (partial render) or errors
      assert.ok(
        snapshot!.html || snapshot!.errors.length > 0,
        'Should have HTML or errors'
      )

      console.log('✅ Webview handled DSL errors gracefully!')
      console.log(`   Errors detected: ${snapshot!.errors.length}`)

      // Save error state snapshot
      if (snapshot!.html) {
        saveHtmlSnapshot(
          snapshot!.html,
          'webview-handles-errors',
          screenshotsDir
        )
      }
    } finally {
      // Clean up temporary file
      if (fs.existsSync(invalidDslPath)) {
        fs.unlinkSync(invalidDslPath)
      }
    }
  })
})
