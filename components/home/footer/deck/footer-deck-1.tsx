"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { FooterBrandIsland, FooterNavMatrix, FooterBaseline } from "../footer"

export interface FooterDeckVariant1Props extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

/**
 * ============================================================================
 * FOOTER DECK VARIANT 1: THE TWO-ISLAND DIRECTORY MATRIX
 * - Left Flank: Brand Anchor Island (Logo, Proposition, Squircle Social Dock).
 * - Right Flank: 4-Column Directory Matrix with Column 4 flush to right boundary.
 * - Lower Half: Pure Spacing Baseline (Legal & Creator Attribution).
 * - Composed cleanly from shadcn compound Footer primitives.
 * ============================================================================
 */
export function FooterDeckVariant1({
  className,
  children,
  ...props
}: FooterDeckVariant1Props) {
  return (
    <div
      className={cn(
        "flex w-full flex-col justify-between px-5 pt-2 sm:px-6 md:px-8 lg:px-10 xl:px-12",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {/* Top Half: Left Brand Island + Right-Anchored Directory Matrix Bookend */}
          <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
            <FooterBrandIsland className="w-full shrink-0 lg:max-w-xs xl:max-w-sm" />
            <div className="w-full lg:ml-auto lg:max-w-2xl lg:flex-1 xl:max-w-3xl">
              <FooterNavMatrix />
            </div>
          </div>

          {/* Bottom Half: Pure Spacing Baseline */}
          <FooterBaseline />
        </>
      )}
    </div>
  )
}
