"use client"

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react"
import { LinkIcon } from "lucide-react"
import { toast } from "sonner"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui"
import { cn } from "@/lib/utils"
import { extractText, slugify } from "@shared"

type HeadingTag = "h1" | "h2" | "h3"

interface DocHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag
}

interface HeadingRegistryContextValue {
  registerSlug: (base: string) => string
}

const HeadingRegistryContext = createContext<HeadingRegistryContextValue | null>(null)

export function DocHeadingProvider({ children }: { children: ReactNode }) {
  const registry = useRef<Map<string, number>>(new Map())

  const registerSlug = useCallback((base: string) => {
    const current = registry.current.get(base) ?? 0
    const unique = current > 0 ? `${base}-${current}` : base
    registry.current.set(base, current + 1)
    return unique
  }, [])

  const value = useMemo(() => ({ registerSlug }), [registerSlug])

  return <HeadingRegistryContext.Provider value={value}>{children}</HeadingRegistryContext.Provider>
}

export function DocHeading({ as: Component = "h2", children, className, ...props }: DocHeadingProps) {
  const textContent = extractText(children)
  const context = useContext(HeadingRegistryContext)
  const baseSlug = slugify(textContent)

  const slugRef = useRef<string>("")
  if (!slugRef.current && baseSlug) {
    slugRef.current = context ? context.registerSlug(baseSlug) : baseSlug
  }
  const slug = slugRef.current

  const handleAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!slug) return

      event.preventDefault()
      const target = document.getElementById(slug)
      const url = new URL(window.location.href)
      url.hash = slug
      window.history.replaceState(null, "", `#${slug}`)
      target?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })

      if (navigator.clipboard) {
        navigator.clipboard.writeText(url.toString()).then(
          () => toast.success("Link da seção copiado!"),
          () => toast.error("Não foi possível copiar o link")
        )
      }
    },
    [slug]
  )

  const HeadingTag = Component

  return (
    <HeadingTag id={slug || undefined} className={cn("docs-heading group", className)} {...props}>
      <span className="flex-1">{children}</span>
      {slug ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={`#${slug}`}
                onClick={handleAnchorClick}
                className="docs-anchor inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[var(--surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]"
                aria-label={`Copiar link para ${textContent}`}
              >
                <LinkIcon className="h-4 w-4" />
              </a>
            </TooltipTrigger>
            <TooltipContent>Copiar link</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </HeadingTag>
  )
}
