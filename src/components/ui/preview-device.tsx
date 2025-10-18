import React from 'react';

interface PreviewDeviceProps {
    deviceType: string;
    children: React.ReactNode;
    zoom?: number;
}

export function PreviewDevice({ deviceType, children, zoom = 100 }: PreviewDeviceProps) {
    return (
        <div className="flex h-full w-full items-center justify-center rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-raised)] p-6">
            {deviceType === "browser-mockup with-url" ? (
                <BrowserMockup zoom={zoom}>
                    {children}
                </BrowserMockup>
            ) : (
                <IPhoneMockup zoom={zoom}>
                    {children}
                </IPhoneMockup>
            )}
        </div>
    );
}

// iPhone X Mockup Component with Tailwind
function IPhoneMockup({ children, zoom }: { children: React.ReactNode; zoom: number }) {
    return (
        <div className="relative mx-auto h-[812px] w-[375px] overflow-hidden rounded-[2.5rem] border border-[color:rgba(139,92,246,0.25)] bg-[var(--bg-main)] shadow-[0_0_0_6px_rgba(17,18,26,0.8),0_32px_64px_rgba(12,14,24,0.45)]">
            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 h-1 w-[140px] -translate-x-1/2 transform rounded-sm bg-[color:rgba(169,175,191,0.4)]"></div>

            {/* Notch */}
            <div className="absolute left-1/2 top-0 z-10 h-[30px] w-[56%] -translate-x-1/2 transform rounded-b-[1.25rem] bg-[var(--bg-main)]"></div>

            {/* Speaker */}
            <div className="absolute left-1/2 top-0 h-2 w-[15%] -translate-x-1/2 translate-y-1.5 transform rounded bg-[var(--bg-surface)] shadow-[inset_0_-1px_2px_rgba(255,255,255,0.08)]"></div>

            {/* Camera */}
            <div className="absolute left-[15%] top-0 h-3 w-3 translate-x-[180px] translate-y-1 transform rounded-full bg-[var(--bg-surface)] shadow-[inset_0_-1px_3px_rgba(255,255,255,0.08)]">
                <div className="absolute left-[3px] top-[3px] h-1.5 w-1.5 rounded-full bg-[color:rgba(139,92,246,0.8)] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.25)]"></div>
            </div>

            {/* Content */}
            <div
                className="h-full w-full overflow-auto bg-[var(--bg-main)]"
                style={{
                    containerType: 'inline-size',
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                }}
            >
                <div className="min-h-full min-w-full">{children}</div>
            </div>
        </div>
    );
}

// Browser Mockup Component with Tailwind
function BrowserMockup({ children, zoom }: { children: React.ReactNode; zoom: number }) {
    return (
        <div className="relative mx-auto h-[600px] w-full max-w-[920px] overflow-hidden rounded-3xl border border-[color:rgba(139,92,246,0.25)] bg-[var(--bg-main)] shadow-[0_32px_64px_rgba(12,14,24,0.45)]">
            {/* Traffic lights */}
            <div className="absolute left-6 top-5 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[var(--danger)]" />
                <span className="h-3 w-3 rounded-full bg-[var(--warning)]" />
                <span className="h-3 w-3 rounded-full bg-[var(--brand-400)]" />
            </div>

            {/* URL bar */}
            <div className="absolute left-[5.5rem] top-4 h-7 w-[calc(100%-7rem)] rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface)]"></div>

            {/* Content */}
            <div
                className="mt-12 h-[calc(100%-3rem)] w-full overflow-auto bg-[var(--bg-main)]"
                style={{
                    containerType: 'inline-size',
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                }}
            >
                <div className="min-h-full min-w-full">{children}</div>
            </div>
        </div>
    );
}
