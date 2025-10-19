"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"

import DocsFooter from "./components/docs-footer"
import DocsHeader from "./components/docs-header"
import DocsSidebar from "./components/docs-sidebar"
import docSections from "@/utils/toc"
import {
  Button,
  ScrollArea,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui"
import { ChevronLeft, ChevronRight } from "lucide-react"

const localStorageKey = "docs-sidebar-collapsed"

export function DocsLayout({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
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
      <DocsHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />

      <div className="mx-auto flex w-full max-w-[1360px] px-4 pb-20 pt-10 sm:px-6 lg:px-0 xl:pt-14">
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

      {/* SIDEBAR MOBILE */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[90%] max-w-[340px] border-r border-[var(--border-muted)] bg-[var(--bg-surface)]"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--fg-secondary)]">
              Navegação
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-1 flex-col gap-4">
            <ScrollArea className="h-full pr-2">
              <DocsSidebar sections={docSections} onNavigate={() => setMobileSidebarOpen(false)} />
            </ScrollArea>
          </div>
          <div className="mt-4 flex justify-end">
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--fg-secondary)] hover:text-[var(--accent)]"
              >
                Fechar
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default DocsLayout
