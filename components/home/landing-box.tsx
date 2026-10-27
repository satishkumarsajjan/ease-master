"use client"

import * as React from "react"
import { motion } from "motion/react"
import { EASE } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { DeckBox2Variant1 } from "@/components/home/footer/deck-box-2"
import { useHotkey } from "@/hooks/use-hotkey"

export interface LandingBoxProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
  /**
   * @deprecated Use the `<LandingBoxFooter>` compound component instead of the `footer` prop.
   */
  footer?: React.ReactNode
  /**
   * @deprecated Use `className` on `<LandingBoxContent>` instead.
   */
  contentClassName?: string
}

export interface LandingBoxContentProps extends React.ComponentProps<"main"> {
  className?: string
  children?: React.ReactNode
}

/**
 * ============================================================================
 * LANDING BOX CONTENT: Standard Marketing Stage Container
 * - Uses semantic <main> element for document accessibility.
 * - Standard responsive padding: p-6 sm:p-10.
 * ============================================================================
 */
export function LandingBoxContent({
  className,
  children,
  ...props
}: LandingBoxContentProps) {
  return (
    <main
      className={cn("w-full flex-1 px-3.5 py-6 sm:p-8 md:p-10", className)}
      {...props}
    >
      {children}
    </main>
  )
}

export interface LandingBoxFooterProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

/**
 * ============================================================================
 * LANDING BOX FOOTER: Full-Bleed Terminal Anchor
 * - Anchors to the bottom of the sliding monolith with zero forced insets.
 * ============================================================================
 */
export function LandingBoxFooter({
  className,
  children,
  ...props
}: LandingBoxFooterProps) {
  return (
    <div className={cn("w-full shrink-0", className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Cinematic Filmic Easing Curve from design tokens:
 * Zero initial jerk from rest, majestic acceleration with momentum,
 * and feather-soft asymptotic deceleration.
 */
const CINEMATIC_EASE = EASE.cinematic

export function LandingBox({
  className,
  children,
  footer,
  ...props
}: LandingBoxProps) {
  const wordmarkRef = React.useRef<HTMLDivElement>(null)
  const [windowHeight, setWindowHeight] = React.useState(900)
  const [isMobile, setIsMobile] = React.useState(false)
  const [isRevealed, setIsRevealed] = React.useState(false)
  const [isSettled, setIsSettled] = React.useState(true)

  // Track window dimensions for the 85% reveal distance
  React.useEffect(() => {
    const onResize = () => {
      setWindowHeight(window.innerHeight)
      setIsMobile(window.innerWidth < 640)
    }
    onResize()
    window.addEventListener("resize", onResize, { passive: true })
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Reveal distance calibrated:
  // On mobile (< 640px), slide Box 1 up almost entirely (leaving only ~48px handle lip at top),
  // maximizing visible vertical real estate for Box 2 and eliminating top clipping.
  // On desktop, reveal ~85% of the viewport (unveiling deck + wordmark).
  const revealDistance = isMobile
    ? Math.max(windowHeight - 48, Math.round(windowHeight * 0.92))
    : Math.round(windowHeight * 0.85)

  // Lock body scroll while revealed so user can explore Box 2 without background fighting
  React.useEffect(() => {
    if (isRevealed) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isRevealed])

  // Suppress scrollbar on the landing page while preserving fluid touch/wheel/keyboard scrolling
  React.useEffect(() => {
    document.documentElement.classList.add("no-scrollbar")
    document.body.classList.add("no-scrollbar")
    return () => {
      document.documentElement.classList.remove("no-scrollbar")
      document.body.classList.remove("no-scrollbar")
    }
  }, [])

  // Bind Escape hotkey to cleanly dismiss reveal
  useHotkey(
    "escape",
    () => {
      if (isRevealed) {
        setIsSettled(false)
        setIsRevealed(false)
      }
    },
    { enabled: isRevealed }
  )

  // Calibrate duration: cinematic curve on open, silky weighted descent on close
  const duration = isRevealed
    ? isMobile
      ? 0.95
      : 1.15
    : isMobile
      ? 0.75
      : 0.85

  // Wordmark rest-settle and atmospheric bloom state (plays once per session)
  const [hasRevealedOnce, setHasRevealedOnce] = React.useState(false)
  const [isBloomed, setIsBloomed] = React.useState(false)

  // Bloom smoothly only AFTER the wordmark has completely settled at rest on first reveal
  React.useEffect(() => {
    if (hasRevealedOnce || !isRevealed) {
      return
    }
    const timer = setTimeout(() => {
      setIsBloomed(true)
      setHasRevealedOnce(true)
    }, duration * 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [isRevealed, hasRevealedOnce, duration])

  const toggleReveal = () => {
    setIsSettled(false)
    setIsRevealed((prev) => !prev)
  }

  return (
    <div
      id="landing-box-root"
      className={cn(
        "relative min-h-screen w-full bg-muted p-(--docs-pane-gap) selection:bg-primary selection:text-primary-foreground sm:p-[calc(var(--docs-pane-gap)*2)]",
        className
      )}
      {...props}
    >
      {/* ============================================================== */}
      {/* BOX 2: THE SATISIUM STAGE (Layer 0: Stationary Bedrock Behind)  */}
      {/* ============================================================== */}
      <div
        aria-hidden={!isRevealed}
        className={cn(
          "fixed inset-(--docs-pane-gap) z-0 flex transform-gpu flex-col justify-between overflow-hidden rounded-3xl bg-secondary text-foreground transition-opacity duration-300 select-none sm:inset-[calc(var(--docs-pane-gap)*2)]",
          isRevealed
            ? "pointer-events-auto opacity-100"
            : isSettled
              ? "pointer-events-none opacity-0"
              : "pointer-events-none opacity-100"
        )}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {/* DIRECTORY DECK: Sits in the upper/middle portion of Box 2 above the wordmark */}
        <div className="no-scrollbar flex w-full flex-1 flex-col justify-start overflow-y-auto bg-transparent px-5 pt-16 pb-6 sm:justify-center sm:px-10 sm:pt-8 sm:pb-4 md:px-14">
          <DeckBox2Variant1 className="w-full bg-transparent px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0" />
        </div>

        {/* Exact Wordmark with Option 2 Balanced Blur: sharp upper 50%, atmospheric base 50% */}
        <div
          ref={wordmarkRef}
          className="relative w-full shrink-0 px-5 pb-1 leading-none sm:px-10 sm:pb-2.5 md:px-14"
        >
          <motion.div
            initial={{ y: "24%", opacity: 0.4 }}
            animate={{
              y: isRevealed || hasRevealedOnce ? "0%" : "24%",
              opacity: isRevealed || hasRevealedOnce ? 1 : 0.4,
            }}
            transition={{
              ease: CINEMATIC_EASE,
              duration: hasRevealedOnce ? 0 : duration,
              delay: hasRevealedOnce ? 0 : isRevealed ? 0.04 : 0,
            }}
            className="relative w-full origin-bottom transform-gpu will-change-transform"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Core crisp wordmark container */}
            <div className="relative w-full">
              <svg
                viewBox="0 0 1000 135"
                className="block h-auto w-full select-none"
                preserveAspectRatio="none"
                aria-label="SATISIUM"
              >
                <text
                  x="0"
                  y="118"
                  textLength="1000"
                  lengthAdjust="spacingAndGlyphs"
                  className="fill-foreground font-bold"
                  style={{
                    fontFamily: "var(--font-brand), sans-serif",
                    fontSize: "148px",
                  }}
                >
                  SATISIUM
                </text>
              </svg>

              {/* Atmospheric Bloom Layer: Smoothly blooms blur radius only AFTER text has completely rested */}
              <div
                aria-hidden="true"
                data-bloomed={isBloomed ? "true" : "false"}
                className="wordmark-bloom pointer-events-none absolute inset-0 select-none"
              >
                {/* LIGHT MODE: Pure Progressive Optical Defocus (zero displaced silhouettes, buttery smooth fade) */}
                <div
                  className="pointer-events-none absolute inset-0 -inset-x-2 -bottom-5 dark:hidden"
                  style={{
                    backdropFilter: "blur(var(--wordmark-blur-1))",
                    WebkitBackdropFilter: "blur(var(--wordmark-blur-1))",
                    maskImage:
                      "linear-gradient(to bottom, transparent 45%, black 65%, black 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 45%, black 65%, black 100%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 -inset-x-4 -bottom-8 dark:hidden"
                  style={{
                    backdropFilter: "blur(var(--wordmark-blur-2))",
                    WebkitBackdropFilter: "blur(var(--wordmark-blur-2))",
                    maskImage:
                      "linear-gradient(to bottom, transparent 62%, black 82%, black 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 62%, black 82%, black 100%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 -inset-x-5 -bottom-10 dark:hidden"
                  style={{
                    backdropFilter: "blur(var(--wordmark-blur-3))",
                    WebkitBackdropFilter: "blur(var(--wordmark-blur-3))",
                    maskImage:
                      "linear-gradient(to bottom, transparent 78%, black 92%, black 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 78%, black 92%, black 100%)",
                  }}
                />

                {/* DARK MODE: Option 3 Pure Optical Lens Softening (zero streaks, pure lens defocus on lower half) */}
                <div
                  className="pointer-events-none absolute inset-0 -inset-x-2 -bottom-5 hidden dark:block"
                  style={{
                    backdropFilter: "blur(var(--wordmark-blur-1))",
                    WebkitBackdropFilter: "blur(var(--wordmark-blur-1))",
                    maskImage:
                      "linear-gradient(to bottom, transparent 50%, black 72%, black 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 50%, black 72%, black 100%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 -inset-x-4 -bottom-8 hidden dark:block"
                  style={{
                    backdropFilter: "blur(var(--wordmark-blur-2))",
                    WebkitBackdropFilter: "blur(var(--wordmark-blur-2))",
                    maskImage:
                      "linear-gradient(to bottom, transparent 68%, black 88%, black 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 68%, black 88%, black 100%)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOX 1: THE PRODUCT MONOLITH (Kinetic Sliding Stage)             */}
      {/* When at rest: transform is strictly "none" to guarantee        */}
      {/* 100% native sticky scrolling on DescriptionScrub and FAQ.      */}
      {/* ============================================================== */}
      <motion.div
        animate={{ y: isRevealed ? -revealDistance : 0 }}
        transition={{
          ease: CINEMATIC_EASE,
          duration,
        }}
        onAnimationStart={() => {
          setIsSettled(false)
        }}
        onAnimationComplete={() => {
          if (!isRevealed) {
            setIsSettled(true)
          }
        }}
        className="relative z-10 flex min-h-[140vh] w-full transform-gpu flex-col justify-between rounded-3xl bg-background text-foreground will-change-transform"
        style={{
          transform: isSettled && !isRevealed ? "none" : undefined,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div className="flex w-full flex-1 flex-col">
          {children}

          {/* Deprecated backward-compatible fallback if legacy footer prop is provided */}
          {footer && <LandingBoxFooter>{footer}</LandingBoxFooter>}
        </div>

        {/* ============================================================ */}
        {/* ARCHITECTURAL FOLDED INDEX TAB: Folded upward from bottom     */}
        {/* Sleek folded tab hugging 'A product by Satisium' with clean   */}
        {/* letter-spacing, drop-shadow-2xl, and micro-hover height.      */}
        {/* ============================================================ */}
        <button
          type="button"
          role="button"
          aria-label={
            isRevealed
              ? "Close Satisium Stage"
              : "Reveal Satisium Stage — A product by Satisium"
          }
          aria-expanded={isRevealed}
          onClick={toggleReveal}
          style={{
            boxShadow: "var(--tab-fold-shadow)",
          }}
          className={cn(
            "group absolute right-6 bottom-0 z-30 inline-flex h-7 w-fit cursor-pointer items-center justify-center sm:right-10 sm:h-8 md:right-14",
            "rounded-t-md bg-brand px-3 py-1 text-brand-foreground select-none sm:px-3.5 sm:py-1.5",
            "drop-shadow-2xl transition-[height,filter] duration-200 ease-out hover:h-8 hover:brightness-110 sm:hover:h-9",
            "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none"
          )}
        >
          <span className="font-sans text-[11px] leading-none tracking-tight text-brand-foreground sm:text-xs">
            <span className="font-normal">A product by </span>
            <span className="font-bold tracking-normal">Satisium</span>
          </span>
        </button>
      </motion.div>
    </div>
  )
}
