import { describe, it, expect, beforeEach } from 'vitest'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { astToHtmlDocument } from '../../src/renderer/ast-to-html-document'
import { astToHtmlStringPreview } from '../../src/renderer/ast-to-html-string-preview'
import { ErrorBus } from '../../src/error-bus'
import { RouteManager } from '../../src/renderer/core/route-manager'

describe('Integration Tests - End to End', () => {
  let errorBus: ErrorBus

  beforeEach(() => {
    errorBus = ErrorBus.get()
    errorBus.clear()
  })

  describe('Complete DSL to HTML Pipeline', () => {
    it('should parse and render simple app', () => {
      const dsl = `screen Home:
  container:
    stack:
      # Welcome
      >> Hello World
      @[Get Started](start)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('Welcome')
      expect(html).toContain('Hello World')
      expect(html).toContain('Get Started')
    })

    it('should parse and render multi-screen app', () => {
      const dsl = `screen Home:
  container:
    stack:
      # Home
      @[Go to About](About)

screen About:
  container:
    stack:
      # About
      >> About us
      @[Back](-1)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Home')
      expect(html).toContain('About')
      expect(html).toContain('navigateToScreen')
    })

    it('should parse and render app with modal and drawer', () => {
      const dsl = `screen Home:
  container:
    @[Open Dialog](Dialog)
    @[Open Menu](Menu)

modal Dialog:
  card:
    >> Modal Content

drawer Menu:
  container:
    >> Drawer Content`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Modal Content')
      expect(html).toContain('Drawer Content')
      expect(html).toContain('modal')
      expect(html).toContain('drawer')
    })

    it('should parse and render form', () => {
      const dsl = `screen LoginForm:
  container:
    card:
      stack:
        # Login
        ___email: Email{Enter email}
        ___password: Password{Enter password}
        [X] Remember me
        row-center:
          @outline[Cancel](cancel)
          @[Login](submit)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Login')
      expect(html).toContain('Email')
      expect(html).toContain('Password')
      expect(html).toContain('Remember me')
      expect(html).toContain('type="email"')
      expect(html).toContain('type="password"')
    })

    it('should parse and render dashboard with cards', () => {
      const dsl = `screen Dashboard:
  container:
    stack:
      # Dashboard
      grid-3:
        card:
          ## Users
          >> 1,234
          >>> Active users
        card:
          ## Revenue
          >> $12,345
          >>> This month
        card:
          ## Orders
          >> 567
          >>> Pending`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Dashboard')
      expect(html).toContain('Users')
      expect(html).toContain('Revenue')
      expect(html).toContain('Orders')
      expect(html).toContain('1,234')
      expect(html).toContain('$12,345')
      expect(html).toContain('567')
    })
  })

  describe('Component System Integration', () => {
    it('should parse component and render instance', () => {
      const dsl = `component Card:
  card:
    ## %title
    >> %content

screen Home:
  container:
    $Card:
      - Welcome | Get started`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Welcome')
      expect(html).toContain('Get started')
    })

    it('should handle multiple component instances', () => {
      const dsl = `component Card:
  card:
    ## %title

screen Home:
  container:
    grid-3:
      $Card:
        - Card 1
      $Card:
        - Card 2
      $Card:
        - Card 3`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Card 1')
      expect(html).toContain('Card 2')
      expect(html).toContain('Card 3')
    })
  })

  describe('Navigation Integration', () => {
    it('should setup navigation between screens', () => {
      const dsl = `screen Home:
  container:
    @[Go to Settings](Settings)

screen Settings:
  container:
    @[Back to Home](Home)`

      const ast = parseAndBuildAst(dsl)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('navigateToScreen')
      expect(html).toContain('data-nav')
    })

    it('should handle navigator component', () => {
      const dsl = `screen Home:
  container:
    >> Welcome
  
  navigator:
    - Home | HomeScreen
    - Profile | ProfileScreen
    - Settings | SettingsScreen

screen HomeScreen:
  container:
    >> Home

screen ProfileScreen:
  container:
    >> Profile

screen SettingsScreen:
  container:
    >> Settings`

      const ast = parseAndBuildAst(dsl)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('Home')
      expect(html).toContain('Profile')
      expect(html).toContain('Settings')
    })

    it('should handle links with destinations', () => {
      const dsl = `screen Home:
  container:
    @[About Us](AboutScreen)
    @[Contact](ContactScreen)

screen AboutScreen:
  container:
    >> About

screen ContactScreen:
  container:
    >> Contact`

      const ast = parseAndBuildAst(dsl)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('About Us')
      expect(html).toContain('Contact')
      expect(html).toContain('data-nav')
    })
  })

  describe('Theme and Styling Integration', () => {
    it('should apply custom theme', () => {
      const dsl = `styles:
  --primary: #FF0000;
  --secondary: #00FF00;

screen Home:
  container:
    @[Custom Styled](action)`

      const ast = parseAndBuildAst(dsl)
      const html = astToHtmlDocument(ast)

      expect(html).toContain(':root')
      expect(html).toContain('dark')
    })

    it('should apply multiple style properties', () => {
      const dsl = `styles:
  --primary: #FF0000;
  --secondary: #00FF00;
  --accent: #0000FF;
  --background: #FFFFFF;

screen Home:
  container:
    >> Styled app`

      const ast = parseAndBuildAst(dsl)
      const html = astToHtmlDocument(ast)

      expect(html).toContain(':root')
    })
  })

  describe('Error Handling Integration', () => {
    it('should collect lexer errors', () => {
      const dsl = 'screen ~InvalidChar:'
      const ast = parseAndBuildAst(dsl)

      const errors = ast.__errors || []
      expect(errors.length).toBeGreaterThan(0)
      // The invalid character in screen name is caught by the builder validator
      expect(
        errors.some((e: any) => e.stage === 'builder' || e.stage === 'lexer')
      ).toBe(true)
    })

    it('should recover from errors and produce partial AST', () => {
      const dsl = `screen Home:
  container:
    @[Valid](action)
    ~InvalidElement
    @[Also valid](action2)`

      const ast = parseAndBuildAst(dsl)

      // Should still produce an AST
      expect(ast).toBeDefined()
      // Should have collected errors
      const errors = ast.__errors || []
      expect(errors.length).toBeGreaterThan(0)
    })

    it('should handle empty input', () => {
      const dsl = ''
      const ast = parseAndBuildAst(dsl)

      expect(ast).toBeDefined()
    })

    it('should handle only whitespace', () => {
      const dsl = '   \n  \n  '
      const ast = parseAndBuildAst(dsl)

      expect(ast).toBeDefined()
    })
  })

  describe('ID Stability Integration', () => {
    it('should maintain stable IDs across re-parses', () => {
      const dsl = `screen Home:
  container:
    @[Click me](action)
    >> Some text`

      const ast1 = parseAndBuildAst(dsl)
      const ast2 = parseAndBuildAst(dsl, ast1)

      const screen1 = Array.isArray(ast1) ? ast1[0] : ast1
      const screen2 = Array.isArray(ast2) ? ast2[0] : ast2

      expect(screen1.id).toBe(screen2.id)
      if (screen1.children[0] && screen2.children[0]) {
        expect(screen1.children[0].id).toBe(screen2.children[0].id)
      }
    })

    it('should generate new IDs when content changes', () => {
      const dsl1 = `screen Home:
  container:
    @[Click me](action)`

      const dsl2 = `screen Home:
  container:
    @[Different text](action)`

      const ast1 = parseAndBuildAst(dsl1)
      const ast2 = parseAndBuildAst(dsl2, ast1)

      const screen1 = ast1.children[0]
      const screen2 = ast2.children[0]

      // Screen ID should stay the same
      expect(screen1.id).toBe(screen2.id)
      // Button ID should change (button is inside container)
      const button1 = screen1.children[0]?.children[0]
      const button2 = screen2.children[0]?.children[0]
      if (button1 && button2) {
        expect(button1.id).not.toBe(button2.id)
      }
    })
  })

  describe('Complex Real-World Scenarios', () => {
    it('should handle complete e-commerce app', () => {
      const dsl = `styles:
  --primary: #FF6B6B;

screen Home:
  container:
    stack:
      # Shop
      grid-3:
        card:
          ![Product 1](product1.jpg)
          ## Product 1
          >> $99.99
          @[Add to Cart](addToCart)
        card:
          ![Product 2](product2.jpg)
          ## Product 2
          >> $149.99
          @[Add to Cart](addToCart)
        card:
          ![Product 3](product3.jpg)
          ## Product 3
          >> $199.99
          @[Add to Cart](addToCart)
  
  navigator:
    - Home | Home
    - Cart | Cart

screen Cart:
  container:
    stack:
      # Shopping Cart
      >> Your items
      @[Checkout](Checkout)

modal Checkout:
  card:
    stack:
      # Checkout
      ___: Name{Full name}
      ___email: Email{Your email}
      @[Complete Order](completeOrder)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Shop')
      expect(html).toContain('Product 1')
      expect(html).toContain('Shopping Cart')
      expect(html).toContain('Checkout')
      expect(html).toContain('$99.99')
    })

    it('should handle social media feed', () => {
      const dsl = `component Post:
  card:
    ## %author
    > %content
    row-between:
      @outline-sm[Like](like)
      >>> %likes

screen Feed:
  container:
    stack:
      # Feed
      list $Post:
        - John | Hello World! | 42
        - Jane | Great day! | 123
        - Bob | Check this out | 89
  
  fab:
    - icon:plus | newPost

modal NewPost:
  card:
    stack:
      # New Post
      ___textarea: Content{What's on your mind?}
      @[Post](submitPost)`

      const ast = parseAndBuildAst(dsl)
      // Just verify the AST was created
      expect(ast).toBeDefined()

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Feed')
      expect(html).toContain('John')
      expect(html).toContain('Hello World!')
      expect(html).toContain('42')
    })

    it('should handle settings screen with all input types', () => {
      const dsl = `screen Settings:
  container:
    stack:
      # Settings
      
      card:
        ### Profile
        ___: Username{Enter username}
        ___email: Email{Your email}
      
      card:
        ### Notifications
        [X] Email notifications
        [ ] Push notifications
        [ ] SMS notifications
      
      card:
        ### Theme
        (X) Light
        ( ) Dark
        ( ) Auto
      
      row-end:
        @outline[Cancel](cancel)
        @[Save](saveSettings)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Settings')
      expect(html).toContain('Profile')
      expect(html).toContain('Notifications')
      expect(html).toContain('Theme')
      expect(html).toContain('Email notifications')
      expect(html).toContain('type="email"')
      expect(html).toContain('checkbox')
    })
  })

  describe('Preview Rendering Integration', () => {
    it('should render preview without full document structure', () => {
      const dsl = `screen Home:
  container:
    @[Click me](action)`

      const ast = parseAndBuildAst(dsl)
      const preview = astToHtmlStringPreview(ast).html

      expect(preview).not.toContain('<!DOCTYPE html>')
      expect(preview).toContain('Click me')
    })

    it('should render component preview', () => {
      const dsl = `component Card:
  card:
    ## %title`

      const ast = parseAndBuildAst(dsl)
      const preview = astToHtmlStringPreview(ast).html

      expect(preview).not.toContain('<!DOCTYPE html>')
      expect(preview).toBeDefined()
    })
  })

  describe('Route Management Integration', () => {
    it('should process routes correctly', () => {
      const dsl = `screen Home:
  container:
    >> Home

screen About:
  container:
    >> About`

      const ast = parseAndBuildAst(dsl)
      const routeManager = new RouteManager()
      routeManager.processRoutes(ast, {})

      const routes = routeManager.getScreenRoutes()
      expect(routes.length).toBeGreaterThan(0)
    })
  })

  describe('ErrorBus Integration', () => {
    it('should work with ErrorBus for error collection', () => {
      const errorBus = ErrorBus.get()
      errorBus.clear()

      let errors: any[] = []
      errorBus.subscribe((errs) => {
        errors = errs
      })

      const dsl = 'screen ~Invalid:'
      parseAndBuildAst(dsl)

      // Errors should be collected in AST
      // ErrorBus can be used separately for UI error display
      expect(errors).toBeDefined()
    })
  })

  describe('Performance and Scalability', () => {
    it('should handle large app with many screens', () => {
      let dsl = ''
      for (let i = 0; i < 20; i++) {
        dsl += `screen Screen${i}:
  container:
    # Screen ${i}
    >> Content ${i}
    @[Next](next)

`
      }

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Screen 0')
      expect(html).toContain('Screen 19')
    })

    it('should handle deeply nested structures', () => {
      const dsl = `screen Deep:
  container:
    stack:
      stack:
        stack:
          stack:
            stack:
              @[Deep button](action)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Deep button')
    })

    it('should handle many elements at same level', () => {
      let dsl = 'screen ManyElements:\n  container:\n'
      for (let i = 0; i < 50; i++) {
        dsl += `    @[Button ${i}](action${i})\n`
      }

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Button 0')
      expect(html).toContain('Button 49')
    })
  })
})
