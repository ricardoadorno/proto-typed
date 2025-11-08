import { defineConfig } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const testsDir = path.resolve(__dirname, 'webview')

export default defineConfig({
  testDir: testsDir,
  fullyParallel: true,
  reporter: process.env.CI
    ? 'dot'
    : [['list'], ['html', { outputFolder: 'playwright-report-extension' }]],
  use: {
    viewport: { width: 1200, height: 800 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command:
      'cd ../packages/extension && pnpm exec http-server dist/webview -p 8765 -c-1 --cors',
    port: 8765,
    cwd: path.resolve(__dirname, '../../'),
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
})
