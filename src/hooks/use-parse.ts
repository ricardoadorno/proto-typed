import { useState, useCallback, useMemo } from 'react';
import { parseAndBuildAst } from '../core/parser/parse-and-build-ast';
import { AstNode } from '../types/ast-node';
import { astToHtmlStringPreview } from '../core/renderer/ast-to-html-string-preview';
import { createRouteManagerGateway } from '../core/renderer/infrastructure/route-manager-gateway';
import { RouteMetadata } from '../types/routing';
import { ErrorBus } from '../core/error-bus';
import type { ProtoError } from '../types/errors';
import { ERROR_CODES, sanitizeErrorMessage } from '../types/errors';
import { RouteManager } from '../core/renderer/core/route-manager';

interface UseParseResult {
  ast: AstNode[] | AstNode;
  astResultJson: string;
  renderedHtml: string;
  error: string | null;
  currentScreen: string | null;
  metadata: RouteMetadata | null;
  isLoading: boolean;
  handleParse: (input: string) => Promise<void>;
  navigateToScreen: (screenName: string) => void;
  createClickHandler: () => (e: React.MouseEvent) => void;
}

export const useParse = (): UseParseResult => {
  const localRouteManager = useMemo(() => new RouteManager(), []);
  const routeManagerGateway = useMemo(
    () => createRouteManagerGateway(localRouteManager),
    [localRouteManager]
  );

  const [ast, setAst] = useState<AstNode[] | AstNode>([]);
  const [astResultJson, setAstResultJson] = useState<string>('');
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<RouteMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleParse = useCallback(async (input: string) => {
    if (!input.trim()) {
      setAst([]);
      setAstResultJson('');
      setRenderedHtml('');
      setError(null);
      setCurrentScreen(null);
      routeManagerGateway.initialize([] as AstNode[]);
      routeManagerGateway.resetNavigation();
      // Clear ErrorBus for empty input
      ErrorBus.get().clear();
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
    
    // Clear previous errors from ErrorBus before parsing
    ErrorBus.get().clear();
    const collectedErrors: ProtoError[] = [];
    
    try {
      const parsedAst = parseAndBuildAst(input);
      
      // Extract errors collected during parsing (if any)
      if ((parsedAst as any).__errors) {
        const parsingErrors = (parsedAst as any).__errors as ProtoError[];
        collectedErrors.push(...parsingErrors);
        delete (parsedAst as any).__errors; // Clean up temporary property
      }
      
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
      const renderResult = astToHtmlStringPreview(
        parsedAst,
        { currentScreen: newCurrentScreen || undefined },
        localRouteManager
      );
      
      // Extract render errors (if any)
      if (renderResult.errors && renderResult.errors.length > 0) {
        collectedErrors.push(...renderResult.errors);
      }

      // Register navigation handlers so clicks inside the rendered preview update React state
      routeManagerGateway.setHandlers({
        onScreenNavigation: (screenName: string) => {
          // Re-render HTML for the new current screen
            const updatedRenderResult = astToHtmlStringPreview(
              parsedAst,
              { currentScreen: screenName },
              localRouteManager
            );
            setRenderedHtml(updatedRenderResult.html);
            setCurrentScreen(screenName);
            
            // Emit render errors from navigation re-render
            if (updatedRenderResult.errors && updatedRenderResult.errors.length > 0) {
              ErrorBus.get().bulk(updatedRenderResult.errors);
            }
            
            // Refresh metadata (includes history and current screen info)
            setMetadata(routeManagerGateway.getRouteMetadata());
        },
        onBackNavigation: () => {
          const meta = routeManagerGateway.getRouteMetadata();
          const current = meta.currentScreen || null;
          const updatedRenderResult = astToHtmlStringPreview(
            parsedAst,
            { currentScreen: current || undefined },
            localRouteManager
          );
          setRenderedHtml(updatedRenderResult.html);
          setCurrentScreen(current);
          
          // Emit render errors from back navigation re-render
          if (updatedRenderResult.errors && updatedRenderResult.errors.length > 0) {
            ErrorBus.get().bulk(updatedRenderResult.errors);
          }
          
          setMetadata(meta);
        }
      });
      
      setCurrentScreen(newCurrentScreen);
      setAst(parsedAst);
      setAstResultJson(JSON.stringify(parsedAst, null, 2));
      setRenderedHtml(renderResult.html);
      setMetadata(newMetadata);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during parsing';
      
      // Convert to ProtoError for ErrorBus
      const protoError: ProtoError = {
        stage: 'parser',
        severity: 'fatal',
        line: 1,
        column: 1,
        code: ERROR_CODES.PARSE_UNEXPECTED_TOKEN,
        message: sanitizeErrorMessage(errorMessage),
      };
      collectedErrors.push(protoError);
      
      setAst([]);
      setAstResultJson('');
      setRenderedHtml('');
      setError(errorMessage);
      setCurrentScreen(null);
      setMetadata(null);
    } finally {
      // Emit all collected errors to ErrorBus
      if (collectedErrors.length > 0) {
        ErrorBus.get().bulk(collectedErrors);
      }
      
      setIsLoading(false);
    }
  }, [currentScreen, routeManagerGateway, localRouteManager]);

  const navigateToScreen = (screenName: string) => {
    routeManagerGateway.navigateToScreen(screenName);
    setMetadata(routeManagerGateway.getRouteMetadata());
    setCurrentScreen(screenName);
  }

  const createClickHandler = () => routeManagerGateway.createClickHandler()

  return {
    ast,
    astResultJson,
    renderedHtml,
    error,
    currentScreen,
    metadata,
    isLoading,
    handleParse,
    navigateToScreen,
    createClickHandler,
  };
};
