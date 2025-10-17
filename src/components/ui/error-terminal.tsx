"use client";
import { ErrorDisplay } from './error-display';
import { useState } from 'react';

interface ErrorTerminalProps {
    error?: string | null;
    code?: string;
}

export function ErrorTerminal({ error, code }: ErrorTerminalProps) {
    const [isMinimized, setIsMinimized] = useState(false);

    if (!error) return null;

    return (
        <div className={`bg-slate-900 rounded-2xl shadow-xl border border-red-500/20 overflow-hidden transition-all duration-300 ${isMinimized ? 'h-[60px]' : ''}`}>
            {/* Terminal Header */}
            <div className="bg-slate-800 px-4 py-3 border-b border-red-500/20 flex items-center justify-between h-[60px]">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-red-500/20">
                            <svg className="h-3 w-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-red-400">
                                Error Console
                            </span>
                            <div className="text-xs text-slate-500">
                                DSL Parser • Real-time feedback
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="text-xs text-slate-500 hidden sm:block">
                        Press to {isMinimized ? 'expand' : 'minimize'}
                    </div>
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded hover:bg-slate-700/50 group"
                        title={isMinimized ? 'Expand console' : 'Minimize console'}
                    >
                        <svg
                            className={`h-4 w-4 transition-all duration-200 group-hover:scale-110 ${!isMinimized ? 'rotate-180' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Terminal Content */}
            {!isMinimized && (
                <div className="bg-slate-900">
                    {/* Custom Error Display for Terminal */}
                    <div className="p-2">
                        {/* <ErrorDisplay error={error} code={code} compact={true} /> */}
                    </div>
                </div>
            )}
        </div>
    );
}
