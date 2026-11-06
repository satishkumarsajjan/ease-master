"use client"

import * as React from "react"
import { Cancel01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { resolveEase } from "@/components/studio/domain/studio-kinetics"
import { useStudioStore } from "@/store/useStudioStore"

export function CompareQueueSlab({ className }: { className?: string }) {
  const compareQueue = useStudioStore((s) => s.compareQueue)
  const activePresetId = useStudioStore((s) => s.activeCurveId)
  const customCurves = useStudioStore((s) => s.customCurves)
  const toggleCompare = useStudioStore((s) => s.toggleCompare)
  const removeFromCompare = useStudioStore((s) => s.removeFromCompare)
  const clearCompareQueue = useStudioStore((s) => s.clearCompareQueue)
  const setMode = useStudioStore((s) => s.setMode)

  const isCurrentCurveQueued = compareQueue.includes(activePresetId)

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

  React.useEffect(() => {
    updateScrollState()
  }, [compareQueue, updateScrollState])

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

  const handleClearAll = () => {
    clearCompareQueue()
  }

  return (
    <section
      aria-label="Compare Queue"
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
            const dossier = resolveEase(curveId, customCurves)
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
                  onClick={() => removeFromCompare(curveId)}
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
          onClick={() => toggleCompare(activePresetId)}
          className="inline-flex h-8 flex-1 cursor-pointer items-center justify-center rounded-[8px] bg-secondary px-3.5 font-heading text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
        >
          <span>
            {isCurrentCurveQueued ? "Queued (C)" : "+ Queue Current (C)"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMode("compare")}
          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] bg-secondary px-3.5 font-heading text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
        >
          <span>Duel</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
        </button>
      </div>
    </section>
  )
}
