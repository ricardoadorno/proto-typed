import { describe, it, expect } from 'vitest'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { renderNode } from '../../src/renderer/core/node-renderer'
import type { ProtoError } from '../../src/types/errors'

/**
 * Primitives Domain Tests
 *
 * Tests syntax and rendering for primitive elements:
 * - Button: Interactive button with variants and sizes
 * - Inline links rendered in text content
 * - Image: Image with optional shape modifiers
 * - Text: Typography elements (Heading, Paragraph, Small, Muted, Blockquote, Note)
 */

describe('Primitives Domain - Syntax Tests', () => {
  describe('Button', () => {
    it('should render a basic button with default variant (primary)', () => {
      const dsl = `screen Test:
  @[Click Me](action)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const screenNode = ast.children![0]
      const buttonNode = screenNode.children![0]
      expect(buttonNode.type).toBe('Button')
      expect(buttonNode.props).toHaveProperty('text', 'Click Me')
      expect(buttonNode.props).toHaveProperty('action', 'action')

      const html = renderNode(buttonNode)
      expect(html).toContain('<button')
      expect(html).toContain('Click Me')
      expect(html).toContain('</button>')
    })

    it('should render button with secondary variant', () => {
      const dsl = `screen Test:
  @secondary[Submit](submit)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const buttonNode = ast.children![0].children![0]
      expect(buttonNode.props).toHaveProperty('variant', 'secondary')
      expect(buttonNode.props).toHaveProperty('text', 'Submit')

      const html = renderNode(buttonNode)
      expect(html).toContain('Submit')
    })

    it('should render button with destructive variant', () => {
      const dsl = `screen Test:
  @destructive[Delete](delete)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const buttonNode = ast.children![0].children![0]
      expect(buttonNode.props).toHaveProperty('variant', 'destructive')
      expect(buttonNode.props).toHaveProperty('text', 'Delete')
    })

    it('should render button with outline variant', () => {
      const dsl = `screen Test:
  @outline[Cancel](cancel)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const buttonNode = ast.children![0].children![0]
      expect(buttonNode.props).toHaveProperty('variant', 'outline')
    })

    it('should render button with ghost variant', () => {
      const dsl = `screen Test:
  @ghost[Menu](menu)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const buttonNode = ast.children![0].children![0]
      expect(buttonNode.props).toHaveProperty('variant', 'ghost')
    })

    it('should render button with size modifier', () => {
      const dsl = `screen Test:
  @secondary-large[Big Button](action)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const buttonNode = ast.children![0].children![0]
      expect(buttonNode.props).toHaveProperty('variant', 'secondary')
      expect(buttonNode.props).toHaveProperty('size', 'large')
    })

    it('should render button with navigation action', () => {
      const dsl = `screen Test:
  @[Go to Settings](SettingsScreen)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const buttonNode = ast.children![0].children![0]
      expect(buttonNode.props).toHaveProperty('action', 'SettingsScreen')

      const html = renderNode(buttonNode)
      expect(html).toContain('data-nav="SettingsScreen"')
    })
  })

  describe('Inline links', () => {
    it('renders Markdown link inside paragraph text', () => {
      const dsl = `screen Test:
  > Read the [documentation](Docs) for more details.`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      expect(textNode.type).toBe('Text')
      const html = renderNode(textNode)
      expect(html).toContain('<a')
      expect(html).toContain('href="#Docs"')
      expect(html).toContain('documentation')
    })

    it('renders external links with absolute href', () => {
      const dsl = `screen Test:
  > Visit [Proto-Typed](https://proto-typed.dev)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      const html = renderNode(textNode)
      expect(html).toContain('href="https://proto-typed.dev"')
      expect(html).toContain('Proto-Typed')
    })

    it('does not mix icon tokens inside link labels', () => {
      const dsl = `screen Test:
  > Mixed [i-zap Help](Support) example`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      const html = renderNode(textNode)
      const anchorStart = html.indexOf('<a')
      expect(anchorStart).toBeGreaterThan(-1)
      const anchorEnd = html.indexOf('</a>', anchorStart)
      const anchorContent = html.slice(anchorStart, anchorEnd)
      expect(anchorContent).not.toContain('<svg')
      expect(anchorContent).toContain('i-zap Help')
    })

    it('emits a warning for deprecated @link syntax and converts output', () => {
      const dsl = `screen Test:
  @link[Legacy Docs](Docs)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(1)
      const [warning] = ast.__errors as ProtoError[]
      expect(warning.severity).toBe('warning')
      expect(warning.code).toBe('PT-DSL-5001')

      const textNode = ast.children![0].children![0]
      expect(textNode.type).toBe('Text')
      const html = renderNode(textNode)
      expect(html).toContain('href="#Docs"')
      expect(html).toContain('Legacy Docs')
    })
  })

  describe('Image', () => {
    it('should render a basic image', () => {
      const dsl = `screen Test:
  ![Logo](logo.png)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const imageNode = ast.children![0].children![0]
      expect(imageNode.type).toBe('Image')
      expect(imageNode.props).toHaveProperty('alt', 'Logo')
      expect(imageNode.props).toHaveProperty('src', 'logo.png')

      const html = renderNode(imageNode)
      expect(html).toContain('<img')
      expect(html).toContain('src="logo.png"')
      expect(html).toContain('alt="Logo"')
    })

    it('should render a rounded image', () => {
      const dsl = `screen Test:
  !rounded[Avatar](avatar.jpg)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const imageNode = ast.children![0].children![0]
      expect(imageNode.props).toHaveProperty('shape', 'rounded')

      const html = renderNode(imageNode)
      expect(html).toContain('src="avatar.jpg"')
    })

    it('should render a circle image', () => {
      const dsl = `screen Test:
  !circle[Profile](profile.jpg)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const imageNode = ast.children![0].children![0]
      expect(imageNode.props).toHaveProperty('shape', 'circle')

      const html = renderNode(imageNode)
      expect(html).toContain('src="profile.jpg"')
    })

    it('should render a circle image with dimensions', () => {
      const dsl = `screen Test:
  !circle-64x64[Avatar](user.jpg)`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const imageNode = ast.children![0].children![0]
      expect(imageNode.props).toHaveProperty('shape', 'circle')
      expect(imageNode.props).toHaveProperty('widthPx', 64)
      expect(imageNode.props).toHaveProperty('heightPx', 64)

      const html = renderNode(imageNode)
      expect(html).toContain('width: 64px')
      expect(html).toContain('height: 64px')
    })
  })

  describe('Text - Headings', () => {
    it('should render h1 heading', () => {
      const dsl = `screen Test:
  # Main Title`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      expect(textNode.type).toBe('Text')
      expect(textNode.props).toHaveProperty('kind', 'h1')
      expect(textNode.props).toHaveProperty('value', 'Main Title')

      const html = renderNode(textNode)
      expect(html).toContain('<h1')
      expect(html).toContain('Main Title')
      expect(html).toContain('</h1>')
    })

    it('should render h2 heading', () => {
      const dsl = `screen Test:
  ## Section Title`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      expect(textNode.props).toHaveProperty('kind', 'h2')

      const html = renderNode(textNode)
      expect(html).toContain('<h2')
      expect(html).toContain('Section Title')
      expect(html).toContain('</h2>')
    })

    it('should render h3 heading', () => {
      const dsl = `screen Test:
  ### Subsection`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      expect(textNode.props).toHaveProperty('kind', 'h3')

      const html = renderNode(textNode)
      expect(html).toContain('<h3')
    })

    it('should render h4 heading', () => {
      const dsl = `screen Test:
  #### Small Heading`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      expect(textNode.props).toHaveProperty('kind', 'h4')

      const html = renderNode(textNode)
      expect(html).toContain('<h4')
    })
  })

  describe('Text - Paragraph variants', () => {
    it('should render paragraph', () => {
      const dsl = `screen Test:
  > This is a paragraph`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      expect(textNode.type).toBe('Text')
      expect(textNode.props).toHaveProperty('kind', 'p')
      expect(textNode.props).toHaveProperty('value', 'This is a paragraph')

      const html = renderNode(textNode)
      expect(html).toContain('<p')
      expect(html).toContain('This is a paragraph')
      expect(html).toContain('</p>')
    })

    it('should render small text', () => {
      const dsl = `screen Test:
  >> Small text here`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      expect(textNode.props).toHaveProperty('kind', 'small')

      const html = renderNode(textNode)
      expect(html).toContain('Small text here')
    })

    it('should render muted text', () => {
      const dsl = `screen Test:
  >>> Muted text here`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      expect(textNode.props).toHaveProperty('kind', 'muted')

      const html = renderNode(textNode)
      expect(html).toContain('Muted text here')
    })

    it('should render blockquote', () => {
      const dsl = `screen Test:
  *> This is a quote`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      expect(textNode.props).toHaveProperty('kind', 'blockquote')

      const html = renderNode(textNode)
      expect(html).toContain('<blockquote')
      expect(html).toContain('This is a quote')
      expect(html).toContain('</blockquote>')
    })

    it('should render note', () => {
      const dsl = `screen Test:
  **> Important note`

      const ast = parseAndBuildAst(dsl)
      expect(ast.__errors).toHaveLength(0)

      const textNode = ast.children![0].children![0]
      expect(textNode.props).toHaveProperty('kind', 'note')

      const html = renderNode(textNode)
      expect(html).toContain('role="note"')
      expect(html).toContain('Important note')
    })
  })
})
