/**
 * E2E Tests for Webview - Following VS Code Official Pattern
 */

import * as assert from 'assert'
import { after } from 'mocha'
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

suite('Proto-Typed Webview Tests', () => {
  after(() => {
    vscode.window.showInformationMessage('All webview tests done!')
  })

  test('Extension basics and webview rendering', async function () {
    this.timeout(30000)
    console.log('\n📋 Running combined webview test...')

    // Get workspace path
    const testWorkspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
    if (!testWorkspacePath) {
      throw new Error('No workspace folder found')
    }

    // 1. Check extension is active
    const extension = vscode.extensions.getExtension(
      'proto-typed.proto-typed-vscode-extension'
    )
    assert.ok(extension, 'Extension should be found')
    assert.ok(extension!.isActive, 'Extension should be active')
    console.log('✅ Extension is active')

    // 2. Check command is registered
    const commands = await vscode.commands.getCommands()
    assert.ok(
      commands.includes('proto-typed.showPreview'),
      'Preview command should be registered'
    )
    console.log('✅ Preview command is registered')

    // 3. Open preview
    await vscode.commands.executeCommand('proto-typed.showPreview')
    await new Promise((resolve) => setTimeout(resolve, 5000))
    console.log('✅ Preview opened')

    // 4. Validate rendering
    const snapshot = (await vscode.commands.executeCommand(
      'proto-typed.getLastRender'
    )) as RenderSnapshot | null

    assert.ok(snapshot, 'Should have render snapshot')
    assert.ok(snapshot!.html, 'Should have HTML')
    assert.ok(snapshot!.html.length > 100, 'HTML should be substantial')
    console.log(`✅ Rendered ${snapshot!.html.length} characters of HTML`)
    console.log(`   Screen: ${snapshot!.screen || 'default'}`)
    console.log(`   Errors: ${snapshot!.errors.length}`)

    // 5. Save snapshot (optional)
    const screenshotsDir = path.join(
      testWorkspacePath,
      '..',
      'test-results',
      'screenshots'
    )
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true })
    }

    const snapshotFile = path.join(screenshotsDir, 'webview-render.html')
    const htmlDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Webview Render Test</title>
  <style>body { margin: 20px; font-family: system-ui; }</style>
</head>
<body>
  <h2>Webview Render Test</h2>
  <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
  <p><strong>HTML Length:</strong> ${snapshot!.html.length} chars</p>
  <hr>
  ${snapshot!.html}
</body>
</html>`

    fs.writeFileSync(snapshotFile, htmlDoc, 'utf-8')
    console.log(`📸 Saved snapshot to: ${snapshotFile}`)

    console.log('\n✅ All webview tests passed!')
  })
})
