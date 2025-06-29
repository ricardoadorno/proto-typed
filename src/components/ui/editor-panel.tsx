import { ErrorDisplay } from './error-display';

interface EditorPanelProps {
    children: React.ReactNode;
    error?: string | null;
}

export function EditorPanel({ children, error }: EditorPanelProps) {
    return (
        <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden h-[600px]">
            {error && <ErrorDisplay error={error} />}
            <div className="h-full">
                {children}
            </div>
        </div>
    );
}
