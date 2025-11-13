import esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const extensionDir = join(__dirname, '..')

const isWatch = process.argv.includes('--watch')

const config = {
  entryPoints: [join(extensionDir, 'src/extension.ts')],
  bundle: true,
  outfile: join(extensionDir, 'dist/extension.js'),
  external: [
    'vscode', // VSCode API é fornecida pelo host
    // @proto-typed/core será bundado junto (resolve ES Module issues)
  ],
  format: 'cjs', // CommonJS para VSCode
  platform: 'node',
  sourcemap: true,
  minify: false, // Facilita debugging
  target: 'node16',
  logLevel: 'info',
}

console.log('🔨 Building extension...')
console.log(`📁 Entry: ${config.entryPoints[0]}`)
console.log(`📦 Output: ${config.outfile}`)
console.log(`🔍 Watch mode: ${isWatch ? 'enabled' : 'disabled'}`)

try {
  if (isWatch) {
    const ctx = await esbuild.context(config)
    await ctx.watch()
    console.log('👀 Watching for changes...')
  } else {
    await esbuild.build(config)
    console.log('✅ Extension built successfully')
  }
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}
