interface DeviceSelectorProps {
    value: string;
    onChange: (value: string) => void;
    options?: { value: string; label: string }[];
}

const defaultOptions = [
    { value: "iphone-x", label: "📱 iPhone X" },
    { value: "browser-mockup with-url", label: "🖥️ Desktop Browser" }
];

export function DeviceSelector({
    value,
    onChange,
    options = defaultOptions
}: DeviceSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
                Preview Device
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--fg-primary)] shadow-sm transition-all focus-visible:border-[var(--brand-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
