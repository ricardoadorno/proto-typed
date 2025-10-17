import type { ReactNode } from "react";

interface DocsContentProps {
    title?: string;
    children: ReactNode;
}

export function DocsContent({ title = "Documentation", children }: DocsContentProps) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">{title}</h2>
            <div className="prose prose-invert max-w-none">
                {children}
            </div>
        </div>
    );
}

export default DocsContent;
