🎨 Guia de Interface — Documentação Vue.js (versão aprimorada)
0) Diretrizes Fundamentais

Propósito:
Garantir uma experiência de leitura fluida, hierarquia visual clara e sensação de leveza.
A interface deve guiar, não competir com o conteúdo.

Princípios-chave:

Clareza tipográfica e de ritmo.

Hierarquia visual modular.

Interatividade sutil e previsível.

Cores com contraste adequado (AA mínimo, preferível AAA).

Paleta-base (dark mode):

Token	Hex	Uso
--bg-main	#121212	Fundo geral
--bg-surface	#1E1E1E	Cards, callouts, blocos
--fg-primary	#EAEAEA	Texto primário
--fg-secondary	#B3B3B3	Texto auxiliar
--accent	#42b883	Verde Vue, links ativos
--accent-light	#63d0a3	Hover, foco
--border-muted	#2C2C2C	Bordas sutis
--warning	#F6B73C	Avisos
--danger	#E24C4B	Erros, riscos
--info	#60A5FA	Dicas, notas

Escala de espaçamento:

Token	px	Aplicação
--space-xs	4px	ícones, bordas internas
--space-sm	8px	padding leve
--space-md	16px	entre blocos curtos
--space-lg	24px	entre seções
--space-xl	32px	divisões principais

Raio e sombra:

border-radius: 6px (botões, blocos), 8px (cards).

shadow: 0 2px 8px rgba(0,0,0,0.25) (somente elementos flutuantes).

1) Layout Estrutural

Grid Desktop (≥1280px):

[Sidebar] 300px | [Conteúdo] 760px | [TOC] 260px


Tablet (≥768px e <1280px):

Sidebar fixa, TOC recolhido como dropdown.

Margens laterais mínimas: 24px.

Mobile (<768px):

Sidebar → off-canvas.

TOC → botão “Nesta página”.

Espaçamento vertical:

Entre blocos: 24px.

Entre seções (H2/H3): 32px.

2) Header

Elementos:

Logotipo Vue (link para home docs)

Menu compacto (Docs / API / Playground / Ecosystem / About)

Botão de alternar tema

Comportamento:

Fixa no topo (position: sticky; top: 0).

Transição de sombra ao rolar (box-shadow: var(--shadow)).

Hover suave com transition: color 0.2s ease, border-color 0.2s ease.

Interação:

Link ativo com sublinhado verde 2px.

Botão de tema com animação de rotação 180° ao alternar.

3) Sidebar de Navegação

Estrutura:

Cabeçalhos de seção (text-transform: uppercase; font-size: 12px; color: var(--fg-secondary)).

Links hierárquicos (font-size: 14–15px;).

Ícone de colapso por seção.

Cores e estados:

Fundo: --bg-surface.

Link normal: color: var(--fg-secondary).

Hover: color: var(--accent-light); background: rgba(66,184,131,0.08);.

Ativo: border-left: 3px solid var(--accent); background: rgba(66,184,131,0.12);.

Comportamentos:

Collapse/Expand suave (max-height animado 0.25s).

Persistência local (estado salvo no localStorage).

Scroll-shadow quando há overflow (fade 12px).

4) Tipografia e Ritmo

Tokens tipográficos:

Elemento	Tamanho	Peso	Line-height
h1	32–36px	700	1.25
h2	24px	600	1.35
h3	20px	500	1.45
p	16–18px	400	1.7
code	15px monospace	500	1.5

Regras visuais:

Máx. largura de parágrafo: 70–75ch.

Margem inferior de cada parágrafo: 16px.

inline code: background: rgba(255,255,255,0.05), padding: 2px 6px, border-radius: 4px.

Âncoras de título:

Ícone # visível ao hover, clicável.

Animação fade-in + tooltip “Copiar link”.

Hash ativo ilumina o fundo do título por 2s (background: rgba(66,184,131,0.08)).

5) TOC (Sumário da Página)

Layout:

Título “Nesta página” (14px bold, cor --fg-secondary).

Itens (H2/H3) com indentação 12–16px.

scrollspy ativo com barra lateral de 2px em --accent.

Cores e comportamentos:

Link normal: --fg-secondary.

Hover: --accent-light.

Ativo: --accent, peso 600.

position: sticky; top: 100px;.

Colapsável em mobile:

Botão de dropdown com ícone de seta e animação 180°.

Fundo expandido --bg-surface.

6) Blocos de Código

Anatomia:

Header bar: tabs + ações (Copy, Open in Playground).

Body: área monoespaçada com numeração de linhas.

Footer opcional: descrição ou output.

Estilo visual:

Fundo: #1A1A1A.

Texto: #EAEAEA.

Linhas pares com leve variação rgba(255,255,255,0.02).

Bordas: 1px solid #2C2C2C.

Raio: 6px.

Padding interno: 16px.

Tabs:

Não selecionada: --fg-secondary.

Selecionada: --accent-light; border-bottom: 2px solid var(--accent-light);.

Hover: transição color 0.2s ease.

Botões (Copy, Playground):

Ícones 16px com tooltip.

Hover: ícone muda cor para --accent-light.

Clique Copy → toast “Copiado!” (fundo #1E1E1E, texto --accent-light).

Comportamentos:

Hash de linha (#L12) destaca a linha.

Diff mode: verde #00C853 (adição), vermelho #FF5252 (remoção).

Collapse output: “Mostrar mais / menos” com animação de altura.

7) Callouts (Notas, Dicas, Avisos, Perigo)

Anatomia:

Ícone (24px) + título curto + corpo.

Padding interno: 16px 20px.

Raio: 8px.

Fonte: 15–16px, line-height 1.6.

Cores:

Tipo	Fundo	Borda	Ícone
Note	rgba(96,165,250,0.1)	#60A5FA	#60A5FA
Tip	rgba(66,184,131,0.1)	#42b883	#42b883
Warning	rgba(246,183,60,0.1)	#F6B73C	#F6B73C
Danger	rgba(226,76,75,0.12)	#E24C4B	#E24C4B

Comportamentos:

“Mostrar detalhes” colapsável (altura animada, setinha rotaciona).

Ícone muda leve tonalidade no hover.

Pode conter blocos de código ou listas internas.

8) Navegação Próximo / Anterior (Pager)

Anatomia:

Container: display: flex; justify-content: space-between; margin-top: 48px;

Cada card:

Título pequeno (“Anterior”, “Próximo”), 13px.

Nome do destino, 16–18px bold.

Ícone seta → ou ←.

Cores e estados:

Fundo: --bg-surface.

Texto normal: --fg-primary.

Hover: background: rgba(66,184,131,0.08); transform: translateY(-2px);.

Transição: 0.2s ease.

Comportamento:

Atalhos de teclado: ← / → alternam páginas.

Em mobile: cards empilhados verticalmente com espaçamento --space-md.

9) Breadcrumbs

Layout:

Linha horizontal acima do título principal.

Separador: › (cor --fg-secondary).

Texto: 13–14px.

Cores e estados:

Link: --fg-secondary.

Hover: --accent-light.

Último item (atual): --fg-primary.

Comportamento:

Trunca início quando há >4 níveis (mostra “… › Guide › Introduction”).

Transição sutil ao hover.

10) Componentes de Aprendizagem

1️⃣ Mini Playground

Container: fundo --bg-surface, padding 16px, raio 8px.

Editor pequeno (HTML/JS), 200–240px de altura.

Botões: Run / Reset / Expand.

Resultado abaixo, em frame leve (border: 1px solid #2C2C2C).

Comportamentos:

Run executa sem recarregar (iframe sandbox).

Reset limpa editor e volta ao estado inicial.

Expand → abre no Playground completo em nova aba.

2️⃣ Tarefas “Tente isto”

Caixa background: rgba(66,184,131,0.08); ícone ✅.

Cada item: checkbox + descrição curta.

Persistência local (localStorage).

Espaçamento entre itens: 8px.

3️⃣ Bloco “Comparar abordagens”

Tabs horizontais: Options API / Composition API.

Cada aba com código e bullet de prós/contras.

Transição entre abas com fade-in (150ms).

11) Tema e Contraste

Dark Mode:

--bg-main: #121212

--fg-primary: #EAEAEA

--fg-secondary: #B3B3B3

Light Mode:

--bg-main: #FFFFFF

--bg-surface: #F9FAFB

--fg-primary: #111827

--fg-secondary: #6B7280

--accent: #42b883

Transição entre temas: transition: background-color 0.3s ease, color 0.3s ease;

12) Estados de Interface
Estado	Tratamento visual	Exemplo
Hover	leve realce de cor / sombra	links, botões, blocos
Focus	anel 2px --accent-light	acessível em teclado
Active	compressão 1px (efeito click)	botões, tabs
Disabled	opacidade 0.5 + cursor not-allowed	ações bloqueadas
Empty	mensagem leve + ícone cinza	playground vazio
Loading	skeleton + shimmer	sidebar, TOC
Error	texto vermelho + callout danger	falha de código
🔖 Resumo de Componentes-Chave
Componente	Visual	Interação	Tokens-chave
Sidebar	Colunas, colapsável, estados ativos	Persistência local	--bg-surface, --accent
TOC	Hierárquico, scrollspy	Auto-hide, links hash	--accent-light
Code Block	Tabs, numeração, diff	Copy, hash, collapse	--bg-surface, --border-muted
Callouts	Cores semânticas	Collapse, hover	--info, --tip, --warning, --danger
Pager	Card duplo	Hover, teclado	--accent, --bg-surface
Breadcrumbs	Inline, truncável	Hover suave	--fg-secondary
Playground	Editor mini	Run/Reset	--bg-surface, --accent
Tente isto	Lista verde	Check persistente	--accent-light