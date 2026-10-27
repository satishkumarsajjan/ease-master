"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon,
  Book02Icon,
  ArrowRight01Icon,
  CheckmarkBadge03Icon,
  CommandLineIcon,
  DashboardSquare01Icon,
  SlidersHorizontalIcon,
  Layers01Icon,
  Copy01Icon,
} from "@hugeicons/core-free-icons"

import { SPRING } from "@/lib/motion"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { notify } from "@/lib/toast"
import { useCopy } from "@/hooks/use-copy"

type ShowcaseTab = "app" | "docs"

export function HeroShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("app")
  const [clickCount, setClickCount] = useState(0)
  const { copied: copiedCode, copy } = useCopy({
    toast: true,
    label: "CLI command copied",
  })

  const handleInteractiveClick = () => {
    const next = clickCount + 1
    setClickCount(next)
    notify.info(`Action triggered: count is now ${next}`)
  }

  const handleCopySnippet = () => {
    copy("pnpm dlx shadcn@latest add action-button")
  }

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl bg-muted p-2 sm:p-3">
      {/* Chrome Window Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
        {/* Window Controls & Live Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </div>
          <span className="ml-2 hidden items-center gap-1.5 rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline-flex">
            <span className="size-1.5 rounded-full bg-primary" />
            Live Preview
          </span>
        </div>

        {/* Segmented Mode Switcher */}
        <div className="flex items-center rounded-2xl bg-background p-1">
          <button
            type="button"
            onClick={() => setActiveTab("app")}
            className={cn(
              "relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              activeTab === "app"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {activeTab === "app" && (
              <motion.span
                layoutId="showcase-tab-active"
                className="absolute inset-0 -z-10 rounded-xl bg-muted"
                transition={SPRING.pill}
              />
            )}
            <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
            Product Canvas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("docs")}
            className={cn(
              "relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              activeTab === "docs"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {activeTab === "docs" && (
              <motion.span
                layoutId="showcase-tab-active"
                className="absolute inset-0 -z-10 rounded-xl bg-muted"
                transition={SPRING.pill}
              />
            )}
            <HugeiconsIcon icon={Book02Icon} className="size-3.5" />
            Docs Engine
          </button>
        </div>

        {/* Quick Link to Current Target */}
        <Link
          href={activeTab === "app" ? ROUTES.app : ROUTES.docs}
          className="group hidden items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
        >
          <span>Explore {activeTab === "app" ? "App" : "Docs"}</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative min-h-[380px] overflow-hidden rounded-2xl bg-background p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {activeTab === "app" ? (
            <motion.div
              key="showcase-app"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={SPRING.card}
              className="flex flex-col gap-6"
            >
              {/* App Shell Header Mock */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
                    <HugeiconsIcon
                      icon={DashboardSquare01Icon}
                      className="size-5"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">
                      Product Workspace
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Satisium UI Kit · Fully Reactive
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    Zero-Config · v0.1.0
                  </span>
                  <button
                    type="button"
                    onClick={handleInteractiveClick}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
                  >
                    <span>Trigger Action</span>
                    <span className="py-0.2 rounded-full bg-primary-foreground px-1.5 text-[10px] text-primary">
                      {clickCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-4 transition-colors hover:bg-background">
                  <span className="text-xs font-medium text-muted-foreground">
                    Doctor Health
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      100% Clean
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      13/13 Checks
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Zero contract violations
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-4 transition-colors hover:bg-background">
                  <span className="text-xs font-medium text-muted-foreground">
                    Design Tokens
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      OKLCH Ramp
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      Achromatic
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    No hardcoded hex or raw shadows
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-4 transition-colors hover:bg-background">
                  <span className="text-xs font-medium text-muted-foreground">
                    Navigation & Shortcuts
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      ⌘K + Hotkeys
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      Native
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Global command registry
                  </span>
                </div>
              </div>

              {/* Interactive Tool Playground */}
              <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-background text-foreground">
                    <HugeiconsIcon
                      icon={SlidersHorizontalIcon}
                      className="size-4"
                    />
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold text-foreground">
                      Interactive State Sandbox
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Test component reactivity directly in your browser.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setClickCount(0)}
                    className="rounded-xl bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Reset Counter
                  </button>
                  <Link
                    href={ROUTES.app}
                    className="flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Open Workspace
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="size-3.5"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="showcase-docs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={SPRING.card}
              className="flex flex-col gap-4"
            >
              {/* Docs Shell Mockup */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                {/* Mini Docs Navigation Rail */}
                <div className="hidden flex-col gap-2 rounded-2xl bg-secondary p-3 md:col-span-4 md:flex">
                  <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                    Documentation Tree
                  </span>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="rounded-lg bg-background px-2.5 py-1.5 font-semibold text-primary">
                      Introduction & Philosophy
                    </span>
                    <span className="rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground">
                      Spatial Layout Architecture
                    </span>
                    <span className="rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground">
                      Achromatic Surface System
                    </span>
                    <span className="rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground">
                      Component Kit Primitives
                    </span>
                  </div>
                </div>

                {/* Mini MDX Article Stage */}
                <div className="flex flex-col gap-3 md:col-span-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-primary">
                        Layouts · Architecture
                      </span>
                      <h2 className="text-base font-bold text-foreground">
                        Spatial & Three-Pane Shell
                      </h2>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Fumadocs Engine
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Zero-border design calibrated to reading measure (45–75
                    characters). Panes absorb screen width while the article
                    holds steady, with smooth spring animations and keyboard
                    command palette integration.
                  </p>

                  {/* Mini Code Block */}
                  <div className="flex flex-col overflow-hidden rounded-xl bg-muted">
                    <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-mono">
                        <HugeiconsIcon
                          icon={CommandLineIcon}
                          className="size-3"
                        />
                        terminal
                      </span>
                      <button
                        type="button"
                        aria-label="Copy CLI snippet"
                        onClick={handleCopySnippet}
                        className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] transition-colors hover:bg-background hover:text-foreground"
                      >
                        <HugeiconsIcon
                          icon={copiedCode ? CheckmarkBadge03Icon : Copy01Icon}
                          className="size-3 text-primary"
                        />
                        {copiedCode ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="bg-background px-3 py-2 font-mono text-xs text-foreground">
                      <code>pnpm dlx shadcn@latest add action-button</code>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between pt-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={Layers01Icon} className="size-3.5" />
                      Two layouts included out of the box
                    </span>
                    <Link
                      href={ROUTES.docs}
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Read full docs
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="size-3.5"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
