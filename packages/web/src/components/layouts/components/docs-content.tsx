import type { ReactNode } from 'react'

interface DocsContentProps {
  title?: string
  children: ReactNode
}

export function DocsContent({
  title = 'Documentation',
  children,
}: DocsContentProps) {
  return (
    <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)] p-6 shadow-[0_12px_42px_rgba(16,18,26,0.32)]">
      <h2 className="mb-4 text-2xl font-semibold text-[var(--fg-primary)]">
        {title}
      </h2>
      <div className="docs-prose">{children}</div>
    </div>
  )
}

export default DocsContent
