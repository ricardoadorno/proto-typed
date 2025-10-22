"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * @const buttonVariants
 * @description cva (class-variance-authority) variants for the Button component.
 * This defines the different styles a button can have.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-[color,background,transform,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)] disabled:pointer-events-none disabled:opacity-50 active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-[var(--accent)] text-neutral-900 shadow-sm hover:bg-[var(--accent-light)]",
        destructive:
          "border border-transparent bg-[#E24C4B] text-white shadow-sm hover:bg-[#c84240]",
        outline:
          "border border-[var(--border-muted)] bg-transparent text-[var(--fg-primary)] hover:border-[var(--accent-light)] hover:text-[var(--accent-light)]",
        secondary:
          "border border-transparent bg-[var(--surface-press)] text-[var(--fg-primary)] hover:text-[var(--accent-light)]",
        ghost:
          "border border-transparent text-[var(--fg-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent-light)]",
        link: "border border-transparent text-[var(--accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-6 text-base",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * @interface ButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 * @description The props for the Button component.
 *
 * @property {boolean} [asChild=false] - Whether to render the button as a child of its parent component.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * @function Button
 * @description A component that displays a styled button.
 *
 * @param {ButtonProps} props - The props for the component.
 * @param {string} [props.className] - Additional class names to apply to the button.
 * @param {('default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link')} [props.variant] - The variant of the button.
 * @param {('default' | 'sm' | 'lg' | 'icon')} [props.size] - The size of the button.
 * @param {boolean} [props.asChild=false] - Whether to render the button as a child of its parent component.
 * @returns {React.ReactElement} The rendered button component.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
