import { describe, it, expect } from 'vitest'
import { renderNode, resetRenderErrors } from '../../src/renderer/core/node-renderer'
import { parseAndBuildAst } from '../../src/parser/parse-and-build-ast'
import type { AstNode, TextKind } from '../../src/types/ast-node'

describe('Typography Rendering Snapshots', () => {
  it('renders each typography kind with the expected markup', () => {
    const samples: Record<TextKind, string> = {
      h1: '# Snapshot H1',
      h2: '## Snapshot H2',
      h3: '### Snapshot H3',
      h4: '#### Snapshot H4',
      p: '> Snapshot paragraph',
      small: '>> Snapshot small',
      muted: '>>> Snapshot muted',
      blockquote: '*> Snapshot blockquote',
      note: '**> Snapshot note',
    }

    const rendered: Record<TextKind, string> = {} as Record<TextKind, string>

    for (const [kind, snippet] of Object.entries(samples) as [TextKind, string][]) {
      const input = `
screen Snapshot:
  ${snippet}
`

      const ast = parseAndBuildAst(input)
      const screen = ast.children?.[0]
      const textNode = screen?.children?.find((node) => node.type === 'Text') as AstNode | undefined

      expect(textNode?.kind).toBe(kind)
      if (!textNode) throw new Error(`Missing text node for kind ${kind}`)

      resetRenderErrors()
      rendered[kind] = renderNode(textNode)
    }

    expect(rendered).toMatchInlineSnapshot(`
      {
        "h1": "<h1 class=\"scroll-m-20 text-4xl font-extrabold tracking-tight text-[var(--fg-primary)]\">Snapshot H1</h1>",
        "h2": "<h2 class=\"scroll-m-20 text-3xl font-semibold tracking-tight text-[var(--fg-primary)]\">Snapshot H2</h2>",
        "h3": "<h3 class=\"scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--fg-primary)]\">Snapshot H3</h3>",
        "h4": "<h4 class=\"scroll-m-20 text-xl font-semibold tracking-tight text-[var(--fg-primary)]\">Snapshot H4</h4>",
        "p": "<p class=\"text-base leading-7 text-[var(--fg-secondary)]\">Snapshot paragraph</p>",
        "small": "<p class=\"text-sm leading-6 text-[var(--fg-secondary)]\">Snapshot small</p>",
        "muted": "<p class=\"text-sm leading-6 text-muted-foreground\">Snapshot muted</p>",
        "blockquote": "<blockquote class=\"mt-6 border-l-2 pl-6 italic text-muted-foreground\">Snapshot blockquote</blockquote>",
        "note": "<div class=\"text-sm text-[var(--fg-secondary)] rounded-lg border border-[var(--border-muted)] bg-[var(--bg-raised)] px-3 py-2\" role=\"note\">Snapshot note</div>",
      }
    `)
  })
})
