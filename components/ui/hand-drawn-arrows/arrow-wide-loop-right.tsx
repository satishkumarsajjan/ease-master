import * as React from "react"
import { cn } from "@/lib/utils"
import type { HandDrawnArrowProps } from "./types"

/**
 * ============================================================================
 * ARROW: WIDE LOOP RIGHT
 * - Dimensions: 256 × 72 (viewBox="0 0 256 72")
 * - Trajectory: Starts far-left (2.5, 30), arcs over the top (71, 4), loops
 *   down through (75, 46), and sweeps horizontally across pointing right (253, 30).
 * - Theme: Uses stroke="currentColor" to inherit token color across modes.
 * ============================================================================
 */
export function ArrowWideLoopRight({
  className,
  strokeWidth = 5,
  ...props
}: HandDrawnArrowProps) {
  return (
    <svg
      viewBox="0 0 256 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M2.5 29.7587C20.7075 11.9512 44.1418 -1.89956 70.9445 3.80306C90.8503 8.03828 76.4349 33.8742 74.8556 46.1142C68.8481 92.6723 195.103 55.4848 213.611 48.1586C217.013 46.8119 247.651 32.0671 246.411 31.3586C243.431 29.6559 224.401 26.5586 229.7 26.5586C237.529 26.5586 244.936 29.7587 252.9 29.7587C256.858 29.7587 239.258 56.0038 237.7 60.1586"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}
