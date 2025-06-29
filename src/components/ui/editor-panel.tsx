interface EditorPanelProps {
    children: React.ReactNode;
}

export function EditorPanel({ children }: EditorPanelProps) {
    return (
        <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden h-[600px]">
            <div className="h-full overflow-hidden">
                {children}
            </div>
        </div>
    );
}
