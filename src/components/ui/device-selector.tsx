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
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Preview Device
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
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
