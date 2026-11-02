"use client"

import * as React from "react"
import { SatisiumLogo } from "@/components/satisium-logo"
import { cn } from "@/lib/utils"

/**
 * ============================================================================
 * STAGE 2: THE CUSTOMIZE STAGE (PURE SPATIAL BLOCK LAYOUT)
 * ============================================================================
 * - Purpose: Deep motion engineering.
 * - Morph Mechanics:
 *   1. Center Stage (Block 4) splits horizontally:
 *      - Block 4A (Top 60%): Interactive Math Visualizer (Cubic-Bezier / Spring / Steps)
 *      - Block 4B (Bottom 40%): Live Micro-Preview reacting in real-time
 *   2. Left Flank: Block 2 mounts "My Variants" Git branch tree above presets.
 *   3. Right Flank: Block 7 transforms into Full Multi-Framework Code Generation & Diff Telemetry.
 * - Shell: Full-bleed edge-to-edge (h-dvh w-full overflow-hidden bg-muted p-2 gap-2).
 * - Squircles: Outer major blocks rounded-[20px]; secondary slabs rounded-[16px];
 *   inner tokens rounded-[10px]. Zero 1px borders, zero drop shadows.
 * ============================================================================
 */
export function Stage2Customize() {
  return (
    <div className="flex h-dvh w-full gap-2 overflow-hidden bg-muted p-2 font-sans select-none">
      {/* =====================================================================
          LEFT FLANK: 260px Fixed Width (Blocks 1, 2, 3)
          ===================================================================== */}
      <aside className="flex w-[260px] shrink-0 flex-col gap-2">
        {/* BLOCK 1: BRAND & GLOBAL NAVIGATION (Spatial Anchor) */}
        <section
          aria-label="Block 1: Brand and Navigation"
          className="flex h-11 shrink-0 items-center justify-between rounded-[16px] bg-background px-3.5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-[8px] bg-foreground text-background">
              <SatisiumLogo size="14" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xs font-semibold tracking-tight text-foreground">
                Ease Studio
              </span>
              <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
                Block 01 · 260×44px
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-[6px] bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              /docs
            </span>
            <span className="rounded-[6px] bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              [?]
            </span>
          </div>
        </section>

        {/* BLOCK 2: VARIANT TREE & PRESET CATALOG */}
        <section
          aria-label="Block 2: Variant Tree and Preset Catalog"
          className="flex min-h-0 flex-1 flex-col justify-between rounded-[20px] bg-background p-4 transition-colors"
        >
          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold tracking-wider text-primary uppercase">
                Block 02 · Variant Tree
              </span>
              <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                260px × Flex
              </span>
            </div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Git Fork & Preset Catalog
            </h2>
          </div>

          {/* Morph Addition: "My Variants" Branch Tree */}
          <div className="my-auto flex flex-col gap-3">
            {/* My Variants Section */}
            <div className="flex flex-col gap-1.5 rounded-[12px] bg-muted p-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold tracking-wide text-primary uppercase">
                  My Variants (1)
                </span>
                <span className="cursor-pointer rounded-[4px] bg-background px-1.5 py-0.5 font-mono text-[9px] font-medium text-foreground">
                  + Fork
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between rounded-[8px] bg-background px-2 py-1 text-xs">
                  <span className="font-heading font-medium text-foreground">
                    Brand Modal / Snappy
                  </span>
                  <span className="font-mono text-[9px] text-primary">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between px-1 font-mono text-[9px] text-muted-foreground">
                  <span>Parent: Material 3</span>
                  <span>1 Snapshot</span>
                </div>
              </div>
            </div>

            {/* Presets Filter & Stack */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Library Presets (56):
              </span>
              <div className="flex h-7 items-center justify-between rounded-[8px] bg-secondary px-2 text-[11px] text-muted-foreground">
                <span>Search library...</span>
                <kbd className="font-mono text-[9px]">⌘K</kbd>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                {[
                  { name: "Apple Fluid Decel", tag: "0.25, 1, 0.5, 1" },
                  { name: "Material 3 Emphasized", tag: "0.05, 0.7, 0.1, 1" },
                  { name: "Cushioned Spring", tag: "k:300 c:30 m:1" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-[8px] px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                  >
                    <span className="font-heading text-xs">{item.name}</span>
                    <span className="font-mono text-[9px]">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Block Footer */}
          <div className="flex items-center justify-between border-t border-secondary pt-2 font-mono text-[10px] text-muted-foreground">
            <span>Branch Tree Active</span>
            <span>Diff Ghost Ready</span>
          </div>
        </section>

        {/* BLOCK 3: SPONSOR / ECOSYSTEM RAIL */}
        <section
          aria-label="Block 3: Sponsor Placement"
          className="flex h-[72px] shrink-0 flex-col justify-between rounded-[16px] bg-background p-3 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
              Block 03 · Sponsor Placement
            </span>
            <span className="rounded-[4px] bg-secondary px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
              260×72px
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-heading text-xs font-medium text-foreground">
              Satisium Umbrella
            </span>
            <span className="font-mono text-[10px] text-primary">
              satisium.com ↗
            </span>
          </div>
        </section>
      </aside>

      {/* =====================================================================
          CENTER STAGE: 60/40 Split (Blocks 4A & 4B) + Bottom Toolbars (Blocks 5 & 6)
          ===================================================================== */}
      <main className="flex min-w-0 flex-1 flex-col gap-2">
        {/* CENTER COLUMN WORKSTATION: Vertical 58/42 Split */}
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          {/* BLOCK 4A: INTERACTIVE CURVE GRAPH & MATHEMATICS (Top 58%) */}
          <section
            aria-label="Block 4A: Interactive Curve Graph and Mathematics"
            className="flex min-h-0 flex-[58] flex-col justify-between overflow-hidden rounded-[20px] bg-background p-5 transition-colors"
          >
            {/* Top Bar with Mode Switcher & Slide-down Import Hook */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold tracking-wider text-primary uppercase">
                  Block 04A · Interactive Graph
                </span>
                <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Center-Top (58% Height)
                </span>
              </div>

              {/* Mode Tabs */}
              <div className="flex items-center gap-1 rounded-[10px] bg-muted p-1">
                <span className="rounded-[8px] bg-background px-2.5 py-1 font-heading text-xs font-semibold text-foreground">
                  Cubic Bezier (1)
                </span>
                <span className="px-2.5 py-1 font-heading text-xs font-medium text-muted-foreground">
                  Spring Physics (2)
                </span>
                <span className="px-2.5 py-1 font-heading text-xs font-medium text-muted-foreground">
                  Steps (3)
                </span>
              </div>
            </div>

            {/* Central Mathematical Visualizer Canvas Blueprint */}
            <div className="mx-auto my-auto flex max-w-md flex-col items-center justify-center text-center">
              {/* Slide-down Import Bar Footprint */}
              <div className="mb-3 flex h-8 w-full items-center justify-between rounded-[8px] bg-secondary px-3 font-mono text-xs text-[11px] text-muted-foreground">
                <span>Import: cubic-bezier(0.25, 0.10, 0.25, 1.00)</span>
                <span className="cursor-pointer text-primary">Parse ↵</span>
              </div>

              {/* Dynamic SVG Canvas Footprint */}
              <div className="relative flex h-40 w-72 items-center justify-center rounded-[14px] bg-muted p-4">
                <div className="flex flex-col items-center gap-1 text-center font-mono text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    [ Interactive SVG Coordinate Canvas ]
                  </span>
                  <span className="text-[10px]">
                    • Draggable Handle P1 (0.25, 0.10)
                  </span>
                  <span className="text-[10px]">
                    • Draggable Handle P2 (0.25, 1.00)
                  </span>
                  <span className="text-[10px] text-primary">
                    • Cyan Velocity Derivative Line (v = dx/dt)
                  </span>
                </div>
              </div>

              {/* Coordinate / Physics Sliders */}
              <div className="mt-3 flex w-full justify-between rounded-[10px] bg-secondary px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                <span>X1: 0.25</span>
                <span>Y1: 0.10</span>
                <span>X2: 0.25</span>
                <span>Y2: 1.00</span>
              </div>
            </div>

            {/* Footer Status */}
            <div className="flex items-center justify-between border-t border-secondary pt-2 font-mono text-[10px] text-muted-foreground">
              <span>Dynamic Auto-Zoom ViewBox (y: 1.25)</span>
              <span>Hardware RAF Tracking</span>
            </div>
          </section>

          {/* BLOCK 4B: LIVE COMPONENT MICRO-PREVIEW (Bottom 42%) */}
          <section
            aria-label="Block 4B: Live Component Micro-Preview"
            className="flex min-h-0 flex-[42] flex-col justify-between overflow-hidden rounded-[16px] bg-background p-4 transition-colors"
          >
            {/* Header with Return to Stage 1 Hook */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold tracking-wider text-primary uppercase">
                  Block 04B · Micro-Preview
                </span>
                <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Center-Bottom (42% Height)
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                <span>Press [1] or click:</span>
                <span className="cursor-pointer rounded-[6px] bg-secondary px-2 py-0.5 font-medium text-foreground">
                  Audition Full View ↖
                </span>
              </div>
            </div>

            {/* Active Micro-Preview Sandbox */}
            <div className="my-auto flex items-center justify-center">
              <div className="flex w-full max-w-sm flex-col gap-2 rounded-[12px] bg-muted p-3 text-center">
                <span className="font-mono text-[10px] font-semibold text-foreground uppercase">
                  Real-Time Component Feedback
                </span>
                <div className="flex h-10 w-full items-center justify-center rounded-[8px] bg-background text-xs font-medium text-muted-foreground">
                  [ Modal Dialog Reacts Live on Handle Drag ]
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">
                  Instant visual translation of mathematical curve tweaks
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-secondary pt-1 font-mono text-[10px] text-muted-foreground">
              <span>Synchronized with Block 4A</span>
              <span>Zero-Lag Settle Evaluation</span>
            </div>
          </section>
        </div>

        {/* CENTER BOTTOM TOOLBAR ROW (Blocks 5 & 6) */}
        <div className="flex h-11 shrink-0 gap-2">
          {/* BLOCK 5: SCALABLE COMPONENT SELECTOR (220px Fixed) */}
          <section
            aria-label="Block 5: Component Selector"
            className="flex w-[220px] shrink-0 items-center justify-between rounded-[16px] bg-background px-3.5 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-mono text-[9px] font-semibold tracking-wider text-primary uppercase">
                Block 05 · Selector
              </span>
              <span className="font-heading text-xs font-semibold text-foreground">
                Modal Dialog ▼
              </span>
            </div>
            <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              20+ Archetypes
            </span>
          </section>

          {/* BLOCK 6: PLAYBACK TRANSPORT, SCRUBBER & A11Y */}
          <section
            aria-label="Block 6: Transport and Scrubber Dock"
            className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-[16px] bg-background px-3.5 transition-colors"
          >
            {/* Play/Trigger */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 items-center gap-1.5 rounded-[8px] bg-foreground px-2.5 font-heading text-xs font-medium text-background">
                <span>Play</span>
                <kbd className="font-mono text-[9px] opacity-75">Space</kbd>
              </div>
              <div className="flex h-7 items-center rounded-[8px] bg-secondary px-2 font-mono text-[11px] text-muted-foreground">
                Loop
              </div>
            </div>

            {/* Speed & Scrubber */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-7 items-center rounded-[8px] bg-secondary p-0.5">
                {["1x", "0.5x", "0.25x"].map((speed, i) => (
                  <span
                    key={speed}
                    className={cn(
                      "rounded-[6px] px-2 py-0.5 font-mono text-[10px]",
                      i === 0
                        ? "bg-background font-medium text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {speed}
                  </span>
                ))}
              </div>

              {/* Scrubber Track Footprint */}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">
                  0%
                </span>
                <div className="relative h-2 min-w-0 flex-1 rounded-full bg-secondary">
                  <div className="absolute top-1/2 left-[50%] size-3 -translate-y-1/2 rounded-full bg-foreground" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  100%
                </span>
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex h-7 items-center gap-1.5 rounded-[8px] bg-secondary px-2.5 font-mono text-[10px] text-muted-foreground">
              <span>Reduced Motion</span>
              <div className="size-2 rounded-full bg-muted-foreground" />
            </div>
          </section>
        </div>
      </main>

      {/* =====================================================================
          RIGHT FLANK: 300px Fixed Width (Blocks 7, 8)
          ===================================================================== */}
      <aside className="flex w-[300px] shrink-0 flex-col gap-2">
        {/* BLOCK 7: MULTI-FRAMEWORK CODE GENERATION & DIFF TELEMETRY */}
        <section
          aria-label="Block 7: Multi-Framework Code Generation"
          className="flex min-h-0 flex-1 flex-col justify-between rounded-[20px] bg-background p-4 transition-colors"
        >
          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold tracking-wider text-primary uppercase">
                Block 07 · Code Generator
              </span>
              <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                300px × Flex
              </span>
            </div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Multi-Framework Export & Diff
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Production-ready token output with visual diff metrics against
              parent.
            </p>
          </div>

          {/* Code & Diff Stacks */}
          <div className="my-auto flex flex-col gap-3">
            {/* Framework Switcher Tabs */}
            <div className="flex h-8 w-full items-center justify-between rounded-[10px] bg-muted p-1">
              {["CSS", "Tailwind", "Motion", "GSAP"].map((fw, i) => (
                <div
                  key={fw}
                  className={cn(
                    "flex-1 rounded-[6px] py-0.5 text-center font-heading text-[11px] font-medium",
                    i === 0
                      ? "bg-background font-semibold text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {fw}
                </div>
              ))}
            </div>

            {/* Generated Code Display Box */}
            <div className="flex flex-col gap-2 rounded-[14px] bg-secondary p-3">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-semibold text-foreground">
                  Active Token
                </span>
                <span className="cursor-pointer rounded-[4px] bg-background px-1.5 py-0.5 font-medium text-foreground">
                  [ ⌘ Copy ]
                </span>
              </div>
              <pre className="rounded-[8px] bg-background/50 p-2 font-mono text-[10px] leading-tight break-all text-muted-foreground">
                {`transition: all 300ms cubic-bezier(0.25, 0.10, 0.25, 1.00);`}
              </pre>
            </div>

            {/* Diff Telemetry Badge */}
            <div className="flex flex-col gap-1 rounded-[12px] bg-muted p-2.5">
              <span className="font-mono text-[9px] font-semibold text-primary uppercase">
                Diff vs Parent (Material 3)
              </span>
              <div className="flex flex-col font-mono text-[10px] leading-relaxed text-muted-foreground">
                <span>• +0.20 initial handle pull</span>
                <span>• Settle time: -50ms faster</span>
                <span>• Zero ringing oscillation</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-secondary pt-2 font-mono text-[10px] text-muted-foreground">
            <span>Bidirectional URL Sync</span>
            <span>TypeScript Ready</span>
          </div>
        </section>

        {/* BLOCK 8: COMPARE BENCH STAGING */}
        <section
          aria-label="Block 8: Compare Bench Staging"
          className="flex h-11 shrink-0 items-center justify-between rounded-[16px] bg-background px-3.5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-semibold tracking-wider text-primary uppercase">
              Block 08
            </span>
            <span className="font-heading text-xs font-semibold text-foreground">
              Compare Bench
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              1/3 Staged
            </span>
            <div className="rounded-[8px] bg-foreground px-2.5 py-1 font-heading text-xs font-semibold text-background">
              + Pin
            </div>
          </div>
        </section>
      </aside>
    </div>
  )
}
