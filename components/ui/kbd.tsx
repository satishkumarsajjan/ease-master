import * as React from "react"

import { formatHotkey, isApplePlatform } from "@/lib/hotkeys"
import { cn } from "@/lib/utils"

export function Kbd({
  className,
  children,
  ...props
}: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[6px] border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}

/** <KbdShortcut keys="mod+k" /> → ⌘K (Apple) / Ctrl K (elsewhere). */
export function KbdShortcut({
  keys,
  className,
}: {
  keys: string
  className?: string
}) {
  const apple = React.useMemo(() => isApplePlatform(), [])
  return <Kbd className={className}>{formatHotkey(keys, apple)}</Kbd>
}
