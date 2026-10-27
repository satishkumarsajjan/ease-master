"use client"

import * as React from "react"
import { HeroVariant2 } from "@/components/home/hero"
import { DescriptionScrub } from "@/components/home/description"
import { FeaturesVariant4 } from "@/components/home/features"
import { ShowcaseStage } from "@/components/home/showcase"
import { FaqVariant2 } from "@/components/home/faq"
import { CtaVariant1 } from "@/components/home/cta"
import {
  LandingBox,
  LandingBoxContent,
  LandingBoxFooter,
} from "@/components/home/landing-box"
import { DeckBox1Variant1 } from "@/components/home/footer"
import { SITE_URL } from "@/lib/config"

export interface ToolLandingPageProps {
  className?: string
}

/**
 * ============================================================================
 * TOOL LANDING PAGE PRESET
 * - Persona: Interactive web apps, precision utilities, canvas editors.
 * - Narrative:
 *     1. HeroVariant2 (Catalyst Typewriter + Video Stage + Theme Switcher)
 *     2. DescriptionScrub (Kinetic Sticky Scroll Manifesto)
 *     3. FeaturesVariant4 (4-Card Bento Grid with tactile artifacts)
 *     4. ShowcaseStage (Embedded Live Interactive Sandbox)
 *     5. FaqVariant2 (Essential 5-Item Centered Accordion)
 *     6. CtaVariant1 (Inverted Monolith Stage)
 *     7. DeckBox1Variant1 (3-Column Tool Deck: Product, Resources, Legal)
 * - Invariants:
 *     • Wrapped in signature LandingBox with folded brand index tab.
 *     • Zero logo clouds.
 *     • Zero pricing tables (free and open source tool).
 *     • Zero full-screen footers.
 * ============================================================================
 */
export function ToolLandingPage({ className }: ToolLandingPageProps) {
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
          <HeroVariant2 />
          <DescriptionScrub />
          <FeaturesVariant4 />
          <ShowcaseStage />
          <FaqVariant2 />
          <CtaVariant1 />
        </LandingBoxContent>

        <LandingBoxFooter className="pt-24 pb-16 sm:pt-36 sm:pb-20 md:pt-48 md:pb-24 lg:pt-56 lg:pb-28">
          <DeckBox1Variant1 />
        </LandingBoxFooter>
      </LandingBox>
    </>
  )
}
