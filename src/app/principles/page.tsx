import Link from "next/link";
import {
  ArrowRightIcon,
  BotIcon,
  CircuitBoardIcon,
  CompassIcon,
  FileTextIcon,
  GemIcon,
  LayersIcon,
  MonitorIcon,
  PenSquareIcon,
  PercentCircleIcon,
  RotateCcwIcon,
  ScrollTextIcon,
  ServerIcon,
  Share2Icon,
  SparklesIcon,
  Wand2Icon,
  ZapIcon,
} from "lucide-react";

import DocsFooter from "@/components/layouts/components/docs-footer";
import { DocsHeader } from "@/components/layouts/components/docs-header";
import {
  Badge,
  Button,
  GlowCard,
  SectionHeader,
  Separator,
} from "@/components/ui";

const heroCtas = [
  { label: "Experimentar", href: "/playground", icon: SparklesIcon },
  { label: "Ver exemplos", href: "/docs/examples", icon: CompassIcon, variant: "secondary" as const },
  { label: "Ler a filosofia", href: "#manifesto", icon: ArrowRightIcon, variant: "ghost" as const },
];

const heroHighlights = [
  {
    title: "Sem arrastar blocos",
    description: "Você descreve a interface e o sistema cuida do resto.",
    icon: SparklesIcon,
  },
  {
    title: "Padrões prontos",
    description: "Cards, listas e fluxos com boas decisões visuais por padrão.",
    icon: LayersIcon,
  },
  {
    title: "Feito com IA em mente",
    description: "Sintaxe estável para humanos e modelos iterarem com confiança.",
    icon: BotIcon,
  },
];

const flowSteps = [
  {
    title: "Descrever",
    description: "Capture telas, listas e ações em texto legível e versionável.",
    icon: PenSquareIcon,
  },
  {
    title: "Visualizar",
    description: "Gere protótipos navegáveis com padrões coerentes imediatamente.",
    icon: MonitorIcon,
  },
  {
    title: "Iterar",
    description: "Peça ajustes em linguagem natural e deixe a IA reescrever trechos.",
    icon: RotateCcwIcon,
  },
  {
    title: "Exportar",
    description: "Leve HTML hoje e abra portas para outros runtimes amanhã.",
    icon: Share2Icon,
  },
];

const audienceCards = [
  {
    title: "PMs e Gestores",
    description:
      "Alinhe rapidamente fluxo e comportamento visual — sem abrir ferramenta de design.",
    icon: CompassIcon,
  },
  {
    title: "Devs backend e full-stack",
    description: "Monte telas de protótipo sem mergulhar em CSS/JSX.",
    icon: ServerIcon,
  },
  {
    title: "LLMs e agentes",
    description:
      "Edite com humanos em um formato textual estável, seguro e versionável.",
    icon: BotIcon,
  },
];

const principleHighlights = [
  {
    icon: GemIcon,
    text: "Simplicidade acima da customização extrema. Boas decisões por padrão.",
  },
  {
    icon: ScrollTextIcon,
    text: "Semântica antes de aparência. Você descreve “o que é”; o sistema escolhe “como parece”.",
  },
  {
    icon: BotIcon,
    text: "Amigável para IA. Sintaxe curta, previsível e fácil de gerar por modelos.",
  },
  {
    icon: LayersIcon,
    text: "Portável por design. Um único modelo semântico, múltiplos renderizadores.",
  },
  {
    icon: PercentCircleIcon,
    text: "Cobrir ~90% dos casos. Foco no que destrava prototipagem.",
  },
];

const influenceItems = [
  {
    icon: ZapIcon,
    heading: "Resposta instantânea, atualização em segundo plano.",
    body: "Inspirado por padrões do TanStack Query: mostre algo agora e refine em seguida. Em protótipos, isso vira “veja rápido, melhore logo depois”.",
  },
  {
    icon: Wand2Icon,
    heading: "Aproveitar a plataforma, degradar graciosamente.",
    body: "A filosofia de progressive enhancement do Remix guia nossa robustez: conteúdo e comportamento essenciais funcionam primeiro, o resto é melhoria incremental.",
  },
  {
    icon: LayersIcon,
    heading: "Híbrido por natureza, escolha o melhor lugar para executar.",
    body: "Do Next.js, herdamos a ideia de múltiplas estratégias de renderização. Em Proto-Typed, significa emitir a mesma intenção para diferentes runtimes sem reescrever.",
  },
];

const manifestoPoints = [
  "Por que existe: prototipar interfaces não deveria exigir arrastar caixas, decorar frameworks ou traduzir intenções para pixels. A maioria das UIs repete padrões previsíveis; o que muda é conteúdo, fluxo e intenção.",
  "O que faz: transforma esses padrões em descrições claras, legíveis por humanos e IAs, encurtando o caminho entre ideia e interface navegável.",
  "Como faz: cobre ~90% dos casos com layouts canônicos e componentes semânticos, favorecendo edição fluida e natural, com um modelo desacoplado do destino de renderização.",
  "Para onde vai: co-criação humano-IA realmente fluida — descrever, visualizar, pedir ajustes, versionar e exportar para múltiplos alvos sem fricção.",
];

const architectureItems = [
  {
    title: "Texto de interface",
    description: "Tudo começa descrevendo a experiência em linguagem natural estruturada.",
    icon: FileTextIcon,
  },
  {
    title: "Representação semântica",
    description:
      "Transformamos o texto em uma “árvore” que entende telas, cards e listas — interface, não HTML.",
    icon: CircuitBoardIcon,
  },
  {
    title: "Renderizadores",
    description:
      "Hoje renderizamos em HTML; amanhã, React Native/Flutter e outros alvos, sem alterar a descrição original.",
    icon: Share2Icon,
  },
];

const futureItems = [
  "Co-criação humano-IA cada vez mais fluida: descrever, visualizar, ajustar por conversa.",
  "Renderização multi-alvo: HTML hoje; React Native/Flutter amanhã — uma única fonte de verdade.",
  "Padrões de interação mais ricos: listas dinâmicas, estados de carregamento, fluxos e validações — no mesmo idioma.",
];

const faqItems = [
  {
    question: "Isso substitui ferramentas de design?",
    answer:
      "Não. Cobrimos o espaço de prototipação textual rápida e comunicação de intenção. Ferramentas visuais continuam ótimas para refinamento e pixel-perfection.",
  },
  {
    question: "Por que texto?",
    answer:
      "Porque é editável, versionável e conversável — por pessoas e IAs. A iteração vira linguagem, não cliques.",
  },
  {
    question: "Onde entram dados reais?",
    answer:
      "Quando necessário, você pode simular dados ou conectar fontes externas nos renderizadores — mantendo o foco na intenção da UI. A filosofia geral é “mostre algo agora, refine depois”.",
  },
];

const codeExample = `screen Dashboard:
  header:
    # Dashboard
    @ghost[Settings](Settings)
  container:
    card:
      ## User Stats
      > Total users: 1,234
      @[View Details](Users)`;

export default function PrinciplesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)]">
      <DocsHeader />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[720px] w-[min(1180px,90%)] bg-grid-soft opacity-70 mask-radial-fade" />

        <section className="landing-spotlight relative overflow-hidden rounded-[36px] border border-[var(--border-muted)] bg-[var(--bg-surface)]/95 px-6 py-16 shadow-aurora sm:px-10">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_400px] lg:items-start">
            <div className="space-y-8">
              <SectionHeader
                title="Proto-Typed — descreva interfaces, veja protótipos, itere com IA."
                description="Um formato textual de prototipação: você escreve o que a interface é (telas, listas, botões, navegação) e o sistema cuida do resto — sem arrastar blocos, sem JSX, sem fricção."
                actions={heroCtas.map((cta) => {
                  const Icon = cta.icon;
                  const href = cta.href;
                  return (
                    <Button
                      key={cta.label}
                      asChild
                      size="lg"
                      variant={cta.variant ?? "default"}
                      className="gap-2"
                    >
                      <Link href={href}>
                        <Icon className="h-5 w-5" />
                        {cta.label}
                      </Link>
                    </Button>
                  );
                })}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                {heroHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex h-full flex-col rounded-2xl border border-[color:rgba(139,92,246,0.2)] bg-[var(--bg-surface)]/80 px-4 py-6 shadow-[0_18px_46px_rgba(20,18,32,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_86px_rgba(20,18,32,0.24)]"
                    >
                      <Icon className="h-6 w-6 text-[var(--accent)]" />
                      <h3 className="mt-3 text-sm font-semibold text-[var(--fg-primary)]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--fg-secondary)]">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <GlowCard variant="muted" hoverLift={false} className="bg-grid-soft px-6 py-8">
              <div className="space-y-6 text-sm text-[var(--fg-secondary)]">
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
                    Valor mágico
                  </span>
                  <p className="text-base leading-relaxed">
                    Do conceito ao protótipo em minutos. Em vez de “pedir uma mudança” na UI, você descreve a mudança. Em vez
                    de ajustar pixel a pixel, você reescrever a seção ou pede para uma IA fazer. O rascunho está sempre atualizável e
                    compartilhável.
                  </p>
                </div>
                <Separator className="border-[var(--border-muted)]/70" />
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
                    Como funciona
                  </span>
                  <div className="space-y-3">
                    {flowSteps.map((step) => {
                      const Icon = step.icon;
                      return (
                        <div
                          key={`hero-${step.title}`}
                          className="flex items-start gap-3 rounded-2xl border border-[rgba(139,92,246,0.2)] bg-white/10 px-3 py-3 backdrop-blur-md transition-colors duration-200 hover:border-[var(--accent)] dark:bg-white/5"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.18)] text-[var(--accent)]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-[var(--fg-primary)]">{step.title}</p>
                            <p className="text-xs text-[var(--fg-secondary)]">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl space-y-10">
          <SectionHeader
            align="center"
            eyebrow="Contexto"
            title="O problema e o formato textual"
          />
          <div className="grid gap-6 md:grid-cols-2">
            <GlowCard hoverLift={false}>
              <h3 className="text-xl font-semibold text-[var(--fg-primary)]">O problema</h3>
              <div className="space-y-4 text-base leading-relaxed text-[var(--fg-secondary)]">
                <p>
                  Criar UI ainda é pesado: ferramentas gráficas são ótimas para desenhar, mas lentas para iterar; código é
                  preciso, porém verborrágico. E as IAs entendem intenções, mas não “editam” arquivos visuais com fluidez.
                </p>
                <p>
                  Proto-Typed nasce para ser o idioma comum de prototipação entre pessoas e IAs — rápido de escrever, fácil de
                  ler e simples de versionar.
                </p>
              </div>
            </GlowCard>
            <GlowCard hoverLift={false}>
              <h3 className="text-xl font-semibold text-[var(--fg-primary)]">O que é (sem jargões)</h3>
              <div className="space-y-4 text-base leading-relaxed text-[var(--fg-secondary)]">
                <p>
                  Proto-Typed é um formato textual de interface. Você descreve conteúdo, estrutura e ações; ele gera um
                  protótipo navegável.
                </p>
                <p>
                  Pensamento-chave: você foca na intenção (o que é um “card”, um “header”, uma “lista”), e o sistema decide
                  como renderizar com bons padrões. É a lógica de “conteúdo primeiro, aparência depois” — como em editores de
                  texto científicos — aplicada à UI.
                </p>
              </div>
            </GlowCard>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl space-y-10">
          <SectionHeader
            align="center"
            eyebrow="Para quem é"
            title="Quando interface vira texto, todo mundo ganha velocidade"
            description="Três perfis que ganham velocidade quando interface vira texto."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {audienceCards.map((card) => {
              const Icon = card.icon;
              return (
                <GlowCard key={card.title} className="h-full">
                  <div className="flex flex-col gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--accent)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--fg-primary)]">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
                      {card.description}
                    </p>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl space-y-8">
          <SectionHeader
            align="center"
            eyebrow="Processo"
            title="Como funciona"
            description={
              <div className="space-y-3">
                <p className="text-lg font-semibold text-[var(--fg-primary)]">
                  Descrever → Visualizar → Iterar → Exportar.
                </p>
                <p className="text-base leading-relaxed text-[var(--fg-secondary)]">
                  Por baixo, há uma representação semântica da interface (uma “árvore” que entende o que é tela, card,
                  lista). Hoje renderizamos em HTML; amanhã, React Native/Flutter e outros alvos. O destino de renderização é
                  coadjuvante: prioridade à fluidez de edição e à velocidade de iteração.
                </p>
              </div>
            }
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {flowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <GlowCard key={`process-${step.title}`} className="h-full" hoverLift={false}>
                  <div className="flex flex-col gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--accent)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--fg-primary)]">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
                      {step.description}
                    </p>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl space-y-8 border-t border-[var(--border-muted)] pt-10">
          <SectionHeader
            title="Princípios que guiam o Proto-Typed"
            description="As decisões fundamentais por trás do formato textual."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {principleHighlights.map((principle) => {
              const Icon = principle.icon;
              return (
                <GlowCard key={principle.text} hoverLift={false}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--accent)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-base leading-relaxed text-[var(--fg-secondary)]">{principle.text}</p>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl space-y-6">
          <SectionHeader
            align="center"
            eyebrow="Influências"
            title="Influências e escolhas de design"
          />
          <div className="space-y-4">
            {influenceItems.map((item) => {
              const Icon = item.icon;
              return (
                <GlowCard key={item.heading} hoverLift={false}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--accent)]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[var(--fg-primary)]">{item.heading}</h3>
                      <p className="text-base leading-relaxed text-[var(--fg-secondary)]">{item.body}</p>
                    </div>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl space-y-6">
          <SectionHeader
            align="center"
            eyebrow="Exemplo"
            title="O que você escreve (exemplo curto)"
          />
          <GlowCard hoverLift={false}>
            <pre className="overflow-auto rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] p-6 text-sm leading-relaxed text-[var(--fg-secondary)]">
              <code>{codeExample}</code>
            </pre>
            <p className="text-base leading-relaxed text-[var(--fg-secondary)]">
              O que você recebe: um protótipo navegável com padrões de layout e estilo; peça à IA para “duplicar a card de
              métricas” ou “trocar o botão para secundário grande” e veja a mudança em segundos.
            </p>
          </GlowCard>
        </section>

        <section id="manifesto" className="mx-auto w-full max-w-5xl space-y-6">
          <SectionHeader
            align="center"
            eyebrow="Manifesto"
            title="Manifesto de visão (resumo)"
          />
          <GlowCard hoverLift={false}>
            <ul className="space-y-4 text-base leading-relaxed text-[var(--fg-secondary)]">
              {manifestoPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </GlowCard>
        </section>

        <section className="mx-auto w-full max-w-5xl space-y-8">
          <SectionHeader
            align="center"
            eyebrow="Arquitetura"
            title="Texto de interface → Representação semântica → Renderizador(es)."
            description="A “árvore” representa interface, não HTML. Isso permite adicionar novos destinos (ex.: mobile) sem alterar a descrição original — a mesma separação entre intenção e execução que vemos em frameworks modernos."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {architectureItems.map((item) => {
              const Icon = item.icon;
              return (
                <GlowCard key={item.title} hoverLift={false}>
                  <div className="flex flex-col gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--accent)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--fg-primary)]">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">{item.description}</p>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl space-y-6">
          <SectionHeader
            align="center"
            eyebrow="O futuro"
            title="Para onde o Proto-Typed está indo"
          />
          <GlowCard hoverLift={false} variant="muted">
            <div className="space-y-4 text-base leading-relaxed text-[var(--fg-secondary)]">
              {futureItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </GlowCard>
        </section>

        <section className="mx-auto w-full max-w-5xl space-y-8">
          <SectionHeader
            align="center"
            eyebrow="FAQ"
            title="FAQ (filosofia rápida)"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {faqItems.map((item) => (
              <GlowCard key={item.question} hoverLift={false} className="h-full">
                <h3 className="text-lg font-semibold text-[var(--fg-primary)]">{item.question}</h3>
                <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">{item.answer}</p>
              </GlowCard>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[32px] border border-[var(--border-muted)] bg-[var(--bg-surface)] px-8 py-12 text-center shadow-aurora sm:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.3),transparent_60%)] opacity-80" />
          <div className="relative z-10 space-y-6">
            <Badge className="border-[var(--border-muted)] bg-[rgba(139,92,246,0.18)] text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
              Call to Action
            </Badge>
            <h2 className="text-3xl font-semibold text-[var(--fg-primary)] sm:text-4xl">
              Comece a prototipar em segundos.
            </h2>
            <p className="text-lg text-[var(--fg-secondary)]">
              Abra o editor, descreva uma tela e veja o protótipo surgir. Depois, itere com sua equipe — e com sua IA.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {heroCtas.map((cta) => {
                const Icon = cta.icon;
                const href = cta.href;
                return (
                  <Button
                    key={`cta-${cta.label}`}
                    asChild
                    size="lg"
                    variant={cta.variant ?? "default"}
                    className="gap-2"
                  >
                    <Link href={href}>
                      <Icon className="h-5 w-5" />
                      {cta.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-10">
        <DocsFooter />
      </div>
    </div>
  );
}
