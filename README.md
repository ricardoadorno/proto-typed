# proto-typed

**DSL para prototipação rápida de interfaces** — Descreva em texto, visualize instantaneamente.

proto-typed transforma descrições textuais em protótipos navegáveis. Sem arrastar blocos, sem frameworks: você escreve o que a interface _é_ (telas, listas, botões), e o sistema cuida do resto.

🚀 **[Experimentar online](https://ricardoadorno.github.io/proto-typed/)** — Playground interativo com exemplos prontos

## O que é?

Uma ferramenta que converte texto estruturado em interfaces interativas. Você descreve conteúdo, estrutura e navegação; ela gera HTML com Tailwind + shadcn. Pense em Markdown para UIs — semântica antes de aparência.

**Feito para**:

- **Designers** que querem prototipar fluxos sem código
- **PMs** criando mockups clicáveis para apresentações
- **Devs backend/full-stack** montando telas sem mergulhar em CSS/JSX
- **IAs e agentes** colaborando em um formato textual estável e versionável

## Recursos principais

- 🚀 **Preview em tempo real**: veja mudanças instantaneamente
- 📱 **Mobile-first**: headers, navegadores, modais e drawers nativos
- 🎨 **Sistema de temas**: tokens CSS customizáveis (shadcn)
- 🧩 **Componentes reutilizáveis**: blocos com interpolação de props
- 🔗 **Navegação completa**: transições entre telas, modais, drawers
- 📝 **Monaco Editor**: destaque de sintaxe, IntelliSense, detecção de erros
- 📤 **Exportação**: HTML standalone (Tailwind CDN + Lucide icons)
- 🤖 **IA-friendly**: sintaxe estável e previsível para modelos

## Início rápido

### Testar online

Experimente imediatamente no playground: **[ricardoadorno.github.io/proto-typed](https://ricardoadorno.github.io/proto-typed/)**

A interface online oferece:

- Editor Monaco com sintaxe DSL e autocomplete
- Preview em tempo real
- Exemplos pré-carregados (Contacts App, Login, Navigator)
- Exportação de HTML standalone
- Seletor de dispositivo para simular diferentes telas

### Instalação local

```bash
# Clone o repositório
git clone https://github.com/ricardoadorno/proto-typed.git
cd proto-typed

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O app abre em `http://localhost:3000` (Next.js) com interface dividida:

- **Esquerda**: Monaco editor com sintaxe DSL
- **Direita**: Preview em tempo real com seletor de dispositivo

### Seu primeiro protótipo

```dsl
screen Home:
  container:
    # Olá, mundo
    > Este é seu primeiro protótipo
    @[Começar](Proxima)

screen Proxima:
  container:
    # Sucesso!
    > Você acabou de navegar entre telas
    @[Voltar](-1)
```

**Pronto!** Você tem um protótipo navegável de duas telas.

## Como funciona

proto-typed usa um pipeline **Lexer → Parser → AST → Renderizador**:

1. **Lexer** tokeniza o texto DSL (Chevrotain)
2. **Parser** constrói uma Árvore Sintática Abstrata (AST)
3. **Renderizador** converte AST em HTML com Tailwind CSS + variáveis shadcn
4. **Preview** exibe o resultado em moldura de dispositivo simulado

Seu texto é transformado em HTML semântico com navegação, temas e layout responsivo — sem build step, sem lock-in de framework.

## Stack tecnológica

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Parsing**: Chevrotain (lexer & parser)
- **Editor**: Monaco Editor com linguagem DSL customizada
- **Styling**: Tailwind CSS + sistema de temas shadcn
- **Output**: HTML standalone com dependências CDN

## Sintaxe DSL

A DSL usa sintaxe intuitiva e legível, inspirada em Markdown e padrões comuns de UI.

### Telas e views

```dsl
screen Home:
  container:
    # Bem-vindo
    > Conteúdo principal aqui

modal Dialogo:
  card:
    # Confirmação
  @[OK](close)

drawer Menu:
  list:
  - [Home](Home)
    - [Configurações](Settings)
```

### Tipografia

```dsl
# a ######  → Títulos (H1-H6)
>           → Parágrafo
>>          → Texto (sem margem inferior)
>>>         → Texto secundário/muted
*>          → Texto de nota
">          → Citação
```

### Botões

Padrão: `@<variante>?-<tamanho>?\[texto\]\(ação\)`

**Variantes** (opcional, padrão: primary):

- `@primary`, `@secondary`, `@outline`, `@ghost`, `@destructive`, `@link`, `@success`, `@warning`

**Tamanhos** (opcional, padrão sem modificador):

- `-small`, `-icon`, `-large`

```dsl
@[Botão padrão](acao)
@secondary-large[Botão secundário grande](acao)
@outline-small[Cancelar pequeno](acao)
@destructive[Excluir](delete)
```

### Formulários

Padrão: `___[<tipo>?: Label][placeholder[opções]] | atributos`

**Tipos de input**: `email`, `password`, `date`, `number`, `textarea`

```dsl
___[Email][Digite o email]
___email[Email][Digite o email]
___password[Senha][Digite a senha]
___[País][Selecione[Brasil | Portugal | Angola]]

[X] Checkbox marcado
[ ] Checkbox desmarcado
(X) Radio selecionado
( ) Radio não selecionado
```

### Layouts

Tokens canônicos mapeados para classes Tailwind/shadcn:

| Token | Grupo | Descrição curta | Classes base |
| --- | --- | --- | --- |
| `container` | Containers | Largura equilibrada para páginas gerais | `container mx-auto max-w-4xl px-6` |
| `container-narrow` | Containers | Coluna de leitura ou formulários longos | `container mx-auto max-w-2xl px-6` |
| `container-wide` | Containers | Dashboards, coleções amplas | `container mx-auto max-w-6xl px-8` |
| `container-full` | Containers | Layout fluido ocupando 100% | `mx-auto w-full px-4 sm:px-8` |
| `stack` | Stack (vertical) | Blocos verticais com gap médio | `flex flex-col gap-6` |
| `stack-tight` | Stack (vertical) | Densidade alta para listas curtas | `flex flex-col gap-3` |
| `stack-loose` | Stack (vertical) | Espaço generoso entre seções | `flex flex-col gap-8` |
| `stack-none` (`stack-flush`) | Stack (vertical) | Sem gap entre itens empilhados | `flex flex-col gap-0` |
| `row` | Row (horizontal) | Linha padrão com alinhamento central | `flex flex-row items-center gap-6` |
| `row-start` | Row (horizontal) | Conteúdo alinhado ao topo/esquerda | `flex flex-row items-start gap-4` |
| `row-center` | Row (horizontal) | Centralização total | `flex flex-row items-center justify-center gap-4` |
| `row-between` | Row (horizontal) | Distribui itens com espaço entre | `flex flex-row items-center justify-between gap-4` |
| `row-end` | Row (horizontal) | Ações alinhadas à direita | `flex flex-row items-center justify-end gap-4` |
| `grid` | Grid | Uma coluna responsiva base | `grid grid-cols-1 gap-6` |
| `grid-2` | Grid | Duas colunas em `md` | `grid grid-cols-1 md:grid-cols-2 gap-6` |
| `grid-3` | Grid | Três colunas para catálogos | `grid grid-cols-1 md:grid-cols-3 gap-6` |
| `grid-4` | Grid | Quatro colunas em telas largas | `grid grid-cols-1 lg:grid-cols-4 gap-6` |
| `grid-responsive` (`grid-auto`) | Grid | Auto fit com `minmax(16rem,1fr)` | `grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6` |
| `layer-static` | Layer / Position | Mantém fluxo padrão | `static` |
| `layer-relative` | Layer / Position | Referência para elementos absolutos | `relative` |
| `layer-absolute` | Layer / Position | Posiciona dentro do ancestral relativo | `absolute inset-0` |
| `layer-fixed` | Layer / Position | Fixa na viewport | `fixed inset-0` |
| `layer-sticky` | Layer / Position | Mantém sticky dentro do container | `sticky top-0` |
| `layer-overlay` | Layer / Position | Sobreposição com blur leve | `fixed inset-0 z-50 bg-background/80 backdrop-blur-sm` |
| `scroll-auto` | Overflow | Usa overflow padrão para ambos eixos | `overflow-auto` |
| `scroll-x` | Overflow | Habilita scroll horizontal | `overflow-x-auto` |
| `scroll-y` | Overflow | Habilita scroll vertical | `overflow-y-auto` |
| `scroll-hidden` | Overflow | Esconde qualquer overflow | `overflow-hidden` |
| `card` | Cards | Card padrão para blocos de conteúdo | `border rounded-lg p-6` |
| `card-compact` | Cards | Versão enxuta para listas densas | `border rounded-lg p-4` |
| `card-feature` | Cards | Card destacado com borda dupla | `border-2 rounded-xl p-8 shadow-lg` |
| `header` | Special | Cabeçalho fixo com borda | `sticky top-0 z-10 border-b px-6` |
| `sidebar` | Special | Nave lateral fixa | `fixed h-full border-r p-4 pt-8` |
Compatibilidade: `stack-flush` e `grid-auto` seguem aceitos como aliases.

```dsl
container-narrow:
  stack-loose:
    card:
      ## Perfil
      stack-tight:
        row-between:
          > Nome
          > @proto
    layer-overlay:
      scroll-y:
        card:
          ### Alterar avatar
          > Upload limitado a 2 MB
```

### Componentes com props

```dsl
component UserCard:
  card:
    ## %nome
    > Email: %email
    > Telefone: %telefone

screen Usuarios:
  list $UserCard:
    - João | joao@email.com | (11) 98765-4321
    - Maria | maria@email.com | (21) 97654-3210
```

Props são separados por pipe (`|`) e interpolados com `%nomeProp`.

### Navegação

```dsl
@[Ir para tela](NomeTela)      → Navegar para tela
@[Abrir modal](NomeModal)      → Alternar modal
@[Abrir drawer](NomeDrawer)    → Alternar drawer
@[Voltar](-1)                  → Voltar no histórico
@link[Link externo](https://...)   → URL externa
```

### Componentes mobile

```dsl
header:
  # Nome do App
  @ghost[Menu](menu)

navigator:
  - Home | Home
  - Perfil | Profile

fab:
  - + | adicionarItem
```

## Exemplo completo

Um app completo com navegação, componentes, modais e listas:

```dsl
component Cabecalho:
  header:
    # AppTarefas
    @ghost[Menu](MenuPrincipal)

modal ConfirmarExclusao:
  card:
    # Excluir tarefa?
    > Esta ação não pode ser desfeita
    row-end:
      @ghost[Cancelar](close)
      @destructive[Excluir](delete)

drawer MenuPrincipal:
  list:
    - Dashboard | Dashboard
    - Tarefas | Tarefas
    - Configurações | Settings

screen Dashboard:
  $Cabecalho

  container:
    card:
      ## Bem-vindo de volta
      > Você tem 5 tarefas pendentes

    grid-2:
      card:
        ### Ativas
        # 12
      card:
        ### Concluídas
        # 48

screen Tarefas:
  $Cabecalho

  container:
    @[Adicionar tarefa](AddTask)

  list:
      - Configurar projeto | Vence: Hoje | @outline[Editar](edit) | @destructive[Excluir](ConfirmarExclusao)
      - Revisar código | Vence: Amanhã | @outline[Editar](edit) | @destructive[Excluir](ConfirmarExclusao)
      - Deploy app | Vence: Sexta | @outline[Editar](edit) | @destructive[Excluir](ConfirmarExclusao)

  navigator:
    - Dashboard | Dashboard
    - Tarefas | Tarefas
    - Config | Settings
```

## Arquitetura

```
src/
├── app/              # Next.js app directory
├── components/       # React UI components for the editor
├── app/              # Next.js app directory
├── components/       # React UI components for the editor
├── core/
│   ├── lexer/          # Tokenização (Chevrotain)
│   ├── parser/         # Regras gramaticais & construção da AST
│   ├── renderer/       # Conversão AST → HTML
│   │   ├── core/       # node-renderer, route-manager, theme-manager
│   │   ├── infrastructure/  # Gateways, mediators, helpers
│   │   └── nodes/      # Renderizadores específicos de elementos
│   ├── editor/         # Integração com Monaco editor
│   └── themes/         # Sistema de temas baseado em shadcn
├── components/         # Componentes React da UI
├── examples/          # Código de exemplo DSL
├── types/             # Definições TypeScript
└── utils/             # Funções auxiliares
```

### Pipeline de renderização

1. **Lexer** (`lexer/tokens/`) - Tokeniza texto DSL em tokens estruturados
2. **Parser** (`parser/`) - Constrói Árvore Sintática Abstrata (AST) a partir dos tokens
3. **Route Manager** - Processa screens, modais, drawers, componentes
4. **Theme Manager** - Mescla temas shadcn com estilos customizados
5. **Node Renderer** - Converte nós AST em HTML com navegação
6. **Output** - HTML standalone ou fragmento de preview

### Padrões de design

- **Strategy Pattern**: Mapeamento tipo de nó → função renderizadora
- **Facade Pattern**: RouteManagerGateway simplifica APIs complexas
- **Mediator Pattern**: NavigationMediator desacopla lógica de navegação
- **Singleton Pattern**: Gerenciadores globais de rotas e temas

## Para desenvolvedores

### Filosofia do projeto

- **Validação em runtime** ao invés de testes automatizados
- **Apenas modo escuro** - sem suporte a tema claro
- **Temas shadcn** - variáveis CSS para todas as cores
- **Sem cores hardcoded** - sempre use tokens semânticos
- **Type-safe** - Cobertura completa TypeScript

### Adicionando novos elementos DSL

1. **Token** (`lexer/tokens/*.tokens.ts`) - Definir padrão regex
2. **Parser** (`parser/parser.ts`) - Adicionar regra gramatical
3. **Builder** (`parser/builders/*.builders.ts`) - Conversão CST → AST
4. **Renderer** (`renderer/nodes/*.node.ts`) - Renderização AST → HTML
5. **Types** (`types/ast-node.ts`) - Adicionar ao union NodeType

**Exemplo**: Adicionando um elemento badge

```typescript
// 1. Token (lexer/tokens/primitives.tokens.ts)
export const Badge = createToken({
  name: 'Badge',
  pattern: /badge\[([^\]]+)\]/,
})

// 2. Builder (parser/builders/primitives.builders.ts)
export function buildBadgeElement(ctx: Context) {
  const match = ctx.Badge[0].image.match(/badge\[([^\]]+)\]/)
  return {
    type: 'Badge',
    props: { text: match?.[1] || '' },
    children: [],
  }
}

// 3. Renderer (renderer/nodes/primitives.node.ts)
export function renderBadge(node: AstNode): string {
  const { text } = node.props as any
  return `<span class="badge" style="background-color: var(--primary);">${text}</span>`
}

// 4. Adicionar ao mapa RENDERERS (renderer/core/node-renderer.ts)
const RENDERERS: Record<NodeType, typeof _render> = {
  // ... renderizadores existentes
  Badge: (n) => renderBadge(n),
}
```

### Estilo de código

**Tailwind CSS**:

- ✅ Apenas classes base: `flex items-center px-4 py-2`
- ❌ Sem cores hardcoded: `bg-blue-500 text-white`
- ❌ Sem prefixos dark mode: `dark:bg-gray-900`

**Variáveis CSS** (shadcn):

- ✅ Tokens semânticos: `var(--primary)`, `var(--muted-foreground)`
- ✅ Elementos UI: `var(--border)`, `var(--input)`, `var(--ring)`
- ❌ Nomes de cores: `var(--blue-500)`, `var(--gray-800)`

### Contribuindo

1. Faça fork do repositório
2. Crie uma branch de feature: `git checkout -b feature/novo-elemento`
3. Faça mudanças seguindo o estilo de código
4. Teste no app rodando (sem testes automatizados)
5. Envie um pull request

Veja `.github/copilot-instructions.md` para diretrizes completas de desenvolvimento.

## Licença

Licenciado sob Apache License 2.0. Veja [LICENSE](LICENSE) para detalhes.

```
Copyright 2025 Ricardo Adorno

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## Agradecimentos

- **shadcn/ui** - Inspiração para o sistema de temas
- **Chevrotain** - Biblioteca de parsing
- **Monaco Editor** - Componente de editor de código
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide Icons** - Sistema de ícones
