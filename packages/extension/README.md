# 🚀 Proto-Typed VS Code Extension

Extensão completa para a DSL Proto-Typed com syntax highlighting, IntelliSense e preview em tempo real.

## ✨ Features

### 🎨 Syntax Highlighting

- **Tema:** Proto-Typed Dark
- **Cores semânticas:**
  - Views (`screen`, `modal`, `drawer`) - Vermelho bold
  - Nomes de views/components - Cyan bold
  - Layouts (`row`, `col`, `grid`) - Rosa bold
  - Typography (`#`, `>`, `>>`) - Verde
  - Buttons (`@`) - Azul bold
  - Forms (`___`) - Roxo
  - Delimitadores (`|`, `:`, `[]`, `{}`) - Amarelo

### 💡 IntelliSense

- Completions context-aware
- Trigger characters: `@`, `#`, `>`, `_`, `$`, `%`
- Snippets com tab stops
- Documentação rica com exemplos
- 50+ sugestões de código

### 📺 Preview

- Live reload automático
- Device mockup (iPhone)
- Navegação entre screens
- Renderização via `@proto-typed/core`

## 🎯 Como Testar

### 1. Compilar

```bash
pnpm compile:extension
```

### 2. Iniciar Extension Development Host

1. Abra VS Code no diretório raiz
2. Pressione **F5**
3. Nova janela abrirá

### 3. Abrir Arquivo de Teste

- Abra: `packages/extension/test.pty`
- Veja o **QUICK-START.md** para guia completo

### 4. Ativar Tema

- `Ctrl+K Ctrl+T` → "Proto-Typed Dark"

### 5. Testar IntelliSense

- Digite `sc` + `Ctrl+Space` → Selecione "screen"
- Digite `@` → Lista de botões aparece

### 6. Abrir Preview

- Clique no ícone 📄 no canto superior direito
- Ou: `Ctrl+Shift+P` → "Proto-Typed: Open Preview"

## 📁 Estrutura

```
packages/extension/
├── src/
│   ├── extension.ts              # Entry point
│   ├── getWebviewContent.ts      # Preview HTML
│   └── language/
│       └── completion.ts         # IntelliSense provider
├── syntaxes/
│   └── proto-typed.tmLanguage.json  # TextMate grammar
├── themes/
│   └── proto-typed-dark.json     # Tema escuro
├── snippets/
│   └── snippets.json             # Code snippets
├── language-configuration.json   # Config da linguagem
├── test.pty                      # Arquivo de teste completo
├── QUICK-START.md               # Guia rápido
└── package.json                 # Manifesto da extensão
```

## 🔧 Implementação

### TextMate Grammar

- **Arquivo:** `syntaxes/proto-typed.tmLanguage.json`
- Baseado nas regras Monarch do Monaco Editor
- Scopes semânticos para cada token
- Suporta todos os elementos da DSL

### Completion Provider

- **Arquivo:** `src/language/completion.ts`
- Context-aware (baseado na posição do cursor)
- Trigger characters automáticos
- Rich snippets com tab stops
- Documentação em Markdown

### Tema

- **Arquivo:** `themes/proto-typed-dark.json`
- Cores idênticas ao Monaco web
- Esquema de cores semântico
- Alto contraste para legibilidade

### Webview Preview

- **Arquivo:** `src/getWebviewContent.ts`
- Device mockup (iPhone)
- Live reload automático
- Navegação entre screens
- Integração com `@proto-typed/core`

## 📝 Diferenças em Relação ao Monaco Web

### ✅ Implementado

- Syntax highlighting (via TextMate grammar)
- IntelliSense (via Completion Provider)
- Tema dark
- Preview com live reload
- Navegação entre screens

### ❌ Não Aplicável

- ErrorBus integration (VS Code usa DiagnosticCollection)
- Monaco-specific APIs (React hooks, etc.)
- Editor options (configurável via settings.json)

### ⏳ Futuras Melhorias

- Hover Provider (documentação ao passar mouse)
- Definition Provider (go to definition)
- Diagnostic Provider (erros inline)
- Formatting Provider (auto-format)
- Color Provider (preview de cores CSS)
- Folding Provider (colapsar blocos)

## 🎨 Elementos Suportados

### Views

- `screen Name:`
- `modal Name:`
- `drawer Name:`

### Components

- `component Name:`
- `$ComponentInstance`
- `%propName`

### Typography

- `# Heading 1` até `###### Heading 6`
- `> Paragraph`
- `>> Text`
- `>>> Muted text`
- `*> Note`
- `"> Quote`

### Buttons

- `@[Text](action)` - Default
- `@primary[Text](action)`
- `@secondary[Text](action)`
- `@ghost[Text](action)`
- `@outline[Text](action)`
- `@destructive[Text](action)`
- `@[Text]{icon}(action)` - Com ícone

### Links & Images

- `@link[Link Text](destination)`
- `![Alt Text](url)`
- `i-IconName` - Ícones Lucide

### Forms

- `___:Label{Placeholder}` - Input
- `___*:Password{...}` - Password
- `___:Label{...}[Opt1 | Opt2]` - Select
- `[X]` / `[ ]` - Checkbox
- `(X)` / `( )` - Radio

### Layouts

- `row:`, `col:`, `grid:`, `container:`, `card:`

### Structures

- `list:` com `- items`
- `header:`
- `navigator:` com `- Label | Destination`
- `fab{icon}(action)`
- `---` - Separator

### Styles

- `styles:` com `--custom-property: value;`

## 🚫 Observações Importantes

- **Não há suporte a comentários** na linguagem
- Use text plain ou outros elementos visuais para documentação
- Indentação é significativa (use tabs ou espaços consistentes)
- Arquivos devem ter extensão `.pty`

## 📚 Documentação

- **QUICK-START.md** - Guia de início rápido
- **test.pty** - Arquivo de teste com todos os elementos
- **package.json** - Configuração e comandos

## 🛠️ Comandos

```bash
# Compilar
pnpm compile:extension

# Typecheck
pnpm --filter @proto-typed/extension run typecheck

# Lint
pnpm --filter @proto-typed/extension run lint

# Watch mode (desenvolvimento)
pnpm --filter @proto-typed/extension run watch
```

## 📊 Status

✅ **Pronto para uso!**

- Syntax highlighting: ✅
- IntelliSense: ✅
- Tema: ✅
- Preview: ✅
- Live reload: ✅
- Navegação: ✅

## 🎉 Teste Agora!

```bash
# 1. Compile
pnpm compile:extension

# 2. Abra no VS Code
code .

# 3. Pressione F5

# 4. Abra test.pty

# 5. Divirta-se! 🚀
```
