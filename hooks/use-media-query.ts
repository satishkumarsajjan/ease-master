"use client"

import { useCallback, useSyncExternalStore } from "react"

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined" || !("matchMedia" in window)) {
        return () => {}
      }
      const media = window.matchMedia(query)
      media.addEventListener("change", callback)
      return () => media.removeEventListener("change", callback)
    },
    [query]
  )

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) {
      return false
    }
    return window.matchMedia(query).matches
  }, [query])

  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)")
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)")
/** True on devices with a real pointer — the MinimalThemeSwitcher already probes this inline. */
export const useCanHover = () => useMediaQuery("(hover: hover)")

/**
 * Where the docs sidebar pane appears — derived, not chosen.
 *
 * Comfortable prose needs ~700px. With a TOC (200) and the gap (48) inside the
 * article pane, a 240px sidebar rail and the chrome, that budget only balances
 * at 1280. Below it the article is squeezed, so the sidebar becomes a drawer.
 *
 * This is deliberately NOT `useIsDesktop` (1024) — at 1024 the sidebar and the
 * TOC both appear and the prose drops to ~430px.
 */
export const DOCS_SIDEBAR_BREAKPOINT = "(min-width: 1280px)"
export const useIsDocsSidebarVisible = () =>
  useMediaQuery(DOCS_SIDEBAR_BREAKPOINT)
