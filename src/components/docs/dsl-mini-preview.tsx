import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { parseAndBuildAst } from '../../core/parser/parse-and-build-ast';
import { astToHtmlStringPreview } from '../../core/renderer/ast-to-html-string-preview';
import { routeManagerGateway } from '../../core/renderer/infrastructure/route-manager-gateway';
import { customPropertiesManager } from '../../core/renderer/core/theme-manager';

interface DslMiniPreviewProps {
    code: string;
    title?: string;
    heightClassName?: string; // e.g. "h-64"
    autoWrapScreen?: boolean; // wrap snippets that don't declare a screen
    theme?: string; // optional theme name to sync with customPropertiesManager
}

function indentLines(text: string, spaces = 2): string {
    const pad = ' '.repeat(spaces);
    return text
        .split('\n')
        .map((l) => (l.length ? pad + l : l))
        .join('\n');
}

function maybeWrap(code: string): string {
    // If any line starts with `screen `, assume it's complete
    if (/^\s*screen\s+/im.test(code)) return code;
    // Otherwise, wrap into a simple screen/container so snippets render
    const inner = indentLines(code.trim());
    return `screen DocsPreview:\n${inner}`;
}

export function DslMiniPreview({
    code,
    heightClassName = 'h-64',
    autoWrapScreen = true,
    theme,
}: DslMiniPreviewProps) {
    const [html, setHtml] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [currentScreen, setCurrentScreen] = useState<string | undefined>(undefined);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const source = useMemo(() => (autoWrapScreen ? maybeWrap(code) : code), [code, autoWrapScreen]);

    // Sync theme changes with the theme manager (like App.tsx does)
    useEffect(() => {
        if (theme) {
            customPropertiesManager.setExternalTheme(theme);
        }
    }, [theme]);

    const compile = useCallback(async () => {
        if (!source.trim()) {
            setHtml('');
            setError(null);
            return;
        }
        try {
            const ast = parseAndBuildAst(source);

            // Initialize routes with routeManagerGateway
            routeManagerGateway.initialize(ast, { currentScreen });

            // Get first screen if no currentScreen is set
            if (!currentScreen) {
                const metadata = routeManagerGateway.getRouteMetadata();
                if (metadata.screens.length > 0) {
                    setCurrentScreen(metadata.screens[0].name);
                }
            }

            const rendered = astToHtmlStringPreview(ast, { currentScreen });
            setHtml(rendered);
            setError(null);
        } catch (e: any) {
            setError(e?.message ?? 'Failed to render DSL');
            setHtml('');
        }
    }, [source, currentScreen]);

    useEffect(() => {
        const id = setTimeout(compile, 150);
        return () => clearTimeout(id);
    }, [compile]);

    // Set navigation handlers before creating click handler
    useEffect(() => {
        routeManagerGateway.setHandlers({
            onScreenNavigation: (screenName: string) => {
                setCurrentScreen(screenName);
            },
        });
    }, []);

    // Use routeManagerGateway's navigation handler (like App.tsx does)
    const handleClick = useMemo(
        () => routeManagerGateway.createClickHandler(),
        []
    );

    return (
        <>
            <div
                ref={containerRef}
                onClick={handleClick}
                className={`border border-slate-700 rounded-lg  ${heightClassName} overflow-auto shadow-inner min-h-full`}
            >
                {error ? (
                    <div className="text-red-400 text-sm">{error}</div>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                )}
            </div>
        </>
    );
}

export default DslMiniPreview;
