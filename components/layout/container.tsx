import * as React from "react"

import { cn } from "@/lib/utils"

const SIZES = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[1440px]",
  full: "max-w-none",
} as const

export interface ContainerProps extends React.ComponentProps<"div"> {
  size?: keyof typeof SIZES
}

/** The one horizontal rhythm. Replaces ad-hoc `container mx-auto px-8 lg:px-16 xl:px-64`. */
export function Container({
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-16",
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
