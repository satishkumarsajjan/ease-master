"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"
import type { HandDrawnArrowProps } from "./types"

/**
 * ============================================================================
 * ARROW: LOOP DOWN-LEFT
 * - Dimensions: 178 × 144 (viewBox="0 0 178 144")
 * - Trajectory: Starts top-right (175.3, 52.9), loops through upper-center,
 *   and swoops down pointing toward bottom-left (2.5, 121.7).
 * - Theme: Uses stroke="currentColor" to inherit token color across modes.
 * - Animation: Kinetic deceleration with EASE.outExpo.
 * ============================================================================
 */
export function ArrowLoopDownLeft({
  className,
  strokeWidth = 5,
  animated = false,
  delay = 0,
  duration = 0.4,
  ...props
}: HandDrawnArrowProps) {
  const shouldReduceMotion = useReducedMotion()

  const d =
    "M175.3 52.9099C170.16 19.7874 154.162 -5.93677 116.189 5.08761C106.307 7.95647 97.6285 14.3649 91.268 22.5945M91.268 22.5945C78.7999 38.7265 75.2397 61.8568 88.9889 79.0432C93.9637 85.2617 105.053 84.3058 111.389 80.821C121.412 75.3082 123.8 65.6128 120.9 54.8654C117.19 41.117 105.369 27.3755 91.268 22.5945ZM91.268 22.5945C85.3445 20.5863 79.0186 20.159 72.7223 21.9765C39.4123 31.5918 22.8571 65.3576 19.4778 97.7987C18.8282 104.035 21.699 149.481 28.1818 128.918M28.1818 128.918C28.4165 128.174 28.6559 127.343 28.9 126.421C30.1684 121.629 33.4005 107.141 31.8334 111.843C29.6348 118.44 28.484 122.669 28.1818 128.918ZM28.1818 128.918C28.1269 130.055 28.1 131.258 28.1 132.554C28.1 134.227 29.3227 142.969 25.6112 139.932C18.0116 133.714 9.96871 128.112 2.50006 121.71"

  if (!animated || shouldReduceMotion) {
    return (
      <svg
        viewBox="0 0 178 144"
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
      viewBox="0 0 178 144"
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
