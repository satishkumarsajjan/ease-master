"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"
import type { HandDrawnArrowProps } from "./types"

/**
 * ============================================================================
 * ARROW: DIAGONAL DOWN-RIGHT
 * - Dimensions: 86 × 95 (viewBox="0 0 86 95")
 * - Trajectory: Starts top-left (2.5, 2.5), sweeps directly diagonally downward
 *   and points toward the bottom-right (81, 91) with organic hand-drawn barbs.
 * - Non-looping direct pointer style.
 * - Theme: Uses stroke="currentColor" to inherit token color across modes.
 * - Animation: Kinetic deceleration with EASE.outExpo.
 * ============================================================================
 */
export function ArrowDiagonalDownRight({
  className,
  strokeWidth = 5,
  animated = false,
  delay = 0,
  duration = 0.4,
  ...props
}: HandDrawnArrowProps) {
  const shouldReduceMotion = useReducedMotion()

  const d =
    "M2.50018 2.50018C22.1465 29.5363 43.8229 52.9868 66.1446 77.7002C67.0158 78.6647 73.729 85.7853 77.7943 89.6699M77.7943 89.6699C79.6119 91.4068 80.9002 92.4967 80.9002 92.1002C80.9002 91.7013 80.8845 91.3043 80.8541 90.909M77.7943 89.6699C78.8867 90.1476 79.9695 90.5969 80.8541 90.909M77.7943 89.6699C75.5193 88.6752 73.2022 87.5575 72.5446 87.3002C63.1984 83.643 53.9827 84.1002 44.1002 84.1002M80.8541 90.909C80.7563 89.635 80.5067 88.379 80.1419 87.1378M80.8541 90.909C82.5126 91.494 83.4749 91.5968 82.5002 90.5002C81.725 89.6281 80.9342 88.4793 80.1419 87.1378M80.1419 87.1378C79.1826 83.8742 77.4274 80.7137 75.5446 77.6016M80.1419 87.1378C78.5796 84.4928 77.0112 81.0989 75.5446 77.6016M75.5446 77.6016C72.3077 72.2512 68.6939 67.0436 68.1002 61.7002C67.2978 54.4789 70.913 66.5562 75.5446 77.6016Z"

  if (!animated || shouldReduceMotion) {
    return (
      <svg
        viewBox="0 0 86 95"
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
      viewBox="0 0 86 95"
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
