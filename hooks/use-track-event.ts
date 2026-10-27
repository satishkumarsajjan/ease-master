"use client"

import { useCallback, useRef } from "react"
import { trackEvent } from "@/lib/analytics"

export function useTrackEvent() {
  const pendingRef = useRef<Set<string>>(new Set())

  const track = useCallback(
    (
      eventName: string,
      properties?: Record<string, unknown>,
      incrementPublicCounter?: "web_copy" | "page_view"
    ) => {
      const key = `${eventName}:${JSON.stringify(properties || {})}`

      if (pendingRef.current.has(key)) return

      pendingRef.current.add(key)

      trackEvent(eventName, properties, incrementPublicCounter).finally(() => {
        setTimeout(() => {
          pendingRef.current.delete(key)
        }, 1000)
      })
    },
    []
  )

  return track
}
