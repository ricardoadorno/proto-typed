import { describe, it, expect } from 'vitest'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { renderNode } from '../../src/renderer/core/node-renderer'

/**
 * Inputs Domain Tests
 *
 * Tests syntax and rendering for input form elements:
 * - Input: Text input, textarea, and other input types
 * - RadioOption: Radio button groups
 * - Checkbox: Checkbox elements
 * - Select: Dropdown select menus
 */

describe('Inputs Domain - Syntax Tests', () => {
  describe('Input', () => {
    it('should render a basic text input with label', () => {
      const dsl = `screen Test:
  ___[Name][Enter your name]`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const inputNode = ast.children![0].children![0]
      expect(inputNode.type).toBe('Input')
      expect(inputNode.props).toHaveProperty('label', 'Name')

      const html = renderNode(inputNode)
      expect(html).toContain('<label')
      expect(html).toContain('Name:')
      expect(html).toContain('<input')
      expect(html).toContain('placeholder="Enter your name"')
      expect(html).toContain('</label>')
    })

    it('should render email input type', () => {
      const dsl = `screen Test:
  ___email[Email][your@email.com]`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const inputNode = ast.children![0].children![0]
      expect(inputNode.props).toHaveProperty('kind', 'email')
      expect(inputNode.props).toHaveProperty('label', 'Email')

      const html = renderNode(inputNode)
      expect(html).toContain('type="email"')
      expect(html).toContain('Email:')
    })

    it('should render password input type', () => {
      const dsl = `screen Test:
  ___password[Password][Enter password]`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const inputNode = ast.children![0].children![0]
      expect(inputNode.props).toHaveProperty('kind', 'password')

      const html = renderNode(inputNode)
      expect(html).toContain('type="password"')
    })

    it('should render number input type', () => {
      const dsl = `screen Test:
  ___number[Age][Enter your age]`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const inputNode = ast.children![0].children![0]
      expect(inputNode.props).toHaveProperty('kind', 'number')

      const html = renderNode(inputNode)
      expect(html).toContain('type="number"')
    })

    it('should render textarea', () => {
      const dsl = `screen Test:
  ___textarea[Message][Your message here]`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const inputNode = ast.children![0].children![0]
      expect(inputNode.props).toHaveProperty('kind', 'textarea')

      const html = renderNode(inputNode)
      expect(html).toContain('<textarea')
      expect(html).toContain('placeholder="Your message here"')
      expect(html).toContain('</textarea>')
    })

    it('should render date input type', () => {
      const dsl = `screen Test:
  ___date[Birthday][Select date]`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const inputNode = ast.children![0].children![0]
      expect(inputNode.props).toHaveProperty('kind', 'date')

      const html = renderNode(inputNode)
      expect(html).toContain('type="date"')
    })
  })

  describe('Checkbox', () => {
    it('should render unchecked checkbox', () => {
      const dsl = `screen Test:
  [ ] Accept terms`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const checkboxNode = ast.children![0].children![0]
      expect(checkboxNode.type).toBe('Checkbox')
      expect(checkboxNode.props).toHaveProperty('checked', false)
      expect(checkboxNode.props).toHaveProperty('label', 'Accept terms')

      const html = renderNode(checkboxNode)
      expect(html).toContain('<input type="checkbox"')
      expect(html).toContain('Accept terms')
      expect(html).not.toContain('checked')
    })

    it('should render checked checkbox', () => {
      const dsl = `screen Test:
  [X] Remember me`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const checkboxNode = ast.children![0].children![0]
      expect(checkboxNode.props).toHaveProperty('checked', true)
      expect(checkboxNode.props).toHaveProperty('label', 'Remember me')

      const html = renderNode(checkboxNode)
      expect(html).toContain('checked')
      expect(html).toContain('Remember me')
    })

    it('should render checked checkbox with lowercase x', () => {
      const dsl = `screen Test:
  [x] Subscribe`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const checkboxNode = ast.children![0].children![0]
      expect(checkboxNode.props).toHaveProperty('checked', true)

      const html = renderNode(checkboxNode)
      expect(html).toContain('checked')
    })
  })

  describe('RadioOption', () => {
    it('should render radio group with unselected option', () => {
      const dsl = `screen Test:
  ( ) Option One`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const radioNode = ast.children![0].children![0]
      expect(radioNode.type).toBe('RadioOption')

      const html = renderNode(radioNode)
      expect(html).toContain('<input type="radio"')
      expect(html).toContain('Option One')
    })

    it('should render radio group with selected option', () => {
      const dsl = `screen Test:
  (X) Selected Option`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const radioNode = ast.children![0].children![0]
      expect(radioNode.type).toBe('RadioOption')

      const html = renderNode(radioNode)
      expect(html).toContain('Selected Option')
      // Note: Radio groups are typically rendered with multiple options
    })

    it('should render multiple radio options', () => {
      const dsl = `screen Test:
  ( ) Option A
  (X) Option B
  ( ) Option C`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const screenNode = ast.children![0]
      expect(screenNode.children).toHaveLength(3)

      const radioNodes = screenNode.children!
      expect(radioNodes[0].type).toBe('RadioOption')
      expect(radioNodes[1].type).toBe('RadioOption')
      expect(radioNodes[2].type).toBe('RadioOption')
    })
  })

  describe('Select', () => {
    it('should render select dropdown with options', () => {
      const dsl = `screen Test:
  ___[Country][][[USA][Canada][Mexico]]`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const selectNode = ast.children![0].children![0]
      expect(selectNode.type).toBe('Select')
      expect(selectNode.props).toHaveProperty('label', 'Country')

      const html = renderNode(selectNode)
      expect(html).toContain('<select')
      expect(html).toContain('Country:')
      expect(html).toContain('</select>')
      expect(html).toContain('<option')
      expect(html).toContain('USA')
      expect(html).toContain('Canada')
      expect(html).toContain('Mexico')
    })

    it('should render select without label', () => {
      const dsl = `screen Test:
  ___[][][[Red][Green][Blue]]`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const selectNode = ast.children![0].children![0]
      expect(selectNode.type).toBe('Select')

      const html = renderNode(selectNode)
      expect(html).toContain('Red')
      expect(html).toContain('Green')
      expect(html).toContain('Blue')
    })
  })
})
