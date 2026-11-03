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
  ArrowLeft01Icon,
  Layers01Icon,
  Search01Icon,
  Cancel01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { useMounted } from "@/hooks/use-mounted"
import { CommandMenuTrigger } from "@/components/layout/command-menu"
import { MiniGraph } from "@/components/ui/mini-graph"
import { BEZIER_PRESETS, SPRING_PRESETS } from "@/core/presets"
import { BezierConfig, SpringConfig } from "@/core/types"
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
}

export const ARCHETYPE_KINETICS: Record<string, KineticAnatomy> = {
  entrance: {
    role: "Entrance Decel",
    launchVelocity: "Peak impulse at t=0",
    settleCharacter: "Asymptotic friction cushion (0% overshoot)",
    feel: "Fluid liquid glide mimicking physical friction",
    choreographyLaw:
      "Primary Arrival Curve. Peak launch velocity absorbs user intent instantly, then cushions asymptotically into rest so the eye locks onto arriving content.",
    timingSweetSpot: "250ms – 350ms",
  },
  exit: {
    role: "Exit Dismissal",
    launchVelocity: "Low-velocity departure building momentum",
    settleCharacter: "Exits screen bounds before deceleration begins",
    feel: "Accelerating departure off-screen",
    choreographyLaw:
      "Dismissal & Exit Curve. Accelerates departing elements off-screen into invisibility. Never decelerate on exit—lingering dismissals make UI feel sluggish.",
    timingSweetSpot: "160ms – 240ms",
  },
  transit: {
    role: "Transit S-Curve",
    launchVelocity: "Gentle progressive ramp-up",
    settleCharacter: "Symmetric deceleration into destination",
    feel: "Calm, unobtrusive point-to-point transition",
    choreographyLaw:
      "Point-to-Point Transit. Moves elements comfortably across screen coordinates without drawing undue attention to the motion itself.",
    timingSweetSpot: "200ms – 320ms",
  },
  expressive: {
    role: "Expressive Pop",
    launchVelocity: "High-momentum spring impulse",
    settleCharacter: "Controlled +4% to +8% rebound",
    feel: "Playful kinetic character with tactile pop",
    choreographyLaw:
      "Celebratory & Hero Motion. Controlled overshoot adds energy to notifications and badges. Strictly avoid on high-frequency transactional dialogs.",
    timingSweetSpot: "350ms – 460ms",
  },
  snappy: {
    role: "Tactile Micro-Snap",
    launchVelocity: "Zero-delay pointer impulse",
    settleCharacter: "Critically damped stop (zero ringing)",
    feel: "Crisp physical response for direct manipulation",
    choreographyLaw:
      "Direct Manipulation Response. Responds instantaneously to touch and gesture releases. Damping ratio must remain high to avoid visual jitter.",
    timingSweetSpot: "140ms – 220ms",
  },
  mechanical: {
    role: "Mechanical Step",
    launchVelocity: "Constant velocity with zero acceleration",
    settleCharacter: "Immediate quantized stop",
    feel: "Quantized, industrial, robotic precision",
    choreographyLaw:
      "Functional UI States. Best for continuous loaders, progress bars, and clock hands where natural physical friction feels inappropriate.",
    timingSweetSpot: "150ms – 300ms",
  },
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

function getPresetKineticIntel(
  id: string,
  name: string,
  engine: "bezier" | "spring",
  custom?: CustomEase
): KineticAnatomy {
  const lowerId = id.toLowerCase()
  const lowerName = name.toLowerCase()
  const parent = (custom?.parentPreset ?? "").toLowerCase()
  const combined = `${lowerId} ${lowerName} ${parent}`

  let base: KineticAnatomy

  // 1. Exit / Acceleration
  if (
    combined.includes("exit") ||
    combined.includes("accelerate") ||
    lowerId === "ease-in" ||
    (lowerId.includes("-in") && !lowerId.includes("-in-out"))
  ) {
    base = { ...ARCHETYPE_KINETICS.exit }
  }
  // 2. Entrance / Deceleration
  else if (
    combined.includes("decel") ||
    combined.includes("modal") ||
    combined.includes("sheet") ||
    combined.includes("drawer") ||
    lowerId === "ease-out" ||
    (lowerId.includes("-out") && !lowerId.includes("-in-out")) ||
    combined.includes("fluid")
  ) {
    base = { ...ARCHETYPE_KINETICS.entrance }
  }
  // 3. Expressive / Bouncy / Overshoot
  else if (
    combined.includes("bounce") ||
    combined.includes("expressive") ||
    combined.includes("pop") ||
    combined.includes("back") ||
    combined.includes("wobble") ||
    combined.includes("toast")
  ) {
    base = { ...ARCHETYPE_KINETICS.expressive }
  }
  // 4. Snappy / Tactile / Fast
  else if (
    combined.includes("button") ||
    combined.includes("snap") ||
    combined.includes("fast") ||
    combined.includes("subdued")
  ) {
    base = { ...ARCHETYPE_KINETICS.snappy }
  }
  // 5. Mechanical / Linear
  else if (combined.includes("linear") || combined.includes("step")) {
    base = { ...ARCHETYPE_KINETICS.mechanical }
  }
  // 6. Default to Transit S-Curve for Bezier, or Snappy for Springs
  else {
    base =
      engine === "spring"
        ? { ...ARCHETYPE_KINETICS.snappy }
        : { ...ARCHETYPE_KINETICS.transit }
  }

  // Override with custom-calibrated values if present on CustomEase
  if (custom?.guidance) {
    base.choreographyLaw = custom.guidance
  }
  if (custom?.targetSettle) {
    base.timingSweetSpot = custom.targetSettle
  }

  return base
}

function getPresetCategory(id: string, mode: "bezier" | "spring"): string {
  return getPresetKineticIntel(id, id, mode).role
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
  const [hoveredCurveMeta, setHoveredCurveMeta] = React.useState<{
    name: string
    duration?: number
    archetype?: string
  } | null>(null)
  type StackLevel =
    | { level: 0 }
    | { level: 1; curveId: string }
    | { level: 2; curveId: string; variantId: string }

  const [navStack, setNavStack] = React.useState<StackLevel>({ level: 0 })
  const [isGhostMode, setIsGhostMode] = React.useState<boolean>(false)
  const [exportFramework, setExportFramework] = React.useState<
    "CSS" | "Tailwind" | "Motion" | "SwiftUI"
  >("CSS")
  const [hasCopiedToken, setHasCopiedToken] = React.useState(false)
  const [hasCopiedFormula, setHasCopiedFormula] = React.useState(false)
  const [hasCopiedSnippet, setHasCopiedSnippet] = React.useState(false)

  const handleCopyFormula = (val: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(val)
      setHasCopiedFormula(true)
      setTimeout(() => setHasCopiedFormula(false), 1500)
    }
  }

  const handleCopySnippet = (snippet: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(snippet)
      setHasCopiedSnippet(true)
      setTimeout(() => setHasCopiedSnippet(false), 1500)
    }
  }

  const [compareSlotB, setCompareSlotB] = React.useState<{
    id: string
    name: string
    duration: number
    engine: "bezier" | "spring"
    values: string
    bezier?: BezierConfig
    spring?: SpringConfig
  }>({
    id: "apple-fluid-decel",
    name: "Apple Fluid Decel",
    duration: 350,
    engine: "bezier",
    values: "0.16, 1.00, 0.30, 1.00",
    bezier: { p1: { x: 0.16, y: 1.0 }, p2: { x: 0.3, y: 1.0 } },
  })

  const resolveEase = React.useCallback(
    (id: string): EaseDossier | undefined => {
      // 1. Check customCurves
      const custom = customCurves.find((c) => c.id === id)
      if (custom) {
        const kinetics = getPresetKineticIntel(
          custom.id,
          custom.name,
          custom.engine,
          custom
        )
        return {
          id: custom.id,
          name: custom.name,
          origin: `Forked from ${custom.parentPreset}`,
          isCustom: true,
          engine: custom.engine,
          values: custom.values,
          bezier: custom.bezier,
          spring: custom.spring,
          duration: custom.duration,
          description: custom.desc ?? "Custom calibrated easing curve",
          useCases: custom.useCases ?? [
            "Direct Manipulation",
            "Interactive Views",
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
        const kinetics = getPresetKineticIntel(bp.id, bp.label, "bezier")
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
          bp.id.startsWith("circ")
        )
          origin = "Penner Mathematical Curve"

        return {
          id: bp.id,
          name: bp.label,
          origin,
          isCustom: false,
          engine: "bezier",
          values: valStr,
          bezier: bConf,
          duration: 350,
          description: bp.description,
          useCases: bp.useCases,
          kinetics,
        }
      }

      // 3. Check SPRING_PRESETS
      const sp = SPRING_PRESETS.find((p) => p.id === id)
      if (sp) {
        const sConf = sp.value as SpringConfig
        const kinetics = getPresetKineticIntel(sp.id, sp.label, "spring")
        const valStr = `m:${sConf.mass} s:${sConf.stiffness} d:${sConf.damping}`
        let origin = "Satisium Physics Standard"
        if (sp.id.includes("apple")) origin = "Apple HIG Fluid Spring"
        else if (sp.id.includes("material")) origin = "Material Design Spring"

        return {
          id: sp.id,
          name: sp.label,
          origin,
          isCustom: false,
          engine: "spring",
          values: valStr,
          spring: sConf,
          duration: 440,
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
      if (e.key === "Escape") {
        setNavStack((prev) => {
          if (prev.level === 2) return { level: 1, curveId: prev.curveId }
          if (prev.level === 1) return { level: 0 }
          return prev
        })
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleCustomCurveClick = (curve: CustomEase) => {
    setActivePresetId(curve.id)
    setActiveEngine(curve.engine)
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

  const filteredSystemPresets = React.useMemo(() => {
    const list = activeEngine === "bezier" ? BEZIER_PRESETS : SPRING_PRESETS
    if (!searchQuery) return list
    const query = searchQuery.toLowerCase()
    return list.filter((p) => {
      const matchName = p.label.toLowerCase().includes(query)
      const matchDesc = p.description.toLowerCase().includes(query)
      const matchUse = p.useCases.some((u) => u.toLowerCase().includes(query))
      return matchName || matchDesc || matchUse
    })
  }, [activeEngine, searchQuery])

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

  const getExportSnippet = () => {
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
  }

  const handleCopyToken = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(getExportSnippet())
      setHasCopiedToken(true)
      setTimeout(() => setHasCopiedToken(false), 2000)
    }
  }

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
                          onMouseEnter={() =>
                            setHoveredCurveMeta({
                              name: curve.name,
                              duration: curve.duration,
                              archetype: "Custom",
                            })
                          }
                          onMouseLeave={() => setHoveredCurveMeta(null)}
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

            {/* 3. LIBRARY HEADER + 1-LINE DYNAMIC READOUT DOCK */}
            <div className="mt-2.5 flex h-5 shrink-0 items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xs font-semibold text-foreground">
                  Library
                </span>
                <span className="font-sans text-[11px] font-normal text-muted-foreground">
                  ({filteredSystemPresets.length})
                </span>
              </div>

              {/* Fixed 1-Line Readout Dock */}
              <div className="max-w-[155px] min-w-0 truncate text-right">
                {hoveredCurveMeta ? (
                  <span className="font-sans text-[11px] font-medium text-foreground transition-all">
                    {hoveredCurveMeta.name}
                  </span>
                ) : (
                  <span className="font-sans text-[11px] text-muted-foreground transition-all">
                    {activePresetMeta.name}
                  </span>
                )}
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
                <div className="grid grid-cols-3 gap-1.5">
                  {filteredSystemPresets.map((item) => {
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
                          }}
                          onDoubleClick={() =>
                            setNavStack({ level: 1, curveId: item.id })
                          }
                          onMouseEnter={() =>
                            setHoveredCurveMeta({
                              name: item.label,
                              duration: activeEngine === "bezier" ? 350 : 450,
                              archetype: getPresetCategory(
                                item.id,
                                activeEngine
                              ),
                            })
                          }
                          onMouseLeave={() => setHoveredCurveMeta(null)}
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
              "absolute inset-0 flex flex-col justify-between rounded-[20px] bg-background p-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none",
              navStack.level === 1
                ? "pointer-events-auto translate-x-0"
                : navStack.level === 0
                  ? "pointer-events-none translate-x-[calc(100%+8px)]"
                  : "pointer-events-none -translate-x-[calc(100%+8px)]"
            )}
          >
            {activeDossier && (
              <div className="flex h-full flex-col">
                {/* TOP: COMPACT, ELEGANT KINETIC DOSSIER */}
                <div className="flex shrink-0 flex-col gap-3 pb-1">
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

                  {/* Title & Origin Pedigree */}
                  <div className="flex shrink-0 flex-col gap-1">
                    <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                      {activeDossier.name}
                    </h3>
                    <div className="flex items-center gap-1.5 font-sans text-[11px] text-muted-foreground">
                      <span className="rounded-[4px] bg-muted px-1.5 py-0.5 text-[9px] font-semibold tracking-tight text-foreground uppercase">
                        {activeDossier.kinetics.role}
                      </span>
                      <span>·</span>
                      <span className="truncate">{activeDossier.origin}</span>
                    </div>
                  </div>

                  {/* The Single Definitive Kinetic Law (Hero Statement) */}
                  <p className="font-sans text-xs leading-[1.5] text-foreground">
                    &ldquo;{activeDossier.kinetics.choreographyLaw}&rdquo;
                  </p>

                  {/* Best For (Habitats) */}
                  {activeDossier.useCases &&
                    activeDossier.useCases.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="font-sans text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                          Best For
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {activeDossier.useCases.map((uc) => (
                            <span
                              key={uc}
                              className="rounded-[6px] bg-muted px-2 py-0.5 font-sans text-[10px] font-medium text-foreground"
                            >
                              {uc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Timing Sweet Spot */}
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Sweet Spot
                    </span>
                    <span className="font-sans text-[11px] font-medium text-foreground">
                      {activeDossier.kinetics.timingSweetSpot}
                    </span>
                  </div>

                  {/* Full-Width Formula Row with 1-Click Copy */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Formula Specification
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyFormula(activeDossier.values)}
                        className="cursor-pointer font-sans text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {hasCopiedFormula ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                    <div className="flex h-7 w-full items-center justify-between rounded-[8px] bg-muted px-2.5 font-mono text-[11px] font-medium text-foreground">
                      <span className="truncate">{activeDossier.values}</span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM: OCCUPYING THE REMAINING SPACE NATURALLY */}
                {activeDossier.isCustom ? (
                  <div className="flex min-h-0 flex-1 flex-col pt-3">
                    <div className="flex shrink-0 items-center justify-between px-0.5 pb-2">
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

                    {/* Responsive Grid Filling the Space Gracefully */}
                    <div className="no-scrollbar grid flex-1 grid-cols-2 gap-2 overflow-y-auto pb-1">
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
                                "relative flex w-full flex-1 cursor-pointer flex-col items-center justify-between rounded-[12px] p-1 transition-all",
                                isSelected
                                  ? "bg-foreground text-background"
                                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                              )}
                            >
                              {/* Inner Mini Graph Box with High Visual Balance */}
                              <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[9px] bg-background p-1.5">
                                {subVariantCount > 0 && (
                                  <span className="pointer-events-none absolute top-1 left-1.5 font-sans text-[9px] font-semibold tracking-tight text-muted-foreground">
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

                              {/* Grounded Name Strip in Outer Box */}
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

                      {/* Action Tile: + Add Variant */}
                      <button
                        type="button"
                        onClick={handleAddVariant}
                        title="Add variant"
                        className="group flex w-full flex-1 cursor-pointer flex-col items-center justify-between rounded-[12px] bg-muted p-1 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                      >
                        <div className="relative flex aspect-[16/10] w-full items-center justify-center rounded-[9px] bg-background p-1.5">
                          <HugeiconsIcon
                            icon={PlusSignIcon}
                            className="size-4 text-muted-foreground group-hover:text-foreground"
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
                  <div className="flex min-h-0 flex-1 flex-col justify-between pt-4">
                    {/* Kinetic Physics Profile Cards */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex flex-col gap-1 rounded-[10px] bg-muted p-2.5">
                        <span className="font-sans text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                          Launch Impulse
                        </span>
                        <span className="font-sans text-xs text-foreground">
                          {activeDossier.kinetics.launchVelocity}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 rounded-[10px] bg-muted p-2.5">
                        <span className="font-sans text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                          Settle & Deceleration
                        </span>
                        <span className="font-sans text-xs text-foreground">
                          {activeDossier.kinetics.settleCharacter}
                        </span>
                      </div>

                      {/* Instant CSS snippet copy row */}
                      <div className="flex flex-col gap-1 pt-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                            CSS Snippet
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopySnippet(
                                `transition: all ${activeDossier.duration}ms ${
                                  activeDossier.engine === "bezier"
                                    ? `cubic-bezier(${activeDossier.values})`
                                    : "ease"
                                };`
                              )
                            }
                            className="cursor-pointer font-sans text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {hasCopiedSnippet ? "Copied ✓" : "Copy"}
                          </button>
                        </div>
                        <div className="flex h-7 w-full items-center justify-between rounded-[8px] bg-muted px-2.5 font-mono text-[10px] text-foreground">
                          <span className="truncate">
                            {activeDossier.engine === "bezier"
                              ? `cubic-bezier(${activeDossier.values})`
                              : `spring(${activeDossier.values})`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Grounded Fork Button */}
                    <div className="flex shrink-0 flex-col pt-3">
                      <button
                        type="button"
                        onClick={() => handleForkPreset(activeDossier.id)}
                        className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-foreground px-3 font-heading text-xs font-semibold text-background transition-transform active:scale-95"
                      >
                        <HugeiconsIcon
                          icon={PlusSignIcon}
                          className="size-3.5"
                        />
                        <span>Fork to Custom Preset</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* LEVEL 2: VARIANT TUNING BLOCK (THE PHYSICAL MONOLITHIC SLAB) */}
          <section
            aria-label="Block 02: Variant Tuning"
            className={cn(
              "absolute inset-0 flex flex-col justify-between rounded-[20px] bg-background p-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none",
              navStack.level === 2
                ? "pointer-events-auto translate-x-0"
                : "pointer-events-none translate-x-[calc(100%+8px)]"
            )}
          >
            {currentCurve && currentVariant && (
              <div className="flex h-full flex-col">
                {/* TOP: MINIMALIST ESSENTIAL VARIANT DOSSIER */}
                <div className="flex shrink-0 flex-col gap-3 pb-1">
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
                  <div className="flex shrink-0 flex-col gap-1">
                    <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                      {currentVariant.name}
                    </h3>
                    <span className="font-sans text-[11px] text-muted-foreground">
                      Branch of {currentCurve.name} · Kinetic Variant
                    </span>
                  </div>

                  {/* Variant Description */}
                  {currentVariant.desc && (
                    <p className="font-sans text-xs leading-[1.5] text-foreground">
                      {currentVariant.desc}
                    </p>
                  )}

                  {/* Formula Specification (Full Width with 1-Click Copy) */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Formula Specification
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyFormula(currentVariant.values)}
                        className="cursor-pointer font-sans text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {hasCopiedFormula ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                    <div className="flex h-7 w-full items-center justify-between rounded-[8px] bg-muted px-2.5 font-mono text-[11px] font-medium text-foreground">
                      <span className="truncate">{currentVariant.values}</span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM: OCCUPYING THE REMAINING SPACE WITH FLAVORS GRID */}
                <div className="flex min-h-0 flex-1 flex-col pt-3">
                  <div className="flex shrink-0 items-center justify-between px-0.5 pb-2">
                    <span className="font-heading text-xs font-semibold text-foreground">
                      Flavors
                    </span>
                    <span className="rounded-[6px] bg-secondary px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground">
                      {currentVariant.variants?.length ?? 0}
                    </span>
                  </div>

                  <div className="no-scrollbar grid flex-1 grid-cols-2 gap-2 overflow-y-auto pb-1">
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
                              "relative flex w-full flex-1 cursor-pointer flex-col items-center justify-between rounded-[12px] p-1 transition-all",
                              isSelected
                                ? "bg-foreground text-background"
                                : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[9px] bg-background p-1.5">
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

                    {/* Action Tile: + Add Flavor */}
                    <button
                      type="button"
                      onClick={handleAddFlavor}
                      title="Add flavor"
                      className="group flex w-full flex-1 cursor-pointer flex-col items-center justify-between rounded-[12px] bg-muted p-1 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                    >
                      <div className="relative flex aspect-[16/10] w-full items-center justify-center rounded-[9px] bg-background p-1.5">
                        <HugeiconsIcon
                          icon={PlusSignIcon}
                          className="size-4 text-muted-foreground group-hover:text-foreground"
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
              <span className="font-sans text-[11px] font-medium text-muted-foreground">
                Block 04 · Center Stage
              </span>
              <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[10px] text-muted-foreground">
                100% Full-Height Canvas
              </span>
            </div>

            {/* Crucial Stage 2 Transition Hook */}
            <div className="flex items-center gap-2">
              <span className="font-sans text-[11px] text-muted-foreground">
                Press [2] or click:
              </span>
              <div className="flex cursor-pointer items-center gap-1.5 rounded-[10px] bg-foreground px-3.5 py-1.5 font-heading text-xs font-semibold text-background transition-transform active:scale-95">
                <span>Customize Curve</span>
                <span className="font-sans text-[11px]">↗</span>
              </div>
            </div>
          </div>

          {/* Central Spatial Schematic: Real-World UI Archetype Active Stage */}
          <div className="z-10 mx-auto my-auto flex max-w-lg flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-[16px] bg-secondary font-heading text-sm font-semibold text-foreground">
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
                <span className="font-sans text-[11px] font-semibold text-foreground">
                  Active Archetype: Modal Dialog
                </span>
                <span className="rounded-[6px] bg-background px-2 py-0.5 font-sans text-[10px] font-medium text-foreground">
                  {activePresetMeta.name}
                </span>
              </div>

              {isGhostMode ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex h-16 w-full flex-col items-center justify-center rounded-[10px] bg-foreground p-2 text-center text-background">
                    <span className="w-full truncate font-heading text-xs font-semibold">
                      Base (A): {activePresetMeta.name}
                    </span>
                    <span className="font-sans text-[10px] opacity-75">
                      {activePresetMeta.duration}ms
                    </span>
                  </div>
                  <div className="flex h-16 w-full flex-col items-center justify-center rounded-[10px] bg-secondary p-2 text-center text-foreground">
                    <span className="w-full truncate font-heading text-xs font-semibold">
                      Ghost (B): {compareSlotB.name}
                    </span>
                    <span className="font-sans text-[10px] text-muted-foreground">
                      {compareSlotB.duration}ms
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex h-16 w-full items-center justify-center rounded-[10px] bg-background text-xs font-medium text-muted-foreground">
                  [ Interactive Component Sandbox Mounts Here ]
                </div>
              )}

              <div className="flex items-center justify-between font-sans text-[10px] text-muted-foreground">
                <span>Travel: Scale 0.92 → 1.0 + Fade</span>
                <span>
                  {isGhostMode
                    ? `Compare: ${activePresetMeta.duration}ms vs ${compareSlotB.duration}ms`
                    : `Settle: ${activePresetMeta.duration}ms`}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Stage Blueprint Baseline */}
          <div className="z-10 flex items-center justify-between pt-2 font-sans text-[10px] text-muted-foreground">
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
              <span className="font-sans text-[10px] font-medium text-muted-foreground">
                Block 05 · Selector
              </span>
              <span className="font-heading text-xs font-semibold text-foreground">
                Modal Dialog ▼
              </span>
            </div>
            <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[10px] text-muted-foreground">
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
              <div className="flex h-7 items-center rounded-[8px] bg-secondary px-2 font-sans text-[11px] text-muted-foreground">
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
                      "rounded-[6px] px-2 py-0.5 font-sans text-[10px]",
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
                <span className="font-sans text-[10px] text-muted-foreground">
                  0%
                </span>
                <div className="relative h-2 min-w-0 flex-1 rounded-full bg-secondary">
                  <div className="absolute top-1/2 left-[38%] size-3 -translate-y-1/2 rounded-full bg-foreground" />
                </div>
                <span className="font-sans text-[10px] text-muted-foreground">
                  100%
                </span>
              </div>
            </div>

            {/* Reduced Motion A11y Toggle */}
            <div className="flex h-7 items-center gap-1.5 rounded-[8px] bg-secondary px-2.5 font-sans text-[10px] text-muted-foreground">
              <span>Reduced Motion</span>
              <div className="size-2 rounded-full bg-muted-foreground" />
            </div>
          </section>
        </div>
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

        {/* BLOCK 8: DEDICATED COMPARE BENCH */}
        <section
          aria-label="Block 8: Compare Bench"
          className="flex shrink-0 flex-col gap-2.5 rounded-[18px] bg-background p-3.5 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[10px] font-semibold text-muted-foreground">
                Block 08
              </span>
              <span className="font-heading text-xs font-semibold text-foreground">
                Compare Bench
              </span>
            </div>
            <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[10px] text-muted-foreground">
              A/B Staged
            </span>
          </div>

          {/* Staging Slots */}
          <div className="flex flex-col gap-1.5">
            {/* Slot A: Active Base */}
            <div className="flex items-center justify-between rounded-[8px] bg-muted px-2.5 py-1.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className="rounded-[4px] bg-foreground px-1.5 py-0.5 font-sans text-[9px] font-bold text-background">
                  A
                </span>
                <span className="truncate font-heading text-xs font-medium text-foreground">
                  {activePresetMeta.name}
                </span>
              </div>
              <span className="shrink-0 font-sans text-[10px] text-muted-foreground">
                {activePresetMeta.duration}ms
              </span>
            </div>

            {/* Slot B: Challenger */}
            <div className="flex items-center justify-between rounded-[8px] bg-muted px-2.5 py-1.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className="rounded-[4px] bg-secondary px-1.5 py-0.5 font-sans text-[9px] font-bold text-foreground">
                  B
                </span>
                <span className="truncate font-heading text-xs font-medium text-foreground">
                  {compareSlotB.name}
                </span>
              </div>
              <span className="shrink-0 font-sans text-[10px] text-muted-foreground">
                {compareSlotB.duration}ms
              </span>
            </div>
          </div>

          {/* Delta Telemetry Readout */}
          <div className="flex items-center justify-between rounded-[8px] bg-secondary px-2.5 py-1.5 font-sans text-[10px]">
            <span className="text-muted-foreground">
              Duration Delta (B − A)
            </span>
            <span className="font-semibold text-foreground">
              {compareSlotB.duration - activePresetMeta.duration >= 0
                ? `+${compareSlotB.duration - activePresetMeta.duration}ms`
                : `${compareSlotB.duration - activePresetMeta.duration}ms`}
            </span>
          </div>

          {/* Actions: Ghost Audition & Pin Current */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => setIsGhostMode(!isGhostMode)}
              className={cn(
                "flex h-7 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] font-heading text-xs font-medium transition-colors",
                isGhostMode
                  ? "bg-foreground font-semibold text-background"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <HugeiconsIcon icon={Layers01Icon} className="size-3" />
              <span>{isGhostMode ? "Ghost: On" : "Ghost: Off"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCompareSlotB({
                  id: activePresetId,
                  name: activePresetMeta.name,
                  duration: activePresetMeta.duration,
                  engine: activePresetMeta.engine,
                  values: activePresetMeta.values,
                  bezier: activePresetMeta.bezier,
                  spring: activePresetMeta.spring,
                })
              }}
              title="Pin currently auditioned curve to Slot B"
              className="flex h-7 cursor-pointer items-center justify-center rounded-[8px] bg-muted px-2.5 font-sans text-[11px] font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Pin to B
            </button>
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
