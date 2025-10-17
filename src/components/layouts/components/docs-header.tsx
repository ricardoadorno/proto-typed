"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { MenuIcon, MoonIcon, SunIcon } from "lucide-react"

import {
  Button,
  NavigationMenu,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuViewport,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui"
import { cn } from "@/lib/utils"
import { withBaseUrl } from "@/utils/with-base-url"

const navItems = [
  { label: "Docs", href: "/docs/getting-started" },
  { label: "API", href: "/docs/api" },
  { label: "Playground", href: "/playground" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "About", href: "/about" },
]

export interface DocsHeaderProps {
  theme: "dark" | "light"
  onThemeToggle: () => void
  onOpenSidebar: () => void
}

export function DocsHeader({ theme, onThemeToggle, onOpenSidebar }: DocsHeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 2)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const docsHrefBase = withBaseUrl("/docs")
  const normalizedDocsHref = docsHrefBase.startsWith("/") ? docsHrefBase : `/${docsHrefBase}`
  const homeHrefBase = withBaseUrl("/docs/getting-started")
  const homeHref = homeHrefBase.startsWith("/") ? homeHrefBase : `/${homeHrefBase}`

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-[var(--border-muted)] bg-[color:rgba(18,18,18,0.88)] backdrop-blur-xl transition-shadow duration-300 supports-[backdrop-filter]:bg-[color:rgba(18,18,18,0.7)]",
        theme === "light" &&
          "!bg-[color:rgba(249,250,251,0.85)] supports-[backdrop-filter]:!bg-[color:rgba(249,250,251,0.72)]"
      )}
      style={scrolled ? { boxShadow: "var(--shadow)" } : undefined}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-6 sm:px-8">
        <Link
          href={homeHref}
          className="flex items-center gap-3 text-sm font-semibold text-[var(--fg-primary)] transition-colors hover:text-[var(--accent-light)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg font-bold text-emerald-950 shadow-[0_4px_12px_rgba(66,184,131,0.38)]">
            V
          </span>
          <span className="hidden text-base sm:inline">Vue Docs</span>
        </Link>

        <NavigationMenu className="ml-2 hidden flex-1 justify-start md:flex">
          <NavigationMenuList>
            {navItems.map((item) => {
              const href = withBaseUrl(item.href)
              const normalizedHref = href.startsWith("/") ? href : `/${href}`
              const isActive =
                item.label === "Docs"
                  ? pathname?.startsWith(normalizedDocsHref)
                  : pathname === normalizedHref

              return (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={normalizedHref}
                      aria-current={isActive ? "page" : undefined}
                      data-active={isActive ? "true" : undefined}
                      className={cn(
                        "group relative rounded-md px-3 py-2 text-sm font-medium text-[var(--fg-secondary)] outline-none transition-colors hover:text-[var(--accent-light)] data-[active=true]:text-[var(--accent)]"
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          "absolute inset-x-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-200 group-data-[active=true]:scale-x-100"
                        )}
                      />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Alternar tema"
                  onClick={onThemeToggle}
                  className="transition-transform duration-300 hover:text-[var(--accent-light)]"
                >
                  {theme === "light" ? (
                    <MoonIcon className="h-5 w-5" />
                  ) : (
                    <SunIcon className="h-5 w-5 transition-transform duration-300 hover:rotate-180" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Alternar tema</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir navegação"
            onClick={onOpenSidebar}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default DocsHeader
