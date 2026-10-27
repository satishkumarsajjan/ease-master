import * as React from "react"
import { cn } from "@/lib/utils"

type CalloutType = "info" | "warn" | "success" | "idea"

const STYLES: Record<CalloutType, string> = {
  info: "border-border bg-muted [&_[data-callout-icon]]:text-foreground",
  warn: "border-border bg-muted [&_[data-callout-icon]]:text-foreground",
  success: "border-border bg-muted [&_[data-callout-icon]]:text-foreground",
  idea: "border-border bg-muted [&_[data-callout-icon]]:text-primary",
}

export function Callout({
  type = "info",
  title,
  children,
  className,
}: {
  type?: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-3xl border p-5 text-sm leading-relaxed text-muted-foreground",
        STYLES[type],
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {title && (
          <p
            data-callout-icon
            className="mb-1 font-heading font-bold text-foreground"
          >
            {title}
          </p>
        )}
        <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  )
}
