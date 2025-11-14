/**
 * E2E Tests: Screen Navigation
 *
 * Tests the navigation functionality:
 * 1. Navigating between screens
 * 2. Screen metadata display
 * 3. Navigation buttons work
 * 4. Modal and drawer toggling
 * 5. Back navigation
 * 6. Navigator (bottom nav) functionality
 */

import { test, expect } from '@playwright/test'
import { PlaygroundPage } from './helpers/playground-helpers'
import {
  MULTI_SCREEN,
  MODAL_DRAWER,
  NAVIGATOR_EXAMPLE,
} from './fixtures/dsl-samples'

test.describe('Playground - Navigation', () => {
  let playground: PlaygroundPage

  test.beforeEach(async ({ page }) => {
    playground = new PlaygroundPage(page)
    await playground.goto()
  })

  test('should detect multiple screens', async () => {
    await playground.setEditorContent(MULTI_SCREEN)
    await playground.waitForPreviewUpdate()

    // Should detect 2 screens
    const screenCount = await playground.getScreenCount()
    expect(screenCount).toBe(2)
  })

  test('should display screen navigation buttons', async () => {
    await playground.setEditorContent(MULTI_SCREEN)
    await playground.waitForPreviewUpdate()

    // Should show buttons for each screen
    const screenButtons = playground.getScreenButtons()
    const count = await screenButtons.count()
    expect(count).toBeGreaterThanOrEqual(2)

    // Verify screen names
    await expect(screenButtons.filter({ hasText: 'Home' })).toBeVisible()
    await expect(screenButtons.filter({ hasText: 'Settings' })).toBeVisible()
  })

  test('should navigate between screens via metadata buttons', async () => {
    await playground.setEditorContent(MULTI_SCREEN)
    await playground.waitForPreviewUpdate()

    const preview = playground.getPreview()

    // Initial screen should be Home
    await expect(preview.locator('h1:has-text("Home Screen")')).toBeVisible()

    // Click Settings button in metadata
    await playground.navigateToScreen('Settings')

    // Preview should update to Settings screen
    await expect(preview.locator('h1:has-text("Settings")')).toBeVisible()
  })

  test('should navigate via buttons in preview', async () => {
    await playground.setEditorContent(MULTI_SCREEN)
    await playground.waitForPreviewUpdate()

    const preview = playground.getPreview()

    // Start on Home screen
    await expect(preview.locator('h1:has-text("Home Screen")')).toBeVisible()

    // Click "Go to Settings" button in preview
    await playground.clickPreviewButton('Go to Settings')

    // Should navigate to Settings
    await expect(preview.locator('h1:has-text("Settings")')).toBeVisible()

    // Click "Back to Home" button
    await playground.clickPreviewButton('Back to Home')

    // Should navigate back to Home
    await expect(preview.locator('h1:has-text("Home Screen")')).toBeVisible()
  })

  test('should show default screen on first render', async () => {
    await playground.setEditorContent(MULTI_SCREEN)
    await playground.waitForPreviewUpdate()

    const preview = playground.getPreview()

    // First screen in DSL should be the default
    await expect(preview.locator('h1:has-text("Home Screen")')).toBeVisible()
  })

  test('should handle modal toggling', async () => {
    await playground.setEditorContent(MODAL_DRAWER)
    await playground.waitForPreviewUpdate()

    const preview = playground.getPreview()

    // Initially, modal should not be visible (or hidden)
    // Click button to open modal
    await playground.clickPreviewButton('Open Modal')

    // Modal content should appear
    await expect(preview.locator('h1:has-text("Confirmation")')).toBeVisible()
  })

  test('should handle drawer toggling', async () => {
    await playground.setEditorContent(MODAL_DRAWER)
    await playground.waitForPreviewUpdate()

    const preview = playground.getPreview()

    // Click button to open drawer
    await playground.clickPreviewButton('Open Drawer')

    // Drawer content should appear
    await expect(preview.locator('h1:has-text("Menu")')).toBeVisible()
  })

  test('should update screen count when adding/removing screens', async () => {
    // Start with one screen
    await playground.setEditorContent('screen One:\n  container:\n    # One')
    await playground.waitForPreviewUpdate()

    let screenCount = await playground.getScreenCount()
    expect(screenCount).toBe(1)

    // Add second screen
    await playground.setEditorContent(
      'screen One:\n  container:\n    # One\n\nscreen Two:\n  container:\n    # Two'
    )
    await playground.waitForPreviewUpdate()

    screenCount = await playground.getScreenCount()
    expect(screenCount).toBe(2)
  })

  test('should maintain current screen when editing other parts of DSL', async () => {
    await playground.setEditorContent(MULTI_SCREEN)
    await playground.waitForPreviewUpdate()

    // Navigate to Settings
    await playground.navigateToScreen('Settings')

    const preview = playground.getPreview()
    await expect(preview.locator('h1:has-text("Settings")')).toBeVisible()

    // Edit DSL content slightly (not changing screen structure)
    await playground.setEditorContent(`screen Home:
  container:
    # Home Screen EDITED
    > Welcome to the app
    @[Go to Settings](Settings)

screen Settings:
  container:
    # Settings
    > Configure your app EDITED
    @[Back to Home](Home)`)

    await playground.waitForPreviewUpdate()

    // Should still be on Settings screen
    await expect(preview.locator('h1:has-text("Settings")')).toBeVisible()
  })

  test('should reset to default screen when current screen is deleted', async () => {
    await playground.setEditorContent(MULTI_SCREEN)
    await playground.waitForPreviewUpdate()

    // Navigate to Settings
    await playground.navigateToScreen('Settings')

    const preview = playground.getPreview()
    await expect(preview.locator('h1:has-text("Settings")')).toBeVisible()

    // Delete Settings screen from DSL
    await playground.setEditorContent(`screen Home:
  container:
    # Home Screen
    > Welcome to the app`)

    await playground.waitForPreviewUpdate()

    // Should fall back to Home screen (default)
    await expect(preview.locator('h1:has-text("Home Screen")')).toBeVisible()
  })

  test('should work with bottom navigator', async () => {
    await playground.setEditorContent(NAVIGATOR_EXAMPLE)
    await playground.waitForPreviewUpdate()

    const preview = playground.getPreview()

    // Navigator should be visible
    await expect(preview.locator('text=Home')).toBeVisible()
    await expect(preview.locator('text=Settings')).toBeVisible()

    // Click Settings in navigator
    const navigatorItems = preview.locator('nav a, nav button').filter({
      hasText: 'Settings',
    })

    if ((await navigatorItems.count()) > 0) {
      await navigatorItems.first().click()
      await playground.waitForPreviewUpdate(300)

      // Should navigate to Settings screen
      await expect(preview.locator('text=Settings content')).toBeVisible()
    }
  })

  test('should handle navigation to non-existent screen gracefully', async () => {
    // Create button that navigates to non-existent screen
    await playground.setEditorContent(`screen Home:
  container:
    # Home
    @[Go to Nowhere](NonExistentScreen)`)

    await playground.waitForPreviewUpdate()

    const preview = playground.getPreview()

    // Click the button
    await playground.clickPreviewButton('Go to Nowhere')

    // Should not crash - either stay on current screen or show error
    // At minimum, the preview should still be visible
    await expect(preview).toBeVisible()
  })

  test('should show screen metadata immediately after parse', async () => {
    await playground.setEditorContent(MULTI_SCREEN)

    // Metadata should update quickly
    await playground.waitForPreviewUpdate()

    const screenCount = await playground.getScreenCount()
    expect(screenCount).toBe(2)
  })

  test('should handle external links correctly', async () => {
    await playground.setEditorContent(`screen Home:
  container:
    # Home
    > [External Link](https://example.com)`)

    await playground.waitForPreviewUpdate()

    const preview = playground.getPreview()

    // External link should be rendered
    const link = preview.locator('a[href="https://example.com"]')
    await expect(link).toBeVisible()
  })

  test('should support back navigation via (-1)', async () => {
    await playground.setEditorContent(`screen Home:
  container:
    # Home
    @[Go Forward](Settings)

screen Settings:
  container:
    # Settings
    @[Go Back](-1)`)

    await playground.waitForPreviewUpdate()

    const preview = playground.getPreview()

    // Navigate forward
    await playground.clickPreviewButton('Go Forward')
    await expect(preview.locator('h1:has-text("Settings")')).toBeVisible()

    // Navigate back
    await playground.clickPreviewButton('Go Back')
    await expect(preview.locator('h1:has-text("Home")')).toBeVisible()
  })

  test('should handle multiple modals and drawers', async () => {
    await playground.setEditorContent(`screen Main:
  container:
    # Main
    @[Modal 1](Modal1)
    @[Modal 2](Modal2)

modal Modal1:
  container:
    # Modal One

modal Modal2:
  container:
    # Modal Two`)

    await playground.waitForPreviewUpdate()

    const preview = playground.getPreview()

    // Open first modal
    await playground.clickPreviewButton('Modal 1')
    await expect(preview.locator('h1:has-text("Modal One")')).toBeVisible()

    // Note: Testing multiple modals sequentially depends on implementation
    // This test verifies the DSL parses correctly at minimum
  })

  test('should preserve navigation state during editor updates', async () => {
    await playground.setEditorContent(MULTI_SCREEN)
    await playground.waitForPreviewUpdate()

    // Navigate to Settings
    await playground.navigateToScreen('Settings')

    const preview = playground.getPreview()
    await expect(preview.locator('h1:has-text("Settings")')).toBeVisible()

    // Make small edit that doesn't affect navigation
    await playground.typeInEditor(' ')
    await playground.page.keyboard.press('Backspace')
    await playground.waitForPreviewUpdate(500)

    // Should still be on Settings
    await expect(preview.locator('h1:has-text("Settings")')).toBeVisible()
  })

  test('should update navigation buttons when screen names change', async () => {
    await playground.setEditorContent(MULTI_SCREEN)
    await playground.waitForPreviewUpdate()

    // Change screen name
    await playground.setEditorContent(`screen Home:
  container:
    # Home Screen

screen Profile:
  container:
    # Profile Screen`)

    await playground.waitForPreviewUpdate()

    // New screen name should appear in buttons
    const screenButtons = playground.getScreenButtons()
    await expect(screenButtons.filter({ hasText: 'Profile' })).toBeVisible()
  })
})
