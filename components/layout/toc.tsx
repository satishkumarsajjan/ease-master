// components/layout/toc.tsx
"use client"

import { useMounted } from "@/hooks/use-mounted"
import { useScrollSpy } from "@/hooks/use-scroll-spy"
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "motion/react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState, useRef } from "react"
import { createPortal } from "react-dom"

export type TOCItemType = {
  title: React.ReactNode
  url: string
  depth: number
}

// Internal type for geometry data
type ExtendedTOCItem = TOCItemType & {
  index: number
  x: number
  y: number
  isParent: boolean
}

// --------------------------------------------------------
// STRICT GEOMETRY & TIMING ENGINE
// --------------------------------------------------------
const ITEM_HEIGHT = 32
const INDENT_WIDTH = 16
const X_OFFSET = 8
const CORNER_RADIUS = 8

const ACTIVE_DURATION = 0.6
const HOVER_DURATION = 0.3
const LIQUID_STRETCH_DELAY = 0.9

// --------------------------------------------------------
// UTILITY: Client Portal
// --------------------------------------------------------
function ClientPortal({ children }: { children: React.ReactNode }) {
  const mounted = useMounted()
  if (!mounted || typeof document === "undefined") return null
  return createPortal(children, document.body)
}

// --------------------------------------------------------
// SUB-COMPONENT: Item
// --------------------------------------------------------
function TOCListItem({
  pt,
  isActive,
  setClickId,
  setHoveredIndex,
  setActiveOverlay,
}: {
  pt: ExtendedTOCItem
  isActive: boolean
  setClickId: (id: string) => void
  setHoveredIndex: (index: number | null) => void
  setActiveOverlay: (
    val: { title: React.ReactNode; rect: DOMRect; index: number } | null
  ) => void
}) {
  const textRef = useRef<HTMLSpanElement>(null)

  const handleMouseEnter = () => {
    setHoveredIndex(pt.index)

    // JIT Measurement: If text is wider than the container, trigger the overlay
    const el = textRef.current
    if (el && el.scrollWidth > el.clientWidth) {
      const rect = el.getBoundingClientRect()
      setActiveOverlay({ title: pt.title, rect, index: pt.index })
    }
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setActiveOverlay(null)
  }

  return (
    <Link
      href={pt.url}
      data-index={pt.index}
      onClick={() => setClickId(pt.url.substring(1))}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-8 w-full items-center rounded-[12px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      style={{ paddingLeft: pt.x + 16 }}
    >
      <span
        ref={textRef}
        className={`w-full truncate text-[13px] transition-colors duration-300 ${
          isActive
            ? "font-medium text-foreground"
            : "text-muted-foreground group-hover:text-foreground"
        }`}
      >
        {pt.title}
      </span>
    </Link>
  )
}

// --------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------
/**
 * The scroll root is resolved from the docs shell's `data-docs-scroll-root`
 * marker, so a layout that scrolls its article does not have to wire anything
 * through here. Pass `root` only to override that.
 */
export function TableOfContents({
  items,
  root,
}: {
  items: TOCItemType[]
  root?: Element | null
}) {
  const headingIds = useMemo(
    () => items.map((item) => item.url.substring(1)),
    [items]
  )
  const { activeId, setClickId } = useScrollSpy(headingIds, 100, root)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeOverlay, setActiveOverlay] = useState<{
    title: React.ReactNode
    rect: DOMRect
    index: number
  } | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll Indicators State
  const [isScrolledTop, setIsScrolledTop] = useState(false)
  const [isScrolledBottom, setIsScrolledBottom] = useState(false)

  const minDepth = items.length > 0 ? Math.min(...items.map((i) => i.depth)) : 0

  // 1. Calculate Coordinates and Path Lengths
  const { points, pathD, nodeLengths, totalLength, totalHeight } =
    useMemo(() => {
      if (!items || items.length === 0)
        return {
          points: [],
          pathD: "",
          nodeLengths: [],
          totalLength: 0,
          totalHeight: 0,
        }

      const pts: ExtendedTOCItem[] = items.map((item, index) => {
        const normalizedDepth = item.depth - minDepth
        const x = normalizedDepth * INDENT_WIDTH + X_OFFSET
        const y = index * ITEM_HEIGHT + ITEM_HEIGHT / 2
        return { ...item, index, x, y, isParent: normalizedDepth === 0 }
      })

      let d = ""
      let currentLength = 0
      const lengths: number[] = []

      pts.forEach((pt, i) => {
        if (i === 0) {
          d += `M ${pt.x} ${pt.y} `
          lengths.push(0)
        } else {
          const prev = pts[i - 1]
          if (pt.x === prev.x) {
            d += `L ${pt.x} ${pt.y} `
            currentLength += Math.abs(pt.y - prev.y)
          } else {
            const midY = (prev.y + pt.y) / 2
            const dir = pt.x > prev.x ? 1 : -1
            const diffX = Math.abs(pt.x - prev.x)
            const diffY = Math.abs(pt.y - prev.y)
            const r = Math.min(CORNER_RADIUS, diffX / 2, diffY / 2)
            d += `L ${prev.x} ${midY - r} `
            d += `Q ${prev.x} ${midY}, ${prev.x + dir * r} ${midY} `
            d += `L ${pt.x - dir * r} ${midY} `
            d += `Q ${pt.x} ${midY}, ${pt.x} ${midY + r} `
            d += `L ${pt.x} ${pt.y} `
            currentLength += diffY - 2 * r + diffX - 2 * r + Math.PI * r
          }
          lengths.push(currentLength)
        }
      })
      return {
        points: pts,
        pathD: d,
        nodeLengths: lengths,
        totalLength: currentLength,
        totalHeight: items.length * ITEM_HEIGHT,
      }
    }, [items, minDepth])

  // 2. Identify Nodes & Liquid Physics Engine
  const activeIndex = Math.max(
    0,
    points.findIndex((p) => p.url.substring(1) === activeId)
  )
  let parentIndex = 0
  for (let i = activeIndex; i >= 0; i--) {
    if (points[i] && points[i].isParent) {
      parentIndex = i
      break
    }
  }

  const targetStartRatio =
    totalLength > 0 ? nodeLengths[parentIndex] / totalLength : 0
  const targetEndRatio =
    totalLength > 0 ? nodeLengths[activeIndex] / totalLength : 0

  const motionStart = useMotionValue(targetStartRatio)
  const motionEnd = useMotionValue(targetEndRatio)

  useEffect(() => {
    const animEnd = animate(motionEnd, targetEndRatio, {
      type: "spring",
      bounce: 0,
      duration: ACTIVE_DURATION,
    })
    const animStart = animate(motionStart, targetStartRatio, {
      type: "spring",
      bounce: 0,
      duration: ACTIVE_DURATION + LIQUID_STRETCH_DELAY,
    })
    return () => {
      animEnd.stop()
      animStart.stop()
    }
  }, [targetStartRatio, targetEndRatio, motionStart, motionEnd])

  // 3. Auto-Scroll tracking
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const activeElement = container.querySelector(
      `[data-index="${activeIndex}"]`
    ) as HTMLElement

    if (activeElement) {
      // ✨ BULLETPROOF FIX: Calculate offset manually to scroll ONLY the TOC container
      // This centers the active item in the sidebar without scrolling the whole page!
      const offsetTop = activeElement.offsetTop
      const containerHalfHeight = container.clientHeight / 2
      const elementHalfHeight = activeElement.clientHeight / 2

      container.scrollTo({
        top: offsetTop - containerHalfHeight + elementHalfHeight,
        behavior: "smooth",
      })
    }
  }, [activeIndex])

  // 4. Progressive Blur Scroll Math
  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    setIsScrolledTop(scrollTop > 0)
    setIsScrolledBottom(Math.ceil(scrollTop + clientHeight) < scrollHeight - 1)
  }, [])

  // 5. Observers for Resize, Mutations, and Global Page Scroll
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    checkScroll() // Initial check

    const resizeObserver = new ResizeObserver(() => checkScroll())
    resizeObserver.observe(el)

    const mutationObserver = new MutationObserver(() => checkScroll())
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    const handleWindowScroll = () => setActiveOverlay(null)
    window.addEventListener("scroll", handleWindowScroll, { passive: true })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener("scroll", handleWindowScroll)
    }
  }, [checkScroll])

  const handleContainerScroll = () => {
    checkScroll()
    setActiveOverlay(null)
  }

  const wireOffsetRatio = useTransform(() =>
    Math.min(motionStart.get(), motionEnd.get())
  )
  const wireLengthRatio = useTransform(() =>
    Math.max(Math.abs(motionEnd.get() - motionStart.get()), 0)
  )
  const safeLength = Math.max(totalLength, 1)

  const wireStrokeDasharray = useTransform(
    wireLengthRatio,
    (l) => `${l * safeLength} ${safeLength * 2}`
  )
  const wireStrokeDashoffset = useTransform(
    wireOffsetRatio,
    (o) => `-${o * safeLength}`
  )
  const motionStartOffset = useTransform(
    motionStart,
    (o) => `-${o * safeLength}`
  )
  const motionEndOffset = useTransform(motionEnd, (o) => `-${o * safeLength}`)

  if (!items || items.length === 0) return null

  return (
    <>
      <ClientPortal>
        <AnimatePresence>
          {activeOverlay && (
            <motion.div
              key="toc-overlay"
              initial={{ opacity: 0, y: "-40%", scale: 0.96 }}
              animate={{ opacity: 1, y: "-50%", scale: 1 }}
              exit={{ opacity: 0, y: "-40%", scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="pointer-events-none fixed z-[9999] flex w-max max-w-[280px] items-center rounded-[16px] bg-background px-3.5 py-2 text-[13px] leading-relaxed font-medium whitespace-normal text-foreground backdrop-blur-md"
              style={{
                top: activeOverlay.rect.top + activeOverlay.rect.height / 2,
                left: activeOverlay.rect.left - 12,
              }}
            >
              {activeOverlay.title}
            </motion.div>
          )}
        </AnimatePresence>
      </ClientPortal>

      <nav
        className={`flex max-h-[calc(100vh-16rem)] w-full flex-col transition-all duration-300 ${
          activeOverlay ? "opacity-30 blur-[3px]" : ""
        }`}
        aria-label="Table of Contents"
      >
        <span className="mb-6 shrink-0 font-heading text-[1rem] font-bold text-muted-foreground">
          On this page
        </span>

        {/* 
          PROGRESSIVE BLUR WRAPPER 
          Needs `min-h-0` and `overflow-hidden` to bound the relative overlays exactly to the viewport
        */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Top Blur Overlay */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: isScrolledTop ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            // Uses bg-background instead of bg-muted to blend seamlessly with your page
            className="pointer-events-none absolute top-0 right-0 left-0 z-20 h-16 bg-background mask-[linear-gradient(to_bottom,black,transparent)] backdrop-blur-sm [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]"
          />

          <div
            ref={scrollContainerRef}
            onScroll={handleContainerScroll}
            // Removed the old static mask class, keeping scrollbars hidden natively
            className="flex-1 [scrollbar-width:none] overflow-y-auto pb-12 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="relative" style={{ height: totalHeight }}>
              {/* SVG TRACKS */}
              <svg
                className="pointer-events-none absolute inset-y-0 left-0 w-20 text-border"
                style={{ height: totalHeight }}
              >
                <path
                  d={pathD}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points
                  .filter((p) => p.isParent)
                  .map((pt, i) => (
                    <circle
                      key={`base-dot-${i}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={3.5}
                      fill="currentColor"
                    />
                  ))}
              </svg>

              {/* HOVER DOT */}
              <svg
                className="pointer-events-none absolute inset-y-0 left-0 w-20 text-primary"
                style={{ height: totalHeight }}
              >
                <motion.circle
                  initial={false}
                  animate={{
                    cx:
                      hoveredIndex !== null
                        ? points[hoveredIndex]?.x
                        : points[activeIndex]?.x || X_OFFSET,
                    cy:
                      hoveredIndex !== null
                        ? points[hoveredIndex]?.y
                        : points[activeIndex]?.y || ITEM_HEIGHT / 2,
                    opacity:
                      hoveredIndex !== null && hoveredIndex !== activeIndex
                        ? 0.3
                        : 0,
                  }}
                  r={3.5}
                  fill="currentColor"
                  transition={{
                    type: "spring",
                    bounce: 0,
                    duration: HOVER_DURATION,
                  }}
                />
              </svg>

              {/* ACTIVE LIQUID TRACK */}
              <svg
                className="pointer-events-none absolute inset-y-0 left-0 w-20 text-primary"
                style={{ height: totalHeight }}
              >
                <motion.path
                  d={pathD}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: wireStrokeDasharray,
                    strokeDashoffset: wireStrokeDashoffset,
                  }}
                />
                <motion.path
                  d={pathD}
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: `0.01 ${safeLength * 2}`,
                    strokeDashoffset: motionStartOffset,
                  }}
                />
                <motion.path
                  d={pathD}
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: `0.01 ${safeLength * 2}`,
                    strokeDashoffset: motionEndOffset,
                  }}
                />
              </svg>

              {/* INTERACTIVE TEXT LINKS */}
              <div className="relative flex w-full flex-col">
                {points.map((pt) => (
                  <TOCListItem
                    key={pt.url}
                    pt={pt}
                    isActive={activeIndex === pt.index}
                    setClickId={setClickId}
                    setHoveredIndex={setHoveredIndex}
                    setActiveOverlay={setActiveOverlay}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Blur Overlay */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: isScrolledBottom ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-16 bg-background mask-[linear-gradient(to_top,black,transparent)] backdrop-blur-sm [-webkit-mask-image:linear-gradient(to_top,black,transparent)]"
          />
        </div>
      </nav>
    </>
  )
}
