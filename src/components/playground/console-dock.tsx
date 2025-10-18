"use client"

import { useState } from "react"
import { ActivityIcon, BugIcon, ClockIcon, CodeIcon, CommandIcon, DatabaseIcon, ListIcon } from "lucide-react"

import {
  Button,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui"
import { cn } from "@/lib/utils"
import type { ProtoError } from "@/types/errors"
import type { RouteMetadata } from "@/types/routing"

export type ConsoleLogLevel = "info" | "success" | "warning" | "error"

export interface ConsoleLogEntry {
  id: string
  message: string
  level: ConsoleLogLevel
  timestamp: number
}

interface PlaygroundConsoleDockProps {
  open: boolean
  onToggle: () => void
  onResizeStart: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  logs: ConsoleLogEntry[]
  errors: ProtoError[]
  metadata: RouteMetadata | null
}

const levelStyles: Record<ConsoleLogLevel, string> = {
  info: "border-[color:rgba(96,165,250,0.4)] bg-[color:rgba(96,165,250,0.12)] text-[var(--info)]",
  success: "border-[color:rgba(34,197,94,0.4)] bg-[color:rgba(34,197,94,0.12)] text-[var(--success)]",
  warning: "border-[color:rgba(245,158,11,0.4)] bg-[color:rgba(245,158,11,0.12)] text-[var(--warning)]",
  error: "border-[color:rgba(239,68,68,0.4)] bg-[color:rgba(239,68,68,0.12)] text-[var(--danger)]",
}

export function PlaygroundConsoleDock({ open, onToggle, onResizeStart, logs, errors, metadata }: PlaygroundConsoleDockProps) {
  const [activeTab, setActiveTab] = useState("logs")

  const hasErrors = errors.length > 0

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col overflow-hidden">
        <div
          onMouseDown={onResizeStart}
          className="group flex cursor-row-resize items-center justify-center py-1"
          aria-hidden
        >
          <span className="h-1 w-16 rounded-full bg-[color:rgba(139,92,246,0.32)] transition-colors group-hover:bg-[var(--brand-400)]" />
        </div>
        <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
            <CodeIcon className="h-4 w-4 text-[var(--brand-400)]" />
            Console
            {hasErrors ? (
              <span className="rounded-full bg-[color:rgba(239,68,68,0.14)] px-2 py-0.5 text-[10px] font-medium text-[var(--danger)]">
                {errors.length} errors
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setActiveTab("logs")}
                  className="h-8 rounded-lg border border-transparent px-3 text-xs uppercase tracking-[0.28em] text-[var(--fg-secondary)] transition-colors hover:border-[var(--brand-400)] hover:text-[var(--accent)]"
                >
                  Clear
                </Button>
              </TooltipTrigger>
              <TooltipContent>Scroll to review recent output</TooltipContent>
            </Tooltip>
            <Button
              type="button"
              variant="ghost"
              onClick={onToggle}
              className="h-8 rounded-lg border border-transparent px-3 text-xs uppercase tracking-[0.28em] text-[var(--fg-secondary)] transition-colors hover:border-[var(--brand-400)] hover:text-[var(--accent)]"
            >
              {open ? "Minimizar" : "Expandir"}
            </Button>
          </div>
        </div>

        {open ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
            <div className="border-b border-[var(--border-muted)] px-4 py-3">
              <TabsList className="h-10 rounded-xl bg-[var(--bg-raised)] p-1">
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <ListIcon className="h-4 w-4" />
                  Logs
                </TabsTrigger>
                <TabsTrigger value="errors" className="flex items-center gap-2">
                  <BugIcon className="h-4 w-4" />
                  Errors
                </TabsTrigger>
                <TabsTrigger value="network" className="flex items-center gap-2">
                  <ActivityIcon className="h-4 w-4" />
                  Network
                </TabsTrigger>
                <TabsTrigger value="state" className="flex items-center gap-2">
                  <DatabaseIcon className="h-4 w-4" />
                  State
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="actions" className="flex items-center gap-2">
                  <CommandIcon className="h-4 w-4" />
                  Actions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="logs" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-4 py-4">
                <div className="space-y-2 pr-6">
                  {logs.length === 0 ? (
                    <EmptyState message="Nenhum log registrado ainda." />
                  ) : (
                    logs
                      .slice()
                      .reverse()
                      .map((log) => (
                        <div
                          key={log.id}
                          className={cn(
                            "rounded-2xl border px-4 py-3 text-sm shadow-[0_1px_12px_rgba(0,0,0,0.12)]",
                            levelStyles[log.level]
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-[0.28em] opacity-80">
                              {log.level}
                            </span>
                            <span className="text-[10px] text-[var(--fg-secondary)]">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="mt-2 text-[var(--fg-primary)]">{log.message}</p>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="errors" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-4 py-4">
                <div className="space-y-2 pr-6">
                  {errors.length === 0 ? (
                    <EmptyState message="Nenhum erro encontrado." />
                  ) : (
                    errors
                      .slice()
                      .reverse()
                      .map((error, index) => (
                        <div
                          key={`${error.code}-${index}`}
                          className="rounded-2xl border border-[color:rgba(239,68,68,0.4)] bg-[color:rgba(239,68,68,0.12)] px-4 py-3 text-sm text-[var(--danger)] shadow-[0_1px_12px_rgba(0,0,0,0.12)]"
                        >
                          <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em]">
                            <span>{error.stage}</span>
                            <span>
                              L{error.line ?? "-"}C{error.column ?? "-"}
                            </span>
                          </div>
                          <p className="mt-2 font-medium text-[var(--fg-primary)]">{error.message}</p>
                          {error.hint ? (
                            <p className="mt-1 text-xs text-[var(--fg-secondary)]">{error.hint}</p>
                          ) : null}
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="network" className="flex-1 overflow-hidden">
              <EmptyState message="Network timeline ainda não disponível." icon={<ActivityIcon className="h-5 w-5" />} />
            </TabsContent>

            <TabsContent value="state" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-4 py-4">
                <div className="space-y-4 pr-6 text-sm text-[var(--fg-secondary)]">
                  {metadata ? (
                    <>
                      <InfoRow label="Current Screen" value={metadata.currentScreen ?? "—"} />
                      <InfoRow label="Default Screen" value={metadata.defaultScreen ?? "—"} />
                      <InfoRow label="Total Routes" value={metadata.totalRoutes.toString()} />
                      <InfoRow label="Navigation History" value={`${metadata.navigationHistory.length} entries`} />
                      <InfoRow label="Can Navigate Back" value={metadata.canNavigateBack ? "Yes" : "No"} />
                    </>
                  ) : (
                    <EmptyState message="Nenhum estado disponível." />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="timeline" className="flex-1 overflow-hidden">
              <EmptyState message="Timeline tooling em construção." icon={<ClockIcon className="h-5 w-5" />} />
            </TabsContent>

            <TabsContent value="actions" className="flex-1 overflow-hidden">
              <EmptyState
                message="Use o atalho ⌘K para abrir o Command Palette e disparar ações rápidas."
                icon={<CommandIcon className="h-5 w-5" />}
              />
            </TabsContent>
          </Tabs>
        ) : null}
      </div>
    </TooltipProvider>
  )
}

function EmptyState({
  message,
  icon,
}: {
  message: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-muted)] bg-[var(--bg-surface)]/60 px-6 py-8 text-center text-sm text-[var(--fg-secondary)]">
      {icon ? <div className="mb-3 text-[var(--brand-400)]">{icon}</div> : null}
      <p>{message}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface)] px-4 py-2">
      <span className="text-xs uppercase tracking-[0.28em] text-[var(--fg-secondary)]">{label}</span>
      <span className="text-sm text-[var(--fg-primary)]">{value}</span>
    </div>
  )
}
