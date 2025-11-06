import { describe, it, expect } from 'vitest'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { renderNode } from '../../src/renderer/core/node-renderer'
import { layoutsFixtures } from './fixtures/layouts.fixtures'

/**
 * Layouts Domain Tests
 *
 * Tests syntax and rendering for layout elements using canonical presets:
 * - Containers: container, container-narrow, container-wide, container-full
 * - Stacks: stack, stack-tight, stack-loose, stack-none
 * - Rows: row, row-start, row-center, row-between, row-end
 * - Grids: grid, grid-2, grid-3, grid-4, grid-responsive
 * - Cards: card, card-compact, card-feature
 * - Special: header, sidebar, list, navigator, fab, separator
 */

describe('Layouts Domain - Syntax Tests', () => {
  describe('Container Layouts', () => {
    it('should render basic container', () => {
      const dsl = `screen Test:
  container:
    # Content`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.type).toBe('Layout')
      expect(layoutNode.props).toHaveProperty('layoutType', 'container')

      const html = renderNode(layoutNode)
      expect(html).toContain('<div')
      expect(html).toContain('container')
      expect(html).toContain('mx-auto')
      expect(html).toContain('max-w-4xl')
    })

    it('should render container-narrow', () => {
      const dsl = `screen Test:
  container-narrow:
    > Text`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'container-narrow')

      const html = renderNode(layoutNode)
      expect(html).toContain('max-w-2xl')
    })

    it('should render container-wide', () => {
      const dsl = `screen Test:
  container-wide:
    > Text`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'container-wide')

      const html = renderNode(layoutNode)
      expect(html).toContain('max-w-6xl')
    })

    it('should render container-full', () => {
      const dsl = `screen Test:
  container-full:
    > Text`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'container-full')

      const html = renderNode(layoutNode)
      expect(html).toContain('w-full')
    })
  })

  describe('Stack Layouts', () => {
    it('should render basic stack', () => {
      const dsl = `screen Test:
  stack:
    > Item 1
    > Item 2`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.type).toBe('Layout')
      expect(layoutNode.props).toHaveProperty('layoutType', 'stack')

      const html = renderNode(layoutNode)
      expect(html).toContain('flex flex-col')
      expect(html).toContain('gap-6')
    })

    it('should render stack-tight', () => {
      const dsl = `screen Test:
  stack-tight:
    > Item 1`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'stack-tight')

      const html = renderNode(layoutNode)
      expect(html).toContain('gap-3')
    })

    it('should render stack-loose', () => {
      const dsl = `screen Test:
  stack-loose:
    > Item 1`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'stack-loose')

      const html = renderNode(layoutNode)
      expect(html).toContain('gap-8')
    })

    it('should render stack-none', () => {
      const dsl = `screen Test:
  stack-none:
    > Item 1`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'stack-none')

      const html = renderNode(layoutNode)
      expect(html).toContain('gap-0')
    })
  })

  describe('Row Layouts', () => {
    it('should render basic row', () => {
      const dsl = `screen Test:
  row:
    @[Button 1](action1)
    @[Button 2](action2)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.type).toBe('Layout')
      expect(layoutNode.props).toHaveProperty('layoutType', 'row')

      const html = renderNode(layoutNode)
      expect(html).toContain('flex flex-row')
      expect(html).toContain('items-center')
      expect(html).toContain('gap-6')
    })

    it('should render row-center', () => {
      const dsl = `screen Test:
  row-center:
    @[Click](action)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'row-center')

      const html = renderNode(layoutNode)
      expect(html).toContain('justify-center')
    })

    it('should render row-between', () => {
      const dsl = `screen Test:
  row-between:
    @[Left](left)
    @[Right](right)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'row-between')

      const html = renderNode(layoutNode)
      expect(html).toContain('justify-between')
    })

    it('should render row-start', () => {
      const dsl = `screen Test:
  row-start:
    > Text`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'row-start')

      const html = renderNode(layoutNode)
      expect(html).toContain('items-start')
    })

    it('should render row-end', () => {
      const dsl = `screen Test:
  row-end:
    > Text`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'row-end')

      const html = renderNode(layoutNode)
      expect(html).toContain('justify-end')
    })
  })

  describe('Grid Layouts', () => {
    it('should render basic grid', () => {
      const dsl = `screen Test:
  grid:
    > Item 1
    > Item 2`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.type).toBe('Layout')
      expect(layoutNode.props).toHaveProperty('layoutType', 'grid')

      const html = renderNode(layoutNode)
      expect(html).toContain('grid')
      expect(html).toContain('grid-cols-1')
    })

    it('should render grid-2', () => {
      const dsl = `screen Test:
  grid-2:
    > Col 1
    > Col 2`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'grid-2')

      const html = renderNode(layoutNode)
      expect(html).toContain('md:grid-cols-2')
    })

    it('should render grid-3', () => {
      const dsl = `screen Test:
  grid-3:
    > Col 1`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'grid-3')

      const html = renderNode(layoutNode)
      expect(html).toContain('md:grid-cols-3')
    })

    it('should render grid-4', () => {
      const dsl = `screen Test:
  grid-4:
    > Col 1`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'grid-4')

      const html = renderNode(layoutNode)
      expect(html).toContain('lg:grid-cols-4')
    })

    it('should render grid-responsive', () => {
      const dsl = `screen Test:
  grid-responsive:
    > Auto Col`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'grid-responsive')

      const html = renderNode(layoutNode)
      expect(html).toContain('auto-fit')
    })
  })

  describe('Card Layouts', () => {
    it('should render basic card', () => {
      const dsl = `screen Test:
  card:
    # Card Title
    > Card content`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.type).toBe('Layout')
      expect(layoutNode.props).toHaveProperty('layoutType', 'card')

      const html = renderNode(layoutNode)
      expect(html).toContain('border')
      expect(html).toContain('rounded-lg')
      expect(html).toContain('p-6')
      expect(html).toContain('var(--card)')
    })

    it('should render card-compact', () => {
      const dsl = `screen Test:
  card-compact:
    > Compact card`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'card-compact')

      const html = renderNode(layoutNode)
      expect(html).toContain('p-4')
    })

    it('should render card-feature', () => {
      const dsl = `screen Test:
  card-feature:
    # Feature Card`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'card-feature')

      const html = renderNode(layoutNode)
      expect(html).toContain('border-2')
      expect(html).toContain('rounded-xl')
      expect(html).toContain('shadow-lg')
      expect(html).toContain('p-8')
    })
  })

  describe('Special Layouts', () => {
    it('should render header', () => {
      const dsl = `screen Test:
  header:
    # App Title`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.type).toBe('Layout')
      expect(layoutNode.props).toHaveProperty('layoutType', 'header')

      const html = renderNode(layoutNode)
      expect(html).toContain('<header')
      expect(html).toContain('sticky top-0')
      expect(html).toContain('border-b')
      expect(html).toContain('</header>')
    })

    it('should render sidebar', () => {
      const dsl = `screen Test:
  sidebar:
    @[Nav Item](page)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'sidebar')

      const html = renderNode(layoutNode)
      expect(html).toContain('<nav')
      expect(html).toContain('fixed')
      expect(html).toContain('border-r')
      expect(html).toContain('</nav>')
    })
  })

  describe('List and Items', () => {
    it('should render list with items', () => {
      const dsl = `screen Test:
  - First item
  - Second item
  - Third item`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const firstItem = ast.children![0].children![0]
      expect(firstItem.type).toBe('UnorderedListItem')

      const html = renderNode(ast.children![0])
      expect(html).toContain('First item')
      expect(html).toContain('Second item')
      expect(html).toContain('Third item')
      expect(html).toContain('<li')
    })

    it('should render list items with text', () => {
      const dsl = `screen Test:
  - Single item`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const itemNode = ast.children![0].children![0]
      expect(itemNode.type).toBe('UnorderedListItem')

      const html = renderNode(itemNode)
      expect(html).toContain('<li')
      expect(html).toContain('Single item')
      expect(html).toContain('</li>')
    })
  })

  describe('Separator', () => {
    it('should render separator', () => {
      const dsl = `screen Test:
  > Before
  ---
  > After`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const separatorNode = ast.children![0].children![1]
      expect(separatorNode.type).toBe('Separator')

      const html = renderNode(separatorNode)
      expect(html).toContain('<hr')
    })
  })

  describe('FAB (Floating Action Button)', () => {
    it('should render fab with default icon', () => {
      const dsl = `screen Test:
  fab:`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const fabNode = ast.children![0].children![0]
      expect(fabNode.type).toBe('Fab')

      const html = renderNode(fabNode)
      expect(html).toContain('<button')
      expect(html).toContain('rounded-full')
      expect(html).toContain('var(--primary)')
    })

    it('should render fab with custom icon', () => {
      const dsl = `screen Test:
  fab:`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const fabNode = ast.children![0].children![0]
      expect(fabNode.type).toBe('Fab')
    })
  })

  describe('Navigator (Bottom Navigation)', () => {
    it('should render navigator with items', () => {
      const dsl = `screen Test:
  navigator:
    - home|Home
    - search|Search
    - profile|Profile`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const navigatorNode = ast.children![0].children![0]
      expect(navigatorNode.type).toBe('Navigator')
      expect(navigatorNode.children).toHaveLength(3)

      const html = renderNode(navigatorNode)
      expect(html).toContain('<nav')
      expect(html).toContain('Home')
      expect(html).toContain('Search')
      expect(html).toContain('Profile')
    })
  })

  describe('Layer/Position Layouts', () => {
    it('should render layer-relative', () => {
      const dsl = `screen Test:
  layer-relative:
    > Content`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'layer-relative')

      const html = renderNode(layoutNode)
      expect(html).toContain('relative')
    })

    it('should render layer-absolute', () => {
      const dsl = `screen Test:
  layer-absolute:
    > Content`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'layer-absolute')

      const html = renderNode(layoutNode)
      expect(html).toContain('absolute')
      expect(html).toContain('inset-0')
    })

    it('should render layer-fixed', () => {
      const dsl = `screen Test:
  layer-fixed:
    > Content`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'layer-fixed')

      const html = renderNode(layoutNode)
      expect(html).toContain('fixed')
    })

    it('should render layer-sticky', () => {
      const dsl = `screen Test:
  layer-sticky:
    > Content`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'layer-sticky')

      const html = renderNode(layoutNode)
      expect(html).toContain('sticky')
      expect(html).toContain('top-0')
    })
  })

  describe('Scroll Layouts', () => {
    it('should render scroll-auto', () => {
      const dsl = `screen Test:
  scroll-auto:
    > Content`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'scroll-auto')

      const html = renderNode(layoutNode)
      expect(html).toContain('overflow-auto')
    })

    it('should render scroll-x', () => {
      const dsl = `screen Test:
  scroll-x:
    > Content`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'scroll-x')

      const html = renderNode(layoutNode)
      expect(html).toContain('overflow-x-auto')
    })

    it('should render scroll-y', () => {
      const dsl = `screen Test:
  scroll-y:
    > Content`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const layoutNode = ast.children![0].children![0]
      expect(layoutNode.props).toHaveProperty('layoutType', 'scroll-y')

      const html = renderNode(layoutNode)
      expect(html).toContain('overflow-y-auto')
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

        // Snapshot the AST structure (types and props only, no internal IDs)
        const astSnapshot = {
          type: ast.type,
          children: ast.children?.map((node) => ({
            type: node.type,
            props: node.props,
            childrenTypes: node.children?.map((c) => c.type),
          })),
        }
        expect(astSnapshot).toMatchSnapshot('AST')

        // Snapshot the rendered HTML output
        const screenNode = ast.children![0]
        const html = renderNode(screenNode)
        expect(html).toMatchSnapshot('HTML')
      })
    }

    describe('Containers', () => {
      testSnapshot('basic container', layoutsFixtures.containers.basic)
      testSnapshot('narrow container', layoutsFixtures.containers.narrow)
      testSnapshot('wide container', layoutsFixtures.containers.wide)
      testSnapshot('full container', layoutsFixtures.containers.full)
      testSnapshot('nested containers', layoutsFixtures.containers.nested)
    })

    describe('Stacks', () => {
      testSnapshot('basic stack', layoutsFixtures.stacks.basic)
      testSnapshot('tight stack', layoutsFixtures.stacks.tight)
      testSnapshot('loose stack', layoutsFixtures.stacks.loose)
      testSnapshot('stack with no gap', layoutsFixtures.stacks.none)
      testSnapshot('nested stacks', layoutsFixtures.stacks.nested)
    })

    describe('Rows', () => {
      testSnapshot('basic row', layoutsFixtures.rows.basic)
      testSnapshot('centered row', layoutsFixtures.rows.center)
      testSnapshot('space-between row', layoutsFixtures.rows.between)
      testSnapshot('start-aligned row', layoutsFixtures.rows.start)
      testSnapshot('end-aligned row', layoutsFixtures.rows.end)
      testSnapshot('complex row layout', layoutsFixtures.rows.complex)
    })

    describe('Grids', () => {
      testSnapshot('basic grid', layoutsFixtures.grids.basic)
      testSnapshot('2-column grid', layoutsFixtures.grids.twoColumn)
      testSnapshot('3-column grid', layoutsFixtures.grids.threeColumn)
      testSnapshot('4-column grid', layoutsFixtures.grids.fourColumn)
      testSnapshot('responsive grid', layoutsFixtures.grids.responsive)
      testSnapshot('nested grid', layoutsFixtures.grids.nested)
    })

    describe('Cards', () => {
      testSnapshot('basic card', layoutsFixtures.cards.basic)
      testSnapshot('compact card', layoutsFixtures.cards.compact)
      testSnapshot('feature card', layoutsFixtures.cards.feature)
      testSnapshot('multiple cards', layoutsFixtures.cards.multiple)
    })

    describe('Special Layouts', () => {
      testSnapshot('header', layoutsFixtures.special.header)
      testSnapshot('sidebar', layoutsFixtures.special.sidebar)
      testSnapshot('separator', layoutsFixtures.special.separator)
      testSnapshot('fab', layoutsFixtures.special.fab)
      testSnapshot('fab with icon', layoutsFixtures.special.fabWithIcon)
      testSnapshot('navigator', layoutsFixtures.special.navigator)
    })

    describe('Lists', () => {
      testSnapshot('simple list', layoutsFixtures.lists.simple)
      testSnapshot('standalone items', layoutsFixtures.lists.standalone)
      testSnapshot('nested list', layoutsFixtures.lists.nested)
    })

    describe('Layers', () => {
      testSnapshot('relative layer', layoutsFixtures.layers.relative)
      testSnapshot('absolute layer', layoutsFixtures.layers.absolute)
      testSnapshot('fixed layer', layoutsFixtures.layers.fixed)
      testSnapshot('sticky layer', layoutsFixtures.layers.sticky)
    })

    describe('Scroll', () => {
      testSnapshot('auto scroll', layoutsFixtures.scroll.auto)
      testSnapshot('horizontal scroll', layoutsFixtures.scroll.horizontal)
      testSnapshot('vertical scroll', layoutsFixtures.scroll.vertical)
    })
  })
})
