"use client"

import * as React from "react"
import { FooterCtaVariant1, FooterCtaVariant2 } from "./cta"
import { DeckBox1Variant1, DeckBox1Variant2 } from "./deck-box-1"
import { cn } from "@/lib/utils"

export interface FooterVariant2Props extends React.ComponentProps<"footer"> {
  className?: string
  cta?: React.ReactNode
  deck?: React.ReactNode
  ctaVariant?: 1 | 2
  deckVariant?: 1 | 2
  eyebrow?: string
  heading?: string
  description?: string
  primaryActionLabel?: string
  primaryActionHref?: string
  secondaryActionLabel?: string
  secondaryActionHref?: string
  cliCommand?: string
}

/**
 * ============================================================================
 * FOOTER VARIANT 2: THE FULLSCREEN TERMINAL STAGE (Compound Orchestrator)
 * - Strict Satisium Design Contract: Zero borders, zero shadows, pure surface ramp.
 * - Pure Semantic Tokens: No opacity modifiers (/50), zero monospaced fonts.
 * - Dynamic Viewport Distribution:
 *     • Zone 1 (CTA Stage, flex-1 billboard): Mounts swappable CTA variants:
 *         - ctaVariant={1}: The Inverted Monolith (default)
 *         - ctaVariant={2}: The Dual-Box Chassis (Satisium Razor Bezel)
 *     • Zone 2 (Directory Deck, calibrated shrink-0 height): Mounts swappable
 *       Directory Decks (defaults to FooterDeckVariant1 - The Two-Island Matrix Deck).
 * - Calibrated Outer Bezel: Cohesive frame (p-3 sm:p-4 md:p-5 lg:p-5 xl:p-6).
 * - Multi-Screen Resilience: 100vh locked spectacle on desktop; natural fluid
 *   scrolling on mobile devices.
 * ============================================================================
 */
export interface FooterVariant2CtaProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

/**
 * Zone 1: Flexible CTA Billboard Container
 */
export function FooterVariant2Cta({
  className,
  children,
  ...props
}: FooterVariant2CtaProps) {
  return (
    <div
      className={cn("flex min-h-[340px] w-full flex-1 lg:min-h-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface FooterVariant2DeckProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

/**
 * Zone 2: Calibrated Directory Deck Container
 */
export function FooterVariant2Deck({
  className,
  children,
  ...props
}: FooterVariant2DeckProps) {
  return (
    <div
      className={cn(
        "flex w-full shrink-0 pt-4 pb-1 sm:pt-6 sm:pb-2 md:pt-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function FooterVariant2({
  className,
  children,
  cta,
  deck,
  ctaVariant = 1,
  deckVariant = 1,
  eyebrow,
  heading,
  description,
  primaryActionLabel,
  primaryActionHref,
  secondaryActionLabel,
  secondaryActionHref,
  cliCommand,
  ...props
}: FooterVariant2Props) {
  // 1. Resolve CTA Component (Explicit node > Variant resolution)
  const resolvedCta =
    cta ??
    (ctaVariant === 2 ? (
      <FooterCtaVariant2
        eyebrow={eyebrow}
        heading={heading}
        description={description}
        primaryActionLabel={primaryActionLabel}
        primaryActionHref={primaryActionHref}
        secondaryActionLabel={secondaryActionLabel}
        secondaryActionHref={secondaryActionHref}
        cliCommand={cliCommand}
      />
    ) : (
      <FooterCtaVariant1
        heading={heading}
        description={description}
        primaryActionLabel={primaryActionLabel}
        primaryActionHref={primaryActionHref}
        secondaryActionLabel={secondaryActionLabel}
        secondaryActionHref={secondaryActionHref}
      />
    ))

  // 2. Resolve Directory Deck Component (Explicit node > Variant resolution)
  const resolvedDeck =
    deck ?? (deckVariant === 2 ? <DeckBox1Variant2 /> : <DeckBox1Variant1 />)

  return (
    <footer
      id="footer-terminal-fullscreen"
      aria-label="Terminal Footer"
      className={cn(
        "relative flex min-h-screen w-full flex-col justify-between gap-3 p-3 pb-32 select-none sm:gap-4 sm:p-4 sm:pb-16 md:p-5 md:pb-16 lg:h-screen lg:min-h-0 lg:p-5 lg:pb-16 xl:p-6 xl:pb-16",
        className
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        <>
          {/* Zone 1: Flexible CTA Stage Monolith */}
          <FooterVariant2Cta>{resolvedCta}</FooterVariant2Cta>

          {/* Zone 2: Proportioned Directory Deck */}
          <FooterVariant2Deck>{resolvedDeck}</FooterVariant2Deck>
        </>
      )}
    </footer>
  )
}
