import { describe, it, expect } from 'vitest'

import { slugify, extractText } from '../../src/utils/slugify'
import docSections, { flatDocs, findDocBySlug } from '../../src/utils/toc'

describe('packages/web utils', () => {
  describe('slugify', () => {
    it('normalizes diacritics and whitespace', () => {
      expect(slugify('  Tela de Pré-Visualização ')).toBe(
        'tela-de-pre-visualizacao'
      )
    })

    it('strips unsupported characters', () => {
      expect(slugify('Deploy @ version #1!')).toBe('deploy-version-1')
    })
  })

  describe('extractText', () => {
    it('returns empty string for nullish values', () => {
      expect(extractText(null)).toBe('')
      expect(extractText(undefined)).toBe('')
    })

    it('handles primitives, arrays and nested children', () => {
      const reactLikeNode = {
        props: {
          children: [
            'Início » ',
            {
              props: { children: ['Editor', 2] },
            },
          ],
        },
      }

      expect(extractText(reactLikeNode)).toBe('Início » Editor2')
    })
  })

  describe('findDocBySlug', () => {
    it('returns the matching doc metadata when it exists', () => {
      const slugUnderTest = docSections[0]?.items[0]?.slug
      const doc = slugUnderTest ? findDocBySlug(slugUnderTest) : undefined

      expect(doc).toBeDefined()
      expect(doc?.slug).toBe(slugUnderTest)
      expect(flatDocs.some((item) => item.slug === slugUnderTest)).toBe(true)
    })

    it('returns undefined when the slug does not exist', () => {
      expect(findDocBySlug('unknown-slug')).toBeUndefined()
    })
  })
})
