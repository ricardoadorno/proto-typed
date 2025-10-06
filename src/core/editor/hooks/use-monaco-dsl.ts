/**
 * React Hook: Monaco DSL Initialization
 * 
 * Manages Monaco Editor initialization for the proto-typed DSL.
 * Handles language registration, theme setup, and completion provider.
 * 
 * Usage:
 * ```tsx
 * const { monaco, isInitialized, error } = useMonacoDSL();
 * 
 * if (error) return <ErrorDisplay error={error} />;
 * if (!isInitialized) return <LoadingSpinner />;
 * // Monaco is ready to use
 * ```
 * 
 * @returns {object} Monaco instance, initialization state, and error state
 */

import { useEffect, useState } from 'react';
import { useMonaco } from '@monaco-editor/react';
import { initializeMonacoDSL } from '../index';

/**
 * Custom hook to manage Monaco DSL initialization
 */
export function useMonacoDSL() {
  const monaco = useMonaco();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (monaco && !isInitialized) {
      try {
        initializeMonacoDSL(monaco);
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize Monaco DSL:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
  }, [monaco, isInitialized]);

  return {
    monaco,
    isInitialized,
    error,
  };
}
