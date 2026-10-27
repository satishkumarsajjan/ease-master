import { cn } from "@/lib/utils"
import React from "react"

export interface PreviewBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export function PreviewBackground({
  children,
  className,
  ...props
}: PreviewBackgroundProps) {
  return (
    <div
      className={cn(
        // We keep it pointer-events-none so it doesn't block interactions
        "pointer-events-none absolute inset-0 opacity-90 dark:opacity-50",
        className
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        /* Default cutting-mat.svg from the public folder */
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/cutting-mat.svg')",
            // Optional: Adjust the size of the repeating pattern if needed.
            // e.g., backgroundSize: "40px 40px"
          }}
        />
      )}
    </div>
  )
}
