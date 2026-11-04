"use client"

import * as React from "react"
import { motion } from "motion/react"
import { ChevronDoubleCloseIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { PreviewBackground } from "@/components/previewer/preview-background"
import { ViewportMode } from "@/components/previewer/resizable-playground"
import { cn } from "@/lib/utils"
import { AuditionToolbar } from "./audition-toolbar"
import { ArchetypeKey } from "../stage-1-types"

interface PreviewTheaterProps {
  previewWidth: number | string
  setPreviewWidth: (w: number | string) => void
  viewportMode: ViewportMode
  setViewportMode: (mode: ViewportMode) => void
  handleViewportChange: (mode: ViewportMode) => void
  animKey: number
  activeScenarioKey: ArchetypeKey
  setActiveScenarioKey: (val: ArchetypeKey) => void
  currentEasedA: number
  buttonPressed: boolean
  setButtonPressed: (pressed: boolean) => void
  isReducedMotion: boolean
  triggerSingleAnimation: () => void
  isTimelineOpen: boolean
  setIsTimelineOpen: React.Dispatch<React.SetStateAction<boolean>>
  compareQueue: string[]
  isCurrentCurveQueued: boolean
  toggleCompareQueue: () => void
}

/** Smallest usable preview stage, in px. Also the hit area of the drag handle. */
const MIN_STAGE_W = 320

export function PreviewTheater({
  previewWidth,
  setPreviewWidth,
  viewportMode,
  setViewportMode,
  handleViewportChange,
  animKey,
  activeScenarioKey,
  setActiveScenarioKey,
  currentEasedA,
  buttonPressed,
  setButtonPressed,
  isReducedMotion,
  triggerSingleAnimation,
  isTimelineOpen,
  setIsTimelineOpen,
  compareQueue,
  isCurrentCurveQueued,
  toggleCompareQueue,
}: PreviewTheaterProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    setIsDragging(true)
    document.body.style.cursor = "col-resize"
  }, [])

  React.useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const raw = e.clientX - containerRect.left
      const nextWidth = Math.min(
        Math.max(raw, MIN_STAGE_W),
        containerRect.width
      )
      setPreviewWidth(nextWidth)
      setViewportMode("custom")
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ""
    }

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      if (isDragging) {
        document.body.style.cursor = ""
      }
    }
  }, [isDragging, setPreviewWidth, setViewportMode])

  const pressScale = buttonPressed
    ? 0.94
    : isReducedMotion
      ? 1
      : 0.94 + Math.max(-0.15, Math.min(0.2, currentEasedA * 0.06))

  const pressTranslateY = buttonPressed
    ? 2
    : isReducedMotion
      ? 0
      : (1 - Math.min(1, Math.max(0, currentEasedA))) * 2

  return (
    <TooltipProvider delayDuration={150}>
      <section
        aria-label="Block 4: Component Preview Theater"
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-background p-2 transition-colors select-none"
      >
        {/* Stage Container */}
        <div className="relative flex h-full w-full overflow-hidden rounded-[16px]">
          {/* Workbench Cutting-Mat Substrate */}
          <PreviewBackground />

          {/* Resizable Playground Canvas */}
          <div
            className="pointer-events-none absolute inset-0 flex"
            ref={containerRef}
          >
            <motion.div
              initial={false}
              animate={{ width: previewWidth }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: isDragging ? 0 : 0.4,
              }}
              className="pointer-events-auto relative flex h-full max-w-full flex-row overflow-hidden rounded-2xl bg-muted"
            >
              {/* Direct Render Mode inside ScrollArea with Negative-Space Grid Trick */}
              <ScrollArea
                key={animKey}
                className={cn(
                  "flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-muted [&_[data-slot=scroll-area-viewport]>div]:!flex [&_[data-slot=scroll-area-viewport]>div]:!h-full [&_[data-slot=scroll-area-viewport]>div]:!min-h-full [&_[data-slot=scroll-area-viewport]>div]:!flex-col",
                  isDragging && "pointer-events-none select-none"
                )}
              >
                <div className="flex h-full min-h-full w-full flex-1 flex-col items-center justify-center p-6 select-none">
                  <Button
                    size="default"
                    onPointerDown={() => setButtonPressed(true)}
                    onPointerUp={() => {
                      setButtonPressed(false)
                      triggerSingleAnimation()
                    }}
                    onClick={triggerSingleAnimation}
                    style={{
                      transform: `translateY(${pressTranslateY}px) scale(${pressScale})`,
                    }}
                    className="transition-transform duration-75 select-none"
                  >
                    Button
                  </Button>
                </div>
                <ScrollBar orientation="vertical" />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Absolutely positioned right-edge col-resize handle */}
              <div
                onPointerDown={handlePointerDown}
                className="group absolute top-0 right-0 z-50 flex h-full w-4 cursor-col-resize items-center justify-center select-none"
              >
                <div
                  className={cn(
                    "flex h-[40%] w-1.5 items-center justify-center rounded-full transition-colors",
                    isDragging
                      ? "bg-foreground"
                      : "bg-border group-hover:bg-foreground"
                  )}
                >
                  <HugeiconsIcon
                    icon={ChevronDoubleCloseIcon}
                    className="size-3.5 text-background opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating Audition Toolbar (Positioned Absolutely in Bottom-Left) */}
          <AuditionToolbar
            viewportMode={viewportMode}
            handleViewportChange={handleViewportChange}
            activeScenarioKey={activeScenarioKey}
            setActiveScenarioKey={setActiveScenarioKey}
            triggerSingleAnimation={triggerSingleAnimation}
            isTimelineOpen={isTimelineOpen}
            setIsTimelineOpen={setIsTimelineOpen}
            compareQueue={compareQueue}
            isCurrentCurveQueued={isCurrentCurveQueued}
            toggleCompareQueue={toggleCompareQueue}
          />
        </div>
      </section>
    </TooltipProvider>
  )
}
