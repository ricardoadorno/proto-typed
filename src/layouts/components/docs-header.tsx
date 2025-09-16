import { Link, useLocation } from "react-router-dom";
import { AppHeader } from "../../components/ui";

export function DocsHeader() {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path: string) => {
        return currentPath === path ? "text-blue-400" : "text-gray-400 hover:text-blue-400";
    };

    return (
        <div className="mb-8">
            <AppHeader
                title="Proto-Typed Docs"
                description="Learn how to create interactive prototypes with our DSL"
            />
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-400">
                <Link to="/" className="hover:text-blue-400 transition-colors">
                    ← Back to Editor
                </Link>
                <Link to="/docs" className={`transition-colors ${isActive("/docs")}`}>
                    Overview
                </Link>
                <Link to="/docs/syntax" className={`transition-colors ${isActive("/docs/syntax")}`}>
                    Syntax Guide
                </Link>
                <Link to="/docs/examples" className={`transition-colors ${isActive("/docs/examples")}`}>
                    Examples
                </Link>
                <Link to="/docs/troubleshooting" className={`transition-colors ${isActive("/docs/troubleshooting")}`}>
                    Troubleshooting
                </Link>
            </div>
        </div>
    );
}

export default DocsHeader;
