"use client"

import { useMemo } from "react"
import { LayersIcon, Link2Icon, PaletteIcon, SlidersIcon } from "lucide-react"

import { Badge, ScrollArea, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui"
import { cn } from "@/lib/utils"
import type { RouteMetadata } from "@/types/routing"

interface PlaygroundInspectorProps {
  metadata: RouteMetadata | null
  currentScreen?: string | null
  pickMode: boolean
}

export function PlaygroundInspector({ metadata, currentScreen, pickMode }: PlaygroundInspectorProps) {
  const screenDetails = useMemo(() => {
    if (!metadata || !currentScreen) {
      return null
    }
    return metadata.screens.find((screen) => screen.name === currentScreen) ?? null
  }, [metadata, currentScreen])

  return (
    <div className="flex h-[320px] flex-col overflow-hidden rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface)] shadow-[0_16px_48px_rgba(14,16,24,0.28)]">
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-4 py-3">
        <div className="flex items-center gap-2">
          <LayersIcon className="h-4 w-4 text-[var(--brand-400)]" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)]">Inspector</p>
            <p className="text-sm text-[var(--fg-primary)]">{currentScreen ?? "Nenhuma tela ativa"}</p>
          </div>
        </div>
        {pickMode ? (
          <Badge
            variant="outline"
            className="rounded-full border-[color:rgba(139,92,246,0.32)] bg-[color:rgba(139,92,246,0.16)] text-[10px] uppercase tracking-[0.28em] text-[var(--accent)]"
          >
            Pick mode
          </Badge>
        ) : null}
      </div>

      <Tabs defaultValue="props" className="flex h-full flex-col">
        <TabsList className="mx-4 mt-3 grid h-10 grid-cols-4 rounded-xl bg-[var(--bg-raised)] p-1">
          <TabsTrigger value="props" className="text-xs">
            <SlidersIcon className="mr-2 h-3.5 w-3.5" />
            Props
          </TabsTrigger>
          <TabsTrigger value="styles" className="text-xs">
            <PaletteIcon className="mr-2 h-3.5 w-3.5" />
            Styles
          </TabsTrigger>
          <TabsTrigger value="events" className="text-xs">
            <Link2Icon className="mr-2 h-3.5 w-3.5" />
            Events
          </TabsTrigger>
          <TabsTrigger value="data" className="text-xs">
            <LayersIcon className="mr-2 h-3.5 w-3.5" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="props" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-4">
            <ContentSection
              title="Screen metadata"
              description="Detalhes da tela selecionada em tempo real."
              items={[
                { label: "Name", value: screenDetails?.name ?? "—" },
                { label: "Default", value: metadata?.defaultScreen === currentScreen ? "Yes" : "No" },
                { label: "Total Components", value: `${metadata?.components.length ?? 0}` },
                { label: "Route Count", value: `${metadata?.totalRoutes ?? 0}` },
              ]}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="styles" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-4">
            <ContentSection
              title="Tokens ativos"
              description="Cores e superfícies aplicadas pelo tema atual."
              items={[
                { label: "Surface", value: "var(--bg-surface)" },
                { label: "Accent", value: "var(--accent)" },
                { label: "Border", value: "var(--border-muted)" },
                { label: "Focus ring", value: "ring-brand-300/50" },
              ]}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="events" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-4">
            <ContentSection
              title="Últimas navegações"
              description="Histórico de navegação gerado durante a sessão."
              items={
                metadata?.navigationHistory.length
                  ? metadata.navigationHistory.map((entry, index) => ({
                      label: `${index + 1}.`,
                      value: entry,
                    }))
                  : [{ label: "Histórico", value: "Sem eventos" }]
              }
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="data" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-4">
            <ContentSection
              title="Estado do roteador"
              description="Snapshot do estado exposto pelo gerenciador de rotas."
              items={[
                { label: "Can go back", value: metadata?.canNavigateBack ? "Yes" : "No" },
                { label: "History length", value: `${metadata?.navigationHistory.length ?? 0}` },
                { label: "Current index", value: `${metadata?.currentHistoryIndex ?? -1}` },
              ]}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ContentSectionProps {
  title: string
  description: string
  items: { label: string; value: string }[]
}

function ContentSection({ title, description, items }: ContentSectionProps) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-[var(--fg-primary)]">{title}</p>
        <p className="text-xs text-[var(--fg-secondary)]">{description}</p>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="flex items-center justify-between rounded-xl border border-[var(--border-muted)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--fg-secondary)]"
          >
            <span className="text-xs uppercase tracking-[0.28em] text-[var(--fg-secondary)]">{item.label}</span>
            <span className={cn("text-sm text-[var(--fg-primary)]", item.value === "Yes" && "text-[var(--accent)]")}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlaygroundInspector
