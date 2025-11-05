import { describe, it, expect, beforeEach } from 'vitest'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import { astToHtmlStringPreview } from '../../src/renderer/ast-to-html-string-preview'
import { astToHtmlDocument } from '../../src/renderer/ast-to-html-document'
import type { AstNode, AstWithErrors } from '../../src/types/ast-node'
import type { ProtoError } from '../../src/types/errors'

// Test helpers
interface ParseResult {
  ast: AstWithErrors
  errors: ProtoError[]
  hasErrors: boolean
  hasLexerErrors: boolean
  hasParserErrors: boolean
  hasBuilderErrors: boolean
}

/**
 * Helper to parse DSL input and extract error information
 */
function parseWithErrors(input: string, previousAst?: AstNode): ParseResult {
  const ast = parseAndBuildAst(input, previousAst)
  const errors = (ast.__errors || []) as ProtoError[]

  return {
    ast,
    errors,
    hasErrors: errors.length > 0,
    hasLexerErrors: errors.some((e) => e.stage === 'lexer'),
    hasParserErrors: errors.some((e) => e.stage === 'parser'),
    hasBuilderErrors: errors.some((e) => e.stage === 'builder'),
  }
}

/**
 * Helper to assert no parsing errors occurred
 */
function expectNoErrors(result: ParseResult): void {
  expect(result.hasErrors).toBe(false)
  expect(result.errors).toHaveLength(0)
}

/**
 * Helper to assert specific error types
 */
function expectErrors(
  result: ParseResult,
  options: {
    count?: number
    stage?: 'lexer' | 'parser' | 'builder'
    code?: string
  }
): void {
  expect(result.hasErrors).toBe(true)

  if (options.count !== undefined) {
    expect(result.errors).toHaveLength(options.count)
  } else {
    expect(result.errors.length).toBeGreaterThan(0)
  }

  if (options.stage) {
    const stageErrors = result.errors.filter((e) => e.stage === options.stage)
    expect(stageErrors.length).toBeGreaterThan(0)
  }

  if (options.code) {
    const codeErrors = result.errors.filter((e) => e.code === options.code)
    expect(codeErrors.length).toBeGreaterThan(0)
  }
}

/**
 * Helper to get typed props from AST node
 */
function getProps<T = any>(node: AstNode | undefined): T {
  return (node?.props || {}) as T
}

describe('Core Flow - Primitives', () => {
  describe('Button Primitives', () => {
    it('should parse and render default button (primary)', () => {
      const input = `
screen Home:
  @[Click Me](action)
`
      const result = parseWithErrors(input)
      expectNoErrors(result)

      expect(result.ast).toBeDefined()
      expect(result.ast.type).toBe('Root')

      // Find button node
      const screen = result.ast.children?.[0]
      expect(screen?.type).toBe('Screen')

      const button = screen?.children?.[0]
      expect(button?.type).toBe('Button')

      const props = getProps<{
        variant: string
        size: string
        label: string
        action: string
      }>(button)
      expect(props.variant).toBe('primary')
      expect(props.size).toBe('default')
      expect(props.label).toBe('Click Me')
      expect(props.action).toBe('action')
    })

    it('should parse button with variant', () => {
      const input = `
screen Home:
  @secondary[Submit](submit)
  @outline[Cancel](cancel)
  @ghost[Menu](menu)
  @destructive[Delete](delete)
  @link[Learn More](learn)
  @success[Save](save)
  @warning[Warning](warn)
`
      const result = parseWithErrors(input)
      expectNoErrors(result)

      const screen = result.ast.children?.[0]
      const buttons = screen?.children || []

      expect(getProps(buttons[0]).variant).toBe('secondary')
      expect(getProps(buttons[1]).variant).toBe('outline')
      expect(getProps(buttons[2]).variant).toBe('ghost')
      expect(getProps(buttons[3]).variant).toBe('destructive')
      expect(getProps(buttons[4]).variant).toBe('link')
      expect(getProps(buttons[5]).variant).toBe('success')
      expect(getProps(buttons[6]).variant).toBe('warning')
    })

    it('should parse button with size modifiers', () => {
      const input = `
screen Home:
  @-small[Compact](action)
  @-icon[Icon Only](action)
  @-large[Prominent](action)
`
      const result = parseWithErrors(input)
      expectNoErrors(result)

      const screen = result.ast.children?.[0]
      const buttons = screen?.children || []

      expect(getProps(buttons[0]).size).toBe('small')
      expect(getProps(buttons[1]).size).toBe('icon')
      expect(getProps(buttons[2]).size).toBe('large')
    })

    it('should parse button with variant and size', () => {
      const input = `
screen Home:
  @secondary-large[Submit](submit)
  @outline-small[Cancel](close)
  @destructive-icon[Delete](delete)
`
      const result = parseWithErrors(input)
      expectNoErrors(result)

      const screen = result.ast.children?.[0]
      const buttons = screen?.children || []

      expect(getProps(buttons[0]).variant).toBe('secondary')
      expect(getProps(buttons[0]).size).toBe('large')

      expect(getProps(buttons[1]).variant).toBe('outline')
      expect(getProps(buttons[1]).size).toBe('small')

      expect(getProps(buttons[2]).variant).toBe('destructive')
      expect(getProps(buttons[2]).size).toBe('icon')
    })

    it('should render button HTML correctly', () => {
      const input = `
screen Home:
  @secondary-large[Submit](submit)
`
      const result = parseWithErrors(input)
      const { html } = astToHtmlStringPreview(result.ast)

      expect(html).toContain('button')
      expect(html).toContain('Submit')
      expect(html).toContain('data-nav="submit"')
    })
  })

  describe('Typography Primitives', () => {
    it('should parse headings (h1-h6)', () => {
      const input = `
screen Home:
  # Heading 1
  ## Heading 2
  ### Heading 3
  #### Heading 4
  ##### Heading 5
  ###### Heading 6
`
      const result = parseWithErrors(input)
      expectNoErrors(result)

      const screen = result.ast.children?.[0]
      const headings = screen?.children || []

      expect(headings[0]?.type).toBe('Heading')
      expect(getProps(headings[0]).level).toBe(1)
      expect(getProps(headings[0]).text).toBe('Heading 1')

      expect(getProps(headings[1]).level).toBe(2)
      expect(getProps(headings[2]).level).toBe(3)
      expect(getProps(headings[3]).level).toBe(4)
      expect(getProps(headings[4]).level).toBe(5)
      expect(getProps(headings[5]).level).toBe(6)
    })

    it('should parse paragraph and text variants', () => {
      const input = `
screen Home:
  > This is a paragraph
  >> This is text
  >>> This is muted text
  *> This is a note
  "> This is a quote
`
      const result = parseWithErrors(input)
      expectNoErrors(result)

      const screen = result.ast.children?.[0]
      const texts = screen?.children || []

      expect(texts[0]?.type).toBe('Paragraph')
      expect(getProps(texts[0]).text).toBe('This is a paragraph')

      expect(texts[1]?.type).toBe('Text')
      expect(getProps(texts[1]).text).toBe('This is text')

      expect(texts[2]?.type).toBe('MutedText')
      expect(getProps(texts[2]).text).toBe('This is muted text')

      expect(texts[3]?.type).toBe('Note')
      expect(getProps(texts[3]).text).toBe('This is a note')

      expect(texts[4]?.type).toBe('Quote')
      expect(getProps(texts[4]).text).toBe('This is a quote')
    })

    it('should render typography HTML correctly', () => {
      const input = `
screen Home:
  # Main Title
  > Welcome to the app
  >>> Last updated today
`
      const result = parseWithErrors(input)
      const { html } = astToHtmlStringPreview(result.ast)

      expect(html).toContain('h1')
      expect(html).toContain('Main Title')
      expect(html).toContain('Welcome to the app')
    })
  })

  describe('Link and Image Primitives', () => {
    it('should parse links', () => {
      const input = `
screen Home:
  @link[Click here](https://example.com)
  @link[Go to Settings](Settings)
  @link[Back](-1)
`
      const result = parseWithErrors(input)
      expectNoErrors(result)

      const screen = result.ast.children?.[0]
      const links = screen?.children || []

      expect(links[0]?.type).toBe('Link')
      expect(getProps(links[0]).text).toBe('Click here')
      expect(getProps(links[0]).destination).toBe('https://example.com')

      expect(getProps(links[1]).text).toBe('Go to Settings')
      expect(getProps(links[1]).destination).toBe('Settings')

      expect(getProps(links[2]).text).toBe('Back')
      expect(getProps(links[2]).destination).toBe('-1')
    })

    it('should parse images', () => {
      const input = `
screen Home:
  ![Logo](https://example.com/logo.png)
  ![Avatar](/images/avatar.jpg)
`
      const result = parseWithErrors(input)
      expectNoErrors(result)

      const screen = result.ast.children?.[0]
      const images = screen?.children || []

      expect(images[0]?.type).toBe('Image')
      expect(getProps(images[0]).alt).toBe('Logo')
      expect(getProps(images[0]).src).toBe('https://example.com/logo.png')

      expect(getProps(images[1]).alt).toBe('Avatar')
      expect(getProps(images[1]).src).toBe('/images/avatar.jpg')
    })

    it('should parse image modifiers and dimensions', () => {
      const input = `
screen Home:
  !rounded[Header](https://example.com/header.png)
  !circle[Avatar](https://example.com/avatar.png)
  !circle-64x64[Icon](https://example.com/icon.png)
`
      const result = parseWithErrors(input)
      expectNoErrors(result)

      const screen = result.ast.children?.[0]
      const images = screen?.children || []

      expect(getProps(images[0]).shape).toBe('rounded')
      expect(getProps(images[0]).widthPx).toBeUndefined()
      expect(getProps(images[0]).heightPx).toBeUndefined()

      expect(getProps(images[1]).shape).toBe('circle')
      expect(getProps(images[1]).widthPx).toBeUndefined()
      expect(getProps(images[1]).heightPx).toBeUndefined()

      expect(getProps(images[2]).shape).toBe('circle')
      expect(getProps(images[2]).widthPx).toBe(64)
      expect(getProps(images[2]).heightPx).toBe(64)
    })

    it('should render links and images HTML correctly', () => {
      const input = `
screen Home:
  @link[Visit Site](https://example.com)
  ![Logo](logo.png)
`
      const result = parseWithErrors(input)
      const { html } = astToHtmlStringPreview(result.ast)

      expect(html).toContain('href')
      expect(html).toContain('Visit Site')
      expect(html).toContain('img')
      expect(html).toContain('alt="Logo"')
      expect(html).toContain('logo.png')
    })

    it('should render image modifiers in HTML output', () => {
      const input = `
screen Home:
  !rounded[Banners](banner.png)
  !circle-80x80[Avatar](avatar.png)
`
      const result = parseWithErrors(input)
      expectNoErrors(result)

      const { html } = astToHtmlStringPreview(result.ast)

      expect(html).toContain('rounded-[--radius]')
      expect(html).toContain('rounded-full')
      expect(html).toContain('width: 80px')
      expect(html).toContain('height: 80px')
    })
  })

  describe('Complete Screen Flow', () => {
    it('should parse and render a complete screen with mixed primitives', () => {
      const input = `
screen Dashboard:
  # Dashboard
  > Welcome back!
  >>> Last login: 2 hours ago
  
  @primary[View Profile](Profile)
  @outline-small[Settings](Settings)
  
  @link[Learn More](https://docs.example.com)
  ![Banner](banner.jpg)
`
      const result = parseWithErrors(input)
      expectNoErrors(result)

      expect(result.ast.type).toBe('Root')

      const screen = result.ast.children?.[0]
      expect(screen?.type).toBe('Screen')
      expect(getProps(screen).name).toBe('Dashboard')

      const children = screen?.children || []
      expect(children.length).toBeGreaterThan(0)

      // Verify different primitive types exist
      const types = children.map((c: AstNode) => c.type)
      expect(types).toContain('Heading')
      expect(types).toContain('Paragraph')
      expect(types).toContain('MutedText')
      expect(types).toContain('Button')
      expect(types).toContain('Link')
      expect(types).toContain('Image')
    })

    it('should render complete HTML document', () => {
      const input = `
screen Home:
  # Welcome
  > This is the home screen
  @[Get Started](Dashboard)
  
screen Dashboard:
  # Dashboard
  @ghost[Back](Home)
`
      const result = parseWithErrors(input)
      const html = astToHtmlDocument(result.ast)

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html')
      expect(html).toContain('Welcome')
      expect(html).toContain('Dashboard')
      expect(html).toContain('Tailwind')
    })
  })

  describe('Error Handling', () => {
    it('should collect lexer errors for invalid tokens', () => {
      const input = `
screen Home:
  $ invalid token
`
      const result = parseWithErrors(input)

      // Should have errors but still return a partial AST
      expectErrors(result, { stage: 'lexer' })
      expect(result.ast).toBeDefined()
    })

    it('should handle parser errors gracefully', () => {
      const input = `
screen
  # Missing colon
`
      const result = parseWithErrors(input)

      // Should have errors
      expect(result.hasErrors).toBe(true)
      expect(result.ast).toBeDefined()
    })

    it('should return render errors separately', () => {
      const input = `
screen Home:
  # Valid content
`
      const result = parseWithErrors(input)
      const { html, errors: renderErrors } = astToHtmlStringPreview(result.ast)

      expectNoErrors(result)
      expect(html).toBeDefined()
      expect(renderErrors).toBeDefined()
    })
  })

  describe('Deterministic IDs', () => {
    it('should generate stable IDs across parses', () => {
      const input = `
screen Home:
  # Title
  @[Click](action)
`
      const firstParse = parseWithErrors(input)
      const secondParse = parseWithErrors(input, firstParse.ast)

      // IDs should be the same when content doesn't change
      expect(firstParse.ast.id).toBe(secondParse.ast.id)

      const firstScreen = firstParse.ast.children?.[0]
      const secondScreen = secondParse.ast.children?.[0]
      expect(firstScreen?.id).toBe(secondScreen?.id)
    })

    it('should maintain ID stability during live editing', () => {
      const input1 = `
screen Home:
  # Title
  @[Button](action)
`
      const input2 = `
screen Home:
  # Title
  @[Button Updated](action)
`
      const firstParse = parseWithErrors(input1)
      const secondParse = parseWithErrors(input2, firstParse.ast)

      // Screen ID should remain stable
      const firstScreen = firstParse.ast.children?.[0]
      const secondScreen = secondParse.ast.children?.[0]
      expect(firstScreen?.id).toBe(secondScreen?.id)
    })
  })
})
