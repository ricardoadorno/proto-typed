'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import DocsFooter from './components/docs-footer'
import DocsHeader from './components/docs-header'
import DocsSidebar from './components/docs-sidebar'
import { ScrollArea, Separator } from '@/components/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DocSection } from '@/utils/toc'

const localStorageKey = 'docs-sidebar-collapsed'

export function DocsLayout({
  children,
  paramsOverride,
}: {
  children: ReactNode
  paramsOverride?: Record<string, string | string[]>
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [docSections, setDocSections] = useState<DocSection[]>([])
  const paramsFromHook = useParams()
  const params = paramsOverride || paramsFromHook
  const lang = (params.lang as string) || 'en'

  useEffect(() => {
    const storedValue = localStorage.getItem(localStorageKey)
    if (storedValue !== null) setSidebarCollapsed(storedValue === 'true')
  }, [])

  useEffect(() => {
    async function loadToc() {
      const tocModule =
        lang === 'pt'
          ? await import('@/utils/toc.pt')
          : await import('@/utils/toc')
      setDocSections(tocModule.docSections)
    }
    loadToc()
  }, [lang])

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
            sidebarCollapsed ? 'w-[56px]' : 'w-[260px]'
          }`}
        >
          <div className="sticky top-[64px] h-[calc(100vh-64px)]  transition-all duration-300">
            <ScrollArea
              className={`h-full ${sidebarCollapsed ? 'px-2' : 'px-4'} py-5`}
            >
              {!sidebarCollapsed && (
                <DocsSidebar sections={docSections} lang={lang} />
              )}
            </ScrollArea>

            {/* TOGGLE BUTTON */}
            <button
              onClick={() => handleCollapseChange(!sidebarCollapsed)}
              className="absolute -right-3 top-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-muted)] bg-[var(--bg-surface)] shadow-sm hover:text-[var(--accent)] transition"
              aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
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
