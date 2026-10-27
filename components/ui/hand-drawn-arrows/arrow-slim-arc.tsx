"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"
import type { HandDrawnArrowProps } from "./types"

/**
 * ============================================================================
 * ARROW: SLIM ARC (MINIMALIST PRECISION VECTOR)
 * - Dimensions: 32 × 18 (viewBox="0 0 32 18")
 * - Trajectory: Starts top-left (2, 3) cleanly at the text baseline,
 *   gently arcs downward to (25, 14) with a crisp 1.5px arrowhead pointing
 *   directly into the handle pill.
 * - Non-looping, ultra-slim precision affordance for handles and subtle cues.
 * - Theme: Uses stroke="currentColor" to inherit token color across modes.
 * - Animation: Crisp single-stroke kinetic draw with EASE.outExpo.
 * ============================================================================
 */
export function ArrowSlimArc({
  className,
  strokeWidth = 1.5,
  animated = false,
  delay = 0,
  duration = 0.35,
  ...props
}: HandDrawnArrowProps) {
  const shouldReduceMotion = useReducedMotion()

  const stemPath = "M 2 3 C 10 3, 20 5, 25 14"
  const headPath = "M 19 11 L 25 14 L 28 8"

  if (!animated || shouldReduceMotion) {
    return (
      <svg
        viewBox="0 0 32 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn("shrink-0 select-none", className)}
        {...props}
      >
        <path
          d={stemPath}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={headPath}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  const stemDuration = duration * 0.75
  const headDelay = delay + stemDuration * 0.7
  const headDuration = duration * 0.35

  return (
    <svg
      viewBox="0 0 32 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <motion.path
        d={stemPath}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: {
            duration: stemDuration,
            ease: EASE.outExpo,
            delay,
          },
          opacity: {
            duration: 0.04,
            delay,
          },
        }}
      />
      <motion.path
        d={headPath}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: {
            duration: headDuration,
            ease: EASE.outExpo,
            delay: headDelay,
          },
          opacity: {
            duration: 0.04,
            delay: headDelay,
          },
        }}
      />
    </svg>
  )
}
