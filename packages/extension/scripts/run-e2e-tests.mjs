/**
 * E2E Test Runner Wrapper
 * Handles the ESM/CommonJS compatibility issue
 */

import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

// Import and run the CommonJS test runner
const testRunnerPath = resolve(__dirname, '../dist/tests/run-simple.js')

console.log('\n🚀 Starting Proto-Typed Extension E2E Tests...\n')

try {
  const runner = require(testRunnerPath)
  // The runner module exports nothing, it just executes
} catch (error) {
  console.error('❌ Failed to load test runner:', error)
  process.exit(1)
}
