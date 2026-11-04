"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type TickPreset = "quarters" | "thirds" | "fifths" | "deciles"
export type TickItem =
  number | { value: number; label?: string; major?: boolean }
export type TicksProp = TickPreset | TickItem[]

export interface SliderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue" | "value"
> {
  label?: React.ReactNode
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  onSnap?: (tick: { value: number; label?: string; major?: boolean }) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  decimals?: number
  name?: string
  disabled?: boolean
  readOnly?: boolean
  size?: "sm" | "default" | "lg"
  layout?: "chip" | "inline" | "header" | "traveling"
  ticks?: TicksProp
  tickStep?: number
  snap?: "none" | "magnetic" | "hard"
  snapThreshold?: number
  tickVariant?: "pills" | "dots" | "ruler"
  tickLabels?: "none" | "under"
  formatValue?: (value: number) => string
  fillVariant?: "foreground" | "subdued"
  showValue?: boolean
  disableTransition?: boolean
}

export interface NormalizedTick {
  value: number
  ratio: number
  major?: boolean
  label?: string
}

const SIZE_CONFIGS = {
  sm: {
    container: "h-8 rounded-[8px] text-[11px]",
    fillRadius: "rounded-[8px]",
    handle: "h-4 w-1 rounded-full",
    handleActive: "h-4.5 w-1.5",
    handleOffset: "right-1.5",
    minPillWidth: 16,
    naturalLeft: 12,
    naturalRight: 12,
    inputWidth: "w-12 h-5 text-[11px]",
    chipSize: "h-8 w-14 rounded-[8px] text-[11px]",
  },
  default: {
    container: "h-11 rounded-[12px] text-xs",
    fillRadius: "rounded-[12px]",
    handle: "h-5 w-1.5 rounded-full",
    handleActive: "h-6 w-2",
    handleOffset: "right-2",
    minPillWidth: 20,
    naturalLeft: 16,
    naturalRight: 16,
    inputWidth: "w-16 h-6 text-xs",
    chipSize: "h-11 w-16 rounded-[12px] text-xs",
  },
  lg: {
    container: "h-14 rounded-[16px] text-sm",
    fillRadius: "rounded-[16px]",
    handle: "h-6.5 w-2 rounded-full",
    handleActive: "h-7.5 w-2.5",
    handleOffset: "right-2.5",
    minPillWidth: 26,
    naturalLeft: 20,
    naturalRight: 20,
    inputWidth: "w-20 h-7 text-sm",
    chipSize: "h-14 w-20 rounded-[16px] text-sm",
  },
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      label,
      value: propValue,
      defaultValue,
      onChange,
      onSnap,
      min = 0,
      max = 100,
      step = 1,
      unit = "",
      decimals,
      name,
      disabled = false,
      readOnly = false,
      size = "default",
      layout = "chip", // Default to the sketch Inspector layout
      ticks,
      tickStep,
      snap = "none",
      snapThreshold = 0.025,
      tickVariant = "pills",
      tickLabels = "none",
      formatValue,
      fillVariant = "foreground",
      showValue = true,
      disableTransition = false,
      className,
      ...props
    },
    forwardedRef
  ) => {
    // 1. Defensive Boundaries
    const safeMin = Number.isFinite(min) ? min : 0
    const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 100
    const safeStep = Number.isFinite(step) && step > 0 ? step : 1

    // 2. Controlled vs Uncontrolled State
    const isControlled = propValue !== undefined
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue !== undefined ? defaultValue : safeMin
    )
    const currentValue = isControlled ? propValue : uncontrolledValue

    const [isDragging, setIsDragging] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const [containerWidth, setContainerWidth] = React.useState<number>(0)

    const internalRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const dragStartPos = React.useRef<{ x: number; y: number } | null>(null)
    const rectRef = React.useRef<DOMRect | null>(null)
    const lastSnappedTickRef = React.useRef<number | null>(null)

    React.useImperativeHandle(forwardedRef, () => internalRef.current!)

    React.useEffect(() => {
      if (!internalRef.current) return
      const observer = new ResizeObserver((entries) => {
        if (entries[0]) {
          setContainerWidth(entries[0].contentRect.width)
        }
      })
      observer.observe(internalRef.current)
      return () => observer.disconnect()
    }, [])

    const precision = React.useMemo(() => {
      if (decimals !== undefined) return decimals
      const stepStr = safeStep.toString()
      return stepStr.includes(".") ? stepStr.split(".")[1].length : 0
    }, [decimals, safeStep])

    const clamp = React.useCallback(
      (val: number) => Math.min(Math.max(val, safeMin), safeMax),
      [safeMin, safeMax]
    )

    const roundToStep = React.useCallback(
      (val: number, customStep?: number) => {
        const activeStep = customStep || safeStep
        const factor = 1 / activeStep
        const rounded = Math.round(val * factor) / factor
        return Number(clamp(rounded).toFixed(precision))
      },
      [safeStep, precision, clamp]
    )

    // 3. Normalize Ticks & Presets
    const normalizedTicks = React.useMemo<NormalizedTick[]>(() => {
      let list: { value: number; label?: string; major?: boolean }[] = []
      const range = safeMax - safeMin

      if (typeof ticks === "string") {
        let fractions: number[] = []
        if (ticks === "quarters") fractions = [0, 0.25, 0.5, 0.75, 1]
        else if (ticks === "thirds") fractions = [0, 1 / 3, 2 / 3, 1]
        else if (ticks === "fifths") fractions = [0, 0.2, 0.4, 0.6, 0.8, 1]
        else if (ticks === "deciles")
          fractions = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]

        list = fractions.map((f, idx) => ({
          value: safeMin + f * range,
          major: idx === 0 || idx === fractions.length - 1 || f === 0.5,
          label: `${Math.round(f * 100)}%`,
        }))
      } else if (Array.isArray(ticks)) {
        list = ticks.map((t) => (typeof t === "number" ? { value: t } : t))
      } else if (typeof tickStep === "number" && tickStep > 0) {
        const count = Math.floor(range / tickStep)
        for (let i = 0; i <= count; i++) {
          const val = safeMin + i * tickStep
          list.push({ value: val, major: i % 2 === 0 })
        }
      }

      return list
        .filter((t) => t.value >= safeMin && t.value <= safeMax)
        .map((t) => ({
          ...t,
          ratio: Math.min(Math.max((t.value - safeMin) / range, 0), 1),
        }))
    }, [ticks, tickStep, safeMin, safeMax])

    const ratio = Math.min(
      Math.max((currentValue - safeMin) / (safeMax - safeMin), 0),
      1
    )
    const sizeConfig = SIZE_CONFIGS[size]

    // Active Snapped Tick
    const activeSnappedTick = React.useMemo(() => {
      if (normalizedTicks.length === 0) return null
      return (
        normalizedTicks.find(
          (t) =>
            Math.abs(currentValue - t.value) < 0.001 ||
            Math.abs(ratio - t.ratio) < 0.005
        ) ?? null
      )
    }, [normalizedTicks, currentValue, ratio])

    React.useEffect(() => {
      if (
        activeSnappedTick &&
        activeSnappedTick.value !== lastSnappedTickRef.current
      ) {
        lastSnappedTickRef.current = activeSnappedTick.value
        onSnap?.({
          value: activeSnappedTick.value,
          label: activeSnappedTick.label,
          major: activeSnappedTick.major,
        })
      } else if (!activeSnappedTick) {
        lastSnappedTickRef.current = null
      }
    }, [activeSnappedTick, onSnap])

    const updateValue = React.useCallback(
      (nextVal: number) => {
        if (readOnly || disabled) return
        const sanitized = roundToStep(nextVal)
        if (!isControlled) {
          setUncontrolledValue(sanitized)
        }
        onChange?.(sanitized)
      },
      [readOnly, disabled, isControlled, onChange, roundToStep]
    )

    const displayValue = React.useMemo(() => {
      if (formatValue) return formatValue(currentValue)
      return `${currentValue.toFixed(precision)}${unit ? `${unit}` : ""}`
    }, [formatValue, currentValue, precision, unit])

    // =========================================================================
    // SPATIAL LAYOUT COMPUTATIONS
    // =========================================================================

    const isHeaderLayout = layout === "header"
    const isChipLayout = layout === "chip"
    const isTravelingLayout = layout === "traveling"
    const isInlineLayout = layout === "inline"

    const currentWidthFallback = containerWidth || 320
    const handleX =
      sizeConfig.minPillWidth +
      ratio * (currentWidthFallback - sizeConfig.minPillWidth)

    // Left Forward Push (Only in inline layout where label is inside the track)
    const isLeftEnclosed = ratio >= 0.22
    const leftLabelOffset =
      isInlineLayout && !isLeftEnclosed
        ? Math.max(sizeConfig.naturalLeft, handleX + 8)
        : sizeConfig.naturalLeft

    // Traveling Repulsion Engine
    const isTravelingValueOnRight = isTravelingLayout && ratio <= 0.18
    const isTravelingLabelOnLeft = isTravelingLayout && ratio >= 0.45

    // Right-side Evacuation (Only in inline layout)
    const isRightEvacuated = isInlineLayout && ratio >= 0.78

    // 4. Cached Zero-Thrashing Pointer Tracking
    const handlePointerUpdate = React.useCallback(
      (clientX: number, isFineStep = false, isAltKey = false) => {
        if (!rectRef.current || disabled || readOnly) return
        const rect = rectRef.current
        const rawRatio = Math.max(
          0,
          Math.min((clientX - rect.left) / rect.width, 1)
        )

        let effectiveRatio = rawRatio

        // Magnetic Snapping (Alt bypasses)
        if (snap === "magnetic" && !isAltKey && normalizedTicks.length > 0) {
          for (const tick of normalizedTicks) {
            if (Math.abs(rawRatio - tick.ratio) <= snapThreshold) {
              effectiveRatio = tick.ratio
              break
            }
          }
        } else if (snap === "hard" && normalizedTicks.length > 0) {
          let closest = normalizedTicks[0]
          let minDiff = Math.abs(rawRatio - closest.ratio)
          for (const tick of normalizedTicks) {
            const diff = Math.abs(rawRatio - tick.ratio)
            if (diff < minDiff) {
              minDiff = diff
              closest = tick
            }
          }
          effectiveRatio = closest.ratio
        }

        const rawValue = safeMin + effectiveRatio * (safeMax - safeMin)
        const activeStep = isFineStep ? safeStep / 10 : safeStep
        updateValue(roundToStep(rawValue, activeStep))
      },
      [
        safeMin,
        safeMax,
        safeStep,
        disabled,
        readOnly,
        snap,
        snapThreshold,
        normalizedTicks,
        updateValue,
        roundToStep,
      ]
    )

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || readOnly || isEditing || e.button !== 0) return
      if (!internalRef.current) return

      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {}

      rectRef.current = internalRef.current.getBoundingClientRect()
      dragStartPos.current = { x: e.clientX, y: e.clientY }
      handlePointerUpdate(e.clientX, e.shiftKey, e.altKey)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStartPos.current || disabled || readOnly) return
      if (!isDragging) {
        const dist = Math.hypot(
          e.clientX - dragStartPos.current.x,
          e.clientY - dragStartPos.current.y
        )
        if (dist > 3) setIsDragging(true)
      }
      if (isDragging) {
        handlePointerUpdate(e.clientX, e.shiftKey, e.altKey)
      }
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId)
        }
      } catch {}
      dragStartPos.current = null
      rectRef.current = null
      setIsDragging(false)
    }

    // 5. Keyboard Navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || readOnly || isEditing) return

      if (snap === "hard" && normalizedTicks.length > 0) {
        const currentIndex = normalizedTicks.findIndex(
          (t) =>
            Math.abs(currentValue - t.value) < 0.001 ||
            Math.abs(ratio - t.ratio) < 0.01
        )

        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          const nextIndex = Math.min(
            normalizedTicks.length - 1,
            (currentIndex === -1 ? 0 : currentIndex) + 1
          )
          updateValue(normalizedTicks[nextIndex].value)
          e.preventDefault()
          return
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          const prevIndex = Math.max(
            0,
            (currentIndex === -1 ? 0 : currentIndex) - 1
          )
          updateValue(normalizedTicks[prevIndex].value)
          e.preventDefault()
          return
        }
      }

      let delta = 0
      const largeStep = (safeMax - safeMin) / 10
      const multiplier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          delta = safeStep * multiplier
          break
        case "ArrowLeft":
        case "ArrowDown":
          delta = -safeStep * multiplier
          break
        case "PageUp":
          delta = largeStep
          break
        case "PageDown":
          delta = -largeStep
          break
        case "Home":
          updateValue(safeMin)
          e.preventDefault()
          return
        case "End":
          updateValue(safeMax)
          e.preventDefault()
          return
        case "Enter":
          setIsEditing(true)
          setInputValue(currentValue.toString())
          e.preventDefault()
          return
        default:
          return
      }

      if (delta !== 0) {
        e.preventDefault()
        updateValue(currentValue + delta)
      }
    }

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      if (disabled || readOnly || isEditing) return
      e.preventDefault()
      const direction = e.deltaY < 0 ? 1 : -1
      const multiplier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1
      updateValue(currentValue + direction * safeStep * multiplier)
    }

    const commitInput = () => {
      setIsEditing(false)
      const parsed = parseFloat(inputValue)
      if (!isNaN(parsed)) {
        updateValue(parsed)
      }
    }

    React.useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, [isEditing])

    // =========================================================================
    // TICK RENDERING (Pure CSS calc)
    // =========================================================================

    const renderTickPip = (tick: NormalizedTick, isInverted = false) => {
      const isSnapped = activeSnappedTick?.value === tick.value

      const pipClass = cn(
        "pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-150",
        isInverted
          ? isSnapped
            ? "scale-125 bg-background opacity-100 ring-2 ring-border"
            : "bg-muted-foreground"
          : isSnapped
            ? "scale-125 bg-foreground opacity-100 ring-2 ring-border"
            : "bg-border",
        tickVariant === "pills" &&
          (tick.major
            ? isSnapped
              ? "h-3 w-[2.5px] rounded-full"
              : "h-2.5 w-[2px] rounded-full"
            : isSnapped
              ? "h-2.5 w-[2px] rounded-full"
              : "h-2 w-[1.5px] rounded-full"),
        tickVariant === "dots" &&
          (tick.major
            ? isSnapped
              ? "h-2 w-2 rounded-full"
              : "h-1.5 w-1.5 rounded-full"
            : isSnapped
              ? "h-1.5 w-1.5 rounded-full"
              : "h-1 w-1 rounded-full"),
        tickVariant === "ruler" &&
          (tick.major
            ? isSnapped
              ? "h-4 w-[2.5px] rounded-sm"
              : "h-3.5 w-[2px] rounded-sm"
            : isSnapped
              ? "h-2.5 w-[1.5px] rounded-sm"
              : "h-2 w-[1px] rounded-sm")
      )

      const cssLeft = `calc(${sizeConfig.minPillWidth / 2}px + ${tick.ratio} * (100% - ${sizeConfig.minPillWidth}px))`

      return (
        <React.Fragment key={tick.value}>
          {!isInverted && (
            <div
              onClick={(e) => {
                e.stopPropagation()
                updateValue(tick.value)
              }}
              title={
                tick.label ? `${tick.label} (${tick.value})` : `${tick.value}`
              }
              className="absolute inset-y-0 z-10 w-6 -translate-x-1/2 cursor-pointer opacity-0"
              style={{ left: cssLeft }}
            />
          )}
          <div className={pipClass} style={{ left: cssLeft }} />
        </React.Fragment>
      )
    }

    return (
      <div className={cn("w-full select-none", className)}>
        {/* Hidden Form Sync */}
        {name && (
          <input
            type="range"
            name={name}
            value={currentValue}
            min={safeMin}
            max={safeMax}
            step={safeStep}
            disabled={disabled}
            readOnly={readOnly}
            aria-hidden="true"
            tabIndex={-1}
            onChange={(e) => updateValue(parseFloat(e.target.value))}
            className="sr-only"
          />
        )}

        {/* TOP LABEL (Rendered for layout="header" or layout="chip") */}
        {(isHeaderLayout || (isChipLayout && label)) && (
          <div className="mb-1.5 flex items-center justify-between px-0.5 text-xs">
            <span className="font-medium text-muted-foreground">{label}</span>
            {isHeaderLayout && (
              <span className="font-semibold text-foreground tabular-nums">
                {displayValue}
              </span>
            )}
          </div>
        )}

        {/* MAIN INTERACTIVE ROW */}
        <div className="flex items-start gap-2.5">
          {/* TRACK & TICK LABELS COLUMN */}
          <div className="relative flex min-w-0 flex-1 flex-col">
            {/* SLIDER CHASSIS */}
            <div
              ref={internalRef}
              role="slider"
              aria-label={typeof label === "string" ? label : "Slider"}
              aria-valuemin={safeMin}
              aria-valuemax={safeMax}
              aria-valuenow={currentValue}
              aria-valuetext={displayValue}
              aria-orientation="horizontal"
              aria-disabled={disabled}
              aria-readonly={readOnly}
              tabIndex={disabled ? -1 : 0}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={handleKeyDown}
              onWheel={handleWheel}
              className={cn(
                "group [container-type:inline-size] relative flex w-full touch-none items-center overflow-hidden bg-muted subpixel-antialiased transition-colors",
                sizeConfig.container,
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                isDragging && "cursor-ew-resize",
                disabled && "pointer-events-none opacity-40",
                readOnly && "cursor-default"
              )}
              {...props}
            >
              {/* LAYER 1: BASE TICKS */}
              {normalizedTicks.map((t) => renderTickPip(t, false))}

              {/* LAYER 2: BASE TEXT */}
              <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-between pr-4">
                {/* Left Label (inline layout only) */}
                {isInlineLayout && label && (
                  <div
                    className="absolute top-1/2 flex -translate-y-1/2 items-center gap-2 font-medium tracking-tight text-muted-foreground transition-all group-hover:text-foreground"
                    style={{
                      left: `${leftLabelOffset}px`,
                      opacity: isLeftEnclosed ? 0 : 1,
                      transition:
                        isDragging || disableTransition
                          ? "none"
                          : "left 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease",
                    }}
                  >
                    {label}
                  </div>
                )}

                {/* Traveling Layout (Label Repelled to Right) */}
                {isTravelingLayout && label && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 font-medium tracking-tight text-muted-foreground transition-all duration-200 group-hover:text-foreground"
                    style={{
                      right: `${sizeConfig.naturalRight}px`,
                      opacity: isTravelingLabelOnLeft ? 0 : 1,
                      transform: isTravelingLabelOnLeft
                        ? "translateX(8px)"
                        : "translateX(0px)",
                    }}
                  >
                    {label}
                  </div>
                )}

                {/* Right Base Value (inline layout only) */}
                {isInlineLayout && showValue && (
                  <span
                    className={cn(
                      "absolute top-1/2 right-4 -translate-y-1/2 font-semibold text-foreground tabular-nums transition-opacity duration-150",
                      isRightEvacuated ? "opacity-0" : "opacity-100"
                    )}
                  >
                    {displayValue}
                  </span>
                )}
              </div>

              {/* LAYER 3: SOLID FILL (Clipping Mask Window) */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-y-0 left-0 overflow-hidden",
                  fillVariant === "subdued"
                    ? "bg-border"
                    : "bg-foreground shadow-[4px_0_14px_color-mix(in_oklab,var(--foreground)_18%,transparent)] dark:shadow-[4px_0_18px_color-mix(in_oklab,var(--foreground)_25%,transparent)]",
                  sizeConfig.fillRadius
                )}
                style={{
                  width: `calc(${sizeConfig.minPillWidth}px + ${ratio} * (100% - ${sizeConfig.minPillWidth}px))`,
                  transition:
                    isDragging || disableTransition
                      ? "none"
                      : "width 350ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
              >
                {/* FIXED-WIDTH INVERTED CANVAS (100cqw) */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-[100cqw]"
                  style={{
                    width: containerWidth ? `${containerWidth}px` : "100cqw",
                  }}
                >
                  {/* INVERTED TICKS */}
                  {normalizedTicks.map((t) => renderTickPip(t, true))}

                  {/* Inverted Left Label (inline layout only) */}
                  {isInlineLayout && label && (
                    <div
                      className="absolute top-1/2 flex -translate-y-1/2 items-center gap-2 font-medium tracking-tight text-background"
                      style={{
                        left: `${sizeConfig.naturalLeft}px`,
                        opacity: isLeftEnclosed ? 1 : 0,
                        transition:
                          isDragging || disableTransition
                            ? "none"
                            : "opacity 150ms ease",
                      }}
                    >
                      {label}
                    </div>
                  )}

                  {/* Inverted Traveling Label */}
                  {isTravelingLayout && label && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 font-medium tracking-tight text-background transition-all duration-200"
                      style={{
                        left: `${sizeConfig.naturalLeft}px`,
                        opacity: isTravelingLabelOnLeft ? 1 : 0,
                        transform: isTravelingLabelOnLeft
                          ? "translateX(0px)"
                          : "translateX(-8px)",
                      }}
                    >
                      {label}
                    </div>
                  )}
                </div>

                {/* LAYER 4: GRAB HANDLE & EVACUATED VALUES */}
                <div
                  className={cn(
                    "absolute top-1/2 flex -translate-y-1/2 items-center gap-1.5",
                    sizeConfig.handleOffset
                  )}
                >
                  {/* Evacuated Value at >= 78% (inline layout only) */}
                  {isInlineLayout && showValue && isRightEvacuated && (
                    <span
                      className={cn(
                        "animate-in pr-1 text-xs font-semibold tabular-nums duration-100 zoom-in-95 fade-in",
                        fillVariant === "subdued"
                          ? "text-foreground"
                          : "text-background"
                      )}
                    >
                      {displayValue}
                    </span>
                  )}

                  {/* Traveling Value inside fill */}
                  {isTravelingLayout && !isTravelingValueOnRight && (
                    <span
                      className={cn(
                        "animate-in pr-1 text-[11px] font-semibold tabular-nums duration-100 fade-in",
                        fillVariant === "subdued"
                          ? "text-foreground"
                          : "text-background"
                      )}
                    >
                      {displayValue}
                    </span>
                  )}

                  <div
                    className={cn(
                      disableTransition
                        ? "transition-none"
                        : "transition-all duration-150",
                      sizeConfig.handle,
                      fillVariant === "subdued"
                        ? "bg-foreground"
                        : "bg-background group-hover:bg-accent",
                      activeSnappedTick && "ring-2 ring-border",
                      isDragging &&
                        cn("ring-2 ring-primary", sizeConfig.handleActive)
                    )}
                  />
                </div>
              </div>

              {/* Traveling Value Right of Handle (<= 18%) */}
              {isTravelingLayout && isTravelingValueOnRight && (
                <div
                  className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 pl-1.5 text-[11px] font-semibold text-foreground tabular-nums transition-all duration-75"
                  style={{
                    left: `${handleX}px`,
                  }}
                >
                  {displayValue}
                </div>
              )}

              {/* Inline Direct Edit Input (inline only) */}
              {isInlineLayout && (
                <>
                  {isEditing ? (
                    <div
                      className={cn(
                        "absolute z-30 flex items-center",
                        isRightEvacuated ? "right-6" : "right-3"
                      )}
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        aria-label={
                          typeof label === "string"
                            ? `Edit ${label}`
                            : "Edit value"
                        }
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={commitInput}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitInput()
                          if (e.key === "Escape") setIsEditing(false)
                          e.stopPropagation()
                        }}
                        className={cn(
                          "rounded-md bg-background px-1.5 text-right font-semibold text-foreground shadow-sm ring-2 ring-ring focus:outline-none",
                          sizeConfig.inputWidth
                        )}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsEditing(true)
                        setInputValue(currentValue.toString())
                      }}
                      title="Click to type manually"
                      className={cn(
                        "absolute z-20 cursor-text opacity-0",
                        sizeConfig.inputWidth,
                        isRightEvacuated ? "right-6" : "right-3"
                      )}
                    />
                  )}
                </>
              )}
            </div>

            {/* PURE CSS ZERO-FOUC MILESTONE LABELS */}
            {tickLabels === "under" && normalizedTicks.length > 0 && (
              <div className="relative mt-1.5 h-3.5 w-full">
                {normalizedTicks.map((t) => {
                  const isSnapped = activeSnappedTick?.value === t.value
                  const isFirst = t.ratio === 0
                  const isLast = t.ratio === 1

                  const cssLeft = isFirst
                    ? "0%"
                    : isLast
                      ? "100%"
                      : `calc(${sizeConfig.minPillWidth / 2}px + ${t.ratio} * (100% - ${sizeConfig.minPillWidth}px))`

                  const transform = isFirst
                    ? "translateX(0%)"
                    : isLast
                      ? "translateX(-100%)"
                      : "translateX(-50%)"

                  return (
                    <span
                      key={t.value}
                      onClick={() => updateValue(t.value)}
                      className={cn(
                        "absolute cursor-pointer text-[10px] font-medium tabular-nums transition-colors select-none",
                        isSnapped
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      style={{
                        left: cssLeft,
                        transform,
                      }}
                    >
                      {t.label ?? `${t.value}`}
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* DEDICATED VALUE CHIP (Used in layout="chip" from your sketch) */}
          {isChipLayout && (
            <div
              className={cn(
                "flex shrink-0 items-center justify-center bg-muted font-semibold text-foreground tabular-nums transition-colors hover:bg-accent",
                sizeConfig.chipSize
              )}
            >
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  aria-label={
                    typeof label === "string" ? `Edit ${label}` : "Edit value"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={commitInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitInput()
                    if (e.key === "Escape") setIsEditing(false)
                    e.stopPropagation()
                  }}
                  className="w-full bg-transparent text-center font-semibold text-foreground focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => {
                    setIsEditing(true)
                    setInputValue(currentValue.toString())
                  }}
                  title="Click to type manually"
                  className="cursor-text"
                >
                  {displayValue}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
)

Slider.displayName = "Slider"
