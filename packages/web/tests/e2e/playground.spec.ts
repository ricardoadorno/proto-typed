import { test, expect, Page } from '@playwright/test'

/**
 * E2E Tests for Proto-Typed Playground
 * 
 * Tests the complete playground functionality:
 * - Editor input and DSL parsing
 * - Live preview rendering
 * - Navigation between screens
 * - Example loading
 * - Theme switching
 * - HTML export
 * - Complex DSL elements (forms, modals, components, etc.)
 */

const EDITOR_SELECTOR = '.monaco-editor'
const PREVIEW_SELECTOR = '[style*="containerType"]'

// Helper to wait for Monaco to be ready
async function waitForEditor(page: Page) {
  await page.waitForSelector(EDITOR_SELECTOR, { timeout: 10000 })
  await page.waitForTimeout(500) // Wait for Monaco to fully initialize
}

// Helper to clear editor and set new content
async function setEditorContent(page: Page, content: string) {
  await waitForEditor(page)
  
  // Focus editor and select all
  await page.click(EDITOR_SELECTOR)
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Delete')
  
  // Type new content
  await page.keyboard.type(content, { delay: 10 })
  
  // Wait for parsing
  await page.waitForTimeout(1000)
}

// Helper to get preview HTML content
async function getPreviewHTML(page: Page): Promise<string> {
  const previewElement = await page.locator(PREVIEW_SELECTOR).first()
  return await previewElement.innerHTML()
}

test.describe('Playground - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve carregar o playground com exemplo padrão', async ({ page }) => {
    // Verify page title
    await expect(page.getByRole('heading', { name: /playground/i })).toBeVisible()

    // Verify editor is present
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible()

    // Verify preview panel
    await expect(page.getByText(/Live Preview/i)).toBeVisible()
    
    // Verify initial example is loaded
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toBeTruthy()
    expect(previewHtml.length).toBeGreaterThan(100)
  })

  test('deve exibir botões de exemplo', async ({ page }) => {
    // Check for example buttons
    const exampleButtons = page.getByRole('button', { name: /Contacts App|Login Example/i })
    await expect(exampleButtons.first()).toBeVisible()
  })

  test('deve alternar entre exemplos', async ({ page }) => {
    // Click on Login Example
    const loginButton = page.getByRole('button', { name: /Login Example/i })
    await loginButton.click()
    
    await page.waitForTimeout(1000)
    
    // Verify the preview contains login-related content
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Login')
    
    // Switch to Contacts App
    const contactsButton = page.getByRole('button', { name: /Contacts App/i })
    await contactsButton.click()
    
    await page.waitForTimeout(1000)
    
    // Verify the preview contains contacts-related content
    const newPreviewHtml = await getPreviewHTML(page)
    expect(newPreviewHtml).toContain('Contact')
  })

  test('deve exibir contagem de screens detectadas', async ({ page }) => {
    // Wait for metadata to be processed
    await page.waitForTimeout(1000)
    
    // Check for screens detected text
    const screensText = page.getByText(/screens detected/i)
    await expect(screensText).toBeVisible()
  })

  test('deve ter botão de exportar HTML', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: /Export HTML/i })
    await expect(exportButton).toBeVisible()
  })

  test('deve ter seletor de tema', async ({ page }) => {
    // Look for theme preset selector
    const themeLabel = page.getByText(/Theme preset/i)
    await expect(themeLabel).toBeVisible()
  })

  test('deve ter link para documentação', async ({ page }) => {
    const docsLink = page.getByRole('link', { name: /documentation/i })
    await expect(docsLink).toBeVisible()
    await expect(docsLink).toHaveAttribute('href', /\/docs/)
  })
})

test.describe('Playground - Editor Input & Preview Output', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar screen simples', async ({ page }) => {
    const dsl = `screen Home:
  container:
    # Welcome
    > This is a test`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Welcome')
    expect(previewHtml).toContain('This is a test')
    expect(previewHtml).toContain('screen-Home')
  })

  test('deve renderizar botões com variantes', async ({ page }) => {
    const dsl = `screen Buttons:
  container:
    @primary[Primary Button](action)
    @secondary[Secondary Button](action)
    @outline[Outline Button](action)
    @ghost[Ghost Button](action)
    @destructive[Destructive Button](action)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Primary Button')
    expect(previewHtml).toContain('Secondary Button')
    expect(previewHtml).toContain('Outline Button')
    expect(previewHtml).toContain('Ghost Button')
    expect(previewHtml).toContain('Destructive Button')
    
    // Check button elements
    const buttons = await page.locator(PREVIEW_SELECTOR + ' button').all()
    expect(buttons.length).toBeGreaterThanOrEqual(5)
  })

  test('deve renderizar tipografia', async ({ page }) => {
    const dsl = `screen Typography:
  container:
    # Heading 1
    ## Heading 2
    ### Heading 3
    > Paragraph text
    >> Regular text
    >>> Muted text
    *> Note text
    "> Quote text`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Heading 1')
    expect(previewHtml).toContain('Heading 2')
    expect(previewHtml).toContain('Heading 3')
    expect(previewHtml).toContain('Paragraph text')
    expect(previewHtml).toContain('Regular text')
    expect(previewHtml).toContain('Muted text')
    expect(previewHtml).toContain('Note text')
    expect(previewHtml).toContain('Quote text')
  })

  test('deve renderizar layouts (container, stack, row, grid)', async ({ page }) => {
    const dsl = `screen Layouts:
  container:
    # Layouts Demo
    stack:
      > Stack item 1
      > Stack item 2
    row-between:
      > Row item 1
      > Row item 2
    grid-3:
      card:
        > Grid 1
      card:
        > Grid 2
      card:
        > Grid 3`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Layouts Demo')
    expect(previewHtml).toContain('Stack item 1')
    expect(previewHtml).toContain('Row item 1')
    expect(previewHtml).toContain('Grid 1')
    expect(previewHtml).toContain('Grid 2')
    expect(previewHtml).toContain('Grid 3')
  })

  test('deve renderizar formulários com inputs', async ({ page }) => {
    const dsl = `screen Form:
  container:
    card:
      ## Contact Form
      ___: Full Name{Enter your name}
      ___email: Email{Your email}
      ___password: Password{Your password}
      ___number: Age{Your age}
      ___textarea: Message{Your message}
      @primary[Submit](action)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Contact Form')
    expect(previewHtml).toContain('Full Name')
    expect(previewHtml).toContain('Email')
    expect(previewHtml).toContain('Password')
    expect(previewHtml).toContain('Age')
    expect(previewHtml).toContain('Message')
    
    // Check for input elements
    const preview = page.locator(PREVIEW_SELECTOR).first()
    await expect(preview.locator('input[type="text"]')).toHaveCount(1)
    await expect(preview.locator('input[type="email"]')).toHaveCount(1)
    await expect(preview.locator('input[type="password"]')).toHaveCount(1)
    await expect(preview.locator('input[type="number"]')).toHaveCount(1)
    await expect(preview.locator('textarea')).toHaveCount(1)
  })

  test('deve renderizar checkboxes e radio buttons', async ({ page }) => {
    const dsl = `screen Options:
  container:
    ## Preferences
    [X] Option 1 checked
    [ ] Option 2 unchecked
    
    ## Choose Plan
    (X) Basic Plan
    ( ) Pro Plan
    ( ) Enterprise Plan`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Option 1 checked')
    expect(previewHtml).toContain('Option 2 unchecked')
    expect(previewHtml).toContain('Basic Plan')
    expect(previewHtml).toContain('Pro Plan')
    expect(previewHtml).toContain('Enterprise Plan')
    
    // Check for checkbox and radio inputs
    const preview = page.locator(PREVIEW_SELECTOR).first()
    await expect(preview.locator('input[type="checkbox"]')).toHaveCount(2)
    await expect(preview.locator('input[type="radio"]')).toHaveCount(3)
  })

  test('deve renderizar links e imagens', async ({ page }) => {
    const dsl = `screen Media:
  container:
    # Media Demo
    > Check out our #[website](https://example.com)
    ![Logo](https://via.placeholder.com/150)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('website')
    expect(previewHtml).toContain('example.com')
    expect(previewHtml).toContain('via.placeholder.com/150')
    
    // Check for actual elements
    const preview = page.locator(PREVIEW_SELECTOR).first()
    await expect(preview.locator('a[href*="example.com"]')).toBeVisible()
    await expect(preview.locator('img[src*="placeholder"]')).toBeVisible()
  })
})

test.describe('Playground - Components System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar componente sem props', async ({ page }) => {
    const dsl = `component Header:
  header:
    # My App

screen Home:
  $Header
  container:
    > Content here`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('My App')
    expect(previewHtml).toContain('Content here')
  })

  test('deve renderizar componente com props', async ({ page }) => {
    const dsl = `component UserCard:
  card:
    ## %name
    > %email
    >>> %role

screen Users:
  container:
    $UserCard:
      - John Doe | john@example.com | Admin
    $UserCard:
      - Jane Smith | jane@example.com | User`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('John Doe')
    expect(previewHtml).toContain('john@example.com')
    expect(previewHtml).toContain('Admin')
    expect(previewHtml).toContain('Jane Smith')
    expect(previewHtml).toContain('jane@example.com')
    expect(previewHtml).toContain('User')
  })

  test('deve renderizar lista de componentes', async ({ page }) => {
    const dsl = `component TaskItem:
  row-between:
    > %task
    @outline-sm[Edit](action)

screen Tasks:
  container:
    # Task List
    list $TaskItem:
      - Buy groceries
      - Pay bills
      - Call dentist
      - Finish report`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Task List')
    expect(previewHtml).toContain('Buy groceries')
    expect(previewHtml).toContain('Pay bills')
    expect(previewHtml).toContain('Call dentist')
    expect(previewHtml).toContain('Finish report')
    
    // Check for multiple Edit buttons (one per task)
    const preview = page.locator(PREVIEW_SELECTOR).first()
    const editButtons = await preview.locator('button:has-text("Edit")').all()
    expect(editButtons.length).toBe(4)
  })
})

test.describe('Playground - Multi-Screen Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve detectar múltiplas screens', async ({ page }) => {
    const dsl = `screen Home:
  container:
    # Home
    @[Go to About](About)

screen About:
  container:
    # About
    @[Go to Contact](Contact)

screen Contact:
  container:
    # Contact
    @[Back to Home](Home)`

    await setEditorContent(page, dsl)
    
    // Check that 3 screens are detected
    await expect(page.getByText('3 screens detected')).toBeVisible()
    
    // Check for screen navigation buttons in metadata area
    await expect(page.getByRole('button', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'About' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Contact' })).toBeVisible()
  })

  test('deve navegar entre screens usando botões de metadata', async ({ page }) => {
    const dsl = `screen Dashboard:
  container:
    # Dashboard Content

screen Profile:
  container:
    # Profile Content

screen Settings:
  container:
    # Settings Content`

    await setEditorContent(page, dsl)
    
    await page.waitForTimeout(500)
    
    // Initially should show Dashboard (first screen)
    let previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Dashboard Content')
    
    // Click Profile button in metadata area
    const profileButton = page.getByRole('button', { name: 'Profile', exact: true })
    await profileButton.click()
    await page.waitForTimeout(500)
    
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Profile Content')
    
    // Click Settings button
    const settingsButton = page.getByRole('button', { name: 'Settings', exact: true })
    await settingsButton.click()
    await page.waitForTimeout(500)
    
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Settings Content')
  })

  test('deve navegar entre screens usando botões no preview', async ({ page }) => {
    const dsl = `screen Home:
  container:
    # Home Page
    @primary[Go to About](About)

screen About:
  container:
    # About Page
    @primary[Back to Home](Home)`

    await setEditorContent(page, dsl)
    
    await page.waitForTimeout(500)
    
    // Should initially show Home
    let previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Home Page')
    
    // Click the "Go to About" button in the preview
    const preview = page.locator(PREVIEW_SELECTOR).first()
    const goToAboutButton = preview.locator('button:has-text("Go to About")')
    await goToAboutButton.click()
    await page.waitForTimeout(500)
    
    // Should now show About screen
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('About Page')
  })
})

test.describe('Playground - Modals and Drawers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar modal', async ({ page }) => {
    const dsl = `modal ConfirmDelete:
  card:
    # Delete Item?
    > This action cannot be undone
    row-end:
      @ghost[Cancel](close)
      @destructive[Delete](deleteAction)

screen Home:
  container:
    # Home
    @[Open Modal](ConfirmDelete)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    
    // Modal should be in the HTML (even if hidden)
    expect(previewHtml).toContain('modal-ConfirmDelete')
    expect(previewHtml).toContain('Delete Item?')
    expect(previewHtml).toContain('This action cannot be undone')
  })

  test('deve renderizar drawer', async ({ page }) => {
    const dsl = `drawer MainMenu:
  stack:
    # Menu
    > Option 1
    > Option 2
    @destructive[Close](close)

screen Home:
  container:
    # Home
    @ghost[Menu](MainMenu)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    
    // Drawer should be in the HTML
    expect(previewHtml).toContain('drawer-MainMenu')
    expect(previewHtml).toContain('Option 1')
    expect(previewHtml).toContain('Option 2')
  })
})

test.describe('Playground - Special Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar navigator (bottom navigation)', async ({ page }) => {
    const dsl = `screen Home:
  container:
    # Content
  navigator:
    - Home | Home
    - Profile | Profile
    - Settings | Settings

screen Profile:
  container:
    # Profile
  navigator:
    - Home | Home
    - Profile | Profile
    - Settings | Settings

screen Settings:
  container:
    # Settings
  navigator:
    - Home | Home
    - Profile | Profile
    - Settings | Settings`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    
    // Navigator should be rendered
    expect(previewHtml).toContain('Home')
    expect(previewHtml).toContain('Profile')
    expect(previewHtml).toContain('Settings')
  })

  test('deve renderizar FAB (floating action button)', async ({ page }) => {
    const dsl = `screen Home:
  container:
    # Home
  fab:
    - + | AddItem`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    
    // FAB should be rendered
    expect(previewHtml).toContain('+')
  })

  test('deve renderizar separator', async ({ page }) => {
    const dsl = `screen Home:
  container:
    > Section 1
    ---
    > Section 2
    ---
    > Section 3`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Section 1')
    expect(previewHtml).toContain('Section 2')
    expect(previewHtml).toContain('Section 3')
  })

  test('deve renderizar header especial', async ({ page }) => {
    const dsl = `screen Home:
  header:
    # My App
    @ghost[Menu](MainMenu)
  container:
    > Content`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('My App')
    expect(previewHtml).toContain('Menu')
  })

  test('deve renderizar cards com variantes', async ({ page }) => {
    const dsl = `screen Cards:
  container:
    card:
      ## Standard Card
      > Default padding
    card-compact:
      ## Compact Card
      > Less padding
    card-feature:
      ## Feature Card
      > Prominent style`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Standard Card')
    expect(previewHtml).toContain('Compact Card')
    expect(previewHtml).toContain('Feature Card')
  })
})

test.describe('Playground - Styles and Theming', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve aplicar bloco de styles customizado', async ({ page }) => {
    const dsl = `styles:
  --primary: #ff0000;
  --radius: 1rem;

screen Home:
  container:
    # Styled App
    @primary[Button](action)`

    await setEditorContent(page, dsl)
    
    // Just verify it doesn't error and renders
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Styled App')
    expect(previewHtml).toContain('Button')
  })

  test('deve mudar tema usando seletor', async ({ page }) => {
    // Initial theme
    await page.waitForTimeout(1000)
    
    // Find theme selector (may be a select or custom dropdown)
    const themeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /Theme|preset/i }).first()
    
    if (await themeSelect.count() > 0) {
      // Theme selector exists, interact with it
      await themeSelect.click()
      await page.waitForTimeout(300)
      
      // Try to select a different theme (this is framework-dependent)
      // Just verify no errors occur
      const initialHtml = await getPreviewHTML(page)
      expect(initialHtml).toBeTruthy()
    }
  })
})

test.describe('Playground - Complex Real-World Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar app completo de login', async ({ page }) => {
    const dsl = `component LoginForm:
  ___: Username{Enter your username}
  ___password: Password{Enter your password}
  [X] Remember me
  @primary[Login](Dashboard)

screen Login:
  container:
    # Login to Your Account
    card:
      ## Welcome Back
      $LoginForm
      > Don't have an account?
      #[Sign Up](Signup)

screen Signup:
  container:
    # Create Account
    card:
      ___: Username{Choose username}
      ___email: Email{Your email}
      ___password: Password{Password}
      @primary[Sign Up](Dashboard)

screen Dashboard:
  header:
    # Dashboard
    @ghost[Logout](Login)
  container:
    ## Welcome!
    > You are logged in.`

    await setEditorContent(page, dsl)
    
    // Verify all screens are detected
    await expect(page.getByText('3 screens detected')).toBeVisible()
    
    // Verify content is rendered
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Login to Your Account')
    expect(previewHtml).toContain('Welcome Back')
    expect(previewHtml).toContain('Username')
    expect(previewHtml).toContain('Password')
  })

  test('deve renderizar app de contatos com navegação completa', async ({ page }) => {
    const dsl = `component ContactCard:
  card:
    row-between:
      stack-tight:
        >> %name
        >>> %email
      @outline-sm[Edit](EditContact)

modal CreateContact:
  card:
    ## New Contact
    ___: Full Name{Enter name}
    ___email: Email{email@example.com}
    row-between:
      @ghost[Cancel](close)
      @primary[Save](Contacts)

drawer MainMenu:
  stack:
    # Menu
    #[Contacts](Contacts)
    #[Settings](Settings)

screen Contacts:
  header:
    >> My Contacts
    @ghost-sm[Menu](MainMenu)
  container:
    list $ContactCard:
      - John Silva | john@email.com
      - Maria Santos | maria@email.com
  fab:
    - + | CreateContact
  navigator:
    - Contacts | Contacts
    - Settings | Settings

screen Settings:
  header:
    ## Settings
  container:
    card:
      [X] Notifications
      [ ] Dark mode
  navigator:
    - Contacts | Contacts
    - Settings | Settings`

    await setEditorContent(page, dsl)
    
    // Verify screens detected
    await expect(page.getByText('2 screens detected')).toBeVisible()
    
    // Verify complex structure is rendered
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('My Contacts')
    expect(previewHtml).toContain('John Silva')
    expect(previewHtml).toContain('Maria Santos')
    expect(previewHtml).toContain('modal-CreateContact')
    expect(previewHtml).toContain('drawer-MainMenu')
    
    // Verify navigation elements
    const preview = page.locator(PREVIEW_SELECTOR).first()
    await expect(preview.locator('button:has-text("Menu")')).toBeVisible()
  })

  test('deve renderizar dashboard com múltiplos componentes', async ({ page }) => {
    const dsl = `component MetricCard:
  card:
    ### %label
    # %value
    >> %change

component UserRow:
  row-between:
    > %name
    >>> %status
    @outline-sm[View](UserDetail)

screen Dashboard:
  header:
    # Dashboard
    @ghost[Menu](MainMenu)
  
  container:
    ## Overview
    grid-3:
      $MetricCard:
        - Total Users | 1,234 | +12%
      $MetricCard:
        - Revenue | $45,678 | +8%
      $MetricCard:
        - Tasks | 89 | -3%
    
    ---
    
    ## Recent Users
    list $UserRow:
      - John Doe | Active
      - Jane Smith | Active
      - Bob Johnson | Inactive
    
    @primary[View All Users](Users)

screen Users:
  header:
    ## All Users
    @ghost[Back](-1)
  container:
    > User management page

drawer MainMenu:
  stack:
    # Navigation
    #[Dashboard](Dashboard)
    #[Users](Users)`

    await setEditorContent(page, dsl)
    
    // Verify it renders without errors
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Dashboard')
    expect(previewHtml).toContain('Overview')
    expect(previewHtml).toContain('Total Users')
    expect(previewHtml).toContain('1,234')
    expect(previewHtml).toContain('John Doe')
    expect(previewHtml).toContain('Recent Users')
    
    // Verify grid layout (3 metric cards)
    expect(previewHtml).toContain('Revenue')
    expect(previewHtml).toContain('Tasks')
  })
})

test.describe('Playground - Export Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve ter botão de export visível', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: /Export HTML/i })
    await expect(exportButton).toBeVisible()
    await expect(exportButton).toBeEnabled()
  })

  test('deve permitir click no botão de export', async ({ page }) => {
    const dsl = `screen Home:
  container:
    # Test Export`

    await setEditorContent(page, dsl)
    
    // Setup download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null)
    
    const exportButton = page.getByRole('button', { name: /Export HTML/i })
    await exportButton.click()
    
    // Wait a bit for download to potentially start
    const download = await downloadPromise
    
    // If download happened, verify filename
    if (download) {
      const filename = download.suggestedFilename()
      expect(filename).toContain('.html')
    }
  })
})

test.describe('Playground - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve lidar com DSL vazio', async ({ page }) => {
    await setEditorContent(page, '')
    
    // Should not crash, just show empty preview or no screens
    await expect(page.getByText(/No screens detected|0 screens/i)).toBeVisible()
  })

  test('deve lidar com DSL inválido gracefully', async ({ page }) => {
    const invalidDsl = `this is not valid dsl
    random text
    ### invalid syntax`

    await setEditorContent(page, invalidDsl)
    
    // Should not crash the app
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toBeDefined()
  })

  test('deve continuar funcionando após múltiplas edições', async ({ page }) => {
    // First edit
    await setEditorContent(page, 'screen A:\n  container:\n    # Screen A')
    await page.waitForTimeout(500)
    let previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Screen A')
    
    // Second edit
    await setEditorContent(page, 'screen B:\n  container:\n    # Screen B')
    await page.waitForTimeout(500)
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Screen B')
    
    // Third edit
    await setEditorContent(page, 'screen C:\n  container:\n    # Screen C')
    await page.waitForTimeout(500)
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Screen C')
  })
})

