# Guia de Implementação: Navegação e Componentes no Webview

> **Adendo à Arquitetura Desacoplada**  
> Foco: Sistema de navegação reativo, Tailwind CSS e renderização de componentes

## 1. Problema Atual

### 1.1 Navegação

- ❌ **Todas as telas aparecem simultaneamente** (nenhuma está oculta)
- ❌ **Sem controle de visibilidade baseado em `currentScreen`**
- ❌ **Cliques em botões não alternam telas**

### 1.2 Tailwind CSS

- ❌ **Tailwind não carregado** (classes não aplicam estilos)
- ❌ **Falta `<script>` do Tailwind CDN no HTML do webview**

### 1.3 Componentes

- ❌ **Componentes não respeitam sistema de props (`%varName`)**
- ❌ **`ComponentInstance` não renderiza corretamente**

---

## 2. Arquitetura da Navegação (Como Funciona)

### 2.1 Sistema de Telas no Core

Conforme `LLM-CONTEXT.md`, o Proto-Typed usa um **sistema de telas com ocultação via CSS**:

```html
<!-- CORRETO: Apenas a tela ativa fica visível -->
<div
  id="screen-Home"
  class="screen-container"
  data-screen="Home"
  style="display: block;"
>
  <!-- Conteúdo da Home -->
</div>

<div
  id="screen-Profile"
  class="screen-container"
  data-screen="Profile"
  style="display: none;"
>
  <!-- Conteúdo do Profile (oculto) -->
</div>

<div
  id="screen-Settings"
  class="screen-container"
  data-screen="Settings"
  style="display: none;"
>
  <!-- Conteúdo do Settings (oculto) -->
</div>
```

### 2.2 Atributos de Navegação

Botões têm atributos `data-nav` para navegação:

```html
<button data-nav="Profile" data-nav-type="internal">Go to Profile</button>
```

### 2.3 Script de Navegação

O `astToHtmlDocument` gera um script que:

1. **Detecta cliques** em elementos com `data-nav`
2. **Oculta tela atual** (`display: none`)
3. **Mostra tela alvo** (`display: block`)
4. **Atualiza histórico**

### 2.4 Fluxo no Webview

```
┌─────────────────────────────────────────────────┐
│ 1. Core renderiza HTML com TODAS as telas       │
│    (cada tela tem display: none ou block)       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 2. RouteManager processa AST                    │
│    - Identifica screens, modals, drawers        │
│    - Define currentScreen                       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 3. astToHtmlStringPreview gera HTML             │
│    - Renderiza todas as telas                   │
│    - Aplica display baseado em currentScreen    │
│    - NÃO inclui script de navegação (preview)   │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 4. Webview React recebe HTML                    │
│    - Injeta via dangerouslySetInnerHTML         │
│    - PROBLEMA: Script de navegação ausente      │
│    - SOLUÇÃO: Implementar navegação no React    │
└─────────────────────────────────────────────────┘
```

---

## 3. Solução: Implementar Navegação no Webview

### 3.1 Por que o HTML não funciona sozinho?

O `astToHtmlStringPreview` **não inclui o script de navegação** porque:

- É para **preview** (fragmento HTML)
- Espera que o **host gerencie navegação** (SPA mode)
- Apenas `astToHtmlDocument` tem script completo

### 3.2 Estratégia de Implementação

Há **2 abordagens**:

#### Opção A: Usar `astToHtmlDocument` (Simples)

✅ **Prós**: Script de navegação incluído, funciona imediatamente  
❌ **Contras**: Documento completo (com `<html>`, CDNs), mais pesado

#### Opção B: Implementar Navegação no React (Recomendado)

✅ **Prós**: Controle total, integra com estado React, mais leve  
❌ **Contras**: Requer implementação de navegação cliente

**Vamos implementar Opção B** (mais alinhada com arquitetura desacoplada).

---

## 4. Implementação: Navegação React

### 4.1 Criar Hook de Navegação

**Arquivo**: `packages/extension/webview/src/hooks/use-navigation.ts`

```typescript
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
    const handleClick = (e: MouseEvent) => {
      // Buscar elemento com data-nav (pode estar em pai)
      let target = e.target as HTMLElement | null
      let depth = 0
      const maxDepth = 5

      while (target && depth < maxDepth) {
        const navTarget = target.getAttribute('data-nav')
        const navType = target.getAttribute('data-nav-type')

        if (navTarget) {
          // Prevenir comportamento padrão
          e.preventDefault()
          e.stopPropagation()

          // Navegação interna (screens)
          if (navType === 'internal') {
            console.log(`🧭 [Navigation] Navigating to: ${navTarget}`)
            onNavigate(navTarget)
            return
          }

          // Toggle de modals/drawers
          if (navType === 'toggle') {
            toggleOverlay(navTarget)
            return
          }

          // Fechar overlays
          if (navTarget === 'close') {
            closeAllOverlays()
            return
          }

          // Back navigation
          if (navTarget === '-1') {
            // Implementar via routeManagerGateway.goBack() se necessário
            console.log('⬅️ [Navigation] Going back')
            return
          }

          // Ações placeholder
          console.log(`🎯 [Navigation] Action: ${navTarget}`)
          return
        }

        target = target.parentElement
        depth++
      }
    }

    // Adicionar listener global
    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [onNavigate])
}

/**
 * Alterna visibilidade de modal/drawer
 */
function toggleOverlay(name: string): void {
  const modal = document.getElementById(`modal-${name}`)
  const drawer = document.getElementById(`drawer-${name}`)
  const overlay = modal || drawer

  if (overlay) {
    const isHidden = overlay.classList.contains('hidden')
    if (isHidden) {
      overlay.classList.remove('hidden')
      console.log(`🔓 [Navigation] Opened: ${name}`)
    } else {
      overlay.classList.add('hidden')
      console.log(`🔒 [Navigation] Closed: ${name}`)
    }
  }
}

/**
 * Fecha todos os overlays abertos
 */
function closeAllOverlays(): void {
  const overlays = document.querySelectorAll('[data-modal], [data-drawer]')
  overlays.forEach((overlay) => {
    overlay.classList.add('hidden')
  })
  console.log('🔒 [Navigation] All overlays closed')
}
```

### 4.2 Integrar no `PlaygroundApp`

**Arquivo**: `packages/extension/webview/src/app/playground-app.tsx`

```typescript
import React from 'react'
import { usePlaygroundState } from '../hooks/use-playground-state'
import { useNavigation } from '../hooks/use-navigation'  // NOVO
import { PreviewSurface } from './components/preview-surface'
import { ScreenNavigator } from './components/screen-navigator'
import { ErrorPanel } from './components/error-panel'
import { Toolbar } from './components/toolbar'

export function PlaygroundApp() {
  const {
    html,
    metadata,
    currentScreen,
    errors,
    isLoading,
    navigateToScreen,
    exportHtml,
  } = usePlaygroundState()

  // NOVO: Hook de navegação
  useNavigation({
    currentScreen,
    onNavigate: navigateToScreen,
  })

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Toolbar onExport={exportHtml} canExport={!!html} />
      <ErrorPanel errors={errors} />
      <ScreenNavigator
        metadata={metadata}
        currentScreen={currentScreen}
        onNavigate={navigateToScreen}
      />
      <div className="flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-50">
            <div className="text-gray-400">Parsing...</div>
          </div>
        )}
        <PreviewSurface html={html} onNavigate={navigateToScreen} />
      </div>
    </div>
  )
}
```

### 4.3 Remover Listener Duplicado

**Arquivo**: `packages/extension/webview/src/app/components/preview-surface.tsx`

```typescript
import React from 'react'

interface PreviewSurfaceProps {
  html: string
  onNavigate?: (screenName: string) => void
}

export function PreviewSurface({ html, onNavigate }: PreviewSurfaceProps) {
  // REMOVER: useEffect com addEventListener
  // A navegação agora é gerenciada por useNavigation no PlaygroundApp

  if (!html) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">No preview available</p>
          <p className="text-sm">Start typing to see the preview</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full h-full overflow-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

---

## 5. Implementação: Tailwind CSS

### 5.1 Problema

O webview **não carrega Tailwind**, então classes como `flex`, `container`, `px-4` não funcionam.

### 5.2 Solução: CDN via CSP

**Arquivo**: `packages/extension/src/panels/playground/playground-panel.ts`

```typescript
private getWebviewHtml(): string {
  const webview = this.panel.webview
  const extensionUri = this.options.extensionContext.extensionUri

  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'index.js')
  )
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'index.css')
  )

  const nonce = this.getNonce()

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline' https://cdn.tailwindcss.com; script-src 'nonce-${nonce}' ${webview.cspSource} 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com; img-src ${webview.cspSource} https: data:; font-src ${webview.cspSource};">

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {}
        }
      };
    </script>

    <!-- Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

    <link href="${styleUri}" rel="stylesheet">
    <title>Proto-Typed Playground</title>

    <style>
      /* Variáveis CSS do tema (serão aplicadas pelo core) */
      :root {
        --background: #0f172a;
        --foreground: #e2e8f0;
        --card: #1e293b;
        --card-foreground: #e2e8f0;
        --primary: #8b5cf6;
        --primary-foreground: #ffffff;
        --secondary: #475569;
        --secondary-foreground: #f1f5f9;
        --muted: #334155;
        --muted-foreground: #94a3b8;
        --accent: #6366f1;
        --accent-foreground: #ffffff;
        --destructive: #ef4444;
        --destructive-foreground: #ffffff;
        --border: #334155;
        --input: #334155;
        --ring: #8b5cf6;
        --radius: 0.5rem;
      }

      /* Garantir que telas ocultas não apareçam */
      .screen-container {
        width: 100%;
        height: 100%;
      }
    </style>
</head>
<body class="dark">
    <div id="root"></div>

    <script nonce="${nonce}">
        // Initialize VS Code API
        const vscode = acquireVsCodeApi();
        window.vscode = vscode;

        // Initialize Lucide icons quando disponível
        document.addEventListener('DOMContentLoaded', () => {
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();

            // Re-initialize quando o DOM mudar (para conteúdo dinâmico)
            const observer = new MutationObserver(() => {
              lucide.createIcons();
            });

            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
          }
        });
    </script>

    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`
}
```

### 5.3 Atualizar CSP para Permitir CDNs

Note na linha do CSP:

- `style-src`: Adiciona `https://cdn.tailwindcss.com`
- `script-src`: Adiciona `'unsafe-eval'` (necessário para Tailwind), `https://cdn.tailwindcss.com`, `https://unpkg.com`

---

## 6. Implementação: Sistema de Componentes

### 6.1 Como Funciona (Core)

Conforme `LLM-CONTEXT.md`:

1. **Definição** de componente com props `%varName`:

```dsl
component UserCard:
  card:
    ## %name
    > %email
    >>> %role
```

2. **Instanciação** com valores via pipe `|`:

```dsl
$UserCard:
  - John Silva | john@email.com | Admin
```

3. **Renderização** pelo core:
   - `ComponentInstance` node chama `renderComponentInstance()`
   - `renderComponentInstance()` busca definição do component
   - Substitui `%varName` pelos valores fornecidos
   - Renderiza o conteúdo resultante

### 6.2 Verificar se Core Suporta

O core **já implementa** isso:

**Arquivo**: `packages/core/src/renderer/nodes/components.node.ts`

```typescript
export function renderComponentInstance(
  node: AstNode,
  _render: RenderFunction
): string {
  const { name, values } = node.props as ComponentInstanceProps

  // Buscar definição do componente
  const definition = getComponentDefinition(name)
  if (!definition) {
    return `<!-- Component ${name} not found -->`
  }

  // Se tem valores (props), substituir
  if (values && values.length > 0) {
    return renderComponentWithProps(definition, values, _render)
  }

  // Sem props, renderizar direto
  return definition.children.map((child) => _render(child)).join('')
}

function renderComponentWithProps(
  definition: AstNode,
  values: string[],
  _render: RenderFunction
): string {
  // Clonar estrutura e substituir %variables pelos valores
  const clonedChildren = replacePropsInNodes(definition.children, values)
  return clonedChildren.map((child) => _render(child)).join('')
}
```

### 6.3 Garantir que Componentes Sejam Registrados

**Problema**: O webview precisa garantir que componentes sejam processados antes de renderizar instâncias.

**Solução**: O `RouteManager.processRoutes()` já faz isso, mas confirmar no hook:

**Arquivo**: `packages/extension/webview/src/hooks/use-playground-state.ts`

```typescript
// No handleParse, após parsear AST:
const ast = parseAndBuildAst(text)
astRef.current = ast

// Inicializar rotas (processa componentes)
routeManagerGateway.initialize(ast) // ✅ JÁ FAZ ISSO

// Obter metadata
const newMetadata = routeManagerGateway.getRouteMetadata()
```

O `initialize()` chama `processRoutes()` que registra componentes via `setComponentDefinitions()`.

### 6.4 Testar Componentes

**DSL de teste**:

```dsl
component MetricCard:
  card:
    ### %label
    # %value
    >>> %change

screen Dashboard:
  container:
    # Dashboard

    grid-3:
      $MetricCard:
        - Total Users | 1,234 | +12%
      $MetricCard:
        - Revenue | $45,678 | +8%
      $MetricCard:
        - Tasks | 89 | -3%
```

Se ainda não funcionar, verificar:

1. **Core build**: Recompilar `@proto-typed/core`
2. **Exports**: Verificar se `setComponentDefinitions` está exportado
3. **Logs**: Adicionar `console.log` no `renderComponentInstance`

---

## 7. Checklist de Implementação

### 7.1 Navegação

- [ ] Criar `use-navigation.ts` hook
- [ ] Integrar no `PlaygroundApp`
- [ ] Remover listener duplicado de `PreviewSurface`
- [ ] Testar navegação entre telas
- [ ] Testar toggle de modals/drawers

### 7.2 Tailwind CSS

- [ ] Atualizar CSP em `playground-panel.ts`
- [ ] Adicionar `<script>` do Tailwind CDN
- [ ] Adicionar `<script>` do Lucide CDN
- [ ] Adicionar variáveis CSS de tema no `<style>`
- [ ] Testar classes Tailwind funcionando

### 7.3 Componentes

- [ ] Verificar `@proto-typed/core` atualizado
- [ ] Testar componente simples sem props
- [ ] Testar componente com props via pipe
- [ ] Testar lista de componentes
- [ ] Verificar substituição de `%variables`

### 7.4 Validação Final

- [ ] Compilar extensão: `pnpm -F @proto-typed/extension run compile`
- [ ] Testar no VS Code
- [ ] Abrir arquivo `.pty` de exemplo
- [ ] Verificar preview renderiza corretamente
- [ ] Testar navegação entre telas
- [ ] Verificar Tailwind aplica estilos
- [ ] Testar componentes renderizam

---

## 8. Debugging

### 8.1 Navegação Não Funciona

**Verificar**:

```typescript
// No console do DevTools (Help > Toggle Developer Tools)
// Verificar se telas têm IDs corretos
document.querySelectorAll('[data-screen]')

// Verificar currentScreen
console.log('Current screen:', currentScreen)

// Verificar cliques sendo interceptados
// (adicionar breakpoint no handleClick do useNavigation)
```

### 8.2 Tailwind Não Carrega

**Verificar**:

- CSP permite `https://cdn.tailwindcss.com`
- `<script>` do Tailwind aparece no HTML (inspecionar webview)
- Console do DevTools não mostra erros de CSP
- Testar classe simples: `<div class="bg-blue-500 text-white p-4">Test</div>`

### 8.3 Componentes Não Renderizam

**Verificar**:

```typescript
// No console
// Ver se componentes foram registrados
import { getComponentDefinitions } from '@proto-typed/core'
console.log('Components:', getComponentDefinitions())

// Verificar se AST tem ComponentInstance nodes
console.log('AST:', ast)
```

---

## 9. Arquitetura Atualizada

```
┌─────────────────────────────────────────────────┐
│ VS Code Editor (.pty file)                      │
└──────────────────┬──────────────────────────────┘
                   │ onDidChangeTextDocument
                   ▼
┌─────────────────────────────────────────────────┐
│ TextDocumentSynchronizer (debounce 300ms)       │
└──────────────────┬──────────────────────────────┘
                   │ DSL_UPDATE message
                   ▼
┌─────────────────────────────────────────────────┐
│ MessageRouter → PlaygroundPanel                 │
└──────────────────┬──────────────────────────────┘
                   │ webview.postMessage()
                   ▼
┌─────────────────────────────────────────────────┐
│ React Webview (PlaygroundApp)                   │
│ ├─ usePlaygroundState                           │
│ │  ├─ Recebe DSL via DSL_UPDATE                 │
│ │  ├─ Chama parseAndBuildAst()                  │
│ │  ├─ Chama routeManager.processRoutes()        │
│ │  │  └─ Registra componentes                   │
│ │  ├─ Chama astToHtmlStringPreview()            │
│ │  │  └─ Renderiza componentes com props        │
│ │  └─ Retorna HTML + metadata                   │
│ │                                                │
│ ├─ useNavigation (NOVO)                         │
│ │  ├─ Controla display de telas                 │
│ │  ├─ Intercepta cliques [data-nav]             │
│ │  └─ Chama navigateToScreen()                  │
│ │                                                │
│ └─ PreviewSurface                                │
│    └─ dangerouslySetInnerHTML (HTML com Tailwind)│
└─────────────────────────────────────────────────┘
```

---

## 10. Próximos Passos

1. **Implementar navegação** (hook `use-navigation.ts`)
2. **Adicionar Tailwind CDN** (atualizar `playground-panel.ts`)
3. **Testar componentes** (criar DSL de teste)
4. **Validar no VS Code** (compilar e testar extensão)
5. **Documentar exemplos** (adicionar ao README da extensão)

---

**Fim do Guia de Implementação**

Este documento complementa `webview-architecture.md` com foco em **navegação reativa**, **Tailwind CSS** e **sistema de componentes** do Proto-Typed no contexto do webview VS Code.
