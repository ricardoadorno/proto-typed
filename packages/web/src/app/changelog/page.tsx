'use client'

import {
  SparklesIcon,
  WrenchIcon,
  CheckCircle2Icon,
  RocketIcon,
  GitBranchIcon,
  HistoryIcon,
  ExternalLinkIcon,
} from 'lucide-react'
import Link from 'next/link'

import { DocsHeader } from '@/components/layouts/components/docs-header'
import DocsFooter from '@/components/layouts/components/docs-footer'
import { GlowCard, SectionHeader, Button, Separator } from '@/components/ui'

type ChangelogEntry = {
  version: string
  date: string
  highlights: string[]
  sections?: {
    features?: string[]
    qualityImprovements?: string[]
    fixes?: string[]
    internalChanges?: string[]
  }
}

const changelog: ChangelogEntry[] = [
  {
    version: 'v0.1.0-beta',
    date: '2025-10-20',
    highlights: ['Lançamento inicial do Proto-Typed!'],
    sections: {
      features: [
        'Versão inicial da DSL textual para prototipagem.',
        'Playground integrado com preview ao vivo.',
      ],
    },
  },
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)]">
      <DocsHeader />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        {/* Título principal */}
        <section>
          <SectionHeader
            align="center"
            eyebrow="Registro de versões"
            title="Change Log do Proto-Typed"
            description="Histórico de lançamentos, correções e melhorias contínuas do sistema de prototipagem textual."
          />
        </section>

        {/* Itens do changelog */}
        {changelog.map((entry, index) => (
          <section key={entry.version} className="space-y-8">
            <GlowCard
              hoverLift={false}
              className={`relative overflow-hidden ${
                index === 0
                  ? 'border-[color:rgba(139,92,246,0.4)] shadow-[0_0_60px_rgba(139,92,246,0.25)]'
                  : ''
              }`}
            >
              <div className="space-y-6">
                {/* Cabeçalho da versão */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-muted)] pb-4">
                  <div className="flex items-center gap-3">
                    <GitBranchIcon className="h-5 w-5 text-[var(--accent)]" />
                    <h2 className="text-2xl font-semibold text-[var(--fg-primary)]">
                      {entry.version}
                    </h2>
                  </div>
                  <span className="text-sm text-[var(--fg-secondary)]">
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'long',
                    }).format(new Date(entry.date + 'T00:00:00'))}
                  </span>
                </div>

                {/* Destaques */}
                {entry.highlights?.length > 0 && (
                  <ul className="space-y-2 pl-2 text-base leading-relaxed text-[var(--fg-secondary)]">
                    {entry.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <SparklesIcon className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Separator className="border-[var(--border-muted)]" />

                {/* Seções dinâmicas — renderiza apenas as que existem */}
                <div className="grid gap-8 md:grid-cols-2">
                  {entry.sections?.features?.length ? (
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--fg-primary)]">
                        <RocketIcon className="h-5 w-5 text-[var(--accent)]" />
                        Novidades
                      </h3>
                      <ul className="list-disc space-y-1 pl-6 text-sm text-[var(--fg-secondary)]">
                        {entry.sections.features.map((n) => (
                          <li key={n}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {entry.sections?.qualityImprovements?.length ? (
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--fg-primary)]">
                        <WrenchIcon className="h-5 w-5 text-[var(--accent)]" />
                        Melhorias
                      </h3>
                      <ul className="list-disc space-y-1 pl-6 text-sm text-[var(--fg-secondary)]">
                        {entry.sections.qualityImprovements.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {entry.sections?.fixes?.length ? (
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--fg-primary)]">
                        <CheckCircle2Icon className="h-5 w-5 text-[var(--accent)]" />
                        Correções
                      </h3>
                      <ul className="list-disc space-y-1 pl-6 text-sm text-[var(--fg-secondary)]">
                        {entry.sections.fixes.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {entry.sections?.internalChanges?.length ? (
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--fg-primary)]">
                        <HistoryIcon className="h-5 w-5 text-[var(--accent)]" />
                        Alterações internas
                      </h3>
                      <ul className="list-disc space-y-1 pl-6 text-sm text-[var(--fg-secondary)]">
                        {entry.sections.internalChanges.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </GlowCard>
          </section>
        ))}

        {/* CTA final */}
        <section className="mx-auto w-full max-w-3xl space-y-6 border-t border-[var(--border-muted)] pt-10 text-center">
          <GitBranchIcon className="mx-auto h-8 w-8 text-[var(--accent)]" />
          <h2 className="text-2xl font-semibold text-[var(--fg-primary)]">
            Acompanhe o desenvolvimento
          </h2>
          <p className="text-[var(--fg-secondary)] max-w-xl mx-auto">
            Veja o histórico completo de commits e releases do Proto-Typed no
            repositório oficial.
          </p>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link
              href="https://github.com/proto-typed/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon className="h-5 w-5" />
              Ver no GitHub
            </Link>
          </Button>
        </section>
      </main>

      <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-10">
        <DocsFooter />
      </div>
    </div>
  )
}
