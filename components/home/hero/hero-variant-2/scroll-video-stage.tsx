"use client"

import * as React from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export interface ScrollVideoStageProps {
  className?: string
  children?: React.ReactNode
}

export function ScrollVideoStage({
  className,
  children,
}: ScrollVideoStageProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Track window scroll position for a guaranteed pristine rest state at scrollY = 0
  const { scrollY } = useScroll()

  // Smooth scroll-driven scrub: starts at rest (0.94) at scrollY = 0
  // and smoothly expands to full width (1.0) over the first 300px of natural scroll
  const scale = useTransform(scrollY, [0, 300], [0.94, 1.0])
  const borderRadius = useTransform(scrollY, [0, 300], ["28px", "16px"])
  const opacity = useTransform(scrollY, [0, 80], [0.92, 1.0])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mt-16 flex w-full flex-col items-center justify-center pb-0 sm:mt-20 md:mt-24 lg:mt-28",
        className
      )}
    >
      {/* Pure, clean, balanced rounded placeholder with viewport height clamping (Zero borders, zero shadows) */}
      <motion.div
        style={{
          scale: shouldReduceMotion ? 1 : scale,
          borderRadius: shouldReduceMotion ? "16px" : borderRadius,
          opacity: shouldReduceMotion ? 1 : opacity,
          maxWidth: "min(1400px, calc(70vh * 16 / 9))",
          maxHeight: "70vh",
        }}
        className="relative aspect-video w-full overflow-hidden bg-muted will-change-transform"
      >
        {children ?? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-background">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-0.5 size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-mono text-[11px] font-medium tracking-wider uppercase">
                16:9 Video Demo
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
