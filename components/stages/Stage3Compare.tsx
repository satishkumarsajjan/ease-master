"use client"

import * as React from "react"
import Link from "next/link"
import { SatisiumLogo } from "@/components/satisium-logo"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

/**
 * ============================================================================
 * STAGE 3: THE COMPARE STAGE (THE BENCHMARK DUEL)
 * ============================================================================
 * - Purpose: Side-by-side multi-curve benchmarking on real UI components.
 * - Morph Mechanics:
 *   1. Left Rail collapses from 280px -> 48px slim icon rail.
 *   2. Right Rail collapses from 320px -> 48px slim icon rail.
 *   3. Center Stage expands to ~92% width and partitions into 3 equal benchmark tiles.
 *   4. Bottom Dock becomes the Synchronized Playback Dock (Trigger All, Interruption Test, Settle Delta).
 * - Shell: Full-bleed edge-to-edge (h-dvh w-full overflow-hidden bg-muted p-2 gap-2).
 * - Squircles: Tiles rounded-[20px]; slim rails rounded-[16px]; dock rounded-[16px];
 *   inner tokens rounded-[10px]. Zero 1px borders, zero drop shadows.
 * ============================================================================
 */
export function Stage3Compare() {
  const [activeTiles, setActiveTiles] = React.useState<
    Array<{
      id: string
      name: string
      badge: string
      settle: string
      curve: string
      isWinner?: boolean
    }>
  >([
    {
      id: "tile-1",
      name: "Browser Default 'ease'",
      badge: "Standard",
      settle: "480ms (Slow)",
      curve: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    },
    {
      id: "tile-2",
      name: "Apple Fluid Decel",
      badge: "Industry Ref",
      settle: "340ms (Fluid)",
      curve: "cubic-bezier(0.25, 1.0, 0.5, 1.0)",
    },
    {
      id: "tile-3",
      name: "Brand Modal / Snappy",
      badge: "Custom Active",
      settle: "270ms (Fastest)",
      curve: "spring(k:360, c:22, m:1)",
      isWinner: true,
    },
  ])

  const handleDismiss = (id: string) => {
    setActiveTiles((prev) =>
      prev.length > 1 ? prev.filter((t) => t.id !== id) : prev
    )
  }

  return (
    <div className="flex h-dvh w-full gap-2 overflow-hidden bg-muted p-2 font-sans select-none">
      {/* =====================================================================
          SLIM LEFT RAIL: 48px Collapsed Width (Block A)
          ===================================================================== */}
      <aside className="flex w-12 shrink-0 flex-col justify-between rounded-[16px] bg-background p-2 transition-all">
        {/* Top Icons */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-foreground text-background">
            <SatisiumLogo size="16" />
          </div>
          <div className="h-px w-5 bg-secondary" />
          <div
            title="Preset Library Drawer"
            className="flex size-8 cursor-pointer items-center justify-center rounded-[8px] bg-secondary font-mono text-[11px] text-muted-foreground hover:text-foreground"
          >
            P
          </div>
          <div
            title="My Variants Drawer"
            className="flex size-8 cursor-pointer items-center justify-center rounded-[8px] bg-secondary font-mono text-[11px] text-muted-foreground hover:text-foreground"
          >
            V
          </div>
        </div>

        {/* Bottom Status */}
        <div className="flex flex-col items-center gap-2">
          <span className="rotate-180 font-mono text-[8px] tracking-tighter text-muted-foreground uppercase [writing-mode:vertical-lr]">
            Rail · 48px
          </span>
          <div className="size-2 rounded-full bg-primary" />
        </div>
      </aside>

      {/* =====================================================================
          CENTER BENCHMARK DUEL: Expands to fill screen (Partitioned Tiles)
          ===================================================================== */}
      <main className="flex min-w-0 flex-1 flex-col gap-2">
        {/* TILES CONTAINER: Partitions into equal columns */}
        <div className="flex min-h-0 flex-1 gap-2">
          {activeTiles.map((tile, index) => (
            <section
              key={tile.id}
              aria-label={`Comparison Tile ${index + 1}: ${tile.name}`}
              className={cn(
                "flex min-w-0 flex-1 flex-col justify-between overflow-hidden rounded-[20px] bg-background p-5 transition-all",
                tile.isWinner && "ring-1 ring-primary/20"
              )}
            >
              {/* Tile Header: Name, Badge, Settle, Dismiss Button */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold tracking-wider text-primary uppercase">
                      Tile 0{index + 1}
                    </span>
                    <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {tile.badge}
                    </span>
                  </div>
                  <h2 className="mt-1 truncate font-heading text-sm font-semibold text-foreground">
                    {tile.name}
                  </h2>
                  <span className="truncate font-mono text-[10px] text-muted-foreground">
                    {tile.curve}
                  </span>
                </div>

                {/* Dismiss Action Button */}
                <button
                  type="button"
                  onClick={() => handleDismiss(tile.id)}
                  aria-label={`Dismiss ${tile.name}`}
                  className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[8px] bg-secondary font-mono text-xs text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  ✕
                </button>
              </div>

              {/* Central Component Sandbox */}
              <div className="mx-auto my-auto flex w-full max-w-sm flex-col items-center justify-center text-center">
                {/* Independent Component Selector Pill */}
                <div className="mb-4 flex h-7 w-full items-center justify-between rounded-[8px] bg-secondary px-2.5 text-[11px] font-medium text-foreground">
                  <span>Modal Dialog</span>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    ▼
                  </span>
                </div>

                {/* Live Real-World UI Archetype Preview Footprint */}
                <div className="relative flex h-44 w-full items-center justify-center rounded-[16px] bg-muted p-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-[10px] bg-background px-4 py-2 text-xs font-semibold text-foreground">
                      Live Modal {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Synchronized on Spacebar
                    </span>
                  </div>
                </div>
              </div>

              {/* Tile Baseline Telemetry & 1-Click Export */}
              <div className="flex items-center justify-between border-t border-secondary pt-2 font-mono text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Settle:</span>
                  <span
                    className={cn(
                      "font-medium",
                      tile.isWinner ? "text-primary" : "text-foreground"
                    )}
                  >
                    {tile.settle}
                  </span>
                </div>
                <button
                  type="button"
                  className={cn(
                    "flex cursor-pointer items-center gap-1 rounded-[6px] px-2 py-0.5 font-mono text-[9px] font-medium transition-colors",
                    tile.isWinner
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>Export</span>
                  <span>⌘C</span>
                </button>
              </div>
            </section>
          ))}
        </div>

        {/* SYNCHRONIZED PLAYBACK DOCK (Center-Bottom) */}
        <section
          aria-label="Synchronized Playback Dock"
          className="flex h-11 shrink-0 items-center justify-between gap-3 rounded-[16px] bg-background px-4 transition-colors"
        >
          {/* Synchronized Trigger Action */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] bg-foreground px-3 font-heading text-xs font-semibold text-background transition-transform active:scale-95">
              <span>Trigger All</span>
              <kbd className="font-mono text-[9px] opacity-75">Space</kbd>
            </div>
            <div className="flex h-7 cursor-pointer items-center rounded-[8px] bg-secondary px-2.5 font-heading text-xs text-muted-foreground hover:text-foreground">
              Interruption Stress Test
            </div>
          </div>

          {/* Speed & Settle Delta Telemetry */}
          <div className="flex items-center gap-4">
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

            <div className="hidden items-center gap-1.5 font-mono text-[10px] text-muted-foreground sm:flex">
              <span>Settle Delta:</span>
              <span className="font-semibold text-primary">
                Variant is 70ms faster
              </span>
            </div>
          </div>

          {/* Export Winner & Return Hook */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] bg-foreground px-2.5 font-heading text-xs font-semibold text-background transition-transform hover:opacity-90 active:scale-95"
            >
              <span>Export Winner</span>
              <kbd className="font-mono text-[9px] opacity-80">⌘E</kbd>
            </button>
            <Link
              href={ROUTES.stage1}
              className="flex h-7 items-center rounded-[8px] bg-secondary px-2.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Exit (Esc) ↗
            </Link>
          </div>
        </section>
      </main>

      {/* =====================================================================
          SLIM RIGHT RAIL: 48px Collapsed Width (Block D)
          ===================================================================== */}
      <aside className="flex w-12 shrink-0 flex-col justify-between rounded-[16px] bg-background p-2 transition-all">
        {/* Top Icons */}
        <div className="flex flex-col items-center gap-3">
          <div
            title="Export Panel"
            className="flex size-8 cursor-pointer items-center justify-center rounded-[8px] bg-secondary font-mono text-[11px] text-muted-foreground hover:text-foreground"
          >
            EXP
          </div>
          <div
            title="Archetype Motion Info"
            className="flex size-8 cursor-pointer items-center justify-center rounded-[8px] bg-secondary font-mono text-[11px] text-muted-foreground hover:text-foreground"
          >
            INF
          </div>
        </div>

        {/* Bottom Status */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[8px] tracking-tighter text-muted-foreground uppercase [writing-mode:vertical-lr]">
            Export · 48px
          </span>
          <div className="size-2 rounded-full bg-muted-foreground" />
        </div>
      </aside>
    </div>
  )
}
