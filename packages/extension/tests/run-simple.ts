/**
 * Simple Test Runner for Proto-Typed Extension
 * Runs comprehensive E2E tests to validate all features
 */

import * as path from 'path'
import { runTests } from '@vscode/test-electron'

async function main() {
  try {
    console.log('')
    console.log('═══════════════════════════════════════════════════════')
    console.log('  Proto-Typed Extension - E2E Test Suite')
    console.log('═══════════════════════════════════════════════════════')
    console.log('')

    const extensionDevelopmentPath = path.resolve(__dirname, '../../')
    const extensionTestsPath = path.resolve(__dirname, './suite-simple/index')
    const testWorkspace = path.resolve(__dirname, '../fixtures')

    console.log('📦 Extension path:', extensionDevelopmentPath)
    console.log('🧪 Test suite path:', extensionTestsPath)
    console.log('📁 Workspace:', testWorkspace)
    console.log('')

    // Download VS Code, unzip it and run the tests
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        testWorkspace,
        '--disable-extensions',
        '--disable-workspace-trust',
      ],
    })

    console.log('')
    console.log('═══════════════════════════════════════════════════════')
    console.log('  ✅ All extension features working correctly!')
    console.log('═══════════════════════════════════════════════════════')
    console.log('')
  } catch (err) {
    console.error('')
    console.error('═══════════════════════════════════════════════════════')
    console.error('  ❌ Tests failed')
    console.error('═══════════════════════════════════════════════════════')
    console.error('')
    console.error(err)
    process.exit(1)
  }
}

main()
