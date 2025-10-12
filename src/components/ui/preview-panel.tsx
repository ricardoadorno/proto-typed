import React, { useState } from 'react';

import { RouteMetadataDisplay } from './route-metadata-display';
import { RouteMetadata } from '../../types/routing';

interface PreviewPanelProps {
    title?: string;
    children?: React.ReactNode;
    metadata?: RouteMetadata | null;
    onNavigateToScreen?: (screenName: string) => void;
}

export function PreviewPanel({
    title = "Live Preview",
    children,
    metadata,
    onNavigateToScreen
}: PreviewPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                    {title}
                </h2>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label={isCollapsed ? "Expand" : "Collapse"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-slate-400"
                    >
                        {isCollapsed ? (
                            <polyline points="6 9 12 15 18 9" />
                        ) : (
                            <polyline points="18 15 12 9 6 15" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Collapsible content */}
            {!isCollapsed && (
                <>
                    {/* Route Metadata Display */}
                    <RouteMetadataDisplay metadata={metadata || null} onNavigateToScreen={onNavigateToScreen} />
                    {children}
                </>
            )}
        </div>
    );
}
