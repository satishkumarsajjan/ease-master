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
  Layers01Icon,
  Copy01Icon,
  Notification01Icon,
  Folder01Icon,
  Activity01Icon,
  CommandLineIcon,
  CodeCircleIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

import { ActionButton } from "@/components/ui/action-button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { KbdShortcut } from "@/components/ui/kbd"
import { StatCard } from "@/components/ui/stat-card"
import { SPRING } from "@/lib/motion"
import { ROUTES } from "@/lib/routes"
import { notify } from "@/lib/toast"
import { cn } from "@/lib/utils"

type WorkspaceView = "canvas" | "sandbox" | "guide"

export function WorkspaceCanvas() {
  const [activeView, setActiveView] = useState<WorkspaceView>("canvas")
  const [taskCount, setTaskCount] = useState(148)
  const [interactiveCounter, setInteractiveCounter] = useState(0)
  const [selectedTag, setSelectedTag] = useState("all")

  const handleTriggerToast = (type: "info" | "copied" | "saved") => {
    switch (type) {
      case "info":
        notify.info("Workspace state updated in real-time.")
        break
      case "copied":
        notify.copied("Workspace payload copied to clipboard.")
        break
      case "saved":
        notify.saved("Project settings preserved.")
        break
    }
  }

  const handleIncrement = () => {
    setInteractiveCounter((c) => c + 1)
    setTaskCount((t) => t + 1)
    notify.info(`Dispatched action #${interactiveCounter + 1}`)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Workspace Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            <HugeiconsIcon icon={Folder01Icon} className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
                Satisium Workstation
              </h1>
              <Badge variant="outline" className="text-[11px]">
                Production Ready
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Connected to default project workspace · Satisium Starter v0.1.0
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden items-center gap-1.5 rounded-xl bg-muted px-3 py-1.5 text-xs text-muted-foreground sm:flex">
            <span>Quick search:</span>
            <KbdShortcut keys="mod+k" />
          </div>

          <ActionButton
            label="Docs"
            href={ROUTES.docs}
            variant="outline"
            size="sm"
            icon={<HugeiconsIcon icon={Book02Icon} />}
          />

          <button
            type="button"
            aria-label="Dispatch project action"
            onClick={handleIncrement}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
          >
            <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
            <span>New Action</span>
            <span className="py-0.2 rounded-full bg-secondary px-1.5 text-[10px] text-foreground">
              {interactiveCounter}
            </span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Tasks"
          value={taskCount.toLocaleString()}
          trend={{ value: 14.2, label: "this week" }}
          hint="Across all product channels"
          icon={
            <HugeiconsIcon
              icon={Activity01Icon}
              className="size-4 text-muted-foreground"
            />
          }
        />
        <StatCard
          label="Design Tokens"
          value="100% OKLCH"
          trend={{ value: 100, label: "compliant" }}
          hint="Zero hardcoded hex values"
          icon={
            <HugeiconsIcon
              icon={Layers01Icon}
              className="size-4 text-muted-foreground"
            />
          }
        />
        <StatCard
          label="UI Primitives"
          value="24+ Ready"
          trend={{ value: 8.5, label: "expanding" }}
          hint="Accessible & spring-animated"
          icon={
            <HugeiconsIcon
              icon={CodeCircleIcon}
              className="size-4 text-muted-foreground"
            />
          }
        />
        <StatCard
          label="Doctor Health"
          value="13/13 Pass"
          trend={{ value: 100, label: "verified" }}
          hint="Zero contract problems"
          icon={
            <HugeiconsIcon
              icon={CheckmarkBadge03Icon}
              className="size-4 text-primary"
            />
          }
        />
      </div>

      {/* Workspace Tabs & Stage */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center rounded-2xl bg-muted p-1">
            <button
              type="button"
              aria-label="Switch to interactive canvas view"
              onClick={() => setActiveView("canvas")}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                activeView === "canvas"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {activeView === "canvas" && (
                <motion.span
                  layoutId="workspace-view-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-background"
                  transition={SPRING.pill}
                />
              )}
              <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
              Interactive Canvas
            </button>

            <button
              type="button"
              aria-label="Switch to component sandbox view"
              onClick={() => setActiveView("sandbox")}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                activeView === "sandbox"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {activeView === "sandbox" && (
                <motion.span
                  layoutId="workspace-view-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-background"
                  transition={SPRING.pill}
                />
              )}
              <HugeiconsIcon icon={Layers01Icon} className="size-3.5" />
              Component Sandbox
            </button>

            <button
              type="button"
              aria-label="Switch to architecture blueprint view"
              onClick={() => setActiveView("guide")}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                activeView === "guide"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {activeView === "guide" && (
                <motion.span
                  layoutId="workspace-view-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-background"
                  transition={SPRING.pill}
                />
              )}
              <HugeiconsIcon icon={CommandLineIcon} className="size-3.5" />
              Architecture Guide
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Notification tester:
            </span>
            <button
              type="button"
              aria-label="Send info notification"
              onClick={() => handleTriggerToast("info")}
              className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-accent"
            >
              <HugeiconsIcon icon={Notification01Icon} className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Send copy notification"
              onClick={() => handleTriggerToast("copied")}
              className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-accent"
            >
              <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Tab View Content */}
        <AnimatePresence mode="wait">
          {activeView === "canvas" && (
            <motion.div
              key="view-canvas"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRING.card}
              className="flex flex-col gap-6 py-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Active Product Canvas
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    This interactive workbench demonstrates reactive controls
                    and design tokens.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {["all", "components", "analytics", "shortcuts"].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        aria-label={`Filter by ${tag}`}
                        onClick={() => setSelectedTag(tag)}
                        className={cn(
                          "rounded-xl px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                          selectedTag === tag
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Interactive Demo Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-3 rounded-2xl bg-muted p-4">
                  <span className="text-xs font-semibold text-foreground">
                    1. Reusable ActionButton
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Accessible, keyboard-navigable action buttons with fluid
                    feedback states.
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <ActionButton
                      label="Solid"
                      size="sm"
                      onClick={() => notify.info("Clicked solid action")}
                    />
                    <ActionButton
                      label="Outline"
                      variant="outline"
                      size="sm"
                      onClick={() => notify.info("Clicked outline action")}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl bg-muted p-4">
                  <span className="text-xs font-semibold text-foreground">
                    2. State Counter Sandbox
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Manipulate workstation state with live reactive counters and
                    toasts.
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <span className="font-mono text-sm font-bold text-foreground">
                      Counter: {interactiveCounter}
                    </span>
                    <button
                      type="button"
                      aria-label="Increment counter"
                      onClick={handleIncrement}
                      className="flex items-center gap-1 rounded-xl bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      <HugeiconsIcon icon={RefreshIcon} className="size-3" />
                      Increment
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl bg-muted p-4">
                  <span className="text-xs font-semibold text-foreground">
                    3. Toast Dispatcher
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Strict adherence to notify.* API for consistent
                    brand-aligned notifications.
                  </p>
                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      type="button"
                      aria-label="Save project demo"
                      onClick={() => handleTriggerToast("saved")}
                      className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Dispatch Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === "sandbox" && (
            <motion.div
              key="view-sandbox"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRING.card}
              className="flex flex-col gap-6 py-2"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-bold text-foreground">
                  Satisium Component Kit Showcase
                </h2>
                <p className="text-xs text-muted-foreground">
                  Preview live kit primitives with OKLCH color harmony and
                  zero-border aesthetics.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Empty State Component Preview */}
                <div className="rounded-2xl bg-muted p-6">
                  <EmptyState
                    title="No Items Selected"
                    description="This is the EmptyState component from components/ui/empty-state.tsx."
                    action={
                      <ActionButton
                        label="Add first item"
                        size="sm"
                        onClick={() => notify.saved("Created sample item")}
                      />
                    }
                  />
                </div>

                {/* Badges & Hotkeys Preview */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl bg-muted p-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Badges & Keyboard Badges
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Tokenized badges and cross-platform key formatting.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">Primary Badge</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs text-muted-foreground">
                      Hotkeys:
                    </span>
                    <KbdShortcut keys="mod+k" />
                    <KbdShortcut keys="d" />
                    <KbdShortcut keys="c" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === "guide" && (
            <motion.div
              key="view-guide"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRING.card}
              className="flex flex-col gap-4 py-2"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-bold text-foreground">
                  Developer Integration Blueprint
                </h2>
                <p className="text-xs text-muted-foreground">
                  How to replace this starter canvas with your own product while
                  retaining the architecture.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-2 rounded-2xl bg-muted p-4">
                  <span className="font-mono text-xs font-bold text-primary">
                    1. Keep the Shell
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Keep <code className="text-foreground">AppShell</code> and{" "}
                    <code className="text-foreground">AppNav</code> so
                    responsive drawers, ⌘K command menu, and theme hotkeys
                    remain unified.
                  </p>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl bg-muted p-4">
                  <span className="font-mono text-xs font-bold text-primary">
                    2. Route Safety
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Define every route in{" "}
                    <code className="text-foreground">lib/routes.ts</code> and
                    navigation links in{" "}
                    <code className="text-foreground">lib/nav.ts</code>.
                  </p>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl bg-muted p-4">
                  <span className="font-mono text-xs font-bold text-primary">
                    3. Token Contract
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Style exclusively with OKLCH CSS tokens in{" "}
                    <code className="text-foreground">app/globals.css</code>. No
                    hardcoded hex or raw shadows.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-muted p-4">
                <span className="text-xs text-muted-foreground">
                  Need in-depth documentation on project architecture?
                </span>
                <Link
                  href={ROUTES.docsStructure}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Read Structure Docs
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
