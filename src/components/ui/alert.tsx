"use client"

import * as React from "react"
import { AlertTriangle, Info, Lightbulb, Octagon } from "lucide-react"

import { cn } from "@/lib/utils"

const ICONS = {
  info: Info,
  tip: Lightbulb,
  warning: AlertTriangle,
  danger: Octagon,
} as const

type AlertVariant = keyof typeof ICONS

const variantStyles: Record<AlertVariant, string> = {
  info: "border-[#60A5FA] bg-[rgba(96,165,250,0.08)] text-[#60A5FA]",
  tip: "border-[#42b883] bg-[rgba(66,184,131,0.08)] text-[#42b883]",
  warning: "border-[#F6B73C] bg-[rgba(246,183,60,0.08)] text-[#F6B73C]",
  danger: "border-[#E24C4B] bg-[rgba(226,76,75,0.12)] text-[#E24C4B]",
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
}

export function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const Icon = ICONS[variant]
  return (
    <div
      className={cn(
        "flex w-full gap-3 rounded-xl border px-4 py-4 text-sm leading-relaxed",
        variantStyles[variant],
        className
      )}
      role="status"
      {...props}
    >
      <Icon className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="space-y-2">
        {title ? (
          <p className="text-base font-semibold text-[var(--fg-primary)]">{title}</p>
        ) : null}
        <div className="text-[var(--fg-secondary)]">{children}</div>
      </div>
    </div>
  )
}
