/**
 * E2E Tests: Playground Basic Functionality
 * Simplified version - tests core functionality without complex helpers
 */

import { test, expect } from '@playwright/test'

test.describe('Playground - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
  })

  test('should load playground page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/proto-typed/i)
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 })
  })

  test('should initialize Monaco editor without errors', async ({ page }) => {
    const editor = page.locator('.monaco-editor')
    await expect(editor).toBeVisible({ timeout: 45000 })
  })

  test('should display default example code on load', async ({ page }) => {
    await page.waitForSelector('.monaco-editor', { timeout: 45000 })
    const preview = page.locator('[style*="container-type"]').first()
    await expect(preview).toBeVisible()
  })

  test('should have functional View Documentation button', async ({ page }) => {
    const docsLink = page.locator('a:has-text("View documentation")')
    await expect(docsLink).toBeVisible({ timeout: 15000 })
    const href = await docsLink.getAttribute('href')
    expect(href).toContain('/docs')
  })

  test('should have functional Export HTML button', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export HTML")')
    await expect(exportButton).toBeVisible({ timeout: 15000 })
    await expect(exportButton).toBeEnabled()
  })

  test('should render preview inside device frame', async ({ page }) => {
    const preview = page.locator('[style*="container-type"]').first()
    await expect(preview).toBeVisible({ timeout: 15000 })
  })
})
