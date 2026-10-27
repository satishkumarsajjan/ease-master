import * as React from "react"
import { cn } from "@/lib/utils"
import type { HandDrawnArrowProps } from "./types"

/**
 * ============================================================================
 * ARROW: SWOOP UP-RIGHT
 * - Dimensions: 175 × 112 (viewBox="0 0 175 112")
 * - Trajectory: Starts bottom-left (2.5, 108.5), creates an organic wave/s-curve
 *   across the center, and rockets upward pointing toward top-right (167, 4.8).
 * - Theme: Uses stroke="currentColor" to inherit token color across modes.
 * ============================================================================
 */
export function ArrowSwoopUpRight({
  className,
  strokeWidth = 5,
  ...props
}: HandDrawnArrowProps) {
  return (
    <svg
      viewBox="0 0 175 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M2.50049 108.532C12.4274 90.3896 27.078 58.2964 52.5807 58.876C72.1486 59.3208 78.2953 82.0424 89.3981 94.3141C119.801 127.918 149.352 41.139 159.001 23.6501C160.837 20.3224 164.618 7.52031 166.965 4.86194M166.965 4.86194C167.791 3.9271 168.439 4.24667 168.762 6.67377C169.885 15.092 175.562 42.977 169.081 21.1037C167.498 15.7638 170.027 9.47403 166.965 4.86194ZM166.965 4.86194C166.438 4.0677 165.745 3.32322 164.837 2.64191C162.356 0.781239 139.551 17.7757 138.099 20.6793"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}
