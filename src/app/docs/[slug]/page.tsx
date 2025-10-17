import fs from 'fs'
import path from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'
import DslExample from '@/components/docs/dsl-example'
import remarkGfm from 'remark-gfm'

type Props = { params: { slug: string } }

export async function generateStaticParams() {

    const dir = path.join(process.cwd(), 'src/docs')
    const files = fs.readdirSync(dir)
    return files.map((file) => ({
        slug: file.replace(/\.mdx$/, ''),
    }))
}

export default async function PostPage({ params }: Props) {
    const filePath = path.join(process.cwd(), 'src/docs', `${params.slug}.mdx`)
    const source = fs.readFileSync(filePath, 'utf8')
    const { content } = await compileMDX({
        source,
        components: {
            DslExample,
        },
        options: {
            mdxOptions: {
                remarkPlugins: [remarkGfm], // 👈 habilita sintaxe estilo GitHub
            },
        },
    })

    return (
        <article className="mx-auto max-w-4xl space-y-8">
            <section className="prose prose-invert max-w-none prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-300 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-gray-100 prose-code:text-gray-200 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-lg prose-pre:p-4 prose-pre:shadow-lg prose-li:marker:text-gray-500">
                <div>{content}</div>
            </section>
        </article>
    )
}
