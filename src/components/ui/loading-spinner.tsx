interface LoadingSpinnerProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
};

export function LoadingSpinner({
    message = "Loading...",
    size = 'md'
}: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600`}></div>
            <span className="ml-2 text-slate-600 dark:text-slate-300">{message}</span>
        </div>
    );
}
