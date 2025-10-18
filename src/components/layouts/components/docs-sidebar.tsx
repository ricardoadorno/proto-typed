"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

import { cn } from "@/lib/utils"
import type { DocSection } from "@/utils/toc"


interface DocsSidebarProps {
  sections: DocSection[]
  onNavigate?: () => void
}

export default function DocsSidebar({ sections, onNavigate }: DocsSidebarProps) {
  const pathname = usePathname()
  const activeSlug = useMemo(() => pathname?.split("/").filter(Boolean).pop() ?? "", [pathname])

  return (
    <nav aria-label="Navegação da documentação" className="flex flex-col gap-6 text-sm">
      <a href={("llm.txt")} >LLM Text Docs</a>
      <div className="flex items-center justify-between px-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
          Guia
        </p>
        <span className="rounded-full bg-[color:rgba(139,92,246,0.12)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--accent)]">
          Docs
        </span>
      </div>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.28em] text-[color:rgba(169,175,191,0.72)]">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const href = (`/docs/${item.slug}`)
                const isActive = activeSlug === item.slug

                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center justify-between gap-2 rounded-lg border-l-2 border-transparent px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "border-l-[var(--brand-500)] bg-[color:rgba(139,92,246,0.12)] text-[var(--fg-primary)]"
                          : "text-[var(--fg-secondary)] hover:border-l-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.08)] hover:text-[var(--accent-light)]"
                      )}
                    >
                      <span className="truncate">{item.title}</span>
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full bg-transparent transition-colors",
                          isActive ? "bg-[var(--brand-300)]" : "group-hover:bg-[var(--brand-300)]"
                        )}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
