/**
 * Compile tests and rename to .cjs to avoid ESM/CommonJS conflict
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import { readdir, rename } from 'fs/promises'
import { join } from 'path'

const execPromise = promisify(exec)

async function renameJsToCjs(dir) {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      await renameJsToCjs(fullPath)
    } else if (entry.name.endsWith('.js')) {
      const newPath = fullPath.replace(/\.js$/, '.cjs')
      await rename(fullPath, newPath)
      console.log(`  ✓ ${entry.name} -> ${entry.name.replace('.js', '.cjs')}`)
    }
  }
}

async function main() {
  console.log('📦 Compiling tests...')

  try {
    // Compile TypeScript
    await execPromise('pnpm exec tsc -p ./tests/tsconfig.json')
    console.log('✅ TypeScript compilation complete')

    console.log('\n📝 Renaming .js to .cjs...')
    await renameJsToCjs('./dist/tests')
    console.log('✅ All files renamed to .cjs\n')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
