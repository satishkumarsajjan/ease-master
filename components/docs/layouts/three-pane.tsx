"use client"

import * as React from "react"
import { SidebarLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"

import { DocsPane, DocsScreen, hideBelowClass } from "@/components/docs/shell"
import { SidebarContent } from "@/components/layout/sidebar-content"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useHotkey } from "@/hooks/use-hotkey"
import { useSidebarStore } from "@/store/use-sidebar-store"
import { SPRING } from "@/lib/motion"
import { cn } from "@/lib/utils"

import type { DocsShellProps } from "../types"

/**
 * The "three-pane" docs shell — borderless sidebar | article | optional rail.
 *
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │ ┌ sidebar ┐ ┌──────────── article ──────────┐ ┌ aside ───┐  │
 *   │ │          │ │  ┌──────────┐   ┌────────┐   │ │          │  │
 *   │ │          │ │  │   MDX    │   │  TOC   │   │ │ sponsor  │  │
 *   │ └──────────┘ │  └──────────┘   └────────┘   │ └──────────┘  │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * Same two surfaces as `spatial` — a `bg-muted` screen and `bg-background`
 * panes, no borders and no shadows. The TOC is a sub-column *inside* the article
 * pane, not a sibling pane, and the third rail exists only when the developer
 * passes `aside`.
 *
 * The screen's outer margin and the gutter between panes are the same token, so
 * the panes read as one object rather than three floating cards.
 *
 * Extreme panes slide smoothly on hardware-accelerated transforms using `SPRING.card`,
 * creating the physical illusion of the center pane expanding and shrinking.
 *
 * `M` is the shortcut — registered in lib/hotkeys.ts and bound through
 * useHotkey, so typing in an input never triggers it.
 */
export function ThreePaneLayout({
  tree,
  page,
  children,
  aside,
  asideHideBelow,
}: DocsShellProps) {
  const toggleSidebarStore = useSidebarStore((s) => s.toggleSidebar)

  // Desktop sidebar starts open and can be collapsed by the viewer.
  const [isDesktopOpen, setIsDesktopOpen] = React.useState(true)

  // Mobile drawer (<Sheet>) is independently tracked so closing it on mobile
  // never corrupts the desktop sidebar state upon window resize / rotation.
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = React.useState(pathname)

  // Auto-close mobile drawer when route changes (render-time adjustment avoids cascading renders)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setIsMobileOpen(false)
  }

  const onToggle = React.useCallback(() => {
    toggleSidebarStore()
    // If currently on desktop (>= 1280px / xl), toggle desktop sidebar pane
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1280px)").matches
    ) {
      setIsDesktopOpen((prev) => !prev)
    } else {
      // On mobile / tablet (< 1280px), toggle mobile drawer
      setIsMobileOpen((prev) => !prev)
    }
  }, [toggleSidebarStore])

  useHotkey("m", onToggle)

  const isAsideHidden = Boolean(page?.hideAside)
  const showAside = aside != null && !isAsideHidden

  return (
    <div className="font-sans">
      <DocsScreen>
        <div className="flex h-full min-h-0 gap-(--docs-pane-gap) sm:gap-[calc(var(--docs-pane-gap)*2)]">
          {/* Desktop Sidebar Pane — sliding extreme left wing */}
          <motion.div
            initial={false}
            animate={{
              width: isDesktopOpen ? "var(--docs-sidebar-w)" : 0,
              marginRight: isDesktopOpen
                ? 0
                : "calc(-2 * var(--docs-pane-gap))",
              opacity: isDesktopOpen ? 1 : 0,
            }}
            transition={SPRING.card}
            style={{ willChange: "width, margin, opacity" }}
            className={cn(
              "hidden h-full shrink-0 overflow-hidden xl:block",
              !isDesktopOpen && "pointer-events-none"
            )}
            inert={!isDesktopOpen ? true : undefined}
          >
            <motion.div
              initial={false}
              animate={{
                x: isDesktopOpen ? 0 : "-100%",
              }}
              transition={SPRING.card}
              style={{ willChange: "transform" }}
              className="h-full w-(--docs-sidebar-w)"
            >
              <DocsPane
                size="sidebar"
                aria-label="Documentation navigation"
                className="h-full w-full"
              >
                <SidebarContent
                  tree={tree}
                  headerAction={
                    <button
                      onClick={onToggle}
                      aria-label="Collapse navigation menu (M)"
                      title="Collapse navigation menu (M)"
                      className="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      <HugeiconsIcon
                        icon={SidebarLeft01Icon}
                        className="size-4"
                      />
                    </button>
                  }
                />
              </DocsPane>
            </motion.div>
          </motion.div>

          {/* Center Main Pane — expands & shrinks into space vacated by extreme wings */}
          <DocsPane size="main" scrollRoot>
            {children}
          </DocsPane>

          {/* Extreme Right Wing — optional aside pane */}
          <AnimatePresence initial={false}>
            {showAside && (
              <motion.div
                key="aside-pane"
                initial={{
                  width: 0,
                  marginLeft: "calc(-2 * var(--docs-pane-gap))",
                  opacity: 0,
                }}
                animate={{
                  width: "var(--docs-aside-w)",
                  marginLeft: 0,
                  opacity: 1,
                }}
                exit={{
                  width: 0,
                  marginLeft: "calc(-2 * var(--docs-pane-gap))",
                  opacity: 0,
                }}
                transition={SPRING.card}
                style={{ willChange: "width, margin, opacity" }}
                className={cn(
                  "h-full shrink-0 overflow-hidden",
                  hideBelowClass(asideHideBelow)
                )}
              >
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={SPRING.card}
                  style={{ willChange: "transform" }}
                  className="h-full w-(--docs-aside-w)"
                >
                  <DocsPane
                    size="aside"
                    aria-label="Sponsors"
                    className="h-full w-full"
                  >
                    {aside}
                  </DocsPane>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DocsScreen>

      {/* Navigation Trigger Button (Spatial minimalist design language: no icon, vertical uppercase typography, edge tab)
          - On mobile/tablet (< 1280px): always visible since desktop sidebar is hidden.
          - On desktop (>= 1280px): slides into view when sidebar is collapsed (!isDesktopOpen). */}
      <button
        onClick={onToggle}
        aria-label="Toggle navigation menu (M)"
        title="Toggle navigation menu (M)"
        className={cn(
          "fixed top-[calc(5rem+var(--docs-pane-gap))] left-(--docs-pane-gap) z-50 flex h-24 w-11 items-center justify-center rounded-r-sm bg-foreground text-background transition-all duration-300 hover:w-14 hover:bg-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:top-[calc(5rem+var(--docs-pane-gap)*2)] sm:left-[calc(var(--docs-pane-gap)*2)] dark:hover:text-foreground",
          isDesktopOpen &&
            "xl:pointer-events-none xl:-translate-x-full xl:opacity-0"
        )}
      >
        <span className="rotate-180 text-[0.65rem] font-bold tracking-[0.2em] uppercase [writing-mode:vertical-rl]">
          Menu
        </span>
      </button>

      {/* Mobile / Tablet Drawer */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="left"
          className="w-[300px] overflow-hidden p-0 sm:w-[320px]"
        >
          <span className="sr-only">Documentation navigation</span>
          <SidebarContent tree={tree} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
