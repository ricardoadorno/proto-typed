'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { buttonVariants } from './button-variants'

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
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
