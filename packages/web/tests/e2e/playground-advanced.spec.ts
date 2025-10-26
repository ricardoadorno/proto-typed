import { test, expect, Page } from '@playwright/test'

/**
 * Advanced E2E Tests for Proto-Typed Playground
 * 
 * Focus on:
 * - Edge cases and boundary conditions
 * - Performance scenarios
 * - Complex component interactions
 * - DSL syntax variations
 * - Navigation edge cases
 */

const EDITOR_SELECTOR = '.monaco-editor'
const PREVIEW_SELECTOR = '[style*="containerType"]'

async function waitForEditor(page: Page) {
  await page.waitForSelector(EDITOR_SELECTOR, { timeout: 10000 })
  await page.waitForTimeout(500)
}

async function setEditorContent(page: Page, content: string) {
  await waitForEditor(page)
  await page.click(EDITOR_SELECTOR)
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Delete')
  await page.keyboard.type(content, { delay: 10 })
  await page.waitForTimeout(1000)
}

async function getPreviewHTML(page: Page): Promise<string> {
  const previewElement = await page.locator(PREVIEW_SELECTOR).first()
  return await previewElement.innerHTML()
}

test.describe('Playground Advanced - Button Variations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar botões com tamanhos diferentes', async ({ page }) => {
    const dsl = `screen ButtonSizes:
  container:
    # Button Sizes
    stack:
      @-xs[Extra Small](action)
      @-sm[Small](action)
      @-md[Medium](action)
      @-lg[Large](action)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Extra Small')
    expect(previewHtml).toContain('Small')
    expect(previewHtml).toContain('Medium')
    expect(previewHtml).toContain('Large')
  })

  test('deve renderizar botões com variante e tamanho combinados', async ({ page }) => {
    const dsl = `screen CombinedButtons:
  container:
    stack:
      @primary-lg[Large Primary](action)
      @secondary-sm[Small Secondary](action)
      @outline-xs[Tiny Outline](action)
      @destructive-md[Medium Destructive](action)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Large Primary')
    expect(previewHtml).toContain('Small Secondary')
    expect(previewHtml).toContain('Tiny Outline')
    expect(previewHtml).toContain('Medium Destructive')
  })

  test('deve renderizar botões com ícones (sintaxe i-)', async ({ page }) => {
    const dsl = `screen IconButtons:
  container:
    stack:
      @[i-Home Home](action)
      @[Settings i-Settings](action)
      @[i-Plus](action)
      @primary[i-Save Save Changes](action)
      @destructive[Delete i-Trash](action)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Home')
    expect(previewHtml).toContain('Settings')
    expect(previewHtml).toContain('Save Changes')
    expect(previewHtml).toContain('Delete')
  })

  test('deve renderizar botões com todas as variantes disponíveis', async ({ page }) => {
    const dsl = `screen AllVariants:
  container:
    stack:
      @primary[Primary](a)
      @secondary[Secondary](a)
      @outline[Outline](a)
      @ghost[Ghost](a)
      @destructive[Destructive](a)
      @link[Link](a)
      @success[Success](a)
      @warning[Warning](a)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    const variants = ['Primary', 'Secondary', 'Outline', 'Ghost', 'Destructive', 'Link', 'Success', 'Warning']
    variants.forEach(variant => {
      expect(previewHtml).toContain(variant)
    })
  })
})

test.describe('Playground Advanced - Layout Combinations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar containers aninhados', async ({ page }) => {
    const dsl = `screen NestedContainers:
  container:
    # Outer Container
    container-narrow:
      ## Narrow Container
      container-wide:
        ### Wide Container (inside narrow)
        > This tests nesting`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Outer Container')
    expect(previewHtml).toContain('Narrow Container')
    expect(previewHtml).toContain('Wide Container')
    expect(previewHtml).toContain('This tests nesting')
  })

  test('deve renderizar todas as variações de stack', async ({ page }) => {
    const dsl = `screen StackVariations:
  container:
    stack:
      > Stack default
    stack-tight:
      > Stack tight
    stack-loose:
      > Stack loose
    stack-flush:
      > Stack flush`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Stack default')
    expect(previewHtml).toContain('Stack tight')
    expect(previewHtml).toContain('Stack loose')
    expect(previewHtml).toContain('Stack flush')
  })

  test('deve renderizar todas as variações de row', async ({ page }) => {
    const dsl = `screen RowVariations:
  container:
    row:
      > Row start
    row-center:
      > Row center
    row-between:
      > Row between
    row-end:
      > Row end`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Row start')
    expect(previewHtml).toContain('Row center')
    expect(previewHtml).toContain('Row between')
    expect(previewHtml).toContain('Row end')
  })

  test('deve renderizar todos os tipos de grid', async ({ page }) => {
    const dsl = `screen GridTypes:
  container:
    # Grid 2
    grid-2:
      card:
        > Item 1
      card:
        > Item 2
    
    # Grid 3
    grid-3:
      card:
        > Item 1
      card:
        > Item 2
      card:
        > Item 3
    
    # Grid 4
    grid-4:
      card:
        > Item 1
      card:
        > Item 2
      card:
        > Item 3
      card:
        > Item 4
    
    # Grid Auto
    grid-auto:
      card:
        > Auto 1
      card:
        > Auto 2
      card:
        > Auto 3`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Grid 2')
    expect(previewHtml).toContain('Grid 3')
    expect(previewHtml).toContain('Grid 4')
    expect(previewHtml).toContain('Grid Auto')
  })

  test('deve renderizar layouts profundamente aninhados', async ({ page }) => {
    const dsl = `screen DeepNesting:
  container:
    stack:
      card:
        row-between:
          stack-tight:
            ## Left Side
            > Content 1
          stack-tight:
            ## Right Side
            > Content 2
      grid-2:
        card:
          stack:
            > Grid item with stack
        card:
          row:
            > Grid item with row`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Left Side')
    expect(previewHtml).toContain('Right Side')
    expect(previewHtml).toContain('Grid item with stack')
    expect(previewHtml).toContain('Grid item with row')
  })
})

test.describe('Playground Advanced - Input Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar input com select dropdown', async ({ page }) => {
    const dsl = `screen SelectInput:
  container:
    card:
      ___: Country{Select country}[USA | Canada | Mexico | Brazil | Portugal]
      @[Submit](action)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Country')
    expect(previewHtml).toContain('USA')
    expect(previewHtml).toContain('Canada')
    expect(previewHtml).toContain('Mexico')
  })

  test('deve renderizar input com atributos HTML', async ({ page }) => {
    const dsl = `screen InputWithAttributes:
  container:
    card:
      ___: Email{email@example.com} | required placeholder="Enter email"
      ___password: Password{pass} | required minlength="8"
      ___number: Age{0} | required min="0" max="120"`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Email')
    expect(previewHtml).toContain('Password')
    expect(previewHtml).toContain('Age')
  })

  test('deve renderizar todos os tipos de input', async ({ page }) => {
    const dsl = `screen AllInputTypes:
  container:
    card:
      ___: Text Input{placeholder}
      ___email: Email Input{email@example.com}
      ___password: Password Input{password}
      ___date: Date Input{2024-01-01}
      ___number: Number Input{0}
      ___textarea: Textarea Input{Long text here}`

    await setEditorContent(page, dsl)
    
    const preview = page.locator(PREVIEW_SELECTOR).first()
    await expect(preview.locator('input[type="text"]')).toHaveCount(1)
    await expect(preview.locator('input[type="email"]')).toHaveCount(1)
    await expect(preview.locator('input[type="password"]')).toHaveCount(1)
    await expect(preview.locator('input[type="date"]')).toHaveCount(1)
    await expect(preview.locator('input[type="number"]')).toHaveCount(1)
    await expect(preview.locator('textarea')).toHaveCount(1)
  })

  test('deve renderizar múltiplos checkboxes e radio buttons', async ({ page }) => {
    const dsl = `screen MultipleOptions:
  container:
    card:
      ## Preferences
      [X] Option A
      [X] Option B
      [ ] Option C
      [ ] Option D
      [X] Option E
      
      ## Choose One
      (X) Choice 1
      ( ) Choice 2
      ( ) Choice 3
      ( ) Choice 4`

    await setEditorContent(page, dsl)
    
    const preview = page.locator(PREVIEW_SELECTOR).first()
    
    // Should have 5 checkboxes and 4 radio buttons
    await expect(preview.locator('input[type="checkbox"]')).toHaveCount(5)
    await expect(preview.locator('input[type="radio"]')).toHaveCount(4)
    
    // Verify some are checked
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Option A')
    expect(previewHtml).toContain('Choice 1')
  })
})

test.describe('Playground Advanced - Component Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar componente com muitas props', async ({ page }) => {
    const dsl = `component ProductCard:
  card:
    ## %name
    > Price: %price
    >>> Category: %category
    >>> Stock: %stock
    >>> Rating: %rating
    @primary[Buy Now](%action)

screen Products:
  container:
    $ProductCard:
      - Laptop | $999 | Electronics | In Stock | 4.5/5 | buyLaptop
    $ProductCard:
      - Phone | $599 | Electronics | Low Stock | 4.8/5 | buyPhone`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Laptop')
    expect(previewHtml).toContain('$999')
    expect(previewHtml).toContain('Electronics')
    expect(previewHtml).toContain('In Stock')
    expect(previewHtml).toContain('4.5/5')
    expect(previewHtml).toContain('Phone')
    expect(previewHtml).toContain('$599')
    expect(previewHtml).toContain('4.8/5')
  })

  test('deve renderizar componentes aninhados', async ({ page }) => {
    const dsl = `component Button:
  @primary[%label](%action)

component Card:
  card:
    ## %title
    > %description
    $Button:
      - Click Me | action

screen Home:
  container:
    $Card:
      - Welcome | This is a card with nested component`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Welcome')
    expect(previewHtml).toContain('This is a card with nested component')
    expect(previewHtml).toContain('Click Me')
  })

  test('deve renderizar lista longa de componentes', async ({ page }) => {
    const dsl = `component Item:
  > %text

screen LongList:
  container:
    list $Item:
      - Item 1
      - Item 2
      - Item 3
      - Item 4
      - Item 5
      - Item 6
      - Item 7
      - Item 8
      - Item 9
      - Item 10`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    for (let i = 1; i <= 10; i++) {
      expect(previewHtml).toContain(`Item ${i}`)
    }
  })

  test('deve renderizar múltiplos componentes diferentes', async ({ page }) => {
    const dsl = `component Header:
  header:
    # %title

component Footer:
  >>> %text

component Body:
  > %content

screen MultiComponent:
  $Header:
    - My App
  container:
    $Body:
      - Main content here
  $Footer:
    - © 2024 Company`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('My App')
    expect(previewHtml).toContain('Main content here')
    expect(previewHtml).toContain('© 2024 Company')
  })
})

test.describe('Playground Advanced - Navigation Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar navegação circular entre screens', async ({ page }) => {
    const dsl = `screen A:
  container:
    # Screen A
    @[Go to B](B)

screen B:
  container:
    # Screen B
    @[Go to C](C)

screen C:
  container:
    # Screen C
    @[Go to A](A)`

    await setEditorContent(page, dsl)
    
    // Verify all screens detected
    await expect(page.getByText('3 screens detected')).toBeVisible()
    
    // Verify initial screen
    let previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Screen A')
    
    // Navigate to B using metadata button
    await page.getByRole('button', { name: 'B', exact: true }).click()
    await page.waitForTimeout(500)
    
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Screen B')
    
    // Navigate to C
    await page.getByRole('button', { name: 'C', exact: true }).click()
    await page.waitForTimeout(500)
    
    previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Screen C')
  })

  test('deve renderizar navegação com voltar (-1)', async ({ page }) => {
    const dsl = `screen Home:
  container:
    # Home
    @[Go to Page](Page)

screen Page:
  container:
    # Page
    @[Back](-1)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Home')
    
    // Back button should be rendered
    expect(previewHtml).toContain('Back')
    expect(previewHtml).toContain('data-nav="-1"')
  })

  test('deve renderizar múltiplos modals e drawers', async ({ page }) => {
    const dsl = `modal Modal1:
  card:
    # Modal 1

modal Modal2:
  card:
    # Modal 2

drawer Drawer1:
  stack:
    # Drawer 1

drawer Drawer2:
  stack:
    # Drawer 2

screen Home:
  container:
    @[Open Modal 1](Modal1)
    @[Open Modal 2](Modal2)
    @[Open Drawer 1](Drawer1)
    @[Open Drawer 2](Drawer2)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('modal-Modal1')
    expect(previewHtml).toContain('modal-Modal2')
    expect(previewHtml).toContain('drawer-Drawer1')
    expect(previewHtml).toContain('drawer-Drawer2')
  })

  test('deve renderizar close action em modals', async ({ page }) => {
    const dsl = `modal Confirm:
  card:
    # Confirm Action
    row-end:
      @ghost[Cancel](close)
      @primary[Confirm](action)

screen Home:
  container:
    @[Open](Confirm)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Cancel')
    expect(previewHtml).toContain('close')
  })
})

test.describe('Playground Advanced - Typography & Text Formatting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar todos os níveis de heading', async ({ page }) => {
    const dsl = `screen Headings:
  container:
    # Heading 1
    ## Heading 2
    ### Heading 3
    #### Heading 4
    ##### Heading 5
    ###### Heading 6`

    await setEditorContent(page, dsl)
    
    const preview = page.locator(PREVIEW_SELECTOR).first()
    await expect(preview.locator('h1')).toBeVisible()
    await expect(preview.locator('h2')).toBeVisible()
    await expect(preview.locator('h3')).toBeVisible()
    await expect(preview.locator('h4')).toBeVisible()
    await expect(preview.locator('h5')).toBeVisible()
    await expect(preview.locator('h6')).toBeVisible()
  })

  test('deve renderizar texto com caracteres especiais', async ({ page }) => {
    const dsl = `screen SpecialChars:
  container:
    > Text with "quotes"
    > Text with 'apostrophes'
    > Text with symbols: @#$%&*
    > Text with emoji: 🚀 ✨ 💻
    > Text with numbers: 123.456
    > Text with punctuation: Hello, World!`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('quotes')
    expect(previewHtml).toContain('apostrophes')
    expect(previewHtml).toContain('@#$%&*')
    expect(previewHtml).toContain('🚀')
    expect(previewHtml).toContain('123.456')
    expect(previewHtml).toContain('Hello, World!')
  })

  test('deve renderizar texto multilíngue', async ({ page }) => {
    const dsl = `screen MultiLanguage:
  container:
    # English Title
    > English paragraph text
    ## Título em Português
    > Texto de parágrafo em português
    ### Título en Español
    > Texto de párrafo en español`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('English Title')
    expect(previewHtml).toContain('Título em Português')
    expect(previewHtml).toContain('Título en Español')
  })

  test('deve renderizar texto muito longo', async ({ page }) => {
    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10)
    const dsl = `screen LongText:
  container:
    > ${longText}`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Lorem ipsum')
    expect(previewHtml.length).toBeGreaterThan(500)
  })
})

test.describe('Playground Advanced - Complex Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve renderizar app com 10+ screens', async ({ page }) => {
    const screens = Array.from({ length: 12 }, (_, i) => 
      `screen Screen${i + 1}:
  container:
    # Screen ${i + 1}
    > Content for screen ${i + 1}`
    ).join('\n\n')

    await setEditorContent(page, screens)
    
    // Should detect all 12 screens
    await expect(page.getByText(/12 screens detected/i)).toBeVisible()
  })

  test('deve renderizar formulário complexo com validação', async ({ page }) => {
    const dsl = `screen ComplexForm:
  container:
    card:
      ## Registration Form
      
      ___: Full Name{Enter your full name} | required minlength="3"
      ___email: Email{email@example.com} | required
      ___password: Password{Min 8 chars} | required minlength="8"
      ___password: Confirm Password{Repeat password} | required
      ___date: Birth Date{YYYY-MM-DD} | required
      ___number: Phone{+1234567890} | required
      
      ___: Country{Select}[USA | Canada | UK | Brazil | Germany]
      
      ___textarea: Bio{Tell us about yourself} | maxlength="500"
      
      ---
      
      #### Terms and Conditions
      [X] I agree to Terms of Service
      [X] I agree to Privacy Policy
      [ ] Send me promotional emails
      
      ---
      
      #### Account Type
      (X) Personal Account
      ( ) Business Account
      ( ) Enterprise Account
      
      ---
      
      row-between:
        @ghost[Cancel](-1)
        @primary[Create Account](Dashboard)`

    await setEditorContent(page, dsl)
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('Registration Form')
    expect(previewHtml).toContain('Full Name')
    expect(previewHtml).toContain('Email')
    expect(previewHtml).toContain('Terms of Service')
    expect(previewHtml).toContain('Account Type')
    
    // Verify form elements
    const preview = page.locator(PREVIEW_SELECTOR).first()
    await expect(preview.locator('input')).toHaveCount(7) // Multiple inputs
    await expect(preview.locator('textarea')).toHaveCount(1)
    await expect(preview.locator('input[type="checkbox"]')).toHaveCount(3)
    await expect(preview.locator('input[type="radio"]')).toHaveCount(3)
  })

  test('deve renderizar ecommerce app completo', async ({ page }) => {
    const dsl = `component ProductCard:
  card:
    ![Product](%image)
    ## %name
    >>> %category
    # $%price
    row-between:
      >>> %rating ⭐
      @outline-sm[Details](%detailAction)
    @primary[Add to Cart](%cartAction)

modal CartModal:
  card:
    ## Shopping Cart
    > 3 items in your cart
    
    row-between:
      ## Total:
      # $147.00
    
    row-between:
      @ghost[Continue Shopping](close)
      @primary[Checkout](Checkout)

drawer MenuDrawer:
  stack:
    # Shop Menu
    #[Home](Home)
    #[Products](Products)
    #[Cart](CartModal)
    #[Account](Account)
    ---
    @destructive[Logout](Home)

screen Home:
  header:
    >> ShopApp
    @ghost-sm[i-Menu](MenuDrawer)
  
  container:
    ## Featured Products
    
    grid-2:
      $ProductCard:
        - Laptop | https://via.placeholder.com/200 | Electronics | 999 | 4.5 | details1 | addCart1
      $ProductCard:
        - Headphones | https://via.placeholder.com/200 | Audio | 49 | 4.8 | details2 | addCart2
      $ProductCard:
        - Keyboard | https://via.placeholder.com/200 | Accessories | 99 | 4.2 | details3 | addCart3
      $ProductCard:
        - Mouse | https://via.placeholder.com/200 | Accessories | 29 | 4.6 | details4 | addCart4
    
    @primary-lg[View All Products](Products)
  
  navigator:
    - i-Home | Home
    - i-ShoppingCart | CartModal
    - i-User | Account

screen Products:
  header:
    ## All Products
    @ghost[i-Menu](MenuDrawer)
  
  container:
    > Browse our complete catalog
    
    list $ProductCard:
      - Laptop | https://via.placeholder.com/150 | Electronics | 999 | 4.5 | d1 | c1
      - Phone | https://via.placeholder.com/150 | Electronics | 699 | 4.7 | d2 | c2
      - Tablet | https://via.placeholder.com/150 | Electronics | 499 | 4.3 | d3 | c3
  
  navigator:
    - i-Home | Home
    - i-ShoppingCart | CartModal
    - i-User | Account

screen Account:
  header:
    ## My Account
    @ghost[i-Menu](MenuDrawer)
  
  container:
    card:
      ## Profile Information
      ___: Name{John Doe}
      ___email: Email{john@example.com}
      @primary[Save Changes](Account)
    
    ---
    
    card:
      ## Order History
      > You have 5 previous orders
      @outline[View Orders](Orders)
  
  navigator:
    - i-Home | Home
    - i-ShoppingCart | CartModal
    - i-User | Account

screen Checkout:
  header:
    ## Checkout
    @ghost[i-ArrowLeft](-1)
  
  container:
    card:
      ## Shipping Information
      ___: Full Name{Enter name} | required
      ___: Address{Street address} | required
      ___: City{City} | required
      ___: Zip{00000} | required
      ___: Country{Select}[USA | Canada | UK | Brazil]
    
    ---
    
    card:
      ## Payment Method
      (X) Credit Card
      ( ) PayPal
      ( ) Bank Transfer
      
      ___: Card Number{0000-0000-0000-0000} | required
      ___: CVV{000} | required
    
    ---
    
    row-between:
      ### Total: $147.00
      @primary-lg[Place Order](OrderConfirmation)

screen OrderConfirmation:
  container:
    card-feature:
      ## ✅ Order Confirmed!
      > Thank you for your purchase
      
      ### Order #12345
      >>> Estimated delivery: 3-5 business days
      
      ---
      
      @primary[Track Order](Orders)
      @ghost[Continue Shopping](Home)`

    await setEditorContent(page, dsl)
    
    // This is a huge app - just verify it renders without errors
    await expect(page.getByText(/screens detected/i)).toBeVisible()
    
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('ShopApp')
    expect(previewHtml.length).toBeGreaterThan(1000)
  })
})

test.describe('Playground Advanced - Performance & Stress Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForEditor(page)
  })

  test('deve lidar com DSL muito grande (100+ linhas)', async ({ page }) => {
    const largeComponents = Array.from({ length: 20 }, (_, i) => 
      `component Card${i}:
  card:
    ## Card ${i}
    > Content ${i}`
    ).join('\n\n')
    
    const largeScreen = `screen BigScreen:
  container:
    ${Array.from({ length: 20 }, (_, i) => `    $Card${i}`).join('\n')}`
    
    const dsl = largeComponents + '\n\n' + largeScreen

    await setEditorContent(page, dsl)
    
    // Should still work
    const previewHtml = await getPreviewHTML(page)
    expect(previewHtml).toContain('BigScreen')
  })

  test('deve processar edições rápidas sem travar', async ({ page }) => {
    // Make rapid changes
    for (let i = 0; i < 5; i++) {
      await setEditorContent(page, `screen Test${i}:\n  container:\n    # Test ${i}`)
      await page.waitForTimeout(300)
    }
    
    // Should still be responsive
    const finalHtml = await getPreviewHTML(page)
    expect(finalHtml).toContain('Test4')
  })
})

