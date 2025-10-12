import type { ReactNode } from 'react';
import { DocsHeader, DocsSidebar, DocsFooter } from "./components";

export function DocsLayout({ children }: { children: ReactNode }) {

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
                        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                            <div className="prose prose-invert max-w-none">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DocsFooter />
            </div>
        </div>
    );
}

export default DocsLayout;