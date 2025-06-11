import { Example } from '../types';

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
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedExample === index
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                >
                    {example.name}
                </button>
            ))}
        </div>
    );
}

export default ExampleSelector;
