import type { Locale } from '@/utils/types'

export async function generateStaticParams(): Promise<{ lang: Locale }[]> {
  // Generate params for all supported languages
  return [{ lang: 'pt' }, { lang: 'en' }]
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  // Await params to ensure it's resolved before rendering
  const { lang } = await params
  // Validate lang is a valid Locale
  if (lang !== 'en' && lang !== 'pt') {
    throw new Error(`Invalid locale: ${lang}`)
  }
  return <>{children}</>
}
