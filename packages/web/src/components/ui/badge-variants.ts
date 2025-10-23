import { cva } from 'class-variance-authority'

/**
 * @const badgeVariants
 * @description cva (class-variance-authority) variants for the Badge component.
 * This defines the different styles a badge can have.
 */
export const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--surface-hover)] text-[var(--accent)] border-[rgba(66,184,131,0.4)]',
        secondary:
          'bg-[rgba(99,208,163,0.12)] text-[var(--accent-light)] border-[rgba(99,208,163,0.3)]',
        outline:
          'border-[var(--border-muted)] text-[var(--fg-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)
