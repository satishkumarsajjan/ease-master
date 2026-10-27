"use client"

import * as React from "react"
import { motion } from "motion/react"
import { SPRING } from "@/lib/motion"

export default function StagePage() {
  const [count, setCount] = React.useState(0)

  const handleAction = () => {
    setCount((c) => c + 1)
  }

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-6 select-none">
      <div className="flex max-w-sm flex-col items-center text-center">
        {/* Directly talks to the user */}
        <h1 className="font-heading text-lg font-medium tracking-tight text-foreground sm:text-xl">
          Give it a tap.
        </h1>

        <p className="mt-2 text-xs text-muted-foreground">
          Notice how the spring settles naturally without an abrupt stop.
        </p>

        {/* High-contrast, theme-resilient button (Zero borders, zero shadows, zero icons) */}
        <div className="mt-6 flex flex-col items-center gap-2.5">
          <motion.button
            type="button"
            onClick={handleAction}
            whileTap={{ scale: 0.96 }}
            transition={SPRING.snappy}
            className="cursor-pointer rounded-[12px] bg-foreground px-5 py-2 font-heading text-xs font-medium text-background transition-colors hover:bg-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {count === 0
              ? "Test the response"
              : `Settled with momentum · ${count}`}
          </motion.button>

          {count > 0 && (
            <span className="font-mono text-[11px] text-muted-foreground">
              Physical spring settled
            </span>
          )}
        </div>
      </div>
    </main>
  )
}
