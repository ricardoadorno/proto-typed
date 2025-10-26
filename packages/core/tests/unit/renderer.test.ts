import { describe, it, expect } from 'vitest'
import { astToHtmlDocument } from '../../src/renderer/ast-to-html-document'
import { astToHtmlStringPreview } from '../../src/renderer/ast-to-html-string-preview'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { AstNode } from '../../src/types/ast-node'

describe('Renderer - HTML Generation', () => {
  describe('astToHtmlDocument', () => {
    it('should render simple screen to HTML', () => {
      const input = `screen MainScreen:
  container:
    >> Hello World`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html')
      expect(html).toContain('Hello World')
    })

    it('should include Tailwind CDN', () => {
      const input = 'screen MainScreen:'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('cdn.tailwindcss.com')
    })

    it('should include Lucide icons script', () => {
      const input = 'screen MainScreen:'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('lucide')
    })

    it('should include navigation script', () => {
      const input = 'screen MainScreen:'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('navigateToScreen')
    })

    it('should render button element', () => {
      const input = `screen MainScreen:
  container:
    @[Click me](action)`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('<button')
      expect(html).toContain('Click me')
    })

    it('should render multiple screens', () => {
      const input = `screen Home:
  container:
    >> Home

screen About:
  container:
    >> About`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('Home')
      expect(html).toContain('About')
    })

    it('should render modal', () => {
      const input = `modal ConfirmDialog:
  card:
    >> Are you sure?`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('modal')
      expect(html).toContain('Are you sure?')
    })

    it('should render drawer', () => {
      const input = `drawer SideMenu:
  container:
    >> Menu`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('drawer')
      expect(html).toContain('Menu')
    })

    it('should render nested layouts', () => {
      const input = `screen MainScreen:
  container:
    stack:
      @[First](action1)
      @[Second](action2)`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('First')
      expect(html).toContain('Second')
    })

    it('should include dark mode class', () => {
      const input = 'screen MainScreen:'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('class="dark"')
    })

    it('should set current screen when specified', () => {
      const input = `screen Home:
  container:
    >> Home

screen About:
  container:
    >> About`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast, { currentScreen: 'About' })

      expect(html).toBeDefined()
      expect(html).toContain('About')
    })

    it('should include CSS variables from theme', () => {
      const input = `styles:
  --primary: #FF0000;

screen MainScreen:
  container:
    >> Test`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain(':root')
      expect(html).toContain('--')
    })
  })

  describe('astToHtmlStringPreview', () => {
    it('should render preview without full document', () => {
      const input = `screen MainScreen:
  container:
    @[Click me](action)`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast).html

      expect(html).not.toContain('<!DOCTYPE html>')
      expect(html).toContain('Click me')
    })

    it('should render simple button', () => {
      const input = `screen MainScreen:
  container:
    @[Test](action)`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast).html

      expect(html).toContain('<button')
      expect(html).toContain('Test')
    })

    it('should render text element', () => {
      const input = `screen MainScreen:
  container:
    >> Hello`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast).html

      expect(html).toContain('Hello')
    })

    it('should render heading', () => {
      const input = `screen MainScreen:
  container:
    # Title`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast).html

      expect(html).toContain('Title')
      expect(html).toMatch(/<h[1-6]/)
    })

    it('should render link', () => {
      const input = `screen MainScreen:
  container:
    #[Home](HomeScreen)`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast).html

      expect(html).toContain('<a')
      expect(html).toContain('Home')
    })

    it('should render input field', () => {
      const input = `screen MainScreen:
  container:
    card:
      ___: Email{Enter your email}`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast).html

      expect(html).toContain('<input')
      expect(html).toContain('Email')
    })

    it('should render checkbox', () => {
      const input = `screen MainScreen:
  container:
    card:
      [X] Accept`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast).html

      expect(html).toContain('checkbox')
      expect(html).toContain('Accept')
    })
  })

  describe('Navigation Attributes', () => {
    it('should add data-nav for screen navigation', () => {
      const input = `screen Home:
  container:
    @[Go to About](About)

screen About:
  container:
    >> About Page`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('data-nav')
    })

    it('should handle link destinations', () => {
      const input = `screen Home:
  container:
    @[About](AboutScreen)

screen AboutScreen:
  container:
    >> About`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('data-nav')
      expect(html).toContain('AboutScreen')
    })

    it('should handle external links', () => {
      const input = `screen Home:
  container:
    #[Google](https://google.com)`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('https://google.com')
    })
  })

  describe('Styling and Classes', () => {
    it('should apply Tailwind classes', () => {
      const input = `screen MainScreen:
  container:
    @[Click](action)`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      // Should contain some Tailwind classes
      expect(html).toMatch(/class="[^"]*\b(px-|py-|bg-|text-|rounded)/i)
    })

    it('should apply layout classes', () => {
      const input = `screen MainScreen:
  container:
    stack:
      >> Item`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('flex')
    })

    it('should handle card layout', () => {
      const input = `screen MainScreen:
  container:
    card:
      >> Card content`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('rounded')
    })
  })

  describe('Element Rendering', () => {
    it('should render image with src', () => {
      const input = `screen MainScreen:
  container:
    ![Logo](logo.png)`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast).html

      expect(html).toContain('<img')
      expect(html).toContain('logo.png')
      expect(html).toContain('Logo')
    })

    it('should render separator', () => {
      const input = `screen MainScreen:
  container:
    >> Before
    ---
    >> After`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast).html

      expect(html).toContain('<hr')
    })

    it('should render FAB', () => {
      const input = `screen MainScreen:
  container:
    >> Content
  
  fab:
    - icon:plus | addItem`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('sticky')
      expect(html).toContain('absolute')
    })
  })

  describe('Complex Structures', () => {
    it('should render form with inputs', () => {
      const input = `screen LoginForm:
  container:
    card:
      stack:
        ___email: Email{Enter your email}
        ___password: Password{Enter password}
        @[Login](submit)`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('Email')
      expect(html).toContain('Password')
      expect(html).toContain('Login')
      expect(html).toContain('type="email"')
      expect(html).toContain('type="password"')
    })

    it('should render dashboard with cards', () => {
      const input = `screen Dashboard:
  container:
    grid-3:
      card:
        ## Stats
        >> 100
      card:
        ## Revenue
        >> $5000
      card:
        ## Orders
        >> 42`
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
      const input = `screen Home:
  container:
    >> Welcome
  
  navigator:
    - Home | Home
    - About | About
    - Contact | Contact`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('Home')
      expect(html).toContain('About')
      expect(html).toContain('Contact')
    })
  })

  describe('Error Handling', () => {
    it('should handle empty screen', () => {
      const input = 'screen EmptyScreen:'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toBeDefined()
    })

    it('should handle invalid AST gracefully', () => {
      const ast: AstNode = {
        type: 'Screen',
        id: 'screen_test',
        props: { name: 'Test' },
        children: [],
      }

      expect(() => astToHtmlDocument(ast)).not.toThrow()
    })
  })

  describe('Screen Visibility', () => {
    it('should render multiple screens with visibility control', () => {
      const input = `screen Home:
  container:
    >> Home

screen About:
  container:
    >> About`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast, { currentScreen: 'Home' })

      expect(html).toBeDefined()
      // Should contain data-screen attributes
      expect(html).toContain('data-screen')
    })
  })

  describe('Theme Integration', () => {
    it('should apply theme styles', () => {
      const input = `styles:
  --primary: #FF0000;

screen MainScreen:
  container:
    >> Themed`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast, { isDarkMode: true })

      expect(html).toContain('dark')
    })

    it('should include custom properties', () => {
      const input = `styles:
  --primary: #FF0000;
  --secondary: #00FF00;

screen MainScreen:
  container:
    >> Custom colors`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain(':root')
    })
  })

  describe('Responsive Design', () => {
    it('should include viewport meta tag', () => {
      const input = 'screen MainScreen:'
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('viewport')
      expect(html).toContain('width=device-width')
    })

    it('should use responsive Tailwind classes', () => {
      const input = `screen MainScreen:
  container:
    >> Responsive`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlDocument(ast)

      expect(html).toContain('container')
    })
  })

  describe('Accessibility', () => {
    it('should include alt text for images', () => {
      const input = `screen MainScreen:
  container:
    ![Logo](logo.png)`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast).html

      expect(html).toContain('alt="Logo"')
    })

    it('should include labels for inputs', () => {
      const input = `screen MainScreen:
  container:
    card:
      ___: Email{Enter email}`
      const ast = parseAndBuildAst(input)
      const html = astToHtmlStringPreview(ast).html

      expect(html).toContain('Email')
    })
  })
})
