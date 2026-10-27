"use client"

import { Toaster as Sonner } from "@/components/ui/sonner"

/** Mounted once in app/layout.tsx (§5.2). Brand-styled so toasts match the family. */
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-border bg-card text-foreground shadow-lg",
          description: "text-muted-foreground",
          actionButton: "rounded-[10px] bg-primary text-primary-foreground",
          cancelButton: "rounded-[10px] bg-muted text-muted-foreground",
        },
      }}
    />
  )
}
