"use client"

import * as React from "react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useCopy } from "@/hooks/use-copy"
import { cn } from "@/lib/utils"

export function PromptBlock({
  title = "Prompt",
  prompt,
  className,
}: {
  title?: string
  prompt: string
  className?: string
}) {
  const { copied, copy } = useCopy()

  return (
    <div
      className={cn(
        "mt-6 overflow-hidden rounded-3xl border border-border bg-muted",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <span className="font-mono text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
          {title}
        </span>
        <button
          onClick={() => copy(prompt)}
          aria-label="Copy prompt"
          className="flex size-7 items-center justify-center rounded-[8px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            className="size-3.5"
          />
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-foreground">
        {prompt}
      </pre>
    </div>
  )
}
