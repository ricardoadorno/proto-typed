import { useState, useCallback } from 'react';
import { parseAndBuildAst } from '../core/parser/parse-and-build-ast';
import { AstNode } from '../types/astNode';
import { getCurrentScreen } from '../core/renderer/route-manager';
import { parseChevrotainError } from '../utils/error-parser';
import { ParsedError } from '../types/errors';
import { astToHtmlString } from '../core/renderer/ast-to-html-string';

interface UseParseResult {
  ast: AstNode[];
  astResultJson: string;
  error: string | null;
  parsedErrors: ParsedError[];
  currentScreen: string | null;
  isLoading: boolean;
  handleParse: (input: string) => Promise<void>;
}

export const useParse = (): UseParseResult => {
  const [ast, setAst] = useState<AstNode[]>([]);
  const [astResultJson, setAstResultJson] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [parsedErrors, setParsedErrors] = useState<ParsedError[]>([]);
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleParse = useCallback(async (input: string) => {
    if (!input.trim()) {
      setAst([]);
      setAstResultJson('');
      setError(null);
      setParsedErrors([]);
      setCurrentScreen(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setParsedErrors([]);
    
    try {
      const parsedAst = await parseAndBuildAst(input);
      
      // Validate the AST by attempting to render it
      // This will catch component reference errors during the parsing phase
      try {
        astToHtmlString(parsedAst, { currentScreen: getCurrentScreen() });
      } catch (renderError: any) {
        // If rendering fails, treat it as a parsing error
        throw renderError;
      }
      
      setCurrentScreen(getCurrentScreen());
      setAst(parsedAst);
      setAstResultJson(JSON.stringify(parsedAst, null, 2));
      setError(null);
      setParsedErrors([]);
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during parsing';
      const parsedError = parseChevrotainError(errorMessage);
      
      setAst([]);
      setAstResultJson('');
      setError(errorMessage);
      setParsedErrors([parsedError]);
      setCurrentScreen(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    ast,
    astResultJson,
    error,
    parsedErrors,
    currentScreen,
    isLoading,
    handleParse
  };
};
