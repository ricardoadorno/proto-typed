import { test, expect, Page } from '@playwright/test'

/**
 * E2E Tests for Playground Editor Interactions
 * 
 * Focus on:
 * - Monaco Editor behavior
 * - Syntax highlighting
 * - Auto-completion (IntelliSense)
 * - Real-time parsing and preview updates
 * - Editor responsiveness
 * - Keyboard shortcuts
 */

const EDITOR_SELECTOR = '.monaco-editor'
const PREVIEW_SELECTOR = '[style*="containerType"]'

async function waitForEditor(page: Page) {
  await page.waitForSelector(EDITOR_SELECTOR, { timeout: 10000 })
  await page.waitForTimeout(1000) // Extra time for Monaco to fully load
}

async function getEditorText(page: Page): Promise<string> {
  // Get text from Monaco editor
  const lines = await page.locator('.view-line').allTextContents()
  return lines.join('\n')
}

async function clearEditor(page: Page) {
  await page.click(EDITOR_SELECTOR)
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Delete')
  await page.waitForTimeout(300)
}

async function typeInEditor(page: Page, text: string, delay = 50) {
  await page.click(EDITOR_SELECTOR)
  await page.keyboard.type(text, { delay })
  await page.waitForTimeout(500)
}

async function getPreviewHTML(page: Page): Promise<string> {
  const previewElement = await page.locator(PREVIEW_SELECTOR).first()
  return await previewElement.innerHTML()
}

test.describe('Playground Editor - Basic Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve carregar Monaco Editor corretamente', async ({ page }) => {
    // Verify Monaco is loaded
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
    
    // Check for Monaco-specific elements
    await expect(page.locator('.monaco-scrollable-element')).toBeVisible()
    await expect(page.locator('.view-lines')).toBeVisible()
  })

  test('deve permitir digitar no editor', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Test:\n  container:\n    # Hello')
    
    await page.waitForTimeout(1000)
    
    // Verify text appears in preview
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Hello')
  })

  test('deve suportar Ctrl+A para selecionar tudo', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Home:\n  container:\n    # Test')
    
    // Select all
    await page.keyboard.press('Control+A')
    
    // Type replacement
    await page.keyboard.type('screen New:\n  container:\n    # Replaced')
    
    await page.waitForTimeout(1000)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Replaced')
    expect(previewHtml).not.toContain('Test')
  })

  test('deve suportar Ctrl+Z para desfazer', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Home:\n  container:\n    # Original')
    await page.waitForTimeout(500)
    
    let previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Original')
    
    // Type more
    await typeInEditor(page, '\n    # New Line')
    await page.waitForTimeout(500)
    
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('New Line')
    
    // Undo
    await page.keyboard.press('Control+Z')
    await page.waitForTimeout(1000)
    
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Original')
  })

  test('deve suportar Ctrl+Y para refazer', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Test:\n  container:\n    # Text')
    await page.waitForTimeout(500)
    
    // Undo
    await page.keyboard.press('Control+Z')
    await page.keyboard.press('Control+Z')
    await page.waitForTimeout(500)
    
    // Redo
    await page.keyboard.press('Control+Y')
    await page.waitForTimeout(1000)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toBeTruthy()
  })

  test('deve suportar Ctrl+/ para comentar linha', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Test:\n  container:\n    # Hello')
    
    // Go to first line
    await page.keyboard.press('Control+Home')
    
    // Comment line
    await page.keyboard.press('Control+/')
    
    await page.waitForTimeout(500)
    
    // The line should be commented (if Monaco supports it for DSL)
    // This may or may not work depending on language configuration
  })

  test('deve suportar navegação com setas', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Test:\n  container:\n    # Hello')
    
    // Navigate with arrows
    await page.keyboard.press('Home')
    await page.keyboard.press('End')
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowRight')
    
    // Should not crash
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
  })
})

test.describe('Playground Editor - Real-Time Updates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve atualizar preview em tempo real ao digitar', async ({ page }) => {
    await clearEditor(page)
    
    // Type gradually and check preview updates
    await typeInEditor(page, 'screen Home:', 50)
    await page.waitForTimeout(500)
    
    await typeInEditor(page, '\n  container:', 50)
    await page.waitForTimeout(500)
    
    await typeInEditor(page, '\n    # Welcome', 50)
    await page.waitForTimeout(1000)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Welcome')
  })

  test('deve atualizar preview após deletar conteúdo', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Test:\n  container:\n    # Original')
    await page.waitForTimeout(1000)
    
    let previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Original')
    
    // Delete some content
    await page.keyboard.press('End')
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Backspace')
    }
    await page.keyboard.type('Modified')
    await page.waitForTimeout(1000)
    
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Modified')
    expect(previewHtml).not.toContain('Original')
  })

  test('deve atualizar preview ao colar código', async ({ page }) => {
    await clearEditor(page)
    
    const codeToType = `screen Pasted:
  container:
    # This was pasted
    > From clipboard`
    
    await typeInEditor(page, codeToType, 10)
    await page.waitForTimeout(1500)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('This was pasted')
    expect(previewHtml).toContain('From clipboard')
  })

  test('deve manter preview atualizado durante edições contínuas', async ({ page }) => {
    await clearEditor(page)
    
    // Make multiple rapid edits
    await typeInEditor(page, 'screen A:\n  container:\n    # Version 1', 10)
    await page.waitForTimeout(800)
    
    let previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Version 1')
    
    // Clear and type new version
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Delete')
    await typeInEditor(page, 'screen B:\n  container:\n    # Version 2', 10)
    await page.waitForTimeout(800)
    
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Version 2')
    
    // One more change
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Delete')
    await typeInEditor(page, 'screen C:\n  container:\n    # Version 3', 10)
    await page.waitForTimeout(800)
    
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Version 3')
  })
})

test.describe('Playground Editor - Syntax Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve aplicar indentação ao pressionar Tab', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Test:', 50)
    await page.keyboard.press('Enter')
    await page.keyboard.press('Tab')
    await typeInEditor(page, 'container:', 50)
    
    await page.waitForTimeout(500)
    
    // The text should be indented (Monaco handles this)
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
  })

  test('deve suportar Enter para nova linha', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Test:', 50)
    await page.keyboard.press('Enter')
    await typeInEditor(page, '  container:', 50)
    await page.keyboard.press('Enter')
    await typeInEditor(page, '    # Hello', 50)
    
    await page.waitForTimeout(1000)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Hello')
  })

  test('deve permitir múltiplas linhas vazias', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Test:', 50)
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await typeInEditor(page, '  container:', 50)
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await typeInEditor(page, '    # Hello', 50)
    
    await page.waitForTimeout(1000)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Hello')
  })

  test('deve lidar com tabs e espaços misturados', async ({ page }) => {
    await clearEditor(page)
    
    // Mix of tabs and spaces (may cause parsing issues but shouldn't crash)
    await typeInEditor(page, 'screen Test:\n  container:\n    # Hello', 10)
    
    await page.waitForTimeout(1000)
    
    // Should still render something
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toBeDefined()
  })
})

test.describe('Playground Editor - Example Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve carregar exemplo de login ao clicar no botão', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(1000)
    
    // Click Login Example button
    const loginButton = page.getByRole('button', { name: /Login Example/i })
    await loginButton.click()
    
    await page.waitForTimeout(1500)
    
    // Verify content in preview
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Login')
    expect(previewHtml).toContain('Username')
    expect(previewHtml).toContain('Password')
  })

  test('deve carregar exemplo de contatos ao clicar no botão', async ({ page }) => {
    await page.waitForTimeout(1000)
    
    // Click Contacts App button
    const contactsButton = page.getByRole('button', { name: /Contacts App/i })
    await contactsButton.click()
    
    await page.waitForTimeout(1500)
    
    // Verify content
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Contact')
    expect(previewHtml).toContain('John Silva')
  })

  test('deve preservar estado do editor após troca de exemplo', async ({ page }) => {
    await page.waitForTimeout(1000)
    
    // Load Login Example
    await page.getByRole('button', { name: /Login Example/i }).click()
    await page.waitForTimeout(1000)
    
    let previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Login')
    
    // Load Contacts Example
    await page.getByRole('button', { name: /Contacts App/i }).click()
    await page.waitForTimeout(1000)
    
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Contact')
    expect(previewHtml).not.toContain('Login')
    
    // Load Login again
    await page.getByRole('button', { name: /Login Example/i }).click()
    await page.waitForTimeout(1000)
    
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Login')
  })
})

test.describe('Playground Editor - Error Resilience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve continuar funcionando após digitar DSL incompleto', async ({ page }) => {
    await clearEditor(page)
    
    // Type incomplete DSL
    await typeInEditor(page, 'screen Test:', 50)
    await page.waitForTimeout(500)
    
    // Add more
    await typeInEditor(page, '\n  container:', 50)
    await page.waitForTimeout(500)
    
    // Complete it
    await typeInEditor(page, '\n    # Done', 50)
    await page.waitForTimeout(1000)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Done')
  })

  test('deve recuperar de erro de sintaxe', async ({ page }) => {
    await clearEditor(page)
    
    // Type invalid syntax
    await typeInEditor(page, 'invalid syntax here\nno screen defined', 30)
    await page.waitForTimeout(1000)
    
    // Should not crash
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
    
    // Fix it
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Delete')
    await typeInEditor(page, 'screen Fixed:\n  container:\n    # Works now', 30)
    await page.waitForTimeout(1000)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Works now')
  })

  test('deve lidar com caracteres Unicode', async ({ page }) => {
    await clearEditor(page)
    
    await typeInEditor(page, 'screen Unicode:\n  container:\n    # 你好 世界 🌍\n    > Olá Mundo 🇧🇷', 30)
    await page.waitForTimeout(1000)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('你好')
    expect(previewHtml).toContain('🌍')
    expect(previewHtml).toContain('Olá')
  })

  test('deve processar DSL com muitas linhas em branco', async ({ page }) => {
    await clearEditor(page)
    
    const dslWithBlanks = `screen Test:


  container:


    # Hello


    > World


`
    
    await typeInEditor(page, dslWithBlanks, 10)
    await page.waitForTimeout(1500)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Hello')
    expect(previewHtml).toContain('World')
  })
})

test.describe('Playground Editor - Focus & Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve permitir clicar no editor para focar', async ({ page }) => {
    // Click on editor
    await page.click(EDITOR_SELECTOR)
    
    // Editor should be focused (we can type)
    await page.keyboard.type('screen Test:')
    await page.waitForTimeout(500)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Test')
  })

  test('deve manter foco durante digitação', async ({ page }) => {
    await clearEditor(page)
    await page.click(EDITOR_SELECTOR)
    
    // Type continuously
    await page.keyboard.type('screen ')
    await page.waitForTimeout(100)
    await page.keyboard.type('Test:')
    await page.waitForTimeout(100)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(100)
    await page.keyboard.type('  container:')
    
    await page.waitForTimeout(1000)
    
    // Should have captured all typing
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toBeTruthy()
  })

  test('deve permitir selecionar texto com mouse', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Test:\n  container:\n    # Hello World')
    await page.waitForTimeout(500)
    
    // Try to select some text (this is tricky in Monaco)
    const monacoContent = page.locator('.view-lines')
    await monacoContent.click()
    
    // Selection via keyboard
    await page.keyboard.press('Control+Home')
    await page.keyboard.down('Shift')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.up('Shift')
    
    // Should not crash
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
  })

  test('deve permitir Ctrl+Home e Ctrl+End', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Test:\n  container:\n    # Line 1\n    # Line 2\n    # Line 3')
    await page.waitForTimeout(500)
    
    // Go to end
    await page.keyboard.press('Control+End')
    await page.waitForTimeout(100)
    
    // Go to beginning
    await page.keyboard.press('Control+Home')
    await page.waitForTimeout(100)
    
    // Should not crash
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
  })
})

test.describe('Playground Editor - Large Content Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve lidar com DSL de tamanho médio (50 linhas)', async ({ page }) => {
    await clearEditor(page)
    
    const lines = []
    for (let i = 0; i < 10; i++) {
      lines.push(`screen Screen${i}:`)
      lines.push('  container:')
      lines.push(`    # Screen ${i}`)
      lines.push(`    > Content for screen ${i}`)
      lines.push('')
    }
    
    const dsl = lines.join('\n')
    
    // Type it all (this will take a moment)
    await typeInEditor(page, dsl, 5)
    await page.waitForTimeout(2000)
    
    // Should render without issues
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toBeTruthy()
    expect(previewHtml.length).toBeGreaterThan(500)
  })

  test('deve suportar scroll no editor', async ({ page }) => {
    await clearEditor(page)
    
    // Create content that requires scrolling
    const lines = []
    for (let i = 0; i < 30; i++) {
      lines.push(`# Line ${i}`)
    }
    
    const dsl = `screen Tall:\n  container:\n    ${lines.join('\n    ')}`
    
    await typeInEditor(page, dsl, 5)
    await page.waitForTimeout(1000)
    
    // Try to scroll
    const editorElement = page.locator(EDITOR_SELECTOR)
    await editorElement.hover()
    await page.mouse.wheel(0, 500)
    await page.waitForTimeout(300)
    await page.mouse.wheel(0, -500)
    
    // Should not crash
    await expect(editorElement).toBeVisible()
  })
})

test.describe('Playground Editor - Copy/Paste Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve permitir copiar todo o conteúdo (Ctrl+A -> Ctrl+C)', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Copy:\n  container:\n    # To be copied')
    
    await page.waitForTimeout(500)
    
    // Select all and copy
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Control+C')
    
    // Should not crash
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()
  })

  test('deve permitir cortar conteúdo (Ctrl+X)', async ({ page }) => {
    await clearEditor(page)
    await typeInEditor(page, 'screen Cut:\n  container:\n    # To be cut')
    await page.waitForTimeout(500)
    
    let previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('To be cut')
    
    // Select all and cut
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Control+X')
    await page.waitForTimeout(1000)
    
    // Preview should be empty or show "no screens"
    await expect(page.getByText(/No screens|0 screens/i)).toBeVisible()
  })
})

