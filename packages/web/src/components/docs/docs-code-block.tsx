'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { DSLEditor } from '../editor'

interface DocsCodeBlockProps extends React.ComponentPropsWithoutRef<'pre'> {
  'data-title'?: string
  'data-playground'?: string
  'data-language'?: string
}

export function DocsCodeBlock({
  children,
  className,
  ...rest
}: DocsCodeBlockProps) {
  const child = React.Children.toArray(children)[0] as React.ReactElement<
    React.ComponentPropsWithoutRef<'code'> & { metastring?: string }
  >

  if (!React.isValidElement(child)) {
    return (
      <pre className={cn('docs-raw-pre', className)} {...rest}>
        {children}
      </pre>
    )
  }

  const {
    'data-title': dataTitle,
    'data-playground': _dataPlayground,
    'data-language': dataLanguage,
  } = rest

  const codeContent =
    typeof child.props.children === 'string'
      ? child.props.children.trimEnd()
      : Array.isArray(child.props.children)
        ? child.props.children.join('').trimEnd()
        : ''

  const { children: _codeChildren } = child.props
  const metaFromChild =
    typeof child.props === 'object' && child.props
      ? (child.props as { [key: string]: string | undefined })['data-meta']
      : undefined

  const language =
    child.props.className?.replace(/language-/, '') ?? dataLanguage ?? 'text'
  const languageBadge = ['proto', 'dsl'].includes(language.toLowerCase())
    ? 'DSL'
    : language.toUpperCase()

  const title =
    dataTitle ?? child.props.metastring ?? metaFromChild ?? languageBadge

  return (
    <figure
      className={cn(
        'docs-code-block overflow-hidden rounded-xl border border-[var(--border-muted)] bg-[var(--bg-raised)] h-64',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-4 py-2 text-xs text-[var(--fg-secondary)]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[var(--fg-primary)]">
            {title}
          </span>
        </div>
      </div>
      <DSLEditor
        value={codeContent}
        options={{
          readOnly: true,
          domReadOnly: true,
          renderLineHighlight: 'none',
          readOnlyMessage: { value: '' },
          lineNumbers: 'off',
          glyphMargin: false,
          stickyScroll: {
            enabled: false,
          },
        }}
      />
    </figure>
  )
}
