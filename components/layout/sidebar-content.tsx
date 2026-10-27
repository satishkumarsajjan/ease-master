"use client"

import type * as PageTree from "fumadocs-core/page-tree"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { FavouriteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { SidebarFooter } from "./sidebar-footer"
import { CommandMenuTrigger } from "./command-menu"
import { source } from "@/lib/source"

import { SatisiumLogo } from "@/components/satisium-logo"
import { Badge } from "@/components/ui/badge"
import { PRODUCT } from "@/lib/config"
import { useMounted } from "@/hooks/use-mounted"
import { ROUTES } from "@/lib/routes"
import { AUTHOR } from "@/lib/social-links"
import { cn } from "@/lib/utils"

type CustomPageNode = PageTree.Item & {
  badge?: string
  media?: { video?: string; image?: string; [key: string]: unknown }
}

function getComponentCount(node: PageTree.Node): number {
  if (node.type !== "folder" || !node.index) return 0
  const prefix = node.index.url + "/"
  return source
    .getPages()
    .filter((p) => p.data.component === true && p.url.startsWith(prefix)).length
}

/**
 * COMPONENT: The Pure Video Layer (Solid Physical Geometry)
 */
function VideoLayer({ url, poster }: { url: string; poster?: string }) {
  return (
    <div className="relative h-full w-full">
      <video
        src={url}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}

/**
 * COMPONENT: Liquid Tracking Preview Card (Center-Scale Overlap)
 */
function MediaPreviewCard({
  node,
  targetX,
  targetY,
}: {
  node: CustomPageNode | null
  targetX: MotionValue<number>
  targetY: MotionValue<number>
}) {
  const mounted = useMounted()

  const springConfig = { damping: 30, stiffness: 350, mass: 0.4 }
  const smoothX = useSpring(targetX, springConfig)
  const smoothY = useSpring(targetY, springConfig)

  if (!mounted || typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {node && node.media?.video && (
        <motion.div
          key="outer-tracking-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ x: smoothX, y: smoothY }}
          className="pointer-events-none fixed top-0 left-0 z-[9999] h-[175px] w-[280px] overflow-hidden rounded-[14px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-3xl"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={node.url}
              initial={{ scale: 0, opacity: 1, zIndex: 10 }}
              animate={{ scale: 1, opacity: 1, zIndex: 10 }}
              exit={{
                scale: 1,
                zIndex: 0,
                opacity: 0.99,
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 origin-center overflow-hidden rounded-[14px]"
            >
              <VideoLayer url={node.media.video} poster={node.media.image} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

/**
 * MAIN COMPONENT: SidebarContent
 */
export function SidebarContent({
  tree,
  headerAction,
}: {
  tree: PageTree.Root
  headerAction?: React.ReactNode
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const [isScrolledTop, setIsScrolledTop] = useState(false)
  const [isScrolledBottom, setIsScrolledBottom] = useState(false)

  // --- Hover Pill State ---
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null)

  // --- Liquid Hover Video Tracking State ---
  const [previewNode, setPreviewNode] = useState<CustomPageNode | null>(null)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
      if (leaveTimeout.current) clearTimeout(leaveTimeout.current)
    }
  }, [])

  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)

  const handlePointerMove = (e: React.PointerEvent) => {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(hover: hover)").matches
    )
      return

    const { clientX, clientY } = e
    const cardWidth = 280
    const cardHeight = 175
    const gap = 24

    let nextX = clientX + gap
    let nextY = clientY + gap

    if (nextX + cardWidth > window.innerWidth - 16)
      nextX = clientX - gap - cardWidth
    if (nextY + cardHeight > window.innerHeight - 16)
      nextY = clientY - gap - cardHeight

    targetX.set(nextX)
    targetY.set(nextY)
  }

  const handleMouseEnterVideo = (node: CustomPageNode) => {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(hover: hover)").matches
    )
      return
    const page = source.getPages().find((p) => p.url === node.url)
    if (!page || !page.data.media || !page.data.media.video) return

    if (leaveTimeout.current) clearTimeout(leaveTimeout.current)

    const nodeWithMedia = { ...node, media: page.data.media }
    hoverTimeout.current = setTimeout(() => setPreviewNode(nodeWithMedia), 500)
  }

  const handleMouseLeaveVideo = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    leaveTimeout.current = setTimeout(() => setPreviewNode(null), 150)
  }

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setIsScrolledTop(scrollTop > 0)
    setIsScrolledBottom(Math.ceil(scrollTop + clientHeight) < scrollHeight - 1)
  }, [])

  useEffect(() => {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!scrollRef.current) return
      const activeEl = scrollRef.current.querySelector(
        '[data-active-item="true"]'
      )
      if (activeEl)
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const container = scrollRef.current
      if (!container) return
      const links = Array.from(
        container.querySelectorAll('[data-sidebar-link="true"]')
      ) as HTMLElement[]
      if (links.length === 0) return

      const currentIndex = links.indexOf(document.activeElement as HTMLElement)
      e.preventDefault()

      if (e.key === "ArrowDown") {
        const nextIndex =
          currentIndex >= 0 ? (currentIndex + 1) % links.length : 0
        links[nextIndex]?.focus()
      } else if (e.key === "ArrowUp") {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1
        links[prevIndex]?.focus()
      }
    }
  }

  return (
    <div
      className="flex h-full w-full flex-col font-sans"
      onPointerMove={handlePointerMove}
    >
      <MediaPreviewCard
        node={previewNode}
        targetX={targetX}
        targetY={targetY}
      />

      {/* --- SIDEBAR BRANDING (Replaced) --- */}
      <div className="mb-6 flex flex-none items-center justify-between px-4 pt-4">
        <Link
          href={ROUTES.home}
          className="group flex min-w-0 items-center gap-2.5 rounded-md transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {/* Logo with hover lift */}
          <div className="flex size-7 shrink-0 items-center justify-center">
            <SatisiumLogo size="100%" />
          </div>

          {/* Text + Superscript Badge */}
          <div className="flex min-w-0 items-start">
            <span className="truncate font-heading text-base font-bold tracking-tight text-foreground">
              {PRODUCT.name}
            </span>
            <Badge className="-mt-1 ml-1.5 h-[18px] shrink-0 rounded-[5px] border-none bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground hover:bg-primary">
              Beta
            </Badge>
          </div>
        </Link>
        {headerAction}
      </div>

      <div className="relative mb-2 flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Subtle progressive blur top vignette */}
        <div
          aria-hidden="true"
          className={cn(
            "progressive-blur-top-muted pointer-events-none absolute top-0 right-0 left-0 z-20 h-8 transition-opacity duration-300 select-none",
            isScrolledTop ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          onKeyDown={handleKeyDown}
          className="no-scrollbar flex-1 overflow-y-auto scroll-smooth"
        >
          <LayoutGroup id="sidebar-nav">
            <nav
              className="flex flex-col gap-0.5 px-2 pt-2 pb-6"
              onMouseLeave={() => setHoveredUrl(null)}
            >
              {tree.children.map((node, i) => (
                <TreeNode
                  key={node.type === "page" ? node.url : `sidebar-node-${i}`}
                  node={node}
                  depth={0}
                  hoveredUrl={hoveredUrl}
                  setHoveredUrl={setHoveredUrl}
                  onMouseEnterVideo={handleMouseEnterVideo}
                  onMouseLeaveVideo={handleMouseLeaveVideo}
                />
              ))}
            </nav>
          </LayoutGroup>
        </div>

        {/* Subtle progressive blur bottom vignette */}
        <div
          aria-hidden="true"
          className={cn(
            "progressive-blur-bottom-muted pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-10 transition-opacity duration-300 select-none",
            isScrolledBottom ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      <div className="flex flex-col gap-2 rounded-3xl border border-border bg-background p-2 drop-shadow-2xl dark:drop-shadow-none">
        <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-border bg-muted p-2">
          <CommandMenuTrigger />
          <SidebarFooter />
        </div>
        <div className="flex items-center justify-center gap-1.5 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground">
          <span>Built with</span>
          <HugeiconsIcon
            icon={FavouriteIcon}
            className="size-3 text-destructive"
          />
          <span>by</span>
          <Link
            href={AUTHOR.website || AUTHOR.x}
            target="_blank"
            className="text-primary hover:underline focus-visible:outline-none"
          >
            {AUTHOR.name}
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * TreeNode Component
 */
function TreeNode({
  node,
  depth,
  hoveredUrl,
  setHoveredUrl,
  onMouseEnterVideo,
  onMouseLeaveVideo,
}: {
  node: PageTree.Node
  depth: number
  hoveredUrl: string | null
  setHoveredUrl: (url: string | null) => void
  onMouseEnterVideo: (n: CustomPageNode) => void
  onMouseLeaveVideo: () => void
}) {
  const pathname = usePathname()

  if (node.type === "separator") {
    return (
      <div className="mt-5 mb-1.5 px-3">
        <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          {node.name}
        </span>
      </div>
    )
  }

  if (node.type === "page") {
    const isActive = pathname === node.url
    const customNode = node as CustomPageNode

    return (
      <Link
        href={node.url}
        data-sidebar-link="true"
        data-active-item={isActive ? "true" : undefined}
        aria-current={isActive ? "page" : undefined}
        onMouseEnter={() => {
          setHoveredUrl(node.url)
          onMouseEnterVideo(customNode)
        }}
        onMouseLeave={onMouseLeaveVideo}
        className="group relative flex h-8 items-center justify-between gap-2.5 rounded-[10px] px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {/* Persistent Active State Indicator (glides between routes on click) */}
        {isActive && (
          <motion.div
            layoutId="sidebar-active-indicator"
            className="absolute inset-0 z-[2] rounded-[10px] bg-foreground"
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 32,
              mass: 0.8,
            }}
          />
        )}

        {/* Gliding Liquid Hover Pill: borderless bg-background in light mode, dark:bg-accent in dark mode */}
        {hoveredUrl === node.url && (
          <motion.div
            layoutId="sidebar-hover-indicator"
            className="absolute inset-0 z-[1] rounded-[10px] bg-sidebar-accent"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.6,
            }}
          />
        )}

        <div className="relative z-10 flex min-w-0 flex-1 items-center gap-2.5">
          {node.icon && (
            <span
              className={cn(
                "flex shrink-0 items-center justify-center transition-colors [&_svg]:size-4",
                isActive ? "text-background" : "text-muted-foreground"
              )}
            >
              {node.icon}
            </span>
          )}
          <span
            className={cn(
              "truncate text-[13px] transition-colors",
              isActive
                ? "font-medium text-background"
                : "font-normal text-foreground"
            )}
          >
            {node.name}
          </span>
        </div>

        {customNode.badge && (
          <span
            className={cn(
              "relative z-10 ml-auto shrink-0 rounded-[6px] px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {customNode.badge}
          </span>
        )}
      </Link>
    )
  }

  if (node.type === "folder") {
    const indexPage = node.index as CustomPageNode | undefined
    const isIndexActive = indexPage ? pathname === indexPage.url : false

    return (
      <div className="mt-2.5 flex flex-col">
        {indexPage ? (
          <Link
            href={indexPage.url}
            data-sidebar-link="true"
            data-active-item={isIndexActive ? "true" : undefined}
            aria-current={isIndexActive ? "page" : undefined}
            onMouseEnter={() => {
              setHoveredUrl(indexPage.url)
              onMouseEnterVideo(indexPage)
            }}
            onMouseLeave={onMouseLeaveVideo}
            className="group relative flex h-8 items-center justify-between gap-2.5 rounded-[10px] px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {isIndexActive && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="absolute inset-0 z-[2] rounded-[10px] bg-foreground"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 32,
                  mass: 0.8,
                }}
              />
            )}

            {hoveredUrl === indexPage.url && (
              <motion.div
                layoutId="sidebar-hover-indicator"
                className="absolute inset-0 z-[1] rounded-[10px] bg-sidebar-accent"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.6,
                }}
              />
            )}

            <div className="relative z-10 flex min-w-0 flex-1 items-center gap-2">
              {node.icon && (
                <span
                  className={cn(
                    "flex shrink-0 transition-colors [&_svg]:size-4",
                    isIndexActive ? "text-background" : "text-muted-foreground"
                  )}
                >
                  {node.icon}
                </span>
              )}
              <span
                className={cn(
                  "truncate text-[12px] font-semibold tracking-tight transition-colors",
                  isIndexActive ? "text-background" : "text-foreground"
                )}
              >
                {node.name}
              </span>
            </div>

            <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1.5">
              {indexPage.badge && (
                <span
                  className={cn(
                    "rounded-[6px] px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase transition-colors",
                    isIndexActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {indexPage.badge}
                </span>
              )}
              {node.children && node.children.length > 0 && (
                <span
                  className={cn(
                    "text-[12px] font-medium transition-colors",
                    isIndexActive ? "text-background" : "text-muted-foreground"
                  )}
                >
                  {getComponentCount(node)}
                </span>
              )}
            </div>
          </Link>
        ) : (
          <div className="flex h-8 min-w-0 items-center gap-2 px-3 text-sm">
            {node.icon && (
              <span className="shrink-0 font-bold text-muted-foreground [&_svg]:size-4">
                {node.icon}
              </span>
            )}
            <span className="truncate text-[12px] font-semibold tracking-tight text-foreground">
              {node.name}
            </span>
          </div>
        )}

        <div className="relative mt-0.5 flex flex-col gap-0.5">
          <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-2">
            {node.children.map((child, idx) => (
              <TreeNode
                key={
                  child.type === "page"
                    ? child.url
                    : "$id" in child && typeof child.$id === "string"
                      ? child.$id
                      : `child-${idx}`
                }
                node={child}
                depth={depth + 1}
                hoveredUrl={hoveredUrl}
                setHoveredUrl={setHoveredUrl}
                onMouseEnterVideo={onMouseEnterVideo}
                onMouseLeaveVideo={onMouseLeaveVideo}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}
