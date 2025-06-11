
interface SyntaxTipsProps {
    activeTab: string;
}

/**
 * Syntax tips component showing helpful information for each category
 */
export function SyntaxTips({ activeTab }: SyntaxTipsProps) {
    const tips = {
        layout: [
            { label: 'Nested Elements', description: 'All layout elements can contain other elements using indentation' },
            { label: 'Containers', description: 'Use container:, card:, section: for grouping content' },
            { label: 'Grid System', description: 'Use row: and col: for responsive grid layouts' },
            { label: 'Lists', description: 'Use list: with - item syntax for simple lists or advanced syntax for rich items' },
            { label: 'Separators', description: 'Use --- for visual breaks and -- for spacing' }
        ],
        forms: [
            { label: 'Input Types', description: 'Use ___*: for password, ___-: for disabled fields' },
            { label: 'Checkbox Syntax', description: 'Use [X] for checked and [ ] for unchecked state' },
            { label: 'Radio Syntax', description: 'Use (X) for selected and ( ) for unselected state' },
            { label: 'Select Options', description: 'Use pipe-separated values: [Option1 | Option2 | Option3]' },
            { label: 'Labels & Placeholders', description: 'Format: ___:Label{Placeholder text}' }
        ],
        interactive: [
            { label: 'Button Syntax', description: '@[Text](action) where action is optional' },
            { label: 'Button Variants', description: 'Use @+, @-, @_, @=, @! for different button styles' },
            { label: 'Link Syntax', description: '#[Text](destination) for navigation' },
            { label: 'Image Syntax', description: '![Alt Text](image-url) similar to Markdown' },
            { label: 'Actions', description: 'Use screen names for internal navigation' }
        ],
        display: [
            { label: 'Heading Levels', description: 'Use # to ###### for h1-h6 headings' },
            { label: 'Text Styles', description: '> for paragraphs, *> for notes, "> for quotes' },
            { label: 'Lists', description: 'Use 1. for ordered lists, - for unordered lists' },
            { label: 'Separators', description: 'Use --- for visual breaks and -- for spacing' }
        ],
        mobile: [
            { label: 'Header', description: 'Use header: for fixed top navigation' },
            { label: 'Navigator', description: 'Use navigator: with - [label]{icon}(action) items' },
            { label: 'Drawer', description: 'Use drawer Name: with - [label]{icon}(action) items' },
            { label: 'FAB', description: 'Use fab {icon} for floating action buttons' },
            { label: 'Icons', description: 'Use emoji or text within curly braces: {🏠}' }
        ]
    };

    const currentTips = tips[activeTab as keyof typeof tips] || [];

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Syntax Tips</h3>
            </div>

            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                {currentTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <div>
                            <strong>{tip.label}:</strong> {tip.description}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SyntaxTips;
