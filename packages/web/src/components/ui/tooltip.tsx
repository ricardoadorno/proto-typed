'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * @function TooltipContent
 * @description The content of a tooltip.
 * @param {React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>} props - The props for the component.
 * @returns {React.ReactElement} The rendered tooltip content.
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className: _className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={
      'z-50 overflow-hidden rounded-md border border-[var(--border-muted)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--fg-secondary)] shadow-lg data-[state=closed]:animate-fade-out data-[state=delayed-open]:animate-fade-in'
    }
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
