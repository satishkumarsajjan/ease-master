"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"

import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

export interface FooterCtaVariant1Props extends React.ComponentProps<"div"> {
  className?: string
  heading?: string
  description?: string
  primaryActionLabel?: string
  primaryActionHref?: string
  secondaryActionLabel?: string
  secondaryActionHref?: string
}

/**
 * ============================================================================
 * FOOTER CTA VARIANT 1: THE INVERTED MONOLITH
 * - High-contrast inverted squircle canvas (bg-foreground text-background).
 * - Calibrated vertical balance: Headline & description pushed upwards; tactile
 *   squircle action buttons anchored with proportional breathing room.
 * - Strict Satisium Craft: Zero borders, zero shadows, zero opacity modifiers,
 *   zero monospaced fonts, tactile squircle button geometry (rounded-[14px]).
 * ============================================================================
 */
export function FooterCtaVariant1({
  className,
  heading = "Build your next product with zero friction.",
  description = "A unified architectural foundation for developers who care about craftsmanship, performance, and token discipline.",
  primaryActionLabel = "Explore Documentation",
  primaryActionHref = ROUTES.docsInstall,
  secondaryActionLabel = "Launch Workstation",
  secondaryActionHref = ROUTES.app,
  ...props
}: FooterCtaVariant1Props) {
  return (
    <div
      className={cn(
        "relative flex h-full min-h-[340px] w-full flex-col justify-between overflow-hidden rounded-2xl bg-foreground p-5 text-background sm:rounded-3xl sm:p-6 md:p-8 lg:min-h-0 lg:p-10 xl:p-12",
        className
      )}
      {...props}
    >
      {/* Upper Compartment: Headline & Proposition */}
      <div className="flex max-w-4xl flex-col items-start gap-3 sm:gap-4.5">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-background sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.06]">
          {heading}
        </h2>

        {description && (
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-background sm:text-base md:text-lg">
            {description}
          </p>
        )}
      </div>

      {/* Lower Compartment: Action Buttons anchored with mt-auto */}
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-6 sm:gap-6 lg:pt-8">
        {primaryActionLabel && primaryActionHref && (
          <Link
            href={primaryActionHref}
            className={cn(
              "group inline-flex h-11 items-center justify-center gap-2 rounded-[14px] px-6 font-sans text-xs font-semibold sm:h-12 sm:px-7 sm:text-sm",
              "bg-background text-foreground transition-all hover:bg-muted active:scale-[0.98]",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            )}
          >
            <span>{primaryActionLabel}</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="size-3.5 transition-transform group-hover:translate-x-0.5 sm:size-4"
            />
          </Link>
        )}

        {secondaryActionLabel && secondaryActionHref && (
          <Link
            href={secondaryActionHref}
            className={cn(
              "group inline-flex items-center gap-1.5 font-sans text-xs font-medium text-background sm:text-sm",
              "transition-colors hover:text-muted-foreground",
              "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            )}
          >
            <span>{secondaryActionLabel}</span>
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-4"
            />
          </Link>
        )}
      </div>
    </div>
  )
}
