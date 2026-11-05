"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { ViewportMode } from "@/components/previewer/resizable-playground"
import {
  ArchetypeKey,
  CustomEase,
  StackLevel,
} from "@/components/stages/stage-1/stage-1-types"
import { INITIAL_CUSTOM_CURVES } from "@/components/stages/stage-1/stage-1-curves"

export type { ViewportMode }

function getInitialPersistedState<T>(key: string, fallback: T): T {
  if (typeof window !== "undefined") {
    if (key === "isTimelineOpen") {
      const match = document.cookie.match(
        /(?:^|;\s*)ease_timeline_open=([^;]*)/
      )
      if (match) {
        return (match[1] === "true") as unknown as T
      }
    }
    try {
      const raw = localStorage.getItem("satisium-ease-stage1-v1")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.state && parsed.state[key] !== undefined) {
          return parsed.state[key]
        }
      }
    } catch {
      // fallback to default
    }
  }
  return fallback
}

interface Stage1Store {
  // Column 1 (Left Flank) Persistent Ergonomics
  activeEngine: "bezier" | "spring"
  activePresetId: string
  customCurves: CustomEase[]
  navStack: StackLevel

  // Column 2 (Center Stage) Persistent Ergonomics
  isTimelineOpen: boolean
  viewportMode: ViewportMode
  previewWidth: number | string
  activeScenarioKey: ArchetypeKey
  playbackSpeed: number
  isLooping: boolean
  isReducedMotion: boolean

  // Column 3 (Right Flank) Persistent Ergonomics
  compareQueue: string[]

  // Column 1 Actions
  setActiveEngine: (engine: "bezier" | "spring") => void
  setActivePresetId: (id: string) => void
  setCustomCurves: (
    curves: CustomEase[] | ((prev: CustomEase[]) => CustomEase[])
  ) => void
  setNavStack: (nav: StackLevel | ((prev: StackLevel) => StackLevel)) => void

  // Column 2 Actions
  setIsTimelineOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setViewportMode: (mode: ViewportMode) => void
  setPreviewWidth: (w: number | string) => void
  setActiveScenarioKey: (key: ArchetypeKey) => void
  setPlaybackSpeed: (speed: number) => void
  setIsLooping: (looping: boolean | ((prev: boolean) => boolean)) => void
  setIsReducedMotion: (reduced: boolean | ((prev: boolean) => boolean)) => void

  // Column 3 Actions
  setCompareQueue: (updater: string[] | ((prev: string[]) => string[])) => void
}

export const useStage1Store = create<Stage1Store>()(
  persist(
    (set) => ({
      // --- Column 1 Defaults (Hydrated synchronously on client, safe fallback on server) ---
      activeEngine: getInitialPersistedState("activeEngine", "bezier"),
      activePresetId: getInitialPersistedState("activePresetId", "ease"),
      customCurves: getInitialPersistedState(
        "customCurves",
        INITIAL_CUSTOM_CURVES
      ),
      navStack: getInitialPersistedState("navStack", { level: 0 }),

      // --- Column 2 Defaults (Hydrated synchronously on client, safe fallback on server) ---
      isTimelineOpen: getInitialPersistedState("isTimelineOpen", false),
      viewportMode: getInitialPersistedState("viewportMode", "desktop"),
      previewWidth: getInitialPersistedState("previewWidth", "100%"),
      activeScenarioKey: getInitialPersistedState(
        "activeScenarioKey",
        "button"
      ),
      playbackSpeed: getInitialPersistedState("playbackSpeed", 1),
      isLooping: getInitialPersistedState("isLooping", false),
      isReducedMotion: getInitialPersistedState("isReducedMotion", false),

      // --- Column 3 Defaults ---
      compareQueue: getInitialPersistedState("compareQueue", []),

      // --- Column 1 Setters ---
      setActiveEngine: (activeEngine) => set({ activeEngine }),
      setActivePresetId: (activePresetId) => set({ activePresetId }),
      setCustomCurves: (updater) =>
        set((state) => ({
          customCurves:
            typeof updater === "function"
              ? updater(state.customCurves)
              : updater,
        })),
      setNavStack: (updater) =>
        set((state) => ({
          navStack:
            typeof updater === "function" ? updater(state.navStack) : updater,
        })),

      // --- Column 2 Setters ---
      setIsTimelineOpen: (updater) =>
        set((state) => {
          const next =
            typeof updater === "function"
              ? updater(state.isTimelineOpen)
              : updater
          if (typeof document !== "undefined") {
            try {
              document.cookie = `ease_timeline_open=${next}; path=/; max-age=31536000; SameSite=Lax`
            } catch {
              // ignore
            }
          }
          return { isTimelineOpen: next }
        }),
      setViewportMode: (viewportMode) => set({ viewportMode }),
      setPreviewWidth: (previewWidth) => set({ previewWidth }),
      setActiveScenarioKey: (activeScenarioKey) => set({ activeScenarioKey }),
      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
      setIsLooping: (updater) =>
        set((state) => ({
          isLooping:
            typeof updater === "function" ? updater(state.isLooping) : updater,
        })),
      setIsReducedMotion: (updater) =>
        set((state) => ({
          isReducedMotion:
            typeof updater === "function"
              ? updater(state.isReducedMotion)
              : updater,
        })),

      // --- Column 3 Setters ---
      setCompareQueue: (updater) =>
        set((state) => ({
          compareQueue:
            typeof updater === "function"
              ? updater(state.compareQueue)
              : updater,
        })),
    }),
    {
      name: "satisium-ease-stage1-v1",
      storage: createJSONStorage(() => localStorage),
      // Persist deliberate workstation setup
      partialize: (state) => ({
        activeEngine: state.activeEngine,
        activePresetId: state.activePresetId,
        customCurves: state.customCurves,
        navStack: state.navStack,
        isTimelineOpen: state.isTimelineOpen,
        viewportMode: state.viewportMode,
        previewWidth: state.previewWidth,
        activeScenarioKey: state.activeScenarioKey,
        playbackSpeed: state.playbackSpeed,
        isLooping: state.isLooping,
        isReducedMotion: state.isReducedMotion,
        compareQueue: state.compareQueue,
      }),
    }
  )
)
