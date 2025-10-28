/**
 * Toolbar
 * Action buttons for the playground
 */

import React from 'react'

interface ToolbarProps {
  onExport: () => void
  canExport: boolean
}

export function Toolbar({ onExport, canExport }: ToolbarProps) {
  return (
    <div className="border-b border-gray-700 bg-gray-800 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">
            Proto-Typed Playground
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            disabled={!canExport}
            className={`
              px-3 py-1 rounded text-xs font-medium transition-colors
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
