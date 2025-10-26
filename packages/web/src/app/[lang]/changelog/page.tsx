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
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { DocsHeader } from '@/components/layouts/components/docs-header'
import DocsFooter from '@/components/layouts/components/docs-footer'
import { GlowCard, SectionHeader, Button, Separator } from '@/components/ui'
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/utils/types'

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

export default function ChangelogPage() {
  const params = useParams()
  const lang = (params?.lang as Locale) ?? 'en'
  const [dict, setDict] = useState<any>(null)

  useEffect(() => {
    getDictionary(lang).then(setDict)
  }, [lang])

  const changelog: ChangelogEntry[] = [
    {
      version: 'v0.1.0-beta',
      date: '2025-10-20',
      highlights: [
        dict?.changelog?.initialRelease ?? 'Initial release of Proto-Typed!',
      ],
      sections: {
        features: [
          dict?.changelog?.initialDslVersion ??
            'Initial version of the textual DSL for prototyping.',
          dict?.changelog?.integratedPlayground ??
            'Integrated playground with live preview.',
        ],
      },
    },
  ]
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)]">
      <DocsHeader />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        {/* Título principal */}
        <section>
          <SectionHeader
            align="center"
            eyebrow={dict?.changelog?.versionRegistry ?? 'Version Registry'}
            title={dict?.changelog?.title ?? 'Proto-Typed Change Log'}
            description={
              dict?.changelog?.description ??
              'History of releases, fixes, and continuous improvements of the textual prototyping system.'
            }
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
                        {dict?.changelog?.features ?? 'Features'}
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
                        {dict?.changelog?.improvements ?? 'Improvements'}
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
                        {dict?.changelog?.fixes ?? 'Fixes'}
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
                        {dict?.changelog?.internalChanges ?? 'Internal Changes'}
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
            {dict?.changelog?.trackDevelopment ?? 'Track development'}
          </h2>
          <p className="text-[var(--fg-secondary)] max-w-xl mx-auto">
            {dict?.changelog?.trackDevelopmentDescription ??
              'See the full history of commits and releases of Proto-Typed in the official repository.'}
          </p>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link
              href="https://github.com/proto-typed/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon className="h-5 w-5" />
              {dict?.changelog?.viewOnGitHub ?? 'View on GitHub'}
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
