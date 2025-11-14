/**
 * E2E Tests: Error Handling (Simplified)
 */

import { test, expect } from '@playwright/test'

test.describe('Playground - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const editor = page.locator('.monaco-editor')
    await expect(editor).toBeVisible({ timeout: 45000 })
  })

  test('should not crash with invalid syntax', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })

    // Type invalid content
    await page.keyboard.press('Control+A')
    await page.keyboard.type('invalid syntax here')
    await page.waitForTimeout(500)

    // Should not crash
    await expect(editor).toBeVisible()
  })

  test('should handle empty editor', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })

    // Clear all content
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Delete')
    await page.waitForTimeout(500)

    // Should not crash
    await expect(editor).toBeVisible()
  })

  test('should handle special characters', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })

    // Type special characters
    await page.keyboard.press('Control+A')
    await page.keyboard.type('screen Test:\n  container:\n    # Hello <>&"\'')
    await page.waitForTimeout(500)

    // Should not crash
    await expect(editor).toBeVisible()
  })

  test('should handle emoji characters', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })

    // Type emoji
    await page.keyboard.press('Control+A')
    await page.keyboard.type('screen Test:\n  container:\n    # Hello 👋 🚀')
    await page.waitForTimeout(500)

    // Should not crash
    await expect(editor).toBeVisible()
  })

  test('should recover from errors', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })

    // Type invalid content
    await page.keyboard.press('Control+A')
    await page.keyboard.type('invalid')
    await page.waitForTimeout(500)

    // Fix with valid content
    await page.keyboard.press('Control+A')
    await page.keyboard.type('screen Test:\n  container:\n    # Fixed')
    await page.waitForTimeout(500)

    // Should still work
    await expect(editor).toBeVisible()
  })
})
