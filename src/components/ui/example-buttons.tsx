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
        <div className="flex flex-wrap gap-2 mb-4">
            {examples.map((example, index) => (
                <button
                    key={index}
                    onClick={() => onExampleSelect(example.code)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 text-sm font-medium"
                >
                    {example.label}
                </button>
            ))}
        </div>
    );
}
