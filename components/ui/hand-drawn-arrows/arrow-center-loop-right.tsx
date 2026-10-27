import * as React from "react"
import { cn } from "@/lib/utils"
import type { HandDrawnArrowProps } from "./types"

/**
 * ============================================================================
 * ARROW: CENTER LOOP RIGHT
 * - Dimensions: 253 × 106 (viewBox="0 0 253 106")
 * - Trajectory: Starts bottom-left (2.5, 103), ascends into a center loop
 *   (148, 5), then sweeps horizontally across pointing right (250, 65).
 * - Theme: Uses stroke="currentColor" to inherit token color across modes.
 * ============================================================================
 */
export function ArrowCenterLoopRight({
  className,
  strokeWidth = 5,
  ...props
}: HandDrawnArrowProps) {
  return (
    <svg
      viewBox="0 0 253 106"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M2.5 103.21C44.8292 105.471 84.7951 90.2141 117.682 63.339C121.431 60.275 125.173 56.8798 128.741 53.2277M128.741 53.2277C135.952 45.8471 142.456 37.4176 146.887 28.5547C149.891 22.5475 153.898 10.7239 148.774 5.17378C140.268 -4.04154 129.085 13.0166 125.393 19.3664C120.213 28.2763 122.075 43.7367 128.741 53.2277ZM128.741 53.2277C130.662 55.9635 132.982 58.2033 135.648 59.6472C157.764 71.6266 190.543 68.7658 214.815 67.687C224.506 67.2562 234.369 64.8156 243.939 64.8156C247.652 64.8156 238.679 60.1559 237.294 58.9089C229.118 51.5509 228.686 51.6877 238.77 58.1705C240.167 59.0682 250.42 64.5911 250.42 65.554C250.42 66.2259 232.98 79.0681 231.387 81.0592"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}
