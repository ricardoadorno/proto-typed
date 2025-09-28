import { useState, useCallback, useEffect } from 'react';
import { parseAndBuildAst } from '../core/parser/parse-and-build-ast';
import { AstNode } from '../types/ast-node';
import { parseChevrotainError } from '../utils/error-parser';
import { ParsedError } from '../types/errors';
import { astToHtmlStringPreview } from '../core/renderer/ast-to-html-string-preview';
import { routeManagerGateway } from '../core/renderer/infrastructure/route-manager-gateway';
import { RouteMetadata } from '../types/routing';

interface UseParseResult {
  ast: AstNode[];
  astResultJson: string;
  renderedHtml: string;
  error: string | null;
  parsedErrors: ParsedError[];
  currentScreen: string | null;
  metadata: RouteMetadata | null;
  isLoading: boolean;
  handleParse: (input: string) => Promise<void>;
  navigateToScreen: (screenName: string) => void;
  createClickHandler: () => (e: React.MouseEvent) => void;
  resetNavigation: () => void;
}

export const useParse = (): UseParseResult => {
  const [ast, setAst] = useState<AstNode[]>([]);
  const [astResultJson, setAstResultJson] = useState<string>('');
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [parsedErrors, setParsedErrors] = useState<ParsedError[]>([]);
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<RouteMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Configure navigation handlers and manage route manager lifecycle
  useEffect(() => {
    routeManagerGateway.setHandlers({
      onScreenNavigation: screenName => setCurrentScreen(screenName),
    });
  }, []);


  const updateCurrentScreen = useCallback((newMetadata: RouteMetadata, currentScreen: string | null) => {
    if (currentScreen) {
      // Check if current screen still exists
      const screenExists = newMetadata.screens.some(screen => 
        screen.id === currentScreen.toLowerCase()
      );
      if (screenExists) {
        console.log('useParse - keeping existing screen:', currentScreen);
        return currentScreen;
      }
    }
    
    // Use default screen if current doesn't exist or is null
    const defaultScreen = newMetadata.defaultScreen || null;
    console.log('useParse - using default screen:', defaultScreen);
    return defaultScreen;
  }, []);

  const handleParse = useCallback(async (input: string) => {
    if (!input.trim()) {
      setAst([]);
      setAstResultJson('');
      setRenderedHtml('');
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
      
      // Get metadata and determine screen
      const newMetadata = routeManagerGateway.getRouteMetadata();
      const newCurrentScreen = updateCurrentScreen(newMetadata, currentScreen);
      
      // Generate rendered HTML with the determined screen
      const htmlString = astToHtmlStringPreview(parsedAst, { currentScreen: newCurrentScreen || undefined });
      
      setCurrentScreen(newCurrentScreen);
      setAst(parsedAst);
      setAstResultJson(JSON.stringify(parsedAst, null, 2));
      setRenderedHtml(htmlString);
      setMetadata(newMetadata);
      setError(null);
      setParsedErrors([]);
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during parsing';
      const parsedError = parseChevrotainError(errorMessage);
      
      setAst([]);
      setAstResultJson('');
      setRenderedHtml('');
      setError(errorMessage);
      setParsedErrors([parsedError]);
      setCurrentScreen(null);
      setMetadata(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentScreen, updateCurrentScreen]);

  const navigateToScreen = useCallback((screenName: string) => {
    console.log('useParse - navigateToScreen called with:', screenName);
    setCurrentScreen(screenName);
    
    // Re-render HTML with new screen if we have AST
    if (ast.length > 0) {
      try {
        const htmlString = astToHtmlStringPreview(ast, { currentScreen: screenName || undefined });
        setRenderedHtml(htmlString);
      } catch (err: any) {
        console.error('Error re-rendering after navigation:', err);
      }
    }
  }, [ast]);

  const createClickHandler = useCallback(() => {
    return routeManagerGateway.createClickHandler();
  }, []);

  const resetNavigation = useCallback(() => {
    routeManagerGateway.resetNavigation();
    // Reset to default screen if available
    if (metadata) {
      const defaultScreen = metadata.defaultScreen || null;
      setCurrentScreen(defaultScreen);
    }
  }, [metadata]);

  return {
    ast,
    astResultJson,
    renderedHtml,
    error,
    parsedErrors,
    currentScreen,
    metadata,
    isLoading,
    handleParse,
    navigateToScreen,
    createClickHandler,
    resetNavigation
  };
};
