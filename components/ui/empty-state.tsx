import * as React from "react"

import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  secondaryAction?: React.ReactNode
  /** "dashed" is the canvas placeholder look used at /app and in previews. */
  variant?: "plain" | "dashed"
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "plain",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
        variant === "dashed" &&
          "rounded-3xl border border-dashed border-border",
        className
      )}
    >
      {icon ? (
        <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground [&_svg]:size-5">
          {icon}
        </span>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading text-h6 font-bold text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="max-w-sm text-sm text-balance text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {action || secondaryAction ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  )
}
