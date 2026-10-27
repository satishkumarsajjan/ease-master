"use client"

import * as React from "react"
import { MotionConfig } from "motion/react"

import { CSPostHogProvider } from "@/components/analytics-provider"
import { ConsentBanner } from "@/components/consent-banner"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ConsentProvider } from "@/lib/consent"

export interface RootProvidersProps {
  children: React.ReactNode
  commandMenu?: React.ReactNode
}

/**
 * Consolidated client-side application providers wrapper.
 * Keeps app/layout.tsx clean and decoupled.
 */
export function RootProviders({ children, commandMenu }: RootProvidersProps) {
  return (
    <ConsentProvider>
      <CSPostHogProvider>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            {children}
            {commandMenu}
          </MotionConfig>
          <Toaster />
        </ThemeProvider>
        <ConsentBanner />
      </CSPostHogProvider>
    </ConsentProvider>
  )
}
