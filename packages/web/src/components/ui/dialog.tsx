'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

/**
 * @function DialogOverlay
 * @description The overlay that covers the screen behind a dialog.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>} props - The props for the component.
 * @returns {React.ReactElement} The rendered dialog overlay.
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/70 backdrop-blur-sm', className)}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * @function DialogContent
 * @description The main content of a dialog.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>} props - The props for the component.
 * @returns {React.ReactElement} The rendered dialog content.
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)] p-6 text-[var(--fg-primary)] shadow-[0_24px_60px_rgba(0,0,0,0.45)]',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md border border-transparent p-2 text-[var(--fg-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-light)]">
        <X className="h-4 w-4" />
        <span className="sr-only">Fechar</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/**
 * @function DialogHeader
 * @description The header of a dialog.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @returns {React.ReactElement} The rendered dialog header.
 */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

/**
 * @function DialogFooter
 * @description The footer of a dialog.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the component.
 * @returns {React.ReactElement} The rendered dialog footer.
 */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

/**
 * @function DialogTitle
 * @description The title of a dialog.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>} props - The props for the component.
 * @returns {React.ReactElement} The rendered dialog title.
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/**
 * @function DialogDescription
 * @description The description of a dialog.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>} props - The props for the component.
 * @returns {React.ReactElement} The rendered dialog description.
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-[var(--fg-secondary)]', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogPortal,
  DialogOverlay,
}
