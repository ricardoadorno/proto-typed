import { describe, it, expect } from 'vitest'
import { TYPO_CLASSES } from '../../src/renderer/nodes/primitives.node'
import type { TextKind } from '../../src/types/ast-node'

describe('Typography classes lint', () => {
  it('matches the approved shadcn/ui typography mapping', () => {
    const expected: Record<TextKind, string> = {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-[var(--fg-primary)]',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight text-[var(--fg-primary)]',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--fg-primary)]',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight text-[var(--fg-primary)]',
      p: 'text-base leading-7 text-[var(--fg-secondary)]',
      small: 'text-sm leading-6 text-[var(--fg-secondary)]',
      muted: 'text-sm leading-6 text-muted-foreground',
      blockquote: 'mt-6 border-l-2 pl-6 italic text-muted-foreground',
      note: 'text-sm text-[var(--fg-secondary)] rounded-lg border border-[var(--border-muted)] bg-[var(--bg-raised)] px-3 py-2',
    }

    expect(TYPO_CLASSES).toEqual(expected)
  })

  it('defines classes for every TextKind', () => {
    const keys = new Set(Object.keys(TYPO_CLASSES))
    const expectedKeys = new Set<TextKind>([
      'h1',
      'h2',
      'h3',
      'h4',
      'p',
      'small',
      'muted',
      'blockquote',
      'note',
    ])

    expect(keys).toEqual(expectedKeys)
  })
})
