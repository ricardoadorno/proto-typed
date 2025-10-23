'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

/**
 * @function TabsList
 * @description The list of tabs.
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>} props - The props for the component.
 * @returns {React.ReactElement} The rendered tabs list.
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border-muted)] bg-[var(--bg-surface)] p-1 text-[var(--fg-secondary)]',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * @function TabsTrigger
 * @description The button that activates a tab.
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>} props - The props for the component.
 * @returns {React.ReactElement} The rendered tabs trigger.
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex min-w-[120px] items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all hover:text-[var(--accent-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-light)] data-[state=active]:bg-[var(--surface-press)] data-[state=active]:text-[var(--fg-primary)] data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * @function TabsContent
 * @description The content of a tab.
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>} props - The props for the component.
 * @returns {React.ReactElement} The rendered tabs content.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'rounded-lg border border-[var(--border-muted)] bg-[var(--bg-surface)] p-4 text-sm data-[state=inactive]:hidden',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
