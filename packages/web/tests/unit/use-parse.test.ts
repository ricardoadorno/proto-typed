import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('lucide', () => ({
  icons: {},
}))

import { ErrorBus } from '@proto-typed/core'
import { useParse } from '../../src/hooks/use-parse'

const SAMPLE_DSL = `
screen Home:
  # Dashboard
  @[Ir para detalhes](Details)

screen Details:
  # Detalhes
  @[Voltar](Home)
`

describe('useParse hook', () => {
  beforeEach(() => {
    ErrorBus.get().clear()
  })

  it('retorna estado limpo quando o input está vazio', async () => {
    const { result } = renderHook(() => useParse())

    await act(async () => {
      await result.current.handleParse('   ')
    })

    expect(result.current.ast).toEqual([])
    expect(result.current.astResultJson).toBe('')
    expect(result.current.renderedHtml).toBe('')
    expect(result.current.currentScreen).toBeNull()
    expect(result.current.metadata).toEqual({
      screens: [],
      components: [],
      modals: [],
      drawers: [],
      defaultScreen: undefined,
      currentScreen: undefined,
      totalRoutes: 0,
      navigationHistory: [],
      currentHistoryIndex: -1,
      canNavigateBack: false,
    })
    expect(result.current.error).toBeNull()
  })

  it('processa DSL válida em AST, HTML e metadata coerentes', async () => {
    const { result } = renderHook(() => useParse())

    await act(async () => {
      await result.current.handleParse(SAMPLE_DSL)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
    // AST is an AstNode object with wrapper Screen, not an array
    expect(result.current.ast).toBeDefined()
    expect(typeof result.current.ast).toBe('object')

    const metadata = result.current.metadata
    expect(metadata?.screens.map((screen) => screen.name)).toEqual([
      'Home',
      'Details',
    ])
    // The screens are parsed correctly
    expect(metadata?.screens.length).toBe(2)

    expect(result.current.renderedHtml).toContain(
      'data-preview-container="true"'
    )
    // Both screens should be in the HTML
    expect(result.current.renderedHtml).toContain('id="Home-screen"')
    expect(result.current.renderedHtml).toContain('id="Details-screen"')
    expect(result.current.renderedHtml).toContain('Ir para detalhes')

    const astJson = JSON.parse(result.current.astResultJson)
    expect(astJson).toBeDefined()
    expect(astJson.type).toBe('Screen')
    // The wrapper Screen contains children which are the actual screens
    expect(Array.isArray(astJson.children)).toBe(true)
    expect(astJson.children.length).toBeGreaterThan(0)
  })

  it('navega entre telas atualizando currentScreen e HTML renderizado', async () => {
    const { result } = renderHook(() => useParse())

    await act(async () => {
      await result.current.handleParse(SAMPLE_DSL)
    })

    await act(() => {
      result.current.navigateToScreen('Details')
    })

    expect(result.current.currentScreen).toBe('Details')
    // Screen ID format is {screenName}-screen
    expect(result.current.renderedHtml).toContain('id="Details-screen"')

    const metadata = result.current.metadata
    expect(metadata?.currentScreen).toBe('Details')
    expect(metadata?.navigationHistory).toContain('Details')
  })
})
