import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface EditorPanelProps {
  children: ReactNode
  className?: string
}

export function EditorPanel({ children, className }: EditorPanelProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-raised)] shadow-[0_24px_72px_rgba(12,14,24,0.38)]',
        className
      )}
    >
      {children}
    </div>
  )
}
