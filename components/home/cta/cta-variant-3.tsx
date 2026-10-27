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
  CtaAction,
  CtaChassis,
  CtaPortalTrigger,
  type CtaProps,
} from "./cta"

export interface CtaVariant3Props extends Omit<CtaProps, "children"> {
  direction?: "a" | "b"
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
   CTA VARIANT 3: THE MONOLITHIC ACTION (Attio Inspired)
   - Direction A: High-contrast inverted canvas (bg-foreground text-background)
   - Direction B: Concentric achromatic stage (bg-muted chassis + bg-background card)
   - Left: Confident display typography with generous breathing room
   - Right: Oversized tactile directional portal trigger (->)
   - Composed cleanly from shadcn compound CTA primitives.
   ========================================================================== */

export function CtaVariant3({
  className,
  direction = "a",
  eyebrow = "READY TO SHIP",
  heading = "Build your next product with zero friction.",
  description = "Clone the template, run pnpm dev, and ship production-ready web applications with dual docs shells, component registry, and zero-key guarantees.",
  primaryActionLabel = "Explore Documentation",
  primaryActionHref = ROUTES.docsInstall,
  secondaryActionLabel = "Launch Workstation",
  secondaryActionHref = ROUTES.app,
  children,
  ...props
}: CtaVariant3Props) {
  const isDirectionA = direction === "a"

  const cardContent = (
    <div
      className={cn(
        "relative flex flex-col justify-between gap-8 overflow-hidden md:flex-row md:items-end md:gap-10",
        isDirectionA
          ? "rounded-[20px] bg-foreground p-6 text-background sm:rounded-[24px] sm:p-8 md:p-9 lg:p-10"
          : "rounded-[16px] bg-background p-6 text-foreground sm:rounded-[18px] sm:p-8 md:p-9 lg:p-10"
      )}
    >
      {/* Left Column: Command Display Typography & Proposition */}
      <div className="flex max-w-lg flex-col items-start text-left">
        <CtaHeader align="left">
          {eyebrow && (
            <CtaEyebrow
              className={
                isDirectionA ? "text-background" : "text-muted-foreground"
              }
            >
              {eyebrow}
            </CtaEyebrow>
          )}

          {heading && (
            <CtaTitle
              className={isDirectionA ? "text-background" : "text-foreground"}
            >
              {heading}
            </CtaTitle>
          )}

          {description && (
            <CtaDescription
              className={
                isDirectionA ? "text-background" : "text-muted-foreground"
              }
            >
              {description}
            </CtaDescription>
          )}
        </CtaHeader>

        {/* Secondary Action: Containerless Inline Link */}
        {secondaryActionLabel && secondaryActionHref && (
          <div className="mt-5 sm:mt-6">
            <CtaAction
              href={secondaryActionHref}
              variant="secondary"
              external
              className={
                isDirectionA
                  ? "text-background hover:text-background"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {secondaryActionLabel}
            </CtaAction>
          </div>
        )}
      </div>

      {/* Right Flank: Directional Portal Trigger */}
      {primaryActionHref && (
        <CtaPortalTrigger
          href={primaryActionHref}
          label={primaryActionLabel}
          inverted={isDirectionA}
        />
      )}
    </div>
  )

  return (
    <Cta
      id="cta-monolithic"
      className={cn("max-w-5xl px-0 sm:px-6", className)}
      {...props}
    >
      {children ??
        (isDirectionA ? cardContent : <CtaChassis>{cardContent}</CtaChassis>)}
    </Cta>
  )
}
