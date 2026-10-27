import * as React from "react"
import { cn } from "@/lib/utils"
import type { HandDrawnArrowProps } from "./types"

/**
 * ============================================================================
 * ARROW: ARC UP-RIGHT
 * - Dimensions: 80 × 167 (viewBox="0 0 80 167")
 * - Trajectory: Starts bottom-right (77, 164.4), curves through the bottom-left,
 *   ascends up the entire left side, and points upward toward the top (54, 5.9).
 * - Theme: Uses stroke="currentColor" to inherit token color across modes.
 * ============================================================================
 */
export function ArrowArcUpRight({
  className,
  strokeWidth = 5,
  ...props
}: HandDrawnArrowProps) {
  return (
    <svg
      viewBox="0 0 80 167"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M77.0065 164.44C48.3083 153.893 24.188 142.377 10.1621 113.936C1.12477 95.6101 0.388023 72.3846 6.34241 53.0331C11.3239 36.8434 25.8997 28.6569 38.3853 19.2927C43.1072 15.7512 50.6201 14.0602 54.5128 10.1679C55.5714 9.10932 43.0573 3.69742 40.7195 2.5285C39.9505 2.14398 50.8039 5.74131 54.0884 5.92377C71.9796 6.91769 44.4881 24.9197 48.3589 32.6615"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}
