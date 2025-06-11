interface Tab {
    id: string;
    name: string;
    icon: string;
}

const tabs: Tab[] = [
    { id: 'layout', name: 'Layout', icon: '📐' },
    { id: 'forms', name: 'Forms', icon: '📝' },
    { id: 'interactive', name: 'Interactive', icon: '🔘' },
    { id: 'display', name: 'Display', icon: '📊' },
    { id: 'mobile', name: 'Mobile', icon: '📱' },
];

/**
 * Tab navigation component for switching between example categories
 */
export function ExampleTabs({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
    return (
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${activeTab === tab.id
                        ? 'bg-slate-700 text-blue-400 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.name}</span>
                </button>
            ))}
        </div>
    );
}

export default ExampleTabs;
