import { describe, it, expect } from 'vitest'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { renderNode } from '../../src/renderer/core/node-renderer'
import type { AstNode } from '../../src/types/ast-node'
import { viewsFixtures } from './fixtures/views.fixtures'

/**
 * Views Domain Tests
 *
 * Tests syntax and rendering for view containers:
 * - Screen: Main view container
 * - Modal: Overlay modal dialog
 * - Drawer: Side drawer panel
 */

describe('Views Domain - Syntax Tests', () => {
  describe('Screen', () => {
    it('should render a basic screen with name', () => {
      const dsl = `screen Home:`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)
      expect(ast.children).toHaveLength(1)

      const screenNode = ast.children![0]
      expect(screenNode.type).toBe('Screen')
      expect(screenNode.props).toHaveProperty('name', 'Home')

      const html = renderNode(screenNode)
      expect(html).toContain('data-screen="Home"')
      expect(html).toContain('<div class=')
      expect(html).toContain('</div>')
    })

    it('should render a screen with nested content', () => {
      const dsl = `screen Dashboard:
  # Welcome
  > This is a dashboard`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const screenNode = ast.children![0]
      expect(screenNode.type).toBe('Screen')
      expect(screenNode.children).toHaveLength(2)

      const html = renderNode(screenNode)
      expect(html).toContain('data-screen="Dashboard"')
      expect(html).toContain('Welcome')
      expect(html).toContain('This is a dashboard')
    })
  })

  describe('Modal', () => {
    it('should render a basic modal with name', () => {
      const dsl = `modal Confirmation:`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)
      expect(ast.children).toHaveLength(1)

      const modalNode = ast.children![0]
      expect(modalNode.type).toBe('Modal')
      expect(modalNode.props).toHaveProperty('name', 'Confirmation')

      const html = renderNode(modalNode)
      expect(html).toContain('data-modal="Confirmation"')
      expect(html).toContain('id="modal-Confirmation"')
      expect(html).toContain('class="modal hidden"')
      expect(html).toContain('data-nav-type="toggle"')
    })

    it('should render a modal with content', () => {
      const dsl = `modal DeleteConfirm:
  # Are you sure?
  > This action cannot be undone
  @destructive[Delete](confirm)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const modalNode = ast.children![0]
      expect(modalNode.type).toBe('Modal')
      expect(modalNode.children).toHaveLength(3)

      const html = renderNode(modalNode)
      expect(html).toContain('Are you sure?')
      expect(html).toContain('This action cannot be undone')
      expect(html).toContain('Delete')
    })
  })

  describe('Drawer', () => {
    it('should render a basic drawer with name', () => {
      const dsl = `drawer Menu:`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)
      expect(ast.children).toHaveLength(1)

      const drawerNode = ast.children![0]
      expect(drawerNode.type).toBe('Drawer')
      expect(drawerNode.props).toHaveProperty('name', 'Menu')

      const html = renderNode(drawerNode)
      expect(html).toContain('data-drawer="Menu"')
      expect(html).toContain('id="drawer-Menu"')
      expect(html).toContain('class="drawer-container hidden"')
    })

    it('should render a drawer with navigation items', () => {
      const dsl = `drawer Navigation:
  # Menu
  @[Home](HomePage)
  @[Settings](SettingsPage)
  @[Logout](logout)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const drawerNode = ast.children![0]
      expect(drawerNode.type).toBe('Drawer')
      expect(drawerNode.children).toHaveLength(4)

      const html = renderNode(drawerNode)
      expect(html).toContain('Menu')
      expect(html).toContain('Home')
      expect(html).toContain('Settings')
      expect(html).toContain('Logout')
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

        // Snapshot the full AST structure
        const astSnapshot = {
          type: ast.type,
          children: ast.children?.map((node) => ({
            type: node.type,
            props: node.props,
            childrenTypes: node.children?.map((c) => c.type),
          })),
        }
        expect(astSnapshot).toMatchSnapshot('AST')

        // Snapshot each view node's rendered HTML output
        ast.children?.forEach((viewNode, index) => {
          const html = renderNode(viewNode)
          expect(html).toMatchSnapshot(`HTML-${viewNode.type}-${index}`)
        })
      })
    }

    describe('Screens', () => {
      testSnapshot('empty screen', viewsFixtures.screens.empty)
      testSnapshot('screen with title', viewsFixtures.screens.withTitle)
      testSnapshot('screen with content', viewsFixtures.screens.withContent)
      testSnapshot('complex screen', viewsFixtures.screens.complex)
      testSnapshot('multiple screens', viewsFixtures.screens.multiple)
    })

    describe('Modals', () => {
      testSnapshot('empty modal', viewsFixtures.modals.empty)
      testSnapshot('simple modal', viewsFixtures.modals.simple)
      testSnapshot('confirmation modal', viewsFixtures.modals.confirmation)
      testSnapshot('complex modal', viewsFixtures.modals.complex)
    })

    describe('Drawers', () => {
      testSnapshot('empty drawer', viewsFixtures.drawers.empty)
      testSnapshot('simple drawer', viewsFixtures.drawers.simple)
      testSnapshot('navigation drawer', viewsFixtures.drawers.navigation)
      testSnapshot('complex drawer', viewsFixtures.drawers.complex)
    })

    describe('Mixed Views', () => {
      testSnapshot('screen and modal', viewsFixtures.mixed.screenAndModal)
      testSnapshot('screen and drawer', viewsFixtures.mixed.screenAndDrawer)
      testSnapshot('all view types', viewsFixtures.mixed.all)
    })
  })
})
