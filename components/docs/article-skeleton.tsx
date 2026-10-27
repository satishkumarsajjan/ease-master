import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function ArticleSkeleton({
  hasToc = true,
  className,
}: {
  hasToc?: boolean
  className?: string
}) {
  return (
    <article
      role="status"
      aria-label="Loading documentation page"
      className={cn(
        "mx-auto flex w-full flex-col px-6 py-12 sm:px-8 lg:py-16",
        hasToc
          ? "max-w-(--docs-article-max)"
          : "max-w-[calc(var(--docs-measure)+var(--docs-article-padding))]",
        className
      )}
    >
      <div
        className={cn(
          "grid items-start gap-10 lg:gap-12",
          hasToc
            ? "w-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_var(--docs-toc-w)]"
            : "w-full grid-cols-1"
        )}
      >
        {/* Content Column Skeleton */}
        <div className="w-full min-w-0 pb-32">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6 flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <span className="text-xs text-muted-foreground select-none">›</span>
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>

          {/* Heading & Badge Skeleton */}
          <div className="mb-4 flex items-center gap-4">
            <Skeleton className="h-9 w-60 rounded-xl" />
            <Skeleton className="h-5 w-14 rounded-[6px]" />
          </div>

          {/* Description Line Skeleton */}
          <Skeleton className="mb-8 h-5 w-full max-w-lg rounded-md" />

          {/* Hero / Code Block / Preview Skeleton */}
          <div className="mb-8 flex w-full flex-col gap-3 rounded-2xl bg-muted p-5">
            <div className="flex items-center gap-2 pb-2">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>

          {/* Paragraph Rhythm Lines */}
          <div className="mb-8 flex flex-col gap-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-[92%] rounded-md" />
            <Skeleton className="h-4 w-[80%] rounded-md" />
          </div>

          {/* Secondary Section Skeleton */}
          <Skeleton className="mb-4 h-7 w-40 rounded-lg" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-[88%] rounded-md" />
          </div>
        </div>

        {/* Right TOC Column Skeleton */}
        {hasToc && (
          <aside className="sticky top-16 hidden flex-col gap-3 pt-1 lg:flex">
            <Skeleton className="mb-2 h-4 w-24 rounded-md" />
            <div className="flex flex-col gap-2.5 pl-3">
              <Skeleton className="h-3.5 w-28 rounded-md" />
              <Skeleton className="h-3.5 w-20 rounded-md" />
              <Skeleton className="h-3.5 w-24 rounded-md" />
            </div>
          </aside>
        )}
      </div>
      <span className="sr-only">Loading documentation page</span>
    </article>
  )
}
