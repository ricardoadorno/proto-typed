SUPER PROMPT — proto-typed (Docs + Playground) 

Papel do agente: engenheiro front-end sênior.
Stack obrigatória: Next 15, React, TailwindCSS, shadcn/ui (Radix).
Princípios: dark-first, performance, simplicidade, consistência de tokens, DX top.

0) Contexto e metas

Unificar identidade visual do proto-typed em Docs e Playground.

Importante, manter sempre foco no uso de SSG Next, esse App jamais terá SSR.

Substituir referências e “verde Vue” por roxo proto.

Sidebar (Docs) deve ser scrollable, enxuta, sem accordion.

TOC (Docs) deve ser mais discreto, ocupar menos espaço, com scrollspy sutil.

O Playground terá Header/Footer globais e foco em debug e customização.

Sempre priorizar Tailwind + shadcn/ui, evitando libs alternativas quando houver componente equivalente.

1) Fundações (tokens, Tailwind, shadcn)

[ ] Configure Tailwind e shadcn/ui (se já existirem, revisar e alinhar com abaixo).
[ ] Adicione CSS variables e Tailwind theme para a paleta e espaçamentos.

1.1. CSS variables (globals.css)
:root {
  /* Neutros (dark-first) */
  --bg-main: #0E0F12;
  --bg-surface: #15171C;
  --bg-raised: #1B1E25;
  --fg-primary: #E7E9EF;
  --fg-secondary: #A9AFBF;
  --border-muted: #252932;

  /* Marca (proto) */
  --brand-300: #A78BFA;
  --brand-400: #8B5CF6; /* accent */
  --brand-500: #7C3AED;
  --brand-600: #6D28D9;
  --brand-700: #5B21B6;

  /* Estados */
  --info: #60A5FA;
  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;

  --radius: 0.625rem; /* 10px */
}

1.2. tailwind.config.ts (trecho essencial)
theme: {
  container: { center: true, padding: "1rem" },
  extend: {
    colors: {
      background: "var(--bg-main)",
      surface: "var(--bg-surface)",
      raised: "var(--bg-raised)",
      foreground: "var(--fg-primary)",
      muted: "var(--fg-secondary)",
      border: "var(--border-muted)",
      brand: {
        300: "var(--brand-300)",
        400: "var(--brand-400)",
        500: "var(--brand-500)",
        600: "var(--brand-600)",
        700: "var(--brand-700)",
      },
      info: "var(--info)",
      success: "var(--success)",
      warning: "var(--warning)",
      danger: "var(--danger)",
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    boxShadow: {
      raised: "0 6px 24px rgba(0,0,0,.28)",
    },
    maxWidth: {
      prose: "75ch",
    },
  },
}

1.3. Tipografia e ritmo (aplicar via utilitários Tailwind)

Body: text-[16px] leading-7 text-foreground.

Títulos: h1:text-3xl/8 font-bold, h2:text-2xl/7 font-semibold, h3:text-xl/7 font-medium.

Parágrafo: max-w-prose.

Espaços escala: 4, 8, 12, 16, 24, 32, 48.

2) Layout Global (Header + Footer)

[ ] Criar layout root compartilhado (Docs/Playground) com Header e Footer fixos.

2.1. Header (shadcn)

Componentes: NavigationMenu, Separator, ThemeToggle (Switch ou Button), Avatar.

Estrutura:

Esquerda: logo proto-typed (SVG) → rota “/”.

Centro: links Docs, Playground, Templates, Changelog.

Direita: tema (☾/☀), idioma (opcional), avatar/conta.

Estilos: sticky top, backdrop-blur, borda border-border, hover text-brand-300, ativo text-brand-400 underline underline-offset-8.

Acessos rápidos: Cmd/Ctrl+K → CommandDialog (shadcn).

2.2. Footer

Quatro colunas com Grid + Separator superior.

Links mudam de text-muted → text-brand-300 no hover.

Linha final com ©, versão do app e “Status”.

3) Template de página Docs

[ ] Implementar grid 3 colunas responsivo com Sidebar (scrollable), Conteúdo (prose) e TOC discreto.

3.1. Grid & larguras (desktop ≥1280px)

Sidebar: w-60 (240px), shadcn/ScrollArea, sticky top-[64px], h-[calc(100vh-64px)], pr-2.

Conteúdo: min-w-0 flex-1 max-w-[860px] (ou max-w-prose).

TOC: w-56 (224px), sticky top-[96px], h-[calc(100vh-96px)], opacity-90.

Obs: Sidebar e TOC devem parecer “estreitos” comparados ao conteúdo e nunca pressionar a largura do texto.

3.2. Sidebar (ENXUTA, sem accordion)

Componentes: ScrollArea, Separator.

Estrutura:

“Conteúdo” (label pequena, uppercase, text-muted).

Lista plana com seções e subitens com indentação sutil (pl-2 / pl-5).

Estilos:

Item normal: text-muted hover:text-foreground hover:bg-brand-400/10 rounded-md px-2 h-9 flex items-center.

Item ativo: pill bg-brand-400/15 text-foreground border-l-2 border-brand-400.

Comportamento: apenas scroll, nada de acordeão; o ativo sempre visível.

3.3. TOC (DISCRETO)

Componentes: ScrollArea, Badge (para “Nesta página”).

Estilos:

Título “Nesta página”: text-[12px] tracking-wide text-muted mb-2.

Itens: text-sm text-muted hover:text-foreground.

Ativo: text-brand-400 font-medium border-l-2 border-brand-400 pl-2.

Interação:

scrollspy suave (interseção de H2/H3).

Sem blocões, sem cards; bordas e fundos bem sutis.

Em <1280px: TOC vira dropdown (Popover + Command).

3.4. Conteúdo: padrões

Âncoras nos H2/H3: ícone # aparece no hover/focus; ao clicar → toast “Link copiado”.

Blocos de código:

Card com Tabs (ex.: Options/Composition), Button de Copy, Tooltip.

Realce de linha via hash: bg-brand-400/10.

diff+: text-success/90, diff-: text-danger/90.

Callouts (Alert do shadcn):

Tip (verde), Note (azul), Warning (amarelo), Danger (vermelho).

Título com ícone, corpo 15–16px, rounded-lg, border.

Pager (Anterior/Próximo):

Card duplo, hover bg-brand-400/10 translate-y-[-2px], seta direcional.

Breadcrumbs (shadcn): acima do H1, truncável em mobile.

4) Página Playground (com Header/Footer globais)

[ ] Construir shell 3 colunas + dock inferior usando shadcn + react-resizable-panels.

4.1. Grade

Esquerda — Navegador (w-[280px] md:w-[300px]):

ScrollArea, campos de busca/filtro (Input + Badge), árvore plana “Screens / Overlays / Components / Data”.

Itens com drag & drop (placeholder visual, opacity-60 ao arrastar).

Estado ativo com bg-brand-400/15 border-l-2 border-brand-400.

Centro — Editor (1fr):

Monaco com tema dark; ações: Run/Reset, Auto-Run, Format.

Lint & autocomplete (schema DSL).

Direita — Preview + Inspector (w-[380px] lg:w-[420px]):

Toolbar: Device (Select), Zoom (Slider), Theme (Toggle).

Preview (iframe/sandbox) + Inspector (tabs Props / Styles / Events / Data).

Pick mode: botão que, ao clicar no preview, destaca nó e sincroniza seleção com o editor.

Inferior — Console Dock (colapsável):

Tabs: Logs | Errors | Network | Timeline | State | Actions.

Filtros, pausar fluxo, deep-link p/ linha no editor, time-travel no State.

4.2. Painel de Tema (customização rápida)

Aba ao lado do Inspector (Tabs): Theme.

Controles:

Cores (--brand-*, semânticas, neutros) com preview ao vivo.

Tipografia (families, tamanho base, line-height).

Spacing & Radius (sliders).

Botões: Export tokens (CSS/JSON), Reset.

Persistência: localStorage + opção de share link (hash do estado).

4.3. Toolbar global do Playground

Botões (shadcn Button): Run, Reset, Auto-Run (Toggle), Format, Undo/Redo, Find, Share, Export.

Command Palette (Cmd/Ctrl+K): ações comuns.

4.4. Erros & DX

Error Overlay no preview com stack + botão “Ir para linha”.

Palavra-chave debug: no DSL → pausa e abre o Inspector nesse nó.

Snapshot gera link reproduzível (inclui estado do sandbox).

5) Estilo e microinterações

[ ] Padrões de foco/hover/active:

Focus ring: ring-2 ring-brand-300/50 ring-offset-2 ring-offset-background.

Hover de navegação: bg-brand-400/10 + text-brand-300.

Active: scale-[.98] rápido (botões).

[ ] Sombras:

Elementos elevados (Popover, Dialog, DropdownMenu): shadow-raised.

[ ] Gradiente de destaque opcional:

bg-[linear-gradient(90deg,#8B5CF6_0%,#22D3EE_100%)] para heros/headers de seção.

6) Navegação e responsividade

[ ] Breakpoints:

≥1280px: 3 colunas completas (Sidebar 240, Conteúdo flex-1, TOC 224).

1024–1279px: TOC vira dropdown acima do conteúdo; Sidebar mantém 240px.

<1024px: Sidebar vira Sheet/Drawer (shadcn) acessível por botão; conteúdo full-width; TOC via Popover.

7) Remoções/Substituições de marca

[ ] Remover cores/referências a Vue green.
[ ] Aplicar brand proto (links, estados ativos, tabs, botões primários, pager).
[ ] Manter cores semânticas (success/warning/danger) sem conflitar com o roxo.

8) Qualidade (Definition of Done)

[ ] Docs

Em 1440px, sidebar 240px, toc 224px, conteúdo mantendo ≤75ch.

Sidebar scrollable, sem accordion, item ativo sempre visível.

TOC discreto (texto text-sm text-muted, ativo text-brand-400 com border-l-2).

Blocos de código com Tabs + Copy + hash highlight.

Pager, Callouts, Breadcrumbs conforme guia.

[ ] Playground

3 painéis redimensionáveis (persistem largura).

Console Dock com tabs e filtros.

Inspector sincroniza com clique no Preview (Pick mode).

Export/Share/Reset funcionando; Theme Panel altera tokens ao vivo.

[ ] Visuais

Paleta aplicada via CSS variables + Tailwind.

Sombra, foco, hover consistentes.

Sem layout shifts perceptíveis ao navegar.

[ ] Padrões

Todos os componentes usam shadcn/ui quando houver equivalente (Button, Tabs, Card, ScrollArea, Tooltip, Popover, Separator, Sheet, Dialog, DropdownMenu, Command, Toast).

Sem bibliotecas de UI extras (exceto react-resizable-panels e Monaco).

9) Entregáveis

[ ] PR com:

globals.css (variables) + tailwind.config.ts.

components/ui/* (shadcn gerados) + novos wrappers (SidebarNav, Toc, CodeBlock, Pager, Breadcrumbs).

app/(docs)/layout.tsx e app/(playground)/layout.tsx usando Header/Footer globais.

playground/*: Navigator, Editor, Preview, Inspector, ConsoleDock, ThemePanel.

Storybook (opcional) com variações dos componentes-chave.

10) Notas de implementação

Sempre usar utilitários Tailwind antes de CSS customizado.

Usar ScrollArea do shadcn para Sidebar/TOC; evitar libs externas.

Preferir Command para busca/paleta, Sheet para off-canvas mobile.

Garantir max-w-prose nos textos e spacing (16–32px) entre blocos.