interface EditorPanelProps {
    children: React.ReactNode;
    error?: string | null;
}

export function EditorPanel({ children, error }: EditorPanelProps) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden h-[600px]">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 m-4 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                                Parsing Error
                            </h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                <pre className="whitespace-pre-wrap font-mono text-xs">{error}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="h-full">
                {children}
            </div>
        </div>
    );
}
