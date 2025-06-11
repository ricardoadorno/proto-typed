import { useState, useEffect } from 'react';
import { DSLEditor } from '../../../core/editor';

interface CodeDisplayProps {
    code: string;
    title?: string;
    description?: string;
    onCodeChange?: (code: string) => void;
    editable?: boolean;
}

/**
 * Interactive code display component with Monaco Editor, syntax highlighting, and live editing
 */
export function CodeDisplay({
    code,
    title = "DSL Code",
    description,
    onCodeChange,
    editable = false
}: CodeDisplayProps) {
    const [copied, setCopied] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);
    const [isEditing, setIsEditing] = useState(false);

    // Update internal code when prop changes
    useEffect(() => {
        setCurrentCode(code);
    }, [code]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(currentCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleCodeChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCurrentCode(value);
            onCodeChange?.(value);
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const resetCode = () => {
        setCurrentCode(code);
        onCodeChange?.(code);
        setIsEditing(false);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-lg">⚡</span>
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                    {editable && (
                        <>
                            <button
                                onClick={toggleEdit}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isEditing
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>{isEditing ? 'View' : 'Edit'}</span>
                            </button>
                            {isEditing && (
                                <button
                                    onClick={resetCode}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-700 hover:bg-orange-200 dark:hover:bg-orange-800"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Reset</span>
                                </button>
                            )}
                        </>
                    )}
                    <button
                        onClick={copyToClipboard}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${copied
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                            }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="relative">
                {isEditing ? (
                    <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                        <DSLEditor
                            height="384px"
                            value={currentCode}
                            onChange={handleCodeChange}
                        />
                    </div>
                ) : (
                    <div className="relative">
                        <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                            <DSLEditor
                                height="384px"
                                value={currentCode}
                                onChange={() => { }} // Read-only in view mode
                            />
                        </div>
                        <div className="absolute top-2 right-2 z-10">
                            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-medium">
                                DSL
                            </span>
                        </div>
                        {/* Overlay to prevent interaction in view mode */}
                        <div className="absolute inset-0 z-5 pointer-events-none bg-transparent" />
                    </div>
                )}
            </div>

            {description && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-0.5">💡</span>
                        <div>
                            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Description</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{description}</p>
                        </div>
                    </div>
                </div>)}
        </div>
    );
}

export default CodeDisplay;
