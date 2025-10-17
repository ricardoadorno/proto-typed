"use client";

import { useState, useEffect, ReactNode } from 'react';
import { useParse } from '../../hooks/use-parse';
import { DSLEditor } from '../../core/editor';
import { EditorPanel } from '../ui';

interface DslExampleProps {
    title?: string;
    description?: string;
    children?: ReactNode;
}

export default function DslExample({
    title = 'Example',
    description,
    children,
}: DslExampleProps) {
    const [copied, setCopied] = useState(false);

    const extractTextFromChildren = (node: ReactNode): string => {
        if (typeof node === 'string') return node;
        if (
            typeof node === 'object' &&
            node !== null &&
            // @ts-ignore - React internal shape
            node.props
        ) {
            // @ts-ignore
            const { props } = node;
            // Handle nested <pre><code> or <code>
            if (props.children) return extractTextFromChildren(props.children);
        }
        return '';
    };

    const removeBackticksAndDsl = (text: string): string => {
        if (!text) return '';
        return text
            // remove apenas os delimitadores, sem afetar novas linhas
            .replace(/^```(?:dsl)?\n?/, '')
            .replace(/```$/, '')
            // não faz trim global — apenas remove \r para normalizar
            .replace(/\r/g, '');
    };


    const rawText = extractTextFromChildren(children);
    const resolvedCode = removeBackticksAndDsl(rawText);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(resolvedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // ignore
        }
    };

    const { renderedHtml, createClickHandler, handleParse } = useParse();

    useEffect(() => {
        if (resolvedCode) handleParse(resolvedCode);
    }, [resolvedCode]);

    const renderScreen = () => {
        if (!renderedHtml) return null;

        return (
            <div
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
                onClick={createClickHandler()}
            />
        );
    };

    return (
        <section className="space-y-3 ">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h4 className="text-lg font-semibold text-gray-100">{title}</h4>
                    {description ? (
                        <p className="text-sm text-gray-400">{description}</p>
                    ) : null}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px] overflow-none">
                {/* Code panel */}
                <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                        <span className="text-xs uppercase tracking-wide text-gray-400">
                            DSL Code
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-500">proto-typed</span>
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
                    <EditorPanel>
                        <DSLEditor
                            value={resolvedCode}
                        />
                    </EditorPanel>
                </div>

                {/* Live preview panel */}
                <div className="rounded-lg border border-gray-800 bg-gray-900/30 h-[400px] overflow-auto">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                        <span className="text-xs uppercase tracking-wide text-gray-400">
                            Live Preview
                        </span>
                    </div>
                    {renderScreen()}
                </div>
            </div>
        </section>
    );
}

