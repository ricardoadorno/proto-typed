# proto-typed

**DSL para prototipação rápida de interfaces** — Descreva em texto, visualize instantaneamente.

proto-typed transforma descrições textuais em protótipos navegáveis. Sem arrastar blocos, sem frameworks: você escreve o que a interface _é_ (telas, listas, botões), e o sistema cuida do resto.

🚀 **[Experimentar online](https://ricardoadorno.github.io/proto-typed/)** — Playground interativo com exemplos prontos

## Estrutura do Monorepo

Este projeto usa **pnpm workspaces** com 3 pacotes:

### 📦 Packages

#### [@proto-typed/core](./packages/core) - Features da Linguagem
Núcleo do DSL com:
- **Lexer**: Tokenização
- **Parser**: Geração de AST
- **Builder**: Transformação AST → React/React Native
- **Formatter**: Formatação de código
- **Linter**: Análise estática com regras configuráveis
- **Diagnostics**: Sistema LSP-compliant (Fases 1-4)
  - Fase 1: Registry de erros e tipos LSP
  - Fase 2: Armazenamento por documento
  - Fase 3: Regras de lint configuráveis
  - Fase 4: Code actions e quick fixes

#### [@proto-typed/web](./packages/web) - Playground e Docs
App Next.js SSG com:
- **Playground**: Editor Monaco interativo
- **Documentação**: Referência completa do DSL
- **Exemplos**: Apps de exemplo

#### [@proto-typed/extension](./packages/extension) - Extensão VSCode
Extensão VSCode (🚧 ainda não implementada):
- Syntax highlighting
- Integração LSP
- IntelliSense
- Quick fixes

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
- 🔍 **Diagnostics LSP**: 103 testes passando, sistema de diagnósticos completo

## Início rápido

### Pré-requisitos
- Node.js >= 18
- pnpm >= 8

### Instalação

```bash
# Clone o repositório
git clone https://github.com/ricardoadorno/proto-typed.git
cd proto-typed

# Instale dependências
pnpm install

# Inicie o servidor de desenvolvimento (playground web)
pnpm dev
```

O playground estará disponível em `http://localhost:3000`

### Comandos Disponíveis

```bash
# Desenvolvimento
pnpm dev                 # Inicia servidor web
pnpm build              # Build de todos os pacotes
pnpm build:core         # Build apenas do core
pnpm build:web          # Build apenas do web
pnpm test               # Roda testes do core
pnpm clean              # Limpa artifacts de build

# Comandos por pacote
pnpm --filter @proto-typed/core <comando>
pnpm --filter @proto-typed/web <comando>
```

## Estrutura do Projeto

```
proto-typed/
├── packages/
│   ├── core/              # DSL core (lexer, parser, builder, etc.)
│   │   ├── src/
│   │   │   ├── core/      # Lexer, parser, builder, formatter, linter
│   │   │   └── types/     # Definições de tipos TypeScript
│   │   ├── test/          # Arquivos de teste
│   │   └── package.json
│   │
│   ├── extension/         # Extensão VS Code (🚧 WIP)
│   │   └── package.json
│   │
│   └── web/              # Next.js playground + docs
│       ├── src/
│       │   ├── app/      # Next.js app router
│       │   ├── components/
│       │   └── lib/
│       └── package.json
│
├── pnpm-workspace.yaml   # Configuração de workspaces
└── package.json          # Root package.json
```

## Sintaxe DSL

### Exemplo Básico

```dsl
screen Home:
  title: "Bem-vindo"

  $Header(title: "Proto-Typed")

  Button:
    text: "Começar"
    navigate: Onboarding

  List:
    data: ["Item 1", "Item 2", "Item 3"]
```

### Componentes Reutilizáveis

```dsl
component Card(title, description):
  Container:
    background: "bg-white"
    padding: "p-4"

    Text:
      text: %title
      style: "font-bold text-lg"

    Text:
      text: %description

screen Dashboard:
  $Card(title: "Vendas", description: "R$ 10.000")
  $Card(title: "Pedidos", description: "150 novos")
```

## Documentação

- [Core Package](./packages/core/README.md)
- [Diagnostics Evolution](./packages/core/DIAGNOSTICS_EVOLUTION.md) - Arquitetura do sistema de diagnósticos
- [Formatter & Linter](./packages/core/FORMATTER_LINTER_DOCS.md) - Documentação do formatter e linter
- [Extension](./packages/extension/README.md)

## Testes

O projeto possui 103 testes passando cobrindo:
- Fase 1: 16 testes (tipos LSP e registry de erros)
- Fase 2: 28 testes (armazenamento por documento)
- Fase 3: 32 testes (regras configuráveis)
- Fase 4: 27 testes (code actions e quick fixes)

```bash
pnpm test
```

## Contribuindo

Contribuições são bem-vindas! Por favor, leia nossas diretrizes de contribuição primeiro.

## Licença

MIT

---

Feito com ❤️ usando TypeScript, Chevrotain, Next.js, e Monaco Editor.
