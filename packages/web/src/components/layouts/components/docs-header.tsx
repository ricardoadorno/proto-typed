"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { CommandIcon, MenuIcon, MoonIcon, SunIcon } from "lucide-react"

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

import { useTheme } from 'next-themes'
import DocsSearch from '@/components/docs/docs-search'
import docSections from '@shared/toc'
import { withAssetPath } from '@shared/base-path'
import { navItems } from "@shared"
import SidebarMobile from "./sidebar-mobile"
import DocsSidebar from "./docs-sidebar"



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
  commandGroups?: ExtraCommandGroup[]
  children?: React.ReactNode
  isDocs?: boolean
}

export function DocsHeader({ children, isDocs }: DocsHeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const onThemeToggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 2)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const resolveHref = (href: string) => {
    const resolved = (href)
    if (resolved.startsWith("http")) {
      return resolved
    }
    return resolved.startsWith("/") ? resolved : `/${resolved}`
  }

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-[var(--border-muted)] bg-[color:rgba(14,15,18,0.88)] backdrop-blur-xl transition-shadow duration-300 supports-[backdrop-filter]:bg-[color:rgba(14,15,18,0.72)]",
        theme === "light" &&
        "!bg-[color:rgba(245,246,252,0.92)] supports-[backdrop-filter]:!bg-[color:rgba(245,246,252,0.82)]"
      )}
      style={scrolled ? { boxShadow: "var(--shadow)" } : undefined}
    >
      <div className="mx-auto flex justify-between min-h-16 w-full max-w-[1280px] flex-wrap items-space gap-4 px-4 py-4 sm:gap-6 ">
        <Link
          href={resolveHref("/")}
          className="flex items-center gap-3 text-sm font-semibold text-[var(--fg-primary)] transition-colors hover:text-[var(--accent-light)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[linear-gradient(135deg,rgba(124,58,237,0.45)_0%,rgba(124,58,237,0.15)_50%)] text-lg font-bold text-white shadow-[0_12px_32px_rgba(124,58,237,0.45)]">
            <img src={withAssetPath("/logo.svg")} alt="Logo" />
          </span>
          <span className="hidden text-base sm:inline tracking-tight">proto-typed</span>
        </Link>

        <NavigationMenu className="ml-2 hidden flex-1 justify-start md:flex">
          <NavigationMenuList>
            {navItems.map((item) => {
              const href = resolveHref(item.href)
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))

              return (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      data-active={isActive ? "true" : undefined}
                      className={cn(
                        "relative rounded-md px-3 py-2 text-sm font-medium text-[var(--fg-secondary)] outline-none transition-colors duration-200",
                        "hover:text-[var(--accent-light)] data-[active=true]:text-[var(--accent)]",
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



          <div className="flex items-center justify-end gap-2 md:justify-start">
          <div className="w-full md:w-auto md:min-w-[280px] md:max-w-[320px]">
            <DocsSearch sections={docSections} />
          </div>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Alternar tema"
                    onClick={onThemeToggle}
                    className="text-[var(--fg-secondary)] transition-transform duration-300 hover:text-[var(--accent)]"
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
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

            <Link
              target="_blank"
              href={"https://github.com/ricardoadorno/proto-typed"}
              aria-label="Ir para o GitHub"
            >
              <Button
                variant="ghost"
                size="icon"
                className="group text-[var(--fg-secondary)] transition-transform duration-300 hover:text-[var(--accent)]"
                aria-hidden={false}
              >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:rotate-6"
                role="img"
                aria-label="GitHub"
              >
                <g>
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </g>
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </header>
    <SidebarMobile mobileSidebarOpen={mobileSidebarOpen} setMobileSidebarOpen={setMobileSidebarOpen} >
      {isDocs && <DocsSidebar sections={docSections} onNavigate={() => setMobileSidebarOpen(false)} />}
    </SidebarMobile>
    </>
  )
}

export default DocsHeader
