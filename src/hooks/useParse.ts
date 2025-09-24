import { useState, useCallback } from 'react';
import { parseAndBuildAst } from '../core/parser/parse-and-build-ast';
import { AstNode } from '../types/astNode';
import { parseChevrotainError } from '../utils/error-parser';
import { ParsedError } from '../types/errors';
import { astToHtmlString, getRouteMetadata } from '../core/renderer/ast-to-html-string';
import { RouteMetadata } from '../core/renderer/route-manager';

interface UseParseResult {
  ast: AstNode[];
  astResultJson: string;
  error: string | null;
  parsedErrors: ParsedError[];
  currentScreen: string | null;
  metadata: RouteMetadata | null;
  isLoading: boolean;
  handleParse: (input: string) => Promise<void>;
  navigateToScreen: (screenName: string) => void;
}

export const useParse = (): UseParseResult => {
  const [ast, setAst] = useState<AstNode[]>([]);
  const [astResultJson, setAstResultJson] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [parsedErrors, setParsedErrors] = useState<ParsedError[]>([]);
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<RouteMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleParse = useCallback(async (input: string) => {
    if (!input.trim()) {
      setAst([]);
      setAstResultJson('');
      setError(null);
      setParsedErrors([]);
      setCurrentScreen(null);
      setMetadata(null);
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
        // Use current screen from state or undefined for validation
        astToHtmlString(parsedAst, { currentScreen: currentScreen || undefined });
      } catch (renderError: any) {
        // If rendering fails, treat it as a parsing error
        throw renderError;
      }
      
      // Get metadata to determine available screens
      const metadata = getRouteMetadata(parsedAst, currentScreen || undefined);
      
      console.log('useParse - available screens:', metadata.screens.map(s => s.id));
      
      // Manter currentScreen se ainda existe nas novas rotas, senão usar default
      let newCurrentScreen = currentScreen;
      
      if (currentScreen) {
        // Verificar se currentScreen ainda existe
        const screenExists = metadata.screens.some(screen => 
          screen.id === currentScreen.toLowerCase()
        );
        if (!screenExists) {
          // Se a tela atual não existe mais, usar a tela padrão
          newCurrentScreen = metadata.defaultScreen || null;
          console.log('useParse - currentScreen não existe mais, usando default:', newCurrentScreen);
        } else {
          console.log('useParse - mantendo currentScreen:', currentScreen);
        }
      } else {
        // Se não há tela atual, usar a tela padrão
        newCurrentScreen = metadata.defaultScreen || null;
        console.log('useParse - nenhuma tela atual, usando default:', newCurrentScreen);
      }
      
      setCurrentScreen(newCurrentScreen);
      setAst(parsedAst);
      setAstResultJson(JSON.stringify(parsedAst, null, 2));
      setMetadata(metadata);
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
      setMetadata(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentScreen]);

  const navigateToScreen = useCallback((screenName: string) => {
    console.log('useParse - navigateToScreen called with:', screenName);
    setCurrentScreen(screenName);
  }, []);

  return {
    ast,
    astResultJson,
    error,
    parsedErrors,
    currentScreen,
    metadata,
    isLoading,
    handleParse,
    navigateToScreen
  };
};
