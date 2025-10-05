import { useState, useCallback } from 'react';
import { parseAndBuildAst } from '../core/parser/parse-and-build-ast';
import { AstNode } from '../types/ast-node';
import { parseChevrotainError } from '../utils/error-parser';
import { ParsedError } from '../types/errors';
import { astToHtmlStringPreview } from '../core/renderer/ast-to-html-string-preview';
import { routeManagerGateway } from '../core/renderer/infrastructure/route-manager-gateway';
import { RouteMetadata } from '../types/routing';

interface UseParseResult {
  ast: AstNode[] | AstNode;
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
}

export const useParse = (): UseParseResult => {
  const [ast, setAst] = useState<AstNode[] | AstNode>([]);
  const [astResultJson, setAstResultJson] = useState<string>('');
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [parsedErrors, setParsedErrors] = useState<ParsedError[]>([]);
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<RouteMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleParse = useCallback(async (input: string) => {
    if (!input.trim()) {
      setAst([]);
      setAstResultJson('');
      setRenderedHtml('');
      setError(null);
      setParsedErrors([]);
      setCurrentScreen(null);
      // Set empty metadata for case zero
      setMetadata({
        screens: [],
        components: [],
        modals: [],
        drawers: [],
        defaultScreen: undefined,
        currentScreen: undefined,
        totalRoutes: 0,
        navigationHistory: [],
        currentHistoryIndex: -1,
        canNavigateBack: false
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setParsedErrors([]);
    
    try {
      const parsedAst = parseAndBuildAst(input);
      
      // Initialize routes with parsed AST to generate metadata
      routeManagerGateway.initialize(parsedAst);
      const newMetadata = routeManagerGateway.getRouteMetadata();
      
      // Handle case zero: when there are no routes/screens defined yet
      let newCurrentScreen: string | null;
      if (newMetadata.screens.length === 0) {
        // No screens defined - create default metadata for empty case
        newCurrentScreen = null;
      } else if (currentScreen) {
        const screenExists = newMetadata.screens.some(screen => 
          screen.name === currentScreen
        );
        if (screenExists) {
          newCurrentScreen = currentScreen;
        } else {
          newCurrentScreen = newMetadata.defaultScreen || null;
        }
      } else {
        newCurrentScreen = newMetadata.defaultScreen || null;
      }
      
      // Generate rendered HTML with the determined screen
      const htmlString = astToHtmlStringPreview(parsedAst, { currentScreen: newCurrentScreen || undefined });

      // Register navigation handlers so clicks inside the rendered preview update React state
      routeManagerGateway.setHandlers({
        onScreenNavigation: (screenName: string) => {
          // Re-render HTML for the new current screen
            const updatedHtml = astToHtmlStringPreview(parsedAst, { currentScreen: screenName });
            setRenderedHtml(updatedHtml);
            setCurrentScreen(screenName);
            // Refresh metadata (includes history and current screen info)
            const updatedMetadata = routeManagerGateway.getRouteMetadata();
            setMetadata(updatedMetadata);
        },
        onBackNavigation: () => {
          const meta = routeManagerGateway.getRouteMetadata();
          const current = meta.currentScreen || null;
          const updatedHtml = astToHtmlStringPreview(parsedAst, { currentScreen: current || undefined });
          setRenderedHtml(updatedHtml);
          setCurrentScreen(current);
          setMetadata(meta);
        }
      });
      
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
  }, [currentScreen]);

  const navigateToScreen = (screenName: string) => {
    routeManagerGateway.navigateToScreen(screenName);
    const updatedMetadata = routeManagerGateway.getRouteMetadata();
    setMetadata(updatedMetadata);
    setCurrentScreen(screenName);
  }

  const createClickHandler = () => routeManagerGateway.createClickHandler()

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
  };
};
