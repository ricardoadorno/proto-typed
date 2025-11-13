import { mkdir, cp } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const extensionRoot = join(__dirname, '..')
const coreRoot = join(extensionRoot, '..', 'core')
const sourceDir = join(coreRoot, 'src', 'language', 'grammar')
const targetDir = join(extensionRoot, 'syntaxes')

async function main() {
  await mkdir(targetDir, { recursive: true })
  await cp(
    join(sourceDir, 'language-configuration.json'),
    join(targetDir, 'language-configuration.json')
  )
  await cp(
    join(sourceDir, 'proto-typed.tmLanguage.json'),
    join(targetDir, 'proto-typed.tmLanguage.json')
  )
  console.log('[proto-typed] Synced grammar assets to extension/syntaxes')
}

main().catch((error) => {
  console.error('[proto-typed] Failed to sync grammar assets:', error)
  process.exit(1)
})
