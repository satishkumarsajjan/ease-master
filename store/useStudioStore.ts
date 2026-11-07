"use client"

import * as React from "react"
import { createStore, useStore } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import {
  CustomEase,
  StudioMode,
  EngineType,
  ArchetypeKey,
  StackLevel,
  EaseDossier,
  ViewportMode,
  StudioSessionCookie,
} from "@/components/studio/domain/studio-types"
import { INITIAL_CUSTOM_CURVES } from "@/components/studio/domain/studio-curves"
import {
  resolveEase,
  findCustomCurve,
} from "@/components/studio/domain/studio-kinetics"
import { BEZIER_PRESETS, SPRING_PRESETS } from "@/core/presets"

export type { ViewportMode, StudioSessionCookie }

export interface StudioState {
  // --- Persistent Workspace State ---
  mode: StudioMode
  activeCurveId: string
  activeEngine: EngineType
  customCurves: CustomEase[]
  navStack: StackLevel
  activeScenarioKey: ArchetypeKey
  viewportMode: ViewportMode
  previewWidth: number | string
  playbackSpeed: number
  isLooping: boolean
  isReducedMotion: boolean
  isTimelineOpen: boolean
  compareQueue: string[]
  benchmarkTargetId: string | null

  // --- Ephemeral Playback & Scrubbing State ---
  isPlaying: boolean
  scrubProgress: number
  animKey: number
  isScrubbing: boolean
  buttonPressed: boolean

  // --- Scenario Choreography State ---
  scenarioSlots: Record<string, { enterId?: string; exitId?: string }>
  activeSlot: "enter" | "exit"
  scenarioOpen: boolean
  scenarioPhase: "enter" | "exit"

  // --- Actions ---
  selectEase: (
    id: string,
    options?: { audition?: boolean; openSlide?: boolean }
  ) => void
  setMode: (mode: StudioMode) => void
  setNavStack: (navStack: StackLevel) => void
  setActiveScenarioKey: (key: ArchetypeKey) => void
  setViewportMode: (mode: ViewportMode) => void
  setPreviewWidth: (width: number | string) => void
  setPlaybackSpeed: (speed: number) => void
  setIsLooping: (loop: boolean) => void
  setIsReducedMotion: (reduced: boolean) => void
  setIsTimelineOpen: (open: boolean) => void
  toggleTimeline: () => void
  setIsPlaying: (playing: boolean) => void
  togglePlayback: () => void
  setScrubProgress: (progress: number) => void
  setIsScrubbing: (scrubbing: boolean) => void
  setButtonPressed: (pressed: boolean) => void
  triggerAudition: () => void
  addToCompare: (id: string) => void
  removeFromCompare: (id: string) => void
  toggleCompare: (id: string) => void
  clearCompareQueue: () => void
  setBenchmarkTarget: (id: string | null) => void
  forkCurve: (parentPresetId: string, customName?: string) => string
  forkFromCustom: (curveId: string, customName?: string) => string
  promoteVariantToRoot: (
    parentCurveId: string,
    variantId: string,
    newName?: string
  ) => string
  addVariant: (parentCurveId: string, variantName?: string) => string
  addFlavor: (
    parentCurveId: string,
    variantId: string,
    flavorName?: string
  ) => string
  renameCurve: (id: string, newName: string) => void
  deleteCustomCurve: (id: string) => void
  deleteVariant: (parentCurveId: string, variantId: string) => void
  deleteFlavor: (
    parentCurveId: string,
    variantId: string,
    flavorId: string
  ) => void
  updateCustomCurve: (updatedCurve: CustomEase) => void
  setActiveSlot: (slot: "enter" | "exit") => void
  assignCurveToSlot: (
    curveId: string,
    slot: "enter" | "exit",
    scenarioKey?: ArchetypeKey
  ) => void
  openScenario: () => void
  closeScenario: () => void
  toggleScenario: () => void
  setScenarioOpen: (open: boolean) => void
  setScenarioPhase: (phase: "enter" | "exit") => void
}

export function syncSessionCookie(patch: Partial<StudioSessionCookie>) {
  if (typeof document === "undefined") return
  try {
    let current: Partial<StudioSessionCookie> = {}
    const match = document.cookie.match(/(?:^|;\s*)ease_session=([^;]*)/)
    if (match) {
      try {
        current = JSON.parse(decodeURIComponent(match[1]))
      } catch {
        // ignore
      }
    }
    const merged = { ...current, ...patch }
    const encoded = encodeURIComponent(JSON.stringify(merged))
    document.cookie = `ease_session=${encoded}; path=/; max-age=31536000; SameSite=Lax`
    if (patch.timeline !== undefined) {
      document.cookie = `ease_timeline_open=${patch.timeline}; path=/; max-age=31536000; SameSite=Lax`
    }
  } catch {
    // ignore
  }
}

export interface CreateStudioStoreOptions {
  initialSession?: StudioSessionCookie
}

export const createStudioStore = (options?: CreateStudioStoreOptions) => {
  const session = options?.initialSession

  let initialCurveId = session?.curve ?? "modal-sheet"
  const isSpring = SPRING_PRESETS.some((p) => p.id === initialCurveId)
  const isBezier = BEZIER_PRESETS.some((p) => p.id === initialCurveId)
  const isCustom = INITIAL_CUSTOM_CURVES.some((c) => c.id === initialCurveId)

  if (!isSpring && !isBezier && !isCustom) {
    initialCurveId = "modal-sheet"
  }

  let initialEngine: EngineType = "bezier"
  if (isSpring) {
    initialEngine = "spring"
  } else if (isBezier) {
    initialEngine = "bezier"
  } else if (session?.engine) {
    initialEngine = session.engine
  }

  const initialTimeline = session?.timeline ?? false
  const initialScenario = session?.scenario ?? "modal"
  const initialViewport = session?.viewport ?? "desktop"
  const initialWidth =
    session?.width ??
    (initialViewport === "desktop"
      ? "100%"
      : initialViewport === "tablet"
        ? 768
        : 375)
  const initialMode = session?.mode ?? "audition"
  const initialNavStack: StackLevel =
    session?.navLevel === 1
      ? { level: 1, curveId: initialCurveId }
      : { level: 0 }

  return createStore<StudioState>()(
    persist(
      (set, get) => ({
        mode: initialMode,
        activeCurveId: initialCurveId,
        activeEngine: initialEngine,
        customCurves: INITIAL_CUSTOM_CURVES,
        navStack: initialNavStack,
        activeScenarioKey: initialScenario,
        viewportMode: initialViewport,
        previewWidth: initialWidth,
        playbackSpeed: 1,
        isLooping: false,
        isReducedMotion: false,
        isTimelineOpen: initialTimeline,
        compareQueue: [],
        benchmarkTargetId: null,

        // Ephemeral runtime
        isPlaying: false,
        scrubProgress: 0,
        animKey: 0,
        isScrubbing: false,
        buttonPressed: false,

        // Scenario choreography slots & state (Clean slate: zero hardcoded defaults)
        scenarioSlots: {
          modal: {},
        },
        activeSlot: "enter",
        scenarioOpen: false,
        scenarioPhase: "enter",

        selectEase: (id, opt) => {
          const dossier = resolveEase(id, get().customCurves)
          syncSessionCookie({ curve: dossier.id, engine: dossier.engine })
          const currentScenario = get().activeScenarioKey
          const currentSlot = get().activeSlot
          const prevScenarioSlot = get().scenarioSlots[currentScenario] || {}
          const nextSlots = {
            ...get().scenarioSlots,
            [currentScenario]: {
              ...prevScenarioSlot,
              [currentSlot === "enter" ? "enterId" : "exitId"]: dossier.id,
            },
          }
          set((state) => {
            const nextStack = opt?.openSlide
              ? ({ level: 1, curveId: dossier.id } as StackLevel)
              : state.navStack

            const nextPlayback = opt?.audition
              ? {
                  isPlaying: true,
                  scrubProgress: 0,
                  animKey: state.animKey + 1,
                }
              : {}

            return {
              activeCurveId: dossier.id,
              activeEngine: dossier.engine,
              scenarioSlots: nextSlots,
              navStack: nextStack,
              ...nextPlayback,
            }
          })
        },

        setMode: (mode) => {
          syncSessionCookie({ mode })
          set({ mode })
        },

        setNavStack: (navStack) => {
          syncSessionCookie({ navLevel: navStack.level })
          set({ navStack })
        },

        setActiveScenarioKey: (activeScenarioKey) => {
          syncSessionCookie({ scenario: activeScenarioKey })
          // If the new scenario has a configured enterId, switch activeCurveId to match
          const slot = get().scenarioSlots[activeScenarioKey]
          if (slot?.enterId) {
            const dossier = resolveEase(slot.enterId, get().customCurves)
            syncSessionCookie({ curve: dossier.id, engine: dossier.engine })
            set({
              activeScenarioKey,
              activeCurveId: dossier.id,
              activeEngine: dossier.engine,
              scenarioOpen: false,
              scenarioPhase: "enter",
              scrubProgress: 0,
            })
          } else {
            set({
              activeScenarioKey,
              scenarioOpen: false,
              scenarioPhase: "enter",
              scrubProgress: 0,
            })
          }
        },

        setActiveSlot: (activeSlot) => {
          const scenarioKey = get().activeScenarioKey
          const slot = get().scenarioSlots[scenarioKey]
          const targetId = activeSlot === "enter" ? slot?.enterId : slot?.exitId
          if (targetId) {
            const dossier = resolveEase(targetId, get().customCurves)
            syncSessionCookie({ curve: dossier.id, engine: dossier.engine })
            set({
              activeSlot,
              activeCurveId: dossier.id,
              activeEngine: dossier.engine,
            })
          } else {
            set({ activeSlot })
          }
        },

        assignCurveToSlot: (curveId, slot, scenarioKey) => {
          const targetKey = scenarioKey ?? get().activeScenarioKey
          const prev = get().scenarioSlots[targetKey] || {}
          const nextSlots = {
            ...get().scenarioSlots,
            [targetKey]: {
              ...prev,
              [slot === "enter" ? "enterId" : "exitId"]: curveId,
            },
          }
          const dossier = resolveEase(curveId, get().customCurves)
          syncSessionCookie({ curve: dossier.id, engine: dossier.engine })
          set({
            scenarioSlots: nextSlots,
            activeCurveId: dossier.id,
            activeEngine: dossier.engine,
            activeSlot: slot,
          })
        },

        openScenario: () => {
          set((s) => ({
            scenarioOpen: true,
            scenarioPhase: "enter",
            isPlaying: true,
            scrubProgress: 0,
            animKey: s.animKey + 1,
          }))
        },

        closeScenario: () => {
          set((s) => ({
            scenarioOpen: false,
            scenarioPhase: "exit",
            isPlaying: true,
            scrubProgress: 0,
            animKey: s.animKey + 1,
          }))
        },

        toggleScenario: () => {
          if (get().scenarioOpen) {
            get().closeScenario()
          } else {
            get().openScenario()
          }
        },

        setScenarioOpen: (scenarioOpen) => set({ scenarioOpen }),
        setScenarioPhase: (scenarioPhase) => set({ scenarioPhase }),

        setViewportMode: (viewportMode) => {
          syncSessionCookie({ viewport: viewportMode })
          set({ viewportMode })
        },

        setPreviewWidth: (previewWidth) => {
          syncSessionCookie({ width: previewWidth })
          set({ previewWidth })
        },

        setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),

        setIsLooping: (isLooping) => set({ isLooping }),

        setIsReducedMotion: (isReducedMotion) => set({ isReducedMotion }),

        setIsTimelineOpen: (isTimelineOpen) => {
          syncSessionCookie({ timeline: isTimelineOpen })
          set({ isTimelineOpen })
        },

        toggleTimeline: () => {
          const next = !get().isTimelineOpen
          syncSessionCookie({ timeline: next })
          set({ isTimelineOpen: next })
        },

        setIsPlaying: (isPlaying) => set({ isPlaying }),

        togglePlayback: () => {
          const { isPlaying, scrubProgress, animKey } = get()
          if (isPlaying) {
            set({ isPlaying: false })
          } else {
            const reset = scrubProgress >= 99.5
            set({
              isPlaying: true,
              scrubProgress: reset ? 0 : scrubProgress,
              animKey: reset ? animKey + 1 : animKey,
            })
          }
        },

        setScrubProgress: (scrubProgress) => set({ scrubProgress }),

        setIsScrubbing: (isScrubbing) => set({ isScrubbing }),

        setButtonPressed: (buttonPressed) => set({ buttonPressed }),

        triggerAudition: () => {
          set((state) => ({
            isPlaying: true,
            scrubProgress: 0,
            animKey: state.animKey + 1,
          }))
        },

        addToCompare: (id) => {
          const { compareQueue } = get()
          if (!compareQueue.includes(id)) {
            set({ compareQueue: [...compareQueue, id] })
          }
        },

        removeFromCompare: (id) => {
          const { compareQueue } = get()
          set({ compareQueue: compareQueue.filter((item) => item !== id) })
        },

        toggleCompare: (id) => {
          const { compareQueue } = get()
          if (compareQueue.includes(id)) {
            set({ compareQueue: compareQueue.filter((item) => item !== id) })
          } else {
            set({ compareQueue: [...compareQueue, id] })
          }
        },

        clearCompareQueue: () => set({ compareQueue: [] }),

        setBenchmarkTarget: (benchmarkTargetId) => set({ benchmarkTargetId }),

        forkCurve: (parentPresetId, customName) => {
          const base = resolveEase(parentPresetId, get().customCurves)
          const newId = `custom-${Date.now().toString(36)}`
          const name = customName || `${base.name} (Fork)`
          const newCurve: CustomEase = {
            id: newId,
            name,
            parentPreset: base.name,
            engine: base.engine,
            values: base.values,
            bezier: base.bezier,
            spring: base.spring,
            duration: base.duration,
            guidance: base.kinetics.choreographyLaw,
            targetSettle: base.kinetics.timingSweetSpot,
            desc: `Forked from ${base.name}`,
            useCases: [...base.useCases],
          }

          set((state) => ({
            customCurves: [newCurve, ...state.customCurves],
            activeCurveId: newId,
            activeEngine: newCurve.engine,
            navStack: { level: 1, curveId: newId },
            isPlaying: true,
            scrubProgress: 0,
            animKey: state.animKey + 1,
          }))

          syncSessionCookie({ curve: newId, engine: newCurve.engine })
          return newId
        },

        addVariant: (parentCurveId, variantName) => {
          const curves = get().customCurves
          const parent = findCustomCurve(parentCurveId, curves)
          if (!parent) return parentCurveId

          const variantId = `${parentCurveId}-var-${Date.now().toString(36)}`
          const name =
            variantName || `Variant ${(parent.variants?.length || 0) + 1}`
          const newVariant: CustomEase = {
            id: variantId,
            name,
            parentPreset: parent.name,
            engine: parent.engine,
            values: parent.values,
            bezier: parent.bezier,
            spring: parent.spring,
            duration: parent.duration,
            desc: `Variant of ${parent.name}`,
          }

          const updateRecursive = (list: CustomEase[]): CustomEase[] => {
            return list.map((c) => {
              if (c.id === parentCurveId) {
                return {
                  ...c,
                  variants: [...(c.variants || []), newVariant],
                }
              }
              if (c.variants && c.variants.length > 0) {
                return {
                  ...c,
                  variants: updateRecursive(c.variants),
                }
              }
              return c
            })
          }

          set((state) => ({
            customCurves: updateRecursive(state.customCurves),
            activeCurveId: variantId,
            activeEngine: newVariant.engine,
            navStack: { level: 2, curveId: parentCurveId, variantId },
            isPlaying: true,
            scrubProgress: 0,
            animKey: state.animKey + 1,
          }))

          syncSessionCookie({ curve: variantId, engine: newVariant.engine })
          return variantId
        },

        addFlavor: (parentCurveId, variantId, flavorName) => {
          const curves = get().customCurves
          const parent = findCustomCurve(parentCurveId, curves)
          const variant = parent?.variants?.find((v) => v.id === variantId)
          if (!parent || !variant) return variantId

          const flavorId = `${variantId}-f${(variant.variants?.length || 0) + 1}`
          const name =
            flavorName || `Flavor ${(variant.variants?.length || 0) + 1}`
          const newFlavor: CustomEase = {
            id: flavorId,
            name,
            parentPreset: variant.name,
            engine: variant.engine,
            values: variant.values,
            bezier: variant.bezier,
            spring: variant.spring,
            duration: variant.duration,
            desc: `Calibrated flavor of ${variant.name}`,
          }

          const updateRecursive = (list: CustomEase[]): CustomEase[] => {
            return list.map((c) => {
              if (c.id === parentCurveId) {
                return {
                  ...c,
                  variants: (c.variants || []).map((v) =>
                    v.id === variantId
                      ? { ...v, variants: [...(v.variants || []), newFlavor] }
                      : v
                  ),
                }
              }
              if (c.variants && c.variants.length > 0) {
                return {
                  ...c,
                  variants: updateRecursive(c.variants),
                }
              }
              return c
            })
          }

          set((state) => ({
            customCurves: updateRecursive(state.customCurves),
            activeCurveId: flavorId,
            activeEngine: newFlavor.engine,
            isPlaying: true,
            scrubProgress: 0,
            animKey: state.animKey + 1,
          }))

          syncSessionCookie({ curve: flavorId, engine: newFlavor.engine })
          return flavorId
        },

        updateCustomCurve: (updatedCurve) => {
          const updateRecursive = (list: CustomEase[]): CustomEase[] => {
            return list.map((c) => {
              if (c.id === updatedCurve.id) {
                return { ...c, ...updatedCurve }
              }
              if (c.variants && c.variants.length > 0) {
                return {
                  ...c,
                  variants: updateRecursive(c.variants),
                }
              }
              return c
            })
          }

          set((state) => ({
            customCurves: updateRecursive(state.customCurves),
          }))
        },

        forkFromCustom: (curveId, customName) => {
          return get().forkCurve(curveId, customName)
        },

        promoteVariantToRoot: (parentCurveId, variantId, newName) => {
          const parent = findCustomCurve(parentCurveId, get().customCurves)
          const variant = parent?.variants?.find((v) => v.id === variantId)
          if (!parent || !variant) return variantId

          const newId = `custom-${Date.now().toString(36)}`
          const name = newName || `${variant.name}`
          const promotedCurve: CustomEase = {
            id: newId,
            name,
            parentPreset: `${parent.name} (Variant)`,
            engine: variant.engine,
            values: variant.values,
            bezier: variant.bezier,
            spring: variant.spring,
            duration: variant.duration,
            desc: variant.desc || `Promoted from ${parent.name} variant`,
            guidance: parent.guidance,
            targetSettle: parent.targetSettle,
            useCases: parent.useCases ? [...parent.useCases] : [],
            variants: variant.variants ? [...variant.variants] : [],
          }

          set((state) => ({
            customCurves: [promotedCurve, ...state.customCurves],
            activeCurveId: newId,
            activeEngine: promotedCurve.engine,
            navStack: { level: 1, curveId: newId },
            isPlaying: true,
            scrubProgress: 0,
            animKey: state.animKey + 1,
          }))

          syncSessionCookie({ curve: newId, engine: promotedCurve.engine })
          return newId
        },

        renameCurve: (id, newName) => {
          const trimmed = newName.trim()
          if (!trimmed) return

          const renameRecursive = (list: CustomEase[]): CustomEase[] => {
            return list.map((c) => {
              if (c.id === id) {
                return { ...c, name: trimmed }
              }
              if (c.variants && c.variants.length > 0) {
                return {
                  ...c,
                  variants: renameRecursive(c.variants),
                }
              }
              return c
            })
          }

          set((state) => ({
            customCurves: renameRecursive(state.customCurves),
          }))
        },

        deleteCustomCurve: (id) => {
          const collectCurveIds = (curve: CustomEase): string[] => {
            const ids = [curve.id]
            if (curve.variants && curve.variants.length > 0) {
              for (const v of curve.variants) {
                ids.push(...collectCurveIds(v))
              }
            }
            return ids
          }

          const targetCurve = get().customCurves.find((c) => c.id === id)
          const deletedIds = targetCurve ? collectCurveIds(targetCurve) : [id]
          const nextCustom = get().customCurves.filter((c) => c.id !== id)

          let nextActiveId = get().activeCurveId
          let nextActiveEngine = get().activeEngine

          if (deletedIds.includes(nextActiveId)) {
            if (nextCustom.length > 0) {
              nextActiveId = nextCustom[0].id
              nextActiveEngine = nextCustom[0].engine
            } else {
              nextActiveId = "modal-sheet"
              nextActiveEngine = "bezier"
            }
            syncSessionCookie({ curve: nextActiveId, engine: nextActiveEngine })
          }

          let nextNavStack = get().navStack
          if (nextNavStack.level !== 0 && nextNavStack.curveId === id) {
            nextNavStack = { level: 0 }
          }

          set({
            customCurves: nextCustom,
            activeCurveId: nextActiveId,
            activeEngine: nextActiveEngine,
            navStack: nextNavStack,
          })
        },

        deleteVariant: (parentCurveId, variantId) => {
          const collectCurveIds = (curve: CustomEase): string[] => {
            const ids = [curve.id]
            if (curve.variants && curve.variants.length > 0) {
              for (const v of curve.variants) {
                ids.push(...collectCurveIds(v))
              }
            }
            return ids
          }

          const parent = findCustomCurve(parentCurveId, get().customCurves)
          const targetVariant = parent?.variants?.find(
            (v) => v.id === variantId
          )
          const deletedIds = targetVariant
            ? collectCurveIds(targetVariant)
            : [variantId]

          const updateRecursive = (list: CustomEase[]): CustomEase[] => {
            return list.map((c) => {
              if (c.id === parentCurveId) {
                return {
                  ...c,
                  variants: (c.variants || []).filter(
                    (v) => v.id !== variantId
                  ),
                }
              }
              if (c.variants && c.variants.length > 0) {
                return {
                  ...c,
                  variants: updateRecursive(c.variants),
                }
              }
              return c
            })
          }

          const nextCustom = updateRecursive(get().customCurves)

          let nextActiveId = get().activeCurveId
          let nextActiveEngine = get().activeEngine

          if (deletedIds.includes(nextActiveId)) {
            const parentDossier = resolveEase(parentCurveId, nextCustom)
            nextActiveId = parentDossier.id
            nextActiveEngine = parentDossier.engine
            syncSessionCookie({ curve: nextActiveId, engine: nextActiveEngine })
          }

          let nextNavStack = get().navStack
          if (
            nextNavStack.level === 2 &&
            nextNavStack.variantId === variantId
          ) {
            nextNavStack = { level: 1, curveId: parentCurveId }
          }

          set({
            customCurves: nextCustom,
            activeCurveId: nextActiveId,
            activeEngine: nextActiveEngine,
            navStack: nextNavStack,
          })
        },

        deleteFlavor: (parentCurveId, variantId, flavorId) => {
          const updateRecursive = (list: CustomEase[]): CustomEase[] => {
            return list.map((c) => {
              if (c.id === parentCurveId) {
                return {
                  ...c,
                  variants: (c.variants || []).map((v) =>
                    v.id === variantId
                      ? {
                          ...v,
                          variants: (v.variants || []).filter(
                            (f) => f.id !== flavorId
                          ),
                        }
                      : v
                  ),
                }
              }
              if (c.variants && c.variants.length > 0) {
                return {
                  ...c,
                  variants: updateRecursive(c.variants),
                }
              }
              return c
            })
          }

          const nextCustom = updateRecursive(get().customCurves)

          let nextActiveId = get().activeCurveId
          let nextActiveEngine = get().activeEngine

          if (nextActiveId === flavorId) {
            const variantDossier = resolveEase(variantId, nextCustom)
            nextActiveId = variantDossier.id
            nextActiveEngine = variantDossier.engine
            syncSessionCookie({ curve: nextActiveId, engine: nextActiveEngine })
          }

          set({
            customCurves: nextCustom,
            activeCurveId: nextActiveId,
            activeEngine: nextActiveEngine,
          })
        },
      }),
      {
        name: "satisium-ease-studio-v1",
        storage: createJSONStorage(() =>
          typeof window !== "undefined"
            ? localStorage
            : {
                getItem: () => null,
                setItem: () => {},
                removeItem: () => {},
              }
        ),
        merge: (persistedState: unknown, currentState: StudioState) => {
          const persisted = (persistedState as Partial<StudioState>) || {}
          return {
            ...currentState,
            ...persisted,
            // Guaranteed adherence to cookie session over stale localStorage
            activeCurveId:
              session?.curve ??
              persisted.activeCurveId ??
              currentState.activeCurveId,
            activeEngine:
              session?.engine ??
              (session?.curve &&
              SPRING_PRESETS.some((p) => p.id === session.curve)
                ? "spring"
                : (persisted.activeEngine ?? currentState.activeEngine)),
            isTimelineOpen:
              session?.timeline !== undefined
                ? session.timeline
                : (persisted.isTimelineOpen ?? currentState.isTimelineOpen),
            activeScenarioKey:
              session?.scenario ??
              persisted.activeScenarioKey ??
              currentState.activeScenarioKey,
            viewportMode:
              session?.viewport ??
              persisted.viewportMode ??
              currentState.viewportMode,
            previewWidth:
              session?.width ??
              persisted.previewWidth ??
              currentState.previewWidth,
          }
        },
        partialize: (state) => ({
          mode: state.mode,
          activeCurveId: state.activeCurveId,
          activeEngine: state.activeEngine,
          customCurves: state.customCurves,
          navStack: state.navStack,
          activeScenarioKey: state.activeScenarioKey,
          viewportMode: state.viewportMode,
          previewWidth: state.previewWidth,
          playbackSpeed: state.playbackSpeed,
          isLooping: state.isLooping,
          isReducedMotion: state.isReducedMotion,
          isTimelineOpen: state.isTimelineOpen,
          compareQueue: state.compareQueue,
          benchmarkTargetId: state.benchmarkTargetId,
          scenarioSlots: state.scenarioSlots,
          activeSlot: state.activeSlot,
        }),
      }
    )
  )
}

import { StudioStoreContext, type StudioStoreApi } from "./studio-context"

export type { StudioStoreApi }
export { StudioStoreContext }

export const defaultStudioStore = createStudioStore()
let activeStoreRef: StudioStoreApi = defaultStudioStore

export function setActiveStore(store: StudioStoreApi) {
  activeStoreRef = store
}

export function useStudioStore<T>(selector: (state: StudioState) => T): T {
  const contextStore = React.useContext(StudioStoreContext)
  const store = contextStore ?? defaultStudioStore
  return useStore(store, selector)
}

useStudioStore.getState = () =>
  (activeStoreRef ?? defaultStudioStore).getState()
useStudioStore.setState = ((...args: unknown[]) =>
  (activeStoreRef ?? defaultStudioStore).setState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(args as [any])
  )) as typeof defaultStudioStore.setState
useStudioStore.subscribe = (
  listener: (state: StudioState, prevState: StudioState) => void
) => (activeStoreRef ?? defaultStudioStore).subscribe(listener)

export function useActiveDossier(): EaseDossier {
  const activeCurveId = useStudioStore((s) => s.activeCurveId)
  const customCurves = useStudioStore((s) => s.customCurves)
  return resolveEase(activeCurveId, customCurves)
}
