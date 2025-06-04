interface CurrentScreenIndicatorProps {
    screenName: string;
}

export function CurrentScreenIndicator({ screenName }: CurrentScreenIndicatorProps) {
    return (
        <div className="mb-4 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <span className="text-sm text-blue-700 dark:text-blue-300">
                Current Screen: <span className="font-medium">{screenName}</span>
            </span>
        </div>
    );
}
