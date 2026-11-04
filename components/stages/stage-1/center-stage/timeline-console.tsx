"use client"

import * as React from "react"
import Link from "next/link"
import {
  PlayIcon,
  PauseIcon,
  Refresh03Icon,
  RepeatIcon,
  GitCompareIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, AnimatePresence } from "motion/react"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { ActivePresetMeta } from "../stage-1-types"

interface TimelineConsoleProps {
  isTimelineOpen: boolean
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  activePresetMeta: ActivePresetMeta
  compareQueue: string[]
  scrubProgress: number
  setScrubProgress: (val: number) => void
  setIsScrubbing: (val: boolean) => void
  isLooping: boolean
  setIsLooping: React.Dispatch<React.SetStateAction<boolean>>
  playbackSpeed: number
  setPlaybackSpeed: (speed: number) => void
  lifecyclePhase: "enter" | "exit"
  setLifecyclePhase: (phase: "enter" | "exit") => void
  isReducedMotion: boolean
  setIsReducedMotion: React.Dispatch<React.SetStateAction<boolean>>
  setAnimKey: React.Dispatch<React.SetStateAction<number>>
}

export function TimelineConsole({
  isTimelineOpen,
  isPlaying,
  setIsPlaying,
  activePresetMeta,
  compareQueue,
  scrubProgress,
  setScrubProgress,
  setIsScrubbing,
  isLooping,
  setIsLooping,
  playbackSpeed,
  setPlaybackSpeed,
  lifecyclePhase,
  setLifecyclePhase,
  isReducedMotion,
  setIsReducedMotion,
  setAnimKey,
}: TimelineConsoleProps) {
  return (
    <AnimatePresence initial={false}>
      {isTimelineOpen && (
        <motion.div
          key="block-6-wrapper"
          initial={{ height: 0 }}
          animate={{
            height: "auto",
            transition: {
              type: "spring",
              stiffness: 420,
              damping: 38,
              mass: 0.8,
            },
          }}
          exit={{
            height: 0,
            transition: {
              duration: 0.2,
              ease: [0.4, 0, 1, 1],
            },
          }}
          className="shrink-0 overflow-hidden"
        >
          <motion.section
            initial={{ y: "100%" }}
            animate={{
              y: 0,
              transition: {
                type: "spring",
                stiffness: 420,
                damping: 38,
                mass: 0.8,
              },
            }}
            exit={{
              y: "100%",
              transition: {
                duration: 0.2,
                ease: [0.4, 0, 1, 1],
              },
            }}
            aria-label="Block 6: Master Transport and Timeline Console"
            className="flex h-[150px] w-full flex-col justify-between rounded-[20px] bg-background p-3.5 transition-colors select-none"
          >
            {/* Top Row: Transport Status & Keyframe Readout */}
            <div className="flex shrink-0 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-[8px] bg-muted px-2.5 py-1">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      isPlaying
                        ? "animate-pulse bg-foreground"
                        : "bg-muted-foreground"
                    )}
                  />
                  <span className="font-heading text-xs font-semibold text-foreground">
                    Master Transport
                  </span>
                </div>
                <span className="font-sans text-xs font-medium text-foreground">
                  {activePresetMeta.name}
                </span>
                <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {activePresetMeta.engine === "bezier"
                    ? "Cubic Bezier"
                    : "Physical Spring"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {compareQueue.length > 0 && (
                  <Link
                    href={ROUTES.stage3}
                    className="flex items-center gap-1.5 rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <HugeiconsIcon icon={GitCompareIcon} className="size-3" />
                    <span>Compare Queue: {compareQueue.length}/3</span>
                  </Link>
                )}
                <div className="flex items-baseline gap-1.5 font-mono text-xs">
                  <span className="font-semibold text-foreground">
                    {Math.round(
                      (scrubProgress / 100) * activePresetMeta.duration
                    )}
                    ms
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">
                    {activePresetMeta.duration}ms
                  </span>
                  <span className="ml-1 rounded-[6px] bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                    {Math.round(scrubProgress)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Row: Full-Width Timeline Scrubber Runway */}
            <div className="flex flex-col gap-1 py-0.5">
              <div className="relative flex h-6 w-full items-center">
                {/* Visual background track */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  {/* Active progress bar */}
                  <div
                    className="h-full bg-foreground transition-none"
                    style={{
                      width: `${Math.max(0, Math.min(100, scrubProgress))}%`,
                    }}
                  />
                </div>

                {/* Floating draggable thumb */}
                <div
                  className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
                  style={{
                    left: `${Math.max(0, Math.min(100, scrubProgress))}%`,
                  }}
                />

                {/* Accessible range input over the track */}
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={scrubProgress}
                  onMouseDown={() => setIsScrubbing(true)}
                  onTouchStart={() => setIsScrubbing(true)}
                  onChange={(e) => {
                    setIsScrubbing(true)
                    setIsPlaying(false)
                    setScrubProgress(parseFloat(e.target.value))
                  }}
                  onMouseUp={() => setIsScrubbing(false)}
                  onTouchEnd={() => setIsScrubbing(false)}
                  aria-label="Master Timeline Scrubber"
                  className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                />
              </div>

              {/* Keyframe tick readout */}
              <div className="flex justify-between px-0.5 font-mono text-[9px] text-muted-foreground">
                <span>0ms · Origin</span>
                <span>{Math.round(activePresetMeta.duration * 0.25)}ms</span>
                <span>
                  {Math.round(activePresetMeta.duration * 0.5)}ms · Halfway
                </span>
                <span>{Math.round(activePresetMeta.duration * 0.75)}ms</span>
                <span>{activePresetMeta.duration}ms · Settle</span>
              </div>
            </div>

            {/* Bottom Row: Master Transport Controls, Speed Multipliers & Diagnostics */}
            <div className="flex shrink-0 items-center justify-between">
              {/* Left: Play / Pause / Replay / Loop */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] bg-foreground px-3 font-heading text-xs font-semibold text-background transition-transform active:scale-95"
                >
                  <HugeiconsIcon
                    icon={isPlaying ? PauseIcon : PlayIcon}
                    className="size-3"
                  />
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                  <kbd className="rounded-[3px] bg-background px-1 py-0.5 font-mono text-[9px] text-foreground">
                    Space
                  </kbd>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAnimKey((k) => k + 1)
                    setScrubProgress(0)
                    setIsPlaying(true)
                  }}
                  title="Replay from Origin (R)"
                  className="flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] bg-muted px-2.5 font-sans text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <HugeiconsIcon icon={Refresh03Icon} className="size-3" />
                  <span>Replay</span>
                  <kbd className="rounded-[3px] bg-secondary px-1 py-0.5 font-mono text-[9px] text-muted-foreground">
                    R
                  </kbd>
                </button>

                <button
                  type="button"
                  onClick={() => setIsLooping((l) => !l)}
                  className={cn(
                    "flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] px-2.5 font-sans text-xs font-medium transition-colors",
                    isLooping
                      ? "bg-secondary text-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <HugeiconsIcon icon={RepeatIcon} className="size-3" />
                  <span>Loop</span>
                </button>
              </div>

              {/* Center: Velocity Multipliers */}
              <div className="flex h-7 items-center rounded-[8px] bg-muted p-0.5 font-sans text-xs">
                {[1, 0.5, 0.25].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setPlaybackSpeed(speed)}
                    className={cn(
                      "cursor-pointer rounded-[6px] px-2 py-0.5 text-xs transition-colors",
                      playbackSpeed === speed
                        ? "bg-background font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Right: Direction and A11y Suite */}
              <div className="flex items-center gap-2">
                {/* Lifecycle Direction Toggle */}
                <div className="flex items-center gap-0.5 rounded-[8px] bg-muted p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setLifecyclePhase("enter")}
                    className={cn(
                      "cursor-pointer rounded-[6px] px-2 py-0.5 font-medium transition-colors",
                      lifecyclePhase === "enter"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Enter
                  </button>
                  <button
                    type="button"
                    onClick={() => setLifecyclePhase("exit")}
                    className={cn(
                      "cursor-pointer rounded-[6px] px-2 py-0.5 font-medium transition-colors",
                      lifecyclePhase === "exit"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Exit
                  </button>
                </div>

                {/* Reduced Motion Toggle */}
                <button
                  type="button"
                  onClick={() => setIsReducedMotion((m) => !m)}
                  className={cn(
                    "flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] px-2 font-sans text-[11px] transition-colors",
                    isReducedMotion
                      ? "bg-secondary font-medium text-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>Reduced Motion</span>
                  <div
                    className={cn(
                      "size-2 rounded-full",
                      isReducedMotion ? "bg-foreground" : "bg-muted-foreground"
                    )}
                  />
                </button>
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
