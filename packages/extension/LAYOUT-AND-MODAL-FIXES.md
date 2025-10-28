# Análise e Correção: Layouts e Modals

> **Documento de Investigação**  
> Análise profunda dos problemas com layouts (cards, header, components) e modals

---

## 🔍 Problemas Identificados

### 1. **Modals Não Funcionam** 🐛

#### Estrutura HTML do Modal (Core):

```html
<div class="modal hidden" id="modal-CreateContact" data-modal="CreateContact">
  <div
    class="modal-backdrop absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20"
  >
    <div
      class="modal-content bg-card rounded-[--radius] shadow-xl max-w-md w-full mx-4 p-6 relative border border-border"
    >
      <button
        class="modal-close ..."
        data-nav="CreateContact"
        data-nav-type="toggle"
      >
        &times;
      </button>
      <!-- Conteúdo do modal aqui -->
    </div>
  </div>
</div>
```

#### Problema 1: Estrutura de Classes

**No Core** (`views.node.ts:52`):

```typescript
return `<div class="modal hidden" id="modal-${modalName}" data-modal="${modalName}">
  <div class="${elementStyles.modalBackdrop}" >
    <div class="${elementStyles.modalContent}" ...>
```

**Classes aplicadas**:

- Container root: `class="modal hidden"`
- Backdrop: `class="modal-backdrop absolute inset-0 ..."`
- Content: `class="modal-content ..."`

#### Problema 2: Toggle no Hook de Navegação

**Hook atual** (`use-navigation.ts:205`):

```typescript
function handleToggle(targetName: string): void {
  // ...

  // Tentar encontrar modal
  const modal = document.getElementById(`modal-${targetName}`)
  if (modal) {
    modal.classList.toggle('hidden')  // ✅ Remove/adiciona 'hidden'
    const isHidden = modal.classList.contains('hidden')
    console.log(...)
    return
  }
}
```

**Análise**:

- O toggle está correto: remove/adiciona a classe `hidden` do container root
- Quando `hidden` é removido, o modal **deveria** aparecer

#### Problema 3: Evento de Click no Backdrop

**Hook atual** (`use-navigation.ts:128`):

```typescript
// Fechar modal ao clicar no backdrop
if (target.classList.contains('modal-backdrop')) {
  const modal = target.closest('[id^="modal-"]')
  if (modal) {
    modal.classList.add('hidden')
  }
}
```

**Problema**: Quando clicamos **dentro do modal-content**, o evento pode propagar para o backdrop e fechar o modal incorretamente.

#### Problema 4: Click Event Propagation

**Fluxo de cliques**:

```
1. Usuário clica no botão "Open Modal"
   → handleNavigationClick detecta data-nav="CreateContact"
   → chama handleInternalNavigation("CreateContact", ...)
   → detecta modal exists
   → chama handleToggle("CreateContact")
   → remove classe 'hidden' do modal
   → ✅ Modal deve aparecer

2. Usuário clica no conteúdo do modal
   → Se clicar em qualquer elemento dentro de modal-content
   → Evento pode propagar para modal-backdrop
   → handleOverlayClick detecta 'modal-backdrop'
   → adiciona classe 'hidden' de volta
   → ❌ Modal fecha inadvertidamente
```

**Solução**: O evento de click no conteúdo do modal precisa ter `stopPropagation` ou verificar se o click foi **exatamente** no backdrop (não em filhos).

---

### 2. **Layouts (Cards, Header) Não Renderizam Corretamente** 🐛

#### Possível Causa 1: Problema de Z-Index com Modals

**Estrutura Atual**:

```html
<!-- Telas -->
<div data-screen="Contacts" style="display: block;">
  <header>...</header>
  <div class="container">
    <card>...</card>
  </div>
</div>

<!-- Modal (sempre no DOM, hidden) -->
<div class="modal hidden" id="modal-CreateContact">
  <div class="modal-backdrop ...">
    <!-- z-20 -->
    ...
  </div>
</div>
```

**Problema**: Se o modal está sempre no DOM (mesmo com `hidden`), e tem `z-index: 20`, pode estar sobrepondo conteúdo?

**Verificação**: A classe `hidden` do Tailwind aplica `display: none`, então não deveria afetar o z-index. Mas se o `hidden` não estiver funcionando, o backdrop pode estar bloqueando cliques.

#### Possível Causa 2: Tailwind `hidden` não aplicado

**Classes Tailwind**:

- `hidden` → `display: none !important;`

**Verificação**:

1. O modal tem `class="modal hidden"` inicialmente
2. Quando toggled, remove `hidden` → modal aparece
3. Quando toggled novamente, adiciona `hidden` → modal esconde

**Problema potencial**: Se o Tailwind CDN não carregar corretamente no webview, a classe `hidden` pode não funcionar.

#### Possível Causa 3: Parser não identifica filhos de cards corretamente

**DSL Exemplo**:

```dsl
modal CreateContact:
  card:
    ## New Contact
    >>> Fill contact information
    ___: Full Name{Enter name}
```

**Pergunta**: O `card:` dentro do modal está sendo identificado como filho do modal?

**Verificação necessária**:

1. Verificar AST gerado
2. Verificar se `card` é renderizado como filho do modal
3. Verificar se os elementos dentro do `card` são filhos do card

---

## 🔧 Soluções Propostas

### Solução 1: Corrigir Evento de Click no Modal Backdrop

**Problema**: Click dentro do modal-content fecha o modal

**Solução**: Verificar se o click foi **exatamente** no backdrop, não em elementos filhos

**Implementação**:

```typescript
// packages/extension/webview/src/hooks/use-navigation.ts

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

    // CORREÇÃO: Fechar modal ao clicar APENAS no backdrop (não em filhos)
    if (target.classList.contains('modal-backdrop')) {
      // Verificar se o click foi EXATAMENTE no backdrop, não em modal-content
      const modalContent = target.querySelector('.modal-content')
      const isClickOnContent =
        modalContent && modalContent.contains(event.target as Node)

      if (!isClickOnContent) {
        const modal = target.closest('[id^="modal-"]')
        if (modal) {
          modal.classList.add('hidden')
          console.log('🔒 [Navigation] Closed modal by clicking outside')
        }
      }
    }
  }

  document.body.addEventListener('click', handleOverlayClick, true)

  return () => {
    document.body.removeEventListener('click', handleOverlayClick, true)
  }
}, [])
```

**Alternativa Melhor**: Capturar click no backdrop apenas

```typescript
// Fechar modal ao clicar no backdrop (mas não no conteúdo)
if (target.classList.contains('modal-backdrop') && event.target === target) {
  // Click foi EXATAMENTE no backdrop
  const modal = target.closest('[id^="modal-"]')
  if (modal) {
    modal.classList.add('hidden')
    console.log('🔒 [Navigation] Closed modal by clicking outside')
  }
}
```

---

### Solução 2: Garantir Tailwind Carregado no Webview

**Verificação**: Confirmar que Tailwind está carregando no webview preview

**Arquivo**: `packages/extension/src/panels/playground/playground-panel.ts`

**Código atual** (linha 48):

```typescript
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline' https://cdn.tailwindcss.com; script-src 'nonce-${nonce}' ${webview.cspSource} 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com; ...">

<!-- Tailwind CSS CDN -->
<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio"></script>
```

**Status**: ✅ Já está correto, Tailwind CDN está incluído

---

### Solução 3: Debugging - Logs para Modal Toggle

**Adicionar logs detalhados**:

```typescript
function handleToggle(targetName: string): void {
  console.log(`🔄 [Navigation] Toggle requested for: ${targetName}`)

  // Tentar encontrar drawer
  const drawerContainer = document.getElementById(`drawer-${targetName}`)
  if (drawerContainer) {
    console.log(`✅ [Navigation] Found drawer: ${targetName}`)
    // ... drawer logic
    return
  }

  // Tentar encontrar modal
  const modal = document.getElementById(`modal-${targetName}`)
  if (modal) {
    console.log(`✅ [Navigation] Found modal: ${targetName}`)
    console.log(`   Current classes: ${modal.className}`)

    modal.classList.toggle('hidden')

    const isHidden = modal.classList.contains('hidden')
    console.log(`   After toggle classes: ${modal.className}`)
    console.log(`   Is hidden: ${isHidden}`)

    console.log(
      `${isHidden ? '🔒' : '🔓'} [Navigation] ${isHidden ? 'Closed' : 'Opened'} modal: ${targetName}`
    )
    return
  }

  console.warn(`⚠️ [Navigation] Overlay not found: ${targetName}`)
  console.log(`   Tried drawer-${targetName} and modal-${targetName}`)
}
```

---

### Solução 4: Verificar Renderização de Componentes dentro de Modals

**Problema potencial**: Components (`$ContactCard`) podem não estar renderizando dentro de modals

**Verificação**: Testar DSL simples sem components

**DSL de Teste**:

```dsl
modal TestModal:
  card:
    ## Test Title
    > Test paragraph
    @[Close](close)
```

Se funcionar, então o problema está em como components são renderizados dentro de modals.

**Se não funcionar**, o problema está na estrutura do modal ou no toggle.

---

## 📊 Checklist de Debugging

### Modal Toggle:

- [ ] Verificar se `document.getElementById('modal-CreateContact')` retorna elemento
- [ ] Verificar se `modal.classList.toggle('hidden')` está sendo executado
- [ ] Verificar se classe `hidden` está sendo removida/adicionada
- [ ] Verificar se Tailwind está aplicando `display: none` para `hidden`
- [ ] Verificar se modal aparece visualmente após remover `hidden`

### Modal Backdrop Click:

- [ ] Verificar se click no backdrop fecha o modal
- [ ] Verificar se click no conteúdo NÃO fecha o modal
- [ ] Verificar se `event.target === backdrop` (não filho)

### Layouts (Cards):

- [ ] Verificar AST gerado para modal com card
- [ ] Verificar HTML renderizado do card dentro do modal
- [ ] Verificar se card tem filhos no HTML
- [ ] Verificar se indentação do DSL está correta

---

## 🧪 Script de Teste

Para executar no console do DevTools:

```javascript
// 1. Verificar se modal existe
const modal = document.getElementById('modal-CreateContact')
console.log('Modal element:', modal)

// 2. Verificar classes
console.log('Modal classes:', modal?.className)

// 3. Verificar se hidden está aplicado
console.log('Has hidden class:', modal?.classList.contains('hidden'))

// 4. Tentar remover hidden manualmente
modal?.classList.remove('hidden')
console.log('After removing hidden:', modal?.className)

// 5. Verificar se modal aparece visualmente
console.log('Modal display style:', window.getComputedStyle(modal).display)

// 6. Verificar backdrop
const backdrop = modal?.querySelector('.modal-backdrop')
console.log('Backdrop element:', backdrop)

// 7. Verificar content
const content = modal?.querySelector('.modal-content')
console.log('Content element:', content)
console.log('Content innerHTML length:', content?.innerHTML.length)

// 8. Adicionar hidden de volta
modal?.classList.add('hidden')
```

---

## 🔄 Próximos Passos

1. ✅ Implementar correção de click no backdrop (apenas exato backdrop)
2. ✅ Adicionar logs detalhados para toggle
3. ⏳ Testar modal com DSL simples (sem components)
4. ⏳ Verificar AST de modal com card
5. ⏳ Compilar e testar na extensão

---

**Fim da Análise**

Principais correções a implementar:

1. **Click no backdrop**: Verificar `event.target === target` (click exato)
2. **Logs de debug**: Adicionar logs detalhados no toggle
3. **Testar estrutura**: Verificar se modal renderiza corretamente
