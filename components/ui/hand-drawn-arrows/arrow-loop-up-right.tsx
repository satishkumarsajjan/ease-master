"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"
import type { HandDrawnArrowProps } from "./types"

/**
 * ============================================================================
 * ARROW: LOOP UP-RIGHT
 * - Dimensions: 97 × 115 (viewBox="0 0 97 115")
 * - Trajectory: Starts bottom-left (2.5, 108), loops through lower-center,
 *   and curls upward pointing toward top-right (77.2, 5.3).
 * - Theme: Uses stroke="currentColor" to inherit token color across modes.
 * - Animation: Kinetic deceleration with EASE.outExpo.
 * ============================================================================
 */
export function ArrowLoopUpRight({
  className,
  strokeWidth = 5,
  animated = false,
  delay = 0,
  duration = 0.4,
  ...props
}: HandDrawnArrowProps) {
  const shouldReduceMotion = useReducedMotion()

  const d =
    "M2.50061 107.965C13.4655 110.921 47.4069 117.1 55.2747 100.888C56.2331 98.9133 56.8046 96.6061 56.9005 93.9203C57.1507 86.915 49.2619 75.5598 40.9005 79.5203C29.7506 84.8017 41.3111 98.6794 48.9005 100.32C51.0518 100.785 53.1812 100.963 55.2747 100.888C72.6376 100.268 87.5342 82.2851 92.0117 66.987C96.2252 52.591 92.8181 36.8071 87.6561 23.1648C85.2347 16.7653 80.3811 12.3962 77.7006 6.36478C77.5237 5.96691 77.3729 5.60457 77.2466 5.27563C74.4108 -2.10972 83.9302 7.34029 88.8117 9.47588C99.2302 14.0338 82.0834 7.15719 78.5005 5.56477C78.0646 5.37101 77.647 5.27848 77.2466 5.27563C72.2174 5.23984 69.9042 19.3539 68.1006 24.7648"

  if (!animated || shouldReduceMotion) {
    return (
      <svg
        viewBox="0 0 97 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn("shrink-0 select-none", className)}
        {...props}
      >
        <path
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 97 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <motion.path
        d={d}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: {
            duration,
            ease: EASE.outExpo,
            delay,
          },
          opacity: {
            duration: 0.04,
            delay,
          },
        }}
      />
    </svg>
  )
}
