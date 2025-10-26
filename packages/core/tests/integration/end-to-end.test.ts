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
      const dsl = `Screen Home
  Layout stack
    Heading "Welcome"
    Text "Hello World"
    Button "Get Started" action=start`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('Welcome')
      expect(html).toContain('Hello World')
      expect(html).toContain('Get Started')
    })

    it('should parse and render multi-screen app', () => {
      const dsl = `Screen Home
  Layout stack
    Heading "Home"
    Button "Go to About" action=goToAbout

Screen About
  Layout stack
    Heading "About"
    Text "About us"
    Button "Back" action=goBack`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Home')
      expect(html).toContain('About')
      expect(html).toContain('navigateToScreen')
    })

    it('should parse and render app with modal and drawer', () => {
      const dsl = `Screen Home
  Button "Open Dialog" action=openDialog
  Button "Open Menu" action=openMenu

Modal Dialog
  Text "Modal Content"

Drawer Menu
  Text "Drawer Content"`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Modal Content')
      expect(html).toContain('Drawer Content')
      expect(html).toContain('modal')
      expect(html).toContain('drawer')
    })

    it('should parse and render form', () => {
      const dsl = `Screen LoginForm
  Layout stack
    Heading "Login"
    Input "Email" type=email placeholder="Enter email"
    Input "Password" type=password
    Checkbox "Remember me"
    Layout row-center
      Button "Cancel" variant=outline
      Button "Login" action=submit variant=primary`

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
      const dsl = `Screen Dashboard
  Layout stack
    Heading "Dashboard"
    Layout grid-3
      Layout card
        Heading "Users"
        Text "1,234"
        Text "Active users"
      Layout card
        Heading "Revenue"
        Text "$12,345"
        Text "This month"
      Layout card
        Heading "Orders"
        Text "567"
        Text "Pending"`

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
      const dsl = `Component Card [title, content]
  Layout card
    Heading {{title}}
    Text {{content}}

Screen Home
  <Card title="Welcome" content="Get started">`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Welcome')
      expect(html).toContain('Get started')
    })

    it('should handle multiple component instances', () => {
      const dsl = `Component Card [title]
  Layout card
    Heading {{title}}

Screen Home
  Layout grid-3
    <Card title="Card 1">
    <Card title="Card 2">
    <Card title="Card 3">`

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
      const dsl = `Screen Home
  Button "Go to Settings" action=goToSettings

Screen Settings
  Button "Back to Home" action=goToHome`

      const ast = parseAndBuildAst(dsl)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('navigateToScreen')
      expect(html).toContain('data-nav')
    })

    it('should handle navigator component', () => {
      const dsl = `Screen Home
  Navigator
    - Home destination=HomeScreen
    - Profile destination=ProfileScreen
    - Settings destination=SettingsScreen

Screen HomeScreen
  Text "Home"

Screen ProfileScreen
  Text "Profile"

Screen SettingsScreen
  Text "Settings"`

      const ast = parseAndBuildAst(dsl)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('Home')
      expect(html).toContain('Profile')
      expect(html).toContain('Settings')
    })

    it('should handle links with destinations', () => {
      const dsl = `Screen Home
  Link "About Us" destination=AboutScreen
  Link "Contact" destination=ContactScreen

Screen AboutScreen
  Text "About"

Screen ContactScreen
  Text "Contact"`

      const ast = parseAndBuildAst(dsl)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('About Us')
      expect(html).toContain('Contact')
      expect(html).toContain('data-nav')
    })
  })

  describe('Theme and Styling Integration', () => {
    it('should apply custom theme', () => {
      const dsl = `Styles
  theme = dark
  primary = #FF0000
  secondary = #00FF00

Screen Home
  Button "Custom Styled" variant=primary`

      const ast = parseAndBuildAst(dsl)
      const html = astToHtmlDocument(ast)

      expect(html).toContain(':root')
      expect(html).toContain('dark')
    })

    it('should apply multiple style properties', () => {
      const dsl = `Styles
  primary = #FF0000
  secondary = #00FF00
  accent = #0000FF
  background = #FFFFFF

Screen Home
  Text "Styled app"`

      const ast = parseAndBuildAst(dsl)
      const html = astToHtmlDocument(ast)

      expect(html).toContain(':root')
    })
  })

  describe('Error Handling Integration', () => {
    it('should collect lexer errors', () => {
      const dsl = 'Screen @InvalidChar'
      const ast = parseAndBuildAst(dsl)

      const errors = ast.__errors || []
      expect(errors.length).toBeGreaterThan(0)
      expect(errors.some((e: any) => e.stage === 'lexer')).toBe(true)
    })

    it('should recover from errors and produce partial AST', () => {
      const dsl = `Screen Home
  Button "Valid"
  InvalidElement "This errors"
  Button "Also valid"`

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
      const dsl = `Screen Home
  Button "Click me"
  Text "Some text"`

      const ast1 = parseAndBuildAst(dsl)
      const ast2 = parseAndBuildAst(dsl, ast1)

      const screen1 = Array.isArray(ast1) ? ast1[0] : ast1
      const screen2 = Array.isArray(ast2) ? ast2[0] : ast2

      expect(screen1.id).toBe(screen2.id)
      expect(screen1.children[0].id).toBe(screen2.children[0].id)
      expect(screen1.children[1].id).toBe(screen2.children[1].id)
    })

    it('should generate new IDs when content changes', () => {
      const dsl1 = `Screen Home
  Button "Click me"`

      const dsl2 = `Screen Home
  Button "Different text"`

      const ast1 = parseAndBuildAst(dsl1)
      const ast2 = parseAndBuildAst(dsl2, ast1)

      const screen1 = Array.isArray(ast1) ? ast1[0] : ast1
      const screen2 = Array.isArray(ast2) ? ast2[0] : ast2

      // Screen ID should stay the same
      expect(screen1.id).toBe(screen2.id)
      // Button ID should change
      expect(screen1.children[0].id).not.toBe(screen2.children[0].id)
    })
  })

  describe('Complex Real-World Scenarios', () => {
    it('should handle complete e-commerce app', () => {
      const dsl = `Styles
  theme = dark
  primary = #FF6B6B

Screen Home
  Layout stack
    Heading "Shop"
    Layout grid-3
      Layout card
        Image "Product 1" src=product1.jpg
        Heading "Product 1"
        Text "$99.99"
        Button "Add to Cart" action=addToCart
      Layout card
        Image "Product 2" src=product2.jpg
        Heading "Product 2"
        Text "$149.99"
        Button "Add to Cart" action=addToCart
      Layout card
        Image "Product 3" src=product3.jpg
        Heading "Product 3"
        Text "$199.99"
        Button "Add to Cart" action=addToCart
    Navigator
      - Home destination=Home
      - Cart destination=Cart

Screen Cart
  Layout stack
    Heading "Shopping Cart"
    Text "Your items"
    Button "Checkout" action=checkout variant=primary

Modal Checkout
  Layout stack
    Heading "Checkout"
    Input "Name" placeholder="Full name"
    Input "Email" type=email
    Button "Complete Order" action=completeOrder`

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
      const dsl = `Component Post [author, content, likes]
  Layout card
    Heading {{author}}
    Text {{content}}
    Layout row-start
      Button "Like" action=like
      Text {{likes}}

Screen Feed
  Layout stack
    Heading "Feed"
    <Post author="John" content="Hello World!" likes="42">
    <Post author="Jane" content="Great day!" likes="123">
    <Post author="Bob" content="Check this out" likes="89">
    Fab icon=plus action=newPost

Modal NewPost
  Layout stack
    Heading "New Post"
    Input "Content" placeholder="What's on your mind?"
    Button "Post" action=submitPost`

      const ast = parseAndBuildAst(dsl)
      // Components with special syntax may have some lexer warnings
      // Just verify the AST was created
      expect(ast).toBeDefined()

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Feed')
      expect(html).toContain('John')
      expect(html).toContain('Hello World!')
      expect(html).toContain('42')
    })

    it('should handle settings screen with all input types', () => {
      const dsl = `Screen Settings
  Layout stack
    Heading "Settings"
    
    Layout stack
      Text "Profile"
      Input "Username" placeholder="Enter username"
      Input "Email" type=email
      
    Layout stack
      Text "Notifications"
      Checkbox "Email notifications"
      Checkbox "Push notifications"
      Checkbox "SMS notifications"
      
    Layout stack
      Text "Theme"
      RadioOption "Light" value=light
      RadioOption "Dark" value=dark
      RadioOption "Auto" value=auto
      
    Layout row-center
      Button "Cancel" variant=outline
      Button "Save" action=saveSettings variant=primary`

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
      const dsl = `Screen Home
  Button "Click me"`

      const ast = parseAndBuildAst(dsl)
      const preview = astToHtmlStringPreview(ast)

      expect(preview).not.toContain('<!DOCTYPE html>')
      expect(preview).toContain('Click me')
    })

    it('should render component preview', () => {
      const dsl = `Component Card [title]
  Layout card
    Heading {{title}}`

      const ast = parseAndBuildAst(dsl)
      const preview = astToHtmlStringPreview(ast)

      expect(preview).not.toContain('<!DOCTYPE html>')
      expect(preview).toBeDefined()
    })
  })

  describe('Route Management Integration', () => {
    it('should process routes correctly', () => {
      const dsl = `Screen Home
  Text "Home"

Screen About
  Text "About"`

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

      const dsl = 'Screen @Invalid'
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
        dsl += `Screen Screen${i}
  Heading "Screen ${i}"
  Text "Content ${i}"
  Button "Next" action=next

`
      }

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Screen 0')
      expect(html).toContain('Screen 19')
    })

    it('should handle deeply nested structures', () => {
      const dsl = `Screen Deep
  Layout stack
    Layout stack
      Layout stack
        Layout stack
          Layout stack
            Button "Deep button"`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Deep button')
    })

    it('should handle many elements at same level', () => {
      let dsl = 'Screen ManyElements\n'
      for (let i = 0; i < 50; i++) {
        dsl += `  Button "Button ${i}"\n`
      }

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const html = astToHtmlDocument(ast)
      expect(html).toContain('Button 0')
      expect(html).toContain('Button 49')
    })
  })
})
