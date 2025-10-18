import { withPublicUrl } from '@/utils/with-base-url';

interface AppHeaderProps {
    title?: string;
    description?: string;
}

export function AppHeader({
    title = "proto-typed",
    description = "Create interactive prototypes with our powerful DSL"
}: AppHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="bg-[linear-gradient(135deg,#7c3aed_0%,#22d3ee_100%)] bg-clip-text text-3xl font-bold text-transparent">
                    <img src={withPublicUrl("/logo.svg")} alt="Logo" className="mr-2 -mt-1 inline h-8 w-8" />
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 text-sm text-[var(--fg-secondary)]">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[var(--danger)]"></div>
                <div className="h-3 w-3 rounded-full bg-[var(--warning)]"></div>
                <div className="h-3 w-3 rounded-full bg-[var(--brand-400)]"></div>
            </div>
        </div>
    );
}
