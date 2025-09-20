/** @jsxImportSource react */
import { useState } from 'react';
import { DslMiniPreview } from './dsl-mini-preview';

interface DslExampleProps {
    title?: string;
    description?: string;
    code: string;
    heightClassName?: string; // height for the preview panel
    autoWrapScreen?: boolean;
}

export function DslExample({
    title = 'Example',
    description,
    code,
    heightClassName = 'h-72',
    autoWrapScreen = true,
}: DslExampleProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (_) {
            // ignore
        }
    };

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h4 className="text-lg font-semibold text-gray-100">{title}</h4>
                    {description ? (
                        <p className="text-sm text-gray-400">{description}</p>
                    ) : null}
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Code panel */}
                <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                        <span className="text-xs uppercase tracking-wide text-gray-400">DSL Code</span>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-500">proto-typed
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${copied
                                    ? 'bg-green-900/30 border-green-700 text-green-300'
                                    : 'bg-gray-900/40 border-gray-700 text-gray-300 hover:bg-gray-900/60'
                                    }`}
                            >
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <pre className="mb-0 mt-0 text-sm leading-relaxed text-gray-200 whitespace-pre overflow-auto min-h-[12rem] h-full">
                        {code}
                    </pre>
                </div>

                {/* Live preview panel */}
                <div className="rounded-lg border border-gray-800 bg-gray-900/30">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                        <span className="text-xs uppercase tracking-wide text-gray-400">Live Preview</span>
                    </div>
                    <DslMiniPreview
                        heightClassName={heightClassName}
                        code={code}
                        autoWrapScreen={autoWrapScreen}
                    />
                </div>
            </div>
        </section>
    );
}

export default DslExample;
