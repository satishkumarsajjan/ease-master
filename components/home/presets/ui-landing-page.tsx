"use client"

import * as React from "react"
import { HeroVariant1 } from "@/components/home/hero"
import { LogoCloudVariant1 } from "@/components/home/logos"
import { DescriptionScrub } from "@/components/home/description"
import { FeaturesVariant4 } from "@/components/home/features"
import { FaqVariant2 } from "@/components/home/faq"
import {
  LandingBox,
  LandingBoxContent,
  LandingBoxFooter,
} from "@/components/home/landing-box"
import { FooterVariant2 } from "@/components/home/footer"
import { SITE_URL } from "@/lib/config"

export interface UiLandingPageProps {
  className?: string
}

/**
 * ============================================================================
 * UI LANDING PAGE PRESET
 * - Persona: Component libraries, design systems, open registries.
 * - Narrative:
 *     1. HeroVariant1 (UI Typewriter Canvas + Explore Action + Video Preview)
 *     2. LogoCloudVariant1 (Continuous Marquee with Names - Social Proof)
 *     3. DescriptionScrub (Kinetic Sticky Scroll Manifesto)
 *     4. FeaturesVariant4 (4-Card Bento Grid with tactile artifacts)
 *     5. FaqVariant2 (Essential 5-Item Centered Accordion)
 *     6. FooterVariant2 (Fullscreen Terminal Footer Stage with Inverted Monolith CTA & UI Directory Deck)
 * - Invariants:
 *     • Wrapped in signature LandingBox with folded brand index tab.
 *     • Clean, focused narrative without prototype bloat.
 * ============================================================================
 */
export function UiLandingPage({ className }: UiLandingPageProps) {
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
        <LandingBoxContent className="flex flex-col gap-28 pb-0 sm:gap-40 sm:pb-0 md:gap-52 md:pb-0 lg:gap-60 lg:pb-0">
          <HeroVariant1 />
          <LogoCloudVariant1 />
          <DescriptionScrub />
          <FeaturesVariant4 />
          <FaqVariant2 />
        </LandingBoxContent>

        <LandingBoxFooter className="pt-24 sm:pt-36 md:pt-48 lg:pt-52">
          <FooterVariant2 ctaVariant={1} deckVariant={2} />
        </LandingBoxFooter>
      </LandingBox>
    </>
  )
}
