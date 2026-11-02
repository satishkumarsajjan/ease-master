"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { SatisiumLogo } from "@/components/satisium-logo"
import {
  BookOpen01Icon,
  Sun02Icon,
  Moon02Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { useMounted } from "@/hooks/use-mounted"
import { CommandMenuTrigger } from "@/components/layout/command-menu"
import { ROUTES } from "@/lib/routes"
import { PROJECT } from "@/lib/social-links"
import { cn } from "@/lib/utils"

interface PresetItem {
  id: string
  name: string
  category: "fluid" | "snappy" | "bouncy" | "mechanical"
  engine: "bezier" | "spring"
  values: string
  points?: [number, number, number, number]
}

const PRESET_CATALOG: PresetItem[] = [
  {
    id: "std-decel",
    name: "Standard Decelerate",
    category: "fluid",
    engine: "bezier",
    values: "0.0, 0.0, 0.2, 1.0",
    points: [0.0, 0.0, 0.2, 1.0],
  },
  {
    id: "m3-emphasized",
    name: "Material 3 Emphasized",
    category: "snappy",
    engine: "bezier",
    values: "0.2, 0.0, 0.0, 1.0",
    points: [0.2, 0.0, 0.0, 1.0],
  },
  {
    id: "apple-fluid",
    name: "Apple Fluid Decel",
    category: "fluid",
    engine: "bezier",
    values: "0.25, 1.0, 0.5, 1.0",
    points: [0.25, 1.0, 0.5, 1.0],
  },
  {
    id: "snappy-out",
    name: "Snappy Anticipate",
    category: "snappy",
    engine: "bezier",
    values: "0.16, 1.0, 0.3, 1.0",
    points: [0.16, 1.0, 0.3, 1.0],
  },
  {
    id: "bouncy-overshoot",
    name: "Bouncy Back Overshoot",
    category: "bouncy",
    engine: "bezier",
    values: "0.34, 1.56, 0.64, 1.0",
    points: [0.34, 1.56, 0.64, 1.0],
  },
  {
    id: "mechanical-linear",
    name: "Linear Uniform",
    category: "mechanical",
    engine: "bezier",
    values: "0.0, 0.0, 1.0, 1.0",
    points: [0.0, 0.0, 1.0, 1.0],
  },
  {
    id: "spring-cushioned",
    name: "Cushioned Spring",
    category: "fluid",
    engine: "spring",
    values: "k:300 · c:30 · m:1",
  },
  {
    id: "spring-bouncy",
    name: "Snappy Spring",
    category: "bouncy",
    engine: "spring",
    values: "k:240 · c:14 · m:1",
  },
]

/**
 * ============================================================================
 * STAGE 1: THE AUDITION STAGE (PURE SPATIAL BLOCK LAYOUT)
 * ============================================================================
 * - Shell: Full-bleed viewport edge-to-edge (h-dvh w-full overflow-hidden bg-muted p-2 gap-2).
 * - Left Flank: w-[280px] Hug-Fill-Hug vertical rhythm (Blocks 1, 2, 3).
 * - Squircles: Outer major blocks rounded-[20px]; secondary bars rounded-[14px];
 *   inner tokens rounded-[10px]. Zero 1px borders, zero drop shadows.
 * - Gutters: Exactly 8px (gap-2 p-2) exposing the sunken bg-muted substrate.
 * ============================================================================
 */
export function Stage1Audition() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()
  const [activeEngine, setActiveEngine] = React.useState<"bezier" | "spring">(
    "bezier"
  )
  const [activeCategory, setActiveCategory] = React.useState<string>("all")
  const [activePresetId, setActivePresetId] =
    React.useState<string>("std-decel")
  const [searchQuery] = React.useState<string>("")

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const filteredPresets = PRESET_CATALOG.filter((p) => {
    if (p.engine !== activeEngine) return false
    if (activeCategory !== "all" && p.category !== activeCategory) return false
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="flex h-dvh w-full gap-2 overflow-hidden bg-muted p-2 font-sans select-none">
      {/* =====================================================================
          LEFT FLANK: 280px Hug-Fill-Hug (Blocks 1, 2, 3)
          ===================================================================== */}
      <aside className="flex w-[280px] shrink-0 flex-col gap-2">
        {/* BLOCK 1: BRAND SLAB & ACTION DOCK */}
        <header
          aria-label="Block 1: Brand and Quick Actions"
          className="flex shrink-0 flex-col gap-2 select-none"
        >
          {/* BRAND CHASSIS: DUAL-BOX (BOX-IN-BOX) WITH CONCAVE INVERSE FILLETS */}
          <div className="flex flex-col items-end">
            {/* The Outer Box Chassis: Ultra-thin subtle brand razor bezel */}
            <div className="flex w-full flex-col rounded-[14px] bg-brand p-0.5 transition-colors">
              {/* The Inner Box Slab: Elevated height with prominent brand lockup */}
              <div className="flex h-12 w-full items-center justify-between rounded-[12px] bg-background px-3.5 transition-colors">
                <div className="flex items-center gap-2.5">
                  <SatisiumLogo size={28} className="shrink-0" />
                  <span className="font-heading text-base font-semibold tracking-tight text-foreground">
                    Ease
                  </span>
                </div>
                <span className="font-mono text-[10px] font-medium tracking-wider text-muted-foreground">
                  v 1.0
                </span>
              </div>
            </div>

            {/* Satisium Folded Architectural Index Tab with Continuous Inverse Fillets */}
            <div className="relative -mt-px mr-3.5 inline-flex h-6 items-center justify-center rounded-b-[7px] bg-brand px-3 text-brand-foreground select-none">
              {/* Left Concave Inverse Fillet */}
              <svg
                className="pointer-events-none absolute top-0 right-full h-2 w-2"
                viewBox="0 0 8 8"
                fill="none"
                style={{ fill: "var(--brand)" }}
                aria-hidden="true"
              >
                <path d="M0 0 A 8 8 0 0 1 8 8 L 8 0 Z" />
              </svg>

              {/* Right Concave Inverse Fillet */}
              <svg
                className="pointer-events-none absolute top-0 left-full h-2 w-2"
                viewBox="0 0 8 8"
                fill="none"
                style={{ fill: "var(--brand)" }}
                aria-hidden="true"
              >
                <path d="M0 8 A 8 8 0 0 1 8 0 L 0 0 Z" />
              </svg>

              <span className="font-sans text-[10px] leading-none tracking-tight">
                <span className="font-normal opacity-90">A tool by </span>
                <span className="font-bold tracking-normal">Satisium</span>
              </span>
            </div>
          </div>

          {/* ACTION ROW: COMMAND MENU TRIGGER + 3 CLEAN SQUIRCLES */}
          <div className="flex items-center gap-1.5">
            {/* Command Menu Trigger (Default Wide Variant) */}
            <CommandMenuTrigger className="h-9 w-auto min-w-0 flex-1 rounded-[10px] bg-background px-3 text-xs text-muted-foreground shadow-none transition-colors hover:bg-secondary hover:text-foreground" />

            {/* 1. Github Squircle */}
            <a
              href={PROJECT.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              title="GitHub Repository"
              className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <SiGithub className="size-3.5 fill-current" />
            </a>

            {/* 2. Docs Squircle */}
            <Link
              href={ROUTES.docs}
              aria-label="Documentation"
              title="Documentation (/docs)"
              className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <HugeiconsIcon icon={BookOpen01Icon} className="size-4" />
            </Link>

            {/* 3. Theme Toggle Squircle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Color Theme"
              title="Toggle Color Theme"
              className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <HugeiconsIcon
                icon={mounted && theme === "dark" ? Sun02Icon : Moon02Icon}
                className="size-4"
              />
            </button>
          </div>
        </header>

        {/* BLOCK 2: PRESET CATALOG & FILTERS (FILL REMAINING HEIGHT) */}
        <section
          aria-label="Block 2: Preset Catalog and Filters"
          className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden rounded-[20px] bg-background p-3 transition-colors"
        >
          {/* Engine Tabs (Segmented 28px Track) */}
          <div className="flex h-7 w-full shrink-0 items-center rounded-[10px] bg-muted p-0.5">
            <button
              type="button"
              onClick={() => setActiveEngine("bezier")}
              className={cn(
                "h-full flex-1 rounded-[8px] text-center font-heading text-[11px] font-medium transition-colors",
                activeEngine === "bezier"
                  ? "bg-background text-foreground shadow-none"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Bezier (18)
            </button>
            <button
              type="button"
              onClick={() => setActiveEngine("spring")}
              className={cn(
                "h-full flex-1 rounded-[8px] text-center font-heading text-[11px] font-medium transition-colors",
                activeEngine === "spring"
                  ? "bg-background text-foreground shadow-none"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Spring (8)
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex shrink-0 flex-wrap gap-1">
            {["all", "fluid", "snappy", "bouncy", "mechanical"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-[6px] px-2 py-0.5 font-mono text-[9px] capitalize transition-colors",
                  activeCategory === cat
                    ? "bg-foreground font-semibold text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scrollable Preset Inventory Deck */}
          <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-0.5">
            {filteredPresets.map((item) => {
              const isActive = item.id === activePresetId
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePresetId(item.id)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-[12px] p-2 text-left transition-colors",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate font-heading text-xs font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {item.values}
                    </span>
                  </div>

                  {/* SVG Physics Curve Sparkline */}
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-muted p-1">
                    <svg
                      viewBox="0 0 36 20"
                      className="size-full overflow-visible"
                    >
                      {item.engine === "bezier" && item.points ? (
                        <>
                          <path
                            d={`M 2 18 C ${(2 + item.points[0] * 32).toFixed(1)} ${(18 - item.points[1] * 16).toFixed(1)}, ${(2 + item.points[2] * 32).toFixed(1)} ${(18 - item.points[3] * 16).toFixed(1)}, 34 2`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className={
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          />
                        </>
                      ) : (
                        <path
                          d="M 2 18 Q 8 2, 14 10 T 24 4 T 34 2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          className={
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        />
                      )}
                    </svg>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Block Status Indicator */}
          <div className="flex shrink-0 items-center justify-between pt-1 font-mono text-[9px] text-muted-foreground">
            <span>{filteredPresets.length} curves ready</span>
            <span className="font-medium text-foreground">
              Press 1-9 to audition
            </span>
          </div>
        </section>

        {/* BLOCK 3: SPONSOR & ECOSYSTEM RAIL (HUG CONTENT · 2 VERTICAL TIERS) */}
        <footer
          aria-label="Block 3: Sponsor and Platform Rail"
          className="flex shrink-0 flex-col gap-2 rounded-[20px] bg-background p-3 transition-colors"
        >
          {/* Tier 1: Sponsor / Partner Ecosystem Showcase */}
          <a
            href="https://satisium.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-[12px] bg-muted p-2 transition-colors hover:bg-secondary"
          >
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-foreground text-background">
                <SatisiumLogo size="12" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-heading text-[11px] font-semibold text-foreground">
                  Satisium Design
                </span>
                <span className="truncate font-sans text-[10px] text-muted-foreground">
                  The UI Architecture System
                </span>
              </div>
            </div>
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
            />
          </a>

          {/* Tier 2: External Links & Pedigree Strip */}
          <div className="flex items-center justify-between px-1 font-mono text-[10px] text-muted-foreground">
            <a
              href="https://satisium.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              satisium.com ↗
            </a>
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com/satisium"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                Twitter
              </a>
              <span className="font-mono text-[9px] text-muted-foreground">
                ·
              </span>
              <a
                href="https://github.com/satisium"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </aside>

      {/* =====================================================================
          CENTER STAGE: Flex-1 Full-Height Hero Canvas & Controls (Blocks 4, 5, 6)
          ===================================================================== */}
      <main className="flex min-w-0 flex-1 flex-col gap-2">
        {/* BLOCK 4: REAL-WORLD COMPONENT AUDITION CANVAS */}
        <section
          aria-label="Block 4: Real-World Component Audition Canvas"
          className="relative flex min-h-0 flex-1 flex-col justify-between overflow-hidden rounded-[20px] bg-background p-6 transition-colors"
        >
          {/* Top Identifier & Customize Hook */}
          <div className="z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Block 04 · Center Stage
              </span>
              <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                Flex-1 × Flex-1 (100% Full-Height Canvas)
              </span>
            </div>

            {/* Crucial Stage 2 Transition Hook */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">
                Press [2] or click:
              </span>
              <div className="flex cursor-pointer items-center gap-1.5 rounded-[10px] bg-foreground px-3.5 py-1.5 font-heading text-xs font-semibold text-background transition-transform active:scale-95">
                <span>Customize Curve</span>
                <span className="font-mono text-[10px]">↗</span>
              </div>
            </div>
          </div>

          {/* Central Spatial Schematic: Real-World UI Archetype Active Stage */}
          <div className="z-10 mx-auto my-auto flex max-w-lg flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-[16px] bg-secondary font-mono text-sm font-semibold text-foreground">
              UI
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Real-World Component Stage
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Audition active easing curves in full-fidelity on production UI
              archetypes with zero mathematical intimidation.
            </p>

            {/* Archetype Wireframe Preview Footprint (Modal / Carousel / Sheet) */}
            <div className="mt-6 flex w-full max-w-md flex-col gap-3 rounded-[16px] bg-muted p-5 text-left">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold tracking-wide text-foreground uppercase">
                  Active Archetype: Modal Dialog
                </span>
                <span className="rounded-[6px] bg-background px-2 py-0.5 font-mono text-[10px] font-medium text-foreground">
                  Apple Fluid Decel
                </span>
              </div>
              <div className="flex h-16 w-full items-center justify-center rounded-[10px] bg-background text-xs font-medium text-muted-foreground">
                [ Interactive Component Sandbox Mounts Here ]
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                <span>Travel: Scale 0.92 → 1.0 + Fade</span>
                <span>Settle: 320ms</span>
              </div>
            </div>
          </div>

          {/* Bottom Stage Blueprint Baseline */}
          <div className="z-10 flex items-center justify-between pt-2 font-mono text-[10px] text-muted-foreground">
            <span>Reaches Viewport Top Edge (Zero Global Header Penalty)</span>
            <span>Uninterrupted Spatial Focus</span>
          </div>
        </section>

        {/* CENTER BOTTOM TOOLBAR ROW (Blocks 5 & 6) */}
        <div className="flex h-11 shrink-0 gap-2">
          {/* BLOCK 5: SCALABLE COMPONENT SELECTOR (220px Fixed) */}
          <section
            aria-label="Block 5: Component Selector"
            className="flex w-[220px] shrink-0 items-center justify-between rounded-[16px] bg-background px-3.5 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-mono text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
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
            aria-label="Block 6: Transport, Scrubber and Accessibility"
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

            {/* Speed & Scrubber Footprint */}
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
                  <div className="absolute top-1/2 left-[38%] size-3 -translate-y-1/2 rounded-full bg-foreground" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  100%
                </span>
              </div>
            </div>

            {/* Reduced Motion A11y Toggle */}
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
        {/* BLOCK 7: PRODUCTION EXPORT & CONTEXTUAL MOTION LAW */}
        <section
          aria-label="Block 7: Production Export and Motion Law"
          className="flex min-h-0 flex-1 flex-col justify-between rounded-[20px] bg-background p-4 transition-colors"
        >
          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Block 07 · Production Export
              </span>
              <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                300px × Flex
              </span>
            </div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Production Export & Guidance
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              First-class multi-framework handoff with archetype motion laws.
            </p>
          </div>

          {/* Core Functional Blueprint */}
          <div className="my-auto flex flex-col gap-3">
            {/* Multi-Framework Export Deck */}
            <div className="flex flex-col gap-2 rounded-[14px] bg-secondary p-3">
              {/* Framework Switcher Tabs */}
              <div className="flex h-8 w-full items-center justify-between rounded-[8px] bg-background p-1">
                {["CSS", "Tailwind", "Motion", "GSAP"].map((fw, i) => (
                  <div
                    key={fw}
                    className={cn(
                      "flex-1 cursor-pointer rounded-[6px] py-0.5 text-center font-heading text-[11px] font-medium transition-colors",
                      i === 0
                        ? "bg-foreground font-semibold text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {fw}
                  </div>
                ))}
              </div>

              {/* High-Contrast Neutral Copy Action */}
              <button
                type="button"
                className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-foreground px-3 font-heading text-xs font-semibold text-background transition-transform active:scale-95"
              >
                <span>Copy Ease Token</span>
                <kbd className="rounded-[4px] bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  ⌘C
                </kbd>
              </button>

              {/* Code Snippet Output Box */}
              <div className="flex flex-col gap-1 rounded-[8px] bg-background p-2.5">
                <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground">
                  <span>CSS Output</span>
                  <span>320ms Decel</span>
                </div>
                <code className="font-mono text-[10px] leading-tight break-all text-foreground">
                  transition: all 320ms cubic-bezier(0.25, 1.00, 0.50, 1.00);
                </code>
              </div>
            </div>

            {/* Contextual Archetype Guidance (Modal Law) */}
            <div className="flex flex-col gap-1.5 rounded-[12px] bg-muted p-2.5">
              <span className="font-mono text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">
                Active: Modal Motion Law
              </span>
              <p className="text-xs leading-snug text-foreground">
                &ldquo;Centered modals demand swift acceleration with cushioned
                deceleration. Never bounce &gt; 1 time in transactional
                UI.&rdquo;
              </p>
              <div className="flex items-center justify-between pt-0.5 font-mono text-[9px] text-muted-foreground">
                <span>Target Settle: 250ms – 350ms</span>
                <span className="cursor-pointer text-foreground hover:underline">
                  Playbook ↗
                </span>
              </div>
            </div>

            {/* Curated Prescriptions Stack */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                Curated Prescriptions:
              </span>
              {[
                {
                  name: "Apple Sheet Decel",
                  desc: "Native iOS fluid glide",
                  active: true,
                },
                {
                  name: "Material 3 Emphasized",
                  desc: "Rapid entry focus",
                  active: false,
                },
                {
                  name: "Cushioned Spring",
                  desc: "Zero-ringing settle",
                  active: false,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className={cn(
                    "flex items-center justify-between rounded-[8px] p-2 transition-colors",
                    item.active
                      ? "bg-secondary font-medium text-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-heading text-xs">{item.name}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {item.desc}
                    </span>
                  </div>
                  <span className="cursor-pointer font-mono text-[10px] font-medium text-foreground hover:underline">
                    Apply
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 font-mono text-[10px] text-muted-foreground">
            <span>Omnipresent Across Stages</span>
            <span>Zero-Friction Handoff</span>
          </div>
        </section>

        {/* BLOCK 8: COMPARE BENCH STAGING */}
        <section
          aria-label="Block 8: Compare Bench Staging"
          className="flex h-11 shrink-0 items-center justify-between rounded-[16px] bg-background px-3.5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
              Block 08
            </span>
            <span className="font-heading text-xs font-semibold text-foreground">
              Compare Bench
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              0/3 Staged
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
