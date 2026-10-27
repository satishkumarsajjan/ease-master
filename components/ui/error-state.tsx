"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface ErrorStateProps {
  title?: string
  description?: string
  /** Next.js error boundaries hand you `reset` — pass it straight through. */
  reset?: () => void
  actions?: React.ReactNode
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description,
  reset,
  actions,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading text-h6 font-bold text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="max-w-md text-sm text-balance text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {reset ? (
          <button
            onClick={reset}
            className="rounded-[12px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Try again
          </button>
        ) : null}
        {actions}
      </div>
    </div>
  )
}
