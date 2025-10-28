# Correções: Navegação e Exportação HTML

> **Documento de Implementação**  
> Análise de problemas e soluções para navegação completa e exportação HTML com Tailwind

---

## 1. Problemas Identificados

### 1.1 Tailwind CSS na Exportação HTML

**Problema**: Ao exportar HTML via `REQUEST_EXPORT`, o arquivo gerado não inclui o Tailwind CDN.

**Causa Raiz**:

- O webview usa `astToHtmlStringPreview()` para gerar o HTML
- `astToHtmlStringPreview()` gera **apenas fragmento HTML** (sem `<html>`, `<head>`, CDNs)
- `astToHtmlDocument()` **já inclui Tailwind CDN e tudo**, mas não está sendo usado

**Localização do Código**:

```typescript
// packages/core/src/renderer/ast-to-html-document.ts:140
const scripts = {
  tailwindCdn: `<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>`,
  tailwindConfig: `<script>tailwind.config = { darkMode: 'class', theme: { extend: {} } };</script>`,
  // ...
}
```

**Evidência**:

```typescript
// packages/extension/webview/src/hooks/use-playground-state.ts
const exportHtml = useCallback(() => {
  if (!state.html) return

  sendMessage(
    createMessage('REQUEST_EXPORT', {
      html: state.html, // ❌ Fragmento sem Tailwind
      suggestedFileName: 'prototype.html',
    })
  )
}, [state.html, sendMessage])
```

---

### 1.2 Navegação Incompleta no Webview

**Problema**: Navegação via cliques não funciona completamente para:

- Modals e drawers
- Ações com `data-action` (atributo alternativo)
- Elementos dentro de componentes

**Causa Raiz**:
O core usa **dois sistemas de atributos** para navegação:

1. **Sistema primário** (usado por astToHtmlDocument):
   - `data-nav="TargetName"`
   - `data-nav-type="internal|toggle|back|external|action"`

2. **Sistema alternativo** (usado em alguns renderers):
   - `data-action="ScreenName"` (botões dentro de cards, por exemplo)
   - `data-destination="ScreenName"` (links)

**Código do Core** (`packages/core/src/renderer/ast-to-html-document.ts:345`):

```javascript
document.addEventListener('click', function (e) {
  const target = e.target.closest('[data-nav]')
  if (!target) return

  const navValue = target.getAttribute('data-nav')
  const navType = target.getAttribute('data-nav-type')

  // ... navegação completa com modals, drawers, back, etc
})
```

**Hook Atual** (`packages/extension/webview/src/hooks/use-navigation.ts:44`):

```typescript
const handleClick = (e: MouseEvent) => {
  // ❌ Só busca [data-nav], não busca [data-action] ou [data-destination]
  let target = e.target as HTMLElement | null
  // ... busca data-nav apenas
}
```

---

### 1.3 Layouts (Cards) Não Contêm Filhos

**Problema**: Na imagem, vemos:

```
Quick Links
Open Docs
Cancel
```

Mas deveria ser:

```
┌─────────────────┐
│ Quick Links     │
│ Open Docs       │
│ Cancel          │
└─────────────────┘
```

**Causa Raiz**: **Indentação incorreta no DSL**.

**DSL Incorreto** (sem indentação):

```dsl
screen Home:
  card:
  ## Quick Links
  @[Open Docs](Docs)
  @ghost[Cancel](-1)
```

**DSL Correto** (com indentação):

```dsl
screen Home:
  card:
    ## Quick Links
    @[Open Docs](Docs)
    @ghost[Cancel](-1)
```

**Como o Parser Funciona**:

- O lexer adiciona tokens `Indent` e `Outdent` baseado em indentação
- Elementos no **mesmo nível de indentação** do `card:` são **irmãos**, não filhos
- Elementos **mais indentados** que `card:` são **filhos**

**Verificação no Core** (`packages/core/src/renderer/nodes/layouts.node.ts:99`):

```typescript
export function renderLayout(
  node: AstNode,
  _render: (node: AstNode, context?: string) => string
): string {
  const { layoutType } = node.props as LayoutProps
  const classes = LAYOUT_PRESETS[layoutType] || LAYOUT_PRESETS.container
  const inlineStyles = getLayoutInlineStyles(layoutType)

  // ✅ Renderiza TODOS os filhos
  const childrenHtml = node.children.map((child) => _render(child)).join('\n')

  return `<div class="${classes}" style="${inlineStyles}">${childrenHtml}</div>`
}
```

O renderizador **está correto**. O problema é **DSL mal formatado**.

---

## 2. Soluções Propostas

### 2.1 Exportação HTML com Tailwind

**Solução**: Usar `astToHtmlDocument()` em vez de `astToHtmlStringPreview()` para exportação.

**Implementação**:

#### Passo 1: Atualizar Hook `use-playground-state.ts`

```typescript
// packages/extension/webview/src/hooks/use-playground-state.ts
import { astToHtmlDocument } from '@proto-typed/core' // NOVO

const exportHtml = useCallback(() => {
  if (!astRef.current) return

  // NOVO: Usar astToHtmlDocument com AST completo
  const fullHtml = astToHtmlDocument(astRef.current, {
    currentScreen: state.currentScreen || undefined,
    isDarkMode: true,
  })

  sendMessage(
    createMessage('REQUEST_EXPORT', {
      html: fullHtml, // ✅ Documento completo com Tailwind
      suggestedFileName: 'prototype.html',
    })
  )
}, [state.currentScreen, sendMessage])
```

**Vantagens**:

- ✅ Tailwind CDN incluído
- ✅ Lucide icons CDN incluído
- ✅ Script de navegação completo
- ✅ CSS variables do tema
- ✅ HTML standalone funcional

---

### 2.2 Navegação Completa no Webview

**Solução**: Reimplementar `use-navigation.ts` baseado no script do core, com suporte completo a:

- `data-nav` + `data-nav-type` (sistema primário)
- `data-action` (sistema alternativo)
- `data-destination` (sistema alternativo)
- Modals com close button
- Drawers com overlay click
- Back navigation
- Toggle overlays

**Implementação**:

#### Passo 1: Reescrever `use-navigation.ts`

```typescript
// packages/extension/webview/src/hooks/use-navigation.ts
import { useEffect } from 'react'

interface UseNavigationOptions {
  currentScreen: string | null
  onNavigate: (screenName: string) => void
}

export function useNavigation({
  currentScreen,
  onNavigate,
}: UseNavigationOptions) {
  // Efeito 1: Controlar visibilidade de telas
  useEffect(() => {
    if (!currentScreen) return

    const allScreens = document.querySelectorAll('[data-screen]')
    allScreens.forEach((screen) => {
      if (screen.getAttribute('data-screen') === currentScreen) {
        ;(screen as HTMLElement).style.display = 'block'
      } else {
        ;(screen as HTMLElement).style.display = 'none'
      }
    })

    console.log(`📍 [Navigation] Active screen: ${currentScreen}`)
  }, [currentScreen])

  // Efeito 2: Interceptar cliques em elementos de navegação
  useEffect(() => {
    const handleNavigationClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      // Buscar elemento navegável (pode estar em elemento pai)
      let element: HTMLElement | null = target
      let maxDepth = 5
      let depth = 0

      while (element && depth < maxDepth) {
        // Sistema primário: data-nav + data-nav-type
        const navValue = element.getAttribute('data-nav')
        const navType = element.getAttribute('data-nav-type')

        // Sistema alternativo: data-action ou data-destination
        const action = element.getAttribute('data-action')
        const destination = element.getAttribute('data-destination')

        // Se encontrou elemento navegável
        if (navValue || action || destination) {
          event.preventDefault()
          event.stopPropagation()

          // Determinar target e tipo
          const targetName = navValue || action || destination
          const targetType = navType || 'internal'

          if (!targetName) {
            element = element.parentElement
            depth++
            continue
          }

          // Roteamento baseado em tipo
          switch (targetType) {
            case 'internal':
              handleInternalNavigation(targetName, onNavigate)
              break
            case 'toggle':
              handleToggle(targetName)
              break
            case 'back':
              handleBack()
              break
            case 'external':
              handleExternal(targetName)
              break
            case 'action':
              handleAction(targetName)
              break
          }

          return
        }

        element = element.parentElement
        depth++
      }
    }

    // Adicionar listener global
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

      // Fechar modal ao clicar no backdrop
      if (target.classList.contains('modal-backdrop')) {
        const modal = target.closest('[id^="modal-"]')
        if (modal) {
          modal.classList.add('hidden')
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

function handleInternalNavigation(
  targetName: string,
  onNavigate: (screen: string) => void
): void {
  // Verificar se é modal ou drawer
  const modal = document.getElementById(`modal-${targetName}`)
  const drawer = document.getElementById(`drawer-${targetName}`)

  if (modal || drawer) {
    // É um overlay, fazer toggle
    handleToggle(targetName)
  } else if (targetName === 'close') {
    // Fechar todos os overlays
    closeAllOverlays()
  } else if (targetName === '-1') {
    // Back navigation (TODO: implementar histórico)
    handleBack()
  } else {
    // É uma tela, navegar
    console.log(`🧭 [Navigation] Navigating to screen: ${targetName}`)
    closeAllOverlays() // Fechar overlays antes de navegar
    onNavigate(targetName)
  }
}

function handleToggle(targetName: string): void {
  // Tentar encontrar drawer
  const drawerContainer = document.getElementById(`drawer-${targetName}`)
  if (drawerContainer) {
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
  // TODO: Implementar histórico de navegação se necessário
}

function handleExternal(url: string): void {
  console.log(`🌐 [Navigation] Opening external URL: ${url}`)
  window.open(url, '_blank', 'noopener,noreferrer')
}

function handleAction(actionName: string): void {
  console.log(`🎯 [Navigation] Action triggered: ${actionName}`)
  // Actions são placeholders, não fazem nada no webview
}

function closeAllOverlays(): void {
  // Fechar todos os drawers
  const drawers = document.querySelectorAll('[id^="drawer-"]')
  drawers.forEach((drawer) => {
    const aside = drawer.querySelector('aside')
    if (aside) {
      aside.classList.remove('translate-x-0')
      aside.classList.add('-translate-x-full')
      setTimeout(() => drawer.classList.add('hidden'), 250)
    } else {
      drawer.classList.add('hidden')
    }
  })

  // Fechar todos os modals
  const modals = document.querySelectorAll('[id^="modal-"]')
  modals.forEach((modal) => {
    modal.classList.add('hidden')
  })

  console.log('🔒 [Navigation] All overlays closed')
}
```

**Vantagens**:

- ✅ Suporta `data-nav`, `data-action`, `data-destination`
- ✅ Modals e drawers com toggle correto
- ✅ Overlay click para fechar
- ✅ Animações de drawer (translate-x)
- ✅ Logs detalhados para debugging

---

### 2.3 Correção de Layout (Cards)

**Solução**: Criar arquivo de exemplo com DSL correto e documentar indentação.

**Implementação**:

#### Passo 1: Criar DSL de Teste

```dsl
screen Home:
  header:
    >> Proto-Typed Demo
    @ghost-sm[Menu](MainMenu)

  container:
    # Welcome

    card:
      ## Quick Links
      > Access important sections
      @[Open Docs](Docs)
      @ghost[Cancel](-1)

    ---

    grid-2:
      card-compact:
        ### Feature 1
        >> Description here
      card-compact:
        ### Feature 2
        >> Description here

drawer MainMenu:
  stack:
    ## Menu
    @[Home](Home)
    @[Docs](Docs)
    @[Settings](Settings)
```

#### Passo 2: Adicionar Validação no Webview

Não há necessidade de validação, pois:

- ✅ O parser já valida indentação
- ✅ Erros são reportados via `ErrorBus`
- ✅ O webview já mostra erros no `ErrorPanel`

---

## 3. Checklist de Implementação

### 3.1 Exportação HTML com Tailwind

- [ ] Importar `astToHtmlDocument` no `use-playground-state.ts`
- [ ] Atualizar `exportHtml()` para usar `astToHtmlDocument()`
- [ ] Manter referência ao AST no `astRef`
- [ ] Testar exportação e abrir HTML em navegador
- [ ] Verificar Tailwind funciona no arquivo exportado

### 3.2 Navegação Completa

- [ ] Reescrever `use-navigation.ts` com novo código
- [ ] Suportar `data-nav`, `data-action`, `data-destination`
- [ ] Implementar toggle de modals e drawers
- [ ] Implementar overlay click para fechar
- [ ] Adicionar logs detalhados
- [ ] Testar navegação entre telas
- [ ] Testar abertura/fechamento de modals
- [ ] Testar abertura/fechamento de drawers

### 3.3 Layouts e DSL

- [ ] Criar arquivo de exemplo com indentação correta
- [ ] Documentar regras de indentação no README
- [ ] Testar cards com filhos
- [ ] Testar grids e stacks
- [ ] Verificar ErrorPanel mostra erros de indentação

### 3.4 Validação Final

- [ ] Compilar extensão: `pnpm -F @proto-typed/extension run compile`
- [ ] Abrir extensão no VS Code (F5)
- [ ] Abrir `example.pty`
- [ ] Testar navegação entre telas
- [ ] Testar abertura de modals (CreateContact, ConfirmDelete)
- [ ] Testar abertura de drawer (MainDrawer)
- [ ] Exportar HTML e verificar Tailwind
- [ ] Verificar cards contêm filhos

---

## 4. Arquitetura Atualizada

```
┌─────────────────────────────────────────────────┐
│ DSL Input (com indentação correta)             │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ Lexer → Tokens (Indent/Outdent)                │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ Parser → CST → AST                              │
│ (children baseados em indentação)               │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ RouteManager → Processa rotas                   │
│ - Screens, Modals, Drawers, Components         │
└──────────────────┬──────────────────────────────┘
                   │
                   ├──────────────┬───────────────┐
                   │              │               │
                   ▼              ▼               ▼
┌──────────────────────┐ ┌────────────┐ ┌────────────────┐
│ astToHtmlStringPreview│ │ astToHtml  │ │ Renderer       │
│ (webview preview)    │ │ Document   │ │ (layouts, etc) │
│ - Fragmento HTML     │ │ (export)   │ │                │
│ - Sem CDNs           │ │ - Full HTML│ │ ✅ Renderiza   │
│ - Sem script nav     │ │ - Tailwind │ │   children     │
└──────────────────────┘ │ - Script   │ │   corretamente │
                         └────────────┘ └────────────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ Exported HTML File │
                    │ ✅ Tailwind CDN    │
                    │ ✅ Lucide CDN      │
                    │ ✅ Navigation      │
                    │ ✅ Standalone      │
                    └────────────────────┘
```

---

## 5. Debugging

### 5.1 Navegação Não Funciona

**Verificar**:

```typescript
// No console do DevTools (Help > Toggle Developer Tools)

// 1. Verificar se elementos têm atributos corretos
document.querySelectorAll('[data-nav]')
document.querySelectorAll('[data-action]')

// 2. Verificar IDs de modals e drawers
document.querySelectorAll('[id^="modal-"]')
document.querySelectorAll('[id^="drawer-"]')

// 3. Verificar currentScreen
console.log('Current screen:', currentScreen)
```

### 5.2 Exportação Sem Tailwind

**Verificar**:

```typescript
// No console
// Ver se astRef tem AST
console.log('AST:', astRef.current)

// Ver se astToHtmlDocument está importado
console.log(typeof astToHtmlDocument)
```

### 5.3 Cards Sem Filhos

**Verificar DSL**:

```dsl
# ❌ ERRADO (sem indentação)
screen Home:
  card:
  ## Title
  @[Button](Action)

# ✅ CORRETO (com indentação)
screen Home:
  card:
    ## Title
    @[Button](Action)
```

---

## 6. Próximos Passos

1. ✅ Implementar exportação com `astToHtmlDocument()`
2. ✅ Reimplementar `use-navigation.ts` completo
3. ✅ Criar arquivo de exemplo com DSL correto
4. ✅ Testar na extensão
5. ✅ Validar todas as funcionalidades

---

**Fim do Documento de Implementação**

Este documento identifica e resolve os 3 problemas principais:

1. Tailwind na exportação HTML
2. Navegação completa (modals, drawers, overlays)
3. Layouts e indentação de DSL
