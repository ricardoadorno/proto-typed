/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx'

const repo = 'proto-typed'
const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? `/${repo}` : ''
const assetPrefix = basePath ? `${basePath}/` : undefined

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  output: 'export',
  basePath,
  assetPrefix,
  images: {
    unoptimized: true, // Necessário para export estático
  },
  trailingSlash: true, // Garante URLs /rota/ compatíveis com GitHub Pages
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
