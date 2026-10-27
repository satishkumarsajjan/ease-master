"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Footer,
  FooterBrandIsland,
  FooterNavMatrix,
  FooterBaseline,
  type FooterProps,
} from "./footer"

export type FooterVariant1Props = FooterProps

/**
 * ============================================================================
 * FOOTER VARIANT 1: THE DISCRETE SEMANTIC ISLANDS
 * - Left Flank: Brand Anchor & Tactile Squircle Social Dock
 * - Right Flank: 4-Column Directory Matrix (FOOTER_NAV)
 * - Baseline: Pure Spacing Baseline with Legal & Attribution
 * - Composed cleanly from shadcn compound Footer primitives.
 * ============================================================================
 */
export function FooterVariant1({
  className,
  children,
  ...props
}: FooterVariant1Props) {
  return (
    <Footer
      aria-label="Site Footer"
      className={cn(
        "relative flex w-full flex-col px-6 pt-26 pb-8 select-none sm:px-10 sm:pt-38 sm:pb-10 md:pt-50 lg:px-16 lg:pb-12 xl:px-20",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {/* TOP ROW: Two Discrete Semantic Islands (Left Brand Anchor + Right Directory Matrix) */}
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16 xl:gap-24">
            <FooterBrandIsland />
            <FooterNavMatrix />
          </div>

          {/* BOTTOM ROW: Pure Spacing Baseline with Legal & Attribution */}
          <FooterBaseline />
        </>
      )}
    </Footer>
  )
}
