'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * @function Card
 * @description The root component for a card.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @returns {React.ReactElement} The rendered card component.
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)] text-[var(--fg-primary)] shadow-[0_1px_16px_rgba(0,0,0,0.18)]',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

/**
 * @function CardHeader
 * @description The header of a card.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @returns {React.ReactElement} The rendered card header.
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 px-6 py-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

/**
 * @function CardTitle
 * @description The title of a card.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - The props for the component.
 * @returns {React.ReactElement} The rendered card title.
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-tight tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

/**
 * @function CardDescription
 * @description The description of a card.
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - The props for the component.
 * @returns {React.ReactElement} The rendered card description.
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-[var(--fg-secondary)] leading-relaxed',
      className
    )}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

/**
 * @function CardContent
 * @description The main content of a card.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @returns {React.ReactElement} The rendered card content.
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 pb-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

/**
 * @function CardFooter
 * @description The footer of a card.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @returns {React.ReactElement} The rendered card footer.
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center px-6 pb-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
