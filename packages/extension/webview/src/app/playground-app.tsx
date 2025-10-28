/**
 * Playground App
 * Main application component for the webview
 */

import React from 'react'
import { usePlaygroundState } from '../hooks/use-playground-state'
import { useNavigation } from '../hooks/use-navigation'
import { PreviewSurface } from './components/preview-surface'
import { ScreenNavigator } from './components/screen-navigator'
import { ErrorPanel } from './components/error-panel'
import { Toolbar } from './components/toolbar'

export function PlaygroundApp() {
  const {
    html,
    metadata,
    currentScreen,
    errors,
    isLoading,
    navigateToScreen,
    exportHtml,
  } = usePlaygroundState()

  // Hook de navegação para controlar visibilidade e cliques
  useNavigation({
    currentScreen,
    onNavigate: navigateToScreen,
  })

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Toolbar onExport={exportHtml} canExport={!!html} />
      <ErrorPanel errors={errors} />
      <ScreenNavigator
        metadata={metadata}
        currentScreen={currentScreen}
        onNavigate={navigateToScreen}
      />
      <div className="flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-50">
            <div className="text-gray-400">Parsing...</div>
          </div>
        )}
        <PreviewSurface html={html} />
      </div>
    </div>
  )
}
