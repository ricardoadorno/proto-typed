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
import { cn } from "@/lib/utils"

const THEME_STORAGE_KEY = "proto.docs.theme"

export function DocsLayout({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "dark" || stored === "light") {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <div className={cn("docs-theme", theme === "light" && "docs-theme--light")}>
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)]">
        <DocsHeader
          theme={theme}
          onThemeToggle={toggleTheme}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
        />

        <div className="mx-auto flex w-full max-w-[1360px] gap-10 px-6 pb-16 pt-10 sm:px-8 lg:px-12 xl:pt-12">
          <aside className="hidden w-[280px] flex-shrink-0 xl:block">
            <ScrollArea className="sticky top-24 max-h-[calc(100vh-120px)] rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface)] shadow-[0_1px_18px_rgba(0,0,0,0.18)]">
              <div className="p-4">
                <DocsSidebar sections={docSections} />
              </div>
            </ScrollArea>
          </aside>

          <main className="flex w-full flex-1 flex-col gap-16">
            {children}
            <Separator className="border-[var(--border-muted)]" />
            <DocsFooter />
          </main>
        </div>

        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="right" className="w-[85%] max-w-[360px] border-l border-[var(--border-muted)]">
            <SheetHeader className="text-left">
              <SheetTitle className="text-[var(--fg-primary)]">Navegação</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-1 flex-col gap-4">
              <ScrollArea className="h-full pr-3">
                <DocsSidebar sections={docSections} onNavigate={() => setMobileSidebarOpen(false)} />
              </ScrollArea>
            </div>
            <div className="mt-4 flex justify-end">
              <SheetClose asChild>
                <Button variant="ghost" size="sm">
                  Fechar
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default DocsLayout
