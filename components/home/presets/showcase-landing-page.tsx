"use client"

import * as React from "react"
import { HeroVariant2 } from "@/components/home/hero"
import {
  LogoCloudVariant1,
  LogoCloudVariant2,
  LogoCloudVariant3,
} from "@/components/home/logos"
import { DescriptionScrub } from "@/components/home/description"
import {
  FeaturesVariant1,
  FeaturesVariant2,
  FeaturesVariant3,
  FeaturesVariant4,
} from "@/components/home/features"
import { ShowcaseStage } from "@/components/home/showcase"
import {
  PricingVariant1,
  PricingVariant2,
  PricingVariant3,
  PricingVariant4,
} from "@/components/home/pricing"
import {
  TestimonialsVariant1,
  TestimonialsVariant2,
} from "@/components/home/testimonials"
import { FaqVariant1, FaqVariant2 } from "@/components/home/faq"
import {
  CtaVariant1,
  CtaVariant2,
  CtaVariant3,
  CtaVariant4,
} from "@/components/home/cta"
import {
  LandingBox,
  LandingBoxContent,
  LandingBoxFooter,
} from "@/components/home/landing-box"
import {
  FooterVariant2,
  DeckBox1Variant1,
  DeckBox1Variant2,
} from "@/components/home/footer"
import { SITE_URL } from "@/lib/config"

function VariantIndicator({
  section,
  variant,
  title,
}: {
  section: string
  variant: string
  title: string
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4 pt-24 pb-6 select-none sm:pt-36 sm:pb-8 md:pt-48 md:pb-10 lg:pt-56 lg:pb-12">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="flex h-6 items-center rounded-md bg-secondary px-2.5 text-[11px] font-semibold tracking-wider text-secondary-foreground uppercase">
          {section}
        </span>
        <span className="text-sm font-semibold tracking-tight text-foreground">
          {variant}
        </span>
        <span className="text-muted-foreground" aria-hidden="true">
          ·
        </span>
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
    </div>
  )
}

export interface ShowcaseLandingPageProps {
  className?: string
}

/**
 * ============================================================================
 * SHOWCASE LANDING PAGE (MASTER VARIANT GALLERY)
 * - Contains all section variants across the 10 marketing stages.
 * - Used during template development to browse, compare, and pick presets.
 * ============================================================================
 */
export function ShowcaseLandingPage({ className }: ShowcaseLandingPageProps) {
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
        {/* ========================================================== */}
        {/* PRIMARY MARKETING STAGE (Full Variant Showcase)            */}
        {/* ========================================================== */}
        <LandingBoxContent className="pb-0 sm:pb-0 md:pb-0">
          {/* Section 1: Hero Stage (Single Chosen Variant) */}
          <HeroVariant2 />

          {/* ========================================================== */}
          {/* Section 2: Logo Cloud Variants                             */}
          {/* ========================================================== */}
          <VariantIndicator
            section="Section 2: Logos"
            variant="Variant 1"
            title="Continuous Marquee with Names"
          />
          <LogoCloudVariant1 />

          <VariantIndicator
            section="Section 2: Logos"
            variant="Variant 2"
            title="Minimal Grid Array"
          />
          <LogoCloudVariant2 />

          <VariantIndicator
            section="Section 2: Logos"
            variant="Variant 3"
            title="Fade Mask Multi-Track Marquee"
          />
          <LogoCloudVariant3 />

          {/* ========================================================== */}
          {/* Section 3: Kinetic Manifesto                               */}
          {/* ========================================================== */}
          <VariantIndicator
            section="Section 3: Manifesto"
            variant="Variant 1"
            title="Kinetic Sticky Scroll-Scrubbed Typography"
          />
          <DescriptionScrub />

          {/* ========================================================== */}
          {/* Section 4: Features Variants                               */}
          {/* ========================================================== */}
          <VariantIndicator
            section="Section 4: Features"
            variant="Variant 1"
            title="The Tactile Folder Stage / Tabs"
          />
          <FeaturesVariant1 />

          <VariantIndicator
            section="Section 4: Features"
            variant="Variant 2"
            title="Kinetic Accordion Stacks"
          />
          <FeaturesVariant2 />

          <VariantIndicator
            section="Section 4: Features"
            variant="Variant 3"
            title="Swiss Spec Quadrants"
          />
          <FeaturesVariant3 />

          <VariantIndicator
            section="Section 4: Features"
            variant="Variant 4"
            title="Bento Grid Artifacts"
          />
          <FeaturesVariant4 />

          {/* ========================================================== */}
          {/* Section 5: Live Interactive Showcase / Sandbox             */}
          {/* ========================================================== */}
          <VariantIndicator
            section="Section 5: Showcase"
            variant="Variant 1"
            title="Interactive Component / Tool Sandbox"
          />
          <ShowcaseStage />

          {/* ========================================================== */}
          {/* Section 6: Pricing Variants                                */}
          {/* ========================================================== */}
          <VariantIndicator
            section="Section 6: Pricing"
            variant="Variant 1"
            title="3-Column Tiered Cards (Monthly / Annual Cadence)"
          />
          <PricingVariant1 />

          <VariantIndicator
            section="Section 6: Pricing"
            variant="Variant 2"
            title="2-Column Comparative Layout (Free Core vs Pro Lifetime)"
          />
          <PricingVariant2 />

          <VariantIndicator
            section="Section 6: Pricing"
            variant="Variant 3"
            title="Swiss Spec Matrix & Full Capability Comparative Table"
          />
          <PricingVariant3 />

          <VariantIndicator
            section="Section 6: Pricing"
            variant="Variant 4"
            title="Dynamic Team Seat Configurator with Slider"
          />
          <PricingVariant4 />

          {/* ========================================================== */}
          {/* Section 7: Testimonials Variants                           */}
          {/* ========================================================== */}
          <VariantIndicator
            section="Section 7: Testimonials"
            variant="Variant 1"
            title="Velocity Marquee (Dual Animated Rows)"
          />
          <TestimonialsVariant1 />

          <VariantIndicator
            section="Section 7: Testimonials"
            variant="Variant 2"
            title="3-Column Social Masonry Grid"
          />
          <TestimonialsVariant2 />

          {/* ========================================================== */}
          {/* Section 8: Frequently Asked Questions Variants             */}
          {/* ========================================================== */}
          <VariantIndicator
            section="Section 8: FAQ"
            variant="Variant 1"
            title="Editorial 2-Column with Category Filter Tabs"
          />
          <FaqVariant1 />

          <VariantIndicator
            section="Section 8: FAQ"
            variant="Variant 2"
            title="Minimalist Single-Column Centered Accordion"
          />
          <FaqVariant2 />

          {/* ========================================================== */}
          {/* Section 9: Call to Action Variants                         */}
          {/* ========================================================== */}
          <VariantIndicator
            section="Section 9: CTA"
            variant="Variant 1"
            title="Inverted Monolith Stage"
          />
          <CtaVariant1 />

          <VariantIndicator
            section="Section 9: CTA"
            variant="Variant 2"
            title="Dual-Box Chassis / Split Action Frame"
          />
          <CtaVariant2 />

          <VariantIndicator
            section="Section 9: CTA"
            variant="Variant 3"
            title="Minimal Linear Ticker"
          />
          <CtaVariant3 />

          <VariantIndicator
            section="Section 9: CTA"
            variant="Variant 4"
            title="Split Command Line Chassis with Copy Terminal"
          />
          <CtaVariant4 />

          {/* ========================================================== */}
          {/* Section 10: Box 1 Directory Deck Variants (Preview)        */}
          {/* ========================================================== */}
          <VariantIndicator
            section="Section 10: Deck Box 1"
            variant="Variant 1"
            title="Tool Deck (Product, Resources, Legal)"
          />
          <div className="w-full rounded-2xl bg-muted p-6 sm:p-8">
            <DeckBox1Variant1 />
          </div>

          <VariantIndicator
            section="Section 10: Deck Box 1"
            variant="Variant 2"
            title="UI Deck (Components, Getting Started, Legal)"
          />
          <div className="w-full rounded-2xl bg-muted p-6 sm:p-8">
            <DeckBox1Variant2 />
          </div>
        </LandingBoxContent>

        {/* ========================================================== */}
        {/* FULL-BLEED TERMINAL FOOTER STAGE                           */}
        {/* ========================================================== */}
        <LandingBoxFooter className="pt-24 sm:pt-36 md:pt-48 lg:pt-52">
          <FooterVariant2 ctaVariant={1} deckVariant={1} />
        </LandingBoxFooter>
      </LandingBox>
    </>
  )
}
