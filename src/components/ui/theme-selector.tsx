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
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Theme
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-white"
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