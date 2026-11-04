"use client"

import * as React from "react"
import Link from "next/link"
import {
  Cancel01Icon,
  GitCompareIcon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { EaseDossier } from "../stage-1-types"

interface CompareQueueSlabProps {
  compareQueue: string[]
  setCompareQueue: React.Dispatch<React.SetStateAction<string[]>>
  activePresetId: string
  isCurrentCurveQueued: boolean
  toggleCompareQueue: () => void
  resolveEase: (id: string) => EaseDossier | undefined
}

export function CompareQueueSlab({
  compareQueue,
  setCompareQueue,
  activePresetId,
  isCurrentCurveQueued,
  toggleCompareQueue,
  resolveEase,
}: CompareQueueSlabProps) {
  return (
    <section
      aria-label="Block 8: Compare Queue"
      className="flex shrink-0 flex-col gap-2.5 rounded-[18px] bg-background p-3.5 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-[10px] font-semibold text-muted-foreground">
            Block 08
          </span>
          <span className="font-heading text-xs font-semibold text-foreground">
            Compare Queue
          </span>
        </div>
        <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[10px] text-muted-foreground">
          {compareQueue.length}/3 Staged
        </span>
      </div>

      {/* Staging Slots */}
      {compareQueue.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[8px] bg-muted p-4 text-center">
          <HugeiconsIcon
            icon={GitCompareIcon}
            className="mb-1.5 size-4 text-muted-foreground"
          />
          <span className="font-heading text-xs font-medium text-foreground">
            Queue is Empty
          </span>
          <p className="mt-1 font-sans text-[11px] text-muted-foreground">
            Press{" "}
            <kbd className="rounded bg-background px-1 py-0.5 font-mono text-[9px] text-foreground">
              C
            </kbd>{" "}
            or click the queue button to stage curves for the Stage 3 duel.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {compareQueue.map((curveId, index) => {
            const dossier = resolveEase(curveId)
            const name = dossier?.name ?? curveId
            const duration = dossier?.duration ?? 300
            const isCurrent = curveId === activePresetId
            return (
              <div
                key={curveId}
                className={cn(
                  "flex items-center justify-between rounded-[8px] px-2.5 py-1.5 transition-colors",
                  isCurrent ? "bg-secondary" : "bg-muted"
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-foreground font-sans text-[9px] font-bold text-background">
                    {index + 1}
                  </span>
                  <span className="truncate font-heading text-xs font-medium text-foreground">
                    {name}
                  </span>
                  {isCurrent && (
                    <span className="shrink-0 rounded-[4px] bg-background px-1 py-0.5 font-sans text-[8px] text-muted-foreground">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 font-sans text-[10px] text-muted-foreground">
                    {duration}ms
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCompareQueue((prev) =>
                        prev.filter((id) => id !== curveId)
                      )
                    }
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    title="Remove from queue"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Actions: Queue Active Curve & Open Stage 3 */}
      <div className="flex items-center gap-1.5 pt-0.5">
        <button
          type="button"
          onClick={toggleCompareQueue}
          className={cn(
            "flex h-7 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] font-heading text-xs font-medium transition-colors",
            isCurrentCurveQueued
              ? "bg-foreground font-semibold text-background"
              : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <HugeiconsIcon icon={GitCompareIcon} className="size-3" />
          <span>
            {isCurrentCurveQueued ? "Queued (C)" : "Queue Current (C)"}
          </span>
        </button>

        <Link
          href={ROUTES.stage3}
          className="flex h-7 cursor-pointer items-center justify-center gap-1 rounded-[8px] bg-muted px-2.5 font-sans text-[11px] font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <span>Duel</span>
          <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-3" />
        </Link>
      </div>

      {/* Integrated Platform Footnote */}
      <div className="flex items-center justify-between pt-1 font-sans text-[10px] text-muted-foreground">
        <a
          href="https://satisium.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          satisium.com ↗
        </a>
        <div className="flex items-center gap-2">
          <a
            href="https://twitter.com/satisium"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Twitter
          </a>
          <span className="text-[10px] text-muted-foreground">·</span>
          <a
            href="https://github.com/satisium"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
