import * as fs from 'fs'
import * as path from 'path'
import { expect } from 'chai'
import { suite, suiteSetup, teardown, test } from 'mocha'
import pixelmatch from 'pixelmatch'
import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import * as vscode from 'vscode'

interface ExtensionTestApi {
  getLastRenderedHtml(): string | undefined
  resetLastRenderedHtml(): void
  disposePanel(): void
}

const workspaceRoot = path.resolve(__dirname, '../../../test-workspace')
const snapshotDirectory = path.resolve(__dirname, '../../../test-snapshots')
const shouldUpdateSnapshots =
  process.env.UPDATE_SNAPSHOTS === '1' ||
  process.env.UPDATE_SNAPSHOTS === 'true'

suite('Proto-Typed Extension E2E', function () {
  this.timeout(30_000) // Increased timeout for multiple tests with cleanup

  console.log('UPDATE_SNAPSHOTS env:', process.env.UPDATE_SNAPSHOTS)

  let extensionApi: ExtensionTestApi

  suiteSetup(async () => {
    const extension = vscode.extensions.all.find(
      (ext) => ext.packageJSON?.name === '@proto-typed/extension'
    )

    if (!extension) {
      throw new Error('Proto-Typed extension could not be found')
    }

    extensionApi = (await extension.activate()) as ExtensionTestApi
    if (
      !extensionApi ||
      typeof extensionApi.getLastRenderedHtml !== 'function'
    ) {
      throw new Error('Extension did not expose the expected testing API')
    }
  })

  teardown(async () => {
    // Reset HTML state
    extensionApi.resetLastRenderedHtml()

    // Dispose panel
    extensionApi.disposePanel()

    // Close all editors
    await vscode.commands.executeCommand('workbench.action.closeAllEditors')

    // Wait a bit to ensure cleanup completes
    await new Promise((resolve) => setTimeout(resolve, 500))
  })

  test('registers the preview command', async () => {
    const commands = await vscode.commands.getCommands(true)
    expect(commands).to.include('proto-typed.showPreview')
  })

  test('renders preview HTML matching the snapshot', async () => {
    const documentUri = vscode.Uri.file(
      path.join(workspaceRoot, 'basic-preview.pty')
    )

    const document = await vscode.workspace.openTextDocument(documentUri)
    await vscode.window.showTextDocument(document)

    await vscode.commands.executeCommand('proto-typed.showPreview')

    // Wait for webview to fully load and process DSL
    console.log('⏳ Waiting for webview to initialize...')
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const html = await waitForHtml(() => extensionApi.getLastRenderedHtml())
    assertMatchesHtmlSnapshot(html, 'basic-preview')
    await assertMatchesScreenshot(html, 'basic-preview')
  })

  test('renders layouts correctly - comprehensive test', async () => {
    const documentUri = vscode.Uri.file(
      path.join(workspaceRoot, 'layouts-comprehensive.pty')
    )

    const document = await vscode.workspace.openTextDocument(documentUri)
    await vscode.window.showTextDocument(document)

    await vscode.commands.executeCommand('proto-typed.showPreview')

    // Wait for webview to fully load and process DSL
    console.log('⏳ Waiting for webview to initialize...')
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const html = await waitForHtml(() => extensionApi.getLastRenderedHtml())

    // Validate header layout
    expect(html).to.include('class="header')
    expect(html).to.include('Layout Tests')

    // Validate container layout
    expect(html).to.include('class="container')
    expect(html).to.include('Container Test')
    expect(html).to.include('This is inside a container')

    // Validate card layout
    expect(html).to.include('class="card')
    expect(html).to.include('Card Test')
    expect(html).to.include('This is inside a card')
    expect(html).to.include('Action Button')

    // Validate stack layout
    expect(html).to.include('class="stack')
    expect(html).to.include('Stack Layout')
    expect(html).to.include('First item in stack')
    expect(html).to.include('Second item in stack')

    // Validate row layout
    expect(html).to.include('class="row')
    expect(html).to.include('Row Layout')
    expect(html).to.include('Left side')
    expect(html).to.include('Right side')

    // Validate modal with nested layouts
    expect(html).to.match(/data-nav="Modal1"[^>]*data-nav-type="toggle"/)
    expect(html).to.include('Modal Title')
    expect(html).to.include('Modal content in container')
    expect(html).to.include('Nested Card in Modal')

    console.log('✅ All layouts validated successfully')
  })

  test('renders nested layouts correctly', async () => {
    const documentUri = vscode.Uri.file(
      path.join(workspaceRoot, 'nested-layouts.pty')
    )

    const document = await vscode.workspace.openTextDocument(documentUri)
    await vscode.window.showTextDocument(document)

    await vscode.commands.executeCommand('proto-typed.showPreview')

    // Wait for webview to fully load and process DSL
    console.log('⏳ Waiting for webview to initialize...')
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const html = await waitForHtml(() => extensionApi.getLastRenderedHtml())

    // Validate nested structure: container > card > stack
    const hasContainer = html.includes('class="container')
    const hasCard = html.includes('class="card')
    const hasStack = html.includes('class="stack')
    const hasRow = html.includes('class="row')

    expect(hasContainer, 'Container layout should be present').to.be.true
    expect(hasCard, 'Card layout should be present').to.be.true
    expect(hasStack, 'Stack layout should be present').to.be.true
    expect(hasRow, 'Row layout should be present').to.be.true

    // Validate content is present
    expect(html).to.include('Outer Container')
    expect(html).to.include('Card in Container')
    expect(html).to.include('Card content here')
    expect(html).to.include('Stack item 1')
    expect(html).to.include('Stack item 2')
    expect(html).to.include('Left column')
    expect(html).to.include('Right column')

    console.log('✅ Nested layouts validated successfully')
  })

  test('validates layout HTML structure matches DSL input', async () => {
    const documentUri = vscode.Uri.file(
      path.join(workspaceRoot, 'basic-preview.pty')
    )

    const document = await vscode.workspace.openTextDocument(documentUri)
    await vscode.window.showTextDocument(document)

    await vscode.commands.executeCommand('proto-typed.showPreview')

    // Wait for webview to fully load and process DSL
    console.log('⏳ Waiting for webview to initialize...')
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const html = await waitForHtml(() => extensionApi.getLastRenderedHtml())
    const dslContent = fs.readFileSync(
      path.join(workspaceRoot, 'basic-preview.pty'),
      'utf8'
    )

    console.log('\n📋 DSL Input:')
    console.log(dslContent)
    console.log('\n📄 HTML Output (first 1000 chars):')
    console.log(html.substring(0, 1000))

    // Parse DSL to find all layouts
    const headerMatch = dslContent.match(/^\s*header:/m)
    const containerMatch = dslContent.match(/^\s*container:/m)
    const cardMatch = dslContent.match(/^\s*card:/m)

    if (headerMatch) {
      expect(html, 'Header layout should render in HTML').to.include(
        'class="header'
      )
      console.log('✅ header: found in DSL → header class found in HTML')
    }

    if (containerMatch) {
      expect(html, 'Container layout should render in HTML').to.include(
        'class="container'
      )
      console.log('✅ container: found in DSL → container class found in HTML')
    }

    if (cardMatch) {
      expect(html, 'Card layout should render in HTML').to.include(
        'class="card'
      )
      console.log('✅ card: found in DSL → card class found in HTML')
    }

    // Validate all text content from DSL is in HTML
    const textLines = dslContent
      .split('\n')
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.startsWith('#') || line.startsWith('>') || line.startsWith('@')
      )
      .map((line) =>
        line
          .replace(/^[#>@]+\s*/, '')
          .replace(/\[.*?\].*/, '')
          .trim()
      )
      .filter((text) => text.length > 3) // Only check substantial text

    console.log('\n📝 Validating text content from DSL appears in HTML:')
    for (const text of textLines) {
      if (html.includes(text)) {
        console.log(`✅ "${text}"`)
      } else {
        console.log(`❌ MISSING: "${text}"`)
        expect.fail(`Text from DSL not found in HTML: "${text}"`)
      }
    }

    console.log('\n✅ All DSL content validated in HTML output')
  })
})

async function waitForHtml<T>(
  getter: () => T | undefined,
  timeout = 10_000,
  interval = 100
): Promise<T> {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeout) {
    const value = getter()
    if (value !== undefined && value !== null && value !== '') {
      console.log(`✅ Received HTML after ${Date.now() - startedAt}ms`)
      return value as T
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }

  throw new Error(`Timed out waiting for rendered HTML after ${timeout}ms`)
}

function assertMatchesHtmlSnapshot(actualHtml: string, snapshotName: string) {
  const sanitized = sanitizeHtml(actualHtml)
  const snapshotPath = path.join(snapshotDirectory, `${snapshotName}.html`)

  if (!fs.existsSync(snapshotDirectory)) {
    fs.mkdirSync(snapshotDirectory, { recursive: true })
  }

  if (!fs.existsSync(snapshotPath) || shouldUpdateSnapshots) {
    fs.writeFileSync(snapshotPath, sanitized, 'utf8')

    if (!shouldUpdateSnapshots) {
      throw new Error(
        `Snapshot "${snapshotName}" created. Re-run tests or commit the snapshot if it is correct.`
      )
    }
    return
  }

  const expected = fs.readFileSync(snapshotPath, 'utf8')
  expect(sanitized).to.equal(expected)
}

function sanitizeHtml(html: string) {
  return html
    .replace(/Webview loaded at [^']+/g, 'Webview loaded at <timestamp>')
    .replace(/\r\n/g, '\n')
    .trim()
}

async function assertMatchesScreenshot(
  html: string,
  snapshotName: string
): Promise<void> {
  const sanitizedHtml = sanitizeHtml(html)
  const screenshotPath = path.join(snapshotDirectory, `${snapshotName}.png`)
  const diffPath = path.join(snapshotDirectory, `${snapshotName}.diff.png`)

  if (!fs.existsSync(snapshotDirectory)) {
    fs.mkdirSync(snapshotDirectory, { recursive: true })
  }

  console.log(
    `🧪 Generating screenshot for "${snapshotName}" from ${__dirname} into ${screenshotPath}`
  )

  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.setContent(sanitizedHtml, { waitUntil: 'networkidle' })
    const screenshotBuffer = await page.screenshot({ fullPage: true })

    const existedBefore = fs.existsSync(screenshotPath)

    if (!existedBefore || shouldUpdateSnapshots) {
      fs.writeFileSync(screenshotPath, screenshotBuffer)
      console.log(
        `🖼️  Screenshot snapshot ${existedBefore ? 'updated' : 'created'}: ${screenshotPath}`
      )
      if (fs.existsSync(diffPath)) {
        fs.unlinkSync(diffPath)
      }

      if (!shouldUpdateSnapshots) {
        throw new Error(
          `Screenshot "${snapshotName}" created. Re-run tests or commit the snapshot if it is correct.`
        )
      }
      return
    }

    const baselineBuffer = fs.readFileSync(screenshotPath)
    const baselineImage = PNG.sync.read(baselineBuffer)
    const currentImage = PNG.sync.read(screenshotBuffer)

    if (
      baselineImage.width !== currentImage.width ||
      baselineImage.height !== currentImage.height
    ) {
      throw new Error(
        `Screenshot dimensions changed for "${snapshotName}". Expected ${baselineImage.width}x${baselineImage.height}, got ${currentImage.width}x${currentImage.height}.`
      )
    }

    const diffImage = new PNG({
      width: baselineImage.width,
      height: baselineImage.height,
    })

    const mismatchedPixels = pixelmatch(
      baselineImage.data,
      currentImage.data,
      diffImage.data,
      baselineImage.width,
      baselineImage.height,
      {
        threshold: 0.1,
      }
    )

    if (mismatchedPixels > 0) {
      fs.writeFileSync(diffPath, PNG.sync.write(diffImage))
      throw new Error(
        `Screenshot mismatch detected for "${snapshotName}". Inspect ${diffPath} for visual differences.`
      )
    }

    if (fs.existsSync(diffPath)) {
      fs.unlinkSync(diffPath)
    }
  } finally {
    await browser.close()
  }
}
