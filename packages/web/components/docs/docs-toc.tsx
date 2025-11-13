'use client'

import { useEffect, useState } from "react"
import { ChevronDownIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { Button, ScrollArea } from "@/components/ui"
import { cn } from "@/lib/utils"

export interface TocItem {
    slug: string
    title: string
    level: 2 | 3
}

interface DocsTocProps {
    items: TocItem[]
}

const localStorageKey = "docs-toc-collapsed"

export function DocsToc({ items }: DocsTocProps) {
    const [activeId, setActiveId] = useState<string | null>(null)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(true)

    useEffect(() => {
        const storedValue = localStorage.getItem(localStorageKey)
        if (storedValue !== null) setIsCollapsed(storedValue === "true");
    }, [])

    const handleCollapseChange = (collapsed: boolean) => {
        setIsCollapsed(collapsed)
        localStorage.setItem(localStorageKey, collapsed.toString())
    }

    useEffect(() => {
        if (!items.length || typeof window === 'undefined') {
            return
        }

        const handleHash = () => {
            const hash = window.location.hash.replace('#', '')
            if (hash) {
                setActiveId(hash)
            }
        }

        handleHash()
        window.addEventListener('hashchange', handleHash)
        return () => window.removeEventListener('hashchange', handleHash)
    }, [items])

    useEffect(() => {
        if (!items.length || typeof window === 'undefined') {
            return
        }

        const nodes = items
            .map((item) => document.getElementById(item.slug))
            .filter((el): el is HTMLElement => Boolean(el))

        if (!nodes.length) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

                if (visible.length > 0) {
                    setActiveId(visible[0].target.id)
                    return
                }

                const closest = entries
                    .slice()
                    .sort(
                        (a, b) =>
                            Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
                    )
                if (closest[0]) {
                    setActiveId(closest[0].target.id)
                }
            },
            {
                rootMargin: '-45% 0px -50% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1],
            }
        )

        nodes.forEach((heading) => observer.observe(heading))
        return () => observer.disconnect()
    }, [items])

    if (!items.length) {
        return null
    }

    const TocList = () => (
        <ul className="space-y-1.5">
            {items.map((item) => {
                const isActive = activeId === item.slug
                return (
                    <li key={item.slug}>
                        <a
                            href={`#${item.slug}`}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                                'flex items-center gap-2 rounded-md border-l-2 border-transparent px-3 py-1.5 text-sm text-[var(--fg-secondary)] transition-colors hover:border-[var(--brand-300)] hover:text-[var(--accent-light)]',
                                item.level === 3 && 'pl-6 text-xs uppercase tracking-[0.18em]',
                                isActive &&
                                'border-[var(--brand-400)] bg-[color:rgba(139,92,246,0.12)] text-[var(--accent)]'
                            )}
                        >
                            <span className="truncate">{item.title}</span>
                        </a>
                    </li>
                )
            })}
        </ul>
    )

    return (
        <div className="relative flex flex-col gap-4 transition-all duration-300 ease-in-out xl:sticky xl:top-24 xl:flex-none">
            {/* Desktop */}

            <button
              onClick={() => handleCollapseChange(!isCollapsed)}
              className="absolute -right-3 top-1/2 hidden h-6 w-6 items-center justify-center rounded-full border border-[var(--border-muted)] bg-[var(--bg-surface)] shadow-sm transition hover:text-[var(--accent)] xl:flex"
              aria-label={isCollapsed ? "Mostrar toc" : "Esconder toc"}
              aria-expanded={isCollapsed}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            
            {isCollapsed && (
                <div className="hidden w-full max-w-[240px] xl:block xl:w-[240px]">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
                    Nesta página
                </p>
                <ScrollArea className="max-h-[70vh] pr-1 text-sm">
                    <TocList />
                </ScrollArea>
                </div>
            )}

            {/* Mobile */}
            <div className="xl:hidden">
                <Button
                    variant="outline"
                    className="flex w-full items-center justify-between rounded-lg border-[var(--border-muted)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--fg-primary)]"
                    onClick={() => setIsMobileOpen((prev) => !prev)}
                >
                    Nesta página
                    <ChevronDownIcon
                        className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isMobileOpen ? "rotate-180" : "rotate-0"
                        )}
                    />
                </Button>

                {isMobileOpen && (
                    <div className="mt-3 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)] px-3 py-4 shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
                        <TocList />
                    </div>
                )}
            </div>
        </div>

    )
}

export default DocsToc
