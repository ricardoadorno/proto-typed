import { Link, useLocation } from "react-router-dom";
import toc, { type TocContent } from "../../docs/toc";
import { marked } from "marked";

export default function Docs() {
    const { pathname } = useLocation();

    const contents: TocContent[] = toc.contents ?? [];
    const current = contents.find(p => p.path === pathname);

    if (current) {
        const html = current.content ? (marked.parse(current.content) as string) : undefined;
        return (
            <article className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-100">{current.title}</h1>
                {current.excerpt && (
                    <p className="text-gray-400 text-sm">{current.excerpt}</p>
                )}
                {html && (
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
                )}
            </article>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-100">Documentation</h1>
            <ul className="space-y-4">
                {contents.map((content) => (
                    <li key={content.path} className="border border-gray-700 rounded-md p-4 hover:border-gray-600 transition-colors">
                        <Link to={content.path} className="block">
                            <h2 className="text-lg font-semibold text-gray-100">{content.title}</h2>
                            {content.excerpt && (
                                <p className="text-gray-400 text-sm mt-1">{content.excerpt}</p>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
