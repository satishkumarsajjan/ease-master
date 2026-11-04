"use client"

import * as React from "react"
import {
  PlayIcon,
  PauseIcon,
  Refresh03Icon,
  RepeatIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { ActivePresetMeta } from "../stage-1-types"
import { Slider as SatisSlider } from "./satis-slider"

interface TimelineConsoleProps {
  isTimelineOpen: boolean
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  activePresetMeta: ActivePresetMeta
  scrubProgress: number
  setScrubProgress: (val: number) => void
  setIsScrubbing: (val: boolean) => void
  isLooping: boolean
  setIsLooping: React.Dispatch<React.SetStateAction<boolean>>
  playbackSpeed: number
  setPlaybackSpeed: (speed: number) => void
  setAnimKey: React.Dispatch<React.SetStateAction<number>>
}

export function TimelineConsole({
  isTimelineOpen,
  isPlaying,
  setIsPlaying,
  activePresetMeta,
  scrubProgress,
  setScrubProgress,
  setIsScrubbing,
  isLooping,
  setIsLooping,
  playbackSpeed,
  setPlaybackSpeed,
  setAnimKey,
}: TimelineConsoleProps) {
  const currentMs = Math.round(
    (scrubProgress / 100) * (activePresetMeta.duration || 320)
  )
  const totalMs = activePresetMeta.duration || 320

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

  const handleReplay = React.useCallback(() => {
    setAnimKey((k) => k + 1)
    setScrubProgress(0)
    setIsPlaying(true)
  }, [setAnimKey, setScrubProgress, setIsPlaying])

  return (
    <AnimatePresence initial={false}>
      {isTimelineOpen && (
        <motion.div
          key="block-6-wrapper"
          initial={{ height: 0, opacity: 0 }}
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
          <motion.section
            initial={{ y: 20 }}
            animate={{
              y: 0,
              transition: {
                type: "spring",
                stiffness: 450,
                damping: 38,
                mass: 0.8,
              },
            }}
            exit={{
              y: 20,
              transition: {
                duration: 0.18,
                ease: [0.4, 0, 1, 1],
              },
            }}
            aria-label="Block 6: Master Precision Timeline Dock"
            className="flex h-[82px] w-full flex-col justify-between rounded-[20px] bg-background p-2.5 px-3.5 transition-colors select-none"
          >
            {/* Row 1: Full-Width Satisium Reimagined Slider (Option A: inline layout) */}
            <div
              className="flex w-full items-center"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
            >
              <SatisSlider
                value={Number(scrubProgress.toFixed(1))}
                onChange={handleScrubChange}
                min={0}
                max={100}
                step={0.1}
                size="sm"
                layout="inline"
                className="w-full"
              />
            </div>

            {/* Row 2: Precision Transport Controls & Sharp Readout */}
            <div className="flex shrink-0 items-center justify-between pt-1">
              {/* Left Transport Cluster */}
              <div className="flex items-center gap-2">
                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] bg-foreground px-2.5 font-heading text-xs font-semibold text-background transition-transform active:scale-95"
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

                {/* Replay */}
                <button
                  type="button"
                  onClick={handleReplay}
                  title="Replay from Origin (R)"
                  className="flex h-7 cursor-pointer items-center gap-1 rounded-[8px] bg-muted px-2 font-sans text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
                >
                  <HugeiconsIcon icon={Refresh03Icon} className="size-3" />
                  <span>Replay</span>
                </button>

                {/* Loop Toggle */}
                <button
                  type="button"
                  onClick={() => setIsLooping((l) => !l)}
                  title="Toggle Continuous Loop"
                  className={cn(
                    "flex h-7 cursor-pointer items-center gap-1 rounded-[8px] px-2 font-sans text-xs font-medium transition-colors active:scale-95",
                    isLooping
                      ? "bg-secondary font-semibold text-foreground"
                      : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <HugeiconsIcon icon={RepeatIcon} className="size-3" />
                  <span>Loop</span>
                </button>

                {/* Speed Multiplier Segment */}
                <div className="flex h-7 items-center rounded-[8px] bg-muted p-0.5 font-sans text-xs">
                  {([1, 0.5, 0.25] as const).map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setPlaybackSpeed(speed)}
                      className={cn(
                        "cursor-pointer rounded-[6px] px-2 py-0.5 text-xs transition-colors",
                        playbackSpeed === speed
                          ? "bg-background font-semibold text-foreground shadow-xs"
                          : "font-medium text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Sharp Mono Timestamp */}
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
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
