"use client"

import {
  ActivityIcon,
  CommandIcon,
  DownloadIcon,
  PlayIcon,
  PointerIcon,
  RedoIcon,
  RefreshCcwIcon,
  SearchIcon,
  ShareIcon,
  UndoIcon,
  Wand2Icon,
} from "lucide-react"

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui"
import { cn } from "@/lib/utils"

interface PlaygroundToolbarProps {
  autoRun: boolean
  pickMode: boolean
  onRun: () => void
  onReset: () => void
  onFormat: () => void
  onUndo: () => void
  onRedo: () => void
  onFind: () => void
  onShare: () => void
  onExport: () => void
  onToggleAutoRun: () => void
  onTogglePickMode: () => void
  onOpenCommandPalette: () => void
}

export function PlaygroundToolbar({
  autoRun,
  pickMode,
  onRun,
  onReset,
  onFormat,
  onUndo,
  onRedo,
  onFind,
  onShare,
  onExport,
  onToggleAutoRun,
  onTogglePickMode,
  onOpenCommandPalette,
}: PlaygroundToolbarProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface)] px-4 py-3 shadow-[0_12px_40px_rgba(14,16,24,0.32)]">
        <div className="flex flex-wrap items-center gap-2">
          <ToolbarButton icon={PlayIcon} label="Run" shortcut="⌘↵" onClick={onRun} />
          <ToolbarButton icon={RefreshCcwIcon} label="Reset" shortcut="⌘⌫" onClick={onReset} />
          <ToolbarButton icon={Wand2Icon} label="Format" shortcut="⌘⇧F" onClick={onFormat} />
          <ToolbarButton icon={UndoIcon} label="Undo" shortcut="⌘Z" onClick={onUndo} />
          <ToolbarButton icon={RedoIcon} label="Redo" shortcut="⌘⇧Z" onClick={onRedo} />
          <ToolbarButton icon={SearchIcon} label="Find" shortcut="⌘F" onClick={onFind} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ToolbarButton icon={ShareIcon} label="Share" shortcut="⌘⇧S" onClick={onShare} />
          <ToolbarButton icon={DownloadIcon} label="Export" shortcut="⌘⇧E" onClick={onExport} />
          <ToolbarToggle
            active={autoRun}
            icon={ActivityIcon}
            label={autoRun ? "Auto-Run On" : "Auto-Run Off"}
            shortcut="⌘⇧A"
            onClick={onToggleAutoRun}
          />
          <ToolbarToggle
            active={pickMode}
            icon={PointerIcon}
            label={pickMode ? "Pick Mode" : "Enable Pick"}
            shortcut="⌘⇧P"
            onClick={onTogglePickMode}
          />
          <ToolbarButton
            icon={CommandIcon}
            label="Command Palette"
            shortcut="⌘K"
            onClick={onOpenCommandPalette}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}

interface ToolbarButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  shortcut?: string
  onClick: () => void
}

function ToolbarButton({ icon: Icon, label, shortcut, onClick }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          onClick={onClick}
          className="h-9 gap-2 rounded-xl border border-transparent bg-[color:rgba(139,92,246,0.08)] px-3 text-sm text-[var(--fg-secondary)] transition-colors hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.16)] hover:text-[var(--accent)]"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{shortcut ?? label}</TooltipContent>
    </Tooltip>
  )
}

interface ToolbarToggleProps extends ToolbarButtonProps {
  active: boolean
}

function ToolbarToggle({ active, icon: Icon, label, shortcut, onClick }: ToolbarToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          onClick={onClick}
          className={cn(
            "h-9 gap-2 rounded-xl border px-3 text-sm transition-colors",
            active
              ? "border-[var(--brand-400)] bg-[color:rgba(139,92,246,0.18)] text-[var(--accent)]"
              : "border-transparent bg-[color:rgba(139,92,246,0.08)] text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.16)] hover:text-[var(--accent)]"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{shortcut ?? label}</TooltipContent>
    </Tooltip>
  )
}
