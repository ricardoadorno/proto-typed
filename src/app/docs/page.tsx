import Link from "next/link"
import { ArrowRightIcon, CompassIcon, SparklesIcon, Wand2Icon } from "lucide-react"

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
} from "@/components/ui"
import docSections from "@/utils/toc"

const primaryDoc = docSections[0]?.items[0]

const highlightItems = [
  "Fluxo passo a passo para sair da ideia ao protótipo clicável.",
  "Playgrounds integrados e blocos de código com copy instantâneo.",
  "Guia de tokens, layouts e padrões visuais do proto-typed.",
]

export default function DocsHomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)]">
      <main className="flex flex-col gap-16 cotainer mx-auto px-4 py-10 sm:px-6 lg:px-10">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface)] px-6 py-14 shadow-[0_32px_120px_rgba(40,27,74,0.28)] sm:px-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-[-120px] h-72 w-72 rounded-full bg-[rgba(139,92,246,0.32)] blur-3xl" />
            <div className="absolute -right-32 bottom-[-160px] h-80 w-80 rounded-full bg-[rgba(34,211,238,0.18)] blur-3xl" />
          </div>

          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:items-start">
            <div className="space-y-6">
              <img src={("logo.svg")} alt="Proto-typed" className="h-80 w-auto absolute -z-10 left-10 bottom-15 opacity-15" />
              <Badge
                variant="outline"
                className="w-fit border-[color:rgba(139,92,246,0.32)] bg-[color:rgba(139,92,246,0.12)] text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]"
              >
                Proto-typed · Docs
              </Badge>
              <h1 className="text-4xl font-bold leading-[2.75rem] text-[var(--fg-primary)] sm:text-5xl sm:leading-[3.25rem]">
                Documentação enxuta para prototipar rápido no universo proto-typed
              </h1>
              <p className="text-lg leading-relaxed text-[var(--fg-secondary)]">
                Aprenda a usar a DSL, componentes e tokens oficiais para construir experiências navegáveis em minutos.
                Tudo pensado para um fluxo coeso entre design e desenvolvimento.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {primaryDoc ? (
                  <Button asChild size="lg" className="gap-2">
                    <Link href={(`/docs/${primaryDoc.slug}`)}>
                      <SparklesIcon className="h-5 w-5" />
                      Começar agora
                    </Link>
                  </Button>
                ) : null}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-2 border-[var(--border-muted)] text-[var(--fg-secondary)] hover:text-[var(--accent-light)]"
                >
                  <Link href={("/playground")}>
                    <CompassIcon className="h-5 w-5" />
                    Ir para o playground
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-4">
              <Card className="border-[color:rgba(139,92,246,0.24)] bg-[color:rgba(21,23,28,0.96)] shadow-[0_18px_60px_rgba(20,18,30,0.45)]">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-[var(--accent)]">
                    <Wand2Icon className="h-4 w-4" />
                    Destaques
                  </CardTitle>
                  <CardDescription>
                    Os pontos essenciais para dominar o proto-typed do zero ao avançado.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-[var(--fg-secondary)]">
                  {highlightItems.map((item) => (
                    <p key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--brand-400)]" />
                      <span>{item}</span>
                    </p>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* <section className="space-y-6">
          <div className="flex items-center gap-3">
            <SparklesIcon className="h-5 w-5 text-[var(--accent-light)]" />
            <h2 className="text-xl font-semibold text-[var(--fg-primary)]">Navegação rápida</h2>
          </div>
          <Separator className="border-[var(--border-muted)]" />
          <div className="flex flex-wrap gap-3">
            {flatDocs.slice(0, 14).map((doc) => (
              <Badge
                key={doc.slug}
                variant="outline"
                className="border-[color:rgba(139,92,246,0.24)] bg-[color:rgba(139,92,246,0.08)] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-[var(--accent)] transition-colors hover:bg-[color:rgba(139,92,246,0.12)]"
              >
                <Link href={(`/docs/${doc.slug}`)}>{doc.title}</Link>
              </Badge>
            ))}
          </div>
        </section> */}

        <section className="space-y-6">
          <div className="flex flex-col gap-2 text-balance sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[var(--fg-primary)]">Explorar por capítulos</h2>
              <p className="max-w-xl text-sm text-[var(--fg-secondary)]">
                A documentação é organizada em capítulos temáticos. Avance conforme a sua necessidade, sem perder o
                contexto do fluxo completo.
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {docSections.map((section) => (
              <Card
                key={section.title}
                className="flex h-full flex-col justify-between border border-[var(--border-muted)] bg-[var(--bg-surface)]/90 transition-transform duration-200 hover:-translate-y-1 hover:border-[var(--brand-400)] hover:bg-[var(--bg-surface)]"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-[var(--fg-primary)]">{section.title}</CardTitle>
                  <CardDescription>
                    {section.items.length} tópico{section.items.length > 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {section.items.slice(0, 4).map((item) => (
                    <Link
                      key={item.slug}
                      href={(`/docs/${item.slug}`)}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2 text-sm text-[var(--fg-secondary)] transition-colors hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.08)] hover:text-[var(--accent-light)]"
                    >
                      <span>{item.title}</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </CardContent>
                <CardFooter className="pt-0">
                  {section.items[0] ? (
                    <Button asChild variant="ghost" className="gap-2 text-[var(--accent-light)]">
                      <Link href={(`/docs/${section.items[0].slug}`)}>
                        Abrir primeiro tópico
                        <ArrowRightIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>


      </main>
    </div>
  )
}
