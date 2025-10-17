import Link from 'next/link'
import { ArrowRightIcon, BookOpenIcon, CompassIcon, SparklesIcon } from 'lucide-react'

import DocsSearch from '@/components/docs/docs-search'
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Separator,
} from '@/components/ui'
import docSections, { flatDocs } from '@/utils/toc'
import { withBaseUrl } from '@/utils/with-base-url'

const primaryDoc = docSections[0]?.items[0]

export default function DocsHomePage() {
    return (
        <div className="flex flex-col gap-16">
            <section className="relative overflow-hidden rounded-3xl border border-[var(--border-muted)] bg-gradient-to-br from-[rgba(66,184,131,0.2)] via-[rgba(18,18,18,0.92)] to-[rgba(18,18,18,0.75)] px-8 py-16 shadow-[0_24px_80px_rgba(18,18,18,0.6)] sm:px-12">
                <div className="relative z-10 flex flex-col gap-8 text-balance md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl space-y-4">
                        <Badge variant="secondary" className="w-fit text-[10px]">
                            Vue · Proto-Typed
                        </Badge>
                        <h1 className="text-4xl font-semibold tracking-tight text-[var(--fg-primary)] sm:text-5xl">
                            Uma documentação pensada para prototipar rápido e com clareza
                        </h1>
                        <p className="text-lg leading-relaxed text-[var(--fg-secondary)]">
                            Explore padrões de layout, componentes e exemplos prontos para acelerar o seu fluxo de prototipação com a DSL do Proto-Typed.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            {primaryDoc ? (
                                <Button asChild size="lg">
                                    <Link href={withBaseUrl(`/docs/${primaryDoc.slug}`)}>
                                        <SparklesIcon className="mr-2 h-4 w-4" />
                                        Começar agora
                                    </Link>
                                </Button>
                            ) : null}
                            <Button asChild variant="outline" size="lg" className="border-[var(--border-muted)]">
                                <Link href={withBaseUrl('/')}>
                                    <CompassIcon className="mr-2 h-4 w-4" />
                                    Voltar para o editor
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="w-full max-w-sm space-y-4">
                        <DocsSearch sections={docSections} />
                        <Card className="border-[rgba(66,184,131,0.25)] bg-gradient-to-br from-[rgba(66,184,131,0.08)] via-[rgba(30,30,30,0.9)] to-[rgba(30,30,30,0.6)]">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.36em] text-[var(--accent)]">
                                    <BookOpenIcon className="h-4 w-4" /> Highlights
                                </CardTitle>
                                <CardDescription>
                                    Conteúdo curado para começar com estrutura, layout e interação.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-[var(--fg-secondary)]">
                                <p>
                                    • Guia passo a passo para sair do zero ao protótipo navegável.
                                </p>
                                <p>
                                    • Exemplos com código copy-friendly e playground integrado.
                                </p>
                                <p>
                                    • Princípios visuais alinhados ao design system Vue.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="absolute inset-0 z-0 opacity-40 blur-3xl">
                    <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-[rgba(66,184,131,0.4)]" />
                    <div className="absolute right-10 bottom-0 h-64 w-64 rounded-full bg-[rgba(96,165,250,0.25)]" />
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex flex-col gap-3 text-balance sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-[var(--fg-primary)]">Explorar por capítulos</h2>
                        <p className="text-sm text-[var(--fg-secondary)]">
                            Percorra a documentação em blocos modulares. Cada capítulo reúne tópicos relacionados.
                        </p>
                    </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {docSections.map((section) => (
                        <Card key={section.title} className="flex flex-col justify-between border-[var(--border-muted)] bg-[var(--bg-surface)]">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl text-[var(--fg-primary)]">
                                    {section.title}
                                </CardTitle>
                                <CardDescription>
                                    {section.items.length} tópico{section.items.length > 1 ? 's' : ''}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.slug}
                                        href={withBaseUrl(`/docs/${item.slug}`)}
                                        className="group flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2 text-sm text-[var(--fg-secondary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent-light)]"
                                    >
                                        <span>{item.title}</span>
                                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                ))}
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button asChild variant="ghost" className="gap-2 text-[var(--accent-light)]">
                                    <Link href={withBaseUrl(`/docs/${section.items[0]?.slug ?? ''}`)}>
                                        Abrir primeiro tópico
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <SparklesIcon className="h-5 w-5 text-[var(--accent-light)]" />
                    <h2 className="text-xl font-semibold text-[var(--fg-primary)]">Navegação rápida</h2>
                </div>
                <Separator className="border-[var(--border-muted)]" />
                <div className="flex flex-wrap gap-3">
                    {flatDocs.slice(0, 12).map((doc) => (
                        <Badge key={doc.slug} variant="outline" className="tracking-[0.28em]">
                            <Link href={withBaseUrl(`/docs/${doc.slug}`)} className="transition-colors hover:text-[var(--accent-light)]">
                                {doc.title}
                            </Link>
                        </Badge>
                    ))}
                </div>
            </section>
        </div>
    )
}
