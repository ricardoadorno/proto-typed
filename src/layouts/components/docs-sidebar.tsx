import { Link, useLocation } from "react-router-dom";

export function DocsSidebar() {
    const location = useLocation();
    const currentPath = location.pathname;
    const isActive = (path: string) => currentPath === path;

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 border-b border-gray-700 pb-2">Documentation</h3>

            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Getting Started</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/docs" className={`text-sm transition-colors ${isActive("/docs") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Introduction
                            </Link>
                        </li>
                        <li>
                            <Link to="/docs/syntax" className={`text-sm transition-colors ${isActive("/docs/syntax") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Basic Syntax
                            </Link>
                        </li>
                        <li>
                            <Link to="/docs/screens" className={`text-sm transition-colors ${isActive("/docs/screens") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Working with Screens
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Components</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/docs/typography" className={`text-sm transition-colors ${isActive("/docs/typography") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Typography
                            </Link>
                        </li>
                        <li>
                            <Link to="/docs/forms" className={`text-sm transition-colors ${isActive("/docs/forms") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Form Elements
                            </Link>
                        </li>
                        <li>
                            <Link to="/docs/interactive" className={`text-sm transition-colors ${isActive("/docs/interactive") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Interactive Elements
                            </Link>
                        </li>
                        <li>
                            <Link to="/docs/layout" className={`text-sm transition-colors ${isActive("/docs/layout") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Layout Components
                            </Link>
                        </li>
                        <li>
                            <Link to="/docs/lists" className={`text-sm transition-colors ${isActive("/docs/lists") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Lists & Data Display
                            </Link>
                        </li>
                        <li>
                            <Link to="/docs/mobile" className={`text-sm transition-colors ${isActive("/docs/mobile") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Mobile Components
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Advanced</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/docs/components" className={`text-sm transition-colors ${isActive("/docs/components") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Reusable Components
                            </Link>
                        </li>
                        <li>
                            <Link to="/docs/modals" className={`text-sm transition-colors ${isActive("/docs/modals") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Modals & Drawers
                            </Link>
                        </li>
                        <li>
                            <Link to="/docs/navigation" className={`text-sm transition-colors ${isActive("/docs/navigation") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Navigation & Routing
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Resources</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/docs/troubleshooting" className={`text-sm transition-colors ${isActive("/docs/troubleshooting") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Troubleshooting
                            </Link>
                        </li>
                        <li>
                            <Link to="/docs/known-issues" className={`text-sm transition-colors ${isActive("/docs/known-issues") ? "text-blue-400" : "hover:text-blue-400"}`}>
                                Known Issues
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default DocsSidebar;
