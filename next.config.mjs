/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'proto-typed';

import createMDX from "@next/mdx";

const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  output: 'export',
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  images: {
    unoptimized: true, // Necessário para export estático
  },
  trailingSlash: true, // Garante URLs /rota/ compatíveis com GitHub Pages
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
})
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)
