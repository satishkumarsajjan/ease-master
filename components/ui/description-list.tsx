import * as React from "react"

import { cn } from "@/lib/utils"

export interface DescriptionItem {
  term: React.ReactNode
  description: React.ReactNode
}

/** Key/value details — settings summaries, build info, component metadata. */
export function DescriptionList({
  items,
  className,
}: {
  items: DescriptionItem[]
  className?: string
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-8 gap-y-4 sm:grid-cols-[minmax(0,180px)_1fr]",
        className
      )}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <dt className="text-sm font-medium text-muted-foreground">
            {item.term}
          </dt>
          <dd className="min-w-0 text-sm text-foreground">
            {item.description}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  )
}
