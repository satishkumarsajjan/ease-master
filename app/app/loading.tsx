import { Skeleton } from "@/components/ui/skeleton"

export default function AppLoading() {
  return (
    <main
      role="status"
      aria-label="Loading workspace"
      className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-6 text-foreground"
    >
      <div className="flex flex-col items-center gap-3.5 text-center">
        <Skeleton className="h-6 w-52 rounded-lg" />
        <Skeleton className="h-4 w-28 rounded-md" />
      </div>
      <span className="sr-only">Loading workspace</span>
    </main>
  )
}
