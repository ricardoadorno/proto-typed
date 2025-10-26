import { describe, it, expect, beforeEach } from 'vitest'
import { astToHtmlDocument } from '../../src/renderer/ast-to-html-document'
import { astToHtmlStringPreview } from '../../src/renderer/ast-to-html-string-preview'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { AstNode } from '../../src/types/ast-node'

describe('Renderer - HTML Generation', () => {
  describe('astToHtmlDocument', () => {
    it('should render simple screen to HTML', () => {
      const input = `Screen MainScreen
  Text "Hello World"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html')
      expect(html).toContain('Hello World')
    })

    it('should include Tailwind CDN', () => {
      const input = 'Screen MainScreen'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('cdn.tailwindcss.com')
    })

    it('should include Lucide icons script', () => {
      const input = 'Screen MainScreen'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('lucide')
    })

    it('should include navigation script', () => {
      const input = 'Screen MainScreen'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('navigateToScreen')
    })

    it('should render button element', () => {
      const input = `Screen MainScreen
  Button "Click me"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('<button')
      expect(html).toContain('Click me')
    })

    it('should render multiple screens', () => {
      const input = `Screen Home
  Text "Home"

Screen About
  Text "About"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('Home')
      expect(html).toContain('About')
    })

    it('should render modal', () => {
      const input = `Modal ConfirmDialog
  Text "Are you sure?"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('modal')
      expect(html).toContain('Are you sure?')
    })

    it('should render drawer', () => {
      const input = `Drawer SideMenu
  Text "Menu"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('drawer')
      expect(html).toContain('Menu')
    })

    it('should render nested layouts', () => {
      const input = `Screen MainScreen
  Layout stack
    Button "First"
    Button "Second"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('First')
      expect(html).toContain('Second')
    })

    it('should include dark mode class', () => {
      const input = 'Screen MainScreen'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('class="dark"')
    })

    it('should set current screen when specified', () => {
      const input = `Screen Home
  Text "Home"

Screen About
  Text "About"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast, { currentScreen: 'About' })

      expect(html).toBeDefined()
      // The About screen should be visible
      expect(html).toContain('About')
    })

    it('should include CSS variables from theme', () => {
      const input = `Styles
  primary = #FF0000

Screen MainScreen
  Text "Test"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain(':root')
      expect(html).toContain('--')
    })
  })

  describe('astToHtmlStringPreview', () => {
    it('should render preview without full document', () => {
      const input = `Screen MainScreen
  Button "Click me"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast)

      expect(html).not.toContain('<!DOCTYPE html>')
      expect(html).toContain('Click me')
    })

    it('should render simple button', () => {
      const input = `Screen MainScreen
  Button "Test"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast)

      expect(html).toContain('<button')
      expect(html).toContain('Test')
    })

    it('should render text element', () => {
      const input = `Screen MainScreen
  Text "Hello"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast)

      expect(html).toContain('Hello')
    })

    it('should render heading', () => {
      const input = `Screen MainScreen
  Heading "Title"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast)

      expect(html).toContain('Title')
      expect(html).toMatch(/<h[1-6]/)
    })

    it('should render link', () => {
      const input = `Screen MainScreen
  Link "Home" destination=HomeScreen`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast)

      expect(html).toContain('<a')
      expect(html).toContain('Home')
    })

    it('should render input field', () => {
      const input = `Screen MainScreen
  Input "Email"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast)

      expect(html).toContain('<input')
      expect(html).toContain('Email')
    })

    it('should render checkbox', () => {
      const input = `Screen MainScreen
  Checkbox "Accept"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast)

      expect(html).toContain('checkbox')
      expect(html).toContain('Accept')
    })
  })

  describe('Navigation Attributes', () => {
    it('should add data-nav for screen navigation', () => {
      const input = `Screen Home
  Button "Go to About" action=goToAbout`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('data-nav')
    })

    it('should handle link destinations', () => {
      const input = `Screen Home
  Link "About" destination=AboutScreen`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('data-nav')
      expect(html).toContain('AboutScreen')
    })

    it('should handle external links', () => {
      const input = `Screen Home
  Link "Google" destination=https://google.com`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('https://google.com')
    })
  })

  describe('Styling and Classes', () => {
    it('should apply Tailwind classes', () => {
      const input = `Screen MainScreen
  Button "Click"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      // Should contain some Tailwind classes
      expect(html).toMatch(/class="[^"]*\b(px-|py-|bg-|text-|rounded)/i)
    })

    it('should apply layout classes', () => {
      const input = `Screen MainScreen
  Layout stack
    Text "Item"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('flex')
    })

    it('should handle card layout', () => {
      const input = `Screen MainScreen
  Layout card
    Text "Card content"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('rounded')
    })
  })

  describe('Element Rendering', () => {
    it('should render image with src', () => {
      const input = `Screen MainScreen
  Image "Logo" src=logo.png`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast)

      expect(html).toContain('<img')
      expect(html).toContain('logo.png')
      expect(html).toContain('Logo')
    })

    it('should render separator', () => {
      const input = `Screen MainScreen
  Separator`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast)

      expect(html).toContain('<hr')
    })

    it('should render FAB', () => {
      const input = `Screen MainScreen
  Fab icon=plus action=addItem`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('fixed')
      expect(html).toContain('plus')
    })
  })

  describe('Complex Structures', () => {
    it('should render form with inputs', () => {
      const input = `Screen LoginForm
  Layout stack
    Input "Email" type=email
    Input "Password" type=password
    Button "Login" action=submit`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('Email')
      expect(html).toContain('Password')
      expect(html).toContain('Login')
      expect(html).toContain('type="email"')
      expect(html).toContain('type="password"')
    })

    it('should render dashboard with cards', () => {
      const input = `Screen Dashboard
  Layout grid-3
    Layout card
      Heading "Stats"
      Text "100"
    Layout card
      Heading "Revenue"
      Text "$5000"
    Layout card
      Heading "Orders"
      Text "42"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('Stats')
      expect(html).toContain('Revenue')
      expect(html).toContain('Orders')
      expect(html).toContain('100')
      expect(html).toContain('$5000')
      expect(html).toContain('42')
    })

    it('should render nested navigation', () => {
      const input = `Screen Home
  Navigator
    - Home destination=HomeScreen
    - About destination=AboutScreen
    - Contact destination=ContactScreen`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('Home')
      expect(html).toContain('About')
      expect(html).toContain('Contact')
    })
  })

  describe('Error Handling', () => {
    it('should handle empty screen', () => {
      const input = 'Screen EmptyScreen'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toBeDefined()
    })

    it('should handle invalid AST gracefully', () => {
      const ast: AstNode = {
        type: 'Screen',
        id: 'screen_test',
        props: {},
        children: [],
      }

      expect(() => astToHtmlDocument(ast)).not.toThrow()
    })
  })

  describe('Screen Visibility', () => {
    it('should render multiple screens with visibility control', () => {
      const input = `Screen Home
  Text "Home"

Screen About
  Text "About"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast, { currentScreen: 'Home' })

      expect(html).toBeDefined()
      // Should contain data-screen attributes
      expect(html).toContain('data-screen')
    })
  })

  describe('Theme Integration', () => {
    it('should apply theme styles', () => {
      const input = `Styles
  theme = dark

Screen MainScreen
  Text "Themed"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('dark')
    })

    it('should include custom properties', () => {
      const input = `Styles
  primary = #FF0000
  secondary = #00FF00

Screen MainScreen
  Text "Custom colors"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain(':root')
    })
  })

  describe('Responsive Design', () => {
    it('should include viewport meta tag', () => {
      const input = 'Screen MainScreen'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('viewport')
      expect(html).toContain('width=device-width')
    })

    it('should use responsive Tailwind classes', () => {
      const input = `Screen MainScreen
  Layout container
    Text "Responsive"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('container')
    })
  })

  describe('Accessibility', () => {
    it('should include alt text for images', () => {
      const input = `Screen MainScreen
  Image "Logo" src=logo.png`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast)

      expect(html).toContain('alt="Logo"')
    })

    it('should include labels for inputs', () => {
      const input = `Screen MainScreen
  Input "Email"`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast)

      expect(html).toContain('Email')
    })
  })
})
