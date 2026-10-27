"use client"

import * as React from "react"
import Link from "next/link"
import { SatisiumLogo } from "@/components/satisium-logo"
import { PRODUCT } from "@/config/site"
import { ROUTES } from "@/lib/routes"
import { AUTHOR, FOOTER_SOCIALS, PROJECT } from "@/lib/social-links"
import { cn } from "@/lib/utils"
import { FooterSocialDock } from "../footer"

export interface DeckBox1Variant1Props extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

/**
 * ============================================================================
 * DECK BOX 1 (VARIANT 1): THE TOOL DIRECTORY DECK
 * - Tailored for interactive tools, canvas apps, and precision utilities.
 * - Disciplined 3-Column Layout:
 *     1. Product (Canvas, Features, Workflows)
 *     2. Resources (Docs, Shortcuts, Changelog)
 *     3. Legal (Privacy, Terms, Source)
 * - Strict Right-Rail Alignment:
 *     • Left Flank: Brand mark, 1-line description, and tactile squircle dock.
 *     • Right Flank: Right-anchored matrix with Column 3 flush to the right boundary.
 *     • Baseline: Balanced 2-point bookends flush to left & right rails.
 * - Strict Satisium Craft: Zero borders, zero drop shadows, zero opacity modifiers.
 * ============================================================================
 */
export function DeckBox1Variant1({
  className,
  children,
  ...props
}: DeckBox1Variant1Props) {
  const currentYear = new Date().getFullYear()

  return (
    <div
      className={cn(
        "flex w-full flex-col justify-between px-5 pt-4 pb-2 select-none sm:px-6 md:px-8 lg:px-10 xl:px-12",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {/* Main Matrix: Left Brand Island + Right-Anchored Directory Matrix Bookend */}
          <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
            {/* Left: Product Anchor Island */}
            <div className="flex w-full shrink-0 flex-col items-start gap-4 lg:max-w-xs xl:max-w-sm">
              <Link
                href={ROUTES.home}
                className="flex items-center gap-2.5 font-heading text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span className="flex size-5 shrink-0 items-center justify-center">
                  <SatisiumLogo size="100%" />
                </span>
                <span>{PRODUCT.name}</span>
              </Link>

              {PRODUCT.description && (
                <p className="max-w-xs font-sans text-xs leading-relaxed text-muted-foreground">
                  {PRODUCT.description}
                </p>
              )}

              {/* Tactile Squircle Social Dock */}
              <FooterSocialDock socials={FOOTER_SOCIALS} />
            </div>

            {/* Right: 3 Columns Right-Anchored Flush to Right Boundary */}
            <div className="w-full lg:ml-auto lg:max-w-xl lg:flex-1 xl:max-w-2xl">
              <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:flex sm:justify-between sm:gap-8 lg:gap-12">
                {/* Column 1: Product */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-heading text-xs font-semibold tracking-wider text-foreground uppercase">
                    Product
                  </h3>
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link
                        href={ROUTES.app}
                        className="font-sans text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        App Canvas
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={ROUTES.stage}
                        className="font-sans text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        Design Sandbox
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={ROUTES.docs}
                        className="font-sans text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        Documentation
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Resources */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-heading text-xs font-semibold tracking-wider text-foreground uppercase">
                    Resources
                  </h3>
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link
                        href={ROUTES.docsInstall}
                        className="font-sans text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        Quickstart
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={ROUTES.changelog}
                        className="font-sans text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        Changelog
                      </Link>
                    </li>
                    <li>
                      <a
                        href={PROJECT.github}
                        target="_blank"
                        rel="noreferrer"
                        className="font-sans text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        Source Code
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Legal (Flush to the right rail) */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-heading text-xs font-semibold tracking-wider text-foreground uppercase">
                    Legal
                  </h3>
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link
                        href={ROUTES.privacy}
                        className="font-sans text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={ROUTES.terms}
                        className="font-sans text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={ROUTES.cookies}
                        className="font-sans text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        Cookie Settings
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Baseline - ZERO borders, pure spacing and calm 2-point bookends flush to rails */}
          <div className="mt-8 flex w-full flex-col items-start justify-between gap-4 font-sans text-xs text-muted-foreground sm:mt-10 sm:flex-row sm:items-center lg:mt-12">
            <div>
              © {currentYear} {PRODUCT.name}. All rights reserved.
            </div>

            {/* Right attribution anchored flush to the right rail */}
            <div className="flex items-center gap-1">
              <span>Crafted with precision by</span>
              <a
                href={AUTHOR.website}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground underline-offset-4 transition-colors hover:underline focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              >
                {AUTHOR.name}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
