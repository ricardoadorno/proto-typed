import { usePageContext } from "vike-react/usePageContext";
import toc, { type TocContent } from "../../docs/toc";
import { MDXProvider } from "@mdx-js/react";
import { withBase } from "../../utils";

export default function Docs() {
    const pageContext = usePageContext();
    const pathname = pageContext.urlPathname;

    const contents: TocContent[] = toc.contents ?? [];
    const current = contents.find(p => p.path === pathname);

    if (current) {
        const Mdx = current.MdxComponent;
        return (
            <article className="mx-auto max-w-4xl space-y-8">
                <header className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">{current.title}</h1>
                    {current.excerpt && (
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed">{current.excerpt}</p>
                    )}
                    <div className="border-t border-gray-800/80" />
                </header>

                {Mdx ? (
                    <section className="prose prose-invert max-w-none prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-300 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-gray-100 prose-code:text-gray-200 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-lg prose-li:marker:text-gray-500">
                        <MDXProvider>
                            <Mdx />
                        </MDXProvider>
                    </section>
                ) : null}
            </article>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">Documentation</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {contents.map((content) => (
                    <li
                        key={content.path}
                        className="group rounded-xl border border-gray-700/60 bg-gray-900/40 p-5 hover:border-gray-600 hover:bg-gray-900/60 transition-colors shadow-sm hover:shadow-md hover:shadow-black/20"
                    >
                        <a href={withBase(content.path)} className="block">
                            <h2 className="text-lg font-semibold text-gray-100 flex items-center justify-between">
                                <span>{content.title}</span>
                                <span className="text-gray-500 group-hover:text-gray-400 transition">→</span>
                            </h2>
                            {content.excerpt && (
                                <p className="text-gray-400 text-sm mt-2">{content.excerpt}</p>
                            )}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
