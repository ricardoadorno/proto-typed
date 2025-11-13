/**
 * Simple Test Suite Entry Point
 * Runs comprehensive E2E tests for all extension features
 */

import * as path from 'path'
import Mocha from 'mocha'
import { glob } from 'glob'

export async function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 60000, // 60 seconds for e2e tests
    slow: 10000,
    reporter: 'spec',
  })

  const testsRoot = path.resolve(__dirname, '..')

  console.log('\n🧪 Proto-Typed Extension E2E Test Suite')
  console.log('📁 Test root:', testsRoot)
  console.log('')

  try {
    // Find all test files in e2e-simple folder
    const files = await glob('e2e-simple/**/*.test.js', { cwd: testsRoot })

    console.log(`📋 Found ${files.length} test file(s):`)
    files.forEach((f) => console.log(`   ✓ ${f}`))
    console.log('')

    // Add files to the test suite
    files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)))

    // Run the mocha test
    return new Promise((resolve, reject) => {
      mocha.run((failures) => {
        if (failures > 0) {
          console.error(`\n❌ ${failures} test(s) failed`)
          reject(new Error(`${failures} test(s) failed.`))
        } else {
          console.log('\n✅ All tests passed!')
          resolve()
        }
      })
    })
  } catch (err) {
    console.error('❌ Error loading test files:', err)
    throw err
  }
}
