/**
 * Preview Surface
 * Renders the HTML output from the DSL parser
 */

import React from 'react'

interface PreviewSurfaceProps {
  html: string
}

export function PreviewSurface({ html }: PreviewSurfaceProps) {
  // Navegação agora é gerenciada por useNavigation no PlaygroundApp

  if (!html) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">No preview available</p>
          <p className="text-sm">Start typing to see the preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="preview-container">
      <div className="device-frame">
        <div className="iphone-mockup">
          <div className="home-indicator"></div>
          <div className="notch"></div>
          <div className="speaker"></div>
          <div className="camera">
            <div className="camera-inner"></div>
          </div>
          <div className="device-content" style={{ overflow: 'auto' }}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </div>
  )
}
