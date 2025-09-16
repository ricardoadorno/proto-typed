import { Outlet } from "react-router-dom";

interface DocsContentProps {
    title?: string;
}

export function DocsContent({ title = "Documentation" }: DocsContentProps) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">{title}</h2>
            <div className="prose prose-invert max-w-none">
                <Outlet />
            </div>
        </div>
    );
}

export default DocsContent;
