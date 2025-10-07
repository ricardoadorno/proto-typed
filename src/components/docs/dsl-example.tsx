/** @jsxImportSource react */
import { useState, useEffect, type ReactNode, isValidElement } from 'react';
import { DslMiniPreview } from './dsl-mini-preview';
import { parseAndBuildAst } from '../../core/parser/parse-and-build-ast';
import { routeManagerGateway } from '../../core/renderer/infrastructure/route-manager-gateway';

interface DslExampleProps {
    title?: string;
    description?: string;
    code?: string;
    heightClassName?: string; // height for the preview panel
    autoWrapScreen?: boolean;
    children?: ReactNode; // optional MDX children as code source
}

export function DslExample({
    title = 'Example',
    description,
    code = '',
    heightClassName = 'h-72',
    autoWrapScreen = true,
    children,
}: DslExampleProps) {
    const [copied, setCopied] = useState(false);
    const [routeInfo, setRouteInfo] = useState<{
        screens: number;
        modals: number;
        drawers: number;
    } | null>(null);

    const extractText = (node: ReactNode): string => {
        if (node == null) return '';
        if (typeof node === 'string') return node;
        if (Array.isArray(node)) return node.map(extractText).join('');
        if (isValidElement(node)) {
            // Most MDX code blocks compile to <pre><code>{"..."}</code></pre>
            const props: any = (node as any).props ?? {};
            return extractText(props.children);
        }
        return '';
    };

    const resolvedCode = (() => {
        const explicit = typeof code === 'string' ? code : '';
        if (explicit.trim().length > 0) return explicit;
        const fromChildren = extractText(children);
        return fromChildren.replace(/^\n+|\n+$/g, '');
    })();

    // Extract route metadata when code changes
    useEffect(() => {
        try {
            const ast = parseAndBuildAst(resolvedCode);
            routeManagerGateway.initialize(ast);
            const metadata = routeManagerGateway.getRouteMetadata();
            setRouteInfo({
                screens: metadata.screens.length,
                modals: metadata.modals.length,
                drawers: metadata.drawers.length,
            });
        } catch {
            setRouteInfo(null);
        }
    }, [resolvedCode]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(resolvedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (_) {
            // ignore
        }
    };

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h4 className="text-lg font-semibold text-gray-100">{title}</h4>
                    {description ? (
                        <p className="text-sm text-gray-400">{description}</p>
                    ) : null}
                </div>

                {/* Route info badges */}
                {routeInfo && (routeInfo.screens > 0 || routeInfo.modals > 0 || routeInfo.drawers > 0) && (
                    <div className="flex items-center gap-2 text-xs">
                        {routeInfo.screens > 0 && (
                            <span className="px-2 py-1 rounded-md bg-blue-900/30 border border-blue-700/50 text-blue-300">
                                {routeInfo.screens} screen{routeInfo.screens > 1 ? 's' : ''}
                            </span>
                        )}
                        {routeInfo.modals > 0 && (
                            <span className="px-2 py-1 rounded-md bg-purple-900/30 border border-purple-700/50 text-purple-300">
                                {routeInfo.modals} modal{routeInfo.modals > 1 ? 's' : ''}
                            </span>
                        )}
                        {routeInfo.drawers > 0 && (
                            <span className="px-2 py-1 rounded-md bg-green-900/30 border border-green-700/50 text-green-300">
                                {routeInfo.drawers} drawer{routeInfo.drawers > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Code panel */}
                <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                        <span className="text-xs uppercase tracking-wide text-gray-400">DSL Code</span>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-500">proto-typed
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${copied
                                    ? 'bg-green-900/30 border-green-700 text-green-300'
                                    : 'bg-gray-900/40 border-gray-700 text-gray-300 hover:bg-gray-900/60'
                                    }`}
                            >
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <pre className="mb-0 mt-0 text-sm leading-relaxed text-gray-200 whitespace-pre overflow-auto min-h-[12rem] ">
                        {resolvedCode}
                    </pre>
                </div>

                {/* Live preview panel */}
                <div className="rounded-lg border border-gray-800 bg-gray-900/30">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                        <span className="text-xs uppercase tracking-wide text-gray-400">Live Preview</span>
                    </div>
                    <DslMiniPreview
                        heightClassName={heightClassName}
                        code={resolvedCode}
                        autoWrapScreen={autoWrapScreen}
                    />
                </div>
            </div>
        </section>
    );
}

export default DslExample;
