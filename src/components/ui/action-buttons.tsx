import type { ReactNode } from "react"

import { Button } from "./button"

interface ActionButtonsProps {
  onExportHtml: () => void
  children?: ReactNode
}

export function ActionButtons({ onExportHtml, children }: ActionButtonsProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <Button
        type="button"
        onClick={onExportHtml}
        className="gap-2 bg-[linear-gradient(135deg,#7c3aed_0%,#22d3ee_100%)] text-white shadow-[0_18px_44px_rgba(34,211,238,0.22)] transition-all hover:scale-[1.02] hover:shadow-[0_24px_52px_rgba(124,58,237,0.32)]"
      >
        <span className="flex items-center gap-2 text-sm font-medium tracking-wide">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Export HTML</span>
        </span>
      </Button>
      {children}
    </div>
  )
}
