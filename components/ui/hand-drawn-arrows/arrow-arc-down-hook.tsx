import * as React from "react"
import { cn } from "@/lib/utils"
import type { HandDrawnArrowProps } from "./types"

/**
 * ============================================================================
 * ARROW: ARC DOWN HOOK
 * - Dimensions: 91 × 181 (viewBox="0 0 91 181")
 * - Trajectory: Starts top-center (42.7, 2.5), sweeps down in a deep C-curve
 *   along the left, turns right across the bottom (87.6, 150), and hooks
 *   downward (58, 178).
 * - Theme: Uses stroke="currentColor" to inherit token color across modes.
 * ============================================================================
 */
export function ArrowArcDownHook({
  className,
  strokeWidth = 5,
  ...props
}: HandDrawnArrowProps) {
  return (
    <svg
      viewBox="0 0 91 181"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M42.6748 2.50044C19.6824 43.0395 -26.6249 110.164 28.351 145.632C41.8184 154.321 55.7596 153.378 71.1102 153.378C71.7733 153.378 87.1283 150.913 85.4339 149.558C80.897 145.928 54.4907 124.13 71.7468 138.099C73.5724 139.577 87.6621 147.519 87.6621 149.982C87.6621 156.695 62.9752 173.184 57.9536 178.205"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}
