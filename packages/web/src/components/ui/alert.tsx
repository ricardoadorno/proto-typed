'use client'

import * as React from 'react'
import {
  AlertTriangle,
  Info,
  Lightbulb,
  Megaphone,
  Octagon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const ICONS = {
  info: Info,
  attention: Megaphone,
  tip: Lightbulb,
  warning: AlertTriangle,
  danger: Octagon,
} as const

type AlertVariant = keyof typeof ICONS

const variantStyles: Record<AlertVariant, string> = {
  info: 'border-[var(--info)] bg-[color:rgba(96,165,250,0.12)] text-[var(--info)]',
  attention:
    'border-[var(--attention)] bg-[color:rgba(249,115,22,0.12)] text-[var(--attention)]',
  tip: 'border-[var(--brand-400)] bg-[color:rgba(139,92,246,0.14)] text-[var(--brand-300)]',
  warning:
    'border-[var(--warning)] bg-[color:rgba(245,158,11,0.14)] text-[var(--warning)]',
  danger:
    'border-[var(--danger)] bg-[color:rgba(239,68,68,0.16)] text-[var(--danger)]',
}

/**
 * @interface AlertProps
 * @extends React.HTMLAttributes<HTMLDivElement>
 * @description The props for the Alert component.
 *
 * @property {AlertVariant} [variant='info'] - The variant of the alert, which determines its color and icon.
 * @property {string} [title] - An optional title for the alert.
 */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
}

/**
 * @function Alert
 * @description A component that displays a styled alert message with an icon.
 *
 * @param {AlertProps} props - The props for the component.
 * @param {string} [props.className] - Additional class names to apply to the alert.
 * @param {AlertVariant} [props.variant='info'] - The variant of the alert.
 * @param {string} [props.title] - The title of the alert.
 * @param {React.ReactNode} props.children - The content of the alert.
 * @returns {React.ReactElement} The rendered alert component.
 */
export function Alert({
  className,
  variant = 'info',
  title,
  children,
  ...props
}: AlertProps) {
  const Icon = ICONS[variant]
  return (
    <div
      className={cn(
        'flex w-full gap-3 rounded-2xl border px-4 py-4 text-sm leading-relaxed',
        variantStyles[variant],
        className
      )}
      role="status"
      {...props}
    >
      <Icon className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="space-y-2">
        {title ? (
          <p className="text-base font-semibold text-[var(--fg-primary)]">
            {title}
          </p>
        ) : null}
        <div className="text-[var(--fg-secondary)]">{children}</div>
      </div>
    </div>
  )
}
