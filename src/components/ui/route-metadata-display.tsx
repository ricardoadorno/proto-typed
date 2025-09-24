import { RouteMetadata } from '../../core/renderer/route-manager/types';

interface RouteMetadataDisplayProps {
    metadata: RouteMetadata | null;
}

export function RouteMetadataDisplay({ metadata }: RouteMetadataDisplayProps) {
    if (!metadata) return null;

    return (
        <div className="mt-4 space-y-3">
            {/* Current Screen */}
            {metadata.currentScreen && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">●</span>
                    <span className="text-gray-300">Current:</span>
                    <span className="text-white font-medium">{metadata.currentScreen}</span>
                </div>
            )}

            {/* Routes Summary */}
            <div className="space-y-3 text-xs">
                {/* Screens - Full Width */}
                <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-gray-300 font-medium">Screens ({metadata.screens.length})</span>
                    </div>
                    <div className="space-y-1">
                        {metadata.screens.map((screen) => (
                            <div key={screen.id} className="flex items-center gap-2">
                                {metadata.currentScreen === screen.name
                                    && <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>}
                                {screen.isDefault && <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>}
                                <span className={metadata.currentScreen === screen.name ? "text-white" : "text-gray-400"}>
                                    {screen.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Modals & Drawers */}
                    <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            <span className="text-gray-300 font-medium">
                                Overlays ({metadata.modals.length + metadata.drawers.length})
                            </span>
                        </div>
                        {metadata.modals.length + metadata.drawers.length > 0 ? (
                            <div className="space-y-1">
                                {metadata.modals.map((modal) => (
                                    <div key={modal.id} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                                        <span className="text-gray-400 text-xs">modal</span>
                                        <span className="text-gray-300">{modal.name}</span>
                                    </div>
                                ))}
                                {metadata.drawers.map((drawer) => (
                                    <div key={drawer.id} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                                        <span className="text-gray-400 text-xs">drawer</span>
                                        <span className="text-gray-300">{drawer.name}</span>
                                    </div>
                                ))}
                            </div>) : <div className="text-gray-500 text-xs">No overlays</div>}
                    </div>

                    {/* Components */}
                    <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                            <span className="text-gray-300 font-medium">Components ({metadata.components.length})</span>
                        </div>
                        {metadata.components.length > 0 ? (
                            <div className="space-y-1">
                                {metadata.components.map((component) => (
                                    <div key={component.id} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                        <span className="text-gray-300">{component.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-xs">No components</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Total Routes */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                <span className="text-gray-400 text-xs">Total Views</span>
                <span className="text-white font-medium text-sm">{metadata.totalRoutes}</span>
            </div>
        </div>
    );
}