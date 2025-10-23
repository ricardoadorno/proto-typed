'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CommandIcon, Search } from 'lucide-react'

import {
  Badge,
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui'
import { DocItem, DocSection } from '@/utils/toc'

interface DocsSearchProps {
  sections: DocSection[]
}

export function DocsSearch({ sections }: DocsSearchProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const items = useMemo(
    () =>
      sections.map((section) => ({
        label: section.title,
        items: section.items,
      })),
    [sections]
  )

  const handleOpen = useCallback(() => setOpen(true), [])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = (doc: DocItem) => {
    setOpen(false)
    router.push(`/docs/${doc.slug}`)
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="outline"
        className="hidden md:flex w-full items-center justify-between rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)] px-4 py-3 text-left text-sm text-[var(--fg-secondary)] shadow-[0_6px_18px_rgba(0,0,0,0.24)] transition-colors hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.08)] hover:text-[var(--accent-light)] sm:w-[320px]"
      >
        <span>Buscar tópicos, componentes...</span>
        <span className="flex items-center gap-1 rounded-lg border border-[var(--border-muted)] bg-[var(--bg-raised)] px-2 py-1 text-[10px] uppercase tracking-[0.32em] text-[var(--fg-secondary)]">
          <Search className="h-3 w-3" />
          <CommandIcon className="h-3 w-3" />K
        </span>
      </Button>
      <Button variant="ghost" onClick={handleOpen} className="p-2 md:hidden">
        <Search className="h-5 w-5 text-[var(--fg-secondary)]" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        searchPlaceholder="Buscar na documentação"
      >
        <CommandList>
          <CommandEmpty>Nenhum resultado.</CommandEmpty>
          {items.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.items.map((doc) => (
                <CommandItem
                  key={doc.slug}
                  value={`${group.label} ${doc.title}`.toLowerCase()}
                  onSelect={() => handleSelect(doc)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2"
                >
                  <Badge
                    variant="outline"
                    className="border-[color:rgba(139,92,246,0.24)] bg-[color:rgba(139,92,246,0.08)] text-[10px] text-[var(--accent)]"
                  >
                    {group.label}
                  </Badge>
                  <span className="text-[var(--fg-primary)]">{doc.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Atalhos">
            <CommandItem disabled className="justify-between">
              Abrir busca
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
            <CommandItem disabled className="justify-between">
              Ir para editor
              <CommandShortcut>G E</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default DocsSearch
