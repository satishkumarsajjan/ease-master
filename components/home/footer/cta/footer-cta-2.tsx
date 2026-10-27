"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Copy01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"

import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

export interface FooterCtaVariant2Props extends React.ComponentProps<"div"> {
  className?: string
  eyebrow?: string
  heading?: string
  description?: string
  primaryActionLabel?: string
  primaryActionHref?: string
  secondaryActionLabel?: string
  secondaryActionHref?: string
  cliCommand?: string
}

const ARCHITECTURE_PILLARS = [
  "Next.js 16.3 Turbopack",
  "100% OKLCH Color Tokens",
  "Zero-Key Boot Guarantee",
] as const

/**
 * ============================================================================
 * FOOTER CTA VARIANT 2: TWIN INVERTED MONOLITHS (Dual-Box Climax)
 * - Direction A: Two discrete squircle cards side-by-side with zero outer wrapping box.
 * - Both boxes feature the high-contrast inverted canvas (bg-foreground text-background).
 * - Left Box (62%): Editorial command card with headline, proposition, and
 *   tactile squircle action buttons (rounded-[14px]).
 * - Right Box (38%): High-contrast inverted companion card featuring a dark CLI
 *   terminal node with 1-click clipboard feedback + live architecture pillars.
 * - Strict Satisium Craft: Zero borders, zero drop shadows, zero opacity modifiers,
 *   zero monospaced fonts, pure semantic color tokens.
 * ============================================================================
 */
export function FooterCtaVariant2({
  className,
  eyebrow = "ARCHITECTURE & ECOSYSTEM",
  heading = "Everything connected. Ready to scale.",
  description = "Stop wasting 40 hours stitching together docs shells, design tokens, and health checks from scratch. Satisium delivers a unified production foundation on day one.",
  primaryActionLabel = "Explore Documentation",
  primaryActionHref = ROUTES.docsInstall,
  secondaryActionLabel = "Launch Workstation",
  secondaryActionHref = ROUTES.app,
  cliCommand = "pnpm dlx @satisium/cli@latest init",
  ...props
}: FooterCtaVariant2Props) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(() => {
    if (typeof window === "undefined" || !navigator.clipboard) return
    navigator.clipboard.writeText(cliCommand)
    setCopied(true)
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [cliCommand])

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[360px] w-full flex-col gap-1.5 sm:gap-2 lg:min-h-0 lg:flex-row lg:items-stretch",
        className
      )}
      {...props}
    >
      {/* ==================================================================
          LEFT BOX: INVERTED EDITORIAL COMMAND CARD (62% Desktop Width)
          Vertical Balance: Headline pushed up, Squircle actions pushed down.
          ================================================================== */}
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl bg-foreground p-5 text-background sm:rounded-3xl sm:p-6 md:p-7 lg:w-[62%] lg:p-8">
        {/* Upper: Eyebrow + Headline + Description */}
        <div className="flex max-w-xl flex-col items-start gap-2.5 sm:gap-3">
          {eyebrow && (
            <span className="font-heading text-xs font-semibold tracking-wider text-background uppercase">
              {eyebrow}
            </span>
          )}

          <h2 className="font-heading text-2xl font-bold tracking-tight text-background sm:text-3xl md:text-4xl lg:text-5xl lg:leading-[1.08]">
            {heading}
          </h2>

          {description && (
            <p className="mt-1 max-w-lg font-sans text-xs leading-relaxed text-background sm:text-sm md:text-base">
              {description}
            </p>
          )}
        </div>

        {/* Lower: Tactile Squircle Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-6 sm:gap-6">
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

      {/* ==================================================================
          RIGHT BOX: INVERTED QUICKSTART ARTIFACT (38% Desktop Width)
          Dark contrast CLI bar inside inverted white card + Production pillars.
          ================================================================== */}
      <div className="relative flex h-full w-full flex-1 flex-col justify-between overflow-hidden rounded-2xl bg-foreground p-5 text-background sm:rounded-3xl sm:p-6 md:p-7 lg:min-h-0 lg:w-[38%] lg:p-8">
        {/* Upper: High-Contrast Dark CLI Node */}
        <div className="flex flex-col items-start gap-2.5">
          <span className="font-heading text-xs font-semibold tracking-wider text-background uppercase">
            CLI Quickstart
          </span>

          <div className="flex w-full items-center justify-between gap-3 rounded-xl bg-background p-3 text-foreground sm:p-3.5">
            <span className="font-sans text-xs font-medium text-foreground select-all sm:text-sm">
              {cliCommand}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              aria-label={
                copied ? "Command copied" : "Copy command to clipboard"
              }
              className={cn(
                "group flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-muted text-muted-foreground",
                "transition-colors duration-150 hover:bg-secondary hover:text-foreground active:scale-95",
                "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              )}
            >
              <HugeiconsIcon
                icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
                className={cn(
                  "size-4 transition-colors",
                  copied
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
            </button>
          </div>
        </div>

        {/* Lower: Architecture Pillars */}
        <div className="flex flex-col gap-2 pt-6">
          <span className="font-heading text-[11px] font-semibold tracking-wider text-background uppercase">
            Production Pillars
          </span>
          <div className="flex flex-col gap-1.5">
            {ARCHITECTURE_PILLARS.map((pillar) => (
              <div
                key={pillar}
                className="flex items-center gap-2 font-sans text-xs font-medium text-background sm:text-sm"
              >
                <span className="size-1.5 rounded-full bg-primary" />
                <span>{pillar}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
