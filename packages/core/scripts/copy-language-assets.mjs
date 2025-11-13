import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sourceDir = path.join(__dirname, '../src/language/grammar')
const targetDir = path.join(__dirname, '../dist/language/grammar')

async function copyAssets() {
  try {
    await fs.mkdir(targetDir, { recursive: true })

    const files = ['proto-typed.tmLanguage.json', 'language-configuration.json']

    for (const file of files) {
      const source = path.join(sourceDir, file)
      const target = path.join(targetDir, file)

      try {
        await fs.copyFile(source, target)
        console.log(`✓ Copied ${file}`)
      } catch (err) {
        console.warn(`⚠ Could not copy ${file}:`, err.message)
      }
    }
  } catch (err) {
    console.error('Error copying language assets:', err)
    process.exit(1)
  }
}

copyAssets()
