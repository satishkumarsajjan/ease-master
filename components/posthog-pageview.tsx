"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { usePostHog } from "posthog-js/react"
import { useConsent } from "@/lib/consent"

export default function PostHogPageView(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()
  const { status } = useConsent()

  useEffect(() => {
    if (pathname && posthog && status === "accepted") {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }

      posthog.capture("$pageview", { $current_url: url })
    }
  }, [pathname, searchParams, posthog, status])

  return null
}
