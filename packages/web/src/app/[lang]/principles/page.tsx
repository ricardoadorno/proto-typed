'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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
} from 'lucide-react'

import DocsFooter from '@/components/layouts/components/docs-footer'
import { DocsHeader } from '@/components/layouts/components/docs-header'
import {
  Badge,
  Button,
  GlowCard,
  SectionHeader,
  Separator,
} from '@/components/ui'
import { getDictionary, type Dictionary } from '@/lib/get-dictionary'

const codeExample = `screen Dashboard:
  header:
    # Dashboard
    @ghost[Settings](Settings)
  container:
    card:
      ## User Stats
      > Total users: 1,234
      @[View Details](Users)`

export default function PrinciplesPage() {
  const params = useParams()
  const lang = ((params?.lang as string) || 'en') as 'en' | 'pt'
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(lang).then(setDict)
  }, [lang])

  if (!dict) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
      </div>
    )
  }

  const t = dict.principles_page

  const heroHighlights = [
    {
      title: t.hero.highlight1_title,
      description: t.hero.highlight1_description,
      icon: SparklesIcon,
    },
    {
      title: t.hero.highlight2_title,
      description: t.hero.highlight2_description,
      icon: LayersIcon,
    },
    {
      title: t.hero.highlight3_title,
      description: t.hero.highlight3_description,
      icon: BotIcon,
    },
  ]

  const flowSteps = [
    {
      title: t.hero.flow_describe,
      description: t.hero.flow_describe_desc,
      icon: PenSquareIcon,
    },
    {
      title: t.hero.flow_visualize,
      description: t.hero.flow_visualize_desc,
      icon: MonitorIcon,
    },
    {
      title: t.hero.flow_iterate,
      description: t.hero.flow_iterate_desc,
      icon: RotateCcwIcon,
    },
    {
      title: t.hero.flow_export,
      description: t.hero.flow_export_desc,
      icon: Share2Icon,
    },
  ]

  const audienceCards = [
    {
      title: t.audience.card1_title,
      description: t.audience.card1_description,
      icon: CompassIcon,
    },
    {
      title: t.audience.card2_title,
      description: t.audience.card2_description,
      icon: ServerIcon,
    },
    {
      title: t.audience.card3_title,
      description: t.audience.card3_description,
      icon: BotIcon,
    },
  ]

  const principleHighlights = [
    {
      icon: GemIcon,
      text: t.principles.principle1,
    },
    {
      icon: ScrollTextIcon,
      text: t.principles.principle2,
    },
    {
      icon: BotIcon,
      text: t.principles.principle3,
    },
    {
      icon: LayersIcon,
      text: t.principles.principle4,
    },
    {
      icon: PercentCircleIcon,
      text: t.principles.principle5,
    },
  ]

  const influenceItems = [
    {
      icon: ZapIcon,
      heading: t.influences.influence1_heading,
      body: t.influences.influence1_body,
    },
    {
      icon: Wand2Icon,
      heading: t.influences.influence2_heading,
      body: t.influences.influence2_body,
    },
    {
      icon: LayersIcon,
      heading: t.influences.influence3_heading,
      body: t.influences.influence3_body,
    },
  ]

  const manifestoPoints = [
    t.manifesto.point1,
    t.manifesto.point2,
    t.manifesto.point3,
    t.manifesto.point4,
  ]

  const architectureItems = [
    {
      title: t.architecture.item1_title,
      description: t.architecture.item1_description,
      icon: FileTextIcon,
    },
    {
      title: t.architecture.item2_title,
      description: t.architecture.item2_description,
      icon: CircuitBoardIcon,
    },
    {
      title: t.architecture.item3_title,
      description: t.architecture.item3_description,
      icon: Share2Icon,
    },
  ]

  const futureItems = [t.future.item1, t.future.item2, t.future.item3]

  const faqItems = [
    {
      question: t.faq.q1,
      answer: t.faq.a1,
    },
    {
      question: t.faq.q2,
      answer: t.faq.a2,
    },
    {
      question: t.faq.q3,
      answer: t.faq.a3,
    },
  ]

  const heroCtas = [
    {
      label: t.hero.cta_experiment,
      href: `${langPrefix}/`,
      icon: SparklesIcon,
    },
    {
      label: t.hero.cta_examples,
      href: `${langPrefix}/docs/examples`,
      icon: CompassIcon,
      variant: 'secondary' as const,
    },
    {
      label: t.hero.cta_philosophy,
      href: '#manifesto',
      icon: ArrowRightIcon,
      variant: 'ghost' as const,
    },
  ]

  return (
    <div className=" min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)]">
      <DocsHeader />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[720px] w-[min(1180px,90%)] bg-grid-soft opacity-70 mask-radial-fade" />

        <section className="landing-spotlight relative overflow-hidden rounded-[36px] border border-[var(--border-muted)] bg-[var(--bg-surface)]/95 px-6 py-16 shadow-aurora sm:px-10">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_400px] lg:items-start">
            <div className="space-y-8">
              <SectionHeader
                title={t.hero.title}
                description={t.hero.description}
                actions={heroCtas.map((cta) => {
                  const Icon = cta.icon
                  const href = cta.href
                  return (
                    <Button
                      key={cta.label}
                      asChild
                      size="lg"
                      variant={cta.variant ?? 'default'}
                      className="gap-2"
                    >
                      <Link href={href}>
                        <Icon className="h-5 w-5" />
                        {cta.label}
                      </Link>
                    </Button>
                  )
                })}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                {heroHighlights.map((item) => {
                  const Icon = item.icon
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
                  )
                })}
              </div>
            </div>

            <GlowCard
              variant="muted"
              hoverLift={false}
              className="bg-grid-soft px-6 py-8"
            >
              <div className="space-y-6 text-sm text-[var(--fg-secondary)]">
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
                    {t.hero.magic_value_label}
                  </span>
                  <p className="text-base leading-relaxed">
                    {t.hero.magic_value_text}
                  </p>
                </div>
                <Separator className="border-[var(--border-muted)]/70" />
                <div className="space-y-4">
                  <div className="space-y-3">
                    {flowSteps.map((step) => {
                      const Icon = step.icon
                      return (
                        <div
                          key={`hero-${step.title}`}
                          className="flex items-start gap-3 rounded-2xl border border-[rgba(139,92,246,0.2)] bg-white/10 px-3 py-3 backdrop-blur-md transition-colors duration-200 hover:border-[var(--accent)] dark:bg-white/5"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.18)] text-[var(--accent)]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-[var(--fg-primary)]">
                              {step.title}
                            </p>
                            <p className="text-xs text-[var(--fg-secondary)]">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      )
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
            eyebrow={t.context.eyebrow}
            title={t.context.title}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <GlowCard hoverLift={false}>
              <h3 className="text-xl font-semibold text-[var(--fg-primary)]">
                {t.context.problem_title}
              </h3>
              <div className="space-y-4 text-base leading-relaxed text-[var(--fg-secondary)]">
                <p>{t.context.problem_text1}</p>
                <p>{t.context.problem_text2}</p>
              </div>
            </GlowCard>
            <GlowCard hoverLift={false}>
              <h3 className="text-xl font-semibold text-[var(--fg-primary)]">
                {t.context.what_is_title}
              </h3>
              <div className="space-y-4 text-base leading-relaxed text-[var(--fg-secondary)]">
                <p>{t.context.what_is_text1}</p>
                <p>{t.context.what_is_text2}</p>
              </div>
            </GlowCard>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl space-y-10">
          <SectionHeader
            align="center"
            eyebrow={t.audience.eyebrow}
            title={t.audience.title}
            description={t.audience.description}
          />
          <div className="grid gap-6 md:grid-cols-3">
            {audienceCards.map((card) => {
              const Icon = card.icon
              return (
                <GlowCard key={card.title} className="h-full">
                  <div className="flex flex-col gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--accent)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--fg-primary)]">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
                      {card.description}
                    </p>
                  </div>
                </GlowCard>
              )
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl space-y-8">
          <SectionHeader
            align="center"
            eyebrow={t.process.eyebrow}
            title={t.process.title}
            description={
              <div className="space-y-3">
                <p className="text-lg font-semibold text-[var(--fg-primary)]">
                  {t.process.subtitle}
                </p>
                <p className="text-base leading-relaxed text-[var(--fg-secondary)]">
                  {t.process.description}
                </p>
              </div>
            }
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {flowSteps.map((step) => {
              const Icon = step.icon
              return (
                <GlowCard
                  key={`process-${step.title}`}
                  className="h-full"
                  hoverLift={false}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--accent)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--fg-primary)]">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
                      {step.description}
                    </p>
                  </div>
                </GlowCard>
              )
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl space-y-8 border-t border-[var(--border-muted)] pt-10">
          <SectionHeader
            title={t.principles.title}
            description={t.principles.description}
          />
          <div className="grid gap-5 md:grid-cols-2">
            {principleHighlights.map((principle) => {
              const Icon = principle.icon
              return (
                <GlowCard key={principle.text} hoverLift={false}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--accent)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-base leading-relaxed text-[var(--fg-secondary)]">
                      {principle.text}
                    </p>
                  </div>
                </GlowCard>
              )
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl space-y-6">
          <SectionHeader
            align="center"
            eyebrow={t.influences.eyebrow}
            title={t.influences.title}
          />
          <div className="space-y-4">
            {influenceItems.map((item) => {
              const Icon = item.icon
              return (
                <GlowCard key={item.heading} hoverLift={false}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--accent)]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[var(--fg-primary)]">
                        {item.heading}
                      </h3>
                      <p className="text-base leading-relaxed text-[var(--fg-secondary)]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              )
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl space-y-6">
          <SectionHeader
            align="center"
            eyebrow={t.example.eyebrow}
            title={t.example.title}
          />
          <GlowCard hoverLift={false}>
            <pre className="overflow-auto rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] p-6 text-sm leading-relaxed text-[var(--fg-secondary)]">
              <code>{codeExample}</code>
            </pre>
            <p className="text-base leading-relaxed text-[var(--fg-secondary)]">
              {t.example.result_text}
            </p>
          </GlowCard>
        </section>

        <section id="manifesto" className="mx-auto w-full max-w-5xl space-y-6">
          <SectionHeader
            align="center"
            eyebrow={t.manifesto.eyebrow}
            title={t.manifesto.title}
          />
          <GlowCard hoverLift={false}>
            <ul className="space-y-4 text-base leading-relaxed text-[var(--fg-secondary)]">
              {manifestoPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--accent)]"
                    aria-hidden
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </GlowCard>
        </section>

        <section className="mx-auto w-full max-w-5xl space-y-8">
          <SectionHeader
            align="center"
            eyebrow={t.architecture.eyebrow}
            title={t.architecture.title}
            description={t.architecture.description}
          />
          <div className="grid gap-6 md:grid-cols-3">
            {architectureItems.map((item) => {
              const Icon = item.icon
              return (
                <GlowCard key={item.title} hoverLift={false}>
                  <div className="flex flex-col gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--accent)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--fg-primary)]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
                      {item.description}
                    </p>
                  </div>
                </GlowCard>
              )
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl space-y-6">
          <SectionHeader
            align="center"
            eyebrow={t.future.eyebrow}
            title={t.future.title}
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
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
          />
          <div className="grid gap-6 md:grid-cols-2">
            {faqItems.map((item) => (
              <GlowCard
                key={item.question}
                hoverLift={false}
                className="h-full"
              >
                <h3 className="text-lg font-semibold text-[var(--fg-primary)]">
                  {item.question}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
                  {item.answer}
                </p>
              </GlowCard>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[32px] border border-[var(--border-muted)] bg-[var(--bg-surface)] px-8 py-12 text-center shadow-aurora sm:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.3),transparent_60%)] opacity-80" />
          <div className="relative z-10 space-y-6">
            <Badge className="border-[var(--border-muted)] bg-[rgba(139,92,246,0.18)] text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
              {t.cta_final.badge}
            </Badge>
            <h2 className="text-3xl font-semibold text-[var(--fg-primary)] sm:text-4xl">
              {t.cta_final.title}
            </h2>
            <p className="text-lg text-[var(--fg-secondary)]">
              {t.cta_final.description}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {heroCtas.slice(0, 2).map((cta) => {
                const Icon = cta.icon
                const href = cta.href
                return (
                  <Button
                    key={`cta-${cta.label}`}
                    asChild
                    size="lg"
                    variant={cta.variant ?? 'default'}
                    className="gap-2"
                  >
                    <Link href={href}>
                      <Icon className="h-5 w-5" />
                      {cta.label}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-10">
        <DocsFooter />
      </div>
    </div>
  )
}
