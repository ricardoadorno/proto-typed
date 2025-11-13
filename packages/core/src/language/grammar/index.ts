import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = typeof __filename !== 'undefined'
  ? dirname(__filename)
  : dirname(fileURLToPath(import.meta.url))

export type TextMateGrammar = any
export type LanguageConfiguration = any

export function getTextMateGrammar(): TextMateGrammar {
  const grammarPath = join(__dirname, 'proto-typed.tmLanguage.json')
  return JSON.parse(readFileSync(grammarPath, 'utf-8'))
}

export function getLanguageConfiguration(): LanguageConfiguration {
  const configPath = join(__dirname, 'language-configuration.json')
  return JSON.parse(readFileSync(configPath, 'utf-8'))
}
