"use client"

import * as React from "react"

import type { DocsAsideBreakpoint } from "./types"
import { cn } from "@/lib/utils"

/**
 * The docs shell: one muted screen, and the panes that float inside it.
 *
 * There are no borders and no shadows anywhere in this project — see BUILD.md
 * hard rule 9a. Depth comes from the achromatic surface ramp instead: the screen
 * is `bg-muted`, the panes are `bg-background`, and ~3% of lightness is the only
 * thing separating them. Radius is the only shape signal, so it comes from the
 * `--radius` token rather than a hardcoded value.
 *
 * Two rules make the result read as one object rather than a set of floating
 * cards, and both are load-bearing:
 *
 * 1. The screen's outer margin equals the gutter between panes. They share one
 *    token, `--docs-pane-gap`, so they cannot drift apart.
 * 2. Panes scroll independently, which needs `min-h-0` — without it a flex or
 *    grid child refuses to shrink and the pane scrolls the screen instead.
 */

export interface DocsScreenProps {
  children: React.ReactNode
  className?: string
}

export function DocsScreen({ children, className }: DocsScreenProps) {
  return (
    <div
      data-docs-screen=""
      className={cn(
        // `h-dvh`, not `h-screen`: 100vh is the tallest viewport, so on iOS the
        // bottom of the docs hides under the browser chrome.
        "h-dvh w-full overflow-hidden bg-muted p-(--docs-pane-gap) sm:p-[calc(var(--docs-pane-gap)*2)]",
        className
      )}
    >
      {children}
    </div>
  )
}

export type DocsPaneSize = "sidebar" | "main" | "toc" | "aside"

export interface DocsPaneProps {
  children: React.ReactNode
  /** Fixed rails use their token width; `main` is the flexible article pane. */
  size?: DocsPaneSize
  /**
   * Mark this pane as the element that scrolls the article's headings.
   *
   * `useScrollSpy` resolves its observer root from this marker, so a layout never
   * has to thread a ref down to the TOC. Exactly one element per docs route
   * should carry it — if the article scrolls somewhere else, its scroll spy
   * silently watches the viewport and the highlights drift.
   */
  scrollRoot?: boolean
  "aria-label"?: string
  className?: string
}

/**
 * Padding belongs to the pane, not to the layout that renders it.
 *
 * It used to live in the spatial layout's wrapper, so any other layout that
 * forgot the wrapper shipped a rail flush against the pane edge — zero inset.
 * Encapsulating it removes the bug class, not one instance of it.
 *
 * Uniform and slim: the nav items and rail cards carry their own inner padding,
 * so anything more than `p-2` here is double-counting. `main` is deliberately
 * bare — the docs page owns its article padding, because the article's width is
 * page knowledge.
 */
const PANE_PADDING: Record<DocsPaneSize, string> = {
  sidebar: "p-2",
  main: "",
  toc: "",
  aside: "p-2",
}

const PANE_SIZE: Record<DocsPaneSize, string> = {
  sidebar: "w-(--docs-sidebar-w) shrink-0",
  main: "min-w-0 flex-1",
  toc: "w-(--docs-toc-w) shrink-0",
  aside: "w-(--docs-aside-w) shrink-0",
}

/**
 * Each pane gets the landmark it actually is. Rendering all three as `<section>`
 * would give a screen reader three identically-typed landmarks and no way to
 * tell the navigation from the sponsorship.
 */
const PANE_ELEMENT = {
  sidebar: "nav",
  main: "main",
  toc: "nav",
  aside: "aside",
} as const

export function DocsPane({
  children,
  size = "main",
  scrollRoot,
  className,
  "aria-label": ariaLabel,
}: DocsPaneProps) {
  const Element = PANE_ELEMENT[size] as React.ElementType
  const scrollRef = React.useRef<HTMLElement>(null)
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
    if (!scrollRoot) return
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
  }, [scrollRoot, checkScroll])

  const scrollMaskStyle = React.useMemo<React.CSSProperties | undefined>(() => {
    if (!scrollRoot) return undefined
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
  }, [scrollRoot, isScrolledTop, isScrolledBottom])

  return (
    <div
      className={cn(
        "relative min-h-0 rounded-xl bg-background",
        PANE_SIZE[size],
        className
      )}
    >
      <Element
        ref={scrollRef}
        data-docs-pane={size}
        data-docs-scroll-root={scrollRoot ? "" : undefined}
        aria-label={ariaLabel}
        // Skip-link target. `tabIndex={-1}` lets the link move focus here, not just
        // scroll — without it the first Tab still walks the whole sidebar.
        id={size === "main" ? "main-content" : undefined}
        tabIndex={size === "main" ? -1 : undefined}
        onScroll={scrollRoot ? checkScroll : undefined}
        style={scrollMaskStyle}
        className={cn(
          "no-scrollbar h-full min-h-0 w-full overflow-y-auto scroll-smooth rounded-xl bg-background",
          PANE_PADDING[size],
          size === "main" &&
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        )}
      >
        {children}
      </Element>
    </div>
  )
}

/** Tailwind classes that hide a rail below the breakpoint the developer chose. */
const HIDE_BELOW: Record<DocsAsideBreakpoint, string> = {
  sm: "max-sm:hidden",
  md: "max-md:hidden",
  lg: "max-lg:hidden",
  xl: "max-xl:hidden",
  "2xl": "max-2xl:hidden",
}

/** Resolve `asideHideBelow` to its class. Defaults to `2xl`. */
export function hideBelowClass(
  asideHideBelow: DocsAsideBreakpoint = "2xl"
): string {
  return HIDE_BELOW[asideHideBelow]
}
