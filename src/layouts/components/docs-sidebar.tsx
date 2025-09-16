import { Link, useLocation } from "react-router-dom";
import toc from "../../docs/toc";

export function DocsSidebar() {
    const location = useLocation();
    const currentPath = location.pathname;
    const isActive = (path: string) => currentPath === path;

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 border-b border-gray-700 pb-2">Documentation</h3>
            <div className="space-y-6">
                {toc.sections.map((section) => (
                    <div key={section.id}>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">{section.label}</h4>
                        <ul className="space-y-2">
                            {section.items.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`text-sm transition-colors ${isActive(item.path) ? "text-blue-400" : "hover:text-blue-400"}`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DocsSidebar;
