"use client"

import * as React from "react"
import Link from "next/link"
import { SatisiumLogo } from "@/components/satisium-logo"
import { ROUTES } from "@/lib/routes"
import { AUTHOR, AUTHOR_SOCIALS, FOOTER_SOCIALS } from "@/lib/social-links"
import { cn } from "@/lib/utils"
import { FooterSocialDock } from "../footer"

export interface DeckBox2Variant1Props extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

interface SatisiumProductItem {
  name: string
  description: string
  href: string
  status?: "live" | "soon"
}

const SATISIUM_SUITE: SatisiumProductItem[] = [
  {
    name: "Satisium UI",
    description: "Component library & open registry",
    href: "https://ui.satisium.com",
    status: "live",
  },
  {
    name: "Tweak",
    description: "In-browser SVG & control canvas",
    href: "https://tweak.satisium.com",
    status: "live",
  },
  {
    name: "Ease",
    description: "Spring physics & motion curve studio",
    href: "https://ease.satisium.com",
    status: "live",
  },
  {
    name: "Typeset",
    description: "Fluid type-scale & font pairing",
    href: "#typeset-soon",
    status: "soon",
  },
]

/**
 * ============================================================================
 * DECK BOX 2 (VARIANT 1): THE SATISIUM UMBRELLA DIRECTORY DECK (Direction 1)
 * - Attached strictly to Box 2 (Stationary bedrock revealed behind monolith).
 * - Focused 100% on the Satisium parent ecosystem & its creator.
 * - Direction 1 Dual-Bookend Architecture:
 *     • Top-Left: Satisium Brand Anchor + Satisium Social Squircles Dock.
 *     • Top-Right: Products & Legal columns anchored flush to the right rail.
 *     • Bottom-Left: Clean copyright datum.
 *     • Bottom-Right: Creator attribution + Creator Social Squircles Dock.
 * - Strict Satisium Craft: Zero borders, zero drop shadows, zero opacity modifiers,
 *   pure semantic tokens, generous negative space above the SATISIUM wordmark.
 * ============================================================================
 */
export function DeckBox2Variant1({
  className,
  children,
  ...props
}: DeckBox2Variant1Props) {
  const currentYear = new Date().getFullYear()

  return (
    <div
      className={cn(
        "flex w-full flex-col justify-between px-5 pt-8 pb-4 select-none sm:px-8 md:px-12 lg:px-16",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {/* Main Matrix: Left Satisium Brand Island + Right Directory Columns */}
          <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
            {/* Left Flank: Satisium Umbrella Identity & Brand Socials */}
            <div className="flex w-full shrink-0 flex-col items-start gap-3.5 lg:max-w-xs xl:max-w-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center">
                  <SatisiumLogo size="100%" />
                </span>
                <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
                  Satisium
                </span>
              </div>

              <p className="max-w-xs font-sans text-xs leading-relaxed text-muted-foreground">
                Independent design engineering tools and UI primitives crafted
                for solo founders.
              </p>

              <div className="pt-1">
                <FooterSocialDock
                  socials={FOOTER_SOCIALS}
                  buttonClassName="bg-background hover:bg-background"
                />
              </div>
            </div>

            {/* Right Flank: Pure Typographic Columns (Products & Legal) Flush to Right Rail */}
            <div className="w-full lg:ml-auto lg:max-w-md lg:flex-1 xl:max-w-lg">
              <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:flex sm:justify-between sm:gap-12 lg:gap-16">
                {/* Column 1: Products */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-heading text-xs font-semibold tracking-wider text-foreground uppercase">
                    Products
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {SATISIUM_SUITE.map((item) => (
                      <li
                        key={item.name}
                        className="flex flex-col items-start gap-0.5"
                      >
                        <div className="flex items-center gap-2">
                          {item.status === "soon" ? (
                            <span className="font-heading text-xs font-medium text-muted-foreground">
                              {item.name}
                            </span>
                          ) : (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noreferrer"
                              className="font-heading text-xs font-medium text-foreground transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                            >
                              {item.name}
                            </a>
                          )}
                          {item.status === "soon" && (
                            <span className="flex shrink-0 items-center justify-center rounded-[5px] bg-primary px-1.5 py-[1.5px] font-mono text-[9px] font-bold tracking-widest text-primary-foreground uppercase">
                              SOON
                            </span>
                          )}
                        </div>
                        <span className="font-sans text-[11px] text-muted-foreground">
                          {item.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Legal */}
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

          {/* Bottom Baseline - ZERO borders, pure spacing and Direction 1 Dual Bookends */}
          <div className="mt-8 flex w-full flex-col items-start justify-between gap-4 font-sans text-xs text-muted-foreground sm:mt-10 sm:flex-row sm:items-center lg:mt-12">
            <div>© {currentYear} Satisium. All rights reserved.</div>

            {/* Creator Attribution paired with Creator Social Squircles on Right Rail */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <span>Crafted with precision by</span>
              <a
                href={AUTHOR.website}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground underline-offset-4 transition-colors hover:underline focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              >
                {AUTHOR.name}
              </a>
              <FooterSocialDock
                socials={AUTHOR_SOCIALS}
                buttonClassName="bg-background hover:bg-background"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
