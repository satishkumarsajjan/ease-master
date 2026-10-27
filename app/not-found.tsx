// app/not-found.tsx
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        {/* 1. Minimal Status Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted-foreground"></span>
            <span className="relative inline-flex size-1.5 rounded-full bg-muted-foreground"></span>
          </span>
          <span className="font-mono text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
            404 Error
          </span>
        </div>

        {/* 2. Universal Typography */}
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Page not found
        </h1>

        <p className="mt-4 max-w-sm font-body text-base leading-7 text-muted-foreground">
          The page you are looking for doesn&apos;t exist, has been moved, or is
          temporarily unavailable.
        </p>

        {/* 3. Universal Escape Route */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href={ROUTES.home}
            className="group relative flex h-10 items-center gap-2 overflow-hidden rounded-full bg-foreground px-6 font-medium text-background transition-all hover:bg-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-x-1"
            />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
