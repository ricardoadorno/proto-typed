import { AppHeader } from "../../../../components/ui";

export function DocsHeader() {

    return (
        <div className="mb-8">
            <AppHeader
                title="Proto-Typed Docs"
                description="Learn how to create interactive prototypes with our DSL"
            />
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-400">
                <a href="/" className="hover:text-blue-400 transition-colors">
                    ← Back to Editor
                </a>
            </div>
        </div>
    );
}

export default DocsHeader;
