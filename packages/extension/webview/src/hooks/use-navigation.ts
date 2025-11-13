import { useEffect } from 'react'

interface NavigationOptions {
  currentScreen: string | null
  onNavigate: (target: string) => void
}

/**
 * Hook que gerencia navegação via cliques em elementos [data-nav]
 * Oculta/mostra telas baseado em currentScreen
 */
export function useNavigation({
  currentScreen,
  onNavigate,
}: NavigationOptions) {
  // Efeito 1: Controlar visibilidade de telas
  useEffect(() => {
    if (!currentScreen) return

    // Ocultar todas as telas
    const allScreens = document.querySelectorAll('[data-screen]')
    allScreens.forEach((screen) => {
      ;(screen as HTMLElement).style.display = 'none'
    })

    // Mostrar apenas a tela atual
    const activeScreen = document.querySelector(
      `[data-screen="${currentScreen}"]`
    )
    if (activeScreen) {
      ;(activeScreen as HTMLElement).style.display = 'block'
    }

    console.log(`📍 [Navigation] Active screen: ${currentScreen}`)
  }, [currentScreen])

  // Efeito 2: Interceptar cliques em elementos de navegação
  useEffect(() => {
    const handleNavigationClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      // Buscar elemento navegável (pode estar em elemento pai)
      let element: HTMLElement | null = target
      const maxDepth = 5
      let depth = 0

      while (element && depth < maxDepth) {
        // Sistema primário: data-nav + data-nav-type
        const navValue = element.getAttribute('data-nav')
        const navType = element.getAttribute('data-nav-type')

        if (navValue) {
          event.preventDefault()
          event.stopPropagation()

          switch (navType) {
            case 'internal':
              handleInternalNavigation(navValue, onNavigate)
              break
            case 'toggle':
              handleToggle(navValue)
              break
            case 'back':
              handleBack()
              break
            case 'close':
              closeAllOverlays()
              break
            case 'external':
              window.open(navValue, '_blank', 'noopener,noreferrer')
              break
            case 'action':
              console.log(`🎯 [Navigation] Action: ${navValue}`)
              break
            default:
              console.warn(`⚠️ [Navigation] Unknown navType: ${navType}`)
          }
          return
        }

        element = element.parentElement
        depth++
      }
    }

    document.body.addEventListener('click', handleNavigationClick, true)

    return () => {
      document.body.removeEventListener('click', handleNavigationClick, true)
    }
  }, [onNavigate])

  // Efeito 3: Listener para overlay clicks (fechar drawers/modals)
  useEffect(() => {
    const handleOverlayClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      // Fechar drawer ao clicar no overlay
      if (target.classList.contains('drawer-overlay')) {
        const container = target.closest('[id^="drawer-"]')
        if (container) {
          const aside = container.querySelector('aside')
          if (aside) {
            aside.classList.remove('translate-x-0')
            aside.classList.add('-translate-x-full')
            setTimeout(() => container.classList.add('hidden'), 250)
          } else {
            container.classList.add('hidden')
          }
        }
      }

      // Fechar modal ao clicar APENAS no backdrop (não no conteúdo)
      if (
        target.classList.contains('modal-backdrop') &&
        event.target === target
      ) {
        const modal = target.closest('[id^="modal-"]')
        if (modal) {
          modal.classList.add('hidden')
          console.log('🔒 [Navigation] Closed modal by clicking backdrop')
        }
      }
    }

    document.body.addEventListener('click', handleOverlayClick, true)

    return () => {
      document.body.removeEventListener('click', handleOverlayClick, true)
    }
  }, [])
}

/**
 * Funções de navegação
 */

function closeAllOverlays(): void {
  const overlays = document.querySelectorAll('[id^="modal-"], [id^="drawer-"]')
  overlays.forEach((overlay) => {
    if (overlay.id.startsWith('drawer-')) {
      const aside = overlay.querySelector('aside')
      if (aside) {
        aside.classList.remove('translate-x-0')
        aside.classList.add('-translate-x-full')
        setTimeout(() => overlay.classList.add('hidden'), 250)
      } else {
        overlay.classList.add('hidden')
      }
    } else {
      overlay.classList.add('hidden')
    }
  })
  console.log('🔒 [Navigation] All overlays closed')
}

function handleInternalNavigation(
  targetName: string,
  onNavigate: (target: string) => void
): void {
  console.log(`🧭 [Navigation] Navigating to screen: ${targetName}`)
  closeAllOverlays()
  onNavigate(targetName)
}

function handleToggle(targetName: string): void {
  console.log(`🔄 [Navigation] Toggle requested for: ${targetName}`)

  // Tentar encontrar drawer
  const drawerContainer = document.getElementById(`drawer-${targetName}`)
  if (drawerContainer) {
    console.log(`✅ [Navigation] Found drawer: ${targetName}`)
    const aside = drawerContainer.querySelector('aside')
    const isHidden = drawerContainer.classList.contains('hidden')

    if (isHidden) {
      // Abrir drawer
      drawerContainer.classList.remove('hidden')
      if (aside) {
        aside.classList.add('-translate-x-full')
        requestAnimationFrame(() => {
          aside.classList.remove('-translate-x-full')
          aside.classList.add('translate-x-0')
        })
      }
      console.log(`🔓 [Navigation] Opened drawer: ${targetName}`)
    } else {
      // Fechar drawer
      if (aside) {
        aside.classList.remove('translate-x-0')
        aside.classList.add('-translate-x-full')
        setTimeout(() => drawerContainer.classList.add('hidden'), 250)
      } else {
        drawerContainer.classList.add('hidden')
      }
      console.log(`🔒 [Navigation] Closed drawer: ${targetName}`)
    }
    return
  }

  // Tentar encontrar modal
  const modal = document.getElementById(`modal-${targetName}`)
  if (modal) {
    console.log(`✅ [Navigation] Found modal: ${targetName}`)
    modal.classList.toggle('hidden')

    const isHidden = modal.classList.contains('hidden')
    console.log(
      `${isHidden ? '🔒' : '🔓'} [Navigation] ${isHidden ? 'Closed' : 'Opened'} modal: ${targetName}`
    )
    return
  }

  console.warn(`⚠️ [Navigation] Overlay not found: ${targetName}`)
}

function handleBack(): void {
  console.log('⬅️ [Navigation] Back navigation requested (not implemented)')
}
