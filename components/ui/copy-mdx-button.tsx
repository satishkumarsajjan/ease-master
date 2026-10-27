"use client"

import { Button } from "@/components/ui/button"
import { useCopy } from "@/hooks/use-copy"
import { SPRING } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { CheckmarkBadge03Icon, Copy01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"

export interface CopyMdxButtonProps {
  rawMdx: string
  className?: string
}

export function CopyMdxButton({ rawMdx, className }: CopyMdxButtonProps) {
  const { copied, copy } = useCopy({ label: "MDX copied" })

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copy(rawMdx)}
      disabled={!rawMdx}
      title="Copy MDX"
      aria-label="Copy MDX to clipboard"
      className={cn(
        "h-8 gap-1.5 rounded-lg border-border bg-input px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
    >
      <div className="flex size-3.5 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={SPRING.snappy}
            >
              <HugeiconsIcon
                icon={CheckmarkBadge03Icon}
                className="size-3.5 text-emerald-500"
                aria-hidden="true"
              />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={SPRING.snappy}
            >
              <HugeiconsIcon
                icon={Copy01Icon}
                className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground"
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span
        className={cn(
          "transition-colors",
          copied ? "text-emerald-500" : "text-foreground"
        )}
      >
        {copied ? "Copied!" : "Copy MDX"}
      </span>
    </Button>
  )
}
