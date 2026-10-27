import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-xl bg-muted",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-linear-to-r after:from-transparent after:via-accent after:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
