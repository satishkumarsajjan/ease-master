// hooks/use-scroll-spy.ts
"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * The docs shell marks the element that actually scrolls the article with this
 * attribute — `DocsPane size="main"`, or a spatial card. There is exactly one
 * per docs route.
 */
export const DOCS_SCROLL_ROOT = "[data-docs-scroll-root]"

/**
 * `root` overrides the lookup. Leave it null and the scroll root is resolved from
 * the marker above.
 *
 * This matters because both docs layouts scroll an inner element rather than the
 * document. An observer with no root watches the viewport, so the TOC highlights
 * silently drift away from the heading you are reading.
 */
export function useScrollSpy(
  ids: string[],
  offset: number = 100,
  root?: Element | null
) {
  const [activeId, setActiveId] = useState<string>("")
  const clickLockedIdRef = useRef<string | null>(null)
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const idsKey = ids.join(",")

  useEffect(() => {
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const observedRoot =
      root ?? document.querySelector<HTMLElement>(DOCS_SCROLL_ROOT)

    // Highly tuned rootMargin: It triggers when a heading hits the top 20% of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only update if we aren't locked into a programmatic click scroll
          if (entry.isIntersecting && !clickLockedIdRef.current) {
            setActiveId(entry.target.id)
          }
        })
      },
      { root: observedRoot, rootMargin: `-${offset}px 0px -80% 0px` }
    )

    const idList = idsKey ? idsKey.split(",") : []
    idList.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [idsKey, offset, root])

  // A manual setter we can call onClick
  const setClickId = useCallback((id: string) => {
    clickLockedIdRef.current = id
    setActiveId(id)

    if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
    lockTimerRef.current = setTimeout(() => {
      clickLockedIdRef.current = null
    }, 1500)
  }, [])

  return { activeId, setClickId }
}
