# Proto-Typed VSCode Extension

Extensão VSCode para syntax highlighting e preview da linguagem Proto-Typed DSL (`.pty`).

## 🚀 Desenvolvimento

### Pré-requisitos

```bash
pnpm install
```

### Compilar

```bash
# Na raiz do projeto
pnpm run compile

# Ou diretamente nesta pasta
cd packages/extension
pnpm run compile
```

### Executar em modo desenvolvimento

1. Abra a **pasta raiz do projeto** no VSCode
2. Pressione `F5` (ou Run > Start Debugging)
3. Uma nova janela do VSCode abrirá com a extensão carregada
4. Nessa janela, abra um arquivo `.pty` (ex: `example.pty`)
5. Clique no ícone de preview no canto superior direito 📄
6. O logo do Proto-Typed aparecerá no cabeçalho do preview

### Recursos

- ✅ **Syntax Highlighting**: Cores automáticas para palavras-chave, strings, comentários em arquivos `.pty`
- ✅ **Ícone de arquivo**: Logo do Proto-Typed para arquivos `.pty`
- ✅ **Preview em tempo real**: Botão no canto superior direito abre preview HTML
- ✅ **Logo no preview**: Cabeçalho visual com logo do Proto-Typed
- ✅ **Snippets**: Autocomplete para estruturas comuns (screen, button, etc.)
- ✅ **Validação**: Erros de parsing mostrados no preview

### Estrutura

```
packages/extension/
├── src/
│   ├── extension.ts          # Código principal da extensão
│   └── getWebviewContent.ts  # Template HTML do preview
├── syntaxes/
│   └── proto-typed.tmLanguage.json  # Regras de syntax highlighting
├── snippets/
│   └── snippets.json         # Code snippets
├── dist/                     # Arquivos compilados (gerados)
├── logo.svg                 # Logo do Proto-Typed
├── example.pty              # Arquivo de exemplo para testes
└── TESTING.md               # Guia detalhado de testes

```

## 📝 Comandos disponíveis

- **Proto-Typed: Open Preview to the Side**: Abre preview ao lado do editor atual
  - Atalho: Clique no ícone 📄 no canto superior direito
  - Ou: `Ctrl+Shift+P` > "Proto-Typed: Open Preview to the Side"

## 🐛 Troubleshooting

### Comando não encontrado

```bash
# Compile a extensão
pnpm run compile
# Depois pressione F5
```

### Preview não atualiza

- Salve o arquivo `.ptd`
- Ou feche e reabra o preview

### Mudanças no código não aparecem

1. Recompile: `pnpm run compile`
2. Na janela de desenvolvimento: `Ctrl+R` (ou `Cmd+R`)
3. Ou: `Ctrl+Shift+P` > "Developer: Reload Window"

### Erro ao ativar extensão

Certifique-se de que:

1. O pacote `@proto-typed/core` está compilado: `cd ../core && pnpm run build`
2. A extensão está compilada: `pnpm run compile`
3. As dependências estão instaladas: `pnpm install` (na raiz)

## 📦 Build para produção

Para criar um pacote `.vsix` instalável:

```bash
# Instalar o empacotador (se necessário)
pnpm add -D @vscode/vsce

# Criar o pacote
npx @vscode/vsce package
```

Isso criará um arquivo `proto-typed-vscode-0.0.1.vsix` que pode ser instalado em qualquer VSCode.
