"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ActivePresetMeta } from "../stage-1-types"

interface ExportSlabProps {
  activePresetMeta: ActivePresetMeta
  exportFramework: "CSS" | "Tailwind" | "Motion" | "SwiftUI"
  setExportFramework: (fw: "CSS" | "Tailwind" | "Motion" | "SwiftUI") => void
  hasCopiedToken: boolean
  handleCopyToken: () => void
  getExportSnippet: () => string
}

export function ExportSlab({
  activePresetMeta,
  exportFramework,
  setExportFramework,
  hasCopiedToken,
  handleCopyToken,
  getExportSnippet,
}: ExportSlabProps) {
  return (
    <section
      aria-label="Block 7: Production Export Slab"
      className="no-scrollbar flex min-h-0 flex-1 flex-col justify-between overflow-y-auto rounded-[20px] bg-background p-3.5 transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[11px] font-medium text-muted-foreground">
            Block 07 · Production Export
          </span>
          <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[10px] text-muted-foreground">
            300px
          </span>
        </div>
        <h2 className="font-heading text-sm font-semibold text-foreground">
          Production Export
        </h2>
        <p className="text-xs leading-relaxed text-muted-foreground">
          First-class multi-framework handoff with token fidelity.
        </p>
      </div>

      {/* Central Export Deck */}
      <div className="my-auto flex flex-col gap-3 py-2">
        <div className="flex flex-col gap-2.5 rounded-[14px] bg-secondary p-3">
          {/* Framework Switcher Tabs */}
          <div className="flex h-8 w-full items-center justify-between rounded-[8px] bg-background p-1">
            {(["CSS", "Tailwind", "Motion", "SwiftUI"] as const).map((fw) => (
              <button
                key={fw}
                type="button"
                onClick={() => setExportFramework(fw)}
                className={cn(
                  "flex-1 cursor-pointer rounded-[6px] py-0.5 text-center font-heading text-[11px] font-medium transition-colors",
                  exportFramework === fw
                    ? "bg-foreground font-semibold text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {fw}
              </button>
            ))}
          </div>

          {/* High-Contrast Neutral Copy Action */}
          <button
            type="button"
            onClick={handleCopyToken}
            className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-foreground px-3 font-heading text-xs font-semibold text-background transition-transform active:scale-95"
          >
            <span>
              {hasCopiedToken ? "Copied to Clipboard!" : "Copy Ease Token"}
            </span>
            <kbd className="rounded-[4px] bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">
              ⌘C
            </kbd>
          </button>

          {/* Code Snippet Output Box */}
          <div className="flex flex-col gap-1.5 rounded-[8px] bg-background p-2.5">
            <div className="flex items-center justify-between font-sans text-[10px] text-muted-foreground">
              <span className="font-medium text-foreground">
                {exportFramework} Output
              </span>
              <span className="max-w-[130px] truncate text-right">
                {activePresetMeta.name}
              </span>
            </div>
            <code className="font-mono text-[10px] leading-tight break-all whitespace-pre-wrap text-foreground">
              {getExportSnippet()}
            </code>
          </div>
        </div>

        {/* Quick Settle Specs Readout */}
        <div className="flex items-center justify-between rounded-[10px] bg-muted px-3 py-2 font-sans text-[11px]">
          <span className="text-muted-foreground">Settle duration:</span>
          <span className="font-semibold text-foreground">
            {activePresetMeta.duration}ms
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 font-sans text-[10px] text-muted-foreground">
        <span>Omnipresent Across Stages</span>
        <span>Zero-Friction Handoff</span>
      </div>
    </section>
  )
}
