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
}

const workspaceRoot = path.resolve(__dirname, '../../../test-workspace')
const snapshotDirectory = path.resolve(__dirname, '../../../test-snapshots')
const shouldUpdateSnapshots =
  process.env.UPDATE_SNAPSHOTS === '1' ||
  process.env.UPDATE_SNAPSHOTS === 'true'

suite('Proto-Typed Extension E2E', function () {
  this.timeout(15_000)

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
    if (!extensionApi || typeof extensionApi.getLastRenderedHtml !== 'function') {
      throw new Error('Extension did not expose the expected testing API')
    }
  })

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors')
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

    const html = await waitForHtml(() => extensionApi.getLastRenderedHtml())
    assertMatchesHtmlSnapshot(html, 'basic-preview')
    await assertMatchesScreenshot(html, 'basic-preview')
  })
})

async function waitForHtml<T>(
  getter: () => T | undefined,
  timeout = 7_500,
  interval = 50
): Promise<T> {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeout) {
    const value = getter()
    if (value !== undefined && value !== null && value !== '') {
      return value as T
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }

  throw new Error('Timed out waiting for rendered HTML')
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
