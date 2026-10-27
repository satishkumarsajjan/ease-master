"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Book02Icon } from "@hugeicons/core-free-icons"
import { SiGithub } from "@icons-pack/react-simple-icons"

import { SatisiumLogo } from "@/components/satisium-logo"
import { MinimalThemeSwitcher } from "@/components/home/minimal-theme-switcher"
import { PresetSidebar } from "@/components/ease/layout/PresetSidebar"
import { ControlsBar } from "@/components/ease/layout/ControlsBar"
import { BezierGraph } from "@/components/ease/visualizer/BezierGraph"
import { PreviewPanel } from "@/components/ease/preview/PreviewPanel"
import { InfoPanel } from "@/components/ease/info/InfoPanel"
import { ExportPanel } from "@/components/ease/export/ExportPanel"
import { ScrollArea } from "@/components/ui/scroll-area"

import { PRODUCT, PROJECT } from "@/lib/config"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { useEaseStore } from "@/store/useEaseStore"

export function EaseWorkstation() {
  const { mode, setMode, presetInfo } = useEaseStore()

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background font-sans text-foreground select-none">
      {/* 1. TOP WORKSTATION HEADER */}
      <header className="z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
        {/* Left: Brand + Mode Switcher */}
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            title="Return to Home"
          >
            <span className="flex size-6 items-center justify-center">
              <SatisiumLogo size={20} />
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
                {PRODUCT.name}
              </span>
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Studio
              </span>
            </div>
          </Link>

          <div className="hidden h-4 w-px bg-border sm:block" />

          {/* Mode Switcher Tabs */}
          <div className="flex items-center rounded-lg bg-muted p-0.5">
            <button
              type="button"
              onClick={() => setMode("bezier")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                mode === "bezier"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Cubic Bezier
            </button>
            <button
              type="button"
              onClick={() => setMode("spring")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                mode === "spring"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Spring Physics
            </button>
          </div>
        </div>

        {/* Center: Active Preset Label */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Active:
          </span>
          <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-medium text-foreground">
            {presetInfo.label}
          </span>
        </div>

        {/* Right: Quick Links + Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={ROUTES.docs}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={Book02Icon} size={14} />
            <span className="hidden sm:inline">Docs</span>
          </Link>

          <Link
            href={PROJECT.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            title="GitHub Repository"
          >
            <SiGithub className="size-3.5 fill-current" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>

          <div className="h-4 w-px bg-border" />

          <MinimalThemeSwitcher />
        </div>
      </header>

      {/* 2. THREE-COLUMN STUDIO CHASSIS */}
      <div className="flex min-h-0 w-full flex-1 overflow-hidden">
        {/* LEFT COLUMN: Presets Catalog */}
        <aside className="hidden w-[300px] shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground lg:flex">
          <PresetSidebar />
        </aside>

        {/* CENTER COLUMN: Visualizer + Controls + Live Preview */}
        <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
          {/* Top Stage: Bezier/Spring Graph & Sliders */}
          <ScrollArea className="w-full flex-1 overflow-y-auto">
            <div className="flex w-full flex-col items-center justify-center gap-6 px-6 py-8">
              <BezierGraph />
              <ControlsBar />
            </div>
          </ScrollArea>

          {/* Bottom Stage: Multi-Property Animation Preview */}
          <div className="z-20 h-[340px] shrink-0 border-t border-border bg-card">
            <PreviewPanel />
          </div>
        </section>

        {/* RIGHT COLUMN: Info Panel & Multi-Platform Code Export */}
        <aside className="hidden w-[360px] shrink-0 flex-col overflow-hidden border-l border-border bg-sidebar text-sidebar-foreground xl:flex">
          {/* Top: Curve Explanation */}
          <div className="min-h-[240px] shrink-0 border-b border-border">
            <InfoPanel />
          </div>

          {/* Bottom: Export Tabs (CSS, Tailwind, Motion, GSAP) */}
          <div className="min-h-0 flex-1 overflow-hidden">
            <ExportPanel />
          </div>
        </aside>
      </div>
    </div>
  )
}
