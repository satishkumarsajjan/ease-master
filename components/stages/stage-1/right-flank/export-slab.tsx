"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ExportSlabProps {
  onOpenExportDialog?: () => void
  className?: string
}

export function ExportSlab({ onOpenExportDialog, className }: ExportSlabProps) {
  return (
    <section
      aria-label="Export Trigger"
      className={cn(
        "flex shrink-0 items-center rounded-[20px] bg-background p-3 transition-colors select-none",
        className
      )}
    >
      <button
        type="button"
        onClick={onOpenExportDialog}
        className="inline-flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-secondary px-3.5 font-heading text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
      >
        <span>Export</span>
        <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
          ⌘E
        </kbd>
      </button>
    </section>
  )
}
