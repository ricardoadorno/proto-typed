"use client"

import * as React from "react"
import * as BreadcrumbPrimitive from "@radix-ui/react-navigation-menu"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  React.ElementRef<typeof BreadcrumbPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof BreadcrumbPrimitive.Root>
>(({ className, ...props }, ref) => (
  <BreadcrumbPrimitive.Root
    ref={ref}
    className={cn("flex flex-wrap items-center gap-2 text-xs", className)}
    {...props}
  />
))
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  React.ElementRef<typeof BreadcrumbPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof BreadcrumbPrimitive.List>
>(({ className, ...props }, ref) => (
  <BreadcrumbPrimitive.List
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = BreadcrumbPrimitive.Item

const BreadcrumbLink = React.forwardRef<
  React.ElementRef<typeof BreadcrumbPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof BreadcrumbPrimitive.Link>
>(({ className, ...props }, ref) => (
  <BreadcrumbPrimitive.Link
    ref={ref}
    className={cn(
      "font-semibold uppercase tracking-[0.32em] text-[var(--fg-secondary)] transition-colors hover:text-[var(--accent-light)]",
      className
    )}
    {...props}
  />
))
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="presentation"
    className={cn("select-none text-[var(--fg-secondary)]", className)}
    {...props}
  >
    {children ?? "›"}
  </span>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn(
      "font-semibold uppercase tracking-[0.32em] text-[var(--fg-primary)]",
      className
    )}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
