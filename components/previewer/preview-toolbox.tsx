"use client"

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
import {
  ArrowDown01Icon,
  DocumentCodeIcon,
  GithubIcon,
  LaptopIcon,
  Refresh03Icon,
  Share04Icon,
  SmartPhone01Icon,
  SourceCodeIcon,
  Tablet01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { SPRING } from "@/lib/motion"

import { DemoData } from "./component-preview"
import { ViewportMode } from "./resizable-playground"

export type AnchorPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

interface ToolbarProps {
  demos: DemoData[]
  activeDemoIndex: number
  setActiveDemoIndex: (val: number) => void
  isCodeOpen: boolean
  setIsCodeOpen: (v: boolean) => void
  viewportMode: ViewportMode
  onViewportChange: (mode: ViewportMode) => void
  onReload: () => void
  onScrollToSource: () => void
  githubUrl?: string
  previewUrl?: string
  hasSourceCodeId: boolean
  anchor?: AnchorPosition
  gridCols?: number
  collapsedRows?: number
  hotkeys?: {
    desktop?: string
    tablet?: string
    mobile?: string
    code?: string
    reload?: string
    scroll?: string
  }
}

const anchorClasses: Record<AnchorPosition, string> = {
  "top-left": "top-4 left-4 sm:top-6 sm:left-6",
  "top-center": "top-4 left-1/2 -translate-x-1/2 sm:top-6",
  "top-right": "top-4 right-4 sm:top-6 sm:right-6",
  "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6",
  "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
}

const originClasses: Record<AnchorPosition, string> = {
  "top-left": "top left",
  "top-center": "top center",
  "top-right": "top right",
  "bottom-left": "bottom left",
  "bottom-center": "bottom center",
  "bottom-right": "bottom right",
}

const DEFAULT_HOTKEYS: NonNullable<ToolbarProps["hotkeys"]> = {
  desktop: "1",
  tablet: "2",
  mobile: "3",
  code: "c",
  reload: "r",
  scroll: "s",
}

export function PreviewToolBox({
  demos,
  activeDemoIndex,
  setActiveDemoIndex,
  isCodeOpen,
  setIsCodeOpen,
  viewportMode,
  onViewportChange,
  onReload,
  onScrollToSource,
  githubUrl,
  previewUrl,
  hasSourceCodeId,
  anchor = "bottom-left",
  gridCols = 3,
  collapsedRows = 1,
  hotkeys = DEFAULT_HOTKEYS,
}: ToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredViewport, setHoveredViewport] = useState<string | null>(null)

  const propsRef = useRef({
    hotkeys,
    onViewportChange,
    setIsCodeOpen,
    isCodeOpen,
    onReload,
    onScrollToSource,
    hasSourceCodeId,
  })
  useEffect(() => {
    propsRef.current = {
      hotkeys,
      onViewportChange,
      setIsCodeOpen,
      isCodeOpen,
      onReload,
      onScrollToSource,
      hasSourceCodeId,
    }
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement
      const isInput =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        (activeElement instanceof HTMLElement &&
          activeElement.isContentEditable)

      if (isInput) return

      const key = e.key.toLowerCase()
      const p = propsRef.current

      if (key === p.hotkeys.desktop) p.onViewportChange("desktop")
      if (key === p.hotkeys.tablet) p.onViewportChange("tablet")
      if (key === p.hotkeys.mobile) p.onViewportChange("mobile")
      if (key === p.hotkeys.code) p.setIsCodeOpen(!p.isCodeOpen)
      if (key === p.hotkeys.reload) p.onReload()
      if (key === p.hotkeys.scroll && p.hasSourceCodeId) p.onScrollToSource()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const actions = [
    {
      id: "reload",
      icon: <HugeiconsIcon icon={Refresh03Icon} className="size-[14px]" />,
      label: "Reload Animation",
      hotkey: hotkeys.reload?.toUpperCase(),
      onClick: onReload,
      show: true,
      active: false,
    },
    {
      id: "code",
      icon: <HugeiconsIcon icon={SourceCodeIcon} className="size-[14px]" />,
      label: "Toggle Code",
      hotkey: hotkeys.code?.toUpperCase(),
      onClick: () => setIsCodeOpen(!isCodeOpen),
      show: true,
      active: isCodeOpen,
    },
    {
      id: "preview",
      icon: <HugeiconsIcon icon={Share04Icon} className="size-[14px]" />,
      label: "Open Isolated",
      onClick: () => window.open(previewUrl, "_blank", "noopener,noreferrer"),
      show: !!previewUrl,
      active: false,
    },
    {
      id: "github",
      icon: <HugeiconsIcon icon={GithubIcon} className="size-[14px]" />,
      label: "View GitHub",
      onClick: () => window.open(githubUrl, "_blank", "noopener,noreferrer"),
      show: !!githubUrl,
      active: false,
    },

    {
      id: "scroll",
      icon: <HugeiconsIcon icon={DocumentCodeIcon} className="size-[14px]" />,
      label: "Scroll to Source",
      hotkey: hotkeys.scroll?.toUpperCase(),
      onClick: onScrollToSource,
      show: hasSourceCodeId,
      active: false,
    },
  ].filter((a) => a.show)

  const isAnchoredBottom = anchor.startsWith("bottom")
  const tooltipSide = isAnchoredBottom ? "top" : "bottom"
  // Flip the layout direction based on top/bottom anchor so the expansion opens towards the center of the screen
  const flexDirClass = isAnchoredBottom ? "flex-col-reverse" : "flex-col"

  const baseActionCount = gridCols * collapsedRows
  const baseActions = actions.slice(0, baseActionCount)
  const extraActions = actions.slice(baseActionCount)
  const hasMoreActions = extraActions.length > 0

  const chevronRotation = isExpanded
    ? isAnchoredBottom
      ? 0
      : 180
    : isAnchoredBottom
      ? 180
      : 0

  const renderAction = (
    action: (typeof actions)[0],
    isHidden: boolean = false
  ) => (
    <Tooltip key={action.id}>
      <TooltipTrigger asChild>
        <Button
          tabIndex={isHidden ? -1 : 0}
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-full rounded-[12px] bg-background text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
            action.active
              ? "bg-foreground text-background hover:bg-foreground hover:text-background"
              : ""
          )}
          style={{ pointerEvents: isHidden ? "none" : "auto" }}
          onClick={action.onClick}
        >
          {action.icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} className="flex items-center gap-2">
        <span className="text-xs">{action.label}</span>
        {action.hotkey && (
          <kbd className="rounded-[4px] bg-muted px-1.5 py-0.5 text-[10px] font-medium opacity-80">
            {action.hotkey}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  )

  return (
    <motion.div
      layout
      className={cn(
        "absolute z-10 rounded-3xl bg-background p-2",
        anchorClasses[anchor]
      )}
      style={{ transformOrigin: originClasses[anchor] }}
      transition={SPRING.pill}
    >
      <div className={cn("flex gap-2 rounded-2xl bg-muted p-2", flexDirClass)}>
        {/* UPPER/LOWER MAIN CONTROLS (Viewport & Select) */}
        <div className="flex flex-col gap-2">
          <LayoutGroup id="viewport-switcher-group">
            <motion.div
              layout
              className="relative z-20 flex h-10 w-full items-center justify-center gap-1 rounded-[12px] bg-background p-1"
              onMouseLeave={() => setHoveredViewport(null)}
            >
              {[
                { id: "desktop", icon: LaptopIcon, hotkey: hotkeys.desktop },
                { id: "tablet", icon: Tablet01Icon, hotkey: hotkeys.tablet },
                {
                  id: "mobile",
                  icon: SmartPhone01Icon,
                  hotkey: hotkeys.mobile,
                },
              ].map((mode) => {
                const Icon = mode.icon
                const isActive = viewportMode === mode.id
                const isHovered = hoveredViewport === mode.id

                return (
                  <Tooltip key={mode.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Switch to ${mode.id} viewport`}
                        aria-pressed={isActive}
                        onMouseEnter={() => setHoveredViewport(mode.id)}
                        className={cn(
                          "relative flex h-full flex-1 items-center justify-center rounded-[8px] transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                          isActive
                            ? "text-background"
                            : isHovered
                              ? "text-foreground"
                              : "text-muted-foreground"
                        )}
                        onClick={() =>
                          onViewportChange(mode.id as ViewportMode)
                        }
                      >
                        {/* Gliding hover indicator (sits at z-[1] behind active indicator) */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              layoutId="viewport-hover-indicator"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 z-[1] rounded-[8px] bg-muted dark:bg-accent"
                              transition={SPRING.pill}
                            />
                          )}
                        </AnimatePresence>

                        {/* Active indicator (sits at z-[2] on top of hover pill) */}
                        {isActive && (
                          <motion.div
                            layoutId="activeViewport"
                            className="absolute inset-0 z-[2] rounded-[8px] bg-foreground"
                            transition={SPRING.pill}
                          />
                        )}

                        <HugeiconsIcon
                          icon={Icon}
                          className="relative z-10 size-3.5 transition-transform duration-200"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side={tooltipSide}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs capitalize">{mode.id}</span>
                      {mode.hotkey && (
                        <kbd className="rounded-[4px] bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase opacity-80">
                          {mode.hotkey}
                        </kbd>
                      )}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </motion.div>
          </LayoutGroup>

          <motion.div layout className="relative z-30 flex items-center gap-2">
            <Select
              value={activeDemoIndex.toString()}
              onValueChange={(val) => setActiveDemoIndex(parseInt(val))}
            >
              <SelectTrigger
                className={cn(
                  "h-10 rounded-[12px] border-none bg-background text-xs font-medium text-foreground hover:bg-background focus:ring-0",
                  // ✨ BULLETPROOF WIDTH FIX: Fixed width + truncation prevents layout shifts.
                  // `[&>span]` targets the inner Radix text wrapper to ensure it clips properly.
                  "w-[130px] sm:w-[150px] [&>span]:truncate [&>span]:pr-2"
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {demos.map((demo, idx) => (
                  <SelectItem
                    key={demo.key}
                    value={idx.toString()}
                    className="text-xs"
                  >
                    {demo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasMoreActions && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-[12px] bg-background text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: chevronRotation }}
                  transition={SPRING.pill}
                >
                  <HugeiconsIcon icon={ArrowDown01Icon} className="size-3.5" />
                </motion.div>
              </Button>
            )}
          </motion.div>
        </div>

        {/* ACTIONS GRID BLOCK */}
        <motion.div layout className="relative z-10 flex flex-col gap-2">
          <div
            className="relative z-20 grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            }}
          >
            {baseActions.map((a) => renderAction(a, false))}
          </div>

          <motion.div
            initial={false}
            animate={{
              height: isExpanded && hasMoreActions ? "auto" : 0,
              opacity: isExpanded && hasMoreActions ? 1 : 0,
            }}
            transition={SPRING.card}
            className="relative z-10 overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{
                y:
                  isExpanded && hasMoreActions
                    ? 0
                    : isAnchoredBottom
                      ? 20
                      : -20,
              }}
              transition={SPRING.card}
              className="grid gap-2 pt-2"
              style={{
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              }}
            >
              {extraActions.map((a) => renderAction(a, !isExpanded))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
