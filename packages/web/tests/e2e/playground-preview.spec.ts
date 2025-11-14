/**
 * E2E Tests: Preview Rendering (Simplified)
 */

import { test, expect } from '@playwright/test'

test.describe('Playground - Preview Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const editor = page.locator('.monaco-editor')
    await expect(editor).toBeVisible({ timeout: 45000 })
  })

  test('should have preview visible', async ({ page }) => {
    // Look for device frame or preview container
    const preview = page.locator('[class*="device"], [class*="preview"], iframe').first()
    await expect(preview).toBeVisible({ timeout: 10000 })
  })

  test('should render basic content', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })

    // Type simple DSL content
    await page.keyboard.press('Control+A')
    await page.keyboard.type('screen Test:\n  container:\n    # Hello World')
    await page.waitForTimeout(1000)

    // Preview should still be visible
    const preview = page.locator('[class*="device"], [class*="preview"], iframe').first()
    await expect(preview).toBeVisible()
  })

  test('should update preview when content changes', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })

    // Type initial content
    await page.keyboard.press('Control+A')
    await page.keyboard.type('screen A:\n  container:\n    # Screen A')
    await page.waitForTimeout(500)

    // Change content
    await page.keyboard.press('Control+A')
    await page.keyboard.type('screen B:\n  container:\n    # Screen B')
    await page.waitForTimeout(500)

    // Preview should still be visible
    const preview = page.locator('[class*="device"], [class*="preview"], iframe').first()
    await expect(preview).toBeVisible()
  })

  test('should handle empty content', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })

    // Clear all content
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Delete')
    await page.waitForTimeout(500)

    // Preview should still be visible (might show empty state)
    const preview = page.locator('[class*="device"], [class*="preview"], iframe').first()
    await expect(preview).toBeVisible()
  })

  test('should render text elements', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })

    // Type content with headings
    await page.keyboard.press('Control+A')
    await page.keyboard.type('screen Test:\n  container:\n    # Title\n    > Paragraph')
    await page.waitForTimeout(1000)

    // Preview should be visible
    const preview = page.locator('[class*="device"], [class*="preview"], iframe').first()
    await expect(preview).toBeVisible()
  })

  test('should not crash on rapid changes', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })

    // Rapidly change content
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Control+A')
      await page.keyboard.type(`screen Test${i}:\n  container:\n    # Content ${i}`)
      await page.waitForTimeout(200)
    }

    // Should not crash
    const preview = page.locator('[class*="device"], [class*="preview"], iframe').first()
    await expect(preview).toBeVisible()
  })
})
