"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react"
import { toast } from "sonner"

import { Button, ScrollArea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui"
import { cn } from "@/lib/utils"

interface DocsCodeBlockProps extends React.ComponentPropsWithoutRef<"pre"> {
  "data-title"?: string
  "data-playground"?: string
}

export function DocsCodeBlock({ children, className, ...props }: DocsCodeBlockProps) {
  const child = React.Children.toArray(children)[0] as React.ReactElement<
    React.ComponentPropsWithoutRef<"code"> & { metastring?: string }
  >

  if (!React.isValidElement(child)) {
    return (
      <pre className={cn("docs-raw-pre", className)} {...props}>
        {children}
      </pre>
    )
  }

  const codeContent =
    typeof child.props.children === "string"
      ? child.props.children.trimEnd()
      : Array.isArray(child.props.children)
        ? child.props.children.join("").trimEnd()
        : ""

  const { className: codeClassName, children: _codeChildren, ...codeProps } = child.props

  const language =
    child.props.className?.replace(/language-/, "") ??
    props["data-language"] ??
    "text"

  const title =
    props["data-title"] ??
    child.props.metastring ??
    (child.props["data-meta"] as string | undefined) ??
    language.toUpperCase()

  const playgroundHref = props["data-playground"] as string | undefined

  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent)
      setCopied(true)
      toast.success("Copiado para a área de transferência!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Não foi possível copiar. Tente novamente.")
    }
  }

  return (
    <div
      className={cn(
        "docs-code-block group flex flex-col overflow-hidden rounded-xl border border-[var(--border-muted)] bg-[#1a1a1a] shadow-[0_18px_48px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[color:rgba(255,255,255,0.08)] px-4 py-3">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-[var(--fg-secondary)]">
          <span className="rounded-md bg-[rgba(255,255,255,0.05)] px-2 py-1 font-semibold text-[var(--fg-primary)]">
            {title}
          </span>
          <span className="hidden text-[var(--fg-secondary)] sm:inline">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {playgroundHref ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[var(--fg-secondary)] hover:text-[var(--accent-light)]"
                    asChild
                  >
                    <a href={playgroundHref} target="_blank" rel="noreferrer">
                      <ExternalLinkIcon className="h-4 w-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Abrir no Playground</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  aria-label="Copiar código"
                  className={cn(
                    "transition-colors",
                    copied && "text-[var(--accent-light)]"
                  )}
                >
                  {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? "Copiado" : "Copiar"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <ScrollArea className="max-h-[520px]">
        <pre
          className="relative m-0 grid w-full min-w-0 gap-2 overflow-auto bg-transparent p-6 text-sm leading-relaxed text-[rgba(234,234,234,0.92)]"
          {...props}
        >
          <code {...codeProps} className={codeClassName}>
            {codeContent}
          </code>
        </pre>
      </ScrollArea>
    </div>
  )
}
