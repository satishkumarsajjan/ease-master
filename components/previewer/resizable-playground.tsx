"use client"

import { ChevronDoubleCloseIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { DemoData } from "./component-preview"
import { cn } from "@/lib/utils"
// ✨ IMPORT SHADCN SCROLL AREA
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ErrorBoundary } from "@/components/error-boundary"
import { Spinner } from "@/components/ui/loading-state"

export type ViewportMode = "desktop" | "tablet" | "mobile" | "custom"

/** Smallest usable preview stage, in px. Also the hit area of the drag handle. */
const MIN_STAGE_W = 320

interface PlaygroundProps {
  demos: DemoData[]
  activeDemoIndex: number
  previewWidth: number | string
  setPreviewWidth: (w: number | string) => void
  setViewportMode: (mode: ViewportMode) => void
  reloadKey: number
}

export function ResizablePlayground({
  demos,
  activeDemoIndex,
  previewWidth,
  setPreviewWidth,
  setViewportMode,
  reloadKey,
}: PlaygroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const activeDemo = demos[activeDemoIndex]
  const currentKey = `${activeDemo?.key ?? ""}-${reloadKey}`
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const iframeLoaded = loadedKey === currentKey

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    setIsDragging(true)
    document.body.style.cursor = "col-resize"
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      // The floor was a hardcoded 320px, which is wider than the space left over
      // once the code panel is open in a narrow pane — so the handle advertised a
      // gesture that could not happen. Clamp against the container instead.
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

  const isIframe = activeDemo?.renderMode === "iframe"

  return (
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
        {/* 
          SCROLL AREA INTEGRATION:
          We wrap ONLY the direct render mode in the ScrollArea. 
          Iframes must be excluded because combining Radix Viewports with Iframes creates chaotic scroll-jacking.
        */}
        {isIframe ? (
          <div
            key="iframe-wrapper"
            className={cn(
              "relative flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl p-0",
              isDragging && "pointer-events-none select-none"
            )}
          >
            {!iframeLoaded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted backdrop-blur-xs transition-opacity duration-300">
                <Spinner className="size-5 text-primary" />
                <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  Loading preview…
                </span>
              </div>
            )}
            {activeDemo.embedUrl && (
              <iframe
                id={`satis-iframe-${activeDemo.key}`}
                src={activeDemo.embedUrl}
                title={activeDemo.name}
                loading="lazy"
                onLoad={() => setLoadedKey(currentKey)}
                className={cn(
                  "h-full w-full border-none bg-transparent transition-opacity duration-300",
                  iframeLoaded ? "opacity-100" : "opacity-0",
                  isDragging && "pointer-events-none select-none",
                  "group-data-[sidebar-open=true]/spatial:pointer-events-none"
                )}
              />
            )}
          </div>
        ) : (
          <ScrollArea
            key={reloadKey}
            className={cn(
              "flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-muted",
              isDragging && "pointer-events-none select-none"
            )}
          >
            {/* 
              THE GRID TRICK INSIDE THE SCROLL AREA:
              Shadcn ScrollArea DOES NOT fix the negative-space clipping bug on its own.
              We still MUST use the grid trick inside the viewport to allow `h-[300vh]` items to scale safely!
              
              ✨ FIX: Removed `p-8 pb-20` so everything is 100% fullscreen by default!
            */}
            <div className="grid min-h-full min-w-full grid-cols-1 grid-rows-[minmax(100%,max-content)]">
              <div className="flex h-full w-full flex-col items-center justify-center">
                <ErrorBoundary
                  label={`preview:${activeDemo?.key ?? "unknown"}`}
                >
                  {activeDemo?.component}
                </ErrorBoundary>
              </div>
            </div>
            {/* Force a beautiful, minimal vertical scrollbar overlay */}
            <ScrollBar orientation="vertical" />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        {/* Absolutely positioned so it never consumes layout width, and kept
            fully inside the stage's own `overflow-hidden` bounds. It used to be a
            `w-4` flex child inside a `max-w-full` box, so at the default
            previewWidth of 100% it was clipped out of existence — the control you
            were invited to drag was not rendered in the first state you saw. */}
        <div
          onPointerDown={handlePointerDown}
          className="group absolute top-0 right-0 z-50 flex h-full w-4 cursor-col-resize items-center justify-center"
        >
          <div
            className={`flex h-[40%] w-1.5 items-center justify-center rounded-full transition-colors ${
              isDragging
                ? "bg-foreground"
                : "bg-border group-hover:bg-foreground"
            }`}
          >
            <HugeiconsIcon
              icon={ChevronDoubleCloseIcon}
              className="size-3.5 text-background opacity-0 transition-opacity group-hover:opacity-100"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
