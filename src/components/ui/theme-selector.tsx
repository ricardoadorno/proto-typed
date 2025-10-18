import { availableThemes } from '../../core/themes/theme-definitions';

interface ThemeSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const themeOptions = Object.keys(availableThemes).map(themeName => ({
    value: themeName,
    label: `${themeName.charAt(0).toUpperCase()}${themeName.slice(1)}`
}));

export function ThemeSelector({
    value,
    onChange
}: ThemeSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
                Theme
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--fg-primary)] shadow-sm transition-all focus-visible:border-[var(--brand-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
            >
                {themeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
