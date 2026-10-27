import * as React from "react"

import { cn } from "@/lib/utils"

export interface StatCardProps {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  trend?: { value: number; label?: string }
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  hint,
  trend,
  icon,
  className,
}: StatCardProps) {
  const isUp = (trend?.value ?? 0) >= 0

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3xl border border-border bg-card p-6",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-caption font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        {icon}
      </div>

      <div className="flex items-end gap-2">
        <span className="font-heading text-h3 font-bold text-foreground">
          {value}
        </span>
        {trend ? (
          <span
            className={cn(
              "pb-1 text-caption font-medium",
              isUp ? "text-primary" : "text-destructive"
            )}
          >
            {isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
            {trend.label ? ` ${trend.label}` : ""}
          </span>
        ) : null}
      </div>

      {hint ? (
        <span className="text-caption text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  )
}
