"use client"

interface RootErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: RootErrorProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="max-w-md space-y-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground">
              {error.message || "An unexpected error occurred."}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
