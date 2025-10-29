/**
 * Toolbar
 * Action buttons for the playground
 */

import React from 'react'

interface ToolbarProps {
  onExport: () => void
  canExport: boolean
  isLoading?: boolean
}

export function Toolbar({ onExport, canExport, isLoading }: ToolbarProps) {
  const logoSrc =
    typeof document !== 'undefined'
      ? (document.getElementById('root') as HTMLElement | null)?.dataset.logo ||
        undefined
      : undefined

  return (
    <div className="border-b border-gray-700 bg-gray-800 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Proto-Typed"
              className="h-5 w-5 flex-shrink-0 rounded"
            />
          ) : null}
          <span className="text-sm font-medium text-gray-300">
            Proto-Typed Playground
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <svg
                className="h-4 w-4 animate-spin text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  fill="currentColor"
                />
              </svg>
              <span>Updating…</span>
            </div>
          ) : null}
          <button
            onClick={onExport}
            disabled={!canExport}
            className={`
              px-3 py-1 rounded text-xs font-medium transition-colors mr-4
              ${
                canExport
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Export HTML
          </button>
        </div>
      </div>
    </div>
  )
}
