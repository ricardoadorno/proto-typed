import React from 'react';

interface PreviewDeviceProps {
    deviceType: string;
    children: React.ReactNode;
}

export function PreviewDevice({ deviceType, children }: PreviewDeviceProps) {
    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl">
            {deviceType === "browser-mockup with-url" ? (
                <BrowserMockup>
                    {children}
                </BrowserMockup>
            ) : (
                <IPhoneMockup>
                    {children}
                </IPhoneMockup>
            )}
        </div>
    );
}

// iPhone X Mockup Component with Tailwind
function IPhoneMockup({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative mx-auto my-10 w-[375px] h-[812px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] overflow-hidden shadow-[0_0_0_8px_rgb(15_23_42),0_0_0_12px_rgb(30_41_59),0_20px_25px_-5px_rgb(0_0_0/0.1),0_8px_10px_-6px_rgb(0_0_0/0.1)]">
            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[140px] h-1 bg-slate-600 rounded-sm"></div>

            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[56%] h-[30px] bg-slate-900 rounded-b-[1.25rem] z-10"></div>

            {/* Speaker */}
            <div className="absolute top-0 left-1/2 transform translate-y-1.5 -translate-x-1/2 h-2 w-[15%] bg-slate-900 rounded shadow-[inset_0_-2px_4px_0_rgb(255_255_255/0.1)]"></div>

            {/* Camera */}
            <div className="absolute left-[15%] top-0 transform translate-x-[180px] translate-y-1 w-3 h-3 bg-slate-900 rounded-full shadow-[inset_0_-2px_4px_0_rgb(255_255_255/0.1)]">
                <div className="absolute w-1.5 h-1.5 top-[3px] left-[3px] bg-blue-500 rounded-full shadow-[inset_0_-1px_2px_rgb(0_0_0/0.3)]"></div>
            </div>

            {/* Content */}
            <div className="overflow-auto h-full w-full" style={{ containerType: 'inline-size' }}>
                {children}
            </div>
        </div>
    );
}

// Browser Mockup Component with Tailwind
function BrowserMockup({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative mx-auto my-10 w-[900px] h-[600px] bg-slate-900 rounded-t-xl overflow-hidden shadow-[0_20px_25px_-5px_rgb(0_0_0/0.1),0_8px_10px_-6px_rgb(0_0_0/0.1)] border-t-[3rem] border-t-slate-800">
            {/* Traffic lights */}
            <div className="absolute -top-8 left-4 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_0_2px_rgb(239_68_68),1.5rem_0_0_2px_rgb(34_197_94),3rem_0_0_2px_rgb(251_191_36)]"></div>

            {/* URL bar */}
            <div className="absolute -top-9 left-[5.5rem] w-[calc(100%-6rem)] h-6 rounded-md bg-slate-50 border border-slate-200"></div>

            {/* Content */}
            <div className="overflow-auto h-full w-full" style={{ containerType: 'inline-size' }}>
                {children}
            </div>
        </div>
    );
}
