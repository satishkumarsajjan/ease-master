"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"
import type { HandDrawnArrowProps } from "./types"

/**
 * ============================================================================
 * ARROW: LOOP DOWN-RIGHT
 * - Dimensions: 144 × 163 (viewBox="0 0 144 163")
 * - Trajectory: Starts top-left (2.5, 28), loops through upper-center, and
 *   curls down pointing toward bottom-right (137.2, 135.3).
 * - Theme: Uses stroke="currentColor" to inherit token color across modes.
 * - Animation:
 *   - Smooth, minimal, and intentful kinetic sweep.
 *   - Continuous single-line stem deceleration via outExpo curve.
 *   - Seamless arrowhead completion without cartoonish delay or bounce.
 *   - Honors prefers-reduced-motion.
 * ============================================================================
 */
export function ArrowLoopDownRight({
  className,
  strokeWidth = 5,
  animated = false,
  delay = 0,
  duration = 0.4,
  ...props
}: HandDrawnArrowProps) {
  const shouldReduceMotion = useReducedMotion()

  const stemPath =
    "M2.50018 28.1596C15.229 26.9255 51.5017 22.9863 57.4501 41.5954C58.077 43.5567 58.4818 45.7932 58.6532 48.1499C59.1585 55.0971 57.636 63.0889 53.8001 68.1562C42.7682 82.7295 15.7616 74.4662 31.432 56.1129C37.8425 48.6049 48.6232 47.5754 58.6532 48.1499C62.3735 48.3629 65.9905 48.7967 69.2429 49.2023C86.9624 51.4123 97.9718 62.0634 108.645 75.3623C114.066 82.1161 131.976 118.928 129.378 118.396"

  const headPath =
    "M137.742 131.063C135.088 130.422 114.929 124.865 117.3 125.865C120.403 127.175 123.74 128.204 126.661 129.891C130.117 131.886 134.022 132.979 137.232 135.341C140.048 137.413 139.486 119.025 138.651 115.911"

  if (!animated || shouldReduceMotion) {
    return (
      <svg
        viewBox="0 0 144 163"
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
        />
      </svg>
    )
  }

  // Kinetic choreography:
  // Stem sweeps with decisive velocity (outExpo) across ~88% of duration.
  // The arrowhead overlaps as the stem reaches the apex (~62% into the timeline),
  // creating the sensation of one continuous, deliberate human gesture.
  const stemDuration = duration * 0.88
  const headDelay = delay + duration * 0.6
  const headDuration = duration * 0.4

  return (
    <svg
      viewBox="0 0 144 163"
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
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: {
            duration: headDuration,
            ease: EASE.outExpo,
            delay: headDelay,
          },
          opacity: {
            duration: 0.03,
            delay: headDelay,
          },
        }}
      />
    </svg>
  )
}
