interface Tab {
  id: string
  name: string
  icon: string
}

const tabs: Tab[] = [
  { id: 'layout', name: 'Layout', icon: '📐' },
  { id: 'forms', name: 'Forms', icon: '📝' },
  { id: 'interactive', name: 'Interactive', icon: '🔘' },
  { id: 'display', name: 'Display', icon: '📊' },
  { id: 'mobile', name: 'Mobile', icon: '📱' },
]

/**
 * Tab navigation component for switching between example categories
 */
export function ExampleTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl bg-[var(--bg-raised)] p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'border border-[var(--brand-400)] bg-[color:rgba(139,92,246,0.18)] text-[var(--fg-primary)] shadow-[0_12px_32px_rgba(124,58,237,0.28)]'
              : 'border border-transparent text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.12)] hover:text-[var(--accent)]'
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          <span>{tab.name}</span>
        </button>
      ))}
    </div>
  )
}

export default ExampleTabs
