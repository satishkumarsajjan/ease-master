"use client"

import * as React from "react"
import { MinimalLandingPage } from "@/components/home/presets"
import { HeroVariant2 } from "@/components/home/hero"
import { PROJECT } from "@/lib/config"
import { ROUTES } from "@/lib/routes"

export default function LandingPage() {
  return (
    <MinimalLandingPage
      hero={
        <HeroVariant2
          text="ease.satisium.com"
          badgeText="v1.0"
          prefixLength={4}
          description={
            <>
              Interactive cubic-bezier editor and spring physics studio for
              modern design engineers.
              <br className="hidden sm:inline" />
              Export production-ready curves to CSS, Tailwind, GSAP, and Motion.
            </>
          }
          exploreHref={ROUTES.app}
          exploreText="Open Studio"
          repo={PROJECT.github}
          annotation1Text={
            <span className="inline-block leading-tight select-none">
              <span className="block text-base font-medium text-muted-foreground sm:text-[18px]">
                Everything is code,
              </span>
              <span className="-mt-0.5 block text-[19px] font-semibold tracking-tight text-foreground sm:text-[21px]">
                Motion & physics
              </span>
            </span>
          }
        />
      }
    />
  )
}
