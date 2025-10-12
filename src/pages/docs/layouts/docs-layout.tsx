import { useState, type ReactNode } from 'react';
import { DocsHeader, DocsSidebar, DocsFooter } from "./components";

export function DocsLayout({ children }: { children: ReactNode }) {

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header with navigation */}
                <DocsHeader />
                <div className="md:hidden fixed top-6 right-6 z-50">
                    {/* Icon button for menu (fixed top-right on mobile) */}
                    <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 bg-blue-600 rounded-md cursor-pointer gap-2 shadow-md"
                        onClick={() => setMobileSidebarOpen(true)}
                        aria-label="Abrir menu de navegação"
                    >
                        {/* Menu icon (Lucide or Heroicons) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="sr-only">Menu</span>
                    </button>
                </div>

                {mobileSidebarOpen && (
                    <div className="fixed inset-0 z-40">
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 bg-black/50 transition-opacity opacity-100 pointer-events-auto"
                            onClick={() => setMobileSidebarOpen(false)}
                            aria-label="Fechar menu de navegação"
                        ></div>

                        {/* Panel */}
                        <div className="fixed left-0 top-0 h-full w-64 overflow-auto bg-gray-800 p-4 transition-transform">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-medium">Navegação</span>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-2 py-1 bg-gray-700 rounded-md cursor-pointer"
                                    onClick={() => setMobileSidebarOpen(false)}
                                    aria-label="Fechar menu de navegação"
                                >
                                    X
                                </button>
                            </div>
                            <DocsSidebar />
                        </div>
                    </div>
                )}

                {/* Main content area */}
                <div className="grid grid-cols-12 gap-6">

                    <div className="col-span-3 hidden md:block">
                        <div className="sticky top-6 max-h-[80vh] overflow-auto transition-all">
                            <DocsSidebar />
                        </div>
                    </div>
                    {/* Main content */}
                    <div className="col-span-12 md:col-span-9">
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