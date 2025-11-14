/**
 * Playwright Helper Functions for Proto-Typed Playground Testing
 *
 * This module provides reusable functions for interacting with the
 * playground interface, Monaco editor, and preview panel. These helpers
 * abstract away implementation details and make tests more readable.
 */

import { Page, Locator, expect } from '@playwright/test'

/**
 * Playground page object model
 */
export class PlaygroundPage {
  constructor(public readonly page: Page) {}

  /**
   * Navigate to the playground page
   */
  async goto(lang: string = 'en') {
    await this.page.goto(`/${lang}`)
    await this.waitForEditorReady()
  }

  /**
   * Wait for Monaco editor to be fully initialized
   */
  async waitForEditorReady() {
    // Wait for the loading spinner to disappear
    await this.page.waitForSelector('text=Loading DSL editor...', {
      state: 'detached',
      timeout: 30000, // Wait up to 30s for editor to load
    })

    // Wait for the editor container to be present
    await this.page.waitForSelector('.monaco-editor', {
      timeout: 10000,
      state: 'visible',
    })

    // Also wait for the textarea to be ready
    await this.page.waitForSelector('.monaco-editor textarea.inputarea', {
      timeout: 20000, // Should be quick if container is there
      state: 'visible',
    })

    // Small delay to ensure all Monaco initialization is complete
    await this.page.waitForTimeout(1000)
  }

  /**
   * Get the Monaco editor instance
   */
  getEditor(): Locator {
    return this.page.locator('.monaco-editor').first()
  }

  /**
   * Get the Monaco editor text area (for typing)
   */
  getEditorTextarea(): Locator {
    return this.page.locator('.monaco-editor textarea.inputarea').first()
  }

  /**
   * Clear editor content and type new code
   */
  async setEditorContent(code: string) {
    const textarea = this.getEditorTextarea()

    // Focus the editor
    await textarea.click()

    // Select all and delete
    await this.page.keyboard.press('Control+A')
    await this.page.keyboard.press('Backspace')

    // Wait a bit for the editor to process
    await this.page.waitForTimeout(100)

    // Type new content
    await textarea.fill(code)

    // Wait for parsing and rendering
    await this.page.waitForTimeout(500)
  }

  /**
   * Type text into the editor at current cursor position
   */
  async typeInEditor(text: string) {
    const textarea = this.getEditorTextarea()
    await textarea.click()
    await textarea.type(text)
    await this.page.waitForTimeout(300)
  }

  /**
   * Get current editor content
   * Note: Monaco stores content in the DOM in a complex way
   * This is a simplified approach - may need adjustment
   */
  async getEditorContent(): Promise<string> {
    return await this.page.evaluate(() => {
      // Access Monaco model directly if possible
      const monaco = (window as any).monaco
      if (monaco?.editor) {
        const editors = monaco.editor.getEditors()
        if (editors && editors.length > 0) {
          return editors[0].getValue()
        }
      }
      return ''
    })
  }

  /**
   * Get the preview panel
   */
  getPreview(): Locator {
    return this.page.locator('[style*="container-type: inline-size"]').first()
  }

  /**
   * Get preview HTML content
   */
  async getPreviewHTML(): Promise<string> {
    return await this.getPreview().innerHTML()
  }

  /**
   * Check if preview contains specific text
   */
  async previewContainsText(text: string): Promise<boolean> {
    const preview = this.getPreview()
    const content = await preview.textContent()
    return content?.includes(text) ?? false
  }

  /**
   * Check if preview contains specific HTML
   */
  async previewContainsHTML(html: string): Promise<boolean> {
    const previewHTML = await this.getPreviewHTML()
    return previewHTML.includes(html)
  }

  /**
   * Get screen count from metadata display
   */
  async getScreenCount(): Promise<number> {
    try {
      const text = await this.page.textContent('text=/screens detected/', {
        timeout: 5000
      })
      if (!text) return 0

      const match = text.match(/(\d+)\s+screens detected/)
      return match ? parseInt(match[1], 10) : 0
    } catch {
      return 0
    }
  }

  /**
   * Get screen buttons in metadata area
   */
  getScreenButtons(): Locator {
    return this.page
      .locator('button')
      .filter({ hasText: /^[A-Z][a-zA-Z0-9_]*$/ })
  }

  /**
   * Navigate to a screen by clicking its button
   */
  async navigateToScreen(screenName: string) {
    await this.page.click(`button:has-text("${screenName}")`)
    await this.page.waitForTimeout(300)
  }

  /**
   * Click a button in the preview
   */
  async clickPreviewButton(buttonText: string) {
    const preview = this.getPreview()
    await preview.locator(`button:has-text("${buttonText}")`).first().click()
    await this.page.waitForTimeout(300)
  }

  /**
   * Check if Monaco shows completion suggestions
   */
  async hasCompletionSuggestions(): Promise<boolean> {
    try {
      return await this.page
        .locator('.monaco-editor .suggest-widget')
        .isVisible({ timeout: 3000 })
    } catch {
      return false
    }
  }

  /**
   * Get completion suggestion items
   */
  getCompletionItems(): Locator {
    return this.page.locator('.monaco-editor .suggest-widget .monaco-list-row')
  }

  /**
   * Trigger completion at current cursor position
   */
  async triggerCompletion() {
    await this.page.keyboard.press('Control+Space')
    await this.page.waitForTimeout(300)
  }

  /**
   * Select completion item by text
   */
  async selectCompletion(itemText: string) {
    const items = this.getCompletionItems()
    await items.filter({ hasText: itemText }).first().click()
    await this.page.waitForTimeout(200)
  }

  /**
   * Check for Monaco error markers (squiggly underlines)
   */
  async hasErrorMarkers(): Promise<boolean> {
    try {
      return await this.page
        .locator('.monaco-editor .squiggly-error')
        .isVisible({ timeout: 2000 })
    } catch {
      return false
    }
  }

  /**
   * Get error marker messages
   */
  async getErrorMessages(): Promise<string[]> {
    // Monaco shows errors in hover tooltips
    // This is a simplified check - may need to hover over markers
    const markers = await this.page.locator('.monaco-editor .squiggly-error')
    const count = await markers.count()

    const messages: string[] = []
    for (let i = 0; i < Math.min(count, 5); i++) {
      const marker = markers.nth(i)
      await marker.hover()
      await this.page.waitForTimeout(200)

      const tooltip = await this.page.locator('.monaco-hover-content')
      if (await tooltip.isVisible()) {
        const text = await tooltip.textContent()
        if (text) messages.push(text)
      }
    }

    return messages
  }

  /**
   * Click the Export HTML button
   */
  async clickExportButton() {
    await this.page.click('button:has-text("Export HTML")')
  }

  /**
   * Select an example from the example buttons
   */
  async selectExample(exampleLabel: string) {
    // Look for button with the example label
    await this.page.click(`button:has-text("${exampleLabel}")`)
    await this.page.waitForTimeout(500)
  }

  /**
   * Wait for preview to update after editor change
   */
  async waitForPreviewUpdate(timeout: number = 1000) {
    // Wait for preview re-render (simplified - waits for network idle or timeout)
    await this.page.waitForTimeout(timeout)
  }

  /**
   * Check if editor is showing loading state
   */
  async isEditorLoading(): Promise<boolean> {
    try {
      return await this.page.locator('text=Loading DSL editor').isVisible({
        timeout: 2000
      })
    } catch {
      return false
    }
  }

  /**
   * Check if editor shows initialization error
   */
  async hasEditorInitError(): Promise<boolean> {
    try {
      return await this.page
        .locator('text=Failed to initialize editor')
        .isVisible({ timeout: 2000 })
    } catch {
      return false
    }
  }

  /**
   * Get the current theme name from the theme selector
   */
  async getCurrentTheme(): Promise<string | null> {
    // Find the theme selector and get selected value
    const themeSelect = this.page.locator('select, button').filter({
      has: this.page.locator('text=/Theme preset/i'),
    })

    return await themeSelect.textContent()
  }

  /**
   * Change theme via the theme selector
   */
  async selectTheme(themeName: string) {
    // This depends on the actual implementation of the theme selector
    // Adjust based on whether it's a select element or custom dropdown
    await this.page.click('text=/Theme preset/i')
    await this.page.click(`text="${themeName}"`)
    await this.page.waitForTimeout(300)
  }

  /**
   * Verify preview contains expected heading
   */
  async expectPreviewHeading(level: number, text: string) {
    const preview = this.getPreview()
    await expect(preview.locator(`h${level}:has-text("${text}")`)).toBeVisible()
  }

  /**
   * Verify preview contains expected paragraph
   */
  async expectPreviewParagraph(text: string) {
    const preview = this.getPreview()
    await expect(preview.locator(`p:has-text("${text}")`)).toBeVisible()
  }

  /**
   * Verify preview contains expected button
   */
  async expectPreviewButton(text: string) {
    const preview = this.getPreview()
    await expect(
      preview.locator(`button:has-text("${text}")`)
    ).toBeVisible()
  }

  /**
   * Take a screenshot of the playground
   */
  async screenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` })
  }
}

/**
 * Helper to wait for condition with timeout
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeout: number = 5000,
  checkInterval: number = 100
): Promise<boolean> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, checkInterval))
  }

  return false
}
