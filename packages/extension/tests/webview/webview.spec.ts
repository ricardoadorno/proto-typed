import { test, expect } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  parseAndBuildAst,
  RouteManager,
  createRouteManagerGateway,
  astToHtmlStringPreview,
} from '@proto-typed/core'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '../../')
const webviewEntry = path.join(rootDir, 'dist/webview/index.html')
const webviewUrl = 'http://localhost:8765'
const dslPath = path.join(rootDir, 'test-workspace/basic-preview.pty')

test.describe('VS Code webview snapshot', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const messages: unknown[] = []
      const api = {
        postMessage: (message: unknown) => {
          messages.push(message)
        },
        setState: () => undefined,
        getState: () => null,
      }
      // @ts-expect-error - injected for tests
      window.__vscodeMessages__ = messages
      // @ts-expect-error - injected for tests
      window.acquireVsCodeApi = () => api
      // @ts-expect-error - injected for tests
      window.vscode = api
    })
  })

  test('matches renderer snapshot for DSL update', async ({ page }) => {
    if (!fs.existsSync(webviewEntry)) {
      test.skip(true, 'Webview bundle not found. Run pnpm run build:webview first.')
    }

    const dsl = fs.readFileSync(dslPath, 'utf8')
    const expectedHtml = renderReferenceHtml(dsl)

    // Capture console logs and errors
    page.on('console', (msg) => {
      console.log(`[Browser ${msg.type()}]:`, msg.text())
    })

    page.on('pageerror', (error) => {
      console.error('[Browser Error]:', error.message)
    })

    await page.goto(webviewUrl)

    // Wait for React to mount
    await page.waitForSelector('#root > div', { timeout: 5000 })

    // Wait a bit more for event listeners to be set up
    await page.waitForTimeout(500)

    // Send handshake
    await page.evaluate(() => {
      const handshake = {
        type: 'HANDSHAKE_INIT',
        version: 1,
        timestamp: Date.now(),
        payload: { sessionId: 'playwright-session' },
      }
      window.dispatchEvent(new MessageEvent('message', { data: handshake }))
    })

    // Wait for handshake acknowledgment
    await page.waitForFunction(() => {
      // @ts-expect-error - declared in addInitScript
      return Array.isArray(window.__vscodeMessages__) &&
        window.__vscodeMessages__.some((msg) => msg.type === 'HANDSHAKE_ACK')
    }, { timeout: 10000 })

    await page.evaluate((dslSource) => {
      const update = {
        type: 'DSL_UPDATE',
        version: 1,
        timestamp: Date.now(),
        payload: {
          text: dslSource,
          uri: 'file:///playwright/basic.pty',
          languageId: 'proto-typed',
        },
      }
      window.dispatchEvent(new MessageEvent('message', { data: update }))
    }, dsl)

    const actual = await page.waitForFunction(() => {
      // @ts-expect-error - declared in addInitScript
      const messages = window.__vscodeMessages__ ?? []
      const renderMessage = [...messages].reverse().find(
        (msg) => msg.type === 'RENDER_COMPLETE'
      )
      return renderMessage?.payload?.html ?? undefined
    }, { timeout: 10000 })

    const htmlString = await actual.jsonValue()
    expect(htmlString).toBeTruthy()
    expect(typeof htmlString).toBe('string')

    // Normalize HTML: trim and remove data-nav attributes
    const normalizedActual = htmlString.trim().replace(/\s+data-nav="[^"]*"/g, '')
    const normalizedExpected = expectedHtml.trim().replace(/\s+data-nav="[^"]*"/g, '')

    expect(normalizedActual).toEqual(normalizedExpected)
  })
})

function renderReferenceHtml(dsl: string): string {
  const ast = parseAndBuildAst(dsl)
  const manager = new RouteManager()
  const gateway = createRouteManagerGateway(manager)
  gateway.initialize(ast)
  const metadata = gateway.getRouteMetadata()
  const currentScreen =
    metadata.defaultScreen || metadata.screens[0]?.name || null
  const result = astToHtmlStringPreview(
    ast,
    { currentScreen: currentScreen || undefined },
    manager
  )
  return result.html.trim()
}
