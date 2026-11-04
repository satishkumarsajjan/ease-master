"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PreviewBackground } from "@/components/previewer/preview-background"
import { ViewportMode } from "@/components/previewer/resizable-playground"
import { AuditionToolbar } from "./audition-toolbar"
import { ArchetypeKey } from "../stage-1-types"

interface PreviewTheaterProps {
  previewWidth: number | string
  animKey: number
  activeScenarioKey: ArchetypeKey
  currentEasedA: number
  buttonPressed: boolean
  setButtonPressed: (pressed: boolean) => void
  isReducedMotion: boolean
  triggerSingleAnimation: () => void
  viewportMode: ViewportMode
  handleViewportChange: (mode: ViewportMode) => void
  setActiveScenarioKey: (val: ArchetypeKey) => void
  isTimelineOpen: boolean
  setIsTimelineOpen: React.Dispatch<React.SetStateAction<boolean>>
  compareQueue: string[]
  isCurrentCurveQueued: boolean
  toggleCompareQueue: () => void
}

export function PreviewTheater({
  previewWidth,
  animKey,
  activeScenarioKey,
  currentEasedA,
  buttonPressed,
  setButtonPressed,
  isReducedMotion,
  triggerSingleAnimation,
  viewportMode,
  handleViewportChange,
  setActiveScenarioKey,
  isTimelineOpen,
  setIsTimelineOpen,
  compareQueue,
  isCurrentCurveQueued,
  toggleCompareQueue,
}: PreviewTheaterProps) {
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
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-background p-2 transition-colors"
      >
        {/* Stage Container */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[16px]">
          {/* Workbench Cutting-Mat Substrate */}
          <PreviewBackground />

          {/* Interactive Resizable Device Frame (Centered Horizontally & Vertically) */}
          <motion.div
            key={animKey}
            initial={false}
            animate={{ width: previewWidth }}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.4,
            }}
            className="relative flex h-full max-w-full items-center justify-center overflow-hidden rounded-2xl bg-muted"
          >
            {/* Centered Button Archetype */}
            <div className="flex h-full w-full items-center justify-center p-6 select-none">
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
          </motion.div>

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
