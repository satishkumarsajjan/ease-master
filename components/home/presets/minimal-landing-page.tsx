"use client"

import * as React from "react"
import { HeroVariant2 } from "@/components/home/hero"
import { ShowcaseStage } from "@/components/home/showcase"
import {
  LandingBox,
  LandingBoxContent,
  LandingBoxFooter,
} from "@/components/home/landing-box"
import { FooterVariant3 } from "@/components/home/footer"
import { SITE_URL } from "@/lib/config"

export interface MinimalLandingPageProps {
  className?: string
  /**
   * Optional custom hero component override.
   */
  hero?: React.ReactNode
  /**
   * Whether to include the interactive showcase stage. Default: true.
   */
  showShowcase?: boolean
  /**
   * Additional content between showcase and footer.
   */
  children?: React.ReactNode
}

/**
 * ============================================================================
 * MINIMAL LANDING PAGE PRESET
 * - Persona: Precision utilities, micro-tools, canvas studios (Ease, Type, etc.)
 * - Narrative:
 *     1. Hero (Catalyst Typewriter + Direct Workstation CTA + Preview Canvas)
 *     2. ShowcaseStage (Embedded Live Interactive Playground)
 *     3. FooterVariant3 / MinimalFooter (Sleek single-line typographic footer)
 * - Invariants:
 *     • Wrapped in signature LandingBox (Sliding Monolith Box 1 + Stationary Bedrock Box 2
 *       revealing SATISIUM wordmark stage with folded "A product by Satisium" tab).
 *     • Zero borders, zero dividers/separators, zero shadows.
 *     • Smaller, sleeker text-xs typography standards.
 * ============================================================================
 */
export function MinimalLandingPage({
  className,
  hero,
  showShowcase = true,
  children,
}: MinimalLandingPageProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
              },
            ],
          }),
        }}
      />
      <LandingBox className={className}>
        <LandingBoxContent className="flex flex-col gap-28 pb-0 sm:gap-36 sm:pb-0 md:gap-44 md:pb-0">
          {hero ?? <HeroVariant2 />}
          {showShowcase && <ShowcaseStage />}
          {children}
        </LandingBoxContent>

        <LandingBoxFooter className="pt-20 pb-12 sm:pt-28 sm:pb-16 md:pt-36 md:pb-20">
          <FooterVariant3 />
        </LandingBoxFooter>
      </LandingBox>
    </>
  )
}
