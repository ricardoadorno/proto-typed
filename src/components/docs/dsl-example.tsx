"use client"

import { useState, useEffect, type ReactNode } from "react"

import { DSLEditor } from "@/core/editor"
import { useParse } from "@/hooks/use-parse"
import { cn } from "@/lib/utils"
import { Button, EditorPanel } from "@/components/ui"

interface DslExampleProps {
  title?: string
  description?: string
  children?: ReactNode
}

export default function DslExample({
  title = "Example",
  description,
  children,
}: DslExampleProps) {
  const [copied, setCopied] = useState(false)

  const extractTextFromChildren = (node: ReactNode): string => {
    if (typeof node === "string") return node
    if (
      typeof node === "object" &&
      node !== null &&
      // @ts-ignore - React internal shape
      node.props
    ) {
      // @ts-ignore
      const { props } = node
      if (props.children) return extractTextFromChildren(props.children)
    }
    return ""
  }

  const removeBackticksAndDsl = (text: string): string => {
    if (!text) return ""
    return text
      .replace(/^```(?:dsl)?\n?/, "")
      .replace(/```$/, "")
      .replace(/\r/g, "")
  }

  const rawText = extractTextFromChildren(children)
  const resolvedCode = removeBackticksAndDsl(rawText)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resolvedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore copy errors silently
    }
  }

  const { renderedHtml, createClickHandler, handleParse } = useParse()

  useEffect(() => {
    if (resolvedCode) handleParse(resolvedCode)
  }, [resolvedCode, handleParse])

  const renderScreen = () => {
    if (!renderedHtml) return null

    return (
      <div
        className="h-full overflow-auto px-4 py-4 text-[var(--fg-primary)]"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
        onClick={createClickHandler()}
      />
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold text-[var(--fg-primary)]">{title}</h4>
          {description ? <p className="text-sm text-[var(--fg-secondary)]">{description}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <EditorPanel className="h-[420px] border border-[var(--border-muted)] bg-[var(--bg-surface)] shadow-[0_18px_48px_rgba(14,16,24,0.32)]">
          <div className="flex items-center justify-between border-b border-[color:rgba(139,92,246,0.18)] bg-[color:rgba(139,92,246,0.08)] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[color:rgba(139,92,246,0.16)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
                DSL
              </span>
              <span className="text-[11px] uppercase tracking-[0.28em] text-[var(--fg-secondary)]">proto-typed</span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className={cn(
                "h-8 rounded-lg border border-[color:rgba(139,92,246,0.32)] bg-[color:rgba(139,92,246,0.08)] px-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--accent)] transition-colors hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.16)] focus-visible:ring-[var(--brand-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]",
                copied && "border-[var(--brand-400)] bg-[color:rgba(139,92,246,0.24)] text-[var(--fg-primary)]"
              )}
            >
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>
          <div className="flex-1 min-h-0">
            <DSLEditor value={resolvedCode} />
          </div>
        </EditorPanel>

        <div className="flex h-[420px] flex-col overflow-hidden rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface)] shadow-[0_18px_48px_rgba(14,16,24,0.32)]">
          <div className="flex items-center justify-between border-b border-[var(--border-muted)] bg-[color:rgba(139,92,246,0.05)] px-4 py-3">
            <span className="text-[11px] uppercase tracking-[0.32em] text-[var(--fg-secondary)]">Live preview</span>
          </div>
          <div className="flex-1 min-h-0 bg-[var(--bg-raised)]">{renderScreen()}</div>
        </div>
      </div>
    </section>
  )
}

