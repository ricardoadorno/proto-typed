import { DocsHeader, DocsSidebar, DocsContent, DocsFooter } from "./components";

export function DocsLayout() {
    const title = "Documentation";

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header with navigation */}
                <DocsHeader />

                {/* Main content area */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar navigation */}
                    <div className="col-span-3">
                        <DocsSidebar />
                    </div>

                    {/* Main content */}
                    <div className="col-span-9">
                        <DocsContent title={title} />
                    </div>
                </div>

                {/* Footer */}
                <DocsFooter />
            </div>
        </div>
    );
}

export default DocsLayout;