"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react"
import { toast } from "sonner"

import { Button, ScrollArea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui"
import { cn } from "@/lib/utils"

interface DocsCodeBlockProps extends React.ComponentPropsWithoutRef<"pre"> {
  "data-title"?: string
  "data-playground"?: string
  "data-language"?: string
}

export function DocsCodeBlock({ children, className, ...rest }: DocsCodeBlockProps) {
  const child = React.Children.toArray(children)[0] as React.ReactElement<
    React.ComponentPropsWithoutRef<"code"> & { metastring?: string }
  >

  if (!React.isValidElement(child)) {
    return (
      <pre className={cn("docs-raw-pre", className)} {...rest}>
        {children}
      </pre>
    )
  }

  const {
    ["data-title"]: dataTitle,
    ["data-playground"]: dataPlayground,
    ["data-language"]: dataLanguage,
    ...preProps
  } = rest

  const codeContent =
    typeof child.props.children === "string"
      ? child.props.children.trimEnd()
      : Array.isArray(child.props.children)
        ? child.props.children.join("").trimEnd()
        : ""

  const { className: codeClassName, children: _codeChildren, ...codeProps } = child.props
  const metaFromChild =
    typeof child.props === "object" && child.props
      ? (child.props as { ["data-meta"]?: string })["data-meta"]
      : undefined

  const language =
    child.props.className?.replace(/language-/, "") ??
    dataLanguage ??
    "text"

  const title =
    dataTitle ??
    child.props.metastring ??
    metaFromChild ??
    language.toUpperCase()

  const playgroundHref = dataPlayground

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
        "docs-code-block group flex flex-col overflow-hidden rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-raised)] shadow-[0_18px_48px_rgba(0,0,0,0.28)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[color:rgba(139,92,246,0.16)] bg-[color:rgba(139,92,246,0.05)] px-4 py-3">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[var(--fg-secondary)]">
          <span className="rounded-md bg-[color:rgba(139,92,246,0.18)] px-2 py-1 font-semibold text-[var(--fg-primary)]">
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
                    "transition-colors text-[var(--fg-secondary)] hover:text-[var(--accent-light)]",
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
          className="relative m-0 grid w-full min-w-0 gap-2 overflow-auto bg-transparent p-6 text-sm leading-relaxed text-[rgba(231,233,239,0.92)]"
          {...preProps}
        >
          <code {...codeProps} className={codeClassName}>
            {codeContent}
          </code>
        </pre>
      </ScrollArea>
    </div>
  )
}
