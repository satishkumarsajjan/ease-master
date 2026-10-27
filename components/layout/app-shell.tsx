"use client"

import * as React from "react"
import { motion } from "motion/react"

import { Container } from "@/components/layout/container"
import { useIsDesktop } from "@/hooks/use-media-query"
import { SPRING } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/store/use-sidebar-store"

export interface AppShellProps {
  children: React.ReactNode
  /** Top bar — pass <SiteHeader /> or a product-specific bar. */
  header?: React.ReactNode
  /** Left rail — usually <AppNav items={APP_NAV} />. */
  rail?: React.ReactNode
  railWidth?: number
  size?: "narrow" | "default" | "wide" | "full"
  /** Wrap children in <Container>. Set false when the child owns its own layout (tools). */
  contained?: boolean
  className?: string
}

export function AppShell({
  children,
  header,
  rail,
  railWidth = 280,
  size = "default",
  contained = true,
  className,
}: AppShellProps) {
  const { isOpen, toggleSidebar } = useSidebarStore()
  const isDesktop = useIsDesktop()
  const hasRail = Boolean(rail)

  const offset = hasRail && isDesktop && isOpen ? railWidth : 0

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col bg-background",
        className
      )}
    >
      {header}

      <div className="flex flex-1">
        {hasRail ? (
          <>
            {/* Desktop rail — GPU transform only, same spring as the docs card */}
            <motion.aside
              initial={false}
              animate={{ x: isOpen ? 0 : -railWidth }}
              transition={SPRING.card}
              style={{ willChange: "transform", width: railWidth }}
              data-rail-open={isOpen}
              className="fixed inset-y-16 left-0 z-30 hidden shrink-0 overflow-y-auto border-r border-border bg-background p-4 lg:block"
            >
              {rail}
            </motion.aside>

            {/* Mobile drawer + scrim */}
            <div
              onClick={() => isOpen && toggleSidebar()}
              aria-hidden="true"
              className={cn(
                "fixed inset-0 z-30 bg-overlay backdrop-blur-sm transition-opacity lg:hidden",
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
              )}
            />
            <motion.aside
              initial={false}
              animate={{ x: isOpen ? 0 : -railWidth }}
              transition={SPRING.card}
              style={{ width: railWidth }}
              data-rail-open={isOpen}
              className="fixed inset-y-0 left-0 z-40 overflow-y-auto border-r border-border bg-background p-4 lg:hidden"
            >
              {rail}
            </motion.aside>
          </>
        ) : null}

        <main
          id="main-content"
          className="min-w-0 flex-1 transition-[padding] duration-300 ease-out"
          style={{ paddingLeft: offset }}
        >
          {contained ? (
            <Container size={size} className="py-8">
              {children}
            </Container>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
