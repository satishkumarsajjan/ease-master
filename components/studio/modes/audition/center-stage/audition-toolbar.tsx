"use client"

import * as React from "react"
import {
  Refresh03Icon,
  LaptopIcon,
  Tablet01Icon,
  SmartPhone01Icon,
  GitCompareIcon,
  SlidersHorizontalIcon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, LayoutGroup } from "motion/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ArchetypeKey } from "@/components/studio/domain/studio-types"
import { ARCHETYPE_SCENARIOS } from "@/components/studio/domain/studio-curves"
import { resolveEase } from "@/components/studio/domain/studio-kinetics"
import { useStudioStore, ViewportMode } from "@/store/useStudioStore"

export function AuditionToolbar() {
  const viewportMode = useStudioStore((s) => s.viewportMode)
  const setViewportMode = useStudioStore((s) => s.setViewportMode)
  const setPreviewWidth = useStudioStore((s) => s.setPreviewWidth)
  const activeScenarioKey = useStudioStore((s) => s.activeScenarioKey)
  const setActiveScenarioKey = useStudioStore((s) => s.setActiveScenarioKey)
  const scenarioSlots = useStudioStore((s) => s.scenarioSlots)
  const activeSlot = useStudioStore((s) => s.activeSlot)
  const setActiveSlot = useStudioStore((s) => s.setActiveSlot)
  const customCurves = useStudioStore((s) => s.customCurves)
  const triggerAudition = useStudioStore((s) => s.triggerAudition)
  const isTimelineOpen = useStudioStore((s) => s.isTimelineOpen)
  const toggleTimeline = useStudioStore((s) => s.toggleTimeline)
  const compareQueue = useStudioStore((s) => s.compareQueue)
  const activeCurveId = useStudioStore((s) => s.activeCurveId)
  const toggleCompare = useStudioStore((s) => s.toggleCompare)
  const setMode = useStudioStore((s) => s.setMode)

  const isCurrentCurveQueued = compareQueue.includes(activeCurveId)

  const currentSlot = scenarioSlots[activeScenarioKey]
  const isLifecycleComponent =
    activeScenarioKey === "sheet" ||
    activeScenarioKey === "modal" ||
    activeScenarioKey === "toast" ||
    activeScenarioKey === "dropdown"

  const enterCurve = React.useMemo(() => {
    return resolveEase(currentSlot?.enterId || "ease-out", customCurves)
  }, [currentSlot?.enterId, customCurves])

  const exitCurve = React.useMemo(() => {
    return resolveEase(currentSlot?.exitId || "ease-in", customCurves)
  }, [currentSlot?.exitId, customCurves])

  const handleViewportChange = (mode: ViewportMode) => {
    setViewportMode(mode)
    if (mode === "desktop") setPreviewWidth("100%")
    if (mode === "tablet") setPreviewWidth(768)
    if (mode === "mobile") setPreviewWidth(375)
  }

  return (
    <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 rounded-[14px] bg-background p-1 select-none">
      {/* Viewport switcher: Desktop / Tablet / Mobile */}
      <LayoutGroup id="audition-viewport">
        <div className="relative flex items-center rounded-[10px] bg-muted p-0.5">
          {[
            {
              mode: "desktop" as const,
              icon: LaptopIcon,
              label: "Desktop",
            },
            {
              mode: "tablet" as const,
              icon: Tablet01Icon,
              label: "Tablet",
            },
            {
              mode: "mobile" as const,
              icon: SmartPhone01Icon,
              label: "Mobile",
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
                      <HugeiconsIcon icon={item.icon} className="size-4" />
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <span>{item.label} View</span>
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
        onValueChange={(val) => setActiveScenarioKey(val as ArchetypeKey)}
      >
        <SelectTrigger className="h-8 w-[105px] rounded-[10px] border-none bg-muted px-2.5 text-xs font-medium text-foreground hover:bg-secondary focus:ring-0 [&>span]:truncate">
          <SelectValue placeholder="Button">
            {ARCHETYPE_SCENARIOS.find((s) => s.id === activeScenarioKey)
              ?.name ?? "Button"}
          </SelectValue>
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

      {/* Kinetic Slot Badges */}
      {isLifecycleComponent ? (
        <div className="flex items-center gap-1 rounded-[10px] bg-muted p-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setActiveSlot("enter")}
                className={cn(
                  "flex h-7 max-w-[115px] cursor-pointer items-center gap-1.5 rounded-[8px] px-2 font-mono text-[11px] font-semibold transition-colors",
                  activeSlot === "enter"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span className="font-heading text-[10px] font-bold tracking-wider uppercase">
                  In:
                </span>
                <span className="truncate">{enterCurve.name}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <span>Entrance Curve: {enterCurve.name} (Click to inspect)</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setActiveSlot("exit")}
                className={cn(
                  "flex h-7 max-w-[125px] cursor-pointer items-center gap-1.5 rounded-[8px] px-2 font-mono text-[11px] font-semibold transition-colors",
                  activeSlot === "exit"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span className="font-heading text-[10px] font-bold tracking-wider uppercase">
                  Out:
                </span>
                <span className="truncate">
                  {currentSlot?.exitId
                    ? exitCurve.name
                    : activeSlot === "exit"
                      ? exitCurve.name
                      : "Unassigned"}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <span>
                {currentSlot?.exitId
                  ? `Exit Curve: ${exitCurve.name} (Click to inspect/change)`
                  : "Exit Curve: Unassigned (Click to arm exit curve)"}
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="flex items-center rounded-[10px] bg-muted p-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setActiveSlot("enter")}
                className="flex h-7 max-w-[130px] cursor-pointer items-center gap-1.5 rounded-[8px] bg-foreground px-2 font-mono text-[11px] font-semibold text-background transition-colors"
              >
                <span className="font-heading text-[10px] font-bold tracking-wider text-background uppercase">
                  {activeScenarioKey === "carousel" ? "Travel:" : "Tactile:"}
                </span>
                <span className="truncate">{enterCurve.name}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <span>
                {activeScenarioKey === "carousel"
                  ? `Spatial Travel Ease: ${enterCurve.name}`
                  : `Tactile Feedback: ${enterCurve.name}`}
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <div className="h-4 w-px bg-muted" />

      {/* Replay Animation Action */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={triggerAudition}
            className="flex size-8 cursor-pointer items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <HugeiconsIcon icon={Refresh03Icon} className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="flex items-center gap-2">
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
            onClick={toggleTimeline}
            className={cn(
              "flex size-8 cursor-pointer items-center justify-center rounded-[10px] transition-colors",
              isTimelineOpen
                ? "bg-foreground text-background"
                : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <HugeiconsIcon icon={SlidersHorizontalIcon} className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="flex items-center gap-2">
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

      {/* Customize in Stage 2 / Customize Mode */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setMode("customize")}
            className="flex size-8 cursor-pointer items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="flex items-center gap-2">
          <span>Customize Parameters</span>
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
            onClick={() => toggleCompare(activeCurveId)}
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
        <TooltipContent side="top" className="flex items-center gap-2">
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
  )
}
