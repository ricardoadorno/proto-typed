import type { ComponentPropsWithoutRef } from "react"

import { Alert } from "@/components/ui"
import { cn } from "@/lib/utils"
import { DocsCodeBlock } from "./docs-code-block"
import { DocHeading } from "./doc-heading"

const Paragraph = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p className={cn("text-[17px] leading-7 text-[var(--fg-secondary)]", className)} {...props} />
)

const Strong = ({ className, ...props }: ComponentPropsWithoutRef<"strong">) => (
  <strong className={cn("font-semibold text-[var(--fg-primary)]", className)} {...props} />
)

const Table = ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
  <div className="overflow-hidden rounded-lg border border-[var(--border-muted)]">
    <table className={cn("w-full border-collapse bg-[rgba(30,30,30,0.85)] text-sm", className)} {...props} />
  </div>
)

const Anchor = ({ className, ...props }: ComponentPropsWithoutRef<"a">) => (
  <a
    className={cn(
      "font-medium text-[var(--accent)] underline-offset-4 transition-[color,border-color] hover:text-[var(--accent-light)]",
      className
    )}
    {...props}
  />
)

export const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => <DocHeading as="h1" {...props} />,
  h2: (props: ComponentPropsWithoutRef<"h2">) => <DocHeading as="h2" {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <DocHeading as="h3" {...props} />,
  p: Paragraph,
  strong: Strong,
  pre: (props: ComponentPropsWithoutRef<"pre">) => <DocsCodeBlock {...props} />,
  table: Table,
  a: Anchor,
  Callout: (props: ComponentPropsWithoutRef<typeof Alert>) => <Alert {...props} />,
  Attention: (props: ComponentPropsWithoutRef<typeof Alert>) => <Alert variant="attention" {...props} />,
  Tip: (props: ComponentPropsWithoutRef<typeof Alert>) => <Alert variant="tip" {...props} />,
  Warning: (props: ComponentPropsWithoutRef<typeof Alert>) => <Alert variant="warning" {...props} />,
  Danger: (props: ComponentPropsWithoutRef<typeof Alert>) => <Alert variant="danger" {...props} />,
}

export type MdxComponents = typeof mdxComponents
