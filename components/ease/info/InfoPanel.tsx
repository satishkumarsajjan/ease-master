"use client"

import { useEaseStore } from "@/store/useEaseStore"
import { CheckCircle2, Info } from "lucide-react"

export const InfoPanel = () => {
  const { presetInfo } = useEaseStore()

  return (
    <div className="flex h-full w-full flex-col border-b border-sidebar-border bg-sidebar p-6">
      {/* Title Header */}
      <div className="mb-3 flex items-center gap-2">
        <Info size={16} className="text-primary" />
        <h2 className="font-mono text-sm font-bold tracking-wider text-sidebar-foreground uppercase">
          {presetInfo.label}
        </h2>
      </div>

      {/* Description */}
      <p className="mb-6 border-l-2 border-sidebar-border pl-3 text-xs leading-relaxed text-muted-foreground">
        {presetInfo.description}
      </p>

      {/* Use Cases */}
      <div>
        <h3 className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Best Use Cases
        </h3>
        <ul className="space-y-2">
          {presetInfo.useCases.map((useCase, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-xs text-sidebar-foreground"
            >
              <CheckCircle2
                size={14}
                className="mt-0.5 shrink-0 text-primary"
              />
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
