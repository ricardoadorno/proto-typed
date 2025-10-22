import React, { useState } from 'react';

/**
 * @interface ModalProps
 * @description The props for the Modal component.
 *
 * @property {string} buttonText - The text to display on the button that opens the modal.
 * @property {React.ReactNode} [header] - The content for the modal's header.
 * @property {React.ReactNode} [content] - The main content of the modal.
 * @property {React.ReactNode} [actions] - The content for the modal's footer, typically action buttons.
 * @property {('primary' | 'secondary' | 'outline')} [buttonVariant='secondary'] - The variant of the button that opens the modal.
 */
interface ModalProps {
    buttonText: string;
    header?: React.ReactNode;
    content?: React.ReactNode;
    actions?: React.ReactNode;
    buttonVariant?: 'primary' | 'secondary' | 'outline';
}

/**
 * @function Modal
 * @description A component that displays a modal dialog.
 *
 * @param {ModalProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered modal component.
 */
export default function Modal({ buttonText, content, header, actions, buttonVariant = 'secondary' }: ModalProps) {

    const [isOpen, setIsOpen] = useState(false); const buttonClasses = {
        primary: "px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium",
        secondary: "px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors duration-200 font-medium",
        outline: "px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium"
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    ></div>                    {/* Modal */}
                    <div className="relative bg-slate-800 rounded-2xl shadow-2xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-700">
                            <div className="flex-1">
                                {header}
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="ml-4 p-2 text-slate-400 hover:text-slate-300 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                                aria-label="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>{/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
                            {content}
                        </div>                        {/* Footer */}
                        {actions && (
                            <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-900/50">
                                {actions}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(true)}
                className={buttonClasses[buttonVariant]}
            >
                {buttonText}
            </button>
        </>
    )
}
