"use client"

import Link from "next/link"
import { useConsent } from "@/lib/consent" // Adjust path if needed
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

export function ConsentBanner() {
  const { status, isInitialized, accept, decline } = useConsent()

  // Wait until we've checked localStorage to prevent the "flash" on refresh.
  // If initialized and not pending, we also render nothing.
  if (!isInitialized || status !== "pending") return null

  return (
    // Added animate-in classes so it enters gracefully for first-time users
    <div className="fixed right-0 bottom-0 left-0 z-50 animate-in border-t bg-background duration-500 ease-out fade-in slide-in-from-bottom-8">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-16">
        <p className="text-sm text-muted-foreground">
          We use analytics to understand how our components are used and to
          improve the documentation experience. No personal data is sold or
          shared. Review our{" "}
          <Link
            href={ROUTES.privacy}
            className="underline underline-offset-4 hover:text-foreground"
          >
            privacy policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="ghost" size="sm" onClick={decline}>
            Decline
          </Button>
          <Button
            size="sm"
            className="bg-foreground text-background hover:bg-foreground"
            onClick={accept}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
