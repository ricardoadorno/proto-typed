import * as fs from 'fs'
import * as path from 'path'
import { runTests } from '@vscode/test-electron'

const isWindows = process.platform === 'win32'

function wrapArg(value: string) {
  if (!isWindows) {
    return value
  }
  return `"${value}"`
}

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../')
    const extensionTestsPath = path.resolve(__dirname, './suite/index')
    const testWorkspace = path.resolve(extensionDevelopmentPath, 'test-workspace')
    const userDataDir = path.resolve(extensionDevelopmentPath, '.vscode-test', 'user-data')
    const extensionsDir = path.resolve(extensionDevelopmentPath, '.vscode-test', 'extensions')
    const cachedExecutable = findCachedVSCodeExecutable(
      path.resolve(extensionDevelopmentPath, '.vscode-test')
    )

    console.log(
      'Launching VS Code tests with options:',
      JSON.stringify(
        {
          extensionDevelopmentPath,
          extensionTestsPath,
          testWorkspace,
          userDataDir,
          extensionsDir,
          hasCachedExecutable: Boolean(cachedExecutable),
        },
        null,
        2
      )
    )

    const baseOptions = {
      extensionDevelopmentPath: wrapArg(extensionDevelopmentPath),
      extensionTestsPath: wrapArg(extensionTestsPath),
      launchArgs: [
        wrapArg(testWorkspace),
        '--disable-extensions',
        `--user-data-dir=${wrapArg(userDataDir)}`,
        `--extensions-dir=${wrapArg(extensionsDir)}`,
      ],
    }

    try {
      await runTests(baseOptions)
    } catch (primaryError) {
      if (!cachedExecutable) {
        throw primaryError
      }

      console.warn(
        'Primary VS Code download failed. Falling back to cached executable at:',
        cachedExecutable
      )

      await runTests({
        ...baseOptions,
        vscodeExecutablePath: cachedExecutable,
        reuseMachineInstall: true,
      })
    }
  } catch (error) {
    console.error('Failed to run VS Code extension tests')
    if (error) {
      console.error(error)
    }
    process.exit(1)
  }
}

main()

function findCachedVSCodeExecutable(testRoot: string) {
  try {
    if (!fs.existsSync(testRoot)) {
      return undefined
    }

    const entries = fs
      .readdirSync(testRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => priorityForDir(a.name) - priorityForDir(b.name))

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue
      }

      const candidateRoot = path.join(testRoot, entry.name)
      const executable = resolveExecutable(candidateRoot)
      if (executable) {
        return executable
      }
    }
  } catch (error) {
    console.warn('Unable to detect cached VS Code executable:', error)
  }

  return undefined
}

function resolveExecutable(candidateRoot: string) {
  const joinPath = (segments: string[]) =>
    segments.length === 1
      ? path.join(candidateRoot, segments[0])
      : path.join(candidateRoot, ...segments)

  const candidates: string[][] = [
    ['Code.exe'],
    ['Visual Studio Code.app', 'Contents', 'MacOS', 'Electron'],
    ['code'],
    ['bin', 'code'],
  ]

  for (const segments of candidates) {
    const executablePath = joinPath(segments)
    if (fs.existsSync(executablePath)) {
      return executablePath
    }
  }

  return undefined
}

function priorityForDir(name: string) {
  if (name.includes('win32')) {
    return 0
  }
  if (name.includes('darwin')) {
    return 1
  }
  if (name.includes('linux')) {
    return 2
  }
  return 3
}
