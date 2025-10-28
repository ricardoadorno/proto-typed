/**
 * Webview Entry Point
 * Bootstraps the React application
 */

import React from 'react'
import { createRoot } from 'react-dom/client'
import { PlaygroundApp } from './app/playground-app'
import './styles.css'

// Mount the React app
const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

const root = createRoot(container)
root.render(
  <React.StrictMode>
    <PlaygroundApp />
  </React.StrictMode>
)

// Log that the app is ready
console.log('✅ [Webview] Playground app initialized')
