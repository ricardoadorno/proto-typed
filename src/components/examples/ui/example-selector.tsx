import { Example } from '../types';
import { cn } from "@/lib/utils";

interface ExampleSelectorProps {
    examples: Example[];
    selectedExample: number;
    onExampleChange: (index: number) => void;
}

/**
 * Example selector component showing chips for each example in a category
 */
export function ExampleSelector({ examples, selectedExample, onExampleChange }: ExampleSelectorProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
                <button
                    key={index}
                    onClick={() => onExampleChange(index)}
                    className={cn(
                        "rounded-xl border px-3 py-2 text-sm font-medium transition-all",
                        selectedExample === index
                            ? "border-[var(--brand-400)] bg-[color:rgba(139,92,246,0.16)] text-[var(--fg-primary)] shadow-[0_12px_36px_rgba(124,58,237,0.32)]"
                            : "border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.12)] hover:text-[var(--accent)]"
                    )}
                >
                    {example.name}
                </button>
            ))}
        </div>
    );
}

export default ExampleSelector;
