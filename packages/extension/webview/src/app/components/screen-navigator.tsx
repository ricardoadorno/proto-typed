/**
 * Screen Navigator
 * Shows available screens and allows navigation
 */

import React from 'react'
import type { RouteMetadata } from '@proto-typed/core'

interface ScreenNavigatorProps {
  metadata: RouteMetadata | null
  currentScreen: string | null
  onNavigate: (screenName: string) => void
}

export function ScreenNavigator({
  metadata,
  currentScreen,
  onNavigate,
}: ScreenNavigatorProps) {
  if (!metadata || metadata.screens.length === 0) {
    return null
  }

  return (
    <div className="border-b border-gray-700 bg-gray-800 px-4 py-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 mr-2">Screens:</span>
        {metadata.screens.map((screen) => (
          <button
            key={screen.name}
            onClick={() => onNavigate(screen.name)}
            className={`
              px-3 py-1 rounded text-xs font-medium transition-colors
              ${
                currentScreen === screen.name
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            {screen.name}
          </button>
        ))}
      </div>
    </div>
  )
}
