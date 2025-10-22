import { useState, useCallback, useMemo } from 'react';
import { parseAndBuildAst, astToHtmlStringPreview, createRouteManagerGateway, ErrorBus, RouteManager } from '@proto-typed/core';
import { AstNode, RouteMetadata, ProtoError, ERROR_CODES, sanitizeErrorMessage } from '@proto-typed/core';

/**
 * @interface UseParseResult
 * @description Defines the shape of the object returned by the `useParse` hook.
 *
 * @property {AstNode[] | AstNode} ast - The parsed Abstract Syntax Tree.
 * @property {string} astResultJson - A JSON string representation of the AST.
 * @property {string} renderedHtml - The HTML string rendered from the AST.
 * @property {string | null} error - Any error message that occurred during parsing or rendering.
 * @property {string | null} currentScreen - The name of the currently displayed screen.
 * @property {RouteMetadata | null} metadata - Metadata about the routes defined in the AST.
 * @property {boolean} isLoading - A boolean indicating if a parse is in progress.
 * @property {(input: string) => Promise<void>} handleParse - The function to call to parse a new input string.
 * @property {(screenName: string) => void} navigateToScreen - A function to navigate to a specific screen.
 * @property {() => (e: React.MouseEvent) => void} createClickHandler - A function that creates a click handler for the rendered preview.
 */
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

/**
 * @hook useParse
 * @description A custom React hook that manages the parsing of the UI DSL, the rendering of the AST to HTML,
 * and the state associated with this process. It provides a comprehensive interface for a UI editor component
 * to interact with the DSL parser and renderer.
 *
 * @returns {UseParseResult} An object containing the state and functions for parsing and rendering the DSL.
 */
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

  /**
   * @function handleParse
   * @description A callback function that takes a string of DSL code, parses it, renders it to HTML,
   * and updates the state with the results. It also handles error collection and reporting through the ErrorBus.
   * @param {string} input - The DSL code to parse.
   * @returns {Promise<void>}
   */
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
      
      setAstResultJson('');
      setError(errorMessage);
    } finally {
      // Emit all collected errors to ErrorBus
      if (collectedErrors.length > 0) {
        ErrorBus.get().bulk(collectedErrors);
      }
      
      setIsLoading(false);
    }
  }, [currentScreen, routeManagerGateway, localRouteManager]);

  /**
   * @function navigateToScreen
   * @description A function to programmatically navigate to a specific screen.
   * @param {string} screenName - The name of the screen to navigate to.
   */
  const navigateToScreen = (screenName: string) => {
    routeManagerGateway.navigateToScreen(screenName);
    setMetadata(routeManagerGateway.getRouteMetadata());
    setCurrentScreen(screenName);
  }

  /**
   * @function createClickHandler
   * @description Creates a click handler that can be attached to the rendered HTML preview
   * to handle navigation events within the preview.
   * @returns {(e: React.MouseEvent) => void} A click handler function.
   */
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
