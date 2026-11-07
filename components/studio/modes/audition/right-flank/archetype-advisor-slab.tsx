"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useStudioStore } from "@/store/useStudioStore"
import { BEST_PRACTICES, BestPracticeSpec } from "./archetype-laws"

export function ArchetypeAdvisorSlab({ className }: { className?: string }) {
  const activePresetId = useStudioStore((s) => s.activeCurveId)
  const activeEngine = useStudioStore((s) => s.activeEngine)
  const activeScenarioKey = useStudioStore((s) => s.activeScenarioKey)
  const scenarioSlots = useStudioStore((s) => s.scenarioSlots)
  const activeSlot = useStudioStore((s) => s.activeSlot)
  const selectEase = useStudioStore((s) => s.selectEase)
  const assignCurveToSlot = useStudioStore((s) => s.assignCurveToSlot)

  const currentSlot = scenarioSlots[activeScenarioKey]
  const spec: BestPracticeSpec =
    BEST_PRACTICES[activeScenarioKey] ?? BEST_PRACTICES.modal

  return (
    <section
      aria-label="Best Practices"
      className={cn(
        "no-scrollbar flex min-h-0 flex-1 flex-col rounded-[20px] bg-background p-4 transition-colors select-none",
        className
      )}
    >
      {/* Header: Title + Active Component Badge + Engine Tag */}
      <div className="flex shrink-0 items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="font-heading text-xs font-semibold text-foreground">
            Best Practices
          </span>
          <span className="rounded-[5px] bg-secondary px-1.5 py-0.5 font-sans text-[10px] font-medium text-foreground">
            {spec.name}
          </span>
        </div>

        <span className="font-sans text-[10px] text-muted-foreground">
          {activeEngine === "bezier" ? "Bézier" : "Spring"}
        </span>
      </div>

      {/* Motion Guideline: Honest, crisp, legible sentence */}
      <div className="pb-3.5">
        <p className="font-sans text-xs leading-relaxed text-muted-foreground">
          {spec.guideline}
        </p>
      </div>

      {/* Target Specs: Clean key-value inspector */}
      <div className="flex flex-col gap-2 rounded-[12px] bg-secondary p-3">
        <div className="flex items-center justify-between font-sans text-xs">
          <span className="text-muted-foreground">Target Duration</span>
          <span className="font-heading font-medium text-foreground">
            {spec.targetDuration}
          </span>
        </div>

        <div className="flex items-center justify-between font-sans text-xs">
          <span className="text-muted-foreground">Bounce</span>
          <span className="font-heading font-medium text-foreground">
            {spec.bounce}
          </span>
        </div>
      </div>

      {/* Dual Recommendations for Lifecycle Components (Entrance & Exit) */}
      {spec.recommendedIn && spec.recommendedOut ? (
        <div className="mt-auto flex flex-col gap-3 pt-2">
          {/* Entrance Section */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs font-medium text-foreground">
                Entrance Physics (In)
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                Deceleration
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {spec.recommendedIn.map((rec) => {
                const isAssigned =
                  currentSlot?.enterId === rec.id ||
                  (!currentSlot?.enterId &&
                    activePresetId === rec.id &&
                    activeSlot === "enter")

                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => {
                      assignCurveToSlot(rec.id, "enter", activeScenarioKey)
                    }}
                    className={cn(
                      "flex h-8 cursor-pointer items-center justify-center rounded-[8px] px-1 font-heading text-xs transition-colors active:scale-95",
                      isAssigned
                        ? "bg-foreground font-semibold text-background"
                        : "bg-secondary font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    title={rec.why}
                  >
                    <span className="truncate">{rec.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Exit Section */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs font-medium text-foreground">
                Exit Physics (Out)
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                Acceleration
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {spec.recommendedOut.map((rec) => {
                const isAssigned =
                  currentSlot?.exitId === rec.id ||
                  (!currentSlot?.exitId &&
                    activePresetId === rec.id &&
                    activeSlot === "exit")

                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => {
                      assignCurveToSlot(rec.id, "exit", activeScenarioKey)
                    }}
                    className={cn(
                      "flex h-8 cursor-pointer items-center justify-center rounded-[8px] px-1 font-heading text-xs transition-colors active:scale-95",
                      isAssigned
                        ? "bg-foreground font-semibold text-background"
                        : "bg-secondary font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    title={rec.why}
                  >
                    <span className="truncate">{rec.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : spec.recommended ? (
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <span className="font-heading text-xs font-medium text-foreground">
            Recommended
          </span>

          <div className="grid grid-cols-3 gap-1.5">
            {spec.recommended.map((rec) => {
              const isSelected = activePresetId === rec.id

              return (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => selectEase(rec.id)}
                  className={cn(
                    "flex h-8 cursor-pointer items-center justify-center rounded-[8px] px-1 font-heading text-xs transition-colors active:scale-95",
                    isSelected
                      ? "bg-foreground font-semibold text-background"
                      : "bg-secondary font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  title={rec.why}
                >
                  <span className="truncate">{rec.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}
