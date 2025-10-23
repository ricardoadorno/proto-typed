'use client'
import React, { useState } from 'react'

import { RouteMetadataDisplay } from './route-metadata-display'
import { RouteMetadata } from '@proto-typed/core'

interface PreviewPanelProps {
  title?: string
  children?: React.ReactNode
  metadata?: RouteMetadata | null
  onNavigateToScreen?: (screenName: string) => void
}

export function PreviewPanel({
  title = 'Live Preview',
  children,
  metadata,
  onNavigateToScreen,
}: PreviewPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="mb-4 rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface)]/90 p-6 shadow-[0_24px_72px_rgba(14,16,24,0.38)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--fg-primary)]">
          {title}
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg p-2 text-[var(--fg-secondary)] transition-colors hover:bg-[color:rgba(139,92,246,0.12)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-current"
          >
            {isCollapsed ? (
              <polyline points="6 9 12 15 18 9" />
            ) : (
              <polyline points="18 15 12 9 6 15" />
            )}
          </svg>
        </button>
      </div>

      {/* Collapsible content */}
      {!isCollapsed && (
        <>
          {/* Route Metadata Display */}
          <RouteMetadataDisplay
            metadata={metadata || null}
            onNavigateToScreen={onNavigateToScreen}
          />
          {children}
        </>
      )}
    </div>
  )
}
