"use client"

import { useState, useEffect } from "react"

import { DSLEditor } from "@/core/editor"
import { cn } from "@/lib/utils"

interface CodeDisplayProps {
  code: string
  title?: string
  description?: string
  onCodeChange?: (code: string) => void
  editable?: boolean
}

const baseControlButton =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors border border-[var(--border-muted)] bg-[var(--bg-surface)] text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.08)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]"

/**
 * Interactive code display component with Monaco Editor, syntax highlighting, and live editing.
 */
export function CodeDisplay({
  code,
  title = "DSL Code",
  description,
  onCodeChange,
  editable = false,
}: CodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [currentCode, setCurrentCode] = useState(code)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setCurrentCode(code)
  }, [code])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy DSL snippet", error)
    }
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value === undefined) return
    setCurrentCode(value)
    onCodeChange?.(value)
  }

  const toggleEdit = () => setIsEditing((prev) => !prev)

  const resetCode = () => {
    setCurrentCode(code)
    onCodeChange?.(code)
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <h4 className="text-lg font-semibold text-[var(--fg-primary)]">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {editable ? (
            <>
              <button
                onClick={toggleEdit}
                className={cn(
                  baseControlButton,
                  isEditing &&
                    "border-[color:rgba(139,92,246,0.32)] bg-[color:rgba(139,92,246,0.14)] text-[var(--accent)]"
                )}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>{isEditing ? "View" : "Edit"}</span>
              </button>
              {isEditing ? (
                <button
                  onClick={resetCode}
                  className={cn(
                    baseControlButton,
                    "border-[color:rgba(245,158,11,0.32)] bg-[color:rgba(245,158,11,0.12)] text-[var(--warning)] hover:border-[var(--warning)] hover:bg-[color:rgba(245,158,11,0.18)] hover:text-[var(--warning)]"
                  )}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Reset</span>
                </button>
              ) : null}
            </>
          ) : null}
          <button
            onClick={copyToClipboard}
            className={cn(
              baseControlButton,
              copied && "border-[var(--brand-400)] bg-[color:rgba(139,92,246,0.16)] text-[var(--fg-primary)]"
            )}
          >
            {copied ? (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        {isEditing ? (
          <div className="overflow-hidden rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface)]">
            <DSLEditor height="384px" value={currentCode} onChange={handleCodeChange} />
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface)]">
              <DSLEditor height="384px" value={currentCode} onChange={() => {}} />
            </div>
            <div className="absolute right-3 top-3 z-10">
              <span className="rounded px-2 py-1 text-xs font-medium text-[var(--accent)]">DSL</span>
            </div>
            <div className="pointer-events-none absolute inset-0" />
          </div>
        )}
      </div>

      {description ? (
        <div className="rounded-2xl border border-[var(--border-muted)] bg-[color:rgba(96,165,250,0.12)] p-4">
          <div className="flex items-start gap-2 text-sm text-[var(--fg-secondary)]">
            <span className="mt-0.5 text-[var(--info)]">💡</span>
            <div>
              <p className="font-medium text-[var(--fg-primary)]">Description</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--fg-secondary)]">{description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CodeDisplay
