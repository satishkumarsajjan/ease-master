"use client"

import * as React from "react"
import {
  Cancel01Icon,
  Layers01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useScenarioChoreography } from "@/components/studio/domain/use-scenario-choreography"
import { useStudioStore } from "@/store/useStudioStore"

export function ModalScenario() {
  const { isOpen, phase, easedValue, enterCurve, exitCurve, open, close } =
    useScenarioChoreography()
  const isPlaying = useStudioStore((s) => s.isPlaying)

  // Architectural scale and opacity kinematics
  let scale = 0.94
  let opacity = 0
  let backdropOpacity = 0

  if (isPlaying) {
    if (phase === "enter") {
      scale = 0.94 + Math.min(1.2, Math.max(0, easedValue)) * 0.06
      opacity = Math.min(1, Math.max(0, easedValue))
      backdropOpacity = opacity * 0.5
    } else {
      scale = 1.0 - Math.min(1.2, Math.max(0, easedValue)) * 0.06
      opacity = 1 - Math.min(1, Math.max(0, easedValue))
      backdropOpacity = opacity * 0.5
    }
  } else {
    scale = isOpen ? 1 : 0.94
    opacity = isOpen ? 1 : 0
    backdropOpacity = isOpen ? 0.5 : 0
  }

  const isVisible = isOpen || isPlaying

  // Keyboard ergonomics: Escape dismisses modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        e.preventDefault()
        close()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isVisible, close])

  return (
    <div className="relative flex h-full min-h-full w-full flex-1 flex-col items-center justify-center overflow-hidden p-6 select-none">
      {/* 1. Self-contained trigger when modal is closed */}
      {!isVisible && (
        <button
          type="button"
          onClick={open}
          className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm transition-all hover:border-border hover:bg-secondary active:scale-95"
        >
          <div className="flex size-5 items-center justify-center rounded-full bg-secondary text-foreground">
            <HugeiconsIcon icon={Layers01Icon} className="size-3" />
          </div>
          <span className="font-heading text-xs font-semibold text-foreground">
            Launch Modal Dialog
          </span>
          <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
              Space
            </span>
          </div>
        </button>
      )}

      {/* 2. Precision Scrim / Backdrop */}
      {isVisible && (
        <div
          onClick={close}
          style={{ opacity: backdropOpacity }}
          className="absolute inset-0 cursor-pointer bg-black backdrop-blur-xs transition-opacity"
        />
      )}

      {/* 3. The Modal Instrument Surface */}
      {isVisible && (
        <div
          style={{
            transform: `scale(${scale})`,
            opacity,
          }}
          className="relative z-10 w-full max-w-[420px] rounded-[18px] border border-border bg-card p-5 shadow-2xl will-change-transform"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-border pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-secondary text-foreground">
                <HugeiconsIcon icon={Layers01Icon} className="size-3.5" />
              </div>
              <div>
                <h4 className="font-heading text-xs font-semibold text-foreground">
                  Modal Dialog Surface
                </h4>
                <p className="font-sans text-[11px] text-muted-foreground">
                  Auditioning asymmetric entrance and exit physics
                </p>
              </div>
            </div>

            {/* Native ✕ Dismiss Affordance */}
            <button
              type="button"
              onClick={close}
              aria-label="Close modal (Esc)"
              className="flex size-7 cursor-pointer items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-90"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            </button>
          </div>

          {/* Kinetic Telemetry Matrix */}
          <div className="mt-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Arrival Slot Card */}
              <div
                className={`flex flex-col gap-1 rounded-xl border p-2.5 transition-colors ${
                  phase === "enter" && isPlaying
                    ? "border-foreground bg-secondary"
                    : "border-border bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    In · Arrival
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {enterCurve.duration || 320}ms
                  </span>
                </div>
                <span className="truncate font-heading text-xs font-semibold text-foreground">
                  {enterCurve.name}
                </span>
                <span className="font-sans text-[10px] text-muted-foreground">
                  Scale Deceleration
                </span>
              </div>

              {/* Dismissal Slot Card */}
              <div
                className={`flex flex-col gap-1 rounded-xl border p-2.5 transition-colors ${
                  phase === "exit" && isPlaying
                    ? "border-foreground bg-secondary"
                    : "border-border bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Out · Dismissal
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {exitCurve.duration || 200}ms
                  </span>
                </div>
                <span className="truncate font-heading text-xs font-semibold text-foreground">
                  {exitCurve.name}
                </span>
                <span className="font-sans text-[10px] text-muted-foreground">
                  Instant Acceleration
                </span>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="flex flex-col gap-1 rounded-xl bg-secondary p-2.5">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                <span>
                  Phase: {phase === "enter" ? "Arrival" : "Dismissal"}
                </span>
                <span>Value: {(easedValue * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  style={{
                    width: `${Math.min(100, Math.max(0, easedValue * 100))}%`,
                  }}
                  className="h-full bg-foreground transition-all duration-75"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-5 flex items-center justify-between border-t border-border pt-2">
            <span className="font-mono text-[10px] text-muted-foreground">
              Press{" "}
              <kbd className="rounded bg-muted px-1 py-0.5 font-semibold text-foreground">
                Esc
              </kbd>{" "}
              to exit
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={close}
                className="cursor-pointer rounded-lg bg-secondary px-3 py-1.5 font-heading text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
              >
                Dismiss (Exit Ease)
              </button>
              <button
                type="button"
                onClick={open}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-1.5 font-heading text-xs font-medium text-background transition-transform active:scale-95"
              >
                <HugeiconsIcon icon={PlayIcon} className="size-3" />
                <span>Replay Enter</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
