"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import { ViewportMode } from "@/components/previewer/resizable-playground"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { ArchetypeKey } from "../stage-1-types"
import { ARCHETYPE_SCENARIOS } from "../stage-1-curves"

interface AuditionToolbarProps {
  viewportMode: ViewportMode
  handleViewportChange: (mode: ViewportMode) => void
  activeScenarioKey: ArchetypeKey
  setActiveScenarioKey: (val: ArchetypeKey) => void
  triggerSingleAnimation: () => void
  isTimelineOpen: boolean
  setIsTimelineOpen: React.Dispatch<React.SetStateAction<boolean>>
  compareQueue: string[]
  isCurrentCurveQueued: boolean
  toggleCompareQueue: () => void
}

export function AuditionToolbar({
  viewportMode,
  handleViewportChange,
  activeScenarioKey,
  setActiveScenarioKey,
  triggerSingleAnimation,
  isTimelineOpen,
  setIsTimelineOpen,
  compareQueue,
  isCurrentCurveQueued,
  toggleCompareQueue,
}: AuditionToolbarProps) {
  const router = useRouter()

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
                      <HugeiconsIcon icon={item.icon} className="size-4" />
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="flex items-center gap-2">
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
        onValueChange={(val) => setActiveScenarioKey(val as ArchetypeKey)}
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
            onClick={() => setIsTimelineOpen((open) => !open)}
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

      {/* Customize in Stage 2 */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => router.push(ROUTES.stage2)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="flex items-center gap-2">
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
