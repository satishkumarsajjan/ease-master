"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { SatisiumLogo } from "@/components/satisium-logo"
import {
  BookOpen01Icon,
  Sun02Icon,
  Moon02Icon,
  ArrowUpRight01Icon,
  ArrowLeft01Icon,
  Search01Icon,
  Cancel01Icon,
  PlusSignIcon,
  PlayIcon,
  PauseIcon,
  Refresh03Icon,
  RepeatIcon,
  LaptopIcon,
  Tablet01Icon,
  SmartPhone01Icon,
  GitCompareIcon,
  SlidersHorizontalIcon,
} from "@hugeicons/core-free-icons"
import { motion, LayoutGroup, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PreviewBackground } from "@/components/previewer/preview-background"
import { ViewportMode } from "@/components/previewer/resizable-playground"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { useMounted } from "@/hooks/use-mounted"
import { CommandMenuTrigger } from "@/components/layout/command-menu"
import { MiniGraph } from "@/components/ui/mini-graph"
import { BEZIER_PRESETS, SPRING_PRESETS } from "@/core/presets"
import { BezierConfig, SpringConfig } from "@/core/types"
import { solveSpring } from "@/core/math/spring"
import { ROUTES } from "@/lib/routes"
import { PROJECT } from "@/lib/social-links"
import { cn } from "@/lib/utils"

export interface CustomEase {
  id: string
  name: string
  label?: string
  parentPreset: string
  engine: "bezier" | "spring"
  values: string
  bezier?: BezierConfig
  spring?: SpringConfig
  duration: number
  guidance?: string
  targetSettle?: string
  desc?: string
  useCases?: string[]
  variants?: CustomEase[]
}

const INITIAL_CUSTOM_CURVES: CustomEase[] = [
  {
    id: "modal-sheet",
    name: "Modal Sheet",
    label: "Main",
    parentPreset: "Apple Fluid Decel",
    engine: "bezier",
    values: "0.16, 1.00, 0.30, 1.00",
    bezier: { p1: { x: 0.16, y: 1.0 }, p2: { x: 0.3, y: 1.0 } },
    duration: 350,
    guidance:
      "Centered modals demand swift acceleration with cushioned deceleration. Never bounce > 1 time in transactional UI.",
    targetSettle: "250ms – 350ms",
    desc: "Primary modal acceleration with balanced settle",
    useCases: ["Modal Dialogs", "Custom Sheets", "View Transitions"],
    variants: [
      {
        id: "modal-sheet-exit",
        name: "Exit",
        label: "Exit Dismissal",
        parentPreset: "Modal Sheet",
        engine: "bezier",
        values: "0.40, 0.00, 1.00, 1.00",
        bezier: { p1: { x: 0.4, y: 0.0 }, p2: { x: 1.0, y: 1.0 } },
        duration: 220,
        desc: "Quick cushioned dismissal for backdrop drops",
        variants: [
          {
            id: "modal-sheet-exit-standard",
            name: "Standard",
            label: "Standard Exit",
            parentPreset: "Exit",
            engine: "bezier",
            values: "0.40, 0.00, 1.00, 1.00",
            bezier: { p1: { x: 0.4, y: 0.0 }, p2: { x: 1.0, y: 1.0 } },
            duration: 220,
            desc: "220ms balanced backdrop decay",
          },
          {
            id: "modal-sheet-exit-swift",
            name: "Swift",
            label: "Swift Exit",
            parentPreset: "Exit",
            engine: "bezier",
            values: "0.70, 0.00, 1.00, 1.00",
            bezier: { p1: { x: 0.7, y: 0.0 }, p2: { x: 1.0, y: 1.0 } },
            duration: 160,
            desc: "Near-instantaneous dismissal for power users",
          },
        ],
      },
      {
        id: "modal-sheet-expressive",
        name: "Expressive",
        label: "Expressive Overshoot",
        parentPreset: "Modal Sheet",
        engine: "bezier",
        values: "0.12, 1.15, 0.25, 1.00",
        bezier: { p1: { x: 0.12, y: 1.15 }, p2: { x: 0.25, y: 1.0 } },
        duration: 420,
        desc: "Snappy entry with intentional +4% overshoot",
        variants: [
          {
            id: "modal-sheet-expressive-standard",
            name: "Standard",
            label: "Standard +4%",
            parentPreset: "Expressive",
            engine: "bezier",
            values: "0.12, 1.15, 0.25, 1.00",
            bezier: { p1: { x: 0.12, y: 1.15 }, p2: { x: 0.25, y: 1.0 } },
            duration: 420,
            desc: "Balanced intentional overshoot for dialogs",
          },
          {
            id: "modal-sheet-expressive-high",
            name: "High Pop",
            label: "High Pop +8%",
            parentPreset: "Expressive",
            engine: "bezier",
            values: "0.10, 1.25, 0.20, 1.00",
            bezier: { p1: { x: 0.1, y: 1.25 }, p2: { x: 0.2, y: 1.0 } },
            duration: 460,
            desc: "Energetic +8% bounce overshoot for marketing modals",
          },
        ],
      },
      {
        id: "modal-sheet-subdued",
        name: "Subdued",
        label: "Subdued Utility",
        parentPreset: "Modal Sheet",
        engine: "bezier",
        values: "0.25, 1.00, 0.50, 1.00",
        bezier: { p1: { x: 0.25, y: 1.0 }, p2: { x: 0.5, y: 1.0 } },
        duration: 220,
        desc: "Swift compact motion for utility alerts",
      },
    ],
  },
  {
    id: "drawer-physics",
    name: "Drawer Physics",
    label: "Main",
    parentPreset: "Snappy Spring",
    engine: "spring",
    values: "m:1 s:340 d:28",
    spring: { mass: 1, stiffness: 340, damping: 28, velocity: 0 },
    duration: 380,
    guidance:
      "Side sheets and drawers follow finger release velocity. Maintain high damping ratio to prevent distracting oscillations.",
    targetSettle: "300ms – 450ms",
    desc: "Tactile finger-following spring release",
    useCases: ["Navigation Drawers", "Side Panels", "Bottom Sheets"],
    variants: [
      {
        id: "drawer-physics-cushion",
        name: "Cushioned",
        label: "Cushioned Glide",
        parentPreset: "Drawer Physics",
        engine: "spring",
        values: "m:1 s:220 d:22",
        spring: { mass: 1, stiffness: 220, damping: 22, velocity: 0 },
        duration: 440,
        desc: "Zero-ringing glide for calm UI sheets",
      },
      {
        id: "drawer-physics-energetic",
        name: "Energetic",
        label: "Energetic Rebound",
        parentPreset: "Drawer Physics",
        engine: "spring",
        values: "m:1 s:300 d:20",
        spring: { mass: 1, stiffness: 300, damping: 20, velocity: 0 },
        duration: 440,
        desc: "Playful spring with subtle rebound",
      },
    ],
  },
]

export interface KineticAnatomy {
  role: string
  launchVelocity: string
  settleCharacter: string
  feel: string
  choreographyLaw: string
  timingSweetSpot: string
  optimalDuration: number
}

function computeKineticIntel(params: {
  id: string
  name: string
  engine: "bezier" | "spring"
  description?: string
  bezier?: BezierConfig
  spring?: SpringConfig
  custom?: CustomEase
}): KineticAnatomy {
  const { id, engine, description, bezier, spring, custom } = params
  const lowerId = id.toLowerCase()

  // 1. BEZIER ENGINE KINETICS
  if (engine === "bezier" && bezier) {
    const { p1, p2 } = bezier
    const dx1 = Math.max(0.01, p1.x)
    const dy1 = p1.y
    const initialSlope = dy1 / dx1

    // Role classification
    let role = "Transit S-Curve"
    if (p1.y < 0 || p2.y > 1.0 || p1.y > 1.0) {
      role = "Expressive Rebound"
    } else if (
      lowerId.includes("exit") ||
      lowerId.includes("accelerate") ||
      lowerId === "ease-in" ||
      (lowerId.includes("-in") && !lowerId.includes("-in-out"))
    ) {
      role = "Exit Dismissal"
    } else if (
      lowerId.includes("decel") ||
      lowerId.includes("modal") ||
      lowerId.includes("sheet") ||
      lowerId === "ease-out" ||
      (lowerId.includes("-out") && !lowerId.includes("-in-out")) ||
      lowerId.includes("fluid")
    ) {
      role = "Entrance Decel"
    } else if (lowerId.includes("fast") || lowerId.includes("snap")) {
      role = "Tactile Micro-Snap"
    } else if (
      lowerId.includes("cinematic") ||
      lowerId.includes("emphasized")
    ) {
      role = "Dramatic Hero Arc"
    } else if (lowerId.includes("linear") || lowerId.includes("step")) {
      role = "Mechanical Step"
    }

    // Launch impulse analysis
    let launchVelocity = "Smooth progressive ramp-up"
    if (p1.y < 0) {
      launchVelocity = `Anticipatory back-pull (${Math.round(p1.y * 100)}% counter-impulse)`
    } else if (p1.x <= 0.1 && p1.y >= 0.7) {
      launchVelocity = "Instant peak impulse at t=0"
    } else if (initialSlope >= 2.2) {
      launchVelocity = "Swift acceleration from rest"
    } else if (p1.y <= 0.05 && p1.x >= 0.35) {
      launchVelocity = "Suppressed launch delay (Heavy inertia)"
    } else if (initialSlope <= 0.45) {
      launchVelocity = "Gentle progressive inertia build-up"
    }

    // Settle & Deceleration analysis
    let settleCharacter = "Symmetric deceleration into destination"
    if (p2.y > 1.0) {
      const overshoot = Math.round((p2.y - 1) * 100)
      settleCharacter = `Controlled +${overshoot}% overshoot rebound`
    } else if (p1.y > 1.0) {
      const crest = Math.round((p1.y - 1) * 100)
      settleCharacter = `Controlled +${crest}% launch crest deceleration`
    } else if (
      p2.y <= 0.55 &&
      (lowerId.includes("-in") || lowerId.includes("accelerate"))
    ) {
      settleCharacter = "Maintains terminal exit velocity off-screen"
    } else if (p2.x <= 0.25 && p2.y >= 0.95) {
      settleCharacter = "Near-instantaneous magnetic latch"
    } else if (p2.x >= 0.35 && p2.y >= 0.95) {
      settleCharacter = "Asymptotic friction cushion (0% overshoot)"
    }

    // Optimal duration & sweet spot calibration
    let optimalDuration = 320
    let timingSweetSpot = "240ms – 360ms"
    if (lowerId === "ultra-fast") {
      optimalDuration = 180
      timingSweetSpot = "140ms – 220ms"
    } else if (lowerId.includes("power1")) {
      optimalDuration = 240
      timingSweetSpot = "180ms – 280ms"
    } else if (lowerId.includes("power2") || lowerId.includes("decel")) {
      optimalDuration = 300
      timingSweetSpot = "240ms – 350ms"
    } else if (
      lowerId.includes("power3") ||
      lowerId === "material-emphasized"
    ) {
      optimalDuration = 380
      timingSweetSpot = "300ms – 440ms"
    } else if (lowerId.includes("power4") || lowerId.includes("expo")) {
      optimalDuration = 480
      timingSweetSpot = "400ms – 560ms"
    } else if (
      lowerId.includes("cinematic") ||
      lowerId.includes("circ-in-out")
    ) {
      optimalDuration = 650
      timingSweetSpot = "500ms – 800ms"
    } else if (role === "Exit Dismissal") {
      optimalDuration = 200
      timingSweetSpot = "160ms – 240ms"
    } else if (role === "Expressive Rebound") {
      optimalDuration = 400
      timingSweetSpot = "340ms – 460ms"
    }

    if (custom?.duration) optimalDuration = custom.duration
    if (custom?.targetSettle) timingSweetSpot = custom.targetSettle

    return {
      role,
      launchVelocity,
      settleCharacter,
      feel: description || "Calibrated cubic bezier transition",
      choreographyLaw:
        custom?.guidance ||
        description ||
        "Standard interface kinetic transition",
      timingSweetSpot,
      optimalDuration,
    }
  }

  // 2. SPRING ENGINE KINETICS
  if (engine === "spring" && spring) {
    const mass = Math.max(0.1, spring.mass || 1)
    const stiffness = Math.max(1, spring.stiffness)
    const damping = Math.max(0.1, spring.damping)

    // Damping Ratio: ζ = damping / (2 * sqrt(mass * stiffness))
    const zeta = damping / (2 * Math.sqrt(mass * stiffness))
    const omegaN = Math.sqrt(stiffness / mass)

    // Settle time approximation (to ~2% threshold)
    const rawSettleSec =
      (zeta < 0.35 ? 4.8 : 4.0) / Math.max(0.1, zeta * omegaN)
    const computedDuration = Math.round(
      Math.min(950, Math.max(140, rawSettleSec * 1000))
    )

    // Role classification
    let role = "Critically Damped Snap"
    if (zeta < 0.25) {
      role = "High-Resonance Spring"
    } else if (zeta < 0.7) {
      role = "Expressive Pop"
    } else if (zeta < 0.95) {
      role = "Tactile Micro-Snap"
    } else if (zeta <= 1.15) {
      role = "Critically Damped Glide"
    } else {
      role = "Overdamped Viscous Drag"
    }

    // Launch impulse analysis
    let launchVelocity = `Standard mechanical impulse (${stiffness} N/m)`
    if (stiffness >= 600) {
      launchVelocity = `High-tension instant trigger (${stiffness} N/m)`
    } else if (mass >= 2) {
      launchVelocity = `Heavy inertial mass response (${mass}kg)`
    } else if (mass <= 0.5) {
      launchVelocity = `Near-zero mass hair-trigger (${mass}kg)`
    } else if (stiffness <= 100) {
      launchVelocity = `Soft low-tension deflection (${stiffness} N/m)`
    }

    // Settle & Deceleration analysis
    let settleCharacter = "Critically damped (Zero bounce, optimal settling)"
    if (zeta < 0.25) {
      const reboundPct = Math.round((1 - zeta) * 90)
      settleCharacter = `Resonant underdamped oscillation (~${reboundPct}% rebound)`
    } else if (zeta < 0.7) {
      const bouncePct = Math.round((0.75 - zeta) * 60)
      settleCharacter = `Tactile overshoot with cushion (~${bouncePct}% bounce)`
    } else if (zeta < 0.95) {
      settleCharacter = "Sub-critically damped snap (Minimal ringing)"
    } else if (zeta <= 1.15) {
      settleCharacter = "Critically damped (Zero bounce, optimal settling)"
    } else {
      settleCharacter = `Overdamped viscous friction (Damping ratio ζ = ${zeta.toFixed(2)})`
    }

    const optimalDuration = custom?.duration || computedDuration
    const minRange = Math.max(120, Math.round(optimalDuration * 0.8))
    const maxRange = Math.round(optimalDuration * 1.25)
    const timingSweetSpot =
      custom?.targetSettle || `${minRange}ms – ${maxRange}ms`

    return {
      role,
      launchVelocity,
      settleCharacter,
      feel: description || "Physical mass-spring-damper kinetics",
      choreographyLaw:
        custom?.guidance ||
        description ||
        "Direct tactile manipulation spring response",
      timingSweetSpot,
      optimalDuration,
    }
  }

  // Fallback
  return {
    role: "Standard Kinetic",
    launchVelocity: "Instant acceleration",
    settleCharacter: "Asymptotic cushion",
    feel: description || "Interface transition",
    choreographyLaw:
      custom?.guidance ||
      description ||
      "Standard interface kinetic transition",
    timingSweetSpot: "200ms – 320ms",
    optimalDuration: 300,
  }
}

export interface EaseDossier {
  id: string
  name: string
  origin: string
  isCustom: boolean
  engine: "bezier" | "spring"
  values: string
  bezier?: BezierConfig
  spring?: SpringConfig
  duration: number
  description: string
  useCases: string[]
  kinetics: KineticAnatomy
  variants?: CustomEase[]
  parentPreset?: string
}

interface PresetFamily {
  id: string
  label: string
  presetIds: string[]
}

const BEZIER_FAMILIES: PresetFamily[] = [
  {
    id: "entrances-decel",
    label: "Entrances & Decel",
    presetIds: [
      "ease-out",
      "material-decelerate",
      "power1-out",
      "power2-out",
      "power3-out",
      "power4-out",
      "expo-out",
      "circ-out",
    ],
  },
  {
    id: "travel-s-curves",
    label: "Travel & S-Curves",
    presetIds: [
      "ease",
      "ease-in-out",
      "material-standard",
      "cinematic-slow",
      "power1-in-out",
      "power2-in-out",
      "power3-in-out",
      "power4-in-out",
      "expo-in-out",
      "circ-in-out",
    ],
  },
  {
    id: "exits-accel",
    label: "Exits & Accel",
    presetIds: [
      "ease-in",
      "material-accelerate",
      "power1-in",
      "power2-in",
      "power3-in",
      "power4-in",
      "expo-in",
      "circ-in",
    ],
  },
  {
    id: "expressive-overshoot",
    label: "Expressive & Overshoot",
    presetIds: [
      "material-emphasized",
      "ultra-fast",
      "back-out",
      "back-in",
      "back-in-out",
    ],
  },
]

const SPRING_FAMILIES: PresetFamily[] = [
  {
    id: "critically-damped",
    label: "Critically Damped",
    presetIds: [
      "drawer",
      "ios-fluid",
      "react-default",
      "gentle",
      "stiff",
      "heavy",
    ],
  },
  {
    id: "tactile-snap",
    label: "Tactile Micro-Snap",
    presetIds: [
      "button",
      "toast",
      "material-pop",
      "hard-snap",
      "rapid",
      "mechanical-arm",
    ],
  },
  {
    id: "expressive-bouncy",
    label: "Expressive & Bouncy",
    presetIds: [
      "soap-bubble",
      "rubber-band",
      "super-bouncy",
      "trampoline",
      "wobbly",
      "elastic-out",
      "elastic-soft",
      "elastic-hard",
      "glitch",
    ],
  },
  {
    id: "viscous-inertial",
    label: "Viscous & Inertial",
    presetIds: ["underwater", "helium", "slow", "molasses"],
  },
]

const POPULAR_PRESET_IDS = new Set<string>([
  // Bezier popular
  "ease-out",
  "material-emphasized",
  "ease-in-out",
  "power2-out",
  "back-out",
  "ultra-fast",
  "ease",
  "material-standard",
  // Spring popular
  "button",
  "ios-fluid",
  "material-pop",
  "drawer",
  "toast",
  "soap-bubble",
  "trampoline",
  "stiff",
])

type ArchetypeKey = "button"

interface ArchetypeScenario {
  id: ArchetypeKey
  name: string
  role: string
  description: string
}

const ARCHETYPE_SCENARIOS: ArchetypeScenario[] = [
  {
    id: "button",
    name: "Button",
    role: "Tactile Rebound",
    description: "Clean shadcn UI button tactile press & physics rebound",
  },
]

/**
 * High-precision cubic-bezier solver (evaluates y for a given x/t using binary bisection).
 */
function solveCubicBezier(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
  t: number
): number {
  if (t <= 0) return 0
  if (t >= 1) return 1
  let low = 0
  let high = 1
  let tParam = t
  for (let i = 0; i < 10; i++) {
    const currentX =
      3 * (1 - tParam) * (1 - tParam) * tParam * p1x +
      3 * (1 - tParam) * tParam * tParam * p2x +
      tParam * tParam * tParam
    if (Math.abs(currentX - t) < 0.001) break
    if (currentX < t) low = tParam
    else high = tParam
    tParam = (low + high) / 2
  }
  return (
    3 * (1 - tParam) * (1 - tParam) * tParam * p1y +
    3 * (1 - tParam) * tParam * tParam * p2y +
    tParam * tParam * tParam
  )
}

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
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()
  const [activeEngine, setActiveEngine] = React.useState<"bezier" | "spring">(
    "bezier"
  )
  const [activePresetId, setActivePresetId] = React.useState<string>("ease")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [customCurves, setCustomCurves] = React.useState<CustomEase[]>(
    INITIAL_CUSTOM_CURVES
  )
  const [catalogFilter, setCatalogFilter] = React.useState<"all" | "popular">(
    "all"
  )
  type StackLevel =
    | { level: 0 }
    | { level: 1; curveId: string }
    | { level: 2; curveId: string; variantId: string }

  const [navStack, setNavStack] = React.useState<StackLevel>({ level: 0 })
  const [activeScenarioKey, setActiveScenarioKey] =
    React.useState<ArchetypeKey>("button")
  const [compareQueue, setCompareQueue] = React.useState<string[]>([])
  const [exportFramework, setExportFramework] = React.useState<
    "CSS" | "Tailwind" | "Motion" | "SwiftUI"
  >("CSS")
  const [hasCopiedToken, setHasCopiedToken] = React.useState(false)

  // Column 2: Center Stage Runtime States
  const [previewWidth, setPreviewWidth] = React.useState<number | string>(
    "100%"
  )
  const [viewportMode, setViewportMode] =
    React.useState<ViewportMode>("desktop")
  // Human-centered playback: calm at rest by default (zero fatigue)
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const [isTimelineOpen, setIsTimelineOpen] = React.useState<boolean>(false)
  const [isLooping, setIsLooping] = React.useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = React.useState<number>(1)
  const [scrubProgress, setScrubProgress] = React.useState<number>(100)
  const [isScrubbing, setIsScrubbing] = React.useState<boolean>(false)
  const [lifecyclePhase, setLifecyclePhase] = React.useState<"enter" | "exit">(
    "enter"
  )
  const [isReducedMotion, setIsReducedMotion] = React.useState<boolean>(false)
  const [animKey, setAnimKey] = React.useState<number>(0)

  // Interactive Tactile Button States
  const [buttonPressed, setButtonPressed] = React.useState<boolean>(false)

  const isCurrentCurveQueued = compareQueue.includes(activePresetId)

  const toggleCompareQueue = React.useCallback(() => {
    setCompareQueue((prev) => {
      if (prev.includes(activePresetId)) {
        return prev.filter((id) => id !== activePresetId)
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), activePresetId]
      }
      return [...prev, activePresetId]
    })
  }, [activePresetId])

  const triggerSingleAnimation = React.useCallback(() => {
    setScrubProgress(0)
    setAnimKey((k) => k + 1)
    setIsPlaying(true)
  }, [])

  const handleViewportChange = React.useCallback((mode: ViewportMode) => {
    setViewportMode(mode)
    if (mode === "desktop") setPreviewWidth("100%")
    if (mode === "tablet") setPreviewWidth(768)
    if (mode === "mobile") setPreviewWidth(375)
  }, [])

  const resolveEase = React.useCallback(
    (id: string): EaseDossier | undefined => {
      // 1. Check customCurves
      const custom = customCurves.find((c) => c.id === id)
      if (custom) {
        const kinetics = computeKineticIntel({
          id: custom.id,
          name: custom.name,
          engine: custom.engine,
          description: custom.guidance ?? custom.desc,
          bezier: custom.bezier,
          spring: custom.spring,
          custom,
        })
        return {
          id: custom.id,
          name: custom.name,
          origin: `Forked from ${custom.parentPreset}`,
          isCustom: true,
          engine: custom.engine,
          values: custom.values,
          bezier: custom.bezier,
          spring: custom.spring,
          duration: kinetics.optimalDuration,
          description:
            custom.guidance ?? custom.desc ?? "Custom calibrated easing curve",
          useCases: custom.useCases ?? [
            "Modal Dialogs",
            "Custom Sheets",
            "View Transitions",
          ],
          kinetics,
          variants: custom.variants,
          parentPreset: custom.parentPreset,
        }
      }

      // 2. Check BEZIER_PRESETS
      const bp = BEZIER_PRESETS.find((p) => p.id === id)
      if (bp) {
        const bConf = bp.value as BezierConfig
        const kinetics = computeKineticIntel({
          id: bp.id,
          name: bp.label,
          engine: "bezier",
          description: bp.description,
          bezier: bConf,
        })
        const valStr = `${bConf.p1.x.toFixed(2)}, ${bConf.p1.y.toFixed(2)}, ${bConf.p2.x.toFixed(2)}, ${bConf.p2.y.toFixed(2)}`
        let origin = "CSS Standard"
        if (bp.id.startsWith("material")) origin = "Material Design Standard"
        else if (bp.id.startsWith("apple")) origin = "Apple HIG Standard"
        else if (
          bp.id.startsWith("power") ||
          bp.id.startsWith("sine") ||
          bp.id.startsWith("quad") ||
          bp.id.startsWith("cubic") ||
          bp.id.startsWith("quart") ||
          bp.id.startsWith("quint") ||
          bp.id.startsWith("expo") ||
          bp.id.startsWith("circ") ||
          bp.id.startsWith("back")
        )
          origin = "GSAP / Penner Standard"
        else if (bp.id === "ultra-fast" || bp.id === "cinematic-slow")
          origin = "Cinematic Standard"

        return {
          id: bp.id,
          name: bp.label,
          origin,
          isCustom: false,
          engine: "bezier",
          values: valStr,
          bezier: bConf,
          duration: kinetics.optimalDuration,
          description: bp.description,
          useCases: bp.useCases,
          kinetics,
        }
      }

      // 3. Check SPRING_PRESETS
      const sp = SPRING_PRESETS.find((p) => p.id === id)
      if (sp) {
        const sConf = sp.value as SpringConfig
        const kinetics = computeKineticIntel({
          id: sp.id,
          name: sp.label,
          engine: "spring",
          description: sp.description,
          spring: sConf,
        })
        const valStr = `m:${sConf.mass} s:${sConf.stiffness} d:${sConf.damping}`
        let origin = "Satisium Physics Standard"
        if (sp.id.includes("apple") || sp.id === "ios-fluid")
          origin = "Apple HIG Fluid Spring"
        else if (sp.id.includes("material")) origin = "Material Design Spring"
        else if (sp.id.includes("react")) origin = "React Spring Standard"

        return {
          id: sp.id,
          name: sp.label,
          origin,
          isCustom: false,
          engine: "spring",
          values: valStr,
          spring: sConf,
          duration: kinetics.optimalDuration,
          description: sp.description,
          useCases: sp.useCases,
          kinetics,
        }
      }

      return undefined
    },
    [customCurves]
  )

  const activeDossier =
    navStack.level === 1 ? resolveEase(navStack.curveId) : undefined

  const currentCurve =
    navStack.level !== 0
      ? customCurves.find((c) => c.id === navStack.curveId)
      : undefined

  const currentVariant =
    navStack.level === 2 && currentCurve?.variants
      ? currentCurve.variants.find((v) => v.id === navStack.variantId)
      : undefined

  const handleForkPreset = (presetId: string) => {
    const dossier = resolveEase(presetId)
    if (!dossier) return
    const newCustomId = `custom-${dossier.id}-${Date.now().toString(36).slice(-4)}`
    const newCustom: CustomEase = {
      id: newCustomId,
      name: `${dossier.name} (Custom)`,
      label: "Main",
      parentPreset: dossier.name,
      engine: dossier.engine,
      values: dossier.values,
      bezier: dossier.bezier ? { ...dossier.bezier } : undefined,
      spring: dossier.spring ? { ...dossier.spring } : undefined,
      duration: dossier.duration,
      desc: `Custom branch of ${dossier.name}`,
      guidance: dossier.kinetics.choreographyLaw,
      targetSettle: dossier.kinetics.timingSweetSpot,
      variants: [],
    }
    setCustomCurves((prev) => [newCustom, ...prev])
    setActivePresetId(newCustom.id)
    setActiveEngine(newCustom.engine)
    setNavStack({ level: 1, curveId: newCustom.id })
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement
      const isInput =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl instanceof HTMLElement && activeEl.isContentEditable)

      if (e.key === "Escape") {
        setNavStack((prev) => {
          if (prev.level === 2) return { level: 1, curveId: prev.curveId }
          if (prev.level === 1) return { level: 0 }
          return prev
        })
      }

      if (isInput) return

      if (e.key === " ") {
        e.preventDefault()
        setIsPlaying((p) => !p)
      } else if (e.key === "r" || e.key === "R") {
        setAnimKey((k) => k + 1)
        setScrubProgress(0)
        setIsPlaying(true)
      } else if (e.key === "2") {
        router.push(ROUTES.stage2)
      } else if (e.key === "t" || e.key === "T") {
        setIsTimelineOpen((prev) => !prev)
      } else if (e.key === "c" || e.key === "C") {
        toggleCompareQueue()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, toggleCompareQueue])

  const handleCustomCurveClick = (curve: CustomEase) => {
    setActivePresetId(curve.id)
    setActiveEngine(curve.engine)
    triggerSingleAnimation()
  }

  const handleAddVariant = () => {
    if (!currentCurve) return
    const newIndex = (currentCurve.variants?.length ?? 0) + 1
    const newVariant: CustomEase = {
      id: `${currentCurve.id}-v${newIndex}-${Date.now().toString(36).slice(-4)}`,
      name: `Variant ${newIndex}`,
      label: `Variant ${newIndex}`,
      parentPreset: currentCurve.name,
      engine: currentCurve.engine,
      values: currentCurve.values,
      bezier: currentCurve.bezier ? { ...currentCurve.bezier } : undefined,
      spring: currentCurve.spring ? { ...currentCurve.spring } : undefined,
      duration: currentCurve.duration,
      desc: `Branch ${newIndex} of ${currentCurve.name}`,
    }
    setCustomCurves((prev) =>
      prev.map((c) =>
        c.id === currentCurve.id
          ? { ...c, variants: [...(c.variants ?? []), newVariant] }
          : c
      )
    )
    setActivePresetId(newVariant.id)
    setActiveEngine(newVariant.engine)
  }

  const handleAddFlavor = () => {
    if (!currentCurve || !currentVariant) return
    const newIndex = (currentVariant.variants?.length ?? 0) + 1
    const newFlavor: CustomEase = {
      id: `${currentVariant.id}-f${newIndex}-${Date.now().toString(36).slice(-4)}`,
      name: `Flavor ${newIndex}`,
      label: `Flavor ${newIndex}`,
      parentPreset: currentVariant.name,
      engine: currentVariant.engine,
      values: currentVariant.values,
      bezier: currentVariant.bezier ? { ...currentVariant.bezier } : undefined,
      spring: currentVariant.spring ? { ...currentVariant.spring } : undefined,
      duration: currentVariant.duration,
      desc: `Calibrated flavor ${newIndex} of ${currentVariant.name}`,
    }
    setCustomCurves((prev) =>
      prev.map((c) =>
        c.id === currentCurve.id
          ? {
              ...c,
              variants: (c.variants ?? []).map((v) =>
                v.id === currentVariant.id
                  ? { ...v, variants: [...(v.variants ?? []), newFlavor] }
                  : v
              ),
            }
          : c
      )
    )
    setActivePresetId(newFlavor.id)
    setActiveEngine(newFlavor.engine)
  }

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [isScrolledTop, setIsScrolledTop] = React.useState(false)
  const [isScrolledBottom, setIsScrolledBottom] = React.useState(false)

  const checkScroll = React.useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setIsScrolledTop(scrollTop > 0)
    setIsScrolledBottom(Math.ceil(scrollTop + clientHeight) < scrollHeight - 1)
  }, [])

  React.useEffect(() => {
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const groupedSystemPresets = React.useMemo(() => {
    const list = activeEngine === "bezier" ? BEZIER_PRESETS : SPRING_PRESETS
    const families =
      activeEngine === "bezier" ? BEZIER_FAMILIES : SPRING_FAMILIES
    const query = searchQuery.trim().toLowerCase()

    const filtered = list.filter((p) => {
      if (catalogFilter === "popular" && !POPULAR_PRESET_IDS.has(p.id)) {
        return false
      }
      if (!query) return true
      const matchName = p.label.toLowerCase().includes(query)
      const matchDesc = p.description.toLowerCase().includes(query)
      const matchUse = p.useCases.some((u) => u.toLowerCase().includes(query))
      return matchName || matchDesc || matchUse
    })

    const filteredMap = new Map(filtered.map((p) => [p.id, p]))

    const groups = families
      .map((f) => ({
        id: f.id,
        label: f.label,
        presets: f.presetIds
          .map((id) => filteredMap.get(id))
          .filter((p): p is (typeof list)[number] => p !== undefined),
      }))
      .filter((g) => g.presets.length > 0)

    const assignedIds = new Set(families.flatMap((f) => f.presetIds))
    const unassigned = filtered.filter((p) => !assignedIds.has(p.id))
    if (unassigned.length > 0) {
      groups.push({
        id: "other",
        label: "Additional Curves",
        presets: unassigned,
      })
    }

    const totalCount = groups.reduce((acc, g) => acc + g.presets.length, 0)

    return { groups, totalCount }
  }, [activeEngine, searchQuery, catalogFilter])

  const getActivePresetMeta = () => {
    // Check if active curve is in customCurves hierarchy
    for (const c of customCurves) {
      if (activePresetId === c.id) {
        return {
          name: c.name,
          subtitle: c.desc ?? `Custom · Forked from ${c.parentPreset}`,
          engine: c.engine,
          values: c.values,
          bezier: c.bezier,
          spring: c.spring,
          duration: c.duration,
        }
      }
      if (c.variants) {
        for (const v of c.variants) {
          if (activePresetId === v.id) {
            return {
              name: `${c.name} · ${v.name}`,
              subtitle: v.desc ?? `Variant · Forked from ${c.name}`,
              engine: v.engine,
              values: v.values,
              bezier: v.bezier,
              spring: v.spring,
              duration: v.duration,
            }
          }
          if (v.variants) {
            for (const sv of v.variants) {
              if (activePresetId === sv.id) {
                return {
                  name: `${c.name} · ${v.name} · ${sv.name}`,
                  subtitle: sv.desc ?? `Flavor · Forked from ${v.name}`,
                  engine: sv.engine,
                  values: sv.values,
                  bezier: sv.bezier,
                  spring: sv.spring,
                  duration: sv.duration,
                }
              }
            }
          }
        }
      }
    }
    // Otherwise find in system presets
    const allPresets =
      activeEngine === "bezier" ? BEZIER_PRESETS : SPRING_PRESETS
    const found =
      allPresets.find((p) => p.id === activePresetId) ?? allPresets[0]
    const bConf =
      activeEngine === "bezier" ? (found.value as BezierConfig) : undefined
    const sConf =
      activeEngine === "spring" ? (found.value as SpringConfig) : undefined
    const valuesStr =
      activeEngine === "bezier" && bConf
        ? `${bConf.p1.x.toFixed(2)}, ${bConf.p1.y.toFixed(2)}, ${bConf.p2.x.toFixed(2)}, ${bConf.p2.y.toFixed(2)}`
        : sConf
          ? `m:${sConf.mass} s:${sConf.stiffness} d:${sConf.damping}`
          : ""
    return {
      name: found.label,
      subtitle: found.description,
      engine: activeEngine,
      values: valuesStr,
      bezier: bConf,
      spring: sConf,
      duration: 320,
    }
  }

  const activePresetMeta = getActivePresetMeta()

  const getEasedValue = React.useCallback(
    (
      progressPct: number,
      meta: {
        engine: "bezier" | "spring"
        bezier?: BezierConfig
        spring?: SpringConfig
      }
    ) => {
      const t = Math.max(0, Math.min(1, progressPct / 100))
      if (isReducedMotion) {
        return t > 0.05 ? 1 : t * 20
      }
      if (meta.engine === "bezier" && meta.bezier) {
        const { p1, p2 } = meta.bezier
        return solveCubicBezier(p1.x, p1.y, p2.x, p2.y, t)
      }
      if (meta.engine === "spring" && meta.spring) {
        const springRes = solveSpring(
          meta.spring.mass,
          meta.spring.stiffness,
          meta.spring.damping
        )
        const count = springRes.points.length
        if (count === 0) return t
        const idx = Math.min(count - 1, Math.floor(t * (count - 1)))
        return springRes.points[idx] ?? t
      }
      return t
    },
    [isReducedMotion]
  )

  const currentEasedA = React.useMemo(() => {
    const raw = getEasedValue(scrubProgress, activePresetMeta)
    return lifecyclePhase === "enter" ? raw : 1 - raw
  }, [getEasedValue, scrubProgress, activePresetMeta, lifecyclePhase])

  React.useEffect(() => {
    if (!isPlaying || isScrubbing) return

    let animationFrameId: number
    let startTime = performance.now()
    const totalDuration = activePresetMeta.duration / playbackSpeed
    const pauseDuration = 600

    const tick = (now: number) => {
      const elapsed = now - startTime
      if (elapsed < totalDuration) {
        setScrubProgress((elapsed / totalDuration) * 100)
        animationFrameId = requestAnimationFrame(tick)
      } else if (isLooping) {
        if (elapsed < totalDuration + pauseDuration) {
          setScrubProgress(100)
          animationFrameId = requestAnimationFrame(tick)
        } else {
          startTime = performance.now()
          setAnimKey((k) => k + 1)
          setScrubProgress(0)
          animationFrameId = requestAnimationFrame(tick)
        }
      } else {
        setScrubProgress(100)
        setIsPlaying(false)
      }
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrameId)
  }, [
    isPlaying,
    isScrubbing,
    isLooping,
    playbackSpeed,
    activePresetMeta.duration,
  ])

  const getExportSnippet = React.useCallback(() => {
    const dur = activePresetMeta.duration
    const val = activePresetMeta.values
    if (exportFramework === "CSS") {
      return activePresetMeta.engine === "bezier"
        ? `transition: all ${dur}ms cubic-bezier(${val});`
        : `/* Spring: ${val} (${dur}ms) */`
    }
    if (exportFramework === "Tailwind") {
      return activePresetMeta.engine === "bezier"
        ? `transition-all duration-[${dur}ms] ease-[cubic-bezier(${val})]`
        : `transition-all duration-[${dur}ms]`
    }
    if (exportFramework === "Motion") {
      return `<motion.div\n  transition={{\n    duration: ${(dur / 1000).toFixed(2)},\n    ease: [${val}],\n  }}\n/>`
    }
    if (exportFramework === "SwiftUI") {
      return `.animation(\n  .timingCurve(${val},\n    duration: ${(dur / 1000).toFixed(2)}\n  ),\n  value: trigger\n)`
    }
    return ""
  }, [
    activePresetMeta.duration,
    activePresetMeta.values,
    activePresetMeta.engine,
    exportFramework,
  ])

  const handleCopyToken = React.useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(getExportSnippet())
      setHasCopiedToken(true)
      setTimeout(() => setHasCopiedToken(false), 2000)
    }
  }, [getExportSnippet])

  const renderAuditionArchetype = React.useCallback(
    (_scenarioKey: ArchetypeKey, eased: number) => {
      const pressScale = buttonPressed
        ? 0.94
        : isReducedMotion
          ? 1
          : 0.94 + Math.max(-0.15, Math.min(0.2, eased * 0.06))

      const pressTranslateY = buttonPressed
        ? 2
        : isReducedMotion
          ? 0
          : (1 - Math.min(1, Math.max(0, eased))) * 2

      return (
        <div className="flex h-full w-full items-center justify-center p-6 select-none">
          <Button
            size="default"
            onPointerDown={() => setButtonPressed(true)}
            onPointerUp={() => {
              setButtonPressed(false)
              triggerSingleAnimation()
            }}
            onClick={triggerSingleAnimation}
            style={{
              transform: `translateY(${pressTranslateY}px) scale(${pressScale})`,
            }}
            className="transition-transform duration-75 select-none"
          >
            Button
          </Button>
        </div>
      )
    },
    [isReducedMotion, buttonPressed, triggerSingleAnimation]
  )

  const renderActivePlaygroundComponent = React.useCallback(
    (scenarioKey: ArchetypeKey) => {
      return renderAuditionArchetype(scenarioKey, currentEasedA)
    },
    [currentEasedA, renderAuditionArchetype]
  )

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
                <span className="font-sans text-[11px] font-normal text-muted-foreground">
                  v1.0
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
          <div className="mt-1 flex items-center gap-1.5">
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

        {/* BLOCK 2 CHASSIS BAY: PHYSICAL SLIDING BLOCK TRACK (FILLS 100% REMAINING HEIGHT) */}
        <div className="relative min-h-0 w-full flex-1 overflow-hidden">
          {/* LEVEL 0: ROOT CATALOG BLOCK (THE PHYSICAL MONOLITHIC SLAB) */}
          <section
            aria-label="Block 02: Preset Catalog"
            className={cn(
              "absolute inset-0 flex flex-col rounded-[20px] bg-background p-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none",
              navStack.level === 0
                ? "pointer-events-auto translate-x-0"
                : "pointer-events-none -translate-x-[calc(100%+8px)]"
            )}
          >
            {/* 1. APEX: CUSTOM CURVES */}
            {customCurves.length > 0 && (
              <div className="mb-1 flex shrink-0 flex-col gap-1.5 pb-3.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="font-heading text-xs font-semibold text-foreground">
                    Custom curves
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {customCurves.map((curve) => {
                    const isSelected =
                      activePresetId === curve.id ||
                      Boolean(
                        curve.variants?.some(
                          (v) =>
                            v.id === activePresetId ||
                            v.variants?.some((sv) => sv.id === activePresetId)
                        )
                      )
                    const variantCount = curve.variants?.length ?? 0

                    return (
                      <div
                        key={curve.id}
                        className="group relative flex w-full flex-col"
                      >
                        <button
                          type="button"
                          onClick={() => handleCustomCurveClick(curve)}
                          onDoubleClick={() =>
                            setNavStack({ level: 1, curveId: curve.id })
                          }
                          title={
                            variantCount > 0
                              ? `${curve.name} · Click to audition · Double-click to expand variants`
                              : `${curve.name} · Double-click to expand`
                          }
                          className={cn(
                            "relative flex w-full cursor-pointer flex-col items-center rounded-[10px] p-0.5 transition-all",
                            isSelected
                              ? "bg-foreground text-background"
                              : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          {/* Inner Mini Graph Box (Sleek Screen with Breathing Room) */}
                          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[8px] bg-background p-1">
                            {/* Top-Left Variant Badge */}
                            {variantCount > 0 && (
                              <span className="pointer-events-none absolute top-1 left-1.5 font-sans text-[9px] font-semibold tracking-tight text-muted-foreground">
                                +{variantCount}
                              </span>
                            )}

                            <MiniGraph
                              mode={curve.engine}
                              bezier={curve.bezier}
                              spring={curve.spring}
                              className={cn(
                                "h-full w-full stroke-2 transition-colors",
                                isSelected
                                  ? "stroke-foreground"
                                  : "stroke-muted-foreground group-hover:stroke-foreground"
                              )}
                            />
                          </div>

                          {/* Grounded Name Strip in Outer Box */}
                          <div className="flex h-4.5 w-full items-center justify-center px-0.5">
                            <span className="truncate font-sans text-[10px] leading-none font-medium tracking-tight">
                              {curve.name}
                            </span>
                          </div>
                        </button>

                        {/* Quick Inspect Button on Hover (Top-Right of Inner Box) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setNavStack({ level: 1, curveId: curve.id })
                          }}
                          title="Open Ease Studio"
                          className="absolute top-1.5 right-1.5 z-10 flex size-4 cursor-pointer items-center justify-center rounded-[4px] bg-background text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                        >
                          <HugeiconsIcon
                            icon={ArrowUpRight01Icon}
                            className="size-2.5"
                          />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 2. LIBRARY QUERY CONTROLS (ENGINE SWITCHER + SEARCH + CATEGORY FILTER) */}
            <div className="flex shrink-0 flex-col gap-1.5 pt-0.5">
              {/* Engine Switcher */}
              <div className="flex h-7 w-full shrink-0 items-center rounded-[10px] bg-muted p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveEngine("bezier")
                    setActivePresetId("ease")
                  }}
                  className={cn(
                    "h-full flex-1 cursor-pointer rounded-[8px] text-center font-heading text-[11px] font-medium transition-colors",
                    activeEngine === "bezier"
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Bezier ({BEZIER_PRESETS.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveEngine("spring")
                    setActivePresetId("spring-standard")
                  }}
                  className={cn(
                    "h-full flex-1 cursor-pointer rounded-[8px] text-center font-heading text-[11px] font-medium transition-colors",
                    activeEngine === "spring"
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Spring ({SPRING_PRESETS.length})
                </button>
              </div>

              {/* Flush Search Bar */}
              <div className="relative flex h-7 w-full shrink-0 items-center">
                <HugeiconsIcon
                  icon={Search01Icon}
                  className="pointer-events-none absolute left-2 size-3.5 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search curves..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-7 w-full rounded-[8px] bg-muted pr-7 pl-7 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                  </button>
                )}
              </div>
            </div>

            {/* 3. LIBRARY HEADER + FILTER DOCK */}
            <div className="mt-2.5 flex h-5 shrink-0 items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xs font-semibold text-foreground">
                  Library
                </span>
                <span className="font-sans text-[11px] font-normal text-muted-foreground">
                  ({groupedSystemPresets.totalCount})
                </span>
              </div>

              {/* All vs Popular Filter Pill */}
              <div className="flex h-5 items-center rounded-[6px] bg-muted p-0.5 font-sans text-[10px]">
                <button
                  type="button"
                  onClick={() => setCatalogFilter("all")}
                  className={cn(
                    "cursor-pointer rounded-[4px] px-1.5 py-0.5 transition-colors",
                    catalogFilter === "all"
                      ? "bg-background font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setCatalogFilter("popular")}
                  className={cn(
                    "cursor-pointer rounded-[4px] px-1.5 py-0.5 transition-colors",
                    catalogFilter === "popular"
                      ? "bg-background font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  ★ Popular
                </button>
              </div>
            </div>

            {/* 4. SCROLLABLE LIBRARY GRID WITH PROGRESSIVE BLUR VIGNETTES */}
            <div className="relative mt-1.5 flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Top Progressive Blur Vignette */}
              <div
                aria-hidden="true"
                className={cn(
                  "progressive-blur-top pointer-events-none absolute top-0 right-0 left-0 z-20 h-6 transition-opacity duration-300 select-none",
                  isScrolledTop ? "opacity-100" : "opacity-0"
                )}
              />

              {/* Scrollable Container (Zero Scrollbar) */}
              <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="no-scrollbar min-h-0 flex-1 overflow-y-auto pt-0.5 pb-2"
              >
                {groupedSystemPresets.totalCount === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="mb-2 flex size-9 items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
                      <HugeiconsIcon icon={Search01Icon} className="size-4" />
                    </div>
                    <span className="font-heading text-xs font-semibold text-foreground">
                      No curves found
                    </span>
                    <p className="mt-0.5 font-sans text-[11px] text-muted-foreground">
                      {searchQuery
                        ? `No matches for "${searchQuery}"`
                        : "No curves in this view"}
                    </p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="mt-2.5 cursor-pointer rounded-[6px] bg-secondary px-2.5 py-1 font-sans text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {groupedSystemPresets.groups.map((group) => (
                      <div key={group.id} className="flex flex-col gap-1.5">
                        {/* Family Section Subhead */}
                        <div className="flex items-center justify-between px-0.5 pt-0.5">
                          <span className="font-heading text-[11px] font-semibold text-muted-foreground">
                            {group.label}
                          </span>
                          <span className="font-sans text-[10px] text-muted-foreground">
                            {group.presets.length}
                          </span>
                        </div>

                        {/* 3-Column Squircle Grid */}
                        <div className="grid grid-cols-3 gap-1.5">
                          {group.presets.map((item) => {
                            const isActive = activePresetId === item.id
                            return (
                              <div
                                key={item.id}
                                className="group relative flex w-full flex-col"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActivePresetId(item.id)
                                    setActiveEngine(activeEngine)
                                    triggerSingleAnimation()
                                  }}
                                  onDoubleClick={() =>
                                    setNavStack({ level: 1, curveId: item.id })
                                  }
                                  title={`${item.label} · Click to audition · Double-click to open slide`}
                                  className={cn(
                                    "relative flex w-full cursor-pointer flex-col items-center rounded-[10px] p-0.5 transition-all",
                                    isActive
                                      ? "bg-foreground text-background"
                                      : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                                  )}
                                >
                                  {/* Inner Mini Graph Box (Screen) */}
                                  <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[8px] bg-background p-1">
                                    <MiniGraph
                                      mode={activeEngine}
                                      bezier={
                                        activeEngine === "bezier"
                                          ? (item.value as BezierConfig)
                                          : undefined
                                      }
                                      spring={
                                        activeEngine === "spring"
                                          ? (item.value as SpringConfig)
                                          : undefined
                                      }
                                      className={cn(
                                        "h-full w-full stroke-2 transition-colors",
                                        isActive
                                          ? "stroke-foreground"
                                          : "stroke-muted-foreground group-hover:stroke-foreground"
                                      )}
                                    />
                                  </div>

                                  {/* Grounded Name Strip in Outer Box */}
                                  <div className="flex h-4.5 w-full items-center justify-center px-0.5">
                                    <span className="truncate font-sans text-[10px] leading-none font-medium tracking-tight">
                                      {item.label}
                                    </span>
                                  </div>
                                </button>

                                {/* Quick Inspect Button on Hover (Top-Right of Inner Box) */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setNavStack({ level: 1, curveId: item.id })
                                  }}
                                  title={`Open ${item.label} slide`}
                                  className="absolute top-1.5 right-1.5 z-10 flex size-4 cursor-pointer items-center justify-center rounded-[4px] bg-background text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                                >
                                  <HugeiconsIcon
                                    icon={ArrowUpRight01Icon}
                                    className="size-2.5"
                                  />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Progressive Blur Vignette */}
              <div
                aria-hidden="true"
                className={cn(
                  "progressive-blur-bottom pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-8 transition-opacity duration-300 select-none",
                  isScrolledBottom ? "opacity-100" : "opacity-0"
                )}
              />
            </div>
          </section>

          {/* LEVEL 1: EASE STUDIO BLOCK (THE PHYSICAL MONOLITHIC SLAB) */}
          <section
            aria-label="Block 02: Ease Studio"
            className={cn(
              "absolute inset-0 flex flex-col rounded-[20px] bg-background p-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none",
              navStack.level === 1
                ? "pointer-events-auto translate-x-0"
                : navStack.level === 0
                  ? "pointer-events-none translate-x-[calc(100%+8px)]"
                  : "pointer-events-none -translate-x-[calc(100%+8px)]"
            )}
          >
            {activeDossier && (
              <div className="flex h-full flex-col gap-3">
                {/* TOP: STREAMLINED ESSENTIAL KINETIC DOSSIER */}
                <div className="flex shrink-0 flex-col gap-2.5">
                  {/* Top Navigation Bar */}
                  <div className="flex shrink-0 items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setNavStack({ level: 0 })}
                      className="group flex cursor-pointer items-center gap-1.5 rounded-[8px] bg-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      <HugeiconsIcon
                        icon={ArrowLeft01Icon}
                        className="size-3.5 transition-transform group-hover:-translate-x-0.5"
                      />
                      <span className="font-heading">Library</span>
                    </button>
                    <span className="font-sans text-[11px] font-medium text-muted-foreground">
                      {activeDossier.duration}ms
                    </span>
                  </div>

                  {/* Title & Origin Subtitle */}
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                      {activeDossier.name}
                    </h3>
                    <p className="truncate font-sans text-[11px] text-muted-foreground">
                      {activeDossier.kinetics.role} · {activeDossier.origin}
                    </p>
                  </div>

                  {/* The Single Definitive Kinetic Law (Hero Statement) */}
                  <p className="font-sans text-xs leading-relaxed text-foreground">
                    &ldquo;
                    {activeDossier.description ||
                      activeDossier.kinetics.choreographyLaw}
                    &rdquo;
                  </p>

                  {/* Telemetry Card */}
                  <div className="flex flex-col gap-2 rounded-[12px] bg-muted p-3">
                    {/* Row 1: Full-width Coordinates in Monospace */}
                    <div className="font-mono text-xs font-semibold tracking-tight text-foreground">
                      {activeDossier.values}
                    </div>

                    {/* Row 2: Timing Sweet Spot */}
                    <div className="flex items-center justify-between font-sans text-xs">
                      <span className="text-muted-foreground">Sweet spot</span>
                      <span className="font-medium text-foreground">
                        {activeDossier.kinetics.timingSweetSpot}
                      </span>
                    </div>

                    {/* Row 3: Recommended UI Habitats (Clean Natural Wrap, No Truncation) */}
                    {activeDossier.useCases &&
                      activeDossier.useCases.length > 0 && (
                        <div className="font-sans text-[11px] leading-relaxed text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Best for:
                          </span>{" "}
                          {activeDossier.useCases.join(", ")}
                        </div>
                      )}
                  </div>
                </div>

                {/* BOTTOM: TACTILE SQUIRCLE VARIANTS OR KINETIC PROFILE (NO DUMB GAP) */}
                {activeDossier.isCustom ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex shrink-0 items-center justify-between px-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading text-xs font-semibold text-foreground">
                          Variants
                        </span>
                        <span className="rounded-[6px] bg-secondary px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground">
                          {activeDossier.variants?.length ?? 0}
                        </span>
                      </div>
                      <span className="font-sans text-[10px] text-muted-foreground">
                        2x: open slide
                      </span>
                    </div>

                    {/* Clean 1:1 Squircle 2-Column Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {(activeDossier.variants ?? []).map((v) => {
                        const isSelected = activePresetId === v.id
                        const subVariantCount = v.variants?.length ?? 0

                        return (
                          <div
                            key={v.id}
                            className="group relative flex w-full flex-col"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setActivePresetId(v.id)
                                setActiveEngine(v.engine)
                              }}
                              onDoubleClick={() => {
                                setNavStack({
                                  level: 2,
                                  curveId: activeDossier.id,
                                  variantId: v.id,
                                })
                              }}
                              title={`${v.name} · Click to audition · Double-click to open slide`}
                              className={cn(
                                "group relative flex w-full cursor-pointer flex-col items-center rounded-[12px] p-1 transition-all",
                                isSelected
                                  ? "bg-foreground text-background"
                                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                              )}
                            >
                              {/* Inner Mini Graph Box (Clean 1:1 Squircle Screen) */}
                              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[9px] bg-background p-2">
                                {subVariantCount > 0 && (
                                  <span className="pointer-events-none absolute top-1.5 left-2 font-sans text-[9px] font-semibold tracking-tight text-muted-foreground">
                                    +{subVariantCount}
                                  </span>
                                )}

                                <MiniGraph
                                  mode={v.engine}
                                  bezier={v.bezier}
                                  spring={v.spring}
                                  className={cn(
                                    "h-full w-full stroke-2 transition-colors",
                                    isSelected
                                      ? "stroke-foreground"
                                      : "stroke-muted-foreground group-hover:stroke-foreground"
                                  )}
                                />
                              </div>

                              {/* Grounded Name Strip Snug Underneath */}
                              <div className="flex h-5 w-full items-center justify-center px-1">
                                <span className="truncate font-sans text-[11px] leading-none font-medium tracking-tight">
                                  {v.name}
                                </span>
                              </div>
                            </button>

                            {/* Quick open button on hover (Top-Right of Inner Box) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setNavStack({
                                  level: 2,
                                  curveId: activeDossier.id,
                                  variantId: v.id,
                                })
                              }}
                              title={`Open ${v.name} slide`}
                              className="absolute top-2 right-2 z-10 flex size-4.5 cursor-pointer items-center justify-center rounded-[5px] bg-background text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                            >
                              <HugeiconsIcon
                                icon={ArrowUpRight01Icon}
                                className="size-2.5"
                              />
                            </button>
                          </div>
                        )
                      })}

                      {/* Action Tile: + Add Variant (Clean 1:1 Squircle) */}
                      <button
                        type="button"
                        onClick={handleAddVariant}
                        title="Add variant"
                        className="group flex w-full cursor-pointer flex-col items-center rounded-[12px] bg-muted p-1 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                      >
                        <div className="relative flex aspect-square w-full items-center justify-center rounded-[9px] bg-background p-2">
                          <HugeiconsIcon
                            icon={PlusSignIcon}
                            className="size-5 text-muted-foreground group-hover:text-foreground"
                          />
                        </div>
                        <div className="flex h-5 w-full items-center justify-center px-1">
                          <span className="truncate font-sans text-[11px] leading-none font-medium tracking-tight">
                            + Add Variant
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col gap-2.5">
                    {/* Unified Physics Profile Card */}
                    <div className="flex flex-col gap-2.5 rounded-[12px] bg-muted p-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-sans text-[11px] font-medium text-muted-foreground">
                          Launch impulse
                        </span>
                        <span className="font-sans text-xs text-foreground">
                          {activeDossier.kinetics.launchVelocity}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-sans text-[11px] font-medium text-muted-foreground">
                          Settle deceleration
                        </span>
                        <span className="font-sans text-xs text-foreground">
                          {activeDossier.kinetics.settleCharacter}
                        </span>
                      </div>
                    </div>

                    {/* Grounded Fork Button (Pinned to Bottom of Slide) */}
                    <button
                      type="button"
                      onClick={() => handleForkPreset(activeDossier.id)}
                      className="mt-auto flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-foreground px-3 font-heading text-xs font-semibold text-background transition-transform active:scale-95"
                    >
                      <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
                      <span>Fork to Custom Preset</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* LEVEL 2: VARIANT TUNING BLOCK (THE PHYSICAL MONOLITHIC SLAB) */}
          <section
            aria-label="Block 02: Variant Tuning"
            className={cn(
              "absolute inset-0 flex flex-col rounded-[20px] bg-background p-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none",
              navStack.level === 2
                ? "pointer-events-auto translate-x-0"
                : "pointer-events-none translate-x-[calc(100%+8px)]"
            )}
          >
            {currentCurve && currentVariant && (
              <div className="flex h-full flex-col gap-3">
                {/* TOP: MINIMALIST ESSENTIAL VARIANT DOSSIER */}
                <div className="flex shrink-0 flex-col gap-2.5">
                  {/* Top Navigation */}
                  <div className="flex shrink-0 items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setNavStack({ level: 1, curveId: currentCurve.id })
                      }
                      className="group flex cursor-pointer items-center gap-1.5 rounded-[8px] bg-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      <HugeiconsIcon
                        icon={ArrowLeft01Icon}
                        className="size-3.5 transition-transform group-hover:-translate-x-0.5"
                      />
                      <span className="font-heading">{currentCurve.name}</span>
                    </button>
                    <span className="font-sans text-[11px] font-medium text-muted-foreground">
                      {currentVariant.duration}ms
                    </span>
                  </div>

                  {/* Title & Origin Pedigree */}
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                      {currentVariant.name}
                    </h3>
                    <p className="truncate font-sans text-[11px] text-muted-foreground">
                      Branch of {currentCurve.name} · Kinetic Variant
                    </p>
                  </div>

                  {/* Variant Description */}
                  {currentVariant.desc && (
                    <p className="font-sans text-xs leading-relaxed text-foreground">
                      &ldquo;{currentVariant.desc}&rdquo;
                    </p>
                  )}

                  {/* Formula Specification */}
                  <div className="flex h-7 w-full items-center rounded-[8px] bg-muted px-2.5">
                    <span className="font-mono text-xs font-semibold tracking-tight text-foreground">
                      {currentVariant.values}
                    </span>
                  </div>
                </div>

                {/* BOTTOM: COMPACT, TACTILE FLAVORS SQUIRCLE GRID */}
                <div className="flex flex-col gap-2">
                  <div className="flex shrink-0 items-center justify-between px-0.5">
                    <span className="font-heading text-xs font-semibold text-foreground">
                      Flavors
                    </span>
                    <span className="rounded-[6px] bg-secondary px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground">
                      {currentVariant.variants?.length ?? 0}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(currentVariant.variants ?? []).map((sv) => {
                      const isSelected = activePresetId === sv.id
                      return (
                        <div
                          key={sv.id}
                          className="group relative flex w-full flex-col"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              // CLICK ONLY AUDITIONS IT (DOES NOT MUTATE CURRENT VARIANT DOSSIER)
                              setActivePresetId(sv.id)
                              setActiveEngine(sv.engine)
                            }}
                            title={`${sv.name} · Click to audition`}
                            className={cn(
                              "group relative flex w-full cursor-pointer flex-col items-center rounded-[12px] p-1 transition-all",
                              isSelected
                                ? "bg-foreground text-background"
                                : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[9px] bg-background p-2">
                              <MiniGraph
                                mode={sv.engine}
                                bezier={sv.bezier}
                                spring={sv.spring}
                                className={cn(
                                  "h-full w-full stroke-2 transition-colors",
                                  isSelected
                                    ? "stroke-foreground"
                                    : "stroke-muted-foreground group-hover:stroke-foreground"
                                )}
                              />
                            </div>
                            <div className="flex h-5 w-full items-center justify-center px-1">
                              <span className="truncate font-sans text-[11px] leading-none font-medium tracking-tight">
                                {sv.name}
                              </span>
                            </div>
                          </button>
                        </div>
                      )
                    })}

                    {/* Action Tile: + Add Flavor (Clean 1:1 Squircle) */}
                    <button
                      type="button"
                      onClick={handleAddFlavor}
                      title="Add flavor"
                      className="group flex w-full cursor-pointer flex-col items-center rounded-[12px] bg-muted p-1 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                    >
                      <div className="relative flex aspect-square w-full items-center justify-center rounded-[9px] bg-background p-2">
                        <HugeiconsIcon
                          icon={PlusSignIcon}
                          className="size-5 text-muted-foreground group-hover:text-foreground"
                        />
                      </div>
                      <div className="flex h-5 w-full items-center justify-center px-1">
                        <span className="truncate font-sans text-[11px] leading-none font-medium tracking-tight">
                          + Add Flavor
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </aside>

      {/* =====================================================================
          CENTER STAGE: 70/30 Hero Canvas & Dual-Slab Workstation (Blocks 4, 5, 6)
          ===================================================================== */}
      {/* =====================================================================
          CENTER STAGE: 80/20 Hero Canvas & Master Console (Blocks 4 & 6)
          ===================================================================== */}
      <main className="flex min-w-0 flex-1 flex-col gap-2">
        {/* BLOCK 4: COMPONENT PREVIEW THEATER */}
        <TooltipProvider delayDuration={150}>
          <motion.section
            layout
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 34,
              mass: 0.8,
            }}
            aria-label="Block 4: Component Preview Theater"
            className={cn(
              "relative flex min-h-0 flex-col overflow-hidden rounded-[20px] bg-background p-2 transition-colors",
              isTimelineOpen ? "h-[78%]" : "h-full"
            )}
          >
            {/* Stage Container */}
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[16px]">
              {/* Workbench Cutting-Mat Substrate */}
              <PreviewBackground />

              {/* Interactive Resizable Device Frame (Centered Horizontally & Vertically) */}
              <motion.div
                key={animKey}
                initial={false}
                animate={{ width: previewWidth }}
                transition={{
                  type: "spring",
                  bounce: 0,
                  duration: 0.4,
                }}
                className="relative flex h-full max-w-full items-center justify-center overflow-hidden rounded-2xl bg-muted"
              >
                {/* Centered Button Archetype */}
                {renderActivePlaygroundComponent(activeScenarioKey)}
              </motion.div>

              {/* Floating Audition Toolbar (Positioned Absolutely in Bottom-Left) */}
              <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 rounded-[14px] bg-background p-1 select-none">
                {/* Viewport switcher: Desktop / Tablet / Mobile */}
                <LayoutGroup id="audition-viewport">
                  <div className="relative flex items-center rounded-[10px] bg-muted p-0.5">
                    {[
                      {
                        mode: "desktop" as const,
                        icon: LaptopIcon,
                        label: "Desktop",
                        hotkey: "1",
                      },
                      {
                        mode: "tablet" as const,
                        icon: Tablet01Icon,
                        label: "Tablet",
                        hotkey: "2",
                      },
                      {
                        mode: "mobile" as const,
                        icon: SmartPhone01Icon,
                        label: "Mobile",
                        hotkey: "3",
                      },
                    ].map((item) => {
                      const isActive = viewportMode === item.mode
                      return (
                        <Tooltip key={item.mode}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => handleViewportChange(item.mode)}
                              className={cn(
                                "relative z-10 flex size-8 cursor-pointer items-center justify-center rounded-[8px] transition-colors",
                                isActive
                                  ? "text-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="audition-viewport-pill"
                                  transition={{
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 30,
                                  }}
                                  className="absolute inset-0 rounded-[8px] bg-background"
                                />
                              )}
                              <span className="relative z-20">
                                <HugeiconsIcon
                                  icon={item.icon}
                                  className="size-4"
                                />
                              </span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="flex items-center gap-2"
                          >
                            <span>{item.label} View</span>
                            <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                              {item.hotkey}
                            </kbd>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                </LayoutGroup>

                <div className="h-4 w-px bg-muted" />

                {/* Component Selector Dropdown */}
                <Select
                  value={activeScenarioKey}
                  onValueChange={(val) =>
                    setActiveScenarioKey(val as ArchetypeKey)
                  }
                >
                  <SelectTrigger className="h-8 w-[105px] rounded-[10px] border-none bg-muted px-2.5 text-xs font-medium text-foreground hover:bg-secondary focus:ring-0 [&>span]:truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ARCHETYPE_SCENARIOS.map((scenario) => (
                      <SelectItem
                        key={scenario.id}
                        value={scenario.id}
                        className="text-xs"
                      >
                        {scenario.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="h-4 w-px bg-muted" />

                {/* Replay Animation Action */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={triggerSingleAnimation}
                      className="flex size-8 cursor-pointer items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <HugeiconsIcon icon={Refresh03Icon} className="size-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="flex items-center gap-2"
                  >
                    <span>Replay Animation</span>
                    <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                      R
                    </kbd>
                  </TooltipContent>
                </Tooltip>

                {/* Toggle Master Timeline Scrubber */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setIsTimelineOpen((open) => !open)}
                      className={cn(
                        "flex size-8 cursor-pointer items-center justify-center rounded-[10px] transition-colors",
                        isTimelineOpen
                          ? "bg-foreground text-background"
                          : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <HugeiconsIcon
                        icon={SlidersHorizontalIcon}
                        className="size-4"
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="flex items-center gap-2"
                  >
                    <span>
                      {isTimelineOpen
                        ? "Hide Timeline Scrubber"
                        : "Reveal Timeline Scrubber"}
                    </span>
                    <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                      T
                    </kbd>
                  </TooltipContent>
                </Tooltip>

                {/* Customize in Stage 2 */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => router.push(ROUTES.stage2)}
                      className="flex size-8 cursor-pointer items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        className="size-4"
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="flex items-center gap-2"
                  >
                    <span>Customize in Stage 2</span>
                    <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                      2
                    </kbd>
                  </TooltipContent>
                </Tooltip>

                {/* Add to Compare Queue Action */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={toggleCompareQueue}
                      className={cn(
                        "relative flex size-8 cursor-pointer items-center justify-center rounded-[10px] transition-colors",
                        isCurrentCurveQueued
                          ? "bg-foreground text-background"
                          : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <HugeiconsIcon icon={GitCompareIcon} className="size-4" />
                      {compareQueue.length > 0 && (
                        <span
                          className={cn(
                            "absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full font-mono text-[9px] font-semibold",
                            isCurrentCurveQueued
                              ? "bg-background text-foreground"
                              : "bg-foreground text-background"
                          )}
                        >
                          {compareQueue.length}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="flex items-center gap-2"
                  >
                    <span>
                      {isCurrentCurveQueued
                        ? `Queued for Compare (${compareQueue.length}/3) · Click to remove`
                        : `Add to Compare Queue (${compareQueue.length}/3)`}
                    </span>
                    <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                      C
                    </kbd>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </motion.section>
        </TooltipProvider>

        {/* BLOCK 6: UNIFIED MASTER TRANSPORT CONSOLE */}
        <AnimatePresence>
          {isTimelineOpen && (
            <motion.section
              key="block-6-timeline"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 34,
                  mass: 0.8,
                },
              }}
              exit={{
                y: 24,
                opacity: 0,
                scale: 0.98,
                transition: {
                  duration: 0.18,
                  ease: [0.4, 0, 1, 1],
                },
              }}
              aria-label="Block 6: Master Transport and Timeline Console"
              className="flex h-[22%] min-h-0 w-full flex-col justify-between rounded-[20px] bg-background p-3.5 transition-colors"
            >
              {/* Top Row: Transport Status & Keyframe Readout */}
              <div className="flex shrink-0 items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-[8px] bg-muted px-2.5 py-1">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        isPlaying
                          ? "animate-pulse bg-foreground"
                          : "bg-muted-foreground"
                      )}
                    />
                    <span className="font-heading text-xs font-semibold text-foreground">
                      Master Transport
                    </span>
                  </div>
                  <span className="font-sans text-xs font-medium text-foreground">
                    {activePresetMeta.name}
                  </span>
                  <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {activePresetMeta.engine === "bezier"
                      ? "Cubic Bezier"
                      : "Physical Spring"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {compareQueue.length > 0 && (
                    <Link
                      href={ROUTES.stage3}
                      className="flex items-center gap-1.5 rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <HugeiconsIcon icon={GitCompareIcon} className="size-3" />
                      <span>Compare Queue: {compareQueue.length}/3</span>
                    </Link>
                  )}
                  <div className="flex items-baseline gap-1.5 font-mono text-xs">
                    <span className="font-semibold text-foreground">
                      {Math.round(
                        (scrubProgress / 100) * activePresetMeta.duration
                      )}
                      ms
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">
                      {activePresetMeta.duration}ms
                    </span>
                    <span className="ml-1 rounded-[6px] bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                      {Math.round(scrubProgress)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Full-Width Timeline Scrubber Runway */}
              <div className="flex flex-col gap-1 py-0.5">
                <div className="relative flex h-6 w-full items-center">
                  {/* Visual background track */}
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    {/* Active progress bar */}
                    <div
                      className="h-full bg-foreground transition-none"
                      style={{
                        width: `${Math.max(0, Math.min(100, scrubProgress))}%`,
                      }}
                    />
                  </div>

                  {/* Floating draggable thumb */}
                  <div
                    className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
                    style={{
                      left: `${Math.max(0, Math.min(100, scrubProgress))}%`,
                    }}
                  />

                  {/* Accessible range input over the track */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={scrubProgress}
                    onMouseDown={() => setIsScrubbing(true)}
                    onTouchStart={() => setIsScrubbing(true)}
                    onChange={(e) => {
                      setIsScrubbing(true)
                      setIsPlaying(false)
                      setScrubProgress(parseFloat(e.target.value))
                    }}
                    onMouseUp={() => setIsScrubbing(false)}
                    onTouchEnd={() => setIsScrubbing(false)}
                    aria-label="Master Timeline Scrubber"
                    className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                  />
                </div>

                {/* Keyframe tick readout */}
                <div className="flex justify-between px-0.5 font-mono text-[9px] text-muted-foreground">
                  <span>0ms · Origin</span>
                  <span>{Math.round(activePresetMeta.duration * 0.25)}ms</span>
                  <span>
                    {Math.round(activePresetMeta.duration * 0.5)}ms · Halfway
                  </span>
                  <span>{Math.round(activePresetMeta.duration * 0.75)}ms</span>
                  <span>{activePresetMeta.duration}ms · Settle</span>
                </div>
              </div>

              {/* Bottom Row: Master Transport Controls, Speed Multipliers & Diagnostics */}
              <div className="flex shrink-0 items-center justify-between">
                {/* Left: Play / Pause / Replay / Loop */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] bg-foreground px-3 font-heading text-xs font-semibold text-background transition-transform active:scale-95"
                  >
                    <HugeiconsIcon
                      icon={isPlaying ? PauseIcon : PlayIcon}
                      className="size-3"
                    />
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                    <kbd className="rounded-[3px] bg-background px-1 py-0.5 font-mono text-[9px] text-foreground">
                      Space
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAnimKey((k) => k + 1)
                      setScrubProgress(0)
                      setIsPlaying(true)
                    }}
                    title="Replay from Origin (R)"
                    className="flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] bg-muted px-2.5 font-sans text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <HugeiconsIcon icon={Refresh03Icon} className="size-3" />
                    <span>Replay</span>
                    <kbd className="rounded-[3px] bg-secondary px-1 py-0.5 font-mono text-[9px] text-muted-foreground">
                      R
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsLooping((l) => !l)}
                    className={cn(
                      "flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] px-2.5 font-sans text-xs font-medium transition-colors",
                      isLooping
                        ? "bg-secondary text-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <HugeiconsIcon icon={RepeatIcon} className="size-3" />
                    <span>Loop</span>
                  </button>
                </div>

                {/* Center: Velocity Multipliers */}
                <div className="flex h-7 items-center rounded-[8px] bg-muted p-0.5 font-sans text-xs">
                  {[1, 0.5, 0.25].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setPlaybackSpeed(speed)}
                      className={cn(
                        "cursor-pointer rounded-[6px] px-2 py-0.5 text-xs transition-colors",
                        playbackSpeed === speed
                          ? "bg-background font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                {/* Right: Direction and A11y Suite */}
                <div className="flex items-center gap-2">
                  {/* Lifecycle Direction Toggle */}
                  <div className="flex items-center gap-0.5 rounded-[8px] bg-muted p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setLifecyclePhase("enter")}
                      className={cn(
                        "cursor-pointer rounded-[6px] px-2 py-0.5 font-medium transition-colors",
                        lifecyclePhase === "enter"
                          ? "bg-background text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Enter
                    </button>
                    <button
                      type="button"
                      onClick={() => setLifecyclePhase("exit")}
                      className={cn(
                        "cursor-pointer rounded-[6px] px-2 py-0.5 font-medium transition-colors",
                        lifecyclePhase === "exit"
                          ? "bg-background text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Exit
                    </button>
                  </div>

                  {/* Reduced Motion Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsReducedMotion((m) => !m)}
                    className={cn(
                      "flex h-7 cursor-pointer items-center gap-1.5 rounded-[8px] px-2 font-sans text-[11px] transition-colors",
                      isReducedMotion
                        ? "bg-secondary font-medium text-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>Reduced Motion</span>
                    <div
                      className={cn(
                        "size-2 rounded-full",
                        isReducedMotion
                          ? "bg-foreground"
                          : "bg-muted-foreground"
                      )}
                    />
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* =====================================================================
          RIGHT FLANK: 300px Fixed Width (Blocks 7 & 8)
          ===================================================================== */}
      <aside className="flex w-[300px] shrink-0 flex-col gap-2">
        {/* BLOCK 7: PRODUCTION EXPORT SLAB (AIRY & DEDICATED) */}
        <section
          aria-label="Block 7: Production Export Slab"
          className="no-scrollbar flex min-h-0 flex-1 flex-col justify-between overflow-y-auto rounded-[20px] bg-background p-3.5 transition-colors"
        >
          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px] font-medium text-muted-foreground">
                Block 07 · Production Export
              </span>
              <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[10px] text-muted-foreground">
                300px
              </span>
            </div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Production Export
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              First-class multi-framework handoff with token fidelity.
            </p>
          </div>

          {/* Central Export Deck */}
          <div className="my-auto flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-2.5 rounded-[14px] bg-secondary p-3">
              {/* Framework Switcher Tabs */}
              <div className="flex h-8 w-full items-center justify-between rounded-[8px] bg-background p-1">
                {(["CSS", "Tailwind", "Motion", "SwiftUI"] as const).map(
                  (fw) => (
                    <button
                      key={fw}
                      type="button"
                      onClick={() => setExportFramework(fw)}
                      className={cn(
                        "flex-1 cursor-pointer rounded-[6px] py-0.5 text-center font-heading text-[11px] font-medium transition-colors",
                        exportFramework === fw
                          ? "bg-foreground font-semibold text-background"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {fw}
                    </button>
                  )
                )}
              </div>

              {/* High-Contrast Neutral Copy Action */}
              <button
                type="button"
                onClick={handleCopyToken}
                className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-foreground px-3 font-heading text-xs font-semibold text-background transition-transform active:scale-95"
              >
                <span>
                  {hasCopiedToken ? "Copied to Clipboard!" : "Copy Ease Token"}
                </span>
                <kbd className="rounded-[4px] bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  ⌘C
                </kbd>
              </button>

              {/* Code Snippet Output Box */}
              <div className="flex flex-col gap-1.5 rounded-[8px] bg-background p-2.5">
                <div className="flex items-center justify-between font-sans text-[10px] text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {exportFramework} Output
                  </span>
                  <span className="max-w-[130px] truncate text-right">
                    {activePresetMeta.name}
                  </span>
                </div>
                <code className="font-mono text-[10px] leading-tight break-all whitespace-pre-wrap text-foreground">
                  {getExportSnippet()}
                </code>
              </div>
            </div>

            {/* Quick Settle Specs Readout */}
            <div className="flex items-center justify-between rounded-[10px] bg-muted px-3 py-2 font-sans text-[11px]">
              <span className="text-muted-foreground">Settle duration:</span>
              <span className="font-semibold text-foreground">
                {activePresetMeta.duration}ms
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 font-sans text-[10px] text-muted-foreground">
            <span>Omnipresent Across Stages</span>
            <span>Zero-Friction Handoff</span>
          </div>
        </section>

        {/* BLOCK 8: DEDICATED COMPARE QUEUE */}
        <section
          aria-label="Block 8: Compare Queue"
          className="flex shrink-0 flex-col gap-2.5 rounded-[18px] bg-background p-3.5 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[10px] font-semibold text-muted-foreground">
                Block 08
              </span>
              <span className="font-heading text-xs font-semibold text-foreground">
                Compare Queue
              </span>
            </div>
            <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[10px] text-muted-foreground">
              {compareQueue.length}/3 Staged
            </span>
          </div>

          {/* Staging Slots */}
          {compareQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[8px] bg-muted p-4 text-center">
              <HugeiconsIcon
                icon={GitCompareIcon}
                className="mb-1.5 size-4 text-muted-foreground"
              />
              <span className="font-heading text-xs font-medium text-foreground">
                Queue is Empty
              </span>
              <p className="mt-1 font-sans text-[11px] text-muted-foreground">
                Press{" "}
                <kbd className="rounded bg-background px-1 py-0.5 font-mono text-[9px] text-foreground">
                  C
                </kbd>{" "}
                or click the queue button to stage curves for the Stage 3 duel.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {compareQueue.map((curveId, index) => {
                const dossier = resolveEase(curveId)
                const name = dossier?.name ?? curveId
                const duration = dossier?.duration ?? 300
                const isCurrent = curveId === activePresetId
                return (
                  <div
                    key={curveId}
                    className={cn(
                      "flex items-center justify-between rounded-[8px] px-2.5 py-1.5 transition-colors",
                      isCurrent ? "bg-secondary" : "bg-muted"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-foreground font-sans text-[9px] font-bold text-background">
                        {index + 1}
                      </span>
                      <span className="truncate font-heading text-xs font-medium text-foreground">
                        {name}
                      </span>
                      {isCurrent && (
                        <span className="shrink-0 rounded-[4px] bg-background px-1 py-0.5 font-sans text-[8px] text-muted-foreground">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 font-sans text-[10px] text-muted-foreground">
                        {duration}ms
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCompareQueue((prev) =>
                            prev.filter((id) => id !== curveId)
                          )
                        }
                        className="cursor-pointer text-muted-foreground hover:text-foreground"
                        title="Remove from queue"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Actions: Queue Active Curve & Open Stage 3 */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={toggleCompareQueue}
              className={cn(
                "flex h-7 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] font-heading text-xs font-medium transition-colors",
                isCurrentCurveQueued
                  ? "bg-foreground font-semibold text-background"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <HugeiconsIcon icon={GitCompareIcon} className="size-3" />
              <span>
                {isCurrentCurveQueued ? "Queued (C)" : "Queue Current (C)"}
              </span>
            </button>

            <Link
              href={ROUTES.stage3}
              className="flex h-7 cursor-pointer items-center justify-center gap-1 rounded-[8px] bg-muted px-2.5 font-sans text-[11px] font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <span>Duel</span>
              <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-3" />
            </Link>
          </div>

          {/* Integrated Platform Footnote */}
          <div className="flex items-center justify-between pt-1 font-sans text-[10px] text-muted-foreground">
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
              <span className="text-[10px] text-muted-foreground">·</span>
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
        </section>
      </aside>
    </div>
  )
}
