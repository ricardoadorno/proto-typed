import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  actions?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  actions,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full border border-[var(--border-muted)] bg-[var(--bg-raised)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
          {eyebrow}
        </span>
      ) : null}
      <div className={cn("space-y-4", align === "center" && "max-w-2xl")}>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--fg-primary)] sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="text-base leading-relaxed text-[var(--fg-secondary)] sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div
          className={cn(
            "mt-2 flex flex-wrap gap-3",
            align === "center" && "justify-center"
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export default SectionHeader;
