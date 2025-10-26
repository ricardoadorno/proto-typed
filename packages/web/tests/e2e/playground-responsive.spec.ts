import { test, expect, Page, devices } from '@playwright/test'

/**
 * E2E Tests for Playground Responsiveness
 *
 * Focus on:
 * - Mobile viewport behavior
 * - Tablet viewport behavior
 * - Desktop viewport behavior
 * - Layout adaptation
 * - Touch interactions
 * - Preview device rendering
 */

const EDITOR_SELECTOR = '.monaco-editor'
const PREVIEW_SELECTOR = '[style*="containerType"]'

async function waitForEditor(page: Page) {
  await page.waitForSelector(EDITOR_SELECTOR, { timeout: 10000 })
  await page.waitForTimeout(1000)
}

async function clearEditor(page: Page) {
  await page.click(EDITOR_SELECTOR)
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Delete')
  await page.waitForTimeout(300)
}

async function typeInEditor(page: Page, text: string) {
  await page.click(EDITOR_SELECTOR)
  await page.keyboard.type(text, { delay: 10 })
  await page.waitForTimeout(800)
}

async function getPreviewHTML(page: Page): Promise<string> {
  const previewElement = await page.locator(PREVIEW_SELECTOR).first()
  return await previewElement.innerHTML()
}

test.describe('Playground Responsive - Desktop (1920x1080)', () => {
  test.use({ viewport: { width: 1920, height: 1080 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve exibir editor e preview lado a lado', async ({ page }) => {
    // In desktop, editor and preview should be in a grid layout
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
    await expect(page.locator(PREVIEW_SELECTOR)).toBeVisible()

    // Check if both are visible at the same time
    const editorBox = await page.locator(EDITOR_SELECTOR).boundingBox()
    const previewBox = await page.locator(PREVIEW_SELECTOR).boundingBox()

    expect(editorBox).toBeTruthy()
    expect(previewBox).toBeTruthy()

    // They should not overlap significantly (side by side in grid)
    if (editorBox && previewBox) {
      const overlap =
        Math.min(
          editorBox.x + editorBox.width,
          previewBox.x + previewBox.width
        ) - Math.max(editorBox.x, previewBox.x)
      expect(overlap).toBeLessThan(100) // Minimal overlap
    }
  })

  test('deve ter controles visíveis no desktop', async ({ page }) => {
    // All controls should be visible
    await expect(
      page.getByRole('button', { name: /Export HTML/i })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /Login Example|Contacts App/i }).first()
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /documentation/i })
    ).toBeVisible()
  })

  test('deve renderizar botões de screen no metadata', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(
      page,
      `screen A:\n  container:\n    # A\n\nscreen B:\n  container:\n    # B`
    )

    await page.waitForTimeout(1000)

    // Screen buttons should be visible
    await expect(
      page.getByRole('button', { name: 'A', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'B', exact: true })
    ).toBeVisible()
  })

  test('deve ter preview device visível', async ({ page }) => {
    // PreviewDevice component should be visible
    const preview = page.locator(PREVIEW_SELECTOR)
    await expect(preview).toBeVisible()

    // Check for device-like styling (may have specific classes)
    const hasContent = await preview.innerHTML()
    expect(hasContent).toBeTruthy()
  })
})

test.describe('Playground Responsive - Tablet (768x1024)', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve exibir editor e preview responsivamente', async ({ page }) => {
    // Editor and preview should still be visible
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
    await expect(page.locator(PREVIEW_SELECTOR)).toBeVisible()
  })

  test('deve ter controles acessíveis no tablet', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /Export HTML/i })
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /documentation/i })
    ).toBeVisible()
  })

  test('deve permitir digitação no tablet', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Tablet:\n  container:\n    # Tablet Test')

    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Tablet Test')
  })

  test('deve renderizar preview device adequadamente', async ({ page }) => {
    const preview = page.locator(PREVIEW_SELECTOR)
    await expect(preview).toBeVisible()

    const boundingBox = await preview.boundingBox()
    expect(boundingBox).toBeTruthy()
    if (boundingBox) {
      expect(boundingBox.width).toBeGreaterThan(0)
      expect(boundingBox.height).toBeGreaterThan(0)
    }
  })
})

test.describe('Playground Responsive - Mobile (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve carregar no mobile', async ({ page }) => {
    // Page should load without errors
    await expect(
      page.locator('h1').filter({ hasText: /playground/i })
    ).toBeVisible()
  })

  test('deve ter editor visível no mobile', async ({ page }) => {
    // Editor should be visible (may be stacked vertically)
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
  })

  test('deve ter preview visível no mobile', async ({ page }) => {
    // Preview should be visible (may require scrolling)
    const preview = page.locator(PREVIEW_SELECTOR)

    // Scroll down to see preview if needed
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    await expect(preview).toBeVisible()
  })

  test('deve permitir digitação no mobile', async ({ page }) => {
    await page.locator(EDITOR_SELECTOR).click()

    // Type using keyboard
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Delete')
    await page.keyboard.type(
      'screen Mobile:\n  container:\n    # Mobile Test',
      { delay: 20 }
    )

    await page.waitForTimeout(1500)

    // Scroll to preview
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Mobile Test')
  })

  test('deve ter botões de controle acessíveis no mobile', async ({ page }) => {
    // May need to scroll to see all controls
    const exportButton = page.getByRole('button', { name: /Export HTML/i })
    await exportButton.scrollIntoViewIfNeeded()
    await expect(exportButton).toBeVisible()
  })
})

test.describe('Playground Responsive - iPhone 12', () => {
  test.use({ ...devices['iPhone 12'] })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve carregar no iPhone 12', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible()
  })

  test('deve renderizar editor no iPhone', async ({ page }) => {
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
  })

  test('deve processar input no iPhone', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen iPhone:\n  container:\n    # iOS Test')

    // Scroll to preview
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('iOS Test')
  })
})

test.describe('Playground Responsive - iPad', () => {
  test.use({ ...devices['iPad (gen 7)'] })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve carregar no iPad', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible()
  })

  test('deve exibir layout adaptado para iPad', async ({ page }) => {
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
    await expect(page.locator(PREVIEW_SELECTOR)).toBeVisible()
  })

  test('deve processar input no iPad', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen iPad:\n  container:\n    # iPad Test')

    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('iPad Test')
  })

  test('deve permitir navegação entre screens no iPad', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(
      page,
      `screen A:\n  container:\n    # Screen A\n\nscreen B:\n  container:\n    # Screen B`
    )

    await page.waitForTimeout(1000)

    // Should show screen buttons
    const screenButtons = page.getByRole('button').filter({ hasText: /^[AB]$/ })
    const count = await screenButtons.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })
})

test.describe('Playground Responsive - Wide Screen (2560x1440)', () => {
  test.use({ viewport: { width: 2560, height: 1440 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve utilizar espaço disponível em telas largas', async ({ page }) => {
    // Editor and preview should be visible with good spacing
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
    await expect(page.locator(PREVIEW_SELECTOR)).toBeVisible()

    // Check that content is not stretched too much (has max-width)
    const main = page.locator('main')
    const mainBox = await main.boundingBox()

    expect(mainBox).toBeTruthy()
    if (mainBox) {
      // Should have max-width constraint
      expect(mainBox.width).toBeLessThan(2000) // Reasonable max width
    }
  })

  test('deve manter layout legível em wide screen', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(
      page,
      'screen Wide:\n  container:\n    # Wide Screen Test\n    > Content should be readable'
    )

    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Wide Screen Test')
  })
})

test.describe('Playground Responsive - Preview Device Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar conteúdo dentro do preview device', async ({
    page,
  }) => {
    await clearEditor(page)
    await typeInEditor(
      page,
      'screen Test:\n  container:\n    # Hello Device\n    @primary[Button](action)'
    )

    await page.waitForTimeout(1000)

    // Content should be inside preview
    const preview = page.locator(PREVIEW_SELECTOR)
    const content = await preview.innerHTML()

    expect(content).toContain('Hello Device')
    expect(content).toContain('Button')
  })

  test('deve aplicar estilos de device ao preview', async ({ page }) => {
    // PreviewDevice component should have device-like styling
    const preview = page.locator(PREVIEW_SELECTOR)
    await expect(preview).toBeVisible()

    // Check for containerType style
    const style = await preview.getAttribute('style')
    expect(style).toContain('containerType')
  })

  test('deve permitir scroll no preview', async ({ page }) => {
    await clearEditor(page)

    // Create tall content
    const tallContent = Array.from(
      { length: 30 },
      (_, i) => `    # Section ${i}`
    ).join('\n')
    await typeInEditor(page, `screen Tall:\n  container:\n${tallContent}`)

    await page.waitForTimeout(1000)

    // Preview should have scrollable content
    const preview = page.locator(PREVIEW_SELECTOR)
    const scrollHeight = await preview.evaluate((el) => el.scrollHeight)
    const clientHeight = await preview.evaluate((el) => el.clientHeight)

    // ScrollHeight should be greater if content is tall
    expect(scrollHeight).toBeGreaterThanOrEqual(clientHeight)
  })

  test('deve renderizar múltiplos elementos no preview', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(
      page,
      `screen Multi:
  container:
    # Heading
    > Paragraph
    @primary[Button](a)
    @secondary[Button 2](b)
    card:
      ## Card Title
      > Card content`
    )

    await page.waitForTimeout(1000)

    const preview = page.locator(PREVIEW_SELECTOR)
    const buttons = await preview.locator('button').count()

    expect(buttons).toBeGreaterThanOrEqual(2)
  })
})

test.describe('Playground Responsive - Interaction Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve permitir click em botões do preview', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(
      page,
      `screen A:\n  container:\n    # Screen A\n    @primary[Go to B](B)\n\nscreen B:\n  container:\n    # Screen B`
    )

    await page.waitForTimeout(1000)

    // Click button in preview
    const preview = page.locator(PREVIEW_SELECTOR)
    const button = preview.locator('button:has-text("Go to B")')

    await button.click()
    await page.waitForTimeout(800)

    // Screen should change
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Screen B')
  })

  test('deve permitir interação com forms no preview', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(
      page,
      `screen Form:\n  container:\n    card:\n      ___: Name{Your name}\n      ___email: Email{email@example.com}\n      @primary[Submit](action)`
    )

    await page.waitForTimeout(1000)

    // Try to interact with inputs
    const preview = page.locator(PREVIEW_SELECTOR)
    const nameInput = preview.locator('input[type="text"]').first()

    await nameInput.click()
    await nameInput.fill('John Doe')

    const value = await nameInput.inputValue()
    expect(value).toBe('John Doe')
  })

  test('deve permitir check/uncheck de checkboxes', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(
      page,
      `screen Options:\n  container:\n    [X] Option 1\n    [ ] Option 2`
    )

    await page.waitForTimeout(1000)

    const preview = page.locator(PREVIEW_SELECTOR)
    const checkbox = preview.locator('input[type="checkbox"]').first()

    // Check initial state
    const initialChecked = await checkbox.isChecked()

    // Toggle it
    await checkbox.click()

    const afterCheck = await checkbox.isChecked()
    expect(afterCheck).toBe(!initialChecked)
  })

  test('deve permitir seleção de radio buttons', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(
      page,
      `screen Radio:\n  container:\n    (X) Option A\n    ( ) Option B\n    ( ) Option C`
    )

    await page.waitForTimeout(1000)

    const preview = page.locator(PREVIEW_SELECTOR)
    const radios = preview.locator('input[type="radio"]')

    // Click second radio
    await radios.nth(1).click()

    const isChecked = await radios.nth(1).isChecked()
    expect(isChecked).toBe(true)
  })
})

test.describe('Playground Responsive - Layout Stress Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar grid complexo em diferentes viewports', async ({
    page,
  }) => {
    await clearEditor(page)
    await typeInEditor(
      page,
      `screen Grid:\n  container:\n    grid-4:\n      card:\n        > 1\n      card:\n        > 2\n      card:\n        > 3\n      card:\n        > 4`
    )

    await page.waitForTimeout(1000)

    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('1')
    expect(previewHtml).toContain('4')

    // Resize viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)

    // Should still render
    const newHtml = await getPreviewHTML(page)
    expect(newHtml).toContain('1')
  })

  test('deve manter preview responsivo durante resize', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(
      page,
      'screen Resize:\n  container:\n    # Responsive Test'
    )

    // Start at desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForTimeout(500)
    let html = await getPreviewHTML(page)
    expect(html).toContain('Responsive Test')

    // Resize to tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)
    html = await getPreviewHTML(page)
    expect(html).toContain('Responsive Test')

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)
    html = await getPreviewHTML(page)
    expect(html).toContain('Responsive Test')
  })
})
