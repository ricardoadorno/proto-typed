interface AppHeaderProps {
    title?: string;
    description?: string;
}

export function AppHeader({
    title = "proto-typedd",
    description = "Create interactive prototypes with our powerful DSL"
}: AppHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {title}
                </h1>
                {description && (
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
        </div>
    );
}
