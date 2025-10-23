"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "./dialog"

/**
 * @function Command
 * @description The root component for a command menu.
 * @param {React.ComponentPropsWithoutRef<typeof CommandPrimitive>} props - The props for the component.
 * @returns {React.ReactElement} The rendered command menu.
 */
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface)] text-[var(--fg-primary)] shadow-xl",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

/**
 * @interface CommandDialogProps
 * @extends React.ComponentProps<typeof Dialog>
 * @description The props for the CommandDialog component.
 *
 * @property {string} [searchPlaceholder] - The placeholder text for the search input.
 */
interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
  searchPlaceholder?: string
}

/**
 * @function CommandDialog
 * @description A command menu that opens in a dialog.
 * @param {CommandDialogProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered command dialog.
 */
const CommandDialog = ({ children, searchPlaceholder = "Buscar", ...props }: CommandDialogProps) => (
  <Dialog {...props}>
    <DialogContent className="max-h-[80vh] w-[90vw] max-w-[640px] overflow-hidden border-none bg-transparent p-0 shadow-none outline-none">
      <Command>
        <div className="flex items-center gap-2 border-b border-[var(--border-muted)] px-4 py-3 text-[var(--fg-secondary)]">
          <Search className="h-4 w-4" />
          <CommandPrimitive.Input
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-sm text-[var(--fg-primary)] outline-none placeholder:text-[var(--fg-secondary)]"
          />
        </div>
        {children}
      </Command>
    </DialogContent>
  </Dialog>
)

/**
 * @function CommandList
 * @description A list of command items.
 * @param {React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>} props - The props for the component.
 * @returns {React.ReactElement} The rendered command list.
 */
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[360px] overflow-y-auto px-2 py-2 text-sm", className)}
    {...props}
  />
))
CommandList.displayName = CommandPrimitive.List.displayName

/**
 * @function CommandEmpty
 * @description The component to display when there are no results in a command menu.
 * @param {React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>} props - The props for the component.
 * @returns {React.ReactElement} The rendered empty state.
 */
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn("px-4 py-8 text-center text-sm text-[var(--fg-secondary)]", className)}
    {...props}
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

/**
 * @function CommandGroup
 * @description A group of command items.
 * @param {React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>} props - The props for the component.
 * @returns {React.ReactElement} The rendered command group.
 */
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden rounded-lg border border-transparent px-2 py-2 text-[var(--fg-secondary)] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.32em]",
      className
    )}
    {...props}
  />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

/**
 * @function CommandSeparator
 * @description A separator between command groups.
 * @param {React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>} props - The props for the component.
 * @returns {React.ReactElement} The rendered command separator.
 */
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("my-2 h-px bg-[var(--border-muted)]", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

/**
 * @function CommandItem
 * @description An item in a command menu.
 * @param {React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>} props - The props for the component.
 * @returns {React.ReactElement} The rendered command item.
 */
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--fg-primary)] outline-none transition-colors data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-[var(--surface-hover)]",
      className
    )}
    {...props}
  />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

/**
 * @function CommandShortcut
 * @description A keyboard shortcut hint for a command item.
 * @param {React.HTMLAttributes<HTMLSpanElement>} props - The props for the component.
 * @returns {React.ReactElement} The rendered command shortcut.
 */
const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs text-[var(--fg-secondary)] tracking-wider", className)}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
}
