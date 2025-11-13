"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface)] px-4 text-sm text-[var(--fg-primary)] shadow-sm transition-colors placeholder:text-[var(--fg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-light)]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
