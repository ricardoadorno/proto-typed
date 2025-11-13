import Link from "next/link"

import { Separator } from "@/components/ui"


const footerColumns = [
  {
    title: "Comece rápido",
    links: [
      { label: "Introdução", href: "/docs/getting-started" },
      { label: "Filosofia do proto-typed", href: "/principles" },
    ],
  },
  {
    title: "Explorar",
    links: [
      { label: "Playground", href: "/playground" },
      { label: "Erros Conhecidos", href: "/known-errors" },
    ],
  },
  {
    title: "Comunidade",
    links: [
      { label: "GitHub", href: "https://github.com/ricardoadorno/proto-typed" },
    ],
  },
]

const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? "v0.1.0"

export function DocsFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-12 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)] px-6 py-8 text-sm text-[var(--fg-secondary)] shadow-[0_6px_24px_rgba(0,0,0,0.22)] sm:px-8">
      <Separator className="mb-8 border-[var(--border-muted)]" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {footerColumns.map((column) => (
          <div key={column.title} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
              {column.title}
            </p>
            <ul className="space-y-2">
              {column.links.map((link) => {
                const href = (link.href)
                const isExternal = href.startsWith("http")
                return (
                  <li key={link.label}>
                    <Link
                      href={href}
                      className="text-sm text-[var(--fg-secondary)] transition-colors hover:text-[var(--accent-light)]"
                      {...(isExternal ? { target: "_blank", rel: "noreferrer" } : undefined)}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border-muted)] pt-6 text-xs uppercase tracking-[0.24em] text-[var(--fg-secondary)] sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[var(--fg-secondary)]">
          © {currentYear} proto-typed · {appVersion}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2">
            Status
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#22c55e]" aria-hidden />
          </span>
          <Link
            href={("/changelog")}
            className="text-[10px] tracking-[0.28em] text-[var(--fg-secondary)] transition-colors hover:text-[var(--accent-light)]"
          >
            Changelog
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default DocsFooter
