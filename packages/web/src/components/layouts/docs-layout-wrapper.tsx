'use client'

import type { ReactNode } from 'react'
import { useParams } from 'next/navigation'
import DocsLayout from './docs-layout'

/**
 * Wrapper component that provides a default 'en' lang when params.lang is undefined
 * This allows the DocsLayout to work both at /docs (English) and /pt/docs (Portuguese)
 */
export function DocsLayoutWrapper({ children }: { children: ReactNode }) {
  const params = useParams()

  // Create modified params with default lang
  const modifiedParams = {
    ...params,
    lang: (params.lang as string) || 'en',
  }

  return <DocsLayout paramsOverride={modifiedParams}>{children}</DocsLayout>
}

export default DocsLayoutWrapper
