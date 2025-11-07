/**
 * E2E Tests for Proto-Typed VS Code Extension
 * Tests hover, autocomplete, diagnostics, and webview functionality
 */

import * as path from 'path'
import * as fs from 'fs'
import {
  runTests,
  downloadAndUnzipVSCode,
  resolveCliArgsFromVSCodeExecutablePath,
} from '@vscode/test-electron'
import { spawn } from 'child_process'

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../../')
    const extensionTestsPath = path.resolve(__dirname, './suite/index.js')
    const vscodeExecutablePath = await downloadAndUnzipVSCode('stable')
    const [cliPath, ...args] = resolveCliArgsFromVSCodeExecutablePath(
      vscodeExecutablePath
    )

    // Create test workspace
    const testWorkspace = path.resolve(
      extensionDevelopmentPath,
      'test-workspace'
    )

    // Make sure test workspace exists
    if (!fs.existsSync(testWorkspace)) {
      throw new Error(`Test workspace not found: ${testWorkspace}`)
    }

    console.log('🚀 Running VS Code Extension E2E Tests')
    console.log(`Extension path: ${extensionDevelopmentPath}`)
    console.log(`Test workspace: ${testWorkspace}`)

    // Run the extension tests
    await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [testWorkspace, '--disable-extensions'],
    })

    console.log('✅ All E2E tests passed!')
  } catch (err) {
    console.error('❌ E2E tests failed:', err)
    process.exit(1)
  }
}

main()
