/**
 * E2E Tests for Webview Preview
 */

import * as assert from 'assert'
import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

suite('Proto-Typed Webview Preview', () => {
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

    // Wait for extension to activate
    await new Promise((resolve) => setTimeout(resolve, 2000))
  })

  test('Can open preview command', async function () {
    this.timeout(15000)

    // Execute the show preview command
    try {
      await vscode.commands.executeCommand('proto-typed.showPreview')

      // Wait for webview to open
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log('✅ Webview preview command executed successfully!')
    } catch (error) {
      console.error('Error opening preview:', error)
      throw error
    }
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
})
