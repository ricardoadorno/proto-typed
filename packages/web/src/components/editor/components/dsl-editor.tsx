/**
 * DSL Editor Component
 *
 * Monaco Editor configured specifically for the proto-typed DSL.
 * Integrates syntax highlighting, IntelliSense, and error markers via ErrorBus.
 *
 * Features:
 * - Real-time syntax highlighting with custom theme
 * - Context-aware completions (IntelliSense)
 * - Error markers from ErrorBus integration
 * - Auto-indentation and bracket matching
 *
 * Usage:
 * ```tsx
 * <DSLEditor
 *   value={code}
 *   onChange={handleChange}
 *   theme="proto-typed-dark"
 * />
 * ```
 */

import { Editor, EditorProps } from '@monaco-editor/react'
import { useMonacoDSL } from '../hooks/use-monaco-dsl'
import { getDSLEditorOptions } from '../index'
import { DSL_LANGUAGE_ID } from '../constants'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface DSLEditorProps {
  value: string
  onChange?: (value: string | undefined) => void
  height?: string
  theme?: string
  onEditorReady?: (
    editor: Parameters<NonNullable<EditorProps['onMount']>>[0]
  ) => void
  options?: Partial<EditorProps['options']>
}

/**
 * Monaco Editor component configured specifically for the proto-typed DSL
 */
export function DSLEditor({
  value,
  onChange,
  height = '100%',
  theme = 'proto-typed-dark',
  onEditorReady,
  options = {},
}: DSLEditorProps) {
  const { isInitialized, error, handleEditorMount } = useMonacoDSL()

  const handleEditorDidMount = (
    editor: Parameters<NonNullable<EditorProps['onMount']>>[0]
  ) => {
    handleEditorMount(editor)
    onEditorReady?.(editor)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-900/20">
        <div className="text-center">
          <div className="text-red-400 mb-2">Failed to initialize editor</div>
          <div className="text-sm text-red-300">{error}</div>
        </div>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner message="Loading DSL editor..." />
      </div>
    )
  }

  return (
    <Editor
      height={height}
      language={DSL_LANGUAGE_ID}
      theme={theme}
      value={value}
      onChange={onChange}
      options={getDSLEditorOptions(options)}
      onMount={handleEditorDidMount}
    />
  )
}
