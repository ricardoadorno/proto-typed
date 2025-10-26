'use client'

import {
  BugIcon,
  RefreshCcwIcon,
  WrenchIcon,
  InfoIcon,
  ExternalLinkIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Badge, GlowCard, SectionHeader, Button } from '@/components/ui'
import { DocsHeader } from '@/components/layouts/components/docs-header'
import DocsFooter from '@/components/layouts/components/docs-footer'
import { getDictionary, type Dictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/utils/types'

type KnownError = {
  title: string
  description: string
  cause: string
  fix?: string
  status: string
  severity: 'high' | 'medium' | 'low'
}

const ErrorSeverityBadge = ({ level }: { level: KnownError['severity'] }) => {
  const colors: Record<string, string> = {
    high: 'bg-red-500/10 text-red-400 border-red-400/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20',
    low: 'bg-green-500/10 text-green-400 border-green-400/20',
  }

  const label = level.charAt(0).toUpperCase() + level.slice(1)

  return (
    <Badge
      variant="outline"
      className={`text-xs uppercase tracking-wide ${colors[level] || ''}`}
    >
      {label}
    </Badge>
  )
}

export default function KnownErrorsPage() {
  const params = useParams()
  const lang = (params?.lang as Locale) ?? 'en'
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(lang).then(setDict)
  }, [lang])

  const knownErrors: KnownError[] = [
    {
      title: dict?.known_errors?.indentationError ?? 'Indentation Error',
      description:
        dict?.known_errors?.indentationErrorDescription ??
        "When there is a blank line, it is understood as the end of the parent component's indentation, causing a failure in the correct rendering of styles in the dark theme.",
      cause:
        dict?.known_errors?.indentationErrorCause ??
        'Problem in the parser that understands blank lines as the end of a block',
      status: dict?.known_errors?.inProgress ?? 'Correction in progress',
      severity: 'medium',
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)]">
      <DocsHeader />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-12 sm:px-6 lg:px-10">
        <section className="space-y-8">
          <SectionHeader
            align="center"
            eyebrow="Erros conhecidos"
            title={
              dict?.known_errors?.title ??
              'List of identified bugs and limitations'
            }
            description={
              dict?.known_errors?.description ??
              'Here are the known issues in the current versions of Proto-Typed. Track their status and suggested solutions.'
            }
          />
          <div className="grid gap-6 md:grid-cols-2">
            {knownErrors.map((error) => (
              <GlowCard key={error.title} hoverLift={false}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--fg-primary)]">
                      {error.title}
                    </h3>
                    <ErrorSeverityBadge level={error.severity} />
                  </div>
                  <p className="text-sm text-[var(--fg-secondary)]">
                    {error.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start gap-2">
                      <BugIcon className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                      <span>
                        <strong>{dict?.known_errors?.cause ?? 'Cause'}:</strong>{' '}
                        {error.cause}
                      </span>
                    </p>
                    {error.fix && (
                      <p className="flex items-start gap-2">
                        <WrenchIcon className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                        <span>
                          <strong>{dict?.known_errors?.fix ?? 'Fix'}:</strong>{' '}
                          {error.fix}
                        </span>
                      </p>
                    )}
                    <p className="flex items-start gap-2">
                      <RefreshCcwIcon className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                      <span>
                        <strong>
                          {dict?.known_errors?.status ?? 'Status'}:
                        </strong>{' '}
                        {error.status}
                      </span>
                    </p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl space-y-6 border-t border-[var(--border-muted)] pt-10 text-center">
          <InfoIcon className="mx-auto h-8 w-8 text-[var(--accent)]" />
          <h2 className="text-2xl font-semibold text-[var(--fg-primary)]">
            {dict?.known_errors?.foundNewIssue ?? 'Found a new issue?'}
          </h2>
          <p className="text-[var(--fg-secondary)] max-w-xl mx-auto">
            {dict?.known_errors?.foundNewIssueDescription ??
              'Report a bug or unexpected behavior so we can investigate and fix it as quickly as possible.'}
          </p>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link
              href="https://github.com/ricardoadorno/proto-typed/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon className="h-5 w-5" />
              {dict?.known_errors?.openIssueOnGitHub ?? 'Open issue on GitHub'}
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
