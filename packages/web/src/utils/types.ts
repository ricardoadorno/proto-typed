export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'pt'],
  prefixDefault: false, // English has no prefix
} as const

export type Locale = (typeof i18n)['locales'][number]
