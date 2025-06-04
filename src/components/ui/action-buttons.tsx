import React from 'react';

interface ActionButtonsProps {
    onExportHtml: () => void;
    children?: React.ReactNode;
}

export function ActionButtons({ onExportHtml, children }: ActionButtonsProps) {
    return (
        <div className="flex flex-wrap gap-3 mb-4">
            <button
                onClick={onExportHtml}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
                <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export HTML</span>
                </span>
            </button>
            {children}
        </div>
    );
}
