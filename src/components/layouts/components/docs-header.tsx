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
import docSections, { flatDocs } from "@/utils/toc"
import { withBaseUrl } from "@/utils/with-base-url"

const navItems = [
  { label: "Docs", href: "/docs/getting-started" },
  { label: "Playground", href: "/playground" },
  { label: "Templates", href: "/templates" },
  { label: "Changelog", href: "/changelog" },
]

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
  theme: "dark" | "light"
  onThemeToggle: () => void
  onOpenSidebar: () => void
  commandGroups?: ExtraCommandGroup[]
}

export function DocsHeader({ theme, onThemeToggle, onOpenSidebar, commandGroups }: DocsHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 2)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setCommandOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const resolveHref = (href: string) => {
    const resolved = withBaseUrl(href)
    if (resolved.startsWith("http")) {
      return resolved
    }
    return resolved.startsWith("/") ? resolved : `/${resolved}`
  }

  const handleNavigate = (href: string) => {
    const target = resolveHref(href)
    setCommandOpen(false)
    if (target.startsWith("http") && !target.startsWith(window.location.origin)) {
      window.location.href = target
      return
    }
    router.push(target)
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
                        "group relative rounded-md px-3 py-2 text-sm font-medium text-[var(--fg-secondary)] outline-none transition-colors hover:text-[var(--accent-light)] data-[active=true]:text-[var(--accent)]"
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          "absolute inset-x-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-200 group-hover:scale-x-100 group-data-[active=true]:scale-x-100"
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
                  aria-label="Abrir comandos"
                  className="hidden md:inline-flex text-[var(--fg-secondary)] hover:text-[var(--accent)]"
                  onClick={() => setCommandOpen(true)}
                >
                  <CommandIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Command palette (⌘K)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
          <div className="hidden items-center md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full border border-[color:rgba(139,92,246,0.28)] bg-[color:rgba(139,92,246,0.08)] text-[var(--accent)] hover:bg-[color:rgba(139,92,246,0.14)]"
              aria-label="Abrir conta"
            >
              <UserIcon className="h-4 w-4" />
            </Button>
          </div>
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

        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen} searchPlaceholder="Buscar docs, rotas...">
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup heading="Navegação">
              {navItems.map((item) => {
                const shortcut = item.label === "Docs" ? "G D" : item.label === "Playground" ? "G P" : null
                return (
                  <CommandItem
                    key={item.label}
                    value={`${item.label} ${item.href}`.toLowerCase()}
                    onSelect={() => handleNavigate(item.href)}
                  >
                    {item.label}
                    {shortcut ? <CommandShortcut>{shortcut}</CommandShortcut> : null}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {commandGroups?.map((group) => (
              <CommandGroup key={group.heading} heading={group.heading}>
                {group.items.map((item) => (
                  <CommandItem
                    key={`${group.heading}-${item.label}`}
                    value={`${group.heading} ${item.label}`.toLowerCase()}
                    onSelect={() => {
                      setCommandOpen(false)
                      item.onSelect()
                    }}
                  >
                    {item.label}
                    {item.shortcut ? <CommandShortcut>{item.shortcut}</CommandShortcut> : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
            {docSections.map((section) => (
              <CommandGroup key={section.title} heading={section.title}>
                {section.items.slice(0, 6).map((doc) => {
                  return (
                    <CommandItem
                      key={doc.slug}
                      value={`${section.title} ${doc.title}`.toLowerCase()}
                      onSelect={() => handleNavigate(`/docs/${doc.slug}`)}
                    >
                      {doc.title}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
            <CommandSeparator />
            <CommandGroup heading="Recentes">
              {flatDocs.slice(0, 5).map((item) => {
                return (
                  <CommandItem
                    key={`recent-${item.slug}`}
                    value={`recent ${item.title}`.toLowerCase()}
                    onSelect={() => handleNavigate(`/docs/${item.slug}`)}
                  >
                    {item.title}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    </header>
  )
}

export default DocsHeader
