'use client'

import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { badgeVariants } from './badge-variants'

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
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
