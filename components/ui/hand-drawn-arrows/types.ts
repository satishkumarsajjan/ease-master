import * as React from "react"

export interface HandDrawnArrowProps extends React.ComponentProps<"svg"> {
  className?: string
  strokeWidth?: number | string
  animated?: boolean
  delay?: number
  duration?: number
}
