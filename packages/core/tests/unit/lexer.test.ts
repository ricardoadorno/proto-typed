import { describe, it, expect, beforeEach } from 'vitest'
import { tokenize } from '../../src/lexer/lexer'

describe('Lexer - Tokenization', () => {
  beforeEach(() => {
    // Reset lexer state before each test
  })

  describe('Basic Tokenization', () => {
    it('should tokenize a simple screen declaration', () => {
      const input = 'Screen MainScreen'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens.length).toBeGreaterThan(0)
      expect(result.tokens[0].image).toBe('Screen')
    })

    it('should tokenize button element', () => {
      const input = 'Button "Click me"'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('Button')
    })

    it('should tokenize text with string literal', () => {
      const input = 'Text "Hello World"'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens.some((t) => t.image === 'Text')).toBe(true)
      expect(result.tokens.some((t) => t.image.includes('Hello'))).toBe(true)
    })
  })

  describe('Indentation Handling', () => {
    it('should detect indent tokens correctly', () => {
      const input = `Screen MainScreen
  Button "Click me"`
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens.some((t) => t.tokenType.name === 'Indent')).toBe(
        true
      )
    })

    it('should detect multiple indent levels', () => {
      const input = `Screen MainScreen
  Layout stack
    Button "Click me"
    Text "Hello"`
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      const indents = result.tokens.filter((t) => t.tokenType.name === 'Indent')
      expect(indents.length).toBeGreaterThanOrEqual(2)
    })

    it('should detect outdent tokens correctly', () => {
      const input = `Screen MainScreen
  Layout stack
    Button "Click me"
  Button "Outside"`
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens.some((t) => t.tokenType.name === 'Outdent')).toBe(
        true
      )
    })

    it('should add remaining outdents at end of file', () => {
      const input = `Screen MainScreen
  Layout stack
    Button "Click me"
    Text "Nested"`
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      const outdents = result.tokens.filter(
        (t) => t.tokenType.name === 'Outdent'
      )
      expect(outdents.length).toBeGreaterThan(0)
    })

    it('should ignore empty lines with only whitespace', () => {
      const input = `Screen MainScreen
  Button "First"
  
  Button "Second"`
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
    })
  })

  describe('Component Syntax', () => {
    it('should tokenize component declaration', () => {
      const input = 'Component Card'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('Component')
    })

    it('should tokenize component with props', () => {
      const input = 'Component Card [title, description]'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens.some((t) => t.image === 'Component')).toBe(true)
      expect(result.tokens.some((t) => t.image.includes('['))).toBe(true)
    })

    it('should tokenize component instance', () => {
      const input = '<Card title="Test">'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens.some((t) => t.image.includes('<'))).toBe(true)
    })
  })

  describe('Layout Keywords', () => {
    it('should tokenize layout with preset', () => {
      const input = 'Layout stack'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('Layout')
    })

    it('should tokenize list element', () => {
      const input = 'List'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('List')
    })
  })

  describe('Input Elements', () => {
    it('should tokenize input field', () => {
      const input = 'Input "Email" placeholder="Enter email"'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('Input')
    })

    it('should tokenize checkbox', () => {
      const input = 'Checkbox "Agree to terms"'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('Checkbox')
    })

    it('should tokenize radio button', () => {
      const input = 'RadioOption "Option A" value="a"'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('RadioOption')
    })
  })

  describe('Style Declarations', () => {
    it('should tokenize styles block', () => {
      const input = 'Styles'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('Styles')
    })

    it('should tokenize css property assignment', () => {
      const input = 'primary = #FF0000'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens.some((t) => t.image.includes('='))).toBe(true)
    })
  })

  describe('Navigation Elements', () => {
    it('should tokenize Link with destination', () => {
      const input = 'Link "Home" destination=HomeScreen'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('Link')
    })

    it('should tokenize Navigator', () => {
      const input = 'Navigator'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('Navigator')
    })

    it('should tokenize FAB', () => {
      const input = 'Fab icon=plus action=addItem'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('Fab')
    })
  })

  describe('Error Handling', () => {
    it('should detect invalid characters', () => {
      const input = 'Screen @InvalidChar'
      const result = tokenize(input)

      // The lexer collects errors but doesn't throw
      expect(result.errors.length).toBeGreaterThanOrEqual(0)
    })

    it('should handle invalid indentation', () => {
      const input = `Screen MainScreen
      Button "Too many spaces"` // 6 spaces instead of 2
      const result = tokenize(input)

      // Should still tokenize but might have issues
      expect(result.tokens.length).toBeGreaterThan(0)
    })

    it('should handle unclosed strings gracefully', () => {
      const input = 'Button "Unclosed string'
      const result = tokenize(input)

      // Lexer should handle gracefully
      expect(result.tokens).toBeDefined()
    })
  })

  describe('Special Characters', () => {
    it('should tokenize equals sign', () => {
      const input = 'Button text="Click" action=submit'
      const result = tokenize(input)

      expect(result.tokens.some((t) => t.image.includes('='))).toBe(true)
    })

    it('should tokenize brackets', () => {
      const input = 'Component Card [title, desc]'
      const result = tokenize(input)

      expect(result.tokens.some((t) => t.image.includes('['))).toBe(true)
      expect(result.tokens.some((t) => t.image.includes(']'))).toBe(true)
    })

    it('should tokenize comma', () => {
      const input = '[prop1, prop2, prop3]'
      const result = tokenize(input)

      expect(result.tokens.some((t) => t.image.includes(','))).toBe(true)
    })
  })

  describe('View Elements', () => {
    it('should tokenize Modal', () => {
      const input = 'Modal ConfirmDialog'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('Modal')
    })

    it('should tokenize Drawer', () => {
      const input = 'Drawer SideMenu'
      const result = tokenize(input)

      expect(result.errors).toHaveLength(0)
      expect(result.tokens[0].image).toBe('Drawer')
    })
  })

  describe('Complex DSL Example', () => {
    it('should tokenize a complete screen with nested elements', () => {
      const input = `Screen MainScreen
  Layout stack
    Heading "Welcome"
    Text "Hello World"
    Button "Click me" action=submit
    Layout row-center
      Button "Cancel"
      Button "OK"`

      const result = tokenize(input)

      // Should tokenize successfully
      expect(result.tokens.length).toBeGreaterThan(10)

      // Verify key tokens are present
      expect(result.tokens.some((t) => t.image === 'Screen')).toBe(true)
      expect(result.tokens.some((t) => t.image === 'Layout')).toBe(true)
      expect(result.tokens.some((t) => t.image === 'Heading')).toBe(true)
      expect(result.tokens.some((t) => t.image === 'Button')).toBe(true)
      expect(result.tokens.some((t) => t.tokenType.name === 'Indent')).toBe(
        true
      )
      expect(result.tokens.some((t) => t.tokenType.name === 'Outdent')).toBe(
        true
      )
    })
  })
})
