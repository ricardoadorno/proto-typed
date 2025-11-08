import * as path from 'path'
import Mocha from 'mocha'
import { glob } from 'glob'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 60000,
  })

  const testsRoot = path.resolve(__dirname, '..')

  const files = await glob('**/**.test.js', { cwd: testsRoot })

  console.log(`Found ${files.length} test files in ${testsRoot}`)
  files.forEach((f) => console.log(`  - ${f}`))

  return new Promise((resolve, reject) => {
    files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)))

    try {
      mocha.run((failures) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`))
        } else {
          resolve()
        }
      })
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}
