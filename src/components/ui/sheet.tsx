"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = DialogPrimitive.Root

const SheetTrigger = DialogPrimitive.Trigger

const SheetClose = DialogPrimitive.Close

const SheetPortal = DialogPrimitive.Portal

/**
 * @function SheetOverlay
 * @description The overlay that covers the screen behind a sheet.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>} props - The props for the component.
 * @returns {React.ReactElement} The rendered sheet overlay.
 */
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm",
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName

const sheetVariants = {
  top: "inset-x-0 top-0 border-b",
  bottom: "inset-x-0 bottom-0 border-t",
  left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  right: "inset-y-0 right-0 h-full w-[85%] border-l sm:w-[400px]",
}

type SheetVariants = keyof typeof sheetVariants

/**
 * @function SheetContent
 * @description The main content of a sheet.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: SheetVariants }} props - The props for the component.
 * @returns {React.ReactElement} The rendered sheet content.
 */
const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: SheetVariants
  }
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col bg-[var(--bg-surface)] text-[var(--fg-primary)] shadow-xl transition-transform duration-200 ease-out",
        sheetVariants[side],
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md border border-transparent p-1 text-[var(--fg-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-light)]">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = DialogPrimitive.Content.displayName

/**
 * @function SheetHeader
 * @description The header of a sheet.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @returns {React.ReactElement} The rendered sheet header.
 */
const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-2 text-center sm:text-left", className)} {...props} />
)

/**
 * @function SheetFooter
 * @description The footer of a sheet.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @returns {React.ReactElement} The rendered sheet footer.
 */
const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)

/**
 * @function SheetTitle
 * @description The title of a sheet.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>} props - The props for the component.
 * @returns {React.ReactElement} The rendered sheet title.
 */
const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-[var(--fg-primary)]", className)}
    {...props}
  />
))
SheetTitle.displayName = DialogPrimitive.Title.displayName

/**
 * @function SheetDescription
 * @description The description of a sheet.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>} props - The props for the component.
 * @returns {React.ReactElement} The rendered sheet description.
 */
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--fg-secondary)]", className)}
    {...props}
  />
))
SheetDescription.displayName = DialogPrimitive.Description.displayName

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetPortal,
  SheetOverlay,
}
