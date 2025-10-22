"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"

import DocsFooter from "./components/docs-footer"
import DocsHeader from "./components/docs-header"
import DocsSidebar from "./components/docs-sidebar"
import {docSections} from "@proto-typed/shared"
import {
  ScrollArea,
  Separator,
} from "@/components/ui"
import { ChevronLeft, ChevronRight } from "lucide-react"

const localStorageKey = "docs-sidebar-collapsed"

export function DocsLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

      useEffect(() => {
          const storedValue = localStorage.getItem(localStorageKey)
          if (storedValue !== null) setSidebarCollapsed(storedValue === "true");
      }, [])
  
      const handleCollapseChange = (collapsed: boolean) => {
          setSidebarCollapsed(collapsed)
          localStorage.setItem(localStorageKey, collapsed.toString())
      }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)] transition-all duration-300">
      <DocsHeader isDocs />

      <div className="mx-auto flex gap- w-full max-w-[1360px] px-4 pb-20 pt-10 sm:px-6 lg:px-0 xl:pt-14">
        {/* SIDEBAR (desktop) */}
        <aside
          className={`relative hidden xl:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "w-[56px]" : "w-[260px]"
          }`}
        >
          <div className="sticky top-[64px] h-[calc(100vh-64px)]  transition-all duration-300">
            <ScrollArea className={`h-full ${sidebarCollapsed ? "px-2" : "px-4"} py-5`}>
              {!sidebarCollapsed && (
                <DocsSidebar sections={docSections} />
              )}
            </ScrollArea>

            {/* BOTÃO DE TOGGLE */}
            <button
              onClick={() => handleCollapseChange(!sidebarCollapsed)}
              className="absolute -right-3 top-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-muted)] bg-[var(--bg-surface)] shadow-sm hover:text-[var(--accent)] transition"
              aria-label={sidebarCollapsed ? "Mostrar sidebar" : "Esconder sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex w-full min-w-0 flex-1 flex-col gap-16 transition-all duration-300">
          {children}
          <Separator className="border-[var(--border-muted)]" />
          <DocsFooter />
        </main>
      </div>

    </div>
  )
}

export default DocsLayout
