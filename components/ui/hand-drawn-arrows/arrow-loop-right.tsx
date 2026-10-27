import * as React from "react"
import { cn } from "@/lib/utils"
import type { HandDrawnArrowProps } from "./types"

/**
 * ============================================================================
 * ARROW: LOOP RIGHT (HORIZONTAL)
 * - Dimensions: 225 × 74 (viewBox="0 0 225 74")
 * - Trajectory: Starts far-left (2.5, 57), loops through upper-left, dips and
 *   swoops across horizontal span pointing toward far-right (210, 30).
 * - Theme: Uses stroke="currentColor" to inherit token color across modes.
 * ============================================================================
 */
export function ArrowLoopRight({
  className,
  strokeWidth = 5,
  ...props
}: HandDrawnArrowProps) {
  return (
    <svg
      viewBox="0 0 225 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M2.50006 57.2842C21.7584 58.4667 39.4251 56.6095 54.5363 49.1083M54.5363 49.1083C65.259 43.7856 74.695 35.621 82.5 23.6842C88.8301 14.0031 91.3914 -2.15366 73.6111 3.77311C57.2182 9.23742 48.3948 33.4125 54.5363 49.1083ZM54.5363 49.1083C54.5826 49.2267 54.6298 49.3446 54.6778 49.462C64.3057 72.998 92.4371 74.1616 114.144 68.4842C147.728 59.7008 180.589 48.0344 210.5 30.4398C212.262 29.4032 209.841 28.0246 205.862 26.6975M205.862 26.6975C196.085 23.4363 176.905 20.4858 187.3 23.6842C193.666 25.6429 199.682 26.4028 205.862 26.6975ZM205.862 26.6975C209.704 26.8807 213.608 26.8842 217.7 26.8842C225.387 26.8842 220.47 29.4619 216.011 33.2842C208.764 39.4962 201.639 49.527 199.3 58.8842"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}
