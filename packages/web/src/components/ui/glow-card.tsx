import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export type GlowCardVariant = 'surface' | 'muted' | 'gradient'

export interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlowCardVariant
  hoverLift?: boolean
}

const variantStyles: Record<GlowCardVariant, string> = {
  surface:
    'border-[color:rgba(139,92,246,0.18)] bg-[color:rgba(16,18,26,0.02)] dark:bg-[color:rgba(139,92,246,0.08)]',
  muted:
    'border-[color:rgba(124,58,237,0.28)] bg-[color:rgba(139,92,246,0.14)]/70 backdrop-blur-xl dark:bg-[color:rgba(35,37,46,0.72)]',
  gradient:
    'border-transparent bg-[linear-gradient(135deg,rgba(139,92,246,0.14)_0%,rgba(34,211,238,0.12)_45%,rgba(16,24,64,0.0)_100%)] dark:bg-[linear-gradient(135deg,rgba(139,92,246,0.18)_0%,rgba(34,211,238,0.14)_45%,rgba(16,24,64,0.16)_100%)]',
}

export function GlowCard({
  className,
  children,
  variant = 'surface',
  hoverLift = true,
  ...props
}: GlowCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl border p-8 transition-transform duration-300 ease-out',
        'shadow-[0_26px_86px_rgba(20,18,32,0.24)] dark:shadow-[0_26px_86px_rgba(0,0,0,0.38)]',
        hoverLift &&
          'hover:-translate-y-1 hover:shadow-[0_42px_128px_rgba(24,20,48,0.32)]',
        'before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.22),transparent_58%)] before:opacity-70',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-white/6 after:opacity-75 dark:after:border-white/8',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="relative z-10 flex h-full flex-col gap-4">{children}</div>
    </div>
  )
}

export default GlowCard
