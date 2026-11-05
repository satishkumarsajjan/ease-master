"use client"

import * as React from "react"
import Link from "next/link"
import { Cancel01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { EaseDossier } from "../stage-1-types"

interface CompareQueueSlabProps {
  compareQueue: string[]
  setCompareQueue: (updater: string[] | ((prev: string[]) => string[])) => void
  activePresetId: string
  isCurrentCurveQueued: boolean
  toggleCompareQueue: () => void
  resolveEase: (id: string) => EaseDossier | undefined
  className?: string
}

export function CompareQueueSlab({
  compareQueue,
  setCompareQueue,
  activePresetId,
  isCurrentCurveQueued,
  toggleCompareQueue,
  resolveEase,
  className,
}: CompareQueueSlabProps) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = React.useState<{
    canScrollUp: boolean
    canScrollDown: boolean
  }>({
    canScrollUp: false,
    canScrollDown: false,
  })

  const updateScrollState = React.useCallback(() => {
    const el = listRef.current
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const maxScroll = scrollHeight - clientHeight
    const hasOverflow = maxScroll > 2

    setScrollState({
      canScrollUp: hasOverflow && scrollTop > 2,
      canScrollDown: hasOverflow && scrollTop < maxScroll - 2,
    })
  }, [])

  // Re-check scroll metrics whenever the queue items change
  React.useEffect(() => {
    updateScrollState()
  }, [compareQueue, updateScrollState])

  // Observe container resizes (e.g. window resize or layout flex)
  React.useEffect(() => {
    const el = listRef.current
    if (!el) return

    updateScrollState()

    const ro = new ResizeObserver(() => {
      updateScrollState()
    })
    ro.observe(el)

    return () => ro.disconnect()
  }, [updateScrollState])

  // Dynamic alpha mask: fades edges only when scrollable content extends beyond view
  const maskStyle = React.useMemo<React.CSSProperties>(() => {
    const { canScrollUp, canScrollDown } = scrollState
    if (!canScrollUp && !canScrollDown) {
      return {}
    }

    const fadeSize = "14px"

    let mask = ""
    if (canScrollUp && canScrollDown) {
      mask = `linear-gradient(to bottom, transparent 0px, black ${fadeSize}, black calc(100% - ${fadeSize}), transparent 100%)`
    } else if (canScrollUp) {
      mask = `linear-gradient(to bottom, transparent 0px, black ${fadeSize}, black 100%)`
    } else if (canScrollDown) {
      mask = `linear-gradient(to bottom, black 0%, black calc(100% - ${fadeSize}), transparent 100%)`
    }

    return {
      WebkitMaskImage: mask,
      maskImage: mask,
    }
  }, [scrollState])

  const handleRemove = (curveId: string) => {
    setCompareQueue((prev) => prev.filter((id) => id !== curveId))
  }

  const handleClearAll = () => {
    setCompareQueue([])
  }

  return (
    <section
      aria-label="Block 8: Compare Queue"
      className={cn(
        "flex h-[200px] shrink-0 flex-col rounded-[20px] bg-background p-4 transition-colors select-none",
        className
      )}
    >
      {/* Header: Fixed at top with clean bottom padding */}
      <div className="flex shrink-0 items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span className="font-heading text-xs font-semibold text-foreground">
            Compare Queue
          </span>
          <span className="rounded-[5px] bg-secondary px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground">
            {compareQueue.length} Staged
          </span>
        </div>

        {compareQueue.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="cursor-pointer font-sans text-[10px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Top-Justified Curves List Area: Dynamic scroll fade via CSS mask-image */}
      <div
        ref={listRef}
        onScroll={updateScrollState}
        style={maskStyle}
        className="no-scrollbar flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pr-0.5"
      >
        {compareQueue.length === 0 ? (
          <div className="flex flex-col pt-3 text-center">
            <span className="font-sans text-xs text-muted-foreground">
              Queue is empty
            </span>
            <span className="mt-1 font-sans text-[11px] text-muted-foreground">
              Press{" "}
              <kbd className="rounded bg-secondary px-1 py-0.5 font-mono text-[9px] text-foreground">
                C
              </kbd>{" "}
              to stage current curve
            </span>
          </div>
        ) : (
          compareQueue.map((curveId) => {
            const dossier = resolveEase(curveId)
            const name = dossier?.name ?? curveId
            const isCurrent = curveId === activePresetId

            return (
              <div
                key={curveId}
                className={cn(
                  "flex h-6 shrink-0 items-center justify-between px-1",
                  isCurrent
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span className="truncate font-sans text-xs">{name}</span>

                <button
                  type="button"
                  onClick={() => handleRemove(curveId)}
                  aria-label={`Remove ${name} from queue`}
                  className="flex size-3.5 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:scale-95"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-2.5" />
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Action Row: Firmly anchored at bottom */}
      <div className="mt-auto flex shrink-0 items-center gap-2 pt-2">
        <button
          type="button"
          onClick={toggleCompareQueue}
          className="inline-flex h-8 flex-1 cursor-pointer items-center justify-center rounded-[8px] bg-secondary px-3.5 font-heading text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
        >
          <span>
            {isCurrentCurveQueued ? "Queued (C)" : "+ Queue Current (C)"}
          </span>
        </button>

        <Link
          href={ROUTES.stage3}
          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] bg-secondary px-3.5 font-heading text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
        >
          <span>Duel</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
        </Link>
      </div>
    </section>
  )
}
