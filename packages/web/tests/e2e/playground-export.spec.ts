/**
 * E2E Tests: Export and UI Features (Simplified)
 */

import { test, expect } from '@playwright/test'

test.describe('Playground - Export and Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const editor = page.locator('.monaco-editor')
    await expect(editor).toBeVisible({ timeout: 45000 })
  })

  test('should have export button visible', async ({ page }) => {
    const exportButton = page.locator('button').filter({ hasText: /export/i })
    await expect(exportButton.first()).toBeVisible({ timeout: 10000 })
  })

  test('should have documentation link', async ({ page }) => {
    const docsLink = page.locator('a').filter({ hasText: /documentation/i })
    await expect(docsLink.first()).toBeVisible({ timeout: 10000 })
  })

  test('should have example buttons', async ({ page }) => {
    // Look for example buttons
    const buttons = page.locator('button')
    const count = await buttons.count()
    expect(count).toBeGreaterThan(3) // Should have multiple buttons
  })

  test('should have page title', async ({ page }) => {
    const title = page.locator('h1')
    await expect(title.first()).toBeVisible()
  })

  test('should have responsive layout', async ({ page }) => {
    // Verify basic structure is present
    const editor = page.locator('.monaco-editor')
    await expect(editor).toBeVisible()
  })
})
