import { describe, it, expect, beforeEach } from 'vitest'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { renderNode } from '../../src/renderer/core/node-renderer'
import { setComponentDefinitions } from '../../src/renderer/nodes/components.node'
import type { AstNode } from '../../src/types/ast-node'
import { componentsFixtures } from './fixtures/components.fixtures'

/**
 * Components Domain Tests
 *
 * Tests syntax and rendering for component system:
 * - Component: Reusable component definitions with props
 * - ComponentInstance: Component instantiation with prop values
 * - PropVariable: Property placeholders in component templates
 * - List with components: Rendering lists using component templates
 */

describe('Components Domain - Syntax Tests', () => {
  beforeEach(() => {
    // Reset component definitions before each test
    setComponentDefinitions([])
  })

  describe('Component Definition', () => {
    it('should parse component definition', () => {
      const dsl = `component UserCard:
  card:
    # User Name
    > Email: user@example.com`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)
      expect(ast.children).toHaveLength(1)

      const componentNode = ast.children![0]
      expect(componentNode.type).toBe('Component')
      expect(componentNode.props).toHaveProperty('name', 'UserCard')
      expect(componentNode.children).toHaveLength(1) // card layout

      // Component definitions don't render directly
      const html = renderNode(componentNode)
      expect(html).toBe('')
    })

    it('should parse component with prop placeholders', () => {
      const dsl = `component ProfileCard:
  card:
    ## $name
    > Email: $email
    >> $role`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const componentNode = ast.children![0]
      expect(componentNode.type).toBe('Component')
      expect(componentNode.children).toBeDefined()
    })

    it('should parse component with multiple elements', () => {
      const dsl = `component ProductCard:
  card:
    ### $title
    > Price: $price
    >> $description
    @[Buy Now](buy)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const componentNode = ast.children![0]
      const cardLayout = componentNode.children![0]
      expect(cardLayout.children).toHaveLength(4) // title, price, description, button
    })
  })

  describe('Component Instance', () => {
    it('should render component instance with props', () => {
      const dsl = `component Greeting:
  # Hello, $name!
  > Welcome to our app

screen Home:
  $Greeting: John`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      // Set component definitions for rendering
      const componentNodes = ast.children!.filter((n) => n.type === 'Component')
      setComponentDefinitions(componentNodes)

      const screenNode = ast.children!.find((n) => n.type === 'Screen')
      const instanceNode = screenNode!.children![0]

      expect(instanceNode.type).toBe('ComponentInstance')
      expect(instanceNode.props).toHaveProperty('componentName', 'Greeting')

      const html = renderNode(instanceNode)
      expect(html).toContain('Hello, John!')
      expect(html).toContain('Welcome to our app')
      expect(html).toContain('data-component="Greeting"')
    })

    it('should render component instance with multiple props', () => {
      const dsl = `component UserInfo:
  ## $name
  > Email: $email

screen Profile:
  list $UserInfo:
    - Alice | alice@example.com`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const componentNodes = ast.children!.filter((n) => n.type === 'Component')
      setComponentDefinitions(componentNodes)

      const screenNode = ast.children!.find((n) => n.type === 'Screen')
      const listNode = screenNode!.children![0]

      const html = renderNode(listNode)
      expect(html).toContain('Alice')
      expect(html).toContain('alice@example.com')
    })

    it('should render component instance within layout', () => {
      const dsl = `component Badge:
  > $label

screen Test:
  stack:
    $Badge: New
    $Badge: Featured
    $Badge: Sale`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const componentNodes = ast.children!.filter((n) => n.type === 'Component')
      setComponentDefinitions(componentNodes)

      const screenNode = ast.children!.find((n) => n.type === 'Screen')
      const stackLayout = screenNode!.children![0]
      expect(stackLayout.children).toHaveLength(3) // 3 component instances

      const html = renderNode(stackLayout)
      expect(html).toContain('New')
      expect(html).toContain('Featured')
      expect(html).toContain('Sale')
    })
  })

  describe('List with Components', () => {
    it('should render list with component template', () => {
      const dsl = `component UserCard:
  card:
    ## $name
    > Email: $email

screen Users:
  list $UserCard:
    - John|john@example.com
    - Jane|jane@example.com
    - Bob|bob@example.com`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const componentNodes = ast.children!.filter((n) => n.type === 'Component')
      setComponentDefinitions(componentNodes)

      const screenNode = ast.children!.find((n) => n.type === 'Screen')
      const listNode = screenNode!.children![0]

      expect(listNode.type).toBe('List')
      expect(listNode.children).toHaveLength(3)

      const html = renderNode(listNode)
      expect(html).toContain('John')
      expect(html).toContain('john@example.com')
      expect(html).toContain('Jane')
      expect(html).toContain('jane@example.com')
      expect(html).toContain('Bob')
      expect(html).toContain('bob@example.com')
    })

    it('should render complex list with component template', () => {
      const dsl = `component ProductCard:
  card:
    ### $title
    > Price: $price
    >> $category
    @[Add to Cart](cart)

screen Products:
  list $ProductCard:
    - Laptop|$999|Electronics
    - Desk|$299|Furniture
    - Chair|$149|Furniture`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const componentNodes = ast.children!.filter((n) => n.type === 'Component')
      setComponentDefinitions(componentNodes)

      const screenNode = ast.children!.find((n) => n.type === 'Screen')
      const listNode = screenNode!.children![0]

      const html = renderNode(listNode)
      expect(html).toContain('Laptop')
      expect(html).toContain('$999')
      expect(html).toContain('Electronics')
      expect(html).toContain('Desk')
      expect(html).toContain('$299')
      expect(html).toContain('Furniture')
      expect(html).toContain('Add to Cart')
    })
  })

  describe('Component Prop Substitution', () => {
    it('should substitute props in text content', () => {
      const dsl = `component Message:
  > Hello $name, your code is $code

screen Test:
  list $Message:
    - Alice | ABC123`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const componentNodes = ast.children!.filter((n) => n.type === 'Component')
      setComponentDefinitions(componentNodes)

      const screenNode = ast.children!.find((n) => n.type === 'Screen')
      const listNode = screenNode!.children![0]

      const html = renderNode(listNode)
      expect(html).toContain('Hello Alice, your code is ABC123')
    })

    it('should substitute props in button actions', () => {
      const dsl = `component ActionCard:
  card:
    # $title
    @[Click](action-$id)

screen Test:
  list $ActionCard:
    - My Action | 123`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const componentNodes = ast.children!.filter((n) => n.type === 'Component')
      setComponentDefinitions(componentNodes)

      const screenNode = ast.children!.find((n) => n.type === 'Screen')
      const listNode = screenNode!.children![0]

      const html = renderNode(listNode)
      expect(html).toContain('My Action')
      expect(html).toContain('action-123')
    })

    it('should handle missing props gracefully', () => {
      const dsl = `component Template:
  > Name: $name
  > Email: $email

screen Test:
  $Template: OnlyName`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const componentNodes = ast.children!.filter((n) => n.type === 'Component')
      setComponentDefinitions(componentNodes)

      const screenNode = ast.children!.find((n) => n.type === 'Screen')
      const instanceNode = screenNode!.children![0]

      const html = renderNode(instanceNode)
      expect(html).toContain('OnlyName')
      // $email should remain or be replaced with empty string
    })
  })

  describe('Nested Component Scenarios', () => {
    it('should render component with nested layouts', () => {
      const dsl = `component ComplexCard:
  card:
    stack:
      ## $title

screen Test:
  list $ComplexCard:
    - Stats | Users | 1234`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const componentNodes = ast.children!.filter((n) => n.type === 'Component')
      setComponentDefinitions(componentNodes)

      const screenNode = ast.children!.find((n) => n.type === 'Screen')
      const listNode = screenNode!.children![0]

      const html = renderNode(listNode)
      expect(html).toContain('Stats')
    })

    it('should handle component not found', () => {
      const dsl = `screen Test:
  $NonExistent: data`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      setComponentDefinitions([]) // No components defined

      const screenNode = ast.children![0]
      const instanceNode = screenNode.children![0]

      const html = renderNode(instanceNode)
      expect(html).toContain('Component not found')
      expect(html).toContain('NonExistent')
    })
  })

  describe('Multiple Components', () => {
    it('should handle multiple component definitions and instances', () => {
      const dsl = `component Header:
  # $title

component Footer:
  >> $copyright

screen Test:
  $Header: Welcome
  > Content here
  $Footer: Copyright`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const componentNodes = ast.children!.filter((n) => n.type === 'Component')
      expect(componentNodes).toHaveLength(2)
      setComponentDefinitions(componentNodes)

      const screenNode = ast.children!.find((n) => n.type === 'Screen')
      expect(screenNode!.children).toHaveLength(3) // header instance, text, footer instance

      const html = renderNode(screenNode!)
      expect(html).toContain('Welcome')
      expect(html).toContain('Content here')
      expect(html).toContain('Copyright')
    })
  })

  describe('Snapshot Tests', () => {
    /**
     * Helper function to test DSL parsing and rendering with snapshots.
     * Captures both AST structure and rendered HTML output.
     */
    function testSnapshot(name: string, dsl: string) {
      it(name, () => {
        const ast = parseAndBuildAst(dsl)
        expect(ast.__errors).toHaveLength(0)

        // Extract and set component definitions for rendering
        const componentNodes = ast.children!.filter((n) => n.type === 'Component')
        setComponentDefinitions(componentNodes)

        // Snapshot the AST structure
        const astSnapshot = {
          type: ast.type,
          children: ast.children?.map((node) => ({
            type: node.type,
            props: node.props,
            childrenTypes: node.children?.map((c) => c.type),
          })),
        }
        expect(astSnapshot).toMatchSnapshot('AST')

        // Snapshot rendered HTML for non-component nodes (screens, etc.)
        const renderableNodes = ast.children!.filter((n) => n.type !== 'Component')
        renderableNodes.forEach((node, index) => {
          const html = renderNode(node)
          expect(html).toMatchSnapshot(`HTML-${node.type}-${index}`)
        })
      })
    }

    describe('Component Definitions', () => {
      testSnapshot('simple definition', componentsFixtures.definitions.simple)
      testSnapshot('definition with props', componentsFixtures.definitions.withProps)
      testSnapshot('complex definition', componentsFixtures.definitions.complex)
      testSnapshot('nested definition', componentsFixtures.definitions.nested)
    })

    describe('Component Instances', () => {
      testSnapshot('simple instance', componentsFixtures.instances.simple)
      testSnapshot('instance with multiple props', componentsFixtures.instances.multipleProps)
      testSnapshot('multiple instances', componentsFixtures.instances.multiple)
      testSnapshot('instance in layout', componentsFixtures.instances.inLayout)
    })

    describe('Lists with Components', () => {
      testSnapshot('simple component list', componentsFixtures.lists.simple)
      testSnapshot('complex component list', componentsFixtures.lists.complex)
      testSnapshot('nested component list', componentsFixtures.lists.nested)
    })

    describe('Prop Substitution', () => {
      testSnapshot('props in text', componentsFixtures.propSubstitution.inText)
      testSnapshot('props in action', componentsFixtures.propSubstitution.inAction)
      testSnapshot('multiple props', componentsFixtures.propSubstitution.multiple)
    })

    describe('Multiple Components', () => {
      testSnapshot(
        'header and footer components',
        componentsFixtures.multipleComponents.headerAndFooter
      )
      testSnapshot('component library', componentsFixtures.multipleComponents.library)
    })

    describe('Edge Cases', () => {
      testSnapshot('component not found', componentsFixtures.edge.notFound)
      testSnapshot('missing props', componentsFixtures.edge.missingProps)
      testSnapshot('empty props', componentsFixtures.edge.emptyProps)
    })
  })
})
