"use client"

import * as React from "react"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
import {
  Cta,
  CtaHeader,
  CtaEyebrow,
  CtaTitle,
  CtaDescription,
  CtaActions,
  CtaAction,
  CtaChassis,
  CtaCard,
  type CtaProps,
} from "./cta"

export interface CtaVariant2Props extends Omit<CtaProps, "children"> {
  eyebrow?: string
  heading?: string
  description?: string
  primaryActionLabel?: string
  primaryActionHref?: string
  secondaryActionLabel?: string
  secondaryActionHref?: string
  children?: React.ReactNode
}

/* ==========================================================================
   CTA VARIANT 2: DUAL-BOX CHASSIS (Satisium Razor Bezel)
   - Outer Chassis: bg-muted substrate
   - Left Box: bg-background content card (62%)
   - Right Box: bg-background placeholder card (38%)
   - Composed cleanly from shadcn compound CTA primitives.
   ========================================================================== */

export function CtaVariant2({
  className,
  eyebrow = "ARCHITECTURE & ECOSYSTEM",
  heading = "Everything connected. Ready to scale.",
  description = "Stop wasting 40 hours stitching together docs shells, design tokens, and health checks from scratch. Satisium delivers a unified production foundation on day one.",
  primaryActionLabel = "Explore Documentation",
  primaryActionHref = ROUTES.docsInstall,
  secondaryActionLabel = "Launch Workstation",
  secondaryActionHref = ROUTES.app,
  children,
  ...props
}: CtaVariant2Props) {
  return (
    <Cta
      id="cta-dual-box"
      className={cn("max-w-5xl px-0 sm:px-6", className)}
      {...props}
    >
      {children ?? (
        <CtaChassis className="flex flex-col gap-1 sm:gap-1.5 lg:min-h-[360px] lg:flex-row lg:items-stretch">
          {/* LEFT BOX: Editorial Content Card */}
          <CtaCard className="lg:w-[62%]">
            <CtaHeader align="left">
              {eyebrow && <CtaEyebrow>{eyebrow}</CtaEyebrow>}
              {heading && <CtaTitle>{heading}</CtaTitle>}
              {description && <CtaDescription>{description}</CtaDescription>}
            </CtaHeader>

            <CtaActions align="left" className="mt-7 sm:mt-8">
              {primaryActionLabel && primaryActionHref && (
                <CtaAction href={primaryActionHref} variant="primary">
                  {primaryActionLabel}
                </CtaAction>
              )}

              {secondaryActionLabel && secondaryActionHref && (
                <CtaAction href={secondaryActionHref} variant="secondary">
                  {secondaryActionLabel}
                </CtaAction>
              )}
            </CtaActions>
          </CtaCard>

          {/* RIGHT BOX: Placeholder Card for future extensions / interactive nodes */}
          <div
            id="cta-placeholder-box"
            aria-hidden="true"
            className="relative flex min-h-[200px] w-full flex-1 items-center justify-center overflow-hidden rounded-[16px] bg-background sm:rounded-[18px] lg:min-h-0 lg:w-[38%]"
          />
        </CtaChassis>
      )}
    </Cta>
  )
}
