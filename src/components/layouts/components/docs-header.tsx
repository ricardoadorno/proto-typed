"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CommandIcon, MenuIcon, MoonIcon, SunIcon, UserIcon } from "lucide-react"

import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
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
import { useTheme } from 'next-themes'

const navItems = [
  { label: "Playground", href: "/" },
  { label: "Docs", href: "/docs" },
  // { label: "Filosofia", href: "/principles" },
  // { label: "Templates", href: "/templates" },
  // { label: "Changelog", href: "/changelog" },
].map((item) => ({ ...item, href: withBaseUrl(item.href) }))

type CommandGroupItem = {
  label: string
  shortcut?: string
  onSelect: () => void
}

type ExtraCommandGroup = {
  heading: string
  items: CommandGroupItem[]
}

export interface DocsHeaderProps {
  onOpenSidebar?: () => void
  commandGroups?: ExtraCommandGroup[]
}

export function DocsHeader({ onOpenSidebar }: DocsHeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  const onThemeToggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 2)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const resolveHref = (href: string) => {
    const resolved = withBaseUrl(href)
    if (resolved.startsWith("http")) {
      return resolved
    }
    return resolved.startsWith("/") ? resolved : `/${resolved}`
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-[var(--border-muted)] bg-[color:rgba(14,15,18,0.88)] backdrop-blur-xl transition-shadow duration-300 supports-[backdrop-filter]:bg-[color:rgba(14,15,18,0.72)]",
        theme === "light" &&
        "!bg-[color:rgba(245,246,252,0.92)] supports-[backdrop-filter]:!bg-[color:rgba(245,246,252,0.82)]"
      )}
      style={scrolled ? { boxShadow: "var(--shadow)" } : undefined}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Link
          href={resolveHref("/")}
          className="flex items-center gap-3 text-sm font-semibold text-[var(--fg-primary)] transition-colors hover:text-[var(--accent-light)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[linear-gradient(135deg,rgba(124,58,237,0.15)_0%,rgba(34,211,238,0.15)_100%)] text-lg font-bold text-white shadow-[0_12px_32px_rgba(124,58,237,0.45)]">
            <img src={withBaseUrl("/logo.svg")} alt="Logo" />
          </span>
          <span className="hidden text-base sm:inline tracking-tight">proto-typed</span>
        </Link>

        <NavigationMenu className="ml-2 hidden flex-1 justify-start md:flex">
          <NavigationMenuList>
            {navItems.map((item) => {
              const href = resolveHref(item.href)
              const isActive =
                item.label === "Docs"
                  ? pathname?.startsWith("/docs")
                  : pathname === item.href

              return (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      data-active={isActive ? "true" : undefined}
                      className={cn(
                        // base do link
                        "relative rounded-md px-3 py-2 text-sm font-medium text-[var(--fg-secondary)] outline-none transition-colors duration-200",
                        // cor de hover e ativa
                        "hover:text-[var(--accent-light)] data-[active=true]:text-[var(--accent)]",
                        // linha animada usando pseudo-elemento
                        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--accent)] after:transition-transform after:duration-200",
                        "hover:after:scale-x-100 data-[active=true]:after:scale-x-100"
                      )}
                    >
                      {item.label}
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
                  className="transition-transform duration-300 text-[var(--fg-secondary)] hover:text-[var(--accent)]"
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
