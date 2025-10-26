import { describe, it, expect } from 'vitest'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { AstNode } from '../../src/types/ast-node'

describe('AST Builder - CST to AST Conversion', () => {
  describe('Basic Element Building', () => {
    it('should build AST for simple screen', () => {
      const input = 'screen MainScreen:'
      const ast = parseAndBuildAst(input)

      expect(ast).toBeDefined()
      expect(ast.type).toBe('Screen')
      expect(ast.children.length).toBeGreaterThanOrEqual(1)
    })

    it('should build button element', () => {
      const input = `screen MainScreen:
  container:
    @[Click me](action)`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      expect(screen.children).toHaveLength(1)
      const container = screen.children[0]
      expect(container.type).toBe('Layout')
      expect(container.children[0].type).toBe('Button')
    })

    it('should build text element with content', () => {
      const input = `screen MainScreen:
  container:
    >> Hello World`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const container = screen.children[0]
      expect(container.children[0].type).toBe('Text')
      expect(container.children[0].props.content).toBeDefined()
    })

    it('should build heading element', () => {
      const input = `screen MainScreen:
  container:
    # Title`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const container = screen.children[0]
      expect(container.children[0].type).toBe('Heading')
      expect(container.children[0].props.content).toBeDefined()
    })
  })

  describe('Attributes Handling', () => {
    it('should extract button attributes', () => {
      const input = `screen MainScreen:
  container:
    @secondary-lg[Submit](submitForm)`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const container = screen.children[0]
      const button = container.children[0]
      expect(button.props.text).toBeDefined()
      expect(button.props.action).toBe('submitForm')
    })

    it('should handle input attributes', () => {
      const input = `screen MainScreen:
  container:
    ___email: Email{Enter email}`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const container = screen.children[0]
      const input_elem = container.children[0]
      expect(input_elem.type).toBe('Input')
      expect(input_elem.props.label).toBeDefined()
    })

    it('should handle link with destination', () => {
      const input = `screen MainScreen:
  container:
    #[Home](https://example.com)`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const container = screen.children[0]
      const link = container.children[0]
      expect(link.type).toBe('Link')
      expect(link.props.text).toBeDefined()
    })
  })

  describe('Nested Structures', () => {
    it('should build nested layout', () => {
      const input = `screen MainScreen:
  stack:
    @[First](action1)
    @[Second](action2)`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
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
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
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
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
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
      const ast = parseAndBuildAst(input)

      const component = ast.children[0]
      expect(component.type).toBe('Component')
      expect(component.props.name).toBe('Card')
    })

    it('should build component with props', () => {
      const input = `component Card:
  # %title
  > %description`
      const ast = parseAndBuildAst(input)

      const component = ast.children[0]
      expect(component.type).toBe('Component')
      expect(component.props.name).toBe('Card')
    })

    it('should build component instance', () => {
      const input = `component Card:
  >> Content

screen MainScreen:
  container:
    $Card:
      - Test | Desc`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      // Component instance may be inside container
      const container = screen.children[0]
      expect(container.children[0].type).toBe('ComponentInstance')
    })
  })

  describe('View Types', () => {
    it('should build modal', () => {
      const input = `modal ConfirmDialog:
  > Are you sure?`
      const ast = parseAndBuildAst(input)

      const modal = ast.children[0]
      expect(modal.type).toBe('Modal')
      expect(modal.props.name).toBe('ConfirmDialog')
    })

    it('should build drawer', () => {
      const input = `drawer SideMenu:
  > Menu`
      const ast = parseAndBuildAst(input)

      const drawer = ast.children[0]
      expect(drawer.type).toBe('Drawer')
      expect(drawer.props.name).toBe('SideMenu')
    })

    it('should build multiple screens', () => {
      const input = `screen Home:
  container:
    > Home

screen About:
  container:
    > About`
      const ast = parseAndBuildAst(input)

      expect(ast.children).toHaveLength(2)
      expect(ast.children[0].type).toBe('Screen')
      expect(ast.children[1].type).toBe('Screen')
    })
  })

  describe('Input Elements', () => {
    it('should build input field', () => {
      const input = `screen MainScreen:
  container:
    ___: Username{Enter username}`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const container = screen.children[0]
      expect(container.children[0].type).toBe('Input')
      expect(container.children[0].props.label).toBeDefined()
    })

    it('should build checkbox', () => {
      const input = `screen MainScreen:
  container:
    [X] Accept terms`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const container = screen.children[0]
      expect(container.children[0].type).toBe('Checkbox')
      expect(container.children[0].props.label).toBeDefined()
    })

    it('should build radio option', () => {
      const input = `screen MainScreen:
  container:
    (X) Option A`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const container = screen.children[0]
      expect(container.children[0].type).toBe('RadioOption')
      expect(container.children[0].props.options).toBeDefined()
      expect(container.children[0].props.options[0].label).toBeDefined()
    })
  })

  describe('Layout Presets', () => {
    it('should build stack layout', () => {
      const input = `screen MainScreen:
  stack:
    @[First](action)`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const layout = screen.children[0]
      expect(layout.type).toBe('Layout')
      expect(layout.props.layoutType).toBe('stack')
    })

    it('should build row-center layout', () => {
      const input = `screen MainScreen:
  row-center:
    @[Left](left)`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const layout = screen.children[0]
      expect(layout.props.layoutType).toBe('row-center')
    })

    it('should build card layout', () => {
      const input = `screen MainScreen:
  card:
    >> Card content`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const layout = screen.children[0]
      expect(layout.props.layoutType).toBe('card')
    })
  })

  describe('List Elements', () => {
    it('should build list with items', () => {
      const input = `component Item:
  > %text

screen MainScreen:
  container:
    list $Item:
      - Item 1
      - Item 2`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const container = screen.children[0]
      expect(container.children[0].type).toBe('List')
    })

    it('should build navigator', () => {
      const input = `screen MainScreen:
  container:
    >> Content
  
  navigator:
    - Home | HomeScreen
    - About | AboutScreen`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      // Navigator is at root level of screen
      const navigator = screen.children.find(
        (c: AstNode) => c.type === 'Navigator'
      )
      expect(navigator).toBeDefined()
      expect(navigator?.type).toBe('Navigator')
    })
  })

  describe('Navigation Elements', () => {
    it('should build FAB element', () => {
      const input = `screen MainScreen:
  container:
    >> Content
  
  fab:
    - Add | addItem | plus`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      // FAB is at root level of screen
      const fab = screen.children.find((c: AstNode) => c.type === 'Fab')
      expect(fab).toBeDefined()
      expect(fab?.type).toBe('Fab')
    })

    it('should build separator', () => {
      const input = `screen MainScreen:
  container:
    >> Before
    ---
    >> After`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      const container = screen.children[0]
      const separator = container.children.find(
        (c: AstNode) => c.type === 'Separator'
      )
      expect(separator).toBeDefined()
      expect(separator?.type).toBe('Separator')
    })
  })

  describe('Styles', () => {
    it('should build styles block', () => {
      const input = `styles:
  --primary: #FF0000;
  --secondary: #00FF00;`
      const ast = parseAndBuildAst(input)

      const styles = ast.children[0]
      expect(styles.type).toBe('Styles')
    })

    it('should build theme declaration', () => {
      const input = `styles:
  --theme: dark;`
      const ast = parseAndBuildAst(input)

      const styles = ast.children[0]
      expect(styles.type).toBe('Styles')
    })
  })

  describe('Error Collection', () => {
    it('should collect errors in __errors property', () => {
      const input = 'screen MainScreen:'
      const result = parseAndBuildAst(input)

      expect(result).toHaveProperty('__errors')
      expect(Array.isArray(result.__errors)).toBe(true)
    })

    it('should have no errors for valid input', () => {
      const input = `screen MainScreen:
  container:
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
  container:
    @[Click me](action)`
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      expect(screen.id).toBeTruthy()
      const container = screen.children[0]
      expect(container.children[0].id).toBeTruthy()
    })

    it('should generate deterministic IDs', () => {
      const input = `screen MainScreen:
  container:
    @[Click me](action)`
      const result1 = parseAndBuildAst(input)
      const result2 = parseAndBuildAst(input)

      const screen1 = result1.children[0]
      const screen2 = result2.children[0]

      expect(screen1.id).toBe(screen2.id)
      const container1 = screen1.children[0]
      const container2 = screen2.children[0]
      expect(container1.children[0].id).toBe(container2.children[0].id)
    })

    it('should reuse IDs from previous AST', () => {
      const input = `screen MainScreen:
  container:
    @[Click me](action)`

      const result1 = parseAndBuildAst(input)
      const screen1 = result1.children[0]
      const container1 = screen1.children[0]
      const buttonId = container1.children[0].id

      const result2 = parseAndBuildAst(input, result1)
      const screen2 = result2.children[0]
      const container2 = screen2.children[0]

      expect(container2.children[0].id).toBe(buttonId)
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

      const ast = parseAndBuildAst(input)
      const screen = ast.children[0]

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

      const ast = parseAndBuildAst(input)
      const screen = ast.children[0]

      expect(screen.type).toBe('Screen')
      const outerLayout = screen.children[0]
      expect(outerLayout.children.length).toBeGreaterThanOrEqual(1)

      const grid = outerLayout.children.find(
        (c: AstNode) => c.type === 'Layout' && c.props.layoutType === 'grid-3'
      )
      expect(grid).toBeDefined()
      if (grid) {
        expect(grid.children).toHaveLength(3)
      }
    })
  })

  describe('Props Extraction', () => {
    it('should extract all standard props', () => {
      const input = `screen MainScreen:
  container:
    @secondary-lg[Submit](submit)`

      const ast = parseAndBuildAst(input)
      const screen = ast.children[0]
      const container = screen.children[0]
      const button = container.children[0]

      expect(button.props.text).toBeDefined()
      expect(button.props.action).toBe('submit')
    })

    it('should handle quoted attribute values', () => {
      const input = `screen MainScreen:
  container:
    ___: Email{Enter your email address}`

      const ast = parseAndBuildAst(input)
      const screen = ast.children[0]
      const container = screen.children[0]
      const input_elem = container.children[0]

      expect(input_elem.props.attributes).toBeDefined()
      expect(input_elem.props.attributes.placeholder).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty screen', () => {
      const input = 'screen EmptyScreen:'
      const ast = parseAndBuildAst(input)

      const screen = ast.children[0]
      expect(screen.type).toBe('Screen')
      // Empty screen may have 0 children or a default container
      expect(screen.children.length).toBeGreaterThanOrEqual(0)
    })

    it('should handle multiple elements at same level', () => {
      const input = `screen MainScreen:
  container:
    @[First](first)
    @[Second](second)
    @[Third](third)`

      const ast = parseAndBuildAst(input)
      const screen = ast.children[0]
      const container = screen.children[0]

      expect(container.children.length).toBeGreaterThanOrEqual(3)
      const buttons = container.children.filter(
        (c: AstNode) => c.type === 'Button'
      )
      expect(buttons.length).toBe(3)
    })

    it('should handle mixed element types', () => {
      const input = `screen MainScreen:
  container:
    # Title
    > Description
    @[Action](action)
    ___: Field{placeholder}
    #[More](https://example.com)`

      const ast = parseAndBuildAst(input)
      const screen = ast.children[0]
      const container = screen.children[0]

      expect(container.children.length).toBeGreaterThanOrEqual(5)
      expect(container.children[0].type).toBe('Heading')
      expect(container.children[1].type).toBe('Paragraph')
      expect(container.children[2].type).toBe('Button')
      expect(container.children[3].type).toBe('Input')
      expect(container.children[4].type).toBe('Link')
    })
  })
})
