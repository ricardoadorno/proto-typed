import { ParsedError } from '../../types/errors';
import { parseChevrotainError, getErrorContext } from '../../utils/error-parser';
import { useState } from 'react';

interface ErrorDisplayProps {
    error: string;
    code?: string;
    title?: string;
    compact?: boolean; // For use in terminals where margins/padding should be minimal
}

export function ErrorDisplay({ error, code, title, compact = false }: ErrorDisplayProps) {
    const [copied, setCopied] = useState(false);
    const parsedError = parseChevrotainError(error);

    const copyErrorToClipboard = async () => {
        try {
            const errorDetails = `Error Type: ${parsedError.type}
Title: ${parsedError.title}
Message: ${parsedError.message}
${parsedError.location ? `Location: Line ${parsedError.location.line}, Column ${parsedError.location.column}` : ''}
${parsedError.suggestion ? `Suggestion: ${parsedError.suggestion}` : ''}

Raw Error:
${error}`;

            await navigator.clipboard.writeText(errorDetails);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy error details:', err);
        }
    };

    const getSyntaxHint = (type: ParsedError['type']) => {
        switch (type) {
            case 'lexer':
                return {
                    title: 'Lexical Analysis Issue',
                    description: 'Problem with character recognition or token formation'
                };
            case 'parser':
                return {
                    title: 'Syntax Structure Issue',
                    description: 'Problem with the structure or order of elements'
                };
            default:
                return {
                    title: 'Unknown Issue',
                    description: 'Unexpected error occurred during parsing'
                };
        }
    };

    const getErrorIcon = (type: ParsedError['type']) => {
        switch (type) {
            case 'lexer':
                return (
                    <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'parser':
                return (
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    const getErrorColors = (type: ParsedError['type']) => {
        switch (type) {
            case 'lexer':
                return {
                    bg: 'bg-orange-900/20',
                    border: 'border-orange-400',
                    title: 'text-orange-400',
                    text: 'text-orange-300'
                };
            case 'parser':
                return {
                    bg: 'bg-red-900/20',
                    border: 'border-red-400',
                    title: 'text-red-400',
                    text: 'text-red-300'
                };
            default:
                return {
                    bg: 'bg-red-900/20',
                    border: 'border-red-400',
                    title: 'text-red-400',
                    text: 'text-red-300'
                };
        }
    };

    const colors = getErrorColors(parsedError.type);
    const displayTitle = title || parsedError.title;
    const syntaxHint = getSyntaxHint(parsedError.type);

    return (
        <div className={`${colors.bg} border-l-4 ${colors.border} ${compact ? 'p-3 m-0 rounded' : 'p-4 m-4 rounded-lg'}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    {getErrorIcon(parsedError.type)}
                </div>
                <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`text-sm font-medium ${colors.title}`}>
                                {displayTitle}
                            </h3>
                            <p className={`text-xs ${colors.text} opacity-75 mt-1`}>
                                {syntaxHint.description}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {parsedError.location && (
                                <span className={`text-xs ${colors.text} opacity-75`}>
                                    Line {parsedError.location.line}, Column {parsedError.location.column}
                                </span>
                            )}
                            <button
                                onClick={copyErrorToClipboard}
                                className={`text-xs px-2 py-1 rounded ${colors.text} opacity-75 hover:opacity-100 transition-opacity`}
                                title="Copy error details"
                            >
                                {copied ? (
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={`mt-2 text-sm ${colors.text}`}>
                        <p className="mb-2">{parsedError.message}</p>

                        {/* Context Information */}
                        {parsedError.context && (parsedError.context.token || (parsedError.context.expected && parsedError.context.expected.length > 0)) && (
                            <div className="mt-3 p-2 bg-gray-800 rounded text-xs">
                                {parsedError.context.token && (
                                    <div className="mb-1">
                                        <span className="font-medium">Found:</span>
                                        <code className="ml-1 px-1 py-0.5 bg-gray-700 rounded">
                                            "{parsedError.context.token}"
                                        </code>
                                    </div>
                                )}
                                {parsedError.context.expected && parsedError.context.expected.length > 0 && (
                                    <div>
                                        <span className="font-medium">Expected:</span>
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {parsedError.context.expected.map((exp, idx) => (
                                                <code
                                                    key={idx}
                                                    className="px-1 py-0.5 bg-blue-900/30 text-blue-300 rounded text-xs"
                                                >
                                                    {exp}
                                                </code>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Code Context */}
                        {code && parsedError.location && (
                            <div className="mt-3">
                                <div className="text-xs font-medium mb-1">Code Context:</div>
                                <pre className="bg-gray-800 p-2 rounded text-xs overflow-x-auto font-mono">
                                    {getErrorContext(code, parsedError.location.line, parsedError.location.column)}
                                </pre>
                            </div>
                        )}

                        {/* Suggestion */}
                        {parsedError.suggestion && (
                            <div className="mt-3 p-2 bg-blue-900/20 border border-blue-800 rounded">
                                <div className="flex items-start">
                                    <svg className="h-4 w-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <div className="text-xs font-medium text-blue-400 mb-1">
                                            💡 Suggestion:
                                        </div>
                                        <div className="text-xs text-blue-300">
                                            {parsedError.suggestion}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick DSL Reference */}
                        {parsedError.type === 'parser' && (
                            <div className="mt-3 p-2 bg-green-900/20 border border-green-800 rounded">
                                <div className="text-xs font-medium text-green-400 mb-1">
                                    📖 Quick DSL Reference:
                                </div>
                                <div className="text-xs text-green-300 space-y-1">
                                    <div><code>screen Name:</code> - Screen declaration</div>
                                    <div><code>@[Button](action)</code> - Button element</div>
                                    <div><code># Heading</code> - Heading text</div>
                                    <div><code>&gt; Text content</code> - Regular text</div>
                                    <div><code>container:</code> - Layout container</div>
                                </div>
                            </div>
                        )}

                        {/* Raw Error (collapsible for debugging) */}
                        <details className="mt-3">
                            <summary className="text-xs cursor-pointer hover:underline opacity-75 flex items-center">
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                Show raw error details
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-800 p-2 rounded overflow-x-auto whitespace-pre-wrap font-mono">
                                {error}
                            </pre>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}
