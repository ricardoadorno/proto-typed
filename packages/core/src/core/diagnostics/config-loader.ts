/**
 * Configuration File Loader for .proto-typed.json
 *
 * Loads and caches lint configuration from:
 * 1. Project root (.proto-typed.json)
 * 2. User home directory (~/.proto-typed.json) [future]
 * 3. CLI flags/environment variables [future]
 *
 * Inspired by ESLint, TypeScript, and Prettier configuration patterns.
 *
 * @example .proto-typed.json
 * ```json
 * {
 *   "lint": {
 *     "rules": {
 *       "PT-LINT-2001": "warn",
 *       "PT-LINT-2002": "off",
 *       "PT-LINT-1001": "error"
 *     }
 *   }
 * }
 * ```
 */

// Browser-safe imports - these will be undefined in browser environments
let fs: any
let path: any

try {
  // Only available in Node.js
  if (typeof require !== 'undefined') {
    fs = require('fs')
    path = require('path')
  }
} catch {
  // Browser environment - fs and path will be undefined
}

import type { LintConfig } from './lint-config'
import { DEFAULT_LINT_CONFIG, validateLintConfig, mergeLintConfigs } from './lint-config'

/**
 * Full project configuration schema
 * Phase 3 focuses on `lint` section
 * Future phases may add: formatter, language server, build options, etc.
 */
export interface ProtoTypedConfig {
  /**
   * Lint configuration (Phase 3)
   */
  lint?: LintConfig

  /**
   * Formatter configuration (Future)
   */
  formatter?: unknown

  /**
   * Language server configuration (Future)
   */
  lsp?: unknown

  /**
   * Build configuration (Future)
   */
  build?: unknown
}

/**
 * Configuration file names to search for
 * Supports multiple formats for flexibility
 */
const CONFIG_FILE_NAMES = [
  '.proto-typed.json',
  '.proto-typedrc.json',
  '.proto-typedrc',
  'proto-typed.config.json'
]

/**
 * Cache for loaded configurations
 * Key: absolute file path
 * Value: parsed configuration
 */
const configCache = new Map<string, ProtoTypedConfig>()

/**
 * Finds configuration file in project directory or parents
 *
 * Searches upward from startDir until config file is found or root is reached.
 * This allows monorepos to have config at any level.
 *
 * @param startDir - Directory to start searching from (usually project root)
 * @returns Absolute path to config file or null if not found
 */
export function findConfigFile(startDir: string): string | null {
  // Return null in browser environments
  if (!fs || !path) {
    return null
  }

  let currentDir = path.resolve(startDir)
  const root = path.parse(currentDir).root

  while (currentDir !== root) {
    // Try each config file name
    for (const fileName of CONFIG_FILE_NAMES) {
      const configPath = path.join(currentDir, fileName)
      if (fs.existsSync(configPath)) {
        return configPath
      }
    }

    // Move up one directory
    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir) {
      break  // Reached root
    }
    currentDir = parentDir
  }

  return null
}

/**
 * Loads and parses configuration file
 *
 * @param configPath - Absolute path to config file
 * @returns Parsed configuration or null if invalid
 */
export function loadConfigFile(configPath: string): ProtoTypedConfig | null {
  // Return null in browser environments
  if (!fs) {
    return null
  }

  try {
    // Check cache first
    if (configCache.has(configPath)) {
      return configCache.get(configPath)!
    }

    // Read and parse file
    const content = fs.readFileSync(configPath, 'utf-8')
    const config: ProtoTypedConfig = JSON.parse(content)

    // Validate lint config if present
    if (config.lint) {
      const errors = validateLintConfig(config.lint)
      if (errors.length > 0) {
        console.error(`[proto-typed] Invalid configuration in ${configPath}:`)
        errors.forEach(err => console.error(`  - ${err}`))
        return null
      }
    }

    // Cache and return
    configCache.set(configPath, config)
    return config

  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`[proto-typed] Invalid JSON in ${configPath}:`, error.message)
    } else {
      console.error(`[proto-typed] Error loading config ${configPath}:`, error)
    }
    return null
  }
}

/**
 * Loads lint configuration for a project
 *
 * Search order:
 * 1. Project directory config file
 * 2. Parent directory config files (monorepo support)
 * 3. Default config if none found
 *
 * @param projectRoot - Project root directory (default: process.cwd())
 * @returns Lint configuration (never null, returns default if not found)
 */
export function loadLintConfig(projectRoot?: string): LintConfig {
  const startDir = projectRoot || process.cwd()

  // Find config file
  const configPath = findConfigFile(startDir)
  if (!configPath) {
    return DEFAULT_LINT_CONFIG
  }

  // Load and extract lint config
  const config = loadConfigFile(configPath)
  if (!config || !config.lint) {
    return DEFAULT_LINT_CONFIG
  }

  return config.lint
}

/**
 * Loads and merges multiple configurations
 *
 * Useful for:
 * - Merging project config with user config
 * - Merging base config with override config
 * - Applying CLI flags on top of file config
 *
 * @param configs - Array of config objects (later = higher precedence)
 * @returns Merged configuration
 *
 * @example
 * ```typescript
 * const projectConfig = loadLintConfig('/project')
 * const userConfig = loadLintConfig(os.homedir())
 * const cliConfig = { rules: { 'PT-LINT-2001': 'off' } }
 *
 * const final = mergeConfigs(projectConfig, userConfig, cliConfig)
 * ```
 */
export function mergeConfigs(...configs: LintConfig[]): LintConfig {
  return mergeLintConfigs(...configs)
}

/**
 * Clears the configuration cache
 * Useful for testing or when config files change
 */
export function clearConfigCache(): void {
  configCache.clear()
}

/**
 * Watches a config file for changes and invalidates cache
 * Returns an unwatch function
 *
 * @param configPath - Path to config file to watch
 * @param callback - Called when config changes
 * @returns Function to stop watching
 */
export function watchConfigFile(
  configPath: string,
  callback?: (config: ProtoTypedConfig | null) => void
): () => void {
  // Return no-op function in browser environments
  if (!fs) {
    return () => {}
  }

  const watcher = fs.watch(configPath, (eventType: string) => {
    if (eventType === 'change') {
      // Invalidate cache
      configCache.delete(configPath)

      // Reload and notify
      if (callback) {
        const newConfig = loadConfigFile(configPath)
        callback(newConfig)
      }
    }
  })

  return () => watcher.close()
}

/**
 * Creates a default .proto-typed.json file in project root
 *
 * @param projectRoot - Project directory
 * @param config - Configuration to write (default: basic template)
 */
export function createDefaultConfigFile(
  projectRoot: string,
  config?: ProtoTypedConfig
): void {
  // No-op in browser environments
  if (!fs || !path) {
    return
  }

  const defaultConfig: ProtoTypedConfig = config || {
    lint: {
      rules: {
        // Example: customize severity for common rules
        'PT-LINT-2001': 'warn',    // Unused views
        'PT-LINT-2002': 'warn',    // Unused components
        // Add more rule overrides as needed
      }
    }
  }

  const configPath = path.join(projectRoot, '.proto-typed.json')
  const content = JSON.stringify(defaultConfig, null, 2)

  fs.writeFileSync(configPath, content, 'utf-8')
  console.log(`[proto-typed] Created config file: ${configPath}`)
}
