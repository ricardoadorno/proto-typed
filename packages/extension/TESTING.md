# Como Testar a Extensão Proto-Typed VSCode

## 🚀 Compilar e Executar

### 1. Compilar a extensão

```bash
# Na pasta raiz do projeto
pnpm run compile

# OU diretamente na pasta da extensão
cd packages/extension
pnpm run compile
```

### 2. Iniciar a extensão em modo de desenvolvimento

**Opção A: Usar F5**

1. Abra a pasta raiz do projeto no VSCode
2. Pressione `F5` (ou vá em `Run > Start Debugging`)
3. Isso abrirá uma nova janela do VSCode com a extensão carregada

**Opção B: Usar Command Palette**

1. Pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
2. Digite "Debug: Start Debugging"
3. Selecione "Run Extension"

## 🎨 Testar Syntax Highlighting

### 1. Abrir um arquivo .pty

Na janela de desenvolvimento que abriu:

1. Abra o arquivo `example.pty` (que está em `packages/extension/example.pty`)
2. OU crie um novo arquivo com extensão `.pty`

### 2. O que observar

O syntax highlighting deve colorir:

- ✅ **Palavras-chave**: `app`, `screen`, `component`, `modal`, `drawer`, `flow`, etc.
- ✅ **Strings**: Texto entre aspas duplas
- ✅ **Comentários**: Linhas começando com `//`
- ✅ **Propriedades**: `props`, `theme`, `action`, `to`, etc.
- ✅ **Modificadores**: `centered`, `padded`, `fullWidth`, etc.
- ✅ **Tipos de input**: `email`, `password`, `text`, etc.
- ✅ **Variantes**: `primary`, `secondary`, `danger`, etc.

### 3. Testar autocomplete/snippets

Digite no arquivo .pty:

- `scr` + Tab → Cria um template de screen
- `btn` + Tab → Cria um button
- `stk` + Tab → Cria um stack
- `crd` + Tab → Cria um card

## 👁️ Testar o Preview (WebviewPanel)

### 1. Botão no editor

Quando você abrir um arquivo `.pty`, verá um ícone de preview (📄) no canto superior direito do editor.

1. Clique no ícone de preview
2. Uma nova aba se abrirá ao lado mostrando o HTML renderizado

### 2. Command Palette

Alternativamente:

1. Pressione `Ctrl+Shift+P`
2. Digite "Proto-Typed: Open Preview to the Side"
3. Pressione Enter

### 3. Preview em tempo real

- Faça alterações no arquivo `.pty`
- O preview deve atualizar automaticamente
- Se houver erros de parsing, verá uma mensagem de erro no preview
- O logo do Proto-Typed aparece no cabeçalho do preview

## 🔍 Debug

### Ver logs da extensão

1. Na janela de desenvolvimento, abra o Developer Tools: `Help > Toggle Developer Tools`
2. Vá na aba "Console"
3. Veja os logs de erro ou avisos

### Modificar e recarregar

Se você fizer alterações no código da extensão (`src/extension.ts`):

1. Recompile: `pnpm run compile`
2. Na janela de desenvolvimento, pressione `Ctrl+R` (ou `Cmd+R`) para recarregar
3. OU use `Developer: Reload Window` na Command Palette

### Modo watch (desenvolvimento ativo)

Para recompilar automaticamente ao fazer alterações:

```bash
cd packages/extension
pnpm run watch
```

## 📦 Testar como usuário final

### Empacotar a extensão

```bash
cd packages/extension
npx @vscode/vsce package
```

Isso criará um arquivo `.vsix` que pode ser instalado manualmente:

1. No VSCode, vá em Extensions
2. Clique nos "..." no topo
3. Selecione "Install from VSIX..."
4. Escolha o arquivo `.vsix` gerado

## ✅ Checklist de testes

- [ ] Syntax highlighting funciona em arquivos `.pty`
- [ ] Ícone do Proto-Typed aparece nos arquivos `.pty`
- [ ] Botão de preview aparece no canto superior direito
- [ ] Preview abre em uma coluna ao lado
- [ ] Logo do Proto-Typed aparece no cabeçalho do preview
- [ ] Preview atualiza em tempo real ao editar
- [ ] Snippets funcionam (Tab completion)
- [ ] Comentários são reconhecidos
- [ ] Erros de parsing mostram mensagem no preview
- [ ] Extension só ativa quando arquivo `.pty` é aberto
- [ ] Múltiplos arquivos `.pty` podem ser abertos simultaneamente

## 🐛 Problemas comuns

### Preview não abre

- Verifique se o arquivo tem extensão `.pty`
- Veja o console de erros (Developer Tools)
- Confirme que a compilação foi bem-sucedida

### Syntax highlighting não funciona

- Verifique se o arquivo foi salvo com extensão `.pty`
- Tente fechar e reabrir o arquivo
- Verifique se a linguagem está definida como "Proto-Typed" (canto inferior direito)

### Logo não aparece

- Verifique se o arquivo `logo.svg` existe em `packages/extension/`
- Compile novamente a extensão
- Recarregue a janela de desenvolvimento

### Mudanças no código não aparecem

- Certifique-se de ter recompilado (`pnpm run compile`)
- Recarregue a janela de desenvolvimento (`Ctrl+R`)
