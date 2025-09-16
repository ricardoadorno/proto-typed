import { Link, useLocation } from "react-router-dom";
import toc, { type TocPost } from "../../docs/toc";

export default function Docs() {
    const { pathname } = useLocation();

    const posts: TocPost[] = toc.posts ?? [];
    const current = posts.find(p => p.path === pathname);

    if (current) {
        return (
            <article className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-100">{current.title}</h1>
                {current.excerpt && (
                    <p className="text-gray-400 text-sm">{current.excerpt}</p>
                )}
                {current.content && (
                    <div className="text-gray-300 leading-relaxed whitespace-pre-line">{current.content}</div>
                )}
            </article>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-100">Documentation</h1>
            <ul className="space-y-4">
                {posts.map((post) => (
                    <li key={post.path} className="border border-gray-700 rounded-md p-4 hover:border-gray-600 transition-colors">
                        <Link to={post.path} className="block">
                            <h2 className="text-lg font-semibold text-gray-100">{post.title}</h2>
                            {post.excerpt && (
                                <p className="text-gray-400 text-sm mt-1">{post.excerpt}</p>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
