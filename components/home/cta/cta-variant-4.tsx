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
  type CtaProps,
} from "./cta"

export interface CtaVariant4Props extends Omit<CtaProps, "children"> {
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
   CTA VARIANT 4: THE HORIZON STAGE (Lucid Inspired)
   - Concentric razor bezel: bg-muted substrate
   - Inner stage: bg-background panoramic card
   - Left-aligned high-clarity typography with calibrated actions
   - Composed cleanly from shadcn compound CTA primitives.
   ========================================================================== */

export function CtaVariant4({
  className,
  eyebrow = "THE PRODUCTION HORIZON",
  heading = "A new standard for web craftsmanship.",
  description = "Built from the ground up with Next.js 15, Fumadocs MDX, and 100% OKLCH design tokens. Start with a unified production foundation designed to scale without friction.",
  primaryActionLabel = "Explore Documentation",
  primaryActionHref = ROUTES.docsInstall,
  secondaryActionLabel = "Launch Workstation",
  secondaryActionHref = ROUTES.app,
  children,
  ...props
}: CtaVariant4Props) {
  return (
    <Cta
      id="cta-horizon-stage"
      className={cn("max-w-5xl px-0 sm:px-6", className)}
      {...props}
    >
      {children ?? (
        <CtaChassis>
          <div className="relative flex min-h-[240px] w-full flex-col justify-center overflow-hidden rounded-[16px] bg-background p-4 sm:min-h-[280px] sm:rounded-[18px] sm:p-8 md:min-h-[300px] md:p-9 lg:p-10">
            {/* Left Column: 38% - 42% Width Constrained Editorial Proposition */}
            <div className="relative z-10 flex w-full max-w-sm flex-col items-start text-left sm:max-w-md lg:max-w-[42%]">
              <CtaHeader align="left">
                {eyebrow && <CtaEyebrow>{eyebrow}</CtaEyebrow>}
                {heading && <CtaTitle>{heading}</CtaTitle>}
                {description && (
                  <CtaDescription className="max-w-sm">
                    {description}
                  </CtaDescription>
                )}
              </CtaHeader>

              {/* Action Unit */}
              <CtaActions align="left" className="mt-6 sm:mt-7">
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
            </div>
          </div>
        </CtaChassis>
      )}
    </Cta>
  )
}
