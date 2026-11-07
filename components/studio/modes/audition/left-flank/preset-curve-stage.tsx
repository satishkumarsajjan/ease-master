"use client"

import * as React from "react"
import { PlayIcon, PauseIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { MiniGraph } from "@/components/ui/mini-graph"
import { BezierConfig, SpringConfig } from "@/core/types"
import { solveSpring } from "@/core/math/spring"
import { cn } from "@/lib/utils"
import { solveCubicBezier } from "@/components/studio/domain/studio-kinetics"

interface PresetCurveStageProps {
  curveId: string
  engine: "bezier" | "spring"
  duration: number
  bezier?: BezierConfig
  spring?: SpringConfig
  className?: string
}

type ReactionMode = "slide" | "scale"

/**
 * Self-contained, high-performance kinetic curve stage & tactile audition slab.
 *
 * Architecture & UI/UX Principles:
 * 1. Pure 1:1 mathematical curve representation (zero noisy dots along the curve).
 * 2. Dedicated Kinetic Audition Slab directly below with a physical squircle
 *    reacting in 1D (Slide) or 2D (Scale).
 * 3. Eliminates the 2D vector illusion (constant dx/dt masking dy/dt deceleration),
 *    allowing the designer to viscerally perceive easing friction and spring rebounds.
 * 4. The 0% start line is anchored at the left end, and the 100% finish line is anchored
 *    at the right end, utilizing 100% of the slab runway with zero dead space.
 * 5. Optical Alignment (Center of Visual Mass):
 *    - All icons strictly sourced from @hugeicons/react and @hugeicons/core-free-icons.
 *    - Directional asymmetric glyphs (PlayIcon triangle) are optically compensated
 *      with a +0.75px rightward shift to align their visual mass centroid with the
 *      geometric center of the squircle container.
 *    - Symmetric glyphs (PauseIcon) are centered with uniform negative margins.
 */
export function PresetCurveStage({
  curveId,
  engine,
  duration,
  bezier,
  spring,
  className,
}: PresetCurveStageProps) {
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [progress, setProgress] = React.useState(0)
  const [reactionMode, setReactionMode] = React.useState<ReactionMode>("slide")

  const trackRef = React.useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = React.useState(0)

  // Track dynamic container width for pixel-perfect travel calibration
  React.useEffect(() => {
    if (!trackRef.current) return
    const el = trackRef.current
    const updateWidth = () => {
      setTrackWidth(el.clientWidth)
    }
    updateWidth()

    const ro = new ResizeObserver(updateWidth)
    ro.observe(el)
    return () => ro.disconnect()
  }, [reactionMode])

  // Pre-calculate spring trajectory points once when physics parameters change (O(1) runtime lookup)
  const springPoints = React.useMemo(() => {
    if (engine !== "spring" || !spring) return []
    return solveSpring(spring.mass, spring.stiffness, spring.damping).points
  }, [engine, spring])

  // Autonomous kinetic playback loop with stable primitive dependencies
  React.useEffect(() => {
    if (!isPlaying) return

    let animId: number
    let startTime: number | null = null
    const durationMs = Math.max(160, duration || 320)
    const settlePauseMs = 450 // Natural rest at destination before cycle replay
    const totalCycleMs = durationMs + settlePauseMs

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const elapsed = (timestamp - startTime) % totalCycleMs

      if (elapsed < durationMs) {
        setProgress(elapsed / durationMs)
      } else {
        setProgress(1)
      }

      animId = requestAnimationFrame(step)
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [isPlaying, duration, curveId])

  // Current Y position along the curve (O(1) calculation)
  const easedY = React.useMemo(() => {
    if (engine === "bezier" && bezier) {
      return solveCubicBezier(
        bezier.p1.x,
        bezier.p1.y,
        bezier.p2.x,
        bezier.p2.y,
        progress
      )
    }
    if (engine === "spring" && springPoints.length > 0) {
      const idx = Math.min(
        springPoints.length - 1,
        Math.floor(progress * (springPoints.length - 1))
      )
      return springPoints[idx] ?? progress
    }
    return progress
  }, [engine, bezier, springPoints, progress])

  const togglePlay = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsPlaying((prev) => {
        if (!prev && progress >= 0.99) {
          setProgress(0)
        }
        return !prev
      })
    },
    [progress]
  )

  const handleReplay = React.useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setProgress(0)
    setIsPlaying(true)
  }, [])

  // Track calibration: squircle is 20px, container px-2 (8px padding each side)
  // 0% Start line is anchored at left-2 (8px), 100% Finish line is anchored at right-2 (8px)
  const SQUIRCLE_SIZE = 20
  const TRACK_PADDING = 8
  const totalTravelSpan = Math.max(
    0,
    trackWidth - TRACK_PADDING * 2 - SQUIRCLE_SIZE
  )
  const travelPx = Math.max(-4, totalTravelSpan * easedY)

  return (
    <div className={cn("flex w-full flex-col gap-2 select-none", className)}>
      {/* 1. Pure 1:1 Mathematical Curve Stage */}
      <div
        onClick={handleReplay}
        title="Click to replay curve impulse"
        className="group/graph relative flex aspect-square w-full shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[14px] bg-secondary p-3.5"
      >
        <MiniGraph
          mode={engine}
          bezier={bezier}
          spring={spring}
          showDiagonal
          className="h-full w-full stroke-foreground stroke-[2]"
        />
      </div>

      {/* 2. Kinetic Audition Slab: Tactile 1D / 2D Response */}
      <div className="flex flex-col gap-2 rounded-[12px] bg-secondary p-2.5">
        {/* Controls Header: Segmented Mode on Left, Play/Pause Squircle on Right */}
        <div className="flex items-center justify-between">
          {/* Mode Switcher: Slide vs Scale */}
          <div className="flex rounded-[6px] border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setReactionMode("slide")
              }}
              className={cn(
                "cursor-pointer rounded-[4px] px-2 py-0.5 font-sans text-[10px] font-medium transition-colors",
                reactionMode === "slide"
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Slide
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setReactionMode("scale")
              }}
              className={cn(
                "cursor-pointer rounded-[4px] px-2 py-0.5 font-sans text-[10px] font-medium transition-colors",
                reactionMode === "scale"
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Scale
            </button>
          </div>

          {/* Right Action Control: Optical Centered Squircle Button with Hugeicons */}
          <button
            type="button"
            onClick={togglePlay}
            title={
              isPlaying ? "Pause animation (Space)" : "Play animation (Space)"
            }
            className="flex size-6 cursor-pointer items-center justify-center rounded-[5px] border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
          >
            <HugeiconsIcon
              icon={isPlaying ? PauseIcon : PlayIcon}
              className={cn(
                "size-3.5",
                // Law of Optical Centering: shift right-pointing triangle +0.75px rightward
                // to balance center of visual mass with the geometric centroid of the squircle
                !isPlaying && "translate-x-[0.75px]"
              )}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Audition Track Stage (Full-Slab Runway from Start to Finish Line) */}
        {reactionMode === "slide" ? (
          <div
            ref={trackRef}
            onClick={handleReplay}
            title="Click to replay slide impulse"
            className="relative flex h-10 w-full cursor-pointer items-center overflow-hidden rounded-[8px] border border-border bg-background px-2"
          >
            {/* Center Guide Rail spanning the entire track */}
            <div className="absolute inset-x-2 top-1/2 h-[1px] -translate-y-1/2 bg-border" />

            {/* Start Line (0% Origin at far left) */}
            <div className="absolute top-2 bottom-2 left-2 w-[1px] bg-border" />

            {/* Finish Line (100% Destination at far right end of the slab) */}
            <div className="absolute top-2 right-2 bottom-2 w-[1px] bg-border" />

            {/* Kinetic Squircle: Mathematically & Optically Centered Core */}
            <div
              style={{
                transform: `translateX(${travelPx}px)`,
              }}
              className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-foreground shadow-sm will-change-transform"
            >
              {/* Perfectly centered optical core pip */}
              <div className="size-1 rounded-full bg-background" />
            </div>
          </div>
        ) : (
          <div
            onClick={handleReplay}
            title="Click to replay scale impulse"
            className="relative flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden rounded-[8px] border border-border bg-background"
          >
            {/* 100% Settle Ghost Target Outline */}
            <div className="absolute size-5 rounded-[5px] border border-dashed border-border" />

            {/* Kinetic Squircle */}
            <div
              style={{
                transform: `scale(${Math.max(0.08, easedY)})`,
              }}
              className="relative z-10 flex size-5 items-center justify-center rounded-[5px] bg-foreground shadow-sm will-change-transform"
            >
              <div className="size-1 rounded-full bg-background" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
