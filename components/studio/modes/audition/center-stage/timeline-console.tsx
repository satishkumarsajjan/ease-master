"use client"

import * as React from "react"
import {
  PlayIcon,
  PauseIcon,
  Refresh03Icon,
  RepeatIcon,
  AccessibilityIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, AnimatePresence } from "motion/react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useStudioStore, useActiveDossier } from "@/store/useStudioStore"
import { Slider as SatisSlider } from "./satis-slider"

export function TimelineConsole() {
  const isTimelineOpen = useStudioStore((s) => s.isTimelineOpen)
  const isPlaying = useStudioStore((s) => s.isPlaying)
  const setIsPlaying = useStudioStore((s) => s.setIsPlaying)
  const togglePlayback = useStudioStore((s) => s.togglePlayback)
  const triggerAudition = useStudioStore((s) => s.triggerAudition)
  const scrubProgress = useStudioStore((s) => s.scrubProgress)
  const setScrubProgress = useStudioStore((s) => s.setScrubProgress)
  const setIsScrubbing = useStudioStore((s) => s.setIsScrubbing)
  const isLooping = useStudioStore((s) => s.isLooping)
  const setIsLooping = useStudioStore((s) => s.setIsLooping)
  const playbackSpeed = useStudioStore((s) => s.playbackSpeed)
  const setPlaybackSpeed = useStudioStore((s) => s.setPlaybackSpeed)
  const isReducedMotion = useStudioStore((s) => s.isReducedMotion)
  const setIsReducedMotion = useStudioStore((s) => s.setIsReducedMotion)

  const activeDossier = useActiveDossier()
  const duration = activeDossier.duration || 320

  const currentMs = Math.round((scrubProgress / 100) * duration)
  const totalMs = duration

  const handleScrubChange = React.useCallback(
    (val: number) => {
      setScrubProgress(val)
    },
    [setScrubProgress]
  )

  const handlePointerDown = React.useCallback(() => {
    setIsScrubbing(true)
    setIsPlaying(false)
  }, [setIsScrubbing, setIsPlaying])

  const handlePointerUp = React.useCallback(() => {
    setIsScrubbing(false)
  }, [setIsScrubbing])

  return (
    <AnimatePresence initial={false}>
      {isTimelineOpen && (
        <motion.div
          key="timeline-console-wrapper"
          initial={false}
          animate={{
            height: "auto",
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 450,
              damping: 38,
              mass: 0.8,
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              duration: 0.18,
              ease: [0.4, 0, 1, 1],
            },
          }}
          className="shrink-0 overflow-hidden"
        >
          <TooltipProvider delayDuration={150}>
            <section
              aria-label="Master Precision Timeline Dock"
              className="flex w-full shrink-0 flex-col gap-3 rounded-[20px] bg-background p-3.5 px-4 transition-colors select-none"
            >
              {/* Row 1: Full-Width Satisium Reimagined Slider */}
              <div
                className="flex w-full items-center"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
              >
                <SatisSlider
                  value={scrubProgress}
                  onChange={handleScrubChange}
                  min={0}
                  max={100}
                  step={0.1}
                  size="sm"
                  layout="inline"
                  fillVariant="subdued"
                  showValue={false}
                  disableTransition={true}
                  className="w-full"
                />
              </div>

              {/* Row 2: Precision Transport Controls & Sharp Readout */}
              <div className="flex shrink-0 items-center justify-between">
                {/* Left: Minimal Icon Transport Cluster */}
                <div className="flex items-center gap-1.5">
                  {/* Play / Pause Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={togglePlayback}
                        aria-label={
                          isPlaying ? "Pause animation" : "Play animation"
                        }
                        className="flex size-7 cursor-pointer items-center justify-center rounded-[8px] bg-foreground text-background transition-transform active:scale-95"
                      >
                        <HugeiconsIcon
                          icon={isPlaying ? PauseIcon : PlayIcon}
                          className="size-3.5"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span>{isPlaying ? "Pause" : "Play"}</span>
                      <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[9px] text-muted-foreground">
                        Space
                      </kbd>
                    </TooltipContent>
                  </Tooltip>

                  {/* Replay */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={triggerAudition}
                        aria-label="Replay from Origin"
                        className="flex size-7 cursor-pointer items-center justify-center rounded-[8px] bg-muted text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
                      >
                        <HugeiconsIcon
                          icon={Refresh03Icon}
                          className="size-3.5"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span>Replay</span>
                      <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[9px] text-muted-foreground">
                        R
                      </kbd>
                    </TooltipContent>
                  </Tooltip>

                  {/* Loop Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setIsLooping(!isLooping)}
                        aria-label="Toggle continuous loop"
                        className={cn(
                          "flex size-7 cursor-pointer items-center justify-center rounded-[8px] transition-colors active:scale-95",
                          isLooping
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <HugeiconsIcon icon={RepeatIcon} className="size-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {isLooping
                        ? "Continuous Loop: Active"
                        : "Toggle Continuous Loop"}
                    </TooltipContent>
                  </Tooltip>

                  <div className="mx-0.5 h-3.5 w-px bg-border" />

                  {/* Speed Multiplier Segment */}
                  <div className="flex h-7 items-center rounded-[8px] bg-muted p-0.5 font-sans text-xs">
                    {([1, 0.5, 0.25] as const).map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => setPlaybackSpeed(speed)}
                        className={cn(
                          "cursor-pointer rounded-[6px] px-2 py-0.5 font-mono text-[11px] transition-colors",
                          playbackSpeed === speed
                            ? "bg-background font-semibold text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: A11y Suite & Sharp Readout */}
                <div className="flex items-center gap-2">
                  {/* Reduced Motion Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setIsReducedMotion(!isReducedMotion)}
                        aria-label="Toggle reduced motion accessibility simulation"
                        className={cn(
                          "flex size-7 cursor-pointer items-center justify-center rounded-[8px] transition-colors active:scale-95",
                          isReducedMotion
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <HugeiconsIcon
                          icon={AccessibilityIcon}
                          className="size-3.5"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {isReducedMotion
                        ? "Reduced Motion: Enabled (Instant steps)"
                        : "Simulate Reduced Motion (A11y)"}
                    </TooltipContent>
                  </Tooltip>

                  <div className="h-3.5 w-px bg-border" />

                  {/* Sharp Mono Timestamp */}
                  <div className="flex items-baseline gap-1 font-mono text-xs select-none">
                    <span className="font-semibold text-foreground tabular-nums">
                      {currentMs}ms
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground tabular-nums">
                      {totalMs}ms
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </TooltipProvider>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
