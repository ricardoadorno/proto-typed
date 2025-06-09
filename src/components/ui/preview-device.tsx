import React from 'react';

interface PreviewDeviceProps {
    deviceType: string;
    children: React.ReactNode;
}

export function PreviewDevice({ deviceType, children }: PreviewDeviceProps) {
    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl">
            {deviceType === "browser-mockup with-url" ? (
                <div className="browser-mockup with-url w-full h-full">
                    <div className="icontent" style={{ height: '600px', width: "100%", background: 'transparent', overflow: 'auto' }}>
                        {children}
                    </div>
                </div>
            ) : (
                <div className="iphone-x w-full h-full">
                    {children}
                </div>
            )}
        </div>
    );
}
