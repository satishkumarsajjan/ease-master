"use client"

import * as React from "react"
import { BEZIER_PRESETS, SPRING_PRESETS } from "@/core/presets"
import { MiniGraph } from "@/components/ui/mini-graph"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useEaseStore } from "@/store/useEaseStore"

export function PresetSidebar() {
  const { mode, bezier, spring, applyPreset } = useEaseStore()

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-8 p-4">
          {/* GROUP 1: SPRINGS */}
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Springs
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {SPRING_PRESETS.map((item) => {
                const isActive =
                  mode === "spring" &&
                  spring.stiffness === item.value.stiffness &&
                  spring.damping === item.value.damping &&
                  spring.mass === item.value.mass

                return (
                  <button
                    key={item.id}
                    onClick={() => applyPreset("spring", item)}
                    className={cn(
                      "group flex flex-col items-center gap-2 rounded-md border border-transparent p-2 transition-all",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-border"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <div className="relative h-12 w-12 opacity-80 transition-opacity group-hover:opacity-100">
                      <MiniGraph
                        mode="spring"
                        spring={item.value}
                        className="stroke-chart-2 h-full w-full stroke-2"
                      />
                    </div>
                    <span className="w-full truncate text-center text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* GROUP 2: BEZIERS */}
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Beziers & Powers
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {BEZIER_PRESETS.map((item) => {
                const isActive =
                  mode === "bezier" &&
                  bezier.p1.x === item.value.p1.x &&
                  bezier.p1.y === item.value.p1.y &&
                  bezier.p2.x === item.value.p2.x &&
                  bezier.p2.y === item.value.p2.y

                return (
                  <button
                    key={item.id}
                    onClick={() => applyPreset("bezier", item)}
                    className={cn(
                      "group flex flex-col items-center gap-2 rounded-md border border-transparent p-2 transition-all",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-border"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <div className="relative h-12 w-12 opacity-80 transition-opacity group-hover:opacity-100">
                      <MiniGraph
                        mode="bezier"
                        bezier={item.value}
                        className="stroke-chart-5 h-full w-full stroke-2"
                      />
                    </div>
                    <span className="w-full truncate text-center text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
