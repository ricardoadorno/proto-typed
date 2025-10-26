import { describe, it, expect, beforeEach } from 'vitest'
import { tokenize } from '../../src/lexer/lexer'
import { parser } from '../../src/parser/parser'

describe('Parser - Syntax Analysis', () => {
  beforeEach(() => {
    // Reset parser state
    parser.input = []
  })

  describe('Basic Parsing', () => {
    it('should parse a simple screen declaration', () => {
      const input = 'screen MainScreen:'
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
      expect(cst).toBeDefined()
    })

    it('should parse button element', () => {
      const input = `screen MainScreen:
  @[Click me](action)`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
      expect(cst).toBeDefined()
    })

    it('should parse text element', () => {
      const input = `screen MainScreen:
  >> Hello World`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })
  })

  describe('Nested Elements', () => {
    it('should parse nested layouts', () => {
      const input = `screen MainScreen:
  stack:
    @[First](action1)
    @[Second](action2)`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
      expect(cst).toBeDefined()
    })

    it('should parse multiple nesting levels', () => {
      const input = `screen MainScreen:
  stack:
    row-center:
      @[Left](left)
      @[Right](right)
    >> Footer`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse list with items', () => {
      const input = `component ItemCard:
  > %text

screen MainScreen:
  list $ItemCard:
    - Item 1
    - Item 2
    - Item 3`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })
  })

  describe('Component Parsing', () => {
    it('should parse component declaration', () => {
      const input = `component Card:
  >> Component content`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse component with props', () => {
      const input = `component Card:
  # %title
  > %description`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse component instance', () => {
      const input = `screen MainScreen:
  $Card:
    - Test | Description`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })
  })

  describe('Attributes Parsing', () => {
    it('should parse button with action', () => {
      const input = `screen MainScreen:
  @[Click](submit)`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse button with variant and size', () => {
      const input = `screen MainScreen:
  @secondary-lg[Click](submit)`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse input with placeholder', () => {
      const input = `screen MainScreen:
  ___email: Email{Enter your email}`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })
  })

  describe('View Types', () => {
    it('should parse modal', () => {
      const input = `modal ConfirmDialog:
  > Are you sure?`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse drawer', () => {
      const input = `drawer SideMenu:
  > Menu content`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse multiple screens', () => {
      const input = `screen Home:
  > Home

screen About:
  > About`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })
  })

  describe('Input Elements', () => {
    it('should parse input field', () => {
      const input = `screen MainScreen:
  ___: Username{Enter username}`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse checkbox', () => {
      const input = `screen MainScreen:
  [X] Accept terms`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse radio button group', () => {
      const input = `screen MainScreen:
  (X) Option A
  ( ) Option B`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })
  })

  describe('Styles Parsing', () => {
    it('should parse styles block', () => {
      const input = `styles:
  --primary: #FF0000;
  --secondary: #00FF00;`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse theme selection', () => {
      const input = `styles:
  --theme: dark;`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })
  })

  describe('Navigation Elements', () => {
    it('should parse link element', () => {
      const input = `screen MainScreen:
  #[Go Home](https://example.com)`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse navigator', () => {
      const input = `screen MainScreen:
  navigator:
    - Home | HomeScreen
    - About | AboutScreen`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should parse FAB', () => {
      const input = `screen MainScreen:
  fab:
    - Add | addItem | plus`
      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })
  })

  describe('Complex Structures', () => {
    it('should parse complex screen with multiple elements', () => {
      const input = `screen Dashboard:
  stack:
    # Dashboard
    row-between:
      > Welcome back!
      @[Logout](logout)
    grid-3:
      card:
        ## Stats
        > 100 users
      card:
        ## Revenue
        > $5000
      card:
        ## Orders
        > 42`

      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
      expect(cst).toBeDefined()
    })

    it('should parse form with validation', () => {
      const input = `screen LoginForm:
  stack:
    ___email: Email{Enter email}
    ___password: Password{Enter password}
    row-center:
      @outline[Cancel](cancel)
      @[Login](submit)`

      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })
  })

  describe('Error Recovery', () => {
    it('should attempt to recover from syntax errors', () => {
      const input = `screen MainScreen:
  @[Valid](action)
  InvalidElement
  @[Another valid](action2)`

      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      // Parser should have errors but still return a CST
      expect(cst).toBeDefined()
    })

    it('should handle missing closing elements', () => {
      const input = `screen MainScreen:
  stack:
    @[Nested](action)
  @[Outside](action2)`

      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      // Should parse successfully
      expect(cst).toBeDefined()
    })
  })

  describe('Empty and Edge Cases', () => {
    it('should handle empty screen', () => {
      const input = 'screen EmptyScreen:'

      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should handle screen with only text', () => {
      const input = `screen SimpleScreen:
  > Just text`

      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })

    it('should handle deeply nested structures', () => {
      const input = `screen Deep:
  stack:
    row-center:
      card:
        stack:
          > Level 5`

      const lexResult = tokenize(input)
      parser.input = lexResult.tokens

      const cst = parser.program()

      expect(parser.errors).toHaveLength(0)
    })
  })
})
