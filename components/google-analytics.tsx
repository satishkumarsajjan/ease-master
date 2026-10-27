"use client"

import { useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { GoogleAnalytics as NextGA } from "@next/third-parties/google"
import { useConsent } from "@/lib/consent"

function PageViewTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || typeof window === "undefined") return

    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    if (typeof w.gtag !== "function") return

    const search = searchParams?.toString()
    const url = search ? `${pathname}?${search}` : pathname

    w.gtag("config", gaId, {
      page_path: url,
    })
  }, [pathname, searchParams, gaId])

  return null
}

export function GoogleAnalytics() {
  const { status } = useConsent()
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  // If consent is not accepted, or GA ID is missing, inject absolutely nothing.
  if (status !== "accepted" || !gaId) return null

  return (
    <>
      <NextGA gaId={gaId} />
      <Suspense fallback={null}>
        <PageViewTracker gaId={gaId} />
      </Suspense>
    </>
  )
}
