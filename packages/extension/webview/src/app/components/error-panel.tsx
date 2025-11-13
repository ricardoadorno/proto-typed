/**
 * Error Panel
 * Displays parsing errors and warnings
 */

import React from 'react'

interface ErrorPanelProps {
  errors: string[]
}

export function ErrorPanel({ errors }: ErrorPanelProps) {
  if (errors.length === 0) {
    return null
  }

  return (
    <div className="border-b border-red-800 bg-red-900/20 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg
            className="w-5 h-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-300 mb-1">
            Parse Error{errors.length > 1 ? 's' : ''}
          </h3>
          <div className="space-y-1">
            {errors.map((error, index) => (
              <p key={index} className="text-xs text-red-200 font-mono">
                {error}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
