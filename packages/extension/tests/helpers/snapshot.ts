/**
 * Snapshot Testing Helper
 * Utilities for capturing and comparing snapshots of rendered output
 */

import * as assert from 'assert'
import * as fs from 'fs'
import * as path from 'path'

export interface RenderSnapshot {
  html: string
  screen: string | null
  errors: string[]
  uri?: string
  timestamp: number
}

export class SnapshotManager {
  private snapshotDir: string

  constructor(testFilePath: string) {
    const testDir = path.dirname(testFilePath)
    this.snapshotDir = path.join(testDir, '../snapshots')

    // Ensure snapshot directory exists
    if (!fs.existsSync(this.snapshotDir)) {
      fs.mkdirSync(this.snapshotDir, { recursive: true })
    }
  }

  /**
   * Get the path to a snapshot file
   */
  private getSnapshotPath(testName: string): string {
    const filename = testName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    return path.join(this.snapshotDir, `${filename}.snapshot.json`)
  }

  /**
   * Save a snapshot for a test
   */
  saveSnapshot(testName: string, data: RenderSnapshot): void {
    const snapshotPath = this.getSnapshotPath(testName)
    const snapshot = {
      testName,
      timestamp: data.timestamp,
      screen: data.screen,
      errors: data.errors,
      htmlLength: data.html.length,
      htmlSample: data.html.substring(0, 500), // Save first 500 chars
      uri: data.uri,
    }

    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), 'utf-8')
  }

  /**
   * Load a snapshot for a test
   */
  loadSnapshot(testName: string): any | null {
    const snapshotPath = this.getSnapshotPath(testName)

    if (!fs.existsSync(snapshotPath)) {
      return null
    }

    const content = fs.readFileSync(snapshotPath, 'utf-8')
    return JSON.parse(content)
  }

  /**
   * Compare current render with saved snapshot
   */
  matchesSnapshot(
    testName: string,
    current: RenderSnapshot,
    options: {
      updateSnapshots?: boolean
      ignoreTimestamp?: boolean
    } = {}
  ): boolean {
    const { updateSnapshots = false, ignoreTimestamp = true } = options

    const existing = this.loadSnapshot(testName)

    if (!existing || updateSnapshots) {
      this.saveSnapshot(testName, current)
      if (!existing) {
        console.log(`📸 Created new snapshot: ${testName}`)
      } else {
        console.log(`📸 Updated snapshot: ${testName}`)
      }
      return true
    }

    // Compare snapshots
    const currentSample = current.html.substring(0, 500)

    const matches =
      existing.screen === current.screen &&
      existing.htmlLength === current.html.length &&
      existing.htmlSample === currentSample &&
      JSON.stringify(existing.errors) === JSON.stringify(current.errors)

    if (!matches) {
      console.error(`❌ Snapshot mismatch for: ${testName}`)
      console.error('Expected:', existing)
      console.error('Received:', {
        screen: current.screen,
        htmlLength: current.html.length,
        htmlSample: currentSample,
        errors: current.errors,
      })
    }

    return matches
  }

  /**
   * Assert that current render matches snapshot
   */
  assertMatchesSnapshot(
    testName: string,
    current: RenderSnapshot,
    message?: string
  ): void {
    const updateSnapshots = process.env.UPDATE_SNAPSHOTS === '1'

    const matches = this.matchesSnapshot(testName, current, {
      updateSnapshots,
    })

    assert.ok(
      matches || updateSnapshots,
      message || `Snapshot mismatch for ${testName}`
    )
  }

  /**
   * Delete all snapshots
   */
  clearSnapshots(): void {
    if (fs.existsSync(this.snapshotDir)) {
      const files = fs.readdirSync(this.snapshotDir)
      files.forEach((file) => {
        if (file.endsWith('.snapshot.json')) {
          fs.unlinkSync(path.join(this.snapshotDir, file))
        }
      })
      console.log(`🗑️  Cleared ${files.length} snapshot(s)`)
    }
  }
}

/**
 * Utility to compare HTML content (ignoring whitespace differences)
 */
export function normalizeHtml(html: string): string {
  return html
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

/**
 * Utility to extract text content from HTML
 */
export function extractTextContent(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
    .replace(/<[^>]+>/g, '') // Remove tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

/**
 * Assert that HTML contains expected elements
 */
export function assertHtmlContains(
  html: string,
  expected: string[],
  message?: string
): void {
  const normalized = normalizeHtml(html)

  expected.forEach((item) => {
    assert.ok(
      normalized.includes(item),
      message || `HTML should contain: ${item}`
    )
  })
}

/**
 * Assert that HTML does NOT contain unexpected elements
 */
export function assertHtmlNotContains(
  html: string,
  unexpected: string[],
  message?: string
): void {
  const normalized = normalizeHtml(html)

  unexpected.forEach((item) => {
    assert.ok(
      !normalized.includes(item),
      message || `HTML should NOT contain: ${item}`
    )
  })
}
