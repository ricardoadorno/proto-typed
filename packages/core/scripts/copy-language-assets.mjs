import { cp, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const source = join(__dirname, '..', 'src', 'language', 'grammar')
const destination = join(__dirname, '..', 'dist', 'language', 'grammar')

async function main() {
  await mkdir(destination, { recursive: true })
  await cp(source, destination, { recursive: true })
  console.log(`Copied language grammar assets to ${destination}`)
}

main().catch((error) => {
  console.error('[language] Failed to copy grammar assets:', error)
  process.exit(1)
})
