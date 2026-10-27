import { cn } from "@/lib/utils"

/** First focusable element on the page. Mount it as the first child of <body>. */
export function SkipLink({ target = "main-content" }: { target?: string }) {
  return (
    <a
      href={`#${target}`}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[12px]",
        "focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground",
        "focus-visible:outline-none"
      )}
    >
      Skip to content
    </a>
  )
}
