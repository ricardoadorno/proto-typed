"use client"

import { useState, useEffect, type ReactNode } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { DSLEditor } from "@/core/editor"
import { useParse } from "@/hooks/use-parse"
import { cn } from "@/lib/utils"
import {
  Button,
  EditorPanel,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui"

export interface DslPreviewProps {
  title?: string
  description?: string
  children?: ReactNode
}

export function DslPreview({
  title,
  description,
  children,
}: DslPreviewProps) {
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
    return (
      <div
        className="flex-1 overflow-auto"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
        onClick={createClickHandler()}
      />
    )
  }

  const renderEditorPanel = (panelHeightClass = "h-[350px]") => (
    <EditorPanel className={cn(panelHeightClass, "border-none bg-[var(--bg-main)] shadow-none")}>
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] bg-[color:rgba(32,34,42,0.72)] px-5 py-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
          <span className="text-[11px]">Proto-Typed</span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-[var(--border-muted)] bg-[color:rgba(46,48,60,0.72)] px-3 text-xs font-medium text-[var(--fg-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg-primary)] focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]",
            copied && "border-[var(--accent)] bg-[color:rgba(46,48,60,0.92)] text-[var(--fg-primary)]"
          )}
        >
          {copied ? (
            <>
              Copiado
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <DSLEditor value={resolvedCode} options={{
          lineNumbers: "off", glyphMargin: false, stickyScroll: {
            enabled: false
          },
        }} />
      </div>
    </EditorPanel>
  )

  const renderPreviewPanel = (panelHeightClass = "h-[350px]") => (
    <div className={cn(panelHeightClass, "flex flex-col overflow-hidden rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-main)]")}>
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] bg-[color:rgba(32,34,42,0.72)] px-5 py-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
          <span className="text-[11px] ]">Preview Proto-Typed</span>
        </div>
      </div>
      {renderScreen()}
    </div>
  )

  return (
    <section className="space-y-6">
      {title && <h3 className="text-lg font-semibold text-[var(--fg-primary)]">{title}</h3>}
      {description ? <p className="max-w-2xl text-sm text-[var(--fg-secondary)]">{description}</p> : null}

      <div>
        <div className="hidden gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {renderEditorPanel()}
          {renderPreviewPanel()}
        </div>

        <Tabs defaultValue="editor" className="space-y-4 lg:hidden">
          <TabsList className="grid grid-cols-2 rounded-full border border-[var(--border-muted)] bg-[color:rgba(32,34,42,0.72)]">
            <TabsTrigger value="editor" className="rounded-full text-xs uppercase tracking-[0.24em]">
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-full text-xs uppercase tracking-[0.24em]">
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="mt-0">
            {renderEditorPanel("h-[420px]")}
          </TabsContent>
          <TabsContent value="preview" className="mt-0">
            {renderPreviewPanel("h-[420px]")}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export const DslExample = DslPreview

export default DslPreview
