import grammar from './proto-typed.tmLanguage.json'
import configuration from './language-configuration.json'

export type TextMateGrammar = typeof grammar
export type LanguageConfiguration = typeof configuration

export function getTextMateGrammar(): TextMateGrammar {
  return grammar
}

export function getLanguageConfiguration(): LanguageConfiguration {
  return configuration
}
