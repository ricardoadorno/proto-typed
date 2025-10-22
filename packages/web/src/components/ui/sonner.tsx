"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      theme="dark"
      toastOptions={{
        className:
          "bg-[var(--bg-surface)] border border-[var(--border-muted)] text-[var(--fg-primary)] rounded-lg shadow-[0_12px_32px_rgba(0,0,0,0.32)]",
      }}
    />
  )
}
