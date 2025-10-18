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


export function DocsLayout({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)


  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)]">
      <DocsHeader
        onOpenSidebar={() => setMobileSidebarOpen(true)}
      />

      <div className="mx-auto flex w-full max-w-[1360px] gap-8 px-4 pb-20 pt-10 sm:px-6 lg:px-0 xl:gap-12 xl:pt-14">
        <aside className="sticky top-[64px] h-[calc(100vh-64px)] hidden  w-[240px] flex-shrink-0 xl:block">
          <ScrollArea className="h-full ">
            <div className="px-4 py-5">
              <DocsSidebar sections={docSections} />
            </div>
          </ScrollArea>
        </aside>

        <main className="flex w-full min-w-0 flex-1 flex-col gap-16">
          {children}
          <Separator className="border-[var(--border-muted)]" />
          <DocsFooter />
        </main>
      </div>

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
              <Button variant="ghost" size="sm" className="text-[var(--fg-secondary)] hover:text-[var(--accent)]">
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
