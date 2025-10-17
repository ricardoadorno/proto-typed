import fs from 'fs'
import path from 'path'

import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

import DslExample from '@/components/docs/dsl-example'
import { DocHeadingProvider } from '@/components/docs/doc-heading'
import DocsBreadcrumbs from '@/components/docs/docs-breadcrumbs'
import DocsPager from '@/components/docs/docs-pager'
import { DocsToc } from '@/components/docs/docs-toc'
import { mdxComponents } from '@/components/docs/mdx-components'
import docSections, { flatDocs, findDocBySlug, type DocItem } from '@/utils/toc'
import { slugify } from '@/utils/slugify'

type Props = { params: { slug: string } }

type Heading = {
    level: 1 | 2 | 3
    title: string
    slug: string
}

export async function generateStaticParams() {
    return flatDocs.map((doc) => ({
        slug: doc.slug,
    }))
}

function extractHeadings(markdown: string): Heading[] {
    const headings: Heading[] = []
    const lines = markdown.split('\n')
    const slugCounts = new Map<string, number>()
    let inCodeBlock = false

    for (const rawLine of lines) {
        const line = rawLine.trimEnd()

        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock
            continue
        }

        if (inCodeBlock) {
            continue
        }

        const match = /^(#{1,3})\s+(.*)$/.exec(line)
        if (!match) {
            continue
        }

        const [, hashes, content] = match
        const level = hashes.length as 1 | 2 | 3
        if (level > 3) {
            continue
        }

        const text = content.replace(/[`*_]/g, '').trim()
        const baseSlug = slugify(text)
        const count = slugCounts.get(baseSlug) ?? 0
        const uniqueSlug = count > 0 ? `${baseSlug}-${count}` : baseSlug
        slugCounts.set(baseSlug, count + 1)

        headings.push({
            level,
            title: text,
            slug: uniqueSlug,
        })
    }

    return headings
}

function getPager(slug: string): { prev: DocItem | null; next: DocItem | null } {
    const index = flatDocs.findIndex((doc) => doc.slug === slug)
    if (index === -1) {
        return { prev: null, next: null }
    }

    const prev = index > 0 ? flatDocs[index - 1] : null
    const next = index < flatDocs.length - 1 ? flatDocs[index + 1] : null
    return { prev, next }
}

export default async function PostPage({ params }: Props) {
    const { slug } = params
    const filePath = path.join(process.cwd(), 'src/docs', `${slug}.mdx`)
    const source = fs.readFileSync(filePath, 'utf8')

    const { content } = await compileMDX({
        source,
        components: {
            DslExample,
            ...mdxComponents,
        },
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
            },
        },
    })

    const headings = extractHeadings(source)
    const pageTitle =
        headings.find((heading) => heading.level === 1)?.title ??
        findDocBySlug(slug)?.title ??
        'Documentação'

    const tocItems = headings
        .filter((heading) => heading.level === 2 || heading.level === 3)
        .map((heading) => ({
            slug: heading.slug,
            title: heading.title,
            level: heading.level as 2 | 3,
        }))

    const { prev, next } = getPager(slug)

    const section = docSections.find((sectionItem) =>
        sectionItem.items.some((item) => item.slug === slug)
    )

    const breadcrumbs = [
        { label: 'Docs', href: '/docs/getting-started' },
        ...(section ? [{ label: section.title }] : []),
        { label: pageTitle },
    ]

    return (
        <div className="flex flex-col gap-8">
            <DocsBreadcrumbs trail={breadcrumbs} />
            <div className="grid gap-10 xl:grid-cols-[minmax(0,760px)_260px] xl:items-start">
                <article className="flex w-full max-w-[760px] flex-col gap-12">
                    <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface)] px-6 py-10 shadow-[0_1px_12px_rgba(0,0,0,0.22)] sm:px-9">
                        <DocHeadingProvider>
                            <div className="docs-prose">{content}</div>
                        </DocHeadingProvider>
                    </div>
                    <DocsPager prev={prev} next={next} />
                </article>
                <div className="xl:self-start">
                    <DocsToc items={tocItems} />
                </div>
            </div>
        </div>
    )
}
