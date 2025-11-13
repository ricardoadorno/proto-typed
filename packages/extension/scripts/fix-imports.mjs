/**
 * Fix ESM imports - add .js extension to all relative imports
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

async function fixImportsInFile(filePath) {
  let content = await readFile(filePath, 'utf-8')
  let modified = false

  // Fix imports with single quotes: from './path' -> from './path.js'
  content = content.replace(
    /from\s+['"](\.\.[\/\\][^'"]+|\.\/[^'"]+)['"]/g,
    (match, path) => {
      if (path.endsWith('.js') || path.endsWith('.json')) {
        return match // Already has extension
      }
      modified = true
      return `from '${path}.js'`
    }
  )

  if (modified) {
    await writeFile(filePath, content, 'utf-8')
    return true
  }
  return false
}

async function fixImportsInDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  let count = 0

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory() && entry.name !== 'node_modules') {
      count += await fixImportsInDir(fullPath)
    } else if (entry.name.endsWith('.ts')) {
      const fixed = await fixImportsInFile(fullPath)
      if (fixed) {
        console.log(`  ✓ Fixed: ${entry.name}`)
        count++
      }
    }
  }

  return count
}

async function main() {
  console.log('🔧 Fixing ESM imports...\n')

  const count = await fixImportsInDir('./src')

  console.log(`\n✅ Fixed ${count} file(s)`)
}

main().catch(console.error)
