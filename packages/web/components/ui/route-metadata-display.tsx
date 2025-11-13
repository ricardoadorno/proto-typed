import { RouteMetadata } from '../../types/routing';

interface RouteMetadataDisplayProps {
    metadata: RouteMetadata | null;
    onNavigateToScreen?: (screenName: string) => void;
}

export function RouteMetadataDisplay({ metadata, onNavigateToScreen }: RouteMetadataDisplayProps) {
    if (!metadata) return null;

    return (
        <div className="mt-4 space-y-4 text-sm text-[var(--fg-secondary)]">
            {/* Current Screen */}
            {metadata.currentScreen && (
                <div className="flex items-center gap-2">
                    <span className="text-[var(--brand-400)]">●</span>
                    <span className="text-[var(--fg-secondary)]">Current:</span>
                    <span className="text-[var(--fg-primary)] font-medium">{metadata.currentScreen}</span>
                </div>
            )}

            {/* Routes Summary */}
            <div className="space-y-3 text-xs">
                {/* Screens - Full Width */}
                <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)]/70 p-3">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[var(--info)]"></span>
                        <span className="text-[var(--fg-primary)] font-medium">
                            Screens ({metadata.screens.length})
                        </span>
                    </div>
                    <div className="space-y-1">
                        {metadata.screens.map((screen) => (
                            <div key={screen.id} className="flex items-center gap-2">
                                {metadata.currentScreen === screen.name && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-400)]" />
                                )}
                                {screen.isDefault && <span className="h-1.5 w-1.5 rounded-full bg-[var(--warning)]" />}
                                <span
                                    className={`transition-colors ${metadata.currentScreen === screen.name
                                            ? "text-[var(--fg-primary)] font-medium"
                                            : "text-[var(--fg-secondary)]"
                                        } ${onNavigateToScreen ? "cursor-pointer hover:text-[var(--accent)]" : ""}`}
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
                    <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)]/70 p-3">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[var(--brand-400)]"></span>
                            <span className="text-[var(--fg-primary)] font-medium">
                                Overlays ({metadata.modals.length + metadata.drawers.length})
                            </span>
                        </div>
                        {metadata.modals.length + metadata.drawers.length > 0 ? (
                            <div className="space-y-1">
                                {metadata.modals.map((modal) => (
                                    <div key={modal.id} className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-400)]"></span>
                                        <span className="text-[var(--fg-secondary)] text-xs">modal</span>
                                        <span className="text-[var(--fg-primary)]">{modal.name}</span>
                                    </div>
                                ))}
                                {metadata.drawers.map((drawer) => (
                                    <div key={drawer.id} className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-300)]"></span>
                                        <span className="text-[var(--fg-secondary)] text-xs">drawer</span>
                                        <span className="text-[var(--fg-primary)]">{drawer.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-[color:rgba(169,175,191,0.6)]">No overlays</div>
                        )}
                    </div>

                    {/* Components */}
                    <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)]/70 p-3">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[var(--success)]"></span>
                            <span className="text-[var(--fg-primary)] font-medium">
                                Components ({metadata.components.length})
                            </span>
                        </div>
                        {metadata.components.length > 0 ? (
                            <div className="space-y-1">
                                {metadata.components.map((component) => (
                                    <div key={component.id} className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]"></span>
                                        <span className="text-[var(--fg-primary)]">{component.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-[color:rgba(169,175,191,0.6)]">No components</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation History */}
            {metadata.navigationHistory.length > 0 && (
                <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)]/70 p-3">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[var(--warning)]"></span>
                        <span className="text-[var(--fg-primary)] font-medium">
                            Navigation History ({metadata.navigationHistory.length})
                        </span>
                        {metadata.canNavigateBack && (
                            <span className="rounded px-2 py-0.5 text-xs text-[var(--warning)]">
                                Can go back
                            </span>
                        )}
                    </div>
                    <div className="max-h-24 space-y-1 overflow-y-auto">
                        {metadata.navigationHistory.map((screen, index) => (
                            <div key={`${screen}-${index}`} className="flex items-center gap-2">
                                {index === metadata.currentHistoryIndex && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--warning)]"></span>
                                )}
                                {index !== metadata.currentHistoryIndex && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[color:rgba(84,88,105,0.6)]"></span>
                                )}
                                <span
                                    className={`text-xs ${index === metadata.currentHistoryIndex
                                            ? "text-[var(--warning)] font-medium"
                                            : "text-[var(--fg-secondary)]"
                                        }`}
                                >
                                    {index + 1}.
                                </span>
                                <span
                                    className={`${index === metadata.currentHistoryIndex
                                            ? "text-[var(--fg-primary)] font-medium"
                                            : "text-[var(--fg-secondary)]"
                                        }`}
                                >
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
                    <span className="text-[var(--warning)]">★</span>
                    <span className="text-[var(--fg-secondary)]">Default Screen:</span>
                    <span className="text-[var(--fg-primary)] font-medium">{metadata.defaultScreen}</span>
                </div>
            )}

            {/* Total Routes */}
            <div className="flex items-center justify-between border-t border-[var(--border-muted)] pt-2">
                <span className="text-xs text-[var(--fg-secondary)]">Total Views</span>
                <span className="text-sm font-medium text-[var(--fg-primary)]">{metadata.totalRoutes}</span>
            </div>
        </div>
    );
}
