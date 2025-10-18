import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"
import type { DocItem } from "@/utils/toc"
import { withBaseUrl } from "@/utils/with-base-url"

interface DocsPagerProps {
    prev?: DocItem | null
    next?: DocItem | null
}

export function DocsPager({ prev, next }: DocsPagerProps) {
    if (!prev && !next) {
        return null
    }

    return (
        <nav
            aria-label="Paginação da documentação"
            className="mt-12 flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6"
        >
            {prev ? (
                <PagerCard
                    direction="prev"
                    label="Anterior"
                    title={prev.title}
                    href={withBaseUrl(`/docs/${prev.slug}`)}
                />
            ) : (
                <div className="hidden flex-1 md:block" />
            )}
            {next ? (
                <PagerCard
                    direction="next"
                    label="Próximo"
                    title={next.title}
                    href={withBaseUrl(`/docs/${next.slug}`)}
                />
            ) : (
                <div className="hidden flex-1 md:block" />
            )}
        </nav>
    )
}

interface PagerCardProps {
    direction: 'prev' | 'next'
    title: string
    label: string
    href: string
}

function PagerCard({ direction, title, label, href }: PagerCardProps) {
    const isPrev = direction === 'prev'
    const Icon = isPrev ? ArrowLeftIcon : ArrowRightIcon

    return (
        <Button
            asChild
            variant="ghost"
            className={cn(
                "group flex flex-1 items-center justify-between gap-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)] px-8 py-8 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.08)] focus-visible:ring-[var(--brand-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]",
            )}
        >
            <Link href={href}>
                <div className={cn("flex flex-col", isPrev ? "items-start" : "items-start text-right md:items-end")}>
                    <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--fg-secondary)]">
                        {label}
                    </span>
                    <span className="mt-2 text-base font-semibold text-[var(--fg-primary)]">{title}</span>
                </div>
                <Icon
                    className={cn(
                        "h-5 w-5 text-[var(--brand-300)] transition-transform duration-200",
                        isPrev ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
                    )}
                />
            </Link>
        </Button>
    )
}

export default DocsPager
