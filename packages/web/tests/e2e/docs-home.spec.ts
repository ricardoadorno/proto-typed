import { test, expect } from '@playwright/test'

import docSections from '../../src/utils/toc'

const highlightItems = [
  'Fluxo passo a passo para sair da ideia ao protótipo clicável.',
  'Playgrounds integrados e blocos de código com copy instantâneo.',
  'Guia de tokens, layouts e padrões visuais do proto-typed.',
]

test.describe('Docs Home', () => {
  test('hero CTA navega para o primeiro tópico da documentação', async ({
    page,
  }) => {
    await page.goto('/docs')

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Documentação enxuta/i,
      })
    ).toBeVisible()

    const primaryDoc = docSections[0]?.items[0]
    const primaryCta = page.getByRole('link', { name: 'Começar agora' })

    await expect(primaryCta).toBeVisible()

    if (primaryDoc) {
      const slugPattern = new RegExp(`/docs/${primaryDoc.slug}/?$`)
      await expect(primaryCta).toHaveAttribute(
        'href',
        expect.stringMatching(slugPattern)
      )
    }

    await primaryCta.click()

    if (primaryDoc) {
      const targetPattern = new RegExp(`/docs/${primaryDoc.slug}/?$`)
      await expect(page).toHaveURL(targetPattern)
      await expect(
        page.getByRole('heading', { name: primaryDoc.title })
      ).toBeVisible()
    }
  })

  test('cartão de destaques exibe os benefícios principais', async ({
    page,
  }) => {
    await page.goto('/docs')

    const heroSection = page.locator('main section').first()
    await expect(
      heroSection.getByRole('heading', { name: 'Destaques' })
    ).toBeVisible()

    for (const highlight of highlightItems) {
      await expect(heroSection.getByText(highlight)).toBeVisible()
    }
  })

  test('capítulos listam links e CTAs consistentes com o sumário', async ({
    page,
  }) => {
    await page.goto('/docs')

    await expect(
      page.getByRole('heading', { name: 'Explorar por capítulos' })
    ).toBeVisible()

    const sectionsWithItems = docSections.filter(
      (section) => section.items.length > 0
    )
    const firstTopicLinks = page.getByRole('link', {
      name: 'Abrir primeiro tópico',
    })

    await expect(firstTopicLinks).toHaveCount(sectionsWithItems.length)

    for (const [index, section] of sectionsWithItems.entries()) {
      await expect(
        page.getByRole('heading', { name: section.title })
      ).toBeVisible()

      const expectedCountLabel = `${section.items.length} tópico${
        section.items.length > 1 ? 's' : ''
      }`
      await expect(
        page.getByText(expectedCountLabel, { exact: true })
      ).toBeVisible()

      if (section.items[0]) {
        const slugPattern = new RegExp(`/docs/${section.items[0].slug}/?$`)
        await expect(firstTopicLinks.nth(index)).toHaveAttribute(
          'href',
          expect.stringMatching(slugPattern)
        )
      }

      for (const item of section.items.slice(0, 4)) {
        await expect(page.getByRole('link', { name: item.title })).toBeVisible()
      }
    }
  })
})
