"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"
import type { DocSection } from "@/utils/toc"
import { withBaseUrl } from "@/utils/with-base-url"

const STORAGE_KEY = "proto.docs.sidebar"

interface DocsSidebarProps {
  sections: DocSection[]
  onNavigate?: () => void
}

export default function DocsSidebar({ sections, onNavigate }: DocsSidebarProps) {
  const pathname = usePathname()
  const activeSlug = useMemo(() => pathname?.split("/").filter(Boolean).pop() ?? "", [pathname])

  const [openSections, setOpenSections] = useState<string[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    let restored: string[] | undefined
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as unknown
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
          restored = parsed as string[]
        }
      }
    } catch {
      restored = undefined
    }

    const activeSections = sections
      .filter((section) => section.items.some((item) => item.slug === activeSlug))
      .map((section) => section.title)

    const fallbackSection = sections[0]?.title ? [sections[0].title] : []

    const nextState =
      restored && restored.length > 0
        ? Array.from(new Set([...restored, ...activeSections]))
        : activeSections.length > 0
          ? activeSections
          : fallbackSection

    setOpenSections(nextState)
  }, [sections, activeSlug])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(openSections))
  }, [openSections])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      if (prev.includes(title)) {
        return prev.filter((item) => item !== title)
      }
      return [...prev, title]
    })
  }

  return (
    <nav
      aria-label="Navegação da documentação"
      className="relative overflow-hidden rounded-lg border border-[var(--border-muted)] bg-[var(--bg-surface)] shadow-[0_1px_12px_rgba(0,0,0,0.18)]"
    >
      <div className="px-4 pb-4 pt-5">
        <p className="px-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--fg-secondary)]">
          Conteúdo
        </p>
      </div>
      <div className="space-y-2 px-2 pb-4">
        {sections.map((section) => {
          const isOpen = openSections.includes(section.title)
          const estimatedHeight = section.items.length * 44 + 24

          return (
            <div key={section.title}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)] transition-colors hover:text-[var(--accent-light)]"
                aria-expanded={isOpen}
              >
                <span>{section.title}</span>
                <ChevronDownIcon
                  className={cn("h-4 w-4 transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")}
                />
              </Button>
              <div
                className="overflow-hidden transition-[max-height] duration-200 ease-in-out"
                style={{ maxHeight: isOpen ? `${estimatedHeight}px` : "0px" }}
                aria-hidden={!isOpen}
              >
                <ul className="mt-1 space-y-1 border-l border-dashed border-[var(--border-muted)] pl-3">
                  {section.items.map((item) => {
                    const href = withBaseUrl(`/docs/${item.slug}`)
                    const isActive = activeSlug === item.slug

                    return (
                      <li key={item.slug}>
                        <Link
                          href={href}
                          onClick={onNavigate}
                          className={cn(
                            "group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                            isActive
                              ? "border-l-4 border-[var(--accent)] bg-[var(--surface-press)] text-[var(--fg-primary)]"
                              : "border-l-4 border-transparent text-[var(--fg-secondary)] hover:border-[var(--accent)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent-light)]"
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-muted)] transition-colors group-hover:bg-[var(--accent-light)]" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
