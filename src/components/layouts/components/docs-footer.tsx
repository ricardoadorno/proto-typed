import Link from "next/link"

import { Button } from "@/components/ui"
import { withBaseUrl } from "@/utils/with-base-url"

export function DocsFooter() {
  return (
    <footer className="mt-12 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface)] px-6 py-8 text-sm text-[var(--fg-secondary)] shadow-[0_1px_12px_rgba(0,0,0,0.14)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[var(--fg-primary)]">Proto-Typed Docs · {new Date().getFullYear()}</p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed">
            Construído para guiar designers e desenvolvedores a criarem protótipos Vue de forma ágil, clara e
            colaborativa.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em]">
          <Button
            asChild
            variant="ghost"
            className="rounded-full border border-transparent px-4 py-2 tracking-[0.3em] text-[var(--fg-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent-light)]"
          >
            <Link href={withBaseUrl("/")}>Editor</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="rounded-full border border-transparent px-4 py-2 tracking-[0.3em] text-[var(--fg-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent-light)]"
          >
            <Link href="https://github.com/" target="_blank" rel="noreferrer">
              GitHub
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}

export default DocsFooter
