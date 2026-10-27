"use client"

import * as React from "react"
import { motion } from "motion/react"

import { SidebarContent } from "@/components/layout/sidebar-content"
import { useHotkey } from "@/hooks/use-hotkey"
import { SPRING } from "@/lib/motion"
import { useSidebarStore } from "@/store/use-sidebar-store"

import type { DocsShellProps } from "../types"

/**
 * The "spatial" docs shell — the signature Satisium layout.
 *
 * The article sits on a card over a sidebar underlayer. `M` slides the sidebar
 * in and the card shifts right and scales to 0.95 on a pure GPU transform.
 *
 * Two surfaces, no borders and no shadows: the screen is `bg-muted` and the card
 * is `bg-background`, so a ~3% lightness step is the only thing separating them.
 * The outer margin (`p-1 sm:p-2`) equals the gutter the sidebar leaves behind,
 * which is what makes the card read as one object.
 *
 * The card is the element that scrolls the article, so it carries
 * `data-docs-scroll-root`. `useScrollSpy` resolves its observer root from that
 * marker — without it the spy watches the viewport and the TOC drifts. This shell
 * deliberately knows nothing about the TOC: where it sits is the page's call.
 *
 * `M` is the only shortcut — registered in lib/hotkeys.ts and bound through
 * useHotkey, so typing in an input never triggers it.
 */
export function SpatialLayout({ tree, children }: DocsShellProps) {
  const { isOpen, toggleSidebar } = useSidebarStore()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [isScrolledTop, setIsScrolledTop] = React.useState(false)
  const [isScrolledBottom, setIsScrolledBottom] = React.useState(false)

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    setIsScrolledTop(scrollTop > 4)
    setIsScrolledBottom(Math.ceil(scrollTop + clientHeight) < scrollHeight - 4)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    const ro = new ResizeObserver(() => checkScroll())
    const mo = new MutationObserver(() => checkScroll())
    ro.observe(el)
    mo.observe(el, { childList: true, subtree: true, attributes: true })
    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  }, [checkScroll])

  const scrollMaskStyle = React.useMemo<React.CSSProperties | undefined>(() => {
    if (isScrolledTop && isScrolledBottom) {
      return {
        maskImage:
          "linear-gradient(to bottom, transparent 0px, black 36px, black calc(100% - 64px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0px, black 36px, black calc(100% - 64px), transparent 100%)",
      }
    }
    if (isScrolledBottom) {
      return {
        maskImage:
          "linear-gradient(to bottom, black 0px, black calc(100% - 64px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0px, black calc(100% - 64px), transparent 100%)",
      }
    }
    if (isScrolledTop) {
      return {
        maskImage:
          "linear-gradient(to bottom, transparent 0px, black 36px, black 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0px, black 36px, black 100%)",
      }
    }
    return undefined
  }, [isScrolledTop, isScrolledBottom])

  useHotkey("m", toggleSidebar)

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-muted">
      {/* Sidebar background underlayer. A labelled <nav> so both shells expose the
          same landmark, and the M shortcut has something to move. */}
      <nav
        aria-label="Documentation navigation"
        className="absolute inset-y-0 left-0 z-0 flex w-[280px] flex-col px-4 py-6 sm:w-[320px] sm:px-6 sm:py-8"
      >
        <SidebarContent tree={tree} />
      </nav>

      {/* Main Card Wrapper (Pure GPU transform) */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 320 : 0,
          scale: isOpen ? 0.95 : 1,
        }}
        transition={SPRING.card}
        style={{ willChange: "transform" }}
        data-sidebar-open={isOpen}
        className="group/spatial absolute inset-0 z-10 origin-left p-(--docs-pane-gap) sm:p-[calc(var(--docs-pane-gap)*2)]"
      >
        {/* Toggle Menu Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-[calc(5rem+var(--docs-pane-gap))] left-(--docs-pane-gap) z-50 flex h-24 w-11 items-center justify-center rounded-r-sm bg-foreground text-background transition-all duration-300 hover:w-14 hover:bg-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:top-[calc(5rem+var(--docs-pane-gap)*2)] sm:left-[calc(var(--docs-pane-gap)*2)] dark:hover:text-foreground"
          aria-label="Toggle navigation menu (M)"
          title="Toggle navigation menu (M)"
        >
          <span className="rotate-180 text-[0.65rem] font-bold tracking-[0.2em] uppercase [writing-mode:vertical-rl]">
            Menu
          </span>
        </button>

        {/* Main Card Surface */}
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-background">
          {/* Event Capture + Preserved Scrolling */}
          <div
            ref={scrollRef}
            data-docs-scroll-root=""
            onScroll={checkScroll}
            style={scrollMaskStyle}
            className={`relative no-scrollbar h-full w-full overflow-y-auto scroll-smooth ${
              isOpen ? "cursor-pointer" : ""
            }`}
            onClickCapture={(e) => {
              if (isOpen) {
                e.preventDefault()
                e.stopPropagation()
                toggleSidebar()
              }
            }}
          >
            {/* Skip-link target — `tabIndex={-1}` moves focus, not just scroll. */}
            <main
              id="main-content"
              tabIndex={-1}
              className={`min-w-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                isOpen ? "pointer-events-none select-none" : ""
              }`}
            >
              {children}
            </main>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
