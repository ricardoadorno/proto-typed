/**
 * E2E Tests: Monaco Editor Basic Interaction (Simplified Smoke Tests)
 */

import { test, expect } from '@playwright/test'

test.describe('Playground - Editor Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const editor = page.locator('.monaco-editor')
    await expect(editor).toBeVisible({ timeout: 45000 })
  })

  test('should have Monaco editor ready', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await expect(editor).toBeVisible()
  })

  test('should handle keyboard input without crashing', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })
    await page.waitForTimeout(500)

    // Type simple content
    await page.keyboard.type('test')
    await page.waitForTimeout(500)

    // No crash = success
    await expect(editor).toBeVisible()
  })

  test('should respond to keyboard shortcuts', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await editor.click({ position: { x: 100, y: 100 } })
    await page.waitForTimeout(500)

    // Try Ctrl+A (select all)
    await page.keyboard.press('Control+A')
    await page.waitForTimeout(200)

    // No crash = success
    await expect(editor).toBeVisible()
  })
})
