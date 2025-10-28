import * as fs from 'fs'
import * as path from 'path'
import Mocha from 'mocha'

export async function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'bdd',
    color: true,
    timeout: 20_000,
  })

  const testsRoot = path.resolve(__dirname, '.')
  const files = gatherTestFiles(testsRoot)

  for (const file of files) {
    mocha.addFile(file)
  }

  await new Promise<void>((resolve, reject) => {
    mocha.run((failures) => {
      if (failures > 0) {
        reject(new Error(`${failures} test(s) failed.`))
        return
      }
      resolve()
    })
  })
}

function gatherTestFiles(root: string): string[] {
  const stack = [root]
  const files: string[] = []

  while (stack.length) {
    const current = stack.pop()
    if (!current) {
      continue
    }

    const dirEntries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of dirEntries) {
      const entryPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(entryPath)
        continue
      }

      if (entry.isFile() && entry.name.endsWith('.test.js')) {
        files.push(entryPath)
      }
    }
  }

  return files
}
