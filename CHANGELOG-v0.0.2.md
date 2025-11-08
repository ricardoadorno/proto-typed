# Changelog - Version 0.0.2

## LSP Lint & Formatter Features

Esta versão adiciona funcionalidades completas de lint e formatação ao LSP do proto-typed DSL.

---

## 🎯 Novidades

### 1. **Sistema de Lint Expandido** (`src/core/editor/lint/lint-rules.ts`)

Sistema completo de validação semântica com 8 regras de lint:

#### Regras de Nomenclatura (Naming)
- **`duplicate-view-names`**: Detecta screens/modals/drawers com nomes duplicados
- **`duplicate-component-names`**: Detecta componentes com nomes duplicados

#### Regras de Referência (Reference)
- **`undefined-component-references`**: Verifica se componentes instanciados existem
  - Sugere componentes similares usando Levenshtein distance
- **`invalid-navigation-targets`**: Valida se navegação aponta para screens existentes
  - Sugere targets similares quando há erro de digitação

#### Regras de Estilo (Style)
- **`inconsistent-indentation`**: Detecta mistura de tabs e espaços
- **`invalid-css-variable-names`**: Valida formato de variáveis CSS (`--property-name`)

#### Regras de Boas Práticas (Best Practice)
- **`empty-blocks`**: Avisa sobre blocos vazios (views, components, layouts)
- **`unreachable-screens`**: Identifica screens que não são referenciadas em navegação

**Features:**
- Integração automática com ErrorBus
- Execução debounced (300ms) para performance
- Categorias de regras para execução seletiva
- Sugestões inteligentes baseadas em contexto

---

### 2. **Formatter Completo** (`src/core/editor/formatter/dsl-formatter.ts`)

Formatação automática de código com múltiplas estratégias:

#### Modos de Formatação
1. **Document Formatting** (Shift+Alt+F): Formata documento inteiro
2. **Range Formatting**: Formata apenas seleção
3. **On-Type Formatting**: Formata enquanto digita (`:` e `\n`)

#### Regras de Formatação
- **Normalização de Indentação**: Suporta tabs ou espaços (configurável)
- **Espaçamento Consistente**:
  - Buttons: `@variant-size [Label] -> Target`
  - Text: `# Heading` (um espaço após prefixo)
  - Layouts: `container:` (sem espaços antes do `:`)
  - Component instances: `$Component` (sem espaço após `$`)
  - Props: `%prop` (sem espaço após `%`)
- **Dois pontos (Colons)**: Adiciona automaticamente em blocos que requerem
- **Linhas em Branco**:
  - Adiciona separação entre blocos top-level
  - Remove linhas em branco excessivas (máx 2 consecutivas)
- **Final Newline**: Adiciona automaticamente (configurável)
- **Trailing Whitespace**: Remove por padrão (configurável)

#### Opções de Configuração
```typescript
{
  useTabs: boolean;              // Default: true
  tabSize: number;               // Default: 2
  insertFinalNewline: boolean;   // Default: true
  trimTrailingWhitespace: boolean; // Default: true
  maxLineLength: number;         // Default: 100
}
```

---

### 3. **Code Actions (Quick Fixes)** (`src/core/editor/actions/code-actions.ts`)

Sistema de correções automáticas integrado com a lâmpada 💡 do Monaco:

#### Quick Fixes Disponíveis

**Componentes Indefinidos:**
- Sugere componente similar baseado em Levenshtein
- Aplica correção automática com um clique

**Navegação Inválida:**
- Sugere screen de destino correto
- Corrige typos em targets de navegação

**Variante de Button Inválida:**
- Lista todas as variantes válidas
- Destaca sugestão mais próxima

**Tamanho de Button Inválido:**
- Oferece todos os tamanhos válidos (xs, sm, md, lg)

**Tipo de Input Inválido:**
- Sugere tipo correto (text, email, password, number, date, etc.)
- Lista todas as opções válidas

**Propriedades Obrigatórias Faltando:**
- Gera placeholder para props obrigatórias
- Adiciona indentação correta

**Blocos Vazios:**
- Opção 1: Adiciona conteúdo placeholder contextual
- Opção 2: Remove o bloco vazio

**Indentação Mista:**
- Converte para tabs
- Converte para espaços (2 por nível)

---

### 4. **Renderização de Erros Melhorada** (`src/core/editor/hooks/use-monaco-dsl.ts`)

Formato aprimorado de mensagens de erro:

**Antes (v0.0.1):**
```
[builder] Component 'Buttom' is not defined — Did you mean 'Button'?
```

**Agora (v0.0.2):**
```
[BUILDER] Component 'Buttom' is not defined (in ComponentInstance)
💡 Did you mean 'Button'?
📋 Error code: PT-REND-4004
```

**Melhorias:**
- Badge do stage em uppercase
- Contexto do tipo de nó
- Hint com emoji 💡
- Código de erro para referência 📋
- Formatação multi-linha para melhor legibilidade

---

## 🔧 Integrações

### Monaco Editor (`src/core/editor/index.ts`)

```typescript
// Inicialização completa do LSP
initializeMonacoDSL(monaco);

// Agora inclui:
// 1. Syntax highlighting (Monarch tokenizer)
// 2. IntelliSense (545 snippets)
// 3. Real-time diagnostics (ErrorBus)
// 4. Lint rules (8 regras)
// 5. Document formatter (3 modos)
// 6. Code actions (9 tipos de quick fixes)
```

### Hook React (`src/core/editor/hooks/use-monaco-dsl.ts`)

```typescript
const { monaco, isInitialized, error, editorRef, handleEditorMount } = useMonacoDSL();

// Recursos automáticos:
// - Lint debounced (300ms)
// - Markers em tempo real
// - Quick fixes ao passar mouse
```

---

## 📊 Estatísticas

**Linhas de Código Adicionadas:**
- `lint-rules.ts`: ~550 linhas
- `dsl-formatter.ts`: ~460 linhas
- `code-actions.ts`: ~550 linhas
- Total: ~1560 linhas de funcionalidade LSP

**Regras de Lint:** 8
**Quick Fixes:** 9 tipos
**Modos de Formatação:** 3

---

## 🚀 Como Usar

### Formatação
1. **Formatar documento inteiro**: Pressione `Shift+Alt+F` (Windows/Linux) ou `Shift+Option+F` (Mac)
2. **Formatar seleção**: Selecione o código e pressione `Shift+Alt+F`
3. **Formatar ao digitar**: Digite `:` ou quebra de linha para formatação automática

### Quick Fixes
1. Posicione o cursor sobre o erro (linha com marcador vermelho/amarelo)
2. Clique na lâmpada 💡 que aparece ou pressione `Ctrl+.` (Windows/Linux) ou `Cmd+.` (Mac)
3. Selecione a correção desejada da lista

### Lint
- **Automático**: Roda 300ms após parar de digitar
- **Categorias**: naming, reference, style, best-practice
- **Integrado**: Erros aparecem como markers no editor

---

## 🔍 Exemplos

### Exemplo 1: Componente Indefinido

**Código:**
```
screen Home:
  $Buttom
```

**Erro:**
```
[EDITOR] Component 'Buttom' is not defined (in ComponentInstance)
💡 Did you mean 'Button'?
📋 Error code: PT-REND-4004
```

**Quick Fix:**
- Change to 'Button' ← Correção sugerida

---

### Exemplo 2: Formatação

**Antes:**
```
screen Home:
# Title
> Text
@primary-lg[Click] ->Details
```

**Depois (Shift+Alt+F):**
```
screen Home:
	# Title
	> Text
	@primary-lg [Click] -> Details
```

---

### Exemplo 3: Bloco Vazio

**Código:**
```
screen Home:

screen About:
  # About
```

**Erro:**
```
[EDITOR] Empty screen block (in screen)
💡 Add content or remove this block
📋 Error code: PT-EDIT-5002
```

**Quick Fixes:**
- Add placeholder content
- Remove empty block

---

## 🛠️ Arquitetura

```
src/core/editor/
├── lint/
│   └── lint-rules.ts          ← 8 regras de validação semântica
├── formatter/
│   └── dsl-formatter.ts       ← Formatação automática (3 modos)
├── actions/
│   └── code-actions.ts        ← Quick fixes (9 tipos)
├── hooks/
│   └── use-monaco-dsl.ts      ← Integração (lint + markers)
└── index.ts                   ← Registro no Monaco
```

**Fluxo de Erros:**
```
1. User digita código
   ↓
2. Lint executa (debounced 300ms)
   ↓
3. ErrorBus.bulk(lintErrors)
   ↓
4. Monaco recebe erros via subscribe
   ↓
5. Markers aparecem no editor
   ↓
6. User clica na lâmpada 💡
   ↓
7. Code Actions geram quick fixes
   ↓
8. User seleciona fix
   ↓
9. Código é corrigido automaticamente
```

---

## ✅ Testes

**Build:**
```bash
npm run build
# ✅ Build passa (exceto erros de rede Google Fonts)
```

**Type Checking:**
```bash
# Nenhum erro TypeScript relacionado às novas features
```

---

## 📝 Notas de Desenvolvimento

- **Performance**: Lint usa debounce de 300ms para evitar execução excessiva
- **Dedupe**: ErrorBus evita duplicatas por chave composta
- **Extensibilidade**: Fácil adicionar novas regras de lint ou quick fixes
- **Manutenibilidade**: Código modular e bem documentado

---

## 🎯 Próximos Passos (v0.0.3)

Sugestões para próxima versão:
1. **Hover Provider**: Mostrar documentação ao passar mouse
2. **Go to Definition**: Navegar para definição de componentes
3. **Find References**: Encontrar usos de componentes/screens
4. **Rename Provider**: Renomear componentes/screens globalmente
5. **Semantic Highlighting**: Coloração baseada em semântica
6. **Folding Ranges**: Colapsar/expandir blocos
7. **Symbol Provider**: Outline de views e componentes

---

## 📄 Licença

Este projeto segue a mesma licença do proto-typed DSL.
