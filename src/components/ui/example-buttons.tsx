interface Example {
    label: string;
    code: string;
}

interface ExampleButtonsProps {
    examples: Example[];
    onExampleSelect: (code: string) => void;
}

export function ExampleButtons({ examples, onExampleSelect }: ExampleButtonsProps) {
    return (
        <div className="mb-4 flex flex-wrap gap-2">
            {examples.map((example, index) => (
                <button
                    key={index}
                    onClick={() => onExampleSelect(example.code)}
                    className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-raised)] px-3 py-2 text-sm font-medium text-[var(--fg-secondary)] transition-all hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.12)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
                >
                    {example.label}
                </button>
            ))}
        </div>
    );
}
