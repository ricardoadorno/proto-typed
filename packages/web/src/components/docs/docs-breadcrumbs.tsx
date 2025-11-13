import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui'

export interface BreadcrumbSegment {
  label: string
  href?: string
}

interface DocsBreadcrumbsProps {
  trail: BreadcrumbSegment[]
}

export function DocsBreadcrumbs({ trail }: DocsBreadcrumbsProps) {
  if (!trail.length) {
    return null
  }

  const displayTrail =
    trail.length > 4 ? [trail[0], { label: '…' }, ...trail.slice(-3)] : trail

  return (
    <Breadcrumb aria-label="Breadcrumb" className="w-full text-[11px]">
      <BreadcrumbList className="text-[var(--fg-secondary)]">
        {displayTrail.map((segment, index) => {
          const isLast = index === displayTrail.length - 1
          return (
            <BreadcrumbItem
              key={`${segment.label}-${index}`}
              className="flex items-center gap-2"
            >
              {segment.href && !isLast ? (
                <BreadcrumbLink
                  asChild
                  className="uppercase tracking-[0.32em] text-[var(--fg-secondary)] transition-colors hover:text-[var(--accent-light)]"
                >
                  <Link href={segment.href}>{segment.label}</Link>
                </BreadcrumbLink>
              ) : isLast ? (
                <BreadcrumbPage className="uppercase tracking-[0.32em] text-[var(--accent-light)]">
                  {segment.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbPage className="uppercase tracking-[0.32em] text-[var(--fg-secondary)]">
                  {segment.label}
                </BreadcrumbPage>
              )}
              {!isLast ? (
                <BreadcrumbSeparator className="text-[var(--fg-secondary)]">
                  <span className="text-[var(--brand-400)]">›</span>
                </BreadcrumbSeparator>
              ) : null}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default DocsBreadcrumbs
