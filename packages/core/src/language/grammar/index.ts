import grammar from './proto-typed.tmLanguage.json' with { type: 'json' }
import configuration from './language-configuration.json' with { type: 'json' }

export type TextMateGrammar = typeof grammar
export type LanguageConfiguration = typeof configuration

export function getTextMateGrammar(): TextMateGrammar {
  return grammar
}

export function getLanguageConfiguration(): LanguageConfiguration {
  return configuration
}
