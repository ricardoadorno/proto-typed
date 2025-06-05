import { useState, useCallback } from 'react';
import { parseAndBuildAst } from '../core/parser/parse-and-build-ast';
import { AstNode } from '../types/astNode';
import { getNavigationHistory } from '../core/renderer/navigationHelper';

interface UseParseResult {
  ast: AstNode[];
  astResultJson: string;
  error: string | null;
  currentScreen: string | null;
  isLoading: boolean;
  handleParse: (input: string) => Promise<void>;
}

export const useParse = (): UseParseResult => {
  const [ast, setAst] = useState<AstNode[]>([]);
  const [astResultJson, setAstResultJson] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleParse = useCallback(async (input: string) => {
    if (!input.trim()) {
      setAst([]);
      setAstResultJson('');
      setError(null);
      setCurrentScreen(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const parsedAst = await parseAndBuildAst(input);
      
      setCurrentScreen(getNavigationHistory().currentScreen);
      setAst(parsedAst);
      setAstResultJson(JSON.stringify(parsedAst, null, 2));
      setError(null);
    } catch (err: any) {
      setAst([]);
      setAstResultJson('');
      setError(err.message || 'An error occurred during parsing');
      setCurrentScreen(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    ast,
    astResultJson,
    error,
    currentScreen,
    isLoading,
    handleParse
  };
};
