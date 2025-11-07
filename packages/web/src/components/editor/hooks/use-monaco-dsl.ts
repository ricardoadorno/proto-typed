/**
 * React Hook: Monaco DSL Initialization + Diagnostics
 *
 * Manages Monaco Editor initialization for the proto-typed DSL.
 * Handles language registration, theme setup, completion provider,
 * and integrates with ErrorBus for real-time error markers.
 *
 * Usage:
 * ```tsx
 * const { monaco, isInitialized, error, editorRef } = useMonacoDSL();
 *
 * if (error) return <ErrorDisplay error={error} />;
 * if (!isInitialized) return <LoadingSpinner />;
 *
 * <Editor
 *   onMount={(editor) => editorRef.current = editor}
 *   // ... other props
 * />
 * ```
 *
 * @returns {object} Monaco instance, initialization state, error state, and editor ref
 */

import { useEffect, useState, useRef } from 'react'
import { useMonaco } from '@monaco-editor/react'
import { initializeMonacoDSL } from '../index'
import { createLanguageHost } from '../language-host'

// Extract editor type from Monaco
type IStandaloneCodeEditor = Parameters<
  NonNullable<
    React.ComponentProps<
      typeof import('@monaco-editor/react').Editor
    >['onMount']
  >
>[0]

/**
 * Custom hook to manage Monaco DSL initialization and diagnostics
 */
export function useMonacoDSL() {
  const monaco = useMonaco()
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const editorRef = useRef<IStandaloneCodeEditor | null>(null)
  const [isEditorMounted, setIsEditorMounted] = useState(false)
  const hostRef = useRef<ReturnType<typeof createLanguageHost> | null>(null)

  useEffect(() => {
    if (!monaco || !isEditorMounted || !editorRef.current || hostRef.current) {
      return
    }

    const integration = createLanguageHost()
    hostRef.current = integration

    ;(async () => {
      try {
        setError(null)
        await initializeMonacoDSL(
          monaco,
          editorRef.current!,
          integration.host,
          (uri) => integration.clear(uri)
        )
        setIsInitialized(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    })()

    return () => {
      integration.dispose()
      hostRef.current = null
      setIsInitialized(false)
    }
  }, [monaco, isEditorMounted])

  const handleEditorMount = (editor: IStandaloneCodeEditor) => {
    editorRef.current = editor
    setIsEditorMounted(true)
  }

  return { monaco, isInitialized, error, editorRef, handleEditorMount }
}
