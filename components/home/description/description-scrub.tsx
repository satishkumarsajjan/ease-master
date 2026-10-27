"use client"

import * as React from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react"
import { cn } from "@/lib/utils"
import { SPRING } from "@/lib/motion"

export type ColorRole = "muted" | "foreground" | "primary"

export interface TextSegment {
  text: string
  role?: ColorRole
}

/**
 * Semantic Color Zoning (The 60/30/10 Rule):
 * - Muted (~30%): Atmospheric setup, prepositions & connective clauses
 * - Foreground (~60%): High-contrast substance & technical nouns
 * - Primary (~10%): Magnetic brand hook & catalyst differentiator
 */
export const DEFAULT_SEGMENTS: TextSegment[] = [
  { text: "Most tools start with", role: "muted" },
  {
    text: "bloated abstractions and tangled dependencies.",
    role: "foreground",
  },
  { text: "We took the opposite path —", role: "muted" },
  { text: "crafting a pure, composable foundation", role: "primary" },
  {
    text: "where every primitive is refined down to the subpixel,",
    role: "foreground",
  },
  { text: "moving at the speed of thought.", role: "foreground" },
]

// Spring parameters sourced directly from design tokens in lib/motion.ts (SPRING.fluid)
// High physical mass (1.4) + weighted damping (24) creates viscous trailing lag and momentum coast
const SPRING_CONFIG = {
  stiffness: (SPRING.fluid as { stiffness: number }).stiffness ?? 85,
  damping: (SPRING.fluid as { damping: number }).damping ?? 24,
  mass: (SPRING.fluid as { mass: number }).mass ?? 1.4,
  restDelta: 0.0005,
}

export interface DescriptionScrubContextValue {
  progress: MotionValue<number>
  prefersReducedMotion: boolean | null
}

const DescriptionScrubContext =
  React.createContext<DescriptionScrubContextValue | null>(null)

export function useDescriptionScrub() {
  const context = React.useContext(DescriptionScrubContext)
  if (!context) {
    throw new Error(
      "DescriptionScrub compound subcomponents must be used within <DescriptionScrub>."
    )
  }
  return context
}

export const useManifesto = useDescriptionScrub

/**
 * ============================================================================
 * WORD SPAN: Individual Illuminated Word Atom
 * ============================================================================
 */
export interface WordSpanProps {
  word: string
  role: ColorRole
  index: number
  total: number
  progress: MotionValue<number>
}

export function WordSpan({
  word,
  role,
  index,
  total,
  progress,
}: WordSpanProps) {
  // Phase 2: Active Illumination Window (0.10 to 0.82)
  const windowStart = 0.1
  const windowEnd = 0.82
  const step = (windowEnd - windowStart) / total
  const start = windowStart + index * step

  // Broad, viscous optical overlap (3.2x step): 4-5 words share the light beam simultaneously
  const end = Math.min(windowEnd, start + step * 3.2)

  // Non-linear ease-out cubic curve: words bloom with an organic momentum curve rather than a linear clamp
  const opacity = useTransform(progress, [start, end], [0, 1], {
    ease: (t) => 1 - Math.pow(1 - t, 2.8),
  })

  // Semantic color mapping at full illumination
  const roleClasses =
    role === "primary"
      ? "text-primary font-medium"
      : role === "muted"
        ? "text-muted-foreground"
        : "text-foreground"

  return (
    <span className="relative mr-[0.26em] inline-block select-none">
      {/* Dormant warm silver baseline (all words start in same quiet watermark) */}
      <span
        className="text-muted-foreground opacity-40 select-none"
        aria-hidden="true"
      >
        {word}
      </span>
      {/* Hardware-composited illuminated layer with semantic color role */}
      <motion.span
        style={{ opacity }}
        className={cn("absolute inset-0 will-change-[opacity]", roleClasses)}
        aria-hidden="true"
      >
        {word}
      </motion.span>
    </span>
  )
}

/**
 * ============================================================================
 * DESCRIPTION SCRUB SEGMENT: Composable Semantic Text Unit
 * ============================================================================
 */
export interface DescriptionScrubSegmentProps {
  role?: ColorRole
  children: string
  className?: string
}

export function DescriptionScrubSegment({
  role = "foreground",
  children,
  className,
}: DescriptionScrubSegmentProps) {
  const roleClasses =
    role === "primary"
      ? "text-primary font-medium"
      : role === "muted"
        ? "text-muted-foreground"
        : "text-foreground"

  return <span className={cn(roleClasses, className)}>{children}</span>
}

export const ManifestoSegment = DescriptionScrubSegment

/**
 * ============================================================================
 * DESCRIPTION SCRUB TEXT: Accessible Typographic Stage
 * ============================================================================
 */
export interface DescriptionScrubTextProps extends React.ComponentProps<"div"> {
  className?: string
  segments?: TextSegment[]
  text?: string
  children?: React.ReactNode
}

export function DescriptionScrubText({
  className,
  segments: propSegments,
  text: fallbackText,
  children,
  ...props
}: DescriptionScrubTextProps) {
  const { progress, prefersReducedMotion } = useDescriptionScrub()

  // Extract segments from children if provided as <DescriptionScrubSegment>
  const segments = React.useMemo<TextSegment[]>(() => {
    if (children) {
      const parsed: TextSegment[] = []
      React.Children.forEach(children, (child) => {
        if (React.isValidElement<DescriptionScrubSegmentProps>(child)) {
          if (typeof child.props.children === "string") {
            parsed.push({
              text: child.props.children,
              role: child.props.role ?? "foreground",
            })
          }
        } else if (typeof child === "string" && child.trim().length > 0) {
          parsed.push({ text: child, role: "foreground" })
        }
      })
      if (parsed.length > 0) return parsed
    }
    if (propSegments && propSegments.length > 0) return propSegments
    if (fallbackText) return [{ text: fallbackText, role: "foreground" }]
    return DEFAULT_SEGMENTS
  }, [children, propSegments, fallbackText])

  // Flatten segments into an ordered array of words with their corresponding color roles
  const wordsWithRoles = React.useMemo(() => {
    const list: { word: string; role: ColorRole }[] = []
    for (const segment of segments) {
      const segWords = segment.text.split(/\s+/).filter(Boolean)
      const role = segment.role ?? "foreground"
      for (const word of segWords) {
        list.push({ word, role })
      }
    }
    return list
  }, [segments])

  // Plain text representation for screen readers
  const fullText = React.useMemo(
    () => segments.map((s) => s.text).join(" "),
    [segments]
  )

  if (prefersReducedMotion) {
    return (
      <div
        className={cn(
          "relative mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center lg:max-w-4xl",
          className
        )}
        {...props}
      >
        <p className="font-heading text-2xl leading-snug font-medium tracking-tight sm:text-3xl sm:leading-[1.3] md:text-4xl md:leading-[1.28] lg:text-[38px]">
          {segments.map((seg, sIdx) => {
            const roleClass =
              seg.role === "primary"
                ? "text-primary font-medium"
                : seg.role === "muted"
                  ? "text-muted-foreground"
                  : "text-foreground"
            return (
              <span
                key={sIdx}
                className={cn(roleClass, sIdx > 0 && "ml-[0.26em]")}
              >
                {seg.text}
              </span>
            )
          })}
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center lg:max-w-4xl",
        className
      )}
      {...props}
    >
      {/* Screen reader text (accessible, uninterrupted sentence) */}
      <p className="sr-only">{fullText}</p>

      {/* Pure, Uncluttered Illuminated Typography (~38px on desktop, font-medium, leading-[1.28]) */}
      <p
        aria-hidden="true"
        className="font-heading text-2xl leading-snug font-medium tracking-tight sm:text-3xl sm:leading-[1.3] md:text-4xl md:leading-[1.28] lg:text-[38px]"
      >
        {wordsWithRoles.map((item, index) => (
          <WordSpan
            key={`${item.word}-${index}`}
            word={item.word}
            role={item.role}
            index={index}
            total={wordsWithRoles.length}
            progress={progress}
          />
        ))}
      </p>
    </div>
  )
}

export const ManifestoText = DescriptionScrubText

/**
 * ============================================================================
 * DESCRIPTION SCRUB STAGE: Sticky Pinned Viewport Stage
 * ============================================================================
 */
export interface DescriptionScrubStageProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function DescriptionScrubStage({
  className,
  children,
  ...props
}: DescriptionScrubStageProps) {
  const { prefersReducedMotion } = useDescriptionScrub()

  if (prefersReducedMotion) {
    return (
      <div
        className={cn(
          "relative mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24 md:py-28",
          className
        )}
        {...props}
      >
        {children ?? <DescriptionScrubText />}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "sticky top-0 flex h-svh min-h-[100dvh] w-full items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8",
        className
      )}
      {...props}
    >
      {children ?? <DescriptionScrubText />}
    </div>
  )
}

export const ManifestoStage = DescriptionScrubStage

/**
 * ============================================================================
 * DESCRIPTION SCRUB (ROOT / PRESET WRAPPER)
 * ============================================================================
 */
export interface DescriptionScrubProps extends React.ComponentProps<"section"> {
  className?: string
  segments?: TextSegment[]
  text?: string
  children?: React.ReactNode
}

export function DescriptionScrub({
  className,
  segments,
  text,
  children,
  ...props
}: DescriptionScrubProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Track scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Damped spring progress creates viscous trailing lag and momentum coast
  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG)

  const contextValue = React.useMemo<DescriptionScrubContextValue>(
    () => ({
      progress: smoothProgress,
      prefersReducedMotion,
    }),
    [smoothProgress, prefersReducedMotion]
  )

  if (prefersReducedMotion) {
    return (
      <DescriptionScrubContext.Provider value={contextValue}>
        <section
          aria-label="Product Manifesto"
          className={cn(
            "relative mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24 md:py-28",
            className
          )}
          {...props}
        >
          {children ?? (
            <DescriptionScrubStage>
              <DescriptionScrubText segments={segments} text={text} />
            </DescriptionScrubStage>
          )}
        </section>
      </DescriptionScrubContext.Provider>
    )
  }

  return (
    <DescriptionScrubContext.Provider value={contextValue}>
      <section
        ref={containerRef}
        aria-label="Product Manifesto"
        className={cn(
          "relative w-full",
          // Calibrated track height: perfectly weighted for ~3-4 lines of display type
          "h-[145vh] sm:h-[175vh] md:h-[200vh]",
          className
        )}
        {...props}
      >
        {children ?? (
          <DescriptionScrubStage>
            <DescriptionScrubText segments={segments} text={text} />
          </DescriptionScrubStage>
        )}
      </section>
    </DescriptionScrubContext.Provider>
  )
}

export const Manifesto = DescriptionScrub
