import * as React from "react"

import { cn } from "@/lib/utils"

export function Steps({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "mt-6 mb-8 flex flex-col gap-6 [counter-reset:step]",
        className
      )}
    >
      {children}
    </div>
  )
}

export function Step({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "relative flex gap-4 [counter-increment:step] [&:last-child_.connector]:hidden",
        className
      )}
    >
      <div className="flex flex-col items-center">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-mono text-[11px] font-bold text-foreground before:content-[counter(step)]" />
        <span
          aria-hidden="true"
          className="connector mt-2 w-px flex-1 bg-border"
        />
      </div>

      <div className="min-w-0 flex-1 pb-2">
        <p className="font-heading font-bold text-foreground">{title}</p>
        {children ? (
          <div className="mt-1 text-muted-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}
