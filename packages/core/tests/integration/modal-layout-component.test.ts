import { describe, it, expect, beforeEach } from 'vitest'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { astToHtmlDocument } from '../../src/renderer/ast-to-html-document'
import { astToHtmlStringPreview } from '../../src/renderer/ast-to-html-string-preview'
import { ErrorBus } from '../../src/error-bus'

/**
 * Modal, Layout and Component Integration Tests
 *
 * Objetivo: Investigar e verificar a saída (HTML) para identificar problemas com:
 * 1. Modals não funcionando
 * 2. Layouts (cards) não renderizando dentro de modals
 * 3. Components não renderizando ou não substituindo props
 */
describe('Modal, Layout and Component Integration', () => {
  let errorBus: ErrorBus

  beforeEach(() => {
    errorBus = ErrorBus.get()
    errorBus.clear()
  })

  // Helper functions
  function printASTStructure(node: any, indent = 0): string {
    const prefix = '  '.repeat(indent)
    let str = `${prefix}${node.type}`
    if (node.name) str += ` (${node.name})`
    if (node.value) str += ` = "${node.value}"`
    if (node.children?.length > 0) {
      str += `\n${node.children.map((c: any) => printASTStructure(c, indent + 1)).join('\n')}`
    }
    return str
  }

  function debugHTML(html: string, selector: string): void {
    const lines = html.split('\n')
    const relevant = lines.filter(
      (line) =>
        line.includes(selector) ||
        line.includes('modal') ||
        line.includes('card')
    )
    console.log(`\nHTML containing "${selector}":`)
    relevant.forEach((line) => console.log(line.trim()))
  }

  describe('Suite 1: Modal Simples (Baseline)', () => {
    it('should render modal with content', () => {
      const dsl = `screen Home:
  container:
    @primary[Open](SimpleModal)

modal SimpleModal:
  >> Modal content`

      const ast = parseAndBuildAst(dsl)

      // Debug AST
      console.log('\n=== AST Structure ===')
      if (Array.isArray(ast.children)) {
        ast.children.forEach((child: any) => {
          console.log(printASTStructure(child))
        })
      }

      // Verify no errors
      expect(ast.__errors || []).toHaveLength(0)

      // Render HTML
      const html = astToHtmlDocument(ast)

      // Debug if fails
      if (!html.includes('modal-SimpleModal')) {
        console.log('\n=== Generated HTML (searching for modal) ===')
        debugHTML(html, 'SimpleModal')
      }

      // Assertions
      expect(html).toContain('id="modal-SimpleModal"')
      expect(html).toContain('class="modal')
      expect(html).toContain('data-modal="SimpleModal"')
      expect(html).toContain('Modal content')

      // Navigation attributes
      expect(html).toMatch(/data-nav="SimpleModal"/)
      expect(html).toMatch(/data-nav-type="toggle"/)
    })

    it('should render modal with close button', () => {
      const dsl = `screen Home:
  container:
    @primary[Open](SimpleModal)

modal SimpleModal:
  >> Modal content
  @ghost[Close](close)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors || []).toHaveLength(0)

      const html = astToHtmlDocument(ast)

      expect(html).toContain('Modal content')
      expect(html).toContain('Close')
      expect(html).toMatch(/data-nav="close"/)
    })
  })

  describe('Suite 2: Modal com Layout (Card) - TESTE CRÍTICO', () => {
    it('should render card inside modal', () => {
      const dsl = `screen Home:
  container:
    @primary[Open](CardModal)

modal CardModal:
  card:
    ## Card Title
    > Card description`

      const ast = parseAndBuildAst(dsl)

      // Debug AST
      console.log('\n=== AST Structure (Modal + Card) ===')
      const modalNode = ast.children?.find((n: any) => n.type === 'modal')
      if (modalNode) {
        console.log(printASTStructure(modalNode))
      } else {
        console.log('❌ Modal node not found in AST!')
      }

      // Verify no errors
      expect(ast.__errors || []).toHaveLength(0)

      // Render HTML
      const html = astToHtmlDocument(ast)

      // Debug HTML structure
      console.log('\n=== HTML Analysis ===')
      console.log('Has modal?', html.includes('id="modal-CardModal"'))
      console.log('Has card class?', html.includes('class="card'))
      console.log('Has heading?', html.includes('Card Title'))

      if (!html.includes('class="card')) {
        console.log('\n=== Full Modal HTML ===')
        const modalStart = html.indexOf('id="modal-CardModal"')
        if (modalStart > -1) {
          const modalSection = html.substring(modalStart, modalStart + 500)
          console.log(modalSection)
        }
      }

      // Critical assertions
      expect(html).toContain('id="modal-CardModal"')
      expect(html).toContain('class="card')
      expect(html).toContain('Card Title')
      expect(html).toContain('Card description')

      // Structural assertion: card must be inside modal
      const modalRegex =
        /<div[^>]*id="modal-CardModal"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/
      const modalMatch = html.match(modalRegex)

      if (!modalMatch) {
        console.log('❌ Could not extract modal content!')
      } else {
        const modalContent = modalMatch[1]
        console.log('\n=== Modal Content Extracted ===')
        console.log('Has card in modal?', modalContent.includes('class="card'))

        expect(modalContent).toContain('class="card')
        expect(modalContent).toContain('Card Title')
      }
    })

    it('should render form elements inside card inside modal', () => {
      const dsl = `screen Home:
  container:
    @primary[Open](FormModal)

modal FormModal:
  card:
    ## Contact Form
    > Fill the form below
    
    ___: Name{Enter your name}
    ___email: Email{your@email.com}
    
    row-end:
      @ghost[Cancel](close)
      @primary[Submit](Home)`

      const ast = parseAndBuildAst(dsl)

      // Debug AST hierarchy
      console.log('\n=== AST Structure (Modal + Card + Form) ===')
      const modalNode = ast.children?.find((n: any) => n.type === 'modal')
      if (modalNode) {
        console.log(printASTStructure(modalNode))
        console.log(
          '\nCard children count:',
          modalNode.children?.[0]?.children?.length || 0
        )
      }

      expect(ast.__errors || []).toHaveLength(0)

      const html = astToHtmlDocument(ast)

      // Assertions
      expect(html).toContain('id="modal-FormModal"')
      expect(html).toContain('class="card')
      expect(html).toContain('Contact Form')
      expect(html).toContain('Fill the form below')
      expect(html).toContain('type="text"')
      expect(html).toContain('type="email"')
      expect(html).toContain('Cancel')
      expect(html).toContain('Submit')

      // Verify row is inside card
      const cardRegex = /<div[^>]*class="[^"]*card[^"]*"[^>]*>([\s\S]*?)<\/div>/
      const cardMatch = html.match(cardRegex)

      if (cardMatch) {
        const cardContent = cardMatch[1]
        expect(cardContent).toContain('row-end')
        expect(cardContent).toContain('Cancel')
        expect(cardContent).toContain('Submit')
      }
    })
  })

  describe('Suite 3: Components - TESTE CRÍTICO', () => {
    it('should render component with props substituted', () => {
      const dsl = `component Greeting:
  > Hello, %name!

screen Home:
  container:
    $Greeting:
      - World`

      const ast = parseAndBuildAst(dsl)

      console.log('\n=== AST Structure (Component) ===')
      const componentNode = ast.children?.find(
        (n: any) => n.type === 'component'
      )
      const screenNode = ast.children?.find((n: any) => n.type === 'screen')

      if (componentNode) {
        console.log('Component definition:')
        console.log(printASTStructure(componentNode))
      }

      if (screenNode) {
        console.log('\nScreen with component call:')
        console.log(printASTStructure(screenNode))
      }

      expect(ast.__errors || []).toHaveLength(0)

      const html = astToHtmlDocument(ast)

      console.log('\n=== HTML Analysis (Component) ===')
      console.log('Has "Hello, World!"?', html.includes('Hello, World!'))
      console.log('Has "%name"?', html.includes('%name'))
      console.log('Has "$Greeting"?', html.includes('$Greeting'))

      // Critical: props should be substituted
      expect(html).toContain('Hello, World!')
      expect(html).not.toContain('%name')
      expect(html).not.toContain('$Greeting')
    })

    it('should render component with card layout', () => {
      const dsl = `component UserCard:
  card:
    ## %name
    > Email: %email
    @primary[View](%name)

screen Home:
  container:
    $UserCard:
      - John Doe | john@example.com`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors || []).toHaveLength(0)

      const html = astToHtmlDocument(ast)

      console.log('\n=== HTML Analysis (Component with Card) ===')
      console.log('Has card?', html.includes('class="card'))
      console.log('Has "John Doe"?', html.includes('John Doe'))
      console.log('Has email?', html.includes('john@example.com'))
      console.log('Has %name?', html.includes('%name'))
      console.log('Has %email?', html.includes('%email'))

      // Assertions
      expect(html).toContain('class="card')
      expect(html).toContain('John Doe')
      expect(html).toContain('john@example.com')
      expect(html).toContain('View')

      // Props should be substituted
      expect(html).not.toContain('%name')
      expect(html).not.toContain('%email')
    })

    it('should render component inside modal - CASO CRÍTICO REPORTADO', () => {
      const dsl = `component MessageCard:
  card:
    ## %title
    > %content
    @ghost[Close](close)

screen Home:
  container:
    @primary[Open](TestModal)

modal TestModal:
  $MessageCard:
    - Welcome | Hello!`

      const ast = parseAndBuildAst(dsl)

      console.log('\n=== AST Structure (Component in Modal) ===')
      const modalNode = ast.children?.find((n: any) => n.type === 'modal')
      if (modalNode) {
        console.log(printASTStructure(modalNode))
        console.log(
          '\nModal children:',
          modalNode.children?.map((c: any) => c.type)
        )
      }

      expect(ast.__errors || []).toHaveLength(0)

      const html = astToHtmlDocument(ast)

      console.log('\n=== HTML Analysis (Component in Modal) ===')
      console.log('Has modal?', html.includes('id="modal-TestModal"'))
      console.log('Has card?', html.includes('class="card'))
      console.log('Has "Welcome"?', html.includes('Welcome'))
      console.log('Has "Hello!"?', html.includes('Hello!'))
      console.log('Has %title?', html.includes('%title'))
      console.log('Has %content?', html.includes('%content'))

      // Critical assertions
      expect(html).toContain('id="modal-TestModal"')
      expect(html).toContain('class="card')
      expect(html).toContain('Welcome')
      expect(html).toContain('Hello!')
      expect(html).toContain('Close')

      // Props should be substituted
      expect(html).not.toContain('%title')
      expect(html).not.toContain('%content')
      expect(html).not.toContain('$MessageCard')

      // Structural: card should be inside modal
      const modalRegex =
        /<div[^>]*id="modal-TestModal"[^>]*>([\s\S]*?)<div[^>]*id="modal-/
      const modalMatch = html.match(modalRegex)

      if (modalMatch) {
        const modalContent = modalMatch[1]
        expect(modalContent).toContain('class="card')
        expect(modalContent).toContain('Welcome')
      } else {
        console.log(
          '⚠️  Could not extract modal content for structural verification'
        )
      }
    })
  })

  describe('Suite 4: Casos Complexos', () => {
    it('should render multiple cards in modal', () => {
      const dsl = `screen Home:
  container:
    @primary[Open](DashboardModal)

modal DashboardModal:
  stack:
    card:
      ## Users
      >> 1,234
    card:
      ## Revenue
      >> $12,345
    card:
      ## Orders
      >> 567`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors || []).toHaveLength(0)

      const html = astToHtmlDocument(ast)

      // All cards should be present
      expect(html).toContain('Users')
      expect(html).toContain('Revenue')
      expect(html).toContain('Orders')
      expect(html).toContain('1,234')
      expect(html).toContain('$12,345')
      expect(html).toContain('567')

      // Count card occurrences
      const cardCount = (html.match(/class="card/g) || []).length
      console.log(`\nCard count in HTML: ${cardCount}`)
      expect(cardCount).toBeGreaterThanOrEqual(3)
    })

    it('should render multiple component instances in modal', () => {
      const dsl = `component ContactItem:
  card:
    ## %name
    > %email

screen Home:
  container:
    @primary[Open](ContactsModal)

modal ContactsModal:
  stack:
    $ContactItem:
      - John | john@example.com
    $ContactItem:
      - Jane | jane@example.com`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors || []).toHaveLength(0)

      const html = astToHtmlDocument(ast)

      console.log('\n=== HTML Analysis (Multiple Components) ===')
      console.log('Has "John"?', html.includes('John'))
      console.log('Has "Jane"?', html.includes('Jane'))
      console.log('Has john@example.com?', html.includes('john@example.com'))
      console.log('Has jane@example.com?', html.includes('jane@example.com'))

      // Both components should be rendered
      expect(html).toContain('John')
      expect(html).toContain('Jane')
      expect(html).toContain('john@example.com')
      expect(html).toContain('jane@example.com')

      // Props should be substituted
      expect(html).not.toContain('%name')
      expect(html).not.toContain('%email')

      // Should have at least 2 cards
      const cardCount = (html.match(/class="card/g) || []).length
      console.log(`Card count: ${cardCount}`)
      expect(cardCount).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Suite 5: Navigation Attributes', () => {
    it('should have correct data-nav attributes for modal buttons', () => {
      const dsl = `screen Home:
  container:
    @primary[Open Modal](TestModal)

modal TestModal:
  card:
    ## Test
    @ghost[Close](close)`

      const ast = parseAndBuildAst(dsl)
      const html = astToHtmlDocument(ast)

      // Button to open modal
      expect(html).toMatch(/data-nav="TestModal"[^>]*data-nav-type="toggle"/)

      // Button to close modal
      expect(html).toMatch(/data-nav="close"[^>]*data-nav-type="close"/)

      // Modal close button (X)
      expect(html).toMatch(
        /data-nav="TestModal"[^>]*data-nav-type="toggle"[^>]*>&times;/
      )
    })
  })
})
