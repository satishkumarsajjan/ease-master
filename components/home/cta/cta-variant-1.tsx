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
  type CtaProps,
} from "./cta"

export interface CtaVariant1Props extends Omit<CtaProps, "children"> {
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
   CTA VARIANT 1: THE MINIMALIST CLIMAX (Invertase Inspired Direction A)
   Strict optical proportions: 40px primary button + containerless secondary link.
   Composed cleanly from shadcn compound CTA primitives.
   ========================================================================== */

export function CtaVariant1({
  className,
  eyebrow = "START CRAFTING TODAY",
  heading = "Transform your developer experience.",
  description = "Clone the template, run pnpm dev, and ship production-ready web applications with dual docs shells, component registry, and zero-key guarantees.",
  primaryActionLabel = "Explore Documentation",
  primaryActionHref = ROUTES.docsInstall,
  secondaryActionLabel = "Launch Workstation",
  secondaryActionHref = ROUTES.app,
  children,
  ...props
}: CtaVariant1Props) {
  return (
    <Cta
      id="cta"
      className={cn("max-w-3xl px-0 text-center sm:px-6", className)}
      {...props}
    >
      {children ?? (
        <>
          {/* 1. TYPOGRAPHIC HEADER */}
          <CtaHeader align="center">
            {eyebrow && <CtaEyebrow>{eyebrow}</CtaEyebrow>}
            {heading && <CtaTitle>{heading}</CtaTitle>}
            {description && <CtaDescription>{description}</CtaDescription>}
          </CtaHeader>

          {/* 2. PROPORTIONAL ASYMMETRIC ACTION UNIT */}
          <CtaActions align="center" className="mt-8 sm:mt-10">
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
        </>
      )}
    </Cta>
  )
}
