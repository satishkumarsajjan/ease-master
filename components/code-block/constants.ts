import { cn } from "@/lib/utils"

export const BASE_PADDING = 12
export const DEPTH_OFFSET = 22

export const COLLAPSED_HEIGHT = 380

export const scrollbarClasses = cn(
  "[scrollbar-color:var(--border)_transparent][scrollbar-width:thin]",
  "[&::-webkit-scrollbar]:w-2.5",
  "[&::-webkit-scrollbar]:h-2.5",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:min-h-[40px]",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb]:border-[3px]",
  "[&::-webkit-scrollbar-thumb]:border-solid",
  "[&::-webkit-scrollbar-thumb]:border-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-clip-padding",
  "[&::-webkit-scrollbar-thumb]:bg-border",
  "hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground",
  "[&::-webkit-scrollbar-corner]:bg-transparent"
)
