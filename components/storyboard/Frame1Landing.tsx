"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Book02Icon } from "@hugeicons/core-free-icons"
import { SiGithub } from "@icons-pack/react-simple-icons"
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Scale,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  LayoutGrid,
} from "lucide-react"

import { SatisiumLogo } from "@/components/satisium-logo"
import { MinimalThemeSwitcher } from "@/components/home/minimal-theme-switcher"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MiniGraph } from "@/components/ui/mini-graph"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BEZIER_PRESETS, SPRING_PRESETS, Preset } from "@/core/presets"
import { solveSpring, pointsToLinear } from "@/core/math/spring"
import { useEaseStore } from "@/store/useEaseStore"
import { PRODUCT, PROJECT } from "@/lib/config"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { BezierConfig, SpringConfig } from "@/core/types"

// --- EXACT CUBIC BEZIER MATHEMATICAL SOLVER ---
function evaluateCubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number
): number {
  if (x <= 0) return 0
  if (x >= 1) return 1

  let t = x
  for (let i = 0; i < 8; i++) {
    const currentX =
      3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t
    const dx =
      3 * (1 - t) * (1 - t) * x1 +
      6 * (1 - t) * t * (x2 - x1) +
      3 * t * t * (1 - x2)
    if (Math.abs(currentX - x) < 1e-5 || Math.abs(dx) < 1e-6) break
    t -= (currentX - x) / dx
    t = Math.max(0, Math.min(1, t))
  }

  return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t
}

// --- ARCHETYPE SPECIFICATIONS ---
interface ScenarioMeta {
  id: string
  label: string
  group: string
  law: string
  targetDuration: string
  prescriptions: Array<{
    id: string
    label: string
    mode: "bezier" | "spring"
    config: BezierConfig | SpringConfig
    duration?: number
  }>
}

const SCENARIOS: Record<string, ScenarioMeta> = {
  modal: {
    id: "modal",
    label: "Modal Dialog",
    group: "Overlays & Dialogs",
    law: "Center-stage arrivals must decelerate rapidly; dismiss exits must be swift and strictly zero-bounce.",
    targetDuration: "250ms – 380ms",
    prescriptions: [
      {
        id: "apple-decel",
        label: "Apple HIG Decel",
        mode: "bezier",
        config: { p1: { x: 0.16, y: 1 }, p2: { x: 0.3, y: 1 } },
        duration: 0.35,
      },
      {
        id: "m3-emphasized",
        label: "Material 3 Emphasized",
        mode: "bezier",
        config: { p1: { x: 0.05, y: 0.7 }, p2: { x: 0.1, y: 1 } },
        duration: 0.4,
      },
      {
        id: "cushioned-spring",
        label: "Cushioned Spring",
        mode: "spring",
        config: { mass: 1, stiffness: 300, damping: 30, velocity: 0 },
      },
    ],
  },
  drawer: {
    id: "drawer",
    label: "Drawer / Sheet",
    group: "Overlays & Dialogs",
    law: "Edge-sliding sheets require high initial velocity followed by a cushioned physical stop.",
    targetDuration: "300ms – 450ms",
    prescriptions: [
      {
        id: "ios-sheet",
        label: "iOS Fluid Sheet",
        mode: "bezier",
        config: { p1: { x: 0.32, y: 1 }, p2: { x: 0.24, y: 1 } },
        duration: 0.4,
      },
    ],
  },
  carousel: {
    id: "carousel",
    label: "Product Carousel",
    group: "Navigation & Surfacing",
    law: "High travel distance requires friction glide without sudden hard stops to avoid motion sickness.",
    targetDuration: "400ms – 600ms",
    prescriptions: [
      {
        id: "apple-fluid",
        label: "Apple Fluid Decel",
        mode: "bezier",
        config: { p1: { x: 0.25, y: 1 }, p2: { x: 0.5, y: 1 } },
        duration: 0.5,
      },
      {
        id: "soft-glide",
        label: "Soft Glide Spring",
        mode: "spring",
        config: { mass: 1, stiffness: 180, damping: 26, velocity: 0 },
      },
    ],
  },
  tabs: {
    id: "tabs",
    label: "Segmented Tabs",
    group: "Navigation & Surfacing",
    law: "Rapid re-targeting requires critically damped motion with zero oscillation.",
    targetDuration: "200ms – 300ms",
    prescriptions: [
      {
        id: "critical-spring",
        label: "Critically Damped",
        mode: "spring",
        config: { mass: 1, stiffness: 400, damping: 40, velocity: 0 },
      },
    ],
  },
  button: {
    id: "button",
    label: "Tactile Button",
    group: "Micro-interactions",
    law: "Micro-interactions under 150ms must feel instantaneous on press and tactile on release.",
    targetDuration: "100ms – 180ms",
    prescriptions: [
      {
        id: "snappy-pop",
        label: "Snappy Pop Spring",
        mode: "spring",
        config: { mass: 1, stiffness: 500, damping: 28, velocity: 0 },
      },
    ],
  },
  toast: {
    id: "toast",
    label: "Toast Alert",
    group: "Feedback",
    law: "Peripheral alerts must enter briskly with subtle cushion without hijacking center focus.",
    targetDuration: "250ms – 320ms",
    prescriptions: [
      {
        id: "snappy-out",
        label: "Snappy Out",
        mode: "bezier",
        config: { p1: { x: 0, y: 0 }, p2: { x: 0.2, y: 1 } },
        duration: 0.3,
      },
    ],
  },
}

export function Frame1Landing() {
  const {
    mode,
    setMode,
    bezier,
    spring,
    duration,
    setDuration,
    applyPreset,
    setBezierConfig,
    setSpringConfig,
  } = useEaseStore()

  // View Mode: Pure Blocks Wireframe vs Live Interactive UI
  const [viewMode, setViewMode] = React.useState<"blocks" | "live">("blocks")

  // Interaction State
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [activeScenarioKey, setActiveScenarioKey] =
    React.useState<string>("modal")
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] =
    React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [speedMultiplier, setSpeedMultiplier] = React.useState<number>(1)
  const [scrubberValue, setScrubberValue] = React.useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [compareTrayCount, setCompareTrayCount] = React.useState(1)
  const [animKey, setAnimKey] = React.useState(0)
  const [hasCopiedCode, setHasCopiedCode] = React.useState(false)
  const [codeFormat, setCodeFormat] = React.useState<
    "css" | "tailwind" | "motion"
  >("css")

  // Math Solvers
  const springResult = React.useMemo(() => {
    return solveSpring(spring.mass, spring.stiffness, spring.damping)
  }, [spring.mass, spring.stiffness, spring.damping])

  const { cssEase, calculatedDuration, codeSnippets } = React.useMemo(() => {
    if (mode === "bezier") {
      const bStr = `cubic-bezier(${bezier.p1.x}, ${bezier.p1.y}, ${bezier.p2.x}, ${bezier.p2.y})`
      return {
        cssEase: bStr,
        calculatedDuration: duration,
        codeSnippets: {
          css: `transition: all ${duration}s ${bStr};`,
          tailwind: `ease-[${bStr}] duration-[${Math.round(duration * 1000)}ms]`,
          motion: `transition: { duration: ${duration}, ease: [${bezier.p1.x}, ${bezier.p1.y}, ${bezier.p2.x}, ${bezier.p2.y}] }`,
        },
      }
    } else {
      const linStr = pointsToLinear(springResult.points)
      return {
        cssEase: linStr,
        calculatedDuration: springResult.duration,
        codeSnippets: {
          css: `transition: all ${springResult.duration}s ${linStr};`,
          tailwind: `/* Spring CSS linear() */\nease-[${linStr}]`,
          motion: `transition: { type: "spring", stiffness: ${spring.stiffness}, damping: ${spring.damping}, mass: ${spring.mass} }`,
        },
      }
    }
  }, [mode, bezier, spring, duration, springResult])

  const effectiveDuration = calculatedDuration / speedMultiplier

  // Evaluated Scrubber Progression
  const evaluatedProgress = React.useMemo(() => {
    if (scrubberValue === null) return 1
    const fraction = scrubberValue / 100
    if (mode === "bezier") {
      return evaluateCubicBezier(
        bezier.p1.x,
        bezier.p1.y,
        bezier.p2.x,
        bezier.p2.y,
        fraction
      )
    } else {
      const points = springResult.points
      if (points.length === 0) return fraction
      const idx = Math.min(
        points.length - 1,
        Math.max(0, Math.round(fraction * (points.length - 1)))
      )
      return points[idx]
    }
  }, [scrubberValue, mode, bezier, springResult])

  // Replay
  const handleReplay = React.useCallback(() => {
    setScrubberValue(null)
    setIsPlaying(true)
    setAnimKey((k) => k + 1)
  }, [])

  // Keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      if (e.code === "Space") {
        e.preventDefault()
        handleReplay()
      } else if (e.key.toLowerCase() === "c") {
        e.preventDefault()
        alert("Morphing to Frame 04: The Curve Sculptor")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleReplay])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[codeFormat])
    setHasCopiedCode(true)
    setTimeout(() => setHasCopiedCode(false), 1600)
  }

  const activeScenario = SCENARIOS[activeScenarioKey] ?? SCENARIOS.modal

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex h-dvh w-full gap-2 overflow-hidden bg-muted p-2 font-sans text-foreground select-none">
        {/* ============================================================== */}
        {/* VIEW MODE TOGGLE (Floating Top Controller)                    */}
        {/* ============================================================== */}
        <div className="absolute top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-xl bg-background p-1">
          <button
            type="button"
            onClick={() => setViewMode("blocks")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-colors",
              viewMode === "blocks"
                ? "bg-foreground font-semibold text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid size={12} />
            <span>Pure Blocks Layout</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("live")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-colors",
              viewMode === "live"
                ? "bg-foreground font-semibold text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Maximize2 size={12} />
            <span>Live Interactive UI</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 1: LEFT RAIL (280px)                                    */}
        {/* ============================================================== */}
        <div className="flex h-full min-h-0 w-[280px] shrink-0 flex-col gap-2">
          {/* BLOCK 1: BRAND & NAVIGATION (280px x 48px) */}
          <div className="flex h-12 shrink-0 items-center justify-between rounded-xl bg-background px-3.5">
            {viewMode === "blocks" ? (
              <div className="flex w-full items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">
                  BLOCK 01 • BRAND & NAV
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  280 × 48
                </span>
              </div>
            ) : (
              <>
                <Link
                  href={ROUTES.home}
                  className="flex items-center gap-2 rounded-md focus-visible:outline-none"
                  title="Return to Home"
                >
                  <span className="flex size-5 items-center justify-center">
                    <SatisiumLogo size={16} />
                  </span>
                  <span className="font-heading text-xs font-semibold tracking-tight text-foreground">
                    {PRODUCT.name}
                  </span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={ROUTES.docs}
                        className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <HugeiconsIcon icon={Book02Icon} size={14} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Documentation</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={PROJECT.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <SiGithub className="size-3.5 fill-current" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      GitHub Repository
                    </TooltipContent>
                  </Tooltip>

                  <MinimalThemeSwitcher />
                </div>
              </>
            )}
          </div>

          {/* BLOCK 2: PRESET CATALOG & SEARCH (280px x Flex) */}
          <aside className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-background p-4">
            {viewMode === "blocks" ? (
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      BLOCK 02 • PRESET CATALOG
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      280 × Flex
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Directory of 56 calibrated curves across Bezier & Spring
                    physics.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-muted p-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
                  <div className="text-[9px] font-semibold tracking-wider text-foreground uppercase">
                    Features Allocated:
                  </div>
                  <div>• Bezier vs Spring Switcher</div>
                  <div>• Live Curve Search Filter</div>
                  <div>• Category Chips (System, Fluid, Expressive)</div>
                  <div>• 56 Presets Grid with SVG Mini-Graphs</div>
                  <div>• Active Curve Selection State</div>
                </div>
              </div>
            ) : (
              <>
                {/* Mode Switcher */}
                <div className="mb-2 flex shrink-0 items-center rounded-lg bg-muted p-0.5">
                  <button
                    type="button"
                    onClick={() => setMode("bezier")}
                    className={cn(
                      "flex-1 rounded-md py-1 text-center font-mono text-[11px] font-medium transition-colors",
                      mode === "bezier"
                        ? "bg-background font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Bezier
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("spring")}
                    className={cn(
                      "flex-1 rounded-md py-1 text-center font-mono text-[11px] font-medium transition-colors",
                      mode === "spring"
                        ? "bg-background font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Spring
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-2 flex shrink-0 items-center">
                  <Search
                    size={12}
                    className="absolute left-2.5 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Search curves..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-7 w-full rounded-lg bg-muted pr-2.5 pl-7 font-mono text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>

                {/* Category Chips */}
                <div className="mb-2.5 flex shrink-0 items-center gap-1">
                  {["all", "system", "fluid", "expressive"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={cn(
                        "flex-1 rounded-md py-0.5 text-center font-sans text-[10px] capitalize transition-colors",
                        categoryFilter === cat
                          ? "bg-secondary font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Presets List */}
                <ScrollArea className="min-h-0 flex-1 pr-1">
                  <div className="grid grid-cols-3 gap-1">
                    {(mode === "bezier" ? BEZIER_PRESETS : SPRING_PRESETS).map(
                      (item) => {
                        const isBezier = mode === "bezier"
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              if (isBezier) {
                                applyPreset(
                                  "bezier",
                                  item as Preset<BezierConfig>
                                )
                              } else {
                                applyPreset(
                                  "spring",
                                  item as Preset<SpringConfig>
                                )
                              }
                            }}
                            className="flex flex-col items-center gap-1 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <div className="relative size-8">
                              <MiniGraph
                                mode={mode}
                                bezier={
                                  isBezier
                                    ? (item.value as BezierConfig)
                                    : undefined
                                }
                                spring={
                                  !isBezier
                                    ? (item.value as SpringConfig)
                                    : undefined
                                }
                                className="h-full w-full stroke-primary stroke-2"
                              />
                            </div>
                            <span className="w-full truncate text-center text-[10px]">
                              {item.label}
                            </span>
                          </button>
                        )
                      }
                    )}
                  </div>
                </ScrollArea>
              </>
            )}
          </aside>

          {/* BLOCK 3: SPONSOR / AD ECOSYSTEM SLOT (280px x 80px) */}
          <div className="flex h-20 shrink-0 flex-col justify-between rounded-xl bg-background p-3.5">
            {viewMode === "blocks" ? (
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    BLOCK 03 • SPONSOR / AD
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    280 × 80
                  </span>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  Dedicated ecosystem & sponsor monetization card.
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                  Sponsor
                </span>
                <span className="font-heading text-xs font-semibold text-foreground">
                  Satisium UI Kit
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Pro token library & Figma system.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 2: CENTER HERO COLUMN                                   */}
        {/* ============================================================== */}
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col gap-2">
          {/* BLOCK 4: REAL-WORLD COMPONENT HERO CANVAS (100% Height Canvas) */}
          <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-xl bg-background p-6">
            {viewMode === "blocks" ? (
              <div className="flex max-w-md flex-col items-center justify-center text-center">
                <span className="font-mono text-sm font-semibold text-foreground">
                  BLOCK 04 • REAL-WORLD COMPONENT HERO CANVAS
                </span>
                <span className="mt-1 font-mono text-xs text-muted-foreground">
                  Flex-1 × Flex-1 (100% Full Height)
                </span>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Generous, distraction-free stage where realistic UI components
                  animate actively under the selected curve.
                </p>
                <div className="mt-6 flex w-full flex-col gap-1.5 rounded-xl bg-muted p-4 text-left font-mono text-xs text-muted-foreground">
                  <div className="text-[10px] font-semibold tracking-wider text-foreground uppercase">
                    Features Allocated:
                  </div>
                  <div>• 100% Full-Height Component Canvas</div>
                  <div>
                    • Real Physics Motion Preview (Modal, Carousel, Sheet...)
                  </div>
                  <div>
                    • Direct Interactive Manipulation (Press, Slide, Dismiss)
                  </div>
                  <div>• Morph Bridge Trigger: [Customize Curve (C)]</div>
                </div>
              </div>
            ) : (
              <>
                {/* 1. SCENARIO: MODAL DIALOG */}
                {activeScenarioKey === "modal" && (
                  <div className="relative flex h-full w-full max-w-sm items-center justify-center">
                    <div
                      key={`backdrop-${animKey}`}
                      className="absolute inset-0 rounded-2xl bg-muted"
                    />
                    <div
                      key={`modal-${animKey}`}
                      style={
                        scrubberValue !== null
                          ? {
                              transform: `scale(${0.92 + 0.08 * evaluatedProgress}) translateY(${8 - 8 * evaluatedProgress}px)`,
                              opacity: Math.max(
                                0,
                                Math.min(1, evaluatedProgress)
                              ),
                            }
                          : {
                              animationName: reducedMotion
                                ? "ease-fade-safe"
                                : "ease-modal-in",
                              animationDuration: `${effectiveDuration}s`,
                              animationTimingFunction: cssEase,
                              animationFillMode: "forwards",
                              animationPlayState: isPlaying
                                ? "running"
                                : "paused",
                            }
                      }
                      className="relative z-10 w-full rounded-2xl bg-background p-6 text-foreground"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-heading text-sm font-semibold tracking-tight">
                            Discard changes?
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Any unsaved progress will be permanently lost.
                          </p>
                        </div>
                        <button
                          onClick={handleReplay}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="mt-6 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleReplay}
                          className="rounded-lg bg-muted px-3 py-1.5 text-xs text-foreground hover:bg-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleReplay}
                          className="rounded-lg bg-primary px-3.5 py-1.5 text-xs text-primary-foreground hover:opacity-90"
                        >
                          Discard
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Customize Bridge */}
                <div className="absolute bottom-4 z-20">
                  <button
                    type="button"
                    onClick={() => {
                      alert("Morphing to Frame 04: The Curve Sculptor")
                    }}
                    className="flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <SlidersHorizontal size={12} />
                    <span>Customize curve</span>
                    <kbd className="py-0.2 ml-1 rounded bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                      C
                    </kbd>
                  </button>
                </div>
              </>
            )}
          </main>

          {/* BOTTOM DOCK ROW */}
          <div className="flex h-12 shrink-0 gap-2">
            {/* BLOCK 5: SCALABLE COMPONENT SELECTOR (220px x 48px) */}
            <div className="relative flex w-60 shrink-0 items-center justify-between rounded-xl bg-background px-3.5">
              {viewMode === "blocks" ? (
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    BLOCK 05 • COMPONENT DROPDOWN
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    240 × 48
                  </span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setIsScenarioDropdownOpen(!isScenarioDropdownOpen)
                    }
                    className="flex w-full items-center justify-between text-xs font-medium text-foreground"
                  >
                    <span>{activeScenario.label}</span>
                    <ChevronDown size={12} className="text-muted-foreground" />
                  </button>

                  {isScenarioDropdownOpen && (
                    <div className="absolute bottom-full left-0 z-30 mb-2 w-56 rounded-xl bg-background p-1.5 shadow-lg">
                      {Object.values(SCENARIOS).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setActiveScenarioKey(s.id)
                            setIsScenarioDropdownOpen(false)
                            handleReplay()
                          }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                            activeScenarioKey === s.id
                              ? "bg-secondary font-medium text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <span>{s.label}</span>
                          <span className="font-mono text-[9px] text-muted-foreground">
                            {s.group.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* BLOCK 6: TRANSPORT & PRECISION SCRUBBER DOCK (Flex x 48px) */}
            <div className="flex flex-1 items-center justify-between rounded-xl bg-background px-4">
              {viewMode === "blocks" ? (
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    BLOCK 06 • TRANSPORT & PRECISION SCRUBBER DOCK
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Replay, Scrubber, Speed Multipliers, Reduced Motion (Flex ×
                    48)
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={handleReplay}
                          className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-secondary"
                        >
                          <RotateCcw size={13} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Replay (Space)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {isPlaying ? "Pause" : "Play"}
                      </TooltipContent>
                    </Tooltip>

                    {/* Speed Multipliers */}
                    <div className="ml-1 flex items-center rounded-lg bg-muted p-0.5">
                      {[1, 0.5, 0.25].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSpeedMultiplier(s)}
                          className={cn(
                            "rounded-md px-2 py-0.5 font-mono text-[10px] transition-colors",
                            speedMultiplier === s
                              ? "bg-background font-semibold text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Real-Math Scrubber */}
                  <div className="flex max-w-xs flex-1 items-center gap-2 px-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scrubberValue ?? 100}
                      onChange={(e) => {
                        setIsPlaying(false)
                        setScrubberValue(parseInt(e.target.value))
                      }}
                      className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                    />
                    <span className="w-8 text-right font-mono text-[10px] text-muted-foreground">
                      {scrubberValue !== null ? `${scrubberValue}%` : "100%"}
                    </span>
                  </div>

                  {/* Reduced Motion Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setReducedMotion(!reducedMotion)}
                        className={cn(
                          "flex size-7 items-center justify-center rounded-lg transition-colors",
                          reducedMotion
                            ? "bg-secondary font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {reducedMotion ? (
                          <EyeOff size={13} />
                        ) : (
                          <Eye size={13} />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {reducedMotion
                        ? "Reduced motion: On"
                        : "Simulate prefers-reduced-motion"}
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 3: RIGHT RAIL (320px)                                   */}
        {/* ============================================================== */}
        <div className="flex h-full min-h-0 w-[320px] shrink-0 flex-col gap-2">
          {/* BLOCK 7: MOTION LAW, PRESCRIPTIONS & CODE EXPORT (320px x Flex) */}
          <aside className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-background p-4">
            {viewMode === "blocks" ? (
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      BLOCK 07 • MOTION LAW & EXPORT
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      320 × Flex
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Archetype rationale, target duration, curated prescriptions,
                    and production code export.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-muted p-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
                  <div className="text-[9px] font-semibold tracking-wider text-foreground uppercase">
                    Features Allocated:
                  </div>
                  <div>• Dynamic Motion Law per Archetype</div>
                  <div>• Recommended Duration Window</div>
                  <div>• Curated Contextual Prescriptions (1-Click)</div>
                  <div>• Multi-Framework Export (CSS, TW, Motion)</div>
                  <div>• 1-Click Code Copy Action</div>
                </div>
              </div>
            ) : (
              <ScrollArea className="min-h-0 flex-1 pr-1">
                <div className="flex flex-col gap-4">
                  {/* Motion Law Card */}
                  <div className="rounded-xl bg-muted p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs font-semibold text-foreground">
                        {activeScenario.label} Motion Law
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {activeScenario.targetDuration}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {activeScenario.law}
                    </p>
                  </div>

                  {/* Contextual Prescriptions */}
                  <div>
                    <span className="mb-2 block font-mono text-[10px] text-muted-foreground uppercase">
                      Recommended Prescriptions
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {activeScenario.prescriptions.map((rec) => (
                        <button
                          key={rec.id}
                          type="button"
                          onClick={() => {
                            if (rec.mode === "bezier") {
                              setMode("bezier")
                              setBezierConfig(rec.config as BezierConfig)
                              if (rec.duration) setDuration(rec.duration)
                            } else {
                              setMode("spring")
                              setSpringConfig(rec.config as SpringConfig)
                            }
                            handleReplay()
                          }}
                          className="group flex flex-col items-start rounded-lg bg-muted p-2.5 text-left transition-colors hover:bg-secondary"
                        >
                          <div className="flex w-full items-center justify-between">
                            <span className="font-heading text-xs font-medium text-foreground group-hover:text-primary">
                              {rec.label}
                            </span>
                            <span className="font-mono text-[9px] text-muted-foreground uppercase">
                              {rec.mode}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Export Box */}
                  <div className="pt-2">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground uppercase">
                        Code Export
                      </span>
                      <div className="flex items-center gap-1 rounded-md bg-muted p-0.5">
                        {(["css", "tailwind", "motion"] as const).map((fmt) => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setCodeFormat(fmt)}
                            className={cn(
                              "rounded px-1.5 py-0.5 font-mono text-[9px] uppercase transition-colors",
                              codeFormat === fmt
                                ? "bg-background font-semibold text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between rounded-lg bg-muted p-2.5 font-mono text-[10px] text-foreground">
                      <span className="truncate pr-2">
                        {codeSnippets[codeFormat]}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="flex size-6 shrink-0 items-center justify-center rounded bg-background text-muted-foreground hover:text-foreground"
                      >
                        {hasCopiedCode ? (
                          <Check size={11} />
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </aside>

          {/* BLOCK 8: COMPARE BENCH STAGING DOCK (320px x 48px) */}
          <div className="flex h-12 shrink-0 items-center justify-between rounded-xl bg-background px-3.5">
            {viewMode === "blocks" ? (
              <div className="flex w-full items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">
                  BLOCK 08 • COMPARE BENCH
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  320 × 48
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Scale size={13} className="text-muted-foreground" />
                  <span className="font-mono text-[10px] text-foreground">
                    Compare Bench ({compareTrayCount})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCompareTrayCount((c) => c + 1)}
                    className="rounded-lg bg-muted px-2 py-1 text-xs text-foreground transition-colors hover:bg-secondary"
                  >
                    + Stash
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert("Triggering transition to Frame 09: Compare Duel")
                    }}
                    className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
                  >
                    Launch
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
