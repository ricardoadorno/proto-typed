"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * @const badgeVariants
 * @description cva (class-variance-authority) variants for the Badge component.
 * This defines the different styles a badge can have.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--surface-hover)] text-[var(--accent)] border-[rgba(66,184,131,0.4)]",
        secondary:
          "bg-[rgba(99,208,163,0.12)] text-[var(--accent-light)] border-[rgba(99,208,163,0.3)]",
        outline:
          "border-[var(--border-muted)] text-[var(--fg-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * @interface BadgeProps
 * @extends React.HTMLAttributes<HTMLDivElement>
 * @description The props for the Badge component.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * @function Badge
 * @description A component that displays a styled badge.
 *
 * @param {BadgeProps} props - The props for the component.
 * @param {string} [props.className] - Additional class names to apply to the badge.
 * @param {('default' | 'secondary' | 'outline')} [props.variant] - The variant of the badge.
 * @returns {React.ReactElement} The rendered badge component.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
