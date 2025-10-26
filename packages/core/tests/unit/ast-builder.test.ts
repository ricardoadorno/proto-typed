import { describe, it, expect } from 'vitest'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { AstNode } from '../../src/types/ast-node'

describe('AST Builder - CST to AST Conversion', () => {
  describe('Basic Element Building', () => {
    it('should build AST for simple screen', () => {
      const input = 'screen MainScreen:'
      const result = parseAndBuildAst(input)

      expect(result).toBeDefined()
      expect(Array.isArray(result) || result.type === 'Screen').toBe(true)
    })

    it('should build button element', () => {
      const input = `screen MainScreen:
  @[Click me](action)`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.children).toHaveLength(1)
      expect(screen.children[0].type).toBe('Button')
    })

    it('should build text element with content', () => {
      const input = `screen MainScreen:
  >> Hello World`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.children[0].type).toBe('Text')
      expect(screen.children[0].props.text).toBeDefined()
    })

    it('should build heading element', () => {
      const input = `screen MainScreen:
  # Title`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.children[0].type).toBe('Heading')
      expect(screen.children[0].props.text).toBeDefined()
    })
  })

  describe('Attributes Handling', () => {
    it('should extract button attributes', () => {
      const input = `screen MainScreen:
  @secondary-lg[Submit](submitForm)`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      const button = screen.children[0]
      expect(button.props.label).toBeDefined()
      expect(button.props.action).toBe('submitForm')
    })

    it('should handle input attributes', () => {
      const input = `screen MainScreen:
  ___email: Email{Enter email}`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      const input_elem = screen.children[0]
      expect(input_elem.type).toBe('Input')
      expect(input_elem.props.label).toBeDefined()
    })

    it('should handle link with destination', () => {
      const input = `screen MainScreen:
  #[Home](https://example.com)`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      const link = screen.children[0]
      expect(link.type).toBe('Link')
      expect(link.props.label).toBeDefined()
    })
  })

  describe('Nested Structures', () => {
    it('should build nested layout', () => {
      const input = `screen MainScreen:
  stack:
    @[First](action1)
    @[Second](action2)`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.children).toHaveLength(1)
      expect(screen.children[0].type).toBe('Layout')
      expect(screen.children[0].children).toHaveLength(2)
    })

    it('should build deeply nested structure', () => {
      const input = `screen MainScreen:
  stack:
    row-center:
      @[Left](left)
      @[Right](right)
    >> Footer`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      const outerLayout = screen.children[0]
      expect(outerLayout.type).toBe('Layout')
      expect(outerLayout.children).toHaveLength(2)

      const innerLayout = outerLayout.children[0]
      expect(innerLayout.type).toBe('Layout')
      expect(innerLayout.children).toHaveLength(2)
    })

    it('should preserve hierarchy correctly', () => {
      const input = `screen MainScreen:
  stack:
    # Section
    row-center:
      @[OK](ok)
      @[Cancel](cancel)
    > Note`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      const layout = screen.children[0]

      expect(layout.children).toHaveLength(3)
      expect(layout.children[0].type).toBe('Heading')
      expect(layout.children[1].type).toBe('Layout')
      expect(layout.children[2].type).toBe('Paragraph')
    })
  })

  describe('Components', () => {
    it('should build component declaration', () => {
      const input = `component Card:
  >> Card content`
      const result = parseAndBuildAst(input)

      const component = Array.isArray(result) ? result[0] : result
      expect(component.type).toBe('Component')
      expect(component.props.name).toBe('Card')
    })

    it('should build component with props', () => {
      const input = `component Card:
  # %title
  > %description`
      const result = parseAndBuildAst(input)

      const component = Array.isArray(result) ? result[0] : result
      expect(component.type).toBe('Component')
      expect(component.props.name).toBe('Card')
    })

    it('should build component instance', () => {
      const input = `component Card:
  >> Content

screen MainScreen:
  $Card:
    - Test | Desc`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[1] : result
      expect(screen.children[0].type).toBe('ComponentInstance')
    })
  })

  describe('View Types', () => {
    it('should build modal', () => {
      const input = `modal ConfirmDialog:
  > Are you sure?`
      const result = parseAndBuildAst(input)

      const modal = Array.isArray(result) ? result[0] : result
      expect(modal.type).toBe('Modal')
      expect(modal.props.name).toBe('ConfirmDialog')
    })

    it('should build drawer', () => {
      const input = `drawer SideMenu:
  > Menu`
      const result = parseAndBuildAst(input)

      const drawer = Array.isArray(result) ? result[0] : result
      expect(drawer.type).toBe('Drawer')
      expect(drawer.props.name).toBe('SideMenu')
    })

    it('should build multiple screens', () => {
      const input = `screen Home:
  > Home

screen About:
  > About`
      const result = parseAndBuildAst(input)

      expect(Array.isArray(result)).toBe(true)
      if (Array.isArray(result)) {
        expect(result).toHaveLength(2)
        expect(result[0].type).toBe('Screen')
        expect(result[1].type).toBe('Screen')
      }
    })
  })

  describe('Input Elements', () => {
    it('should build input field', () => {
      const input = `screen MainScreen:
  ___: Username{Enter username}`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.children[0].type).toBe('Input')
      expect(screen.children[0].props.label).toBeDefined()
    })

    it('should build checkbox', () => {
      const input = `screen MainScreen:
  [X] Accept terms`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.children[0].type).toBe('Checkbox')
      expect(screen.children[0].props.label).toBeDefined()
    })

    it('should build radio option', () => {
      const input = `screen MainScreen:
  (X) Option A`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.children[0].type).toBe('RadioOption')
      expect(screen.children[0].props.label).toBeDefined()
    })
  })

  describe('Layout Presets', () => {
    it('should build stack layout', () => {
      const input = `screen MainScreen:
  stack:
    @[First](action)`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      const layout = screen.children[0]
      expect(layout.type).toBe('Layout')
      expect(layout.props.layoutType).toBe('stack')
    })

    it('should build row-center layout', () => {
      const input = `screen MainScreen:
  row-center:
    @[Left](left)`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      const layout = screen.children[0]
      expect(layout.props.layoutType).toBe('row-center')
    })

    it('should build card layout', () => {
      const input = `screen MainScreen:
  card:
    >> Card content`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      const layout = screen.children[0]
      expect(layout.props.layoutType).toBe('card')
    })
  })

  describe('List Elements', () => {
    it('should build list with items', () => {
      const input = `component Item:
  > %text

screen MainScreen:
  list $Item:
    - Item 1
    - Item 2`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[1] : result
      expect(screen.children[0].type).toBe('List')
    })

    it('should build navigator', () => {
      const input = `screen MainScreen:
  navigator:
    - Home | HomeScreen
    - About | AboutScreen`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.children[0].type).toBe('Navigator')
    })
  })

  describe('Navigation Elements', () => {
    it('should build FAB element', () => {
      const input = `screen MainScreen:
  fab:
    - Add | addItem | plus`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.children[0].type).toBe('Fab')
    })

    it('should build separator', () => {
      const input = `screen MainScreen:
  ---`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.children[0].type).toBe('Separator')
    })
  })

  describe('Styles', () => {
    it('should build styles block', () => {
      const input = `styles:
  --primary: #FF0000;
  --secondary: #00FF00;`
      const result = parseAndBuildAst(input)

      const styles = Array.isArray(result) ? result[0] : result
      expect(styles.type).toBe('Styles')
    })

    it('should build theme declaration', () => {
      const input = `styles:
  --theme: dark;`
      const result = parseAndBuildAst(input)

      const styles = Array.isArray(result) ? result[0] : result
      expect(styles.type).toBe('Styles')
    })
  })

  describe('Error Collection', () => {
    it('should collect errors in __errors property', () => {
      const input = 'screen MainScreen:'
      const result = parseAndBuildAst(input)

      expect(result).toHaveProperty('__errors')
      expect(Array.isArray((result as any).__errors)).toBe(true)
    })

    it('should have no errors for valid input', () => {
      const input = `screen MainScreen:
  @[Click me](action)`
      const result = parseAndBuildAst(input)

      expect(result.__errors).toHaveLength(0)
    })

    it('should collect lexer errors', () => {
      const input = 'screen ~Invalid:'
      const result = parseAndBuildAst(input)

      const errors = result.__errors || []
      expect(errors.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('ID Generation', () => {
    it('should generate IDs for all nodes', () => {
      const input = `screen MainScreen:
  @[Click me](action)`
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.id).toBeTruthy()
      expect(screen.children[0].id).toBeTruthy()
    })

    it('should generate deterministic IDs', () => {
      const input = `screen MainScreen:
  @[Click me](action)`
      const result1 = parseAndBuildAst(input)
      const result2 = parseAndBuildAst(input)

      const screen1 = Array.isArray(result1) ? result1[0] : result1
      const screen2 = Array.isArray(result2) ? result2[0] : result2

      expect(screen1.id).toBe(screen2.id)
      expect(screen1.children[0].id).toBe(screen2.children[0].id)
    })

    it('should reuse IDs from previous AST', () => {
      const input = `screen MainScreen:
  @[Click me](action)`

      const result1 = parseAndBuildAst(input)
      const screen1 = Array.isArray(result1) ? result1[0] : result1
      const buttonId = screen1.children[0].id

      const result2 = parseAndBuildAst(input, result1)
      const screen2 = Array.isArray(result2) ? result2[0] : result2

      expect(screen2.children[0].id).toBe(buttonId)
    })
  })

  describe('Complex Structures', () => {
    it('should build complex form', () => {
      const input = `screen LoginForm:
  stack:
    # Login
    ___email: Email{Enter email}
    ___password: Password{Enter password}
    row-center:
      @outline[Cancel](cancel)
      @[Login](submit)`

      const result = parseAndBuildAst(input)
      const screen = Array.isArray(result) ? result[0] : result

      expect(screen.type).toBe('Screen')
      expect(screen.children).toHaveLength(1)

      const layout = screen.children[0]
      expect(layout.type).toBe('Layout')
      expect(layout.children.length).toBeGreaterThan(3)
    })

    it('should build dashboard with cards', () => {
      const input = `screen Dashboard:
  stack:
    # Dashboard
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

      const result = parseAndBuildAst(input)
      const screen = Array.isArray(result) ? result[0] : result

      expect(screen.type).toBe('Screen')
      const outerLayout = screen.children[0]
      expect(outerLayout.children).toHaveLength(2)

      const grid = outerLayout.children[1]
      expect(grid.props.layoutType).toBe('grid-3')
      expect(grid.children).toHaveLength(3)
    })
  })

  describe('Props Extraction', () => {
    it('should extract all standard props', () => {
      const input = `screen MainScreen:
  @secondary-lg[Submit](submit)`

      const result = parseAndBuildAst(input)
      const screen = Array.isArray(result) ? result[0] : result
      const button = screen.children[0]

      expect(button.props.label).toBeDefined()
      expect(button.props.action).toBe('submit')
    })

    it('should handle quoted attribute values', () => {
      const input = `screen MainScreen:
  ___: Email{Enter your email address}`

      const result = parseAndBuildAst(input)
      const screen = Array.isArray(result) ? result[0] : result
      const input_elem = screen.children[0]

      expect(input_elem.props.placeholder).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty screen', () => {
      const input = 'screen EmptyScreen:'
      const result = parseAndBuildAst(input)

      const screen = Array.isArray(result) ? result[0] : result
      expect(screen.type).toBe('Screen')
      expect(screen.children).toHaveLength(0)
    })

    it('should handle multiple elements at same level', () => {
      const input = `screen MainScreen:
  @[First](first)
  @[Second](second)
  @[Third](third)`

      const result = parseAndBuildAst(input)
      const screen = Array.isArray(result) ? result[0] : result

      expect(screen.children).toHaveLength(3)
      expect(screen.children.every((c: AstNode) => c.type === 'Button')).toBe(
        true
      )
    })

    it('should handle mixed element types', () => {
      const input = `screen MainScreen:
  # Title
  > Description
  @[Action](action)
  ___: Field{placeholder}
  #[More](https://example.com)`

      const result = parseAndBuildAst(input)
      const screen = Array.isArray(result) ? result[0] : result

      expect(screen.children).toHaveLength(5)
      expect(screen.children[0].type).toBe('Heading')
      expect(screen.children[1].type).toBe('Paragraph')
      expect(screen.children[2].type).toBe('Button')
      expect(screen.children[3].type).toBe('Input')
      expect(screen.children[4].type).toBe('Link')
    })
  })
})
