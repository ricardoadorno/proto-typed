'use strict'
/**
 * E2E Tests for Webview Preview
 */
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = []
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k
          return ar
        }
      return ownKeys(o)
    }
    return function (mod) {
      if (mod && mod.__esModule) return mod
      var result = {}
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i])
      __setModuleDefault(result, mod)
      return result
    }
  })()
Object.defineProperty(exports, '__esModule', { value: true })
const assert = __importStar(require('assert'))
const vscode = __importStar(require('vscode'))
const path = __importStar(require('path'))
const fs = __importStar(require('fs'))
suite('Proto-Typed Webview Preview', () => {
  const testWorkspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
  if (!testWorkspacePath) {
    throw new Error('No workspace folder found')
  }
  const testFilePath = path.join(testWorkspacePath, 'basic-preview.pty')
  let document
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
      assert.ok(
        extension.isActive || extension.isActivated,
        'Extension should be active'
      )
      console.log('✅ Extension is active!')
    } else {
      console.log('⚠️ Extension not found in installed extensions')
    }
  })
})
//# sourceMappingURL=webview.test.js.map
