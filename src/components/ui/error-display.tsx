"use client";

import { useState } from 'react';

interface ErrorDisplayProps {
    error: string;
    code?: string;
    title?: string;
    compact?: boolean;
}

/**
 * Simplified Error Display Component
 * 
 * Displays parsing errors with copy-to-clipboard functionality.
 * Now integrated with ErrorBus - markers show in Monaco editor.
 */
export function ErrorDisplay({ error, code, title, compact = false }: ErrorDisplayProps) {
    const [copied, setCopied] = useState(false);

    const copyErrorToClipboard = async () => {
        try {
            const errorDetails = `Error: ${error}${code ? `\n\nCode:\n${code}` : ''}`;
            await navigator.clipboard.writeText(errorDetails);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy error details:', err);
        }
    };

    const displayTitle = title || 'Parse Error';
    const paddingClass = compact ? 'p-3' : 'p-6';
    const marginClass = compact ? 'm-0' : 'mb-4';

    return (
        <div className={`bg-red-900/20 border-l-4 border-red-400 ${paddingClass} ${marginClass} rounded-lg`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-semibold text-red-400 mb-1">
                        {displayTitle}
                    </h3>
                    <div className="text-sm text-red-300 whitespace-pre-wrap font-mono">
                        {error}
                    </div>
                    {code && (
                        <div className="mt-3 text-xs text-slate-400">
                            <div className="font-semibold mb-1">Context:</div>
                            <pre className="bg-slate-800/50 p-2 rounded overflow-x-auto">
                                <code className="text-slate-300">{code}</code>
                            </pre>
                        </div>
                    )}
                    <div className="mt-3 flex items-center space-x-3">
                        <button
                            onClick={copyErrorToClipboard}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                        >
                            {copied ? (
                                <>
                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                    </svg>
                                    <span>Copy Error</span>
                                </>
                            )}
                        </button>
                        <span className="text-xs text-slate-500">
                            ��� Check Monaco editor for inline error markers
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
