export const pulseCardFile = `"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export interface PulseCardProps {
  title?: string
  description?: string
  className?: string
}

/**
 * PulseCard — the starter's canonical registry component.
 * Zero internal dependencies beyond \`motion\` + \`cn\`, so it installs cleanly via the CLI.
 */
export function PulseCard({
  title = "Pulse Card",
  description = "A minimal, distributable registry component.",
  className,
}: PulseCardProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-6",
        className
      )}
    >
      <motion.span
        aria-hidden="true"
        className="absolute -top-16 -right-16 size-40 rounded-full bg-primary blur-2xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex flex-col gap-2">
        <h3 className="font-heading text-h5 font-bold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
`

export const pulseCardDemoFile = `import { PulseCard } from "@/registry/ui/pulse-card"

export default function PulseCardDemo() {
  return (
    <div className="flex min-h-[320px] w-full items-center justify-center p-8">
      <PulseCard
        title="Pulse Card"
        description="Distributed through the registry, rendered by the previewer."
      />
    </div>
  )
}
`
