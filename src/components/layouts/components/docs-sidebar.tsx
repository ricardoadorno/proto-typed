'use client'

import { usePathname } from 'next/navigation'
import { withBaseUrl } from '@/utils/with-base-url'

interface Doc {
    slug: string
    title: string
}

export default function DocsSidebar({ docs }: { docs: Doc[] }) {
    const pathname = usePathname()

    const isActive = (slug: string) =>
        pathname === `/docs/${slug}` || pathname === `/docs/${slug}/`

    return (
        <nav className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
                Documentation
            </h3>

            <ul className="space-y-2">
                {docs.map((doc) => (
                    <li key={doc.slug}>
                        <a
                            href={withBaseUrl(`/docs/${doc.slug}`)}
                            className={`block text-sm px-3 py-2 rounded-md transition-colors ${isActive(doc.slug)
                                ? 'bg-gray-700 text-blue-400'
                                : 'text-gray-300 hover:text-blue-400 hover:bg-gray-700/40'
                                }`}
                        >
                            {doc.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
