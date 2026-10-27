import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/** Composes the shadcn skeleton (`pnpm dlx shadcn@latest add skeleton`). */
export function LoadingState({
  rows = 3,
  label = "Loading",
  className,
}: {
  rows?: number
  label?: string
  className?: string
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex w-full flex-col gap-3", className)}
    >
      <Skeleton className="h-8 w-1/3 rounded-2xl" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full rounded-full" />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-border border-t-primary motion-reduce:animate-none",
        className
      )}
    />
  )
}
