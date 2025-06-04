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
