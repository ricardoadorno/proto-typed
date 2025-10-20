'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
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

type ChildrenRecord = { props?: { children?: ReactNode } }

export interface DocsCodePreviewProps {
  title?: string
  description?: string
  children?: ReactNode
}

const DEFAULT_SCREEN = `screen Default:
  container:
    # Preview vazio
    > Adicione blocos para visualizar o resultado.`

const parseChildrenToText = (node: ReactNode): string => {
  if (node == null || typeof node === "boolean") return ""

  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(parseChildrenToText).join("")
  }

  if (typeof node === "object") {
    const record = node as ChildrenRecord
    if (record.props?.children) {
      return parseChildrenToText(record.props.children)
    }
  }

  return ""
}

const stripDslFence = (raw: string): string => {
  if (!raw) return ""

  const normalized = raw.replace(/\r/g, "")

  const fencedMatch = /^```(?:dsl)?\n?([\s\S]*?)```$/i.exec(normalized.trim())
  if (fencedMatch) {
    return fencedMatch[1].trim()
  }

  return normalized.trim()
}

const ensureScreenWrapper = (code: string): string => {
  const trimmed = code.trim()
  if (!trimmed) {
    return DEFAULT_SCREEN
  }

  if (/\bscreen\s+\w+/i.test(trimmed)) {
    return trimmed
  }

  const indented = trimmed
    .split(/\r?\n/)
    .map((line) => (line ? `    ${line}` : line))
    .join("\n")

  return `screen Default:\n  container:\n${indented}`
}

const PanelHeader = ({
  title,
  action,
}: {
  title: string
  action?: ReactNode
}) => (
  <div className="flex items-center justify-between  bg-[var(--bg-surface)] px-5 py-2">
    <div className="flex items-center gap-3">
      <span className="inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
      <span className="text-[11px]">{title}</span>
    </div>
    {action}
  </div>
)

export function DocsCodePreview({
  title,
  description,
  children,
}: DocsCodePreviewProps) {
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<number | null>(null)

  const { renderedHtml, createClickHandler, handleParse } = useParse()

  const normalizedCode = useMemo(() => {
    const rawText = parseChildrenToText(children)
    const withoutFence = stripDslFence(rawText)
    return ensureScreenWrapper(withoutFence)
  }, [children])

  useEffect(() => {
    if (normalizedCode) {
      handleParse(normalizedCode)
    }
  }, [normalizedCode, handleParse])

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(normalizedCode)
      setCopied(true)
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current)
      }
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore clipboard errors silently
    }
  }, [normalizedCode])

  const copyButton = (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-2 rounded-full  bg-[var(--bg-surface)] px-3 text-xs font-medium text-[var(--fg-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg-primary)] focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]",
        copied &&
          "border-[var(--accent)] bg-[color:rgba(46,48,60,0.92)] text-[var(--fg-primary)]",
      )}
    >
      {copied ? (
        <>
          <CheckIcon aria-hidden className="h-3.5 w-3.5" />
          Copiado
        </>
      ) : (
        <>
          <CopyIcon aria-hidden className="h-3.5 w-3.5" />
          Copiar
        </>
      )}
    </Button>
  )

  const renderEditorPanel = (panelHeightClass: string) => (
    <EditorPanel
      className={cn(
        panelHeightClass,
        " bg-[var(--bg-main)] shadow-none",
      )}
    >
      <PanelHeader title="Proto-Typed" action={copyButton} />
      <div className="flex-1 min-h-0">
        <DSLEditor
          value={normalizedCode}
          options={{
            lineNumbers: "off",
            glyphMargin: false,
            stickyScroll: {
              enabled: false,
            },
          }}
        />
      </div>
    </EditorPanel>
  )

  const renderPreviewPanel = (panelHeightClass: string) => (
    <div
      className={cn(
        panelHeightClass,
        "flex flex-col overflow-hidden rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-main)]",
      )}
    >
      <PanelHeader title="Preview Proto-Typed" />
      <div
        className="overflow-auto max-h-[420px] "
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
        onClick={createClickHandler()}
      />
    </div>
  )

  return (
    <section className="space-y-6">
      {title ? (
        <h3 className="text-lg font-semibold text-[var(--fg-primary)]">
          {title}
        </h3>
      ) : null}
      {description ? (
        <p className="max-w-2xl text-sm text-[var(--fg-secondary)]">
          {description}
        </p>
      ) : null}

      <div>
        <div className="hidden gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {renderEditorPanel("h-[350px]")}
          {renderPreviewPanel("h-[350px]")}
        </div>

        <Tabs defaultValue="editor" className="space-y-4 lg:hidden">
          <TabsList className="grid grid-cols-2 rounded-full bg-[var(--bg-surface)]">
            <TabsTrigger
              value="editor"
              className="rounded-full text-xs uppercase tracking-[0.24em]"
            >
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="rounded-full text-xs uppercase tracking-[0.24em]"
            >
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

export default DocsCodePreview
