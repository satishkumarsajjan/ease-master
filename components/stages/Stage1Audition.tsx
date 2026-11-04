"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ViewportMode } from "@/components/previewer/resizable-playground"
import { BEZIER_PRESETS, SPRING_PRESETS } from "@/core/presets"
import { BezierConfig, SpringConfig } from "@/core/types"
import { ROUTES } from "@/lib/routes"
import {
  CustomEase,
  EaseDossier,
  StackLevel,
  ArchetypeKey,
} from "./stage-1/stage-1-types"
import { INITIAL_CUSTOM_CURVES } from "./stage-1/stage-1-curves"
import {
  computeKineticIntel,
  getActivePresetMeta,
  getEasedValue,
} from "./stage-1/stage-1-kinetics"
import { BrandSlab } from "./stage-1/left-flank/brand-slab"
import { PresetCatalog } from "./stage-1/left-flank/preset-catalog"
import { PreviewTheater } from "./stage-1/center-stage/preview-theater"
import { TimelineConsole } from "./stage-1/center-stage/timeline-console"
import { ExportSlab } from "./stage-1/right-flank/export-slab"
import { CompareQueueSlab } from "./stage-1/right-flank/compare-queue-slab"

export type * from "./stage-1/stage-1-types"

/**
 * ============================================================================
 * STAGE 1: THE AUDITION STAGE (PURE SPATIAL BLOCK LAYOUT)
 * ============================================================================
 * - Shell: Full-bleed viewport edge-to-edge (h-dvh w-full overflow-hidden bg-muted p-2 gap-2).
 * - Left Flank: w-[280px] Hug-Fill-Hug vertical rhythm (Blocks 1, 2, 3).
 * - Center Stage: Hero Canvas (Block 4) + Master Timeline Console (Block 6).
 * - Right Flank: w-[300px] Production Export (Block 7) + Compare Queue (Block 8).
 * - Squircles: Outer major blocks rounded-[20px]; secondary bars rounded-[14px];
 *   inner tokens rounded-[10px]. Zero 1px borders, zero drop shadows.
 * - Gutters: Exactly 8px (gap-2 p-2) exposing the sunken bg-muted substrate.
 * ============================================================================
 */
export function Stage1Audition() {
  const router = useRouter()
  const [activeEngine, setActiveEngine] = React.useState<"bezier" | "spring">(
    "bezier"
  )
  const [activePresetId, setActivePresetId] = React.useState<string>("ease")
  const [customCurves, setCustomCurves] = React.useState<CustomEase[]>(
    INITIAL_CUSTOM_CURVES
  )
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
  const scrubProgressRef = React.useRef(scrubProgress)

  React.useEffect(() => {
    scrubProgressRef.current = scrubProgress
  }, [scrubProgress])
  const [isScrubbing, setIsScrubbing] = React.useState<boolean>(false)
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

  const activePresetMeta = getActivePresetMeta(
    customCurves,
    activePresetId,
    activeEngine
  )

  const currentEasedA = React.useMemo(() => {
    return getEasedValue(scrubProgress, activePresetMeta, isReducedMotion)
  }, [scrubProgress, activePresetMeta, isReducedMotion])

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
        setIsPlaying((p) => {
          if (!p && scrubProgressRef.current >= 100) {
            setAnimKey((k) => k + 1)
            setScrubProgress(0)
          }
          return !p
        })
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

  React.useEffect(() => {
    if (!isPlaying || isScrubbing) return

    let animationFrameId: number
    const totalDuration = activePresetMeta.duration / playbackSpeed
    const pauseDuration = 600

    const currentProgress = scrubProgressRef.current
    const currentElapsed =
      currentProgress >= 100 ? 0 : (currentProgress / 100) * totalDuration
    let startTime = performance.now() - currentElapsed

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

  return (
    <div className="flex h-dvh w-full gap-2 overflow-hidden bg-muted p-2 font-sans select-none">
      {/* =====================================================================
          LEFT FLANK: 280px Hug-Fill-Hug (Blocks 1, 2, 3)
          ===================================================================== */}
      <aside className="flex w-[280px] shrink-0 flex-col gap-2">
        <BrandSlab />
        <PresetCatalog
          activeEngine={activeEngine}
          setActiveEngine={setActiveEngine}
          activePresetId={activePresetId}
          setActivePresetId={setActivePresetId}
          customCurves={customCurves}
          setCustomCurves={setCustomCurves}
          navStack={navStack}
          setNavStack={setNavStack}
          resolveEase={resolveEase}
          triggerSingleAnimation={triggerSingleAnimation}
        />
      </aside>

      {/* =====================================================================
          CENTER STAGE: Hero Canvas (Block 4) & Master Console (Block 6)
          ===================================================================== */}
      <main className="flex min-w-0 flex-1 flex-col gap-2">
        <PreviewTheater
          previewWidth={previewWidth}
          setPreviewWidth={setPreviewWidth}
          viewportMode={viewportMode}
          setViewportMode={setViewportMode}
          handleViewportChange={handleViewportChange}
          animKey={animKey}
          activeScenarioKey={activeScenarioKey}
          setActiveScenarioKey={setActiveScenarioKey}
          currentEasedA={currentEasedA}
          buttonPressed={buttonPressed}
          setButtonPressed={setButtonPressed}
          isReducedMotion={isReducedMotion}
          triggerSingleAnimation={triggerSingleAnimation}
          isTimelineOpen={isTimelineOpen}
          setIsTimelineOpen={setIsTimelineOpen}
          compareQueue={compareQueue}
          isCurrentCurveQueued={isCurrentCurveQueued}
          toggleCompareQueue={toggleCompareQueue}
        />

        <TimelineConsole
          isTimelineOpen={isTimelineOpen}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          activePresetMeta={activePresetMeta}
          scrubProgress={scrubProgress}
          setScrubProgress={setScrubProgress}
          setIsScrubbing={setIsScrubbing}
          isLooping={isLooping}
          setIsLooping={setIsLooping}
          playbackSpeed={playbackSpeed}
          setPlaybackSpeed={setPlaybackSpeed}
          isReducedMotion={isReducedMotion}
          setIsReducedMotion={setIsReducedMotion}
          setAnimKey={setAnimKey}
        />
      </main>

      {/* =====================================================================
          RIGHT FLANK: 300px Fixed Width (Blocks 7 & 8)
          ===================================================================== */}
      <aside className="flex w-[300px] shrink-0 flex-col gap-2">
        <ExportSlab
          activePresetMeta={activePresetMeta}
          exportFramework={exportFramework}
          setExportFramework={setExportFramework}
          hasCopiedToken={hasCopiedToken}
          handleCopyToken={handleCopyToken}
          getExportSnippet={getExportSnippet}
        />

        <CompareQueueSlab
          compareQueue={compareQueue}
          setCompareQueue={setCompareQueue}
          activePresetId={activePresetId}
          isCurrentCurveQueued={isCurrentCurveQueued}
          toggleCompareQueue={toggleCompareQueue}
          resolveEase={resolveEase}
        />
      </aside>
    </div>
  )
}
