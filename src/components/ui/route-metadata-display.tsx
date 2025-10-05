import { RouteMetadata } from '../../types/routing';

interface RouteMetadataDisplayProps {
    metadata: RouteMetadata | null;
    onNavigateToScreen?: (screenName: string) => void;
}

export function RouteMetadataDisplay({ metadata, onNavigateToScreen }: RouteMetadataDisplayProps) {
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
                                <span
                                    className={`${metadata.currentScreen === screen.name ? "text-white" : "text-gray-400"
                                        } ${onNavigateToScreen ? "cursor-pointer hover:text-blue-400 transition-colors" : ""}`}
                                    onClick={() => onNavigateToScreen?.(screen.name)}
                                    title={onNavigateToScreen ? `Navigate to ${screen.name}` : undefined}
                                >
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

            {/* Navigation History */}
            {metadata.navigationHistory.length > 0 && (
                <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                        <span className="text-gray-300 font-medium">
                            Navigation History ({metadata.navigationHistory.length})
                        </span>
                        {metadata.canNavigateBack && (
                            <span className="text-xs text-orange-400 bg-orange-400/20 px-2 py-0.5 rounded">
                                Can go back
                            </span>
                        )}
                    </div>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                        {metadata.navigationHistory.map((screen, index) => (
                            <div key={`${screen}-${index}`} className="flex items-center gap-2">
                                {index === metadata.currentHistoryIndex && (
                                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                                )}
                                {index !== metadata.currentHistoryIndex && (
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                                )}
                                <span className={`text-xs ${index === metadata.currentHistoryIndex
                                    ? 'text-orange-300 font-medium'
                                    : 'text-gray-400'
                                    }`}>
                                    {index + 1}.
                                </span>
                                <span className={`${index === metadata.currentHistoryIndex
                                    ? 'text-white font-medium'
                                    : 'text-gray-400'
                                    }`}>
                                    {screen}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Default Screen Info */}
            {metadata.defaultScreen && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-300">Default Screen:</span>
                    <span className="text-white font-medium">{metadata.defaultScreen}</span>
                </div>
            )}

            {/* Total Routes */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                <span className="text-gray-400 text-xs">Total Views</span>
                <span className="text-white font-medium text-sm">{metadata.totalRoutes}</span>
            </div>
        </div>
    );
}