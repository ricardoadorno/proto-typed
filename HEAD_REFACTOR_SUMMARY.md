# Exemplo de uso da nova sintaxe `head:`

## Nova estrutura hierárquica

```proto-typed
head:
  color:
    primary:  #0047AB
    secondary:#F4C542
    neutral: #1A1A1A
    accent:   #00AEEF

  font:
    base:
      family: Poppins

  template:
    default: $GlobalDeck

screen Dashboard:
  container:
    # Welcome
    > This is a test of the new head configuration
```

## Mudanças principais

### ✅ O que foi alterado:

1. **Token renomeado**: `styles:` → `head:`
2. **Estrutura hierárquica**:
   - `color:` com `primary`, `secondary`, `neutral`, `accent`
   - `font:` com `base:` e `family`
   - `template:` com `default` (referência a componente)
3. **Removido**: `CssProperty` (antiga compatibilidade com `--css-var: value;`)
4. **Tipos AST**:
   - `Styles` → `Head`
   - Novos: `HeadColor`, `ColorProperty`, `HeadFont`, `FontBase`, `FontProperty`, `HeadTemplate`, `TemplateProperty`

### 📦 Arquivos modificados:

- ✅ `lexer/tokens/styles.tokens.ts` - novos tokens
- ✅ `lexer/tokens/index.ts` - exportações atualizadas
- ✅ `parser/rules/head.rules.ts` - nova gramática hierárquica
- ✅ `parser/rules/index.ts` - export atualizado
- ✅ `parser/parser.ts` - regras atualizadas
- ✅ `parser/rules/core.rules.ts` - `head` no programa
- ✅ `parser/builders/head.builders.ts` - novos builders
- ✅ `parser/builders/index.ts` - export atualizado
- ✅ `parser/ast-builder.ts` - visitor atualizado
- ✅ `types/ast-node.ts` - novos NodeTypes
- ✅ `types/parser.ts` - interface IParser atualizada
- ✅ `renderer/core/theme-manager.ts` - `processHeadConfig()`
- ✅ `renderer/core/node-renderer.ts` - renderizadores atualizados
- ✅ `renderer/nodes/head.node.ts` - novo renderer (no-op)
- ✅ `renderer/ast-to-html-document.ts` - usa `processHeadConfig`
- ✅ `renderer/ast-to-html-string-preview.ts` - usa `processHeadConfig`

### 🎯 CSS Variables geradas:

A partir do `head:`, serão geradas as seguintes variáveis CSS:

```css
--head-color-primary: #0047ab;
--head-color-secondary: #f4c542;
--head-color-neutral: #1a1a1a;
--head-color-accent: #00aeef;
--head-font-family: Poppins;
```

### 📝 Template default:

O campo `template.default` permite especificar um componente global que será usado como layout padrão para todas as screens (funcionalidade futura).
