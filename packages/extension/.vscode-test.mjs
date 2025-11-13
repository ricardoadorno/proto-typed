/**
 * VSCode Test Configuration
 * Used by @vscode/test-cli
 */

import { defineConfig } from '@vscode/test-cli'

export default defineConfig({
  files: 'dist/tests/**/*.test.js',
  version: 'stable',
  workspaceFolder: './tests/fixtures',
  mocha: {
    ui: 'tdd',
    timeout: 30000,
    color: true,
    reporter: 'spec',
  },
  launchArgs: ['--disable-extensions', '--disable-workspace-trust'],
})
