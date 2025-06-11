import React from 'react';
import { ExamplePreviewProps } from '../types';

/**
 * Live preview component that renders compiled DSL code
 */
export function LivePreview({ code, onScreenChange }: Omit<ExamplePreviewProps, 'currentScreen'>) {
    const handleClick = (e: React.MouseEvent) => {
        // Handle navigation with data-nav attributes
        const target = (e.target as Element).closest('[data-nav]');
        if (target) {
            e.preventDefault();
            const navValue = target.getAttribute('data-nav');
            const navType = target.getAttribute('data-nav-type');

            if (navValue && navType === 'internal') {
                onScreenChange(navValue);
                // Hide all screens
                const screenElements = document.querySelectorAll('.screen');
                screenElements.forEach(screen => {
                    (screen as HTMLElement).style.display = 'none';
                });

                // Show the selected screen
                const targetScreen = document.getElementById(`${navValue.toLowerCase()}-screen`);
                if (targetScreen) {
                    targetScreen.style.display = 'block';
                }
            }
            return;
        }

        // Legacy support for data-screen-link
        if (e.target instanceof HTMLAnchorElement && e.target.hasAttribute('data-screen-link')) {
            e.preventDefault();
            const screenName = e.target.getAttribute('data-screen-link');
            if (screenName) {
                onScreenChange(screenName);
                // Hide all screens
                const screenElements = document.querySelectorAll('.screen');
                screenElements.forEach(screen => {
                    (screen as HTMLElement).style.display = 'none';
                });

                // Show the selected screen
                const targetScreen = document.getElementById(`${screenName.toLowerCase()}-screen`);
                if (targetScreen) {
                    targetScreen.style.display = 'block';
                }
            }
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center space-x-2">
                <span className="text-lg">👁️</span>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Live Preview</h4>
            </div>

            <div
                className="bg-slate-800 border border-slate-600 rounded-lg p-4 h-96 overflow-auto shadow-inner"
                onClick={handleClick}
            >
                <div dangerouslySetInnerHTML={{ __html: code }} />
            </div>
        </div>
    );
}

export default LivePreview;
