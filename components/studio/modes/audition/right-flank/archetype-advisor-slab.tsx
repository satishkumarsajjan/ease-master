"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useStudioStore } from "@/store/useStudioStore"
import { BEST_PRACTICES, BestPracticeSpec } from "./archetype-laws"

export function ArchetypeAdvisorSlab({ className }: { className?: string }) {
  const activePresetId = useStudioStore((s) => s.activeCurveId)
  const activeScenarioKey = useStudioStore((s) => s.activeScenarioKey)
  const scenarioSlots = useStudioStore((s) => s.scenarioSlots)
  const activeSlot = useStudioStore((s) => s.activeSlot)
  const selectEase = useStudioStore((s) => s.selectEase)
  const assignCurveToSlot = useStudioStore((s) => s.assignCurveToSlot)

  const currentSlot = scenarioSlots[activeScenarioKey]
  const spec: BestPracticeSpec =
    BEST_PRACTICES[activeScenarioKey] ?? BEST_PRACTICES.modal

  return (
    <TooltipProvider delayDuration={150}>
      <section
        aria-label="Motion Guide"
        className={cn(
          "no-scrollbar flex min-h-0 flex-1 flex-col gap-3 rounded-[20px] bg-background p-4 transition-colors select-none",
          className
        )}
      >
        {/* Header: Clean, confident title with zero clutter */}
        <div className="flex shrink-0 items-center justify-between">
          <span className="font-heading text-xs font-semibold text-foreground">
            Motion Guide
          </span>
        </div>

        {/* Motion Guideline: Standard text-xs leading-relaxed matching page design */}
        <p className="font-sans text-xs leading-relaxed text-muted-foreground">
          {spec.guideline}
        </p>

        {/* Curated Recommendations Anchored to Bottom of Block (mt-auto) */}
        {spec.recommendedIn && spec.recommendedOut ? (
          <div className="mt-auto flex flex-col gap-3 pt-2">
            {/* Entrance Section with Contextual Target Timing */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-heading text-xs font-medium text-foreground">
                  Recommended Entrance
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {spec.targetDurationIn ?? "220–320ms"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {spec.recommendedIn.map((rec) => {
                  const isAssigned =
                    activeSlot === "enter"
                      ? currentSlot?.enterId === rec.id ||
                        (!currentSlot?.enterId && activePresetId === rec.id)
                      : currentSlot?.exitId === rec.id ||
                        (!currentSlot?.exitId && activePresetId === rec.id)

                  return (
                    <Tooltip key={rec.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => {
                            assignCurveToSlot(
                              rec.id,
                              activeSlot,
                              activeScenarioKey
                            )
                          }}
                          className={cn(
                            "flex h-8 cursor-pointer items-center justify-center rounded-[8px] px-1 font-sans text-xs transition-colors active:scale-95",
                            isAssigned
                              ? "border border-border bg-background font-medium text-foreground shadow-xs"
                              : "bg-muted font-normal text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          <span className="truncate">{rec.label}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <span>
                          {rec.label} · {rec.why}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>

            {/* Exit Section with Contextual Target Timing */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-heading text-xs font-medium text-foreground">
                  Recommended Exit
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {spec.targetDurationOut ?? "160–220ms"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {spec.recommendedOut.map((rec) => {
                  const isAssigned =
                    activeSlot === "enter"
                      ? currentSlot?.enterId === rec.id ||
                        (!currentSlot?.enterId && activePresetId === rec.id)
                      : currentSlot?.exitId === rec.id ||
                        (!currentSlot?.exitId && activePresetId === rec.id)

                  return (
                    <Tooltip key={rec.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => {
                            assignCurveToSlot(
                              rec.id,
                              activeSlot,
                              activeScenarioKey
                            )
                          }}
                          className={cn(
                            "flex h-8 cursor-pointer items-center justify-center rounded-[8px] px-1 font-sans text-xs transition-colors active:scale-95",
                            isAssigned
                              ? "border border-border bg-background font-medium text-foreground shadow-xs"
                              : "bg-muted font-normal text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          <span className="truncate">{rec.label}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <span>
                          {rec.label} · {rec.why}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          </div>
        ) : spec.recommended ? (
          <div className="mt-auto flex flex-col gap-1.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs font-medium text-foreground">
                Recommended
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {spec.targetDuration}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {spec.recommended.map((rec) => {
                const isSelected = activePresetId === rec.id

                return (
                  <Tooltip key={rec.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => selectEase(rec.id)}
                        className={cn(
                          "flex h-8 cursor-pointer items-center justify-center rounded-[8px] px-1 font-sans text-xs transition-colors active:scale-95",
                          isSelected
                            ? "border border-border bg-background font-medium text-foreground shadow-xs"
                            : "bg-muted font-normal text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <span className="truncate">{rec.label}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <span>
                        {rec.label} · {rec.why}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        ) : null}
      </section>
    </TooltipProvider>
  )
}
