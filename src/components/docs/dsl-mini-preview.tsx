import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { parseAndBuildAst } from '../../core/parser/parse-and-build-ast';
import { astToHtmlString } from '../../core/renderer/ast-to-html';

interface DslMiniPreviewProps {
    code: string;
    title?: string;
    heightClassName?: string; // e.g. "h-64"
    autoWrapScreen?: boolean; // wrap snippets that don't declare a screen
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
}: DslMiniPreviewProps) {
    const [html, setHtml] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [currentScreen, setCurrentScreen] = useState<string | undefined>(undefined);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const source = useMemo(() => (autoWrapScreen ? maybeWrap(code) : code), [code, autoWrapScreen]);

    const compile = useCallback(async () => {
        if (!source.trim()) {
            setHtml('');
            setError(null);
            return;
        }
        try {
            const ast = await parseAndBuildAst(source);
            const rendered = astToHtmlString(ast, { currentScreen });
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

    const handleClick = (e: React.MouseEvent) => {
        const root = containerRef.current;
        if (!root) return;

        // Support new data-nav pattern
        const target = (e.target as Element).closest('[data-nav]');
        if (target) {
            e.preventDefault();
            const navValue = target.getAttribute('data-nav');
            const navType = target.getAttribute('data-nav-type');
            if (navValue && navType === 'internal') {
                setCurrentScreen(navValue);
                root.querySelectorAll('.screen').forEach((el) => {
                    (el as HTMLElement).style.display = 'none';
                });
                const targetScreen = root.querySelector(`#${navValue.toLowerCase()}-screen`);
                if (targetScreen) (targetScreen as HTMLElement).style.display = 'block';
            }
            return;
        }

        // Legacy support for data-screen-link anchors
        const t = e.target as HTMLElement;
        if (t instanceof HTMLAnchorElement && t.hasAttribute('data-screen-link')) {
            e.preventDefault();
            const screenName = t.getAttribute('data-screen-link');
            if (screenName) {
                setCurrentScreen(screenName);
                root.querySelectorAll('.screen').forEach((el) => {
                    (el as HTMLElement).style.display = 'none';
                });
                const targetScreen = root.querySelector(`#${screenName.toLowerCase()}-screen`);
                if (targetScreen) (targetScreen as HTMLElement).style.display = 'block';
            }
        }
    };

    return (
        <>
            <div
                ref={containerRef}
                onClick={handleClick}
                className={`border border-slate-700 rounded-lg  ${heightClassName} overflow-auto shadow-inner`}
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
