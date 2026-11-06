"use client"

import * as React from "react"
import { BrandSlab } from "@/components/studio/common/brand-slab"
import { PresetCatalog } from "./left-flank/preset-catalog"
import { PreviewTheater } from "./center-stage/preview-theater"
import { TimelineConsole } from "./center-stage/timeline-console"
import { ArchetypeAdvisorSlab } from "./right-flank/archetype-advisor-slab"
import { CompareQueueSlab } from "./right-flank/compare-queue-slab"
import { ExportSlab } from "./right-flank/export-slab"
import { SponsorAdSlab } from "./right-flank/sponsor-ad-slab"

export function AuditionView() {
  return (
    <div className="flex h-full w-full gap-2 overflow-hidden bg-muted font-sans select-none">
      {/* LEFT FLANK: 280px Hug-Fill-Hug */}
      <aside className="flex h-full min-h-0 w-[280px] shrink-0 flex-col gap-2">
        <BrandSlab />
        <PresetCatalog />
      </aside>

      {/* CENTER STAGE: Hero Canvas & Master Console */}
      <main className="flex min-w-0 flex-1 flex-col gap-2">
        <PreviewTheater />
        <TimelineConsole />
      </main>

      {/* RIGHT FLANK: 300px Fixed Width */}
      <aside className="flex w-[300px] shrink-0 flex-col gap-2">
        <ArchetypeAdvisorSlab />
        <CompareQueueSlab />
        <ExportSlab />
        <SponsorAdSlab />
      </aside>
    </div>
  )
}
