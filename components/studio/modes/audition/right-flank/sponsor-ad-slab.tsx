"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type SponsorVariant = "satisium-ui" | "rent-space"

export interface SponsorAdData {
  headline: string
  socialProof: string
  description: string
  ctaText: string
  ctaUrl: string
}

const SATISIUM_UI_AD: SponsorAdData = {
  headline: "Build faster with Satisium UI",
  socialProof: "Accessible squircle primitives for Next.js.",
  description:
    "Production-ready components, kinetic tokens, and fluid layout foundations crafted for design engineers.",
  ctaText: "Explore Satisium UI",
  ctaUrl: "https://ui.satisium.com",
}

const RENT_SPACE_AD: SponsorAdData = {
  headline: "Feature your product here",
  socialProof: "Reach design engineers, founders, and frontend devs.",
  description:
    "Put your devtool, library, or SaaS directly inside the Ease studio where modern builders craft daily.",
  ctaText: "Rent This Space",
  ctaUrl: "https://github.com/sponsors/satishkumarsajjan",
}

interface SponsorAdSlabProps {
  initialVariant?: SponsorVariant
  className?: string
}

export function SponsorAdSlab({
  initialVariant = "rent-space",
  className,
}: SponsorAdSlabProps) {
  const [variant, setVariant] = React.useState<SponsorVariant>(initialVariant)

  const currentAd = variant === "rent-space" ? RENT_SPACE_AD : SATISIUM_UI_AD

  // Click title to toggle between Rent Space and Satisium UI variant during audition
  const handleToggleVariant = () => {
    setVariant((prev) => (prev === "rent-space" ? "satisium-ui" : "rent-space"))
  }

  return (
    <section
      aria-label="Sponsor & Partner Placement"
      className={cn(
        "flex shrink-0 flex-col gap-2.5 rounded-[18px] bg-background p-4 transition-colors select-none",
        className
      )}
    >
      {/* Clean, Prominent Headline (Clickable to audition between the two variants) */}
      <h3
        onClick={handleToggleVariant}
        title="Click to audition alternate variant"
        className="cursor-pointer font-heading text-sm leading-snug font-semibold tracking-tight text-foreground"
      >
        {currentAd.headline}
      </h3>

      {/* Social Proof / Trust Line */}
      <p className="font-sans text-xs leading-normal text-muted-foreground">
        {currentAd.socialProof}
      </p>

      {/* Concise Value Description */}
      <p className="font-sans text-xs leading-relaxed text-muted-foreground">
        {currentAd.description}
      </p>

      {/* Understated, Inline-Flex Action Button (Matching reference geometry) */}
      <div className="pt-1">
        <a
          href={currentAd.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center justify-center rounded-[8px] bg-secondary px-3.5 font-heading text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
        >
          {currentAd.ctaText}
        </a>
      </div>
    </section>
  )
}
