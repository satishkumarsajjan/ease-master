"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import NumberFlow from "@number-flow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/routes"
import { EASE, SPRING } from "@/lib/motion"
import {
  type Cadence,
  type EnterpriseInfo,
  DEFAULT_ENTERPRISE_INFO,
} from "@/lib/pricing"
import {
  CADENCE_ORDER,
  TEAM_FAQS,
  FeatureIcon,
  FormattedFeatureText,
  SlidingSuffix,
} from "./pricing-shared"
import { PricingV1Enterprise, PricingV1Faq } from "./pricing-variant-1"

/**
 * Luxurious slide transition for track clicks, preset pills, and steppers.
 */
export const SLIDER_EASE_TRANSITION = {
  duration: 0.48,
  ease: EASE.inOut,
} as const

/**
 * Balanced, visually restful NumberFlow timing profile.
 */
export const NUMBER_FLOW_TIMING = {
  transformTiming: {
    duration: 480,
    easing: `cubic-bezier(${EASE.inOut.join(", ")})`,
  },
  spinTiming: {
    duration: 480,
    easing: `cubic-bezier(${EASE.inOut.join(", ")})`,
  },
  opacityTiming: {
    duration: 280,
    easing: "ease-out",
  },
} as const

/**
 * Core technical deliverables included with team licenses
 */
export const TEAM_DELIVERABLES = [
  {
    text: "**Full TypeScript Source Code** with zero obfuscated bundles",
    icon: "code",
  },
  {
    text: "**Commercial & SaaS Distribution Rights** with unlimited projects",
    icon: "shield",
  },
  {
    text: "**Perpetual Fallback License** — keep downloaded versions forever",
    icon: "infinity",
  },
  {
    text: "**Private NPM & shadcn Registry** upstream sync tokens",
    icon: "package",
  },
  {
    text: "**Centralized Team Billing** with automated VAT / GST invoicing",
    icon: "credit-card",
  },
] as const

export const SEAT_PRESETS = [1, 5, 10, 20, 35]

/**
 * Volume economics calculator for developer seat tiers
 */
export function calculateVolumeEconomics(cadence: Cadence, seats: number) {
  if (cadence === "lifetime") {
    if (seats === 1)
      return {
        perSeatPrice: 79,
        tierName: "Solo Developer",
        discountPercent: 0,
      }
    if (seats <= 5)
      return {
        perSeatPrice: 59,
        tierName: "Small Team Tier",
        discountPercent: 25,
      }
    if (seats <= 15)
      return {
        perSeatPrice: 45,
        tierName: "Growth Team Tier",
        discountPercent: 43,
      }
    return {
      perSeatPrice: 35,
      tierName: "Scale Team Tier",
      discountPercent: 55,
    }
  }
  if (cadence === "annual") {
    if (seats === 1)
      return {
        perSeatPrice: 15,
        tierName: "Solo Developer",
        discountPercent: 0,
      }
    if (seats <= 5)
      return {
        perSeatPrice: 12,
        tierName: "Small Team Tier",
        discountPercent: 20,
      }
    if (seats <= 15)
      return {
        perSeatPrice: 9,
        tierName: "Growth Team Tier",
        discountPercent: 40,
      }
    return { perSeatPrice: 7, tierName: "Scale Team Tier", discountPercent: 53 }
  }
  // monthly
  if (seats === 1)
    return { perSeatPrice: 19, tierName: "Solo Developer", discountPercent: 0 }
  if (seats <= 5)
    return {
      perSeatPrice: 15,
      tierName: "Small Team Tier",
      discountPercent: 21,
    }
  if (seats <= 15)
    return {
      perSeatPrice: 12,
      tierName: "Growth Team Tier",
      discountPercent: 36,
    }
  return { perSeatPrice: 9, tierName: "Scale Team Tier", discountPercent: 52 }
}

export interface SquircleSliderProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  className?: string
}

const SLIDER_THROTTLE_MS = 36
const DRAG_THRESHOLD_PX = 4

/**
 * Tactile Squircle Slider
 * - Track clicks, stepper buttons & presets: Glide with 480ms SLIDER_EASE_TRANSITION.
 * - Dragging: Decoupled 120fps local thumb tracking with RAF coalescing + 36ms throttled state sampling.
 * - Trailing edge flush: Guarantees exact integer precision on pointer release.
 * - Concentric squircle thumb (rounded-[6px], strictly zero circular rounded-full).
 */
export const SquircleSlider = React.memo(function SquircleSlider({
  value,
  min = 1,
  max = 50,
  onChange,
  className,
}: SquircleSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const isDraggingRef = React.useRef(false)
  const startXRef = React.useRef(0)
  const rectRef = React.useRef<DOMRect | null>(null)
  const rafIdRef = React.useRef<number | null>(null)

  const currentPropPercentage = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100)
  )
  const [dragPercentage, setDragPercentage] = React.useState<number | null>(
    null
  )

  const lastUpdateRef = React.useRef<number>(0)
  const latestCommittedValueRef = React.useRef<number>(value)
  const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null)

  const calculateValueFromPointer = React.useCallback(
    (clientX: number) => {
      let rect = rectRef.current
      if (!rect && trackRef.current) {
        rect = trackRef.current.getBoundingClientRect()
        rectRef.current = rect
      }
      if (!rect) return { intValue: value, pct: currentPropPercentage }

      const rawPct = (clientX - rect.left) / rect.width
      const clampedPct = Math.max(0, Math.min(1, rawPct))
      const rawValue = min + clampedPct * (max - min)
      const intValue = Math.round(rawValue)
      const preciseClampedPct = ((intValue - min) / (max - min)) * 100

      return { intValue, pct: preciseClampedPct }
    },
    [min, max, value, currentPropPercentage]
  )

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    if (!trackRef.current) return

    trackRef.current.setPointerCapture(e.pointerId)
    rectRef.current = trackRef.current.getBoundingClientRect()
    startXRef.current = e.clientX

    const { intValue, pct } = calculateValueFromPointer(e.clientX)
    setDragPercentage(pct)

    if (intValue !== latestCommittedValueRef.current) {
      latestCommittedValueRef.current = intValue
      lastUpdateRef.current = performance.now()
      onChange(intValue)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!trackRef.current || !trackRef.current.hasPointerCapture(e.pointerId))
      return

    const dist = Math.abs(e.clientX - startXRef.current)
    if (!isDraggingRef.current && dist > DRAG_THRESHOLD_PX) {
      isDraggingRef.current = true
      setIsDragging(true)
    }

    const clientX = e.clientX

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = requestAnimationFrame(() => {
      const { intValue, pct } = calculateValueFromPointer(clientX)
      setDragPercentage(pct)

      const now = performance.now()
      const timeSinceLastUpdate = now - lastUpdateRef.current

      if (timeSinceLastUpdate >= SLIDER_THROTTLE_MS) {
        if (intValue !== latestCommittedValueRef.current) {
          latestCommittedValueRef.current = intValue
          lastUpdateRef.current = now
          onChange(intValue)
        }
      } else {
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = setTimeout(() => {
          if (intValue !== latestCommittedValueRef.current) {
            latestCommittedValueRef.current = intValue
            lastUpdateRef.current = performance.now()
            onChange(intValue)
          }
        }, SLIDER_THROTTLE_MS - timeSinceLastUpdate)
      }
    })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!trackRef.current || !trackRef.current.hasPointerCapture(e.pointerId))
      return

    trackRef.current.releasePointerCapture(e.pointerId)
    isDraggingRef.current = false
    setIsDragging(false)
    setDragPercentage(null)
    rectRef.current = null

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }

    const { intValue } = calculateValueFromPointer(e.clientX)

    if (intValue !== latestCommittedValueRef.current) {
      latestCommittedValueRef.current = intValue
      onChange(intValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault()
      onChange(Math.min(max, value + 1))
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault()
      onChange(Math.max(min, value - 1))
    } else if (e.key === "PageUp") {
      e.preventDefault()
      onChange(Math.min(max, value + 5))
    } else if (e.key === "PageDown") {
      e.preventDefault()
      onChange(Math.max(min, value - 5))
    } else if (e.key === "Home") {
      e.preventDefault()
      onChange(min)
    } else if (e.key === "End") {
      e.preventDefault()
      onChange(max)
    }
  }

  const activePct =
    isDragging && dragPercentage !== null
      ? dragPercentage
      : currentPropPercentage

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label="Developer seat slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} Developer ${value === 1 ? "Seat" : "Seats"}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "relative flex h-11 w-full touch-none items-center rounded-[10px] select-none focus-visible:outline-none",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className
      )}
    >
      <div className="relative h-2 w-full overflow-hidden rounded-[8px] bg-muted">
        <motion.div
          animate={{ width: `${activePct}%` }}
          transition={isDragging ? { duration: 0 } : SLIDER_EASE_TRANSITION}
          className="absolute inset-y-0 left-0 bg-primary"
        />
      </div>

      <motion.div
        animate={{ left: `${activePct}%` }}
        transition={isDragging ? { duration: 0 } : SLIDER_EASE_TRANSITION}
        className="absolute top-1/2 z-20 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[6px] border border-border bg-background shadow-[0_2px_8px_oklch(0_0_0/0.12),0_1px_2px_oklch(0_0_0/0.06)] transition-shadow hover:scale-105 active:scale-95 dark:border-border dark:bg-foreground dark:shadow-[0_2px_8px_oklch(0_0_0/0.3)]"
      >
        <div className="flex flex-col gap-0.5">
          <div className="h-0.5 w-2 rounded-full bg-muted-foreground dark:bg-background" />
          <div className="h-0.5 w-2 rounded-full bg-muted-foreground dark:bg-background" />
        </div>
      </motion.div>
    </div>
  )
})

/**
 * ============================================================================
 * PRICING V4 CADENCE SWITCHER
 * ============================================================================
 */
export interface PricingV4CadenceSwitcherProps {
  cadence: Cadence
  onChange: (cadence: Cadence) => void
  className?: string
}

export const PricingV4CadenceSwitcher = React.memo(
  function PricingV4CadenceSwitcher({
    cadence,
    onChange,
    className,
  }: PricingV4CadenceSwitcherProps) {
    return (
      <div
        className={cn(
          "mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:mt-10",
          className
        )}
      >
        <div
          role="radiogroup"
          aria-label="Select billing cadence"
          className="relative inline-flex items-center rounded-[14px] bg-muted p-1"
        >
          <button
            type="button"
            role="radio"
            aria-checked={cadence === "monthly"}
            onClick={() => onChange("monthly")}
            className={cn(
              "relative rounded-[10px] px-3.5 py-1.5 font-sans text-xs transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              cadence === "monthly"
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cadence === "monthly" && (
              <motion.div
                layoutId="pricing-v4-cadence-slab"
                transition={SPRING.pill}
                className="absolute inset-0 rounded-[10px] bg-background shadow-[0_2px_6px_oklch(0_0_0/0.05)] dark:bg-secondary dark:shadow-[0_1px_3px_oklch(0_0_0/0.3)]"
              />
            )}
            <span className="relative z-10">Monthly</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={cadence === "annual"}
            onClick={() => onChange("annual")}
            className={cn(
              "relative rounded-[10px] px-3.5 py-1.5 font-sans text-xs transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              cadence === "annual"
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cadence === "annual" && (
              <motion.div
                layoutId="pricing-v4-cadence-slab"
                transition={SPRING.pill}
                className="absolute inset-0 rounded-[10px] bg-background shadow-[0_2px_6px_oklch(0_0_0/0.05)] dark:bg-secondary dark:shadow-[0_1px_3px_oklch(0_0_0/0.3)]"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Yearly</span>
              <span className="py-0.2 rounded-[6px] bg-secondary px-1.5 font-sans text-[10px] font-semibold text-primary">
                -20%
              </span>
            </span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={cadence === "lifetime"}
            onClick={() => onChange("lifetime")}
            className={cn(
              "relative rounded-[10px] px-3.5 py-1.5 font-sans text-xs transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              cadence === "lifetime"
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cadence === "lifetime" && (
              <motion.div
                layoutId="pricing-v4-cadence-slab"
                transition={SPRING.pill}
                className="absolute inset-0 rounded-[10px] bg-background shadow-[0_2px_6px_oklch(0_0_0/0.05)] dark:bg-secondary dark:shadow-[0_1px_3px_oklch(0_0_0/0.3)]"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Lifetime</span>
              <span className="py-0.2 rounded-[6px] bg-secondary px-1.5 font-sans text-[10px] font-semibold text-primary">
                Best Value
              </span>
            </span>
          </button>
        </div>
      </div>
    )
  }
)

/**
 * ============================================================================
 * PRICING V4 DELIVERABLES LIST
 * ============================================================================
 */
export const PricingV4Deliverables = React.memo(
  function PricingV4Deliverables() {
    return (
      <div className="mt-7">
        <span className="block font-sans text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase">
          LICENSE INCLUDES:
        </span>
        <ul className="mt-3.5 space-y-3.5">
          {TEAM_DELIVERABLES.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3.5 py-0.5 font-sans text-xs leading-relaxed sm:text-[13px]"
            >
              <FeatureIcon
                name={item.icon}
                className="mt-0.5 text-muted-foreground"
              />
              <FormattedFeatureText text={item.text} isHero={false} />
            </li>
          ))}
        </ul>
      </div>
    )
  }
)

/**
 * ============================================================================
 * PRICING V4 SEAT CONFIGURATOR (Bay A: Left 7 cols)
 * ============================================================================
 */
export interface PricingV4SeatConfiguratorProps extends React.ComponentProps<"div"> {
  seats: number
  onSeatsChange: (seats: number) => void
  cadence: Cadence
  tierName: string
  discountPercent: number
  perSeatPrice: number
  className?: string
}

export function PricingV4SeatConfigurator({
  seats,
  onSeatsChange,
  cadence,
  tierName,
  discountPercent,
  perSeatPrice,
  className,
  ...props
}: PricingV4SeatConfiguratorProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-[18px] bg-background p-3.5 shadow-[0_2px_8px_-2px_oklch(0_0_0/0.05)] sm:p-6 md:p-8 lg:col-span-7 dark:bg-secondary dark:shadow-[0_2px_8px_-2px_oklch(0_0_0/0.3)]",
        className
      )}
      {...props}
    >
      <div>
        {/* Stepper Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-sans text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase">
              CONFIGURE SEAT POOL
            </span>
            <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              <NumberFlow
                value={seats}
                {...NUMBER_FLOW_TIMING}
                willChange
                isolate
              />{" "}
              Developer {seats === 1 ? "Seat" : "Seats"}
            </h3>
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center gap-1.5 rounded-[12px] bg-muted p-1">
            <button
              type="button"
              aria-label="Decrease seat count"
              disabled={seats <= 1}
              onClick={() => onSeatsChange(Math.max(1, seats - 1))}
              className="flex size-7 items-center justify-center rounded-[8px] bg-background text-foreground shadow-[0_1px_3px_oklch(0_0_0/0.05)] transition-all hover:bg-background/90 active:scale-[0.94] disabled:opacity-35 dark:bg-secondary"
            >
              <HugeiconsIcon icon={MinusSignIcon} className="size-3.5" />
            </button>
            <span className="inline-flex w-8 justify-center text-center font-heading text-xs font-bold text-foreground">
              <NumberFlow
                value={seats}
                {...NUMBER_FLOW_TIMING}
                willChange
                isolate
              />
            </span>
            <button
              type="button"
              aria-label="Increase seat count"
              disabled={seats >= 50}
              onClick={() => onSeatsChange(Math.min(50, seats + 1))}
              className="flex size-7 items-center justify-center rounded-[8px] bg-background text-foreground shadow-[0_1px_3px_oklch(0_0_0/0.05)] transition-all hover:bg-background/90 active:scale-[0.94] disabled:opacity-35 dark:bg-secondary"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Squircle Slider */}
        <div className="mt-6">
          <SquircleSlider
            value={seats}
            min={1}
            max={50}
            onChange={onSeatsChange}
          />
          <div className="mt-2 flex justify-between font-sans text-[10.5px] text-muted-foreground select-none">
            <button
              type="button"
              onClick={() => onSeatsChange(1)}
              className="transition-colors hover:text-foreground focus-visible:outline-none"
            >
              1 Solo
            </button>
            <button
              type="button"
              onClick={() => onSeatsChange(10)}
              className="transition-colors hover:text-foreground focus-visible:outline-none"
            >
              10 Team
            </button>
            <button
              type="button"
              onClick={() => onSeatsChange(25)}
              className="transition-colors hover:text-foreground focus-visible:outline-none"
            >
              25 Scale
            </button>
            <button
              type="button"
              onClick={() => onSeatsChange(50)}
              className="transition-colors hover:text-foreground focus-visible:outline-none"
            >
              50+ Enterprise
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-sans text-xs text-muted-foreground">
            Quick select:
          </span>
          {SEAT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onSeatsChange(preset)}
              className={cn(
                "rounded-[8px] px-2.5 py-1 font-sans text-xs transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
                seats === preset
                  ? "bg-foreground font-semibold text-background dark:bg-primary dark:text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {preset} {preset === 1 ? "seat" : "seats"}
            </button>
          ))}
        </div>

        {/* Volume Tiering Callout */}
        <div className="mt-6 rounded-[14px] bg-muted/60 p-3 transition-colors sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-sans text-xs font-medium text-foreground">
              {tierName} Applied
            </span>
            {discountPercent > 0 && (
              <span className="inline-flex shrink-0 items-center rounded-[6px] bg-primary/15 px-2 py-0.5 font-sans text-[10px] font-semibold whitespace-nowrap text-primary dark:bg-primary/25">
                Save&nbsp;
                <NumberFlow
                  value={discountPercent}
                  {...NUMBER_FLOW_TIMING}
                  willChange
                  isolate
                />
                % per seat
              </span>
            )}
          </div>
          <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground/80">
            $
            <NumberFlow
              value={perSeatPrice}
              {...NUMBER_FLOW_TIMING}
              willChange
              isolate
            />{" "}
            per developer seat{" "}
            {cadence === "lifetime" ? "one-time" : "per month"}.
            {seats > 1 &&
              " Centralized licensing with shared deployment rights."}
          </p>
        </div>

        {/* Team Deliverables List */}
        <PricingV4Deliverables />
      </div>
    </div>
  )
}

/**
 * ============================================================================
 * PRICING V4 ORDER LEDGER (Bay B: Right 5 cols)
 * ============================================================================
 */
export interface PricingV4OrderLedgerProps extends React.ComponentProps<"div"> {
  toolName?: string
  seats: number
  perSeatPrice: number
  totalPrice: number
  cadence: Cadence
  direction?: number
  includeSuite: boolean
  onToggleSuite: () => void
  suitePassPrice: number
  discountPercent: number
  checkoutHref?: string
  className?: string
}

export function PricingV4OrderLedger({
  toolName = "This Tool",
  seats,
  perSeatPrice,
  totalPrice,
  cadence,
  direction = 1,
  includeSuite,
  onToggleSuite,
  suitePassPrice,
  discountPercent,
  checkoutHref = "/app",
  className,
  ...props
}: PricingV4OrderLedgerProps) {
  const suffix =
    cadence === "monthly"
      ? "/ month"
      : cadence === "annual"
        ? "/ year"
        : "one-time"

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-[18px] bg-foreground p-3.5 text-background shadow-[0_24px_50px_-15px_oklch(0_0_0/0.25)] sm:p-6 md:p-8 lg:col-span-5 dark:bg-accent dark:text-foreground dark:shadow-[inset_0_1px_0_0_oklch(1_0_0/0.12),0_2px_8px_-2px_oklch(0_0_0/0.5)]",
        className
      )}
      {...props}
    >
      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-heading text-lg font-semibold tracking-tight text-background sm:text-xl dark:text-foreground">
            Team Order Ledger
          </h4>
          <span className="rounded-[6px] bg-primary/20 px-2 py-0.5 font-sans text-[10px] font-semibold text-primary dark:bg-primary/25">
            ✦ Instant Delivery
          </span>
        </div>
        <p className="mt-1 font-sans text-xs leading-relaxed text-background/70 dark:text-muted-foreground">
          Includes {toolName} with commercial rights for{" "}
          <NumberFlow
            value={seats}
            {...NUMBER_FLOW_TIMING}
            willChange
            isolate
          />{" "}
          {seats === 1 ? "seat" : "seats"}.
        </p>

        {/* Live Rolling Total */}
        <div className="mt-7">
          <span className="font-sans text-[11px] font-medium tracking-wide text-background/60 uppercase dark:text-muted-foreground">
            TOTAL INVESTMENT:
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <NumberFlow
              value={totalPrice}
              {...NUMBER_FLOW_TIMING}
              willChange
              isolate
              format={{
                style: "currency",
                currency: "USD",
                trailingZeroDisplay: "stripIfInteger",
              }}
              className="font-heading text-4xl font-bold tracking-tight text-background sm:text-[44px] dark:text-foreground"
            />
            <SlidingSuffix
              text={suffix}
              direction={direction}
              className="text-background/60 dark:text-muted-foreground"
            />
          </div>
        </div>

        {/* Itemized Math Breakdown */}
        <div className="mt-4 space-y-1.5 rounded-[12px] bg-white/10 p-3.5 font-sans text-xs text-background/80 dark:bg-background/40 dark:text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1">
              <NumberFlow
                value={seats}
                {...NUMBER_FLOW_TIMING}
                willChange
                isolate
              />{" "}
              {seats === 1 ? "Developer Seat" : "Developer Seats"} ($
              <NumberFlow
                value={perSeatPrice}
                {...NUMBER_FLOW_TIMING}
                willChange
                isolate
              />
              /seat)
            </span>
            <span className="font-semibold text-background dark:text-foreground">
              <NumberFlow
                value={perSeatPrice * seats}
                {...NUMBER_FLOW_TIMING}
                willChange
                isolate
                format={{
                  style: "currency",
                  currency: "USD",
                  trailingZeroDisplay: "stripIfInteger",
                }}
              />
            </span>
          </div>

          {includeSuite && (
            <div className="flex items-center justify-between text-primary">
              <span>Satisium All-Access Suite Pass</span>
              <span className="font-semibold">
                +
                <NumberFlow
                  value={suitePassPrice}
                  {...NUMBER_FLOW_TIMING}
                  willChange
                  isolate
                  format={{
                    style: "currency",
                    currency: "USD",
                    trailingZeroDisplay: "stripIfInteger",
                  }}
                />
              </span>
            </div>
          )}

          {discountPercent > 0 && (
            <div className="pt-1 text-[11px] text-background/60 dark:text-muted-foreground">
              Applied volume discount:{" "}
              <NumberFlow
                value={discountPercent}
                {...NUMBER_FLOW_TIMING}
                willChange
                isolate
              />
              % off solo tier
            </div>
          )}
        </div>

        {/* Satisium Suite Add-on Toggle */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onToggleSuite}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-[14px] p-3 text-left transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              includeSuite
                ? "bg-white/20 dark:bg-white/15"
                : "bg-white/8 hover:bg-white/12 dark:bg-white/5 dark:hover:bg-white/8"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-[6px] transition-colors",
                  includeSuite
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/20 dark:bg-white/10"
                )}
              >
                {includeSuite && (
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-3.5 stroke-[2.5]"
                  />
                )}
              </div>
              <div>
                <div className="font-sans text-xs font-semibold text-background dark:text-foreground">
                  Bundle All-Access Suite Pass
                </div>
                <div className="font-sans text-[11px] text-background/70 dark:text-muted-foreground">
                  Unlocks all 12+ current and upcoming tools
                </div>
              </div>
            </div>
            <span className="shrink-0 font-sans text-xs font-semibold text-primary">
              +
              <NumberFlow
                value={suitePassPrice}
                {...NUMBER_FLOW_TIMING}
                willChange
                isolate
                format={{
                  style: "currency",
                  currency: "USD",
                  trailingZeroDisplay: "stripIfInteger",
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Action Button & Guarantee */}
      <div className="mt-8">
        <Link
          href={checkoutHref}
          className="inline-flex h-10 w-full items-center justify-center rounded-[12px] bg-primary font-sans text-xs font-medium text-primary-foreground shadow-[0_4px_16px_oklch(0.6404_0.2153_35.9/0.3)] transition-all hover:bg-primary/95 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98] sm:text-sm"
        >
          Confirm&nbsp;
          <NumberFlow
            value={seats}
            {...NUMBER_FLOW_TIMING}
            willChange
            isolate
          />
          &nbsp;{seats === 1 ? "Seat" : "Seats"} License
        </Link>
        <p className="mt-2 text-center font-sans text-[11px] text-background/55 select-none dark:text-muted-foreground/80">
          {cadence === "lifetime"
            ? "Pay once, own forever · 14-day refund guarantee"
            : "7-day free trial · Cancel anytime with 1 click"}
        </p>
      </div>
    </div>
  )
}

/**
 * ============================================================================
 * PRICING VARIANT 4 PRESET: Dynamic Team Seat Configurator Console
 * ============================================================================
 */
export interface PricingVariant4Props extends React.ComponentProps<"section"> {
  className?: string
  heading?: string
  description?: string
  toolName?: string
  enterpriseInfo?: EnterpriseInfo
  showEnterprise?: boolean
  showFaq?: boolean
}

export function PricingVariant4({
  className,
  heading = "Scale your entire engineering team.",
  description = "Dynamic team seat licensing with automated volume discounts and instant GitHub delivery.",
  toolName = "This Tool",
  enterpriseInfo = DEFAULT_ENTERPRISE_INFO,
  showEnterprise = true,
  showFaq = true,
  ...props
}: PricingVariant4Props) {
  const [cadence, setCadence] = React.useState<Cadence>("lifetime")
  const [direction, setDirection] = React.useState<number>(1)
  const [seats, setSeats] = React.useState<number>(5)
  const [includeSuite, setIncludeSuite] = React.useState<boolean>(false)

  const handleCadenceChange = React.useCallback((newCadence: Cadence) => {
    setCadence((current) => {
      if (newCadence === current) return current
      const prevOrder = CADENCE_ORDER[current]
      const newOrder = CADENCE_ORDER[newCadence]
      setDirection(newOrder >= prevOrder ? 1 : -1)
      return newCadence
    })
  }, [])

  const handleSeatsChange = React.useCallback((newSeats: number) => {
    React.startTransition(() => {
      setSeats(newSeats)
    })
  }, [])

  const { perSeatPrice, tierName, discountPercent } = React.useMemo(
    () => calculateVolumeEconomics(cadence, seats),
    [cadence, seats]
  )

  const suitePassPrice = React.useMemo(() => {
    if (cadence === "lifetime") return 199
    if (cadence === "annual") return 12
    return 19
  }, [cadence])

  const totalPrice = React.useMemo(() => {
    const seatSubtotal = perSeatPrice * seats
    return seatSubtotal + (includeSuite ? suitePassPrice : 0)
  }, [perSeatPrice, seats, includeSuite, suitePassPrice])

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className={cn(
        "relative mx-auto flex w-full max-w-5xl flex-col items-center px-0 select-none sm:px-6",
        className
      )}
      {...props}
    >
      {/* 1. Typographic Header */}
      {heading && (
        <h2 className="text-center font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {heading}
        </h2>
      )}

      {description && (
        <p className="mt-2 max-w-md text-center font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {description}
        </p>
      )}

      {/* 2. Cadence Switcher */}
      <PricingV4CadenceSwitcher
        cadence={cadence}
        onChange={handleCadenceChange}
      />

      {/* 3. Dual-Bay Console */}
      <div className="mt-8 w-full overflow-hidden rounded-[24px] bg-muted p-1.5 transition-colors sm:mt-10 sm:p-1.5">
        <div className="grid grid-cols-1 items-stretch gap-1.5 lg:grid-cols-12 lg:gap-1.5">
          <PricingV4SeatConfigurator
            seats={seats}
            onSeatsChange={handleSeatsChange}
            cadence={cadence}
            tierName={tierName}
            discountPercent={discountPercent}
            perSeatPrice={perSeatPrice}
          />
          <PricingV4OrderLedger
            toolName={toolName}
            seats={seats}
            perSeatPrice={perSeatPrice}
            totalPrice={totalPrice}
            cadence={cadence}
            direction={direction}
            includeSuite={includeSuite}
            onToggleSuite={() => setIncludeSuite((v) => !v)}
            suitePassPrice={suitePassPrice}
            discountPercent={discountPercent}
          />
        </div>
      </div>

      {/* 4. Enterprise Foundation Slab */}
      {showEnterprise && enterpriseInfo && (
        <PricingV1Enterprise enterpriseInfo={enterpriseInfo} />
      )}

      {/* 5. Pre-purchase FAQ Accordion */}
      {showFaq && <PricingV1Faq items={TEAM_FAQS} />}

      {/* 6. Transparency Note */}
      <p className="mt-8 text-center font-sans text-[11px] leading-relaxed text-muted-foreground sm:mt-10 sm:text-xs">
        All prices in USD. Applicable sales taxes and VAT calculated at
        checkout. Need purchasing power parity (PPP) or custom invoicing?{" "}
        <Link
          href={enterpriseInfo?.cta.href ?? ROUTES.docs}
          className="text-foreground underline decoration-muted-foreground underline-offset-2 hover:decoration-foreground"
        >
          Contact sales
        </Link>
        .
      </p>
    </section>
  )
}
