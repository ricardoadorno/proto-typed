"use client"

import { useMemo, useState } from "react"
import { LayersIcon, ListTreeIcon, MonitorIcon, SearchIcon } from "lucide-react"

import { Badge, Input, ScrollArea } from "@/components/ui"
import type { RouteMetadata } from "@/types/routing"
import { cn } from "@/lib/utils"

type NavigatorSection = {
  id: "screens" | "overlays" | "components"
  label: string
  items: { id: string; name: string; kind?: string }[]
}

interface PlaygroundNavigatorProps {
  metadata: RouteMetadata | null
  currentScreen?: string | null
  onSelectScreen: (screenName: string) => void
  onClose?: () => void
}

export function PlaygroundNavigator({
  metadata,
  currentScreen,
  onSelectScreen,
  onClose,
}: PlaygroundNavigatorProps) {
  const [query, setQuery] = useState("")

  const sections = useMemo<NavigatorSection[]>(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const filterItems = <T extends { name: string }>(items: T[]) =>
      normalizedQuery.length === 0
        ? items
        : items.filter((item) => item.name.toLowerCase().includes(normalizedQuery))

    const screens =
      metadata?.screens.map((screen) => ({ id: screen.id, name: screen.name })) ?? []

    const overlays = [
      ...(metadata?.modals.map((modal) => ({ id: modal.id, name: modal.name, kind: "Modal" })) ?? []),
      ...(metadata?.drawers.map((drawer) => ({ id: drawer.id, name: drawer.name, kind: "Drawer" })) ?? []),
    ]

    const components =
      metadata?.components.map((component) => ({ id: component.id, name: component.name })) ?? []

    return [
      { id: "screens", label: "Screens", items: filterItems(screens) },
      { id: "overlays", label: "Overlays", items: filterItems(overlays) },
      { id: "components", label: "Components", items: filterItems(components) },
    ]
  }, [metadata, query])

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface)] shadow-[0_18px_48px_rgba(14,16,24,0.3)]">
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
          <ListTreeIcon className="h-4 w-4 text-[var(--brand-400)]" />
          Navigator
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-transparent px-3 py-1 text-xs uppercase tracking-[0.28em] text-[var(--fg-secondary)] transition-colors hover:border-[var(--brand-400)] hover:text-[var(--accent)]"
          >
            Fechar
          </button>
        ) : null}
      </div>

      <div className="border-b border-[var(--border-muted)] px-4 py-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-secondary)]/60" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search screens, overlays..."
            className="w-full rounded-xl border-[var(--border-muted)] bg-[var(--bg-raised)] pl-9 text-sm text-[var(--fg-secondary)] placeholder:text-[var(--fg-secondary)]/50 focus-visible:ring-[var(--brand-400)] focus-visible:ring-offset-[var(--bg-surface)]"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6 pr-3">
          {sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  {section.id === "screens" ? (
                    <MonitorIcon className="h-4 w-4 text-[var(--brand-400)]" />
                  ) : section.id === "overlays" ? (
                    <LayersIcon className="h-4 w-4 text-[var(--brand-400)]" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-[var(--brand-300)]" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
                    {section.label}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-[color:rgba(139,92,246,0.32)] bg-[color:rgba(139,92,246,0.12)] text-[10px] tracking-[0.28em] text-[var(--accent)]"
                >
                  {section.items.length}
                </Badge>
              </div>

              <div className="space-y-1.5">
                {section.items.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-[var(--border-muted)] px-3 py-4 text-center text-xs text-[var(--fg-secondary)]/70">
                    Nenhum item encontrado
                  </div>
                ) : (
                  section.items.map((item) => {
                    const isActive = section.id === "screens" && currentScreen === item.name
                    const isDisabled = section.id !== "screens"
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (section.id === "screens") {
                            onSelectScreen(item.name)
                            onClose?.()
                          }
                        }}
                        disabled={isDisabled}
                        className={cn(
                          "group flex w-full items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-left transition-colors",
                          isDisabled
                            ? "cursor-not-allowed text-[var(--fg-secondary)]/60"
                            : "text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.08)] hover:text-[var(--accent)]",
                          isActive &&
                            "border-[var(--brand-400)] bg-[color:rgba(139,92,246,0.14)] text-[var(--fg-primary)]"
                        )}
                      >
                        <span className="truncate">{item.name}</span>
                        {item.kind ? (
                          <Badge
                            variant="outline"
                            className="rounded-full border-[color:rgba(139,92,246,0.24)] bg-transparent text-[10px] tracking-[0.28em] text-[var(--accent)]"
                          >
                            {item.kind}
                          </Badge>
                        ) : null}
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default PlaygroundNavigator
