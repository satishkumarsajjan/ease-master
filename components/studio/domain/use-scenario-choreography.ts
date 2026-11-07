"use client"

import * as React from "react"
import { useStudioStore } from "@/store/useStudioStore"
import { resolveEase, getEasedValue } from "./studio-kinetics"
import { EaseDossier, ArchetypeKey } from "./studio-types"

export interface ScenarioChoreography {
  scenarioKey: ArchetypeKey
  isOpen: boolean
  phase: "enter" | "exit"
  progress: number
  easedValue: number
  enterCurve: EaseDossier
  exitCurve: EaseDossier
  activeCurve: EaseDossier
  open: () => void
  close: () => void
  toggle: () => void
  assignEnterCurve: (curveId: string) => void
  assignExitCurve: (curveId: string) => void
}

/**
 * Hook for self-contained component scenarios in the Preview Theater.
 * Connects the active scenario to the studio's kinetics engine, resolving
 * distinct Enter and Exit curves without polluting the underlying curve model.
 */
export function useScenarioChoreography(): ScenarioChoreography {
  const activeScenarioKey = useStudioStore((s) => s.activeScenarioKey)
  const activeCurveId = useStudioStore((s) => s.activeCurveId)
  const customCurves = useStudioStore((s) => s.customCurves)
  const scenarioOpen = useStudioStore((s) => s.scenarioOpen)
  const scenarioPhase = useStudioStore((s) => s.scenarioPhase)
  const scenarioSlots = useStudioStore((s) => s.scenarioSlots)
  const activeSlot = useStudioStore((s) => s.activeSlot)
  const scrubProgress = useStudioStore((s) => s.scrubProgress)
  const isReducedMotion = useStudioStore((s) => s.isReducedMotion)
  const openScenario = useStudioStore((s) => s.openScenario)
  const closeScenario = useStudioStore((s) => s.closeScenario)
  const toggleScenario = useStudioStore((s) => s.toggleScenario)
  const assignCurveToSlot = useStudioStore((s) => s.assignCurveToSlot)

  // 1. Resolve Entrance curve
  const currentSlot = scenarioSlots[activeScenarioKey]
  const enterCurveId = currentSlot?.enterId || activeCurveId
  const exitCurveId = currentSlot?.exitId
  const enterCurve = React.useMemo(() => {
    return resolveEase(enterCurveId, customCurves)
  }, [enterCurveId, customCurves])

  // 2. Resolve Exit curve
  const exitCurve = React.useMemo(() => {
    if (exitCurveId) {
      return resolveEase(exitCurveId, customCurves)
    }
    if (activeSlot === "exit") {
      return resolveEase(activeCurveId, customCurves)
    }
    // Auto-discover child exit variant if present
    const exitVariant = enterCurve.variants?.find(
      (v) =>
        v.id.includes("exit") ||
        v.name.toLowerCase().includes("exit") ||
        v.name.toLowerCase().includes("dismiss")
    )
    if (exitVariant) {
      return resolveEase(exitVariant.id, customCurves)
    }
    // Fallback: symmetrical curve
    return enterCurve
  }, [exitCurveId, activeSlot, activeCurveId, enterCurve, customCurves])

  // 3. Current active curve driving motion right now
  const activeMotionCurve = scenarioPhase === "enter" ? enterCurve : exitCurve

  // 4. Solve mathematical eased value
  const easedValue = React.useMemo(() => {
    return getEasedValue(scrubProgress, activeMotionCurve, isReducedMotion)
  }, [scrubProgress, activeMotionCurve, isReducedMotion])

  const assignEnterCurve = React.useCallback(
    (curveId: string) => {
      assignCurveToSlot(curveId, "enter", activeScenarioKey)
    },
    [assignCurveToSlot, activeScenarioKey]
  )

  const assignExitCurve = React.useCallback(
    (curveId: string) => {
      assignCurveToSlot(curveId, "exit", activeScenarioKey)
    },
    [assignCurveToSlot, activeScenarioKey]
  )

  return {
    scenarioKey: activeScenarioKey,
    isOpen: scenarioOpen,
    phase: scenarioPhase,
    progress: scrubProgress,
    easedValue,
    enterCurve,
    exitCurve,
    activeCurve: activeMotionCurve,
    open: openScenario,
    close: closeScenario,
    toggle: toggleScenario,
    assignEnterCurve,
    assignExitCurve,
  }
}
