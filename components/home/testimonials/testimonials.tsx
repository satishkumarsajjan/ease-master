"use client"

import * as React from "react"
import {
  motion,
  useScroll,
  useSpring,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  useReducedMotion,
  wrap,
} from "motion/react"
import { SiX, SiGithub } from "@icons-pack/react-simple-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, Link01Icon } from "@hugeicons/core-free-icons"
import { SPRING } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type TestimonialPlatform = "x" | "github" | "linkedin" | "web"

export interface TestimonialItem {
  id: string
  name: string
  handle: string
  role: string
  company: string
  initials: string
  quote: string
  url?: string
  platform?: TestimonialPlatform
}

/**
 * ============================================================================
 * TESTIMONIAL DATASETS
 * ============================================================================
 */
export const ROW_1_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    handle: "@sarahc_dev",
    role: "Staff Frontend Engineer",
    company: "Veloce",
    initials: "SC",
    platform: "x",
    url: "https://x.com",
    quote:
      "The **zero-key boot guarantee** is real. Cloned the repo, ran `pnpm dev`, and our entire tool canvas was rendering without touching a single environment variable.",
  },
  {
    id: "alexandre-dubois",
    name: "Alexandre Dubois",
    handle: "@alexdubois",
    role: "Design Engineer",
    company: "Studio Koto",
    initials: "AD",
    platform: "x",
    url: "https://x.com",
    quote:
      "Finding a starter that takes **concentric squircle geometry** and subpixel tokens seriously is rare. It feels like software designed by engineers with genuine taste.",
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    handle: "@elena_codes",
    role: "VP of Engineering",
    company: "Synthetix",
    initials: "ER",
    platform: "github",
    url: "https://github.com",
    quote:
      "The **dual-layout Fumadocs documentation** alone saved us three weeks of custom scaffolding. Our developers actually enjoy writing and reading docs now.",
  },
  {
    id: "liam-oconnor",
    name: "Liam O'Connor",
    handle: "@liam_oc",
    role: "Senior Fullstack",
    company: "Streamline",
    initials: "LO",
    platform: "x",
    url: "https://x.com",
    quote:
      "Every interaction is calibrated with **real physical springs**. It is the first template where I didn't have to rip out or rewrite half the animations.",
  },
  {
    id: "aiko-tanaka",
    name: "Aiko Tanaka",
    handle: "@aiko_tanaka",
    role: "Tech Lead",
    company: "Monolith Labs",
    initials: "AT",
    platform: "web",
    url: "https://satisium.com",
    quote:
      "Our team license paid for itself in the first sprint. The **clean binary pricing and frictionless setup** made adoption across our 25 engineers effortless.",
  },
]

export const ROW_2_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    handle: "@marcusvance",
    role: "Lead Architect",
    company: "HyperScale",
    initials: "MV",
    platform: "x",
    url: "https://x.com",
    quote:
      "We migrated our customer dashboard in a single weekend. The **mechanical rolling numbers** and dual-surface slabs made our product look like an Apple keynote.",
  },
  {
    id: "rachel-miller",
    name: "Rachel Miller",
    handle: "@rachel_m_ui",
    role: "Product Designer",
    company: "Indie Builder",
    initials: "RM",
    platform: "x",
    url: "https://x.com",
    quote:
      "Shipped my first commercial developer tool in **under 48 hours**. The pre-configured billing models and team seat calculator converted customers on day one.",
  },
  {
    id: "tariq-al-mansoor",
    name: "Tariq Al-Mansoor",
    handle: "@tariq_am",
    role: "Core Maintainer",
    company: "OpenTrace",
    initials: "TM",
    platform: "github",
    url: "https://github.com",
    quote:
      "The **typed route graph and automated doctor checks** catch regressions before PRs even hit CI. It is the highest-discipline starter we have ever audited.",
  },
  {
    id: "kavita-patel",
    name: "Kavita Patel",
    handle: "@kavitadev",
    role: "Design Engineer",
    company: "Lattice",
    initials: "KP",
    platform: "web",
    url: "https://satisium.com",
    quote:
      "Most boilerplates are weighed down by 50 unnecessary dependencies. Satisium has **zero fluff, 100% OKLCH tokens**, and pure tactile satisfaction.",
  },
  {
    id: "david-lindqvist",
    name: "David Lindqvist",
    handle: "@dlindqvist",
    role: "Principal Engineer",
    company: "Forma",
    initials: "DL",
    platform: "github",
    url: "https://github.com",
    quote:
      "The **fluid velocity scrolling** and hardware grounding feel incredible. Zero jitter, zero border strokes, just pure typographic authority.",
  },
]

export const COLUMN_1_ITEMS: TestimonialItem[] = [
  ROW_1_TESTIMONIALS[0],
  ROW_1_TESTIMONIALS[2],
  ROW_2_TESTIMONIALS[4],
  {
    id: "m-kim",
    name: "Min-Jun Kim",
    handle: "@mj_kim",
    role: "DevOps Lead",
    company: "Kinetix",
    initials: "MK",
    platform: "x",
    url: "https://x.com",
    quote:
      "The **automated doctor script** caught three broken environment configurations before we even pushed our first branch. That alone was worth the template.",
  },
]

export const COLUMN_2_ITEMS: TestimonialItem[] = [
  ROW_1_TESTIMONIALS[1],
  ROW_2_TESTIMONIALS[3],
  ROW_1_TESTIMONIALS[3],
  {
    id: "m-weiss",
    name: "Hannah Weiss",
    handle: "@hannah_ui",
    role: "Founder",
    company: "Archtype",
    initials: "HW",
    platform: "x",
    url: "https://x.com",
    quote:
      "We replaced our entire custom design token library with Satisium's **OKLCH palette**. Contrast in dark mode is flawless.",
  },
]

export const COLUMN_3_ITEMS: TestimonialItem[] = [
  ROW_2_TESTIMONIALS[0],
  ROW_2_TESTIMONIALS[1],
  ROW_1_TESTIMONIALS[4],
  ROW_2_TESTIMONIALS[2],
]

/**
 * ============================================================================
 * SHARED MICRO-PRIMITIVES
 * ============================================================================
 */

export function PlatformIcon({ platform }: { platform?: TestimonialPlatform }) {
  if (platform === "x") {
    return <SiX className="size-3 fill-current" />
  }
  if (platform === "github") {
    return <SiGithub className="size-3.5 fill-current" />
  }
  return <HugeiconsIcon icon={Link01Icon} className="size-3" />
}

export const FormattedQuoteText = React.memo(function FormattedQuoteText({
  text,
}: {
  text: string
}) {
  const parts = React.useMemo(() => text.split(/(\*\*.*?\*\*)/g), [text])
  return (
    <p className="font-sans text-xs leading-relaxed text-foreground sm:text-[13px] sm:leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </p>
  )
})

/**
 * ============================================================================
 * TESTIMONIAL CARD
 * ============================================================================
 */
export interface TestimonialCardProps extends React.ComponentProps<"div"> {
  item: TestimonialItem
  variant?: "fixed" | "fluid"
  isClone?: boolean
  className?: string
}

export const TestimonialCard = React.memo(function TestimonialCard({
  item,
  variant = "fixed",
  isClone = false,
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-[18px] p-5 select-none sm:rounded-[20px] sm:p-5.5",
        variant === "fixed"
          ? "h-[195px] w-[310px] shrink-0 sm:h-[200px] sm:w-[350px] md:h-[205px] md:w-[380px]"
          : "w-full",
        "bg-muted transition-colors duration-200 hover:bg-secondary",
        "subpixel-antialiased [text-rendering:geometricPrecision]",
        className
      )}
      {...props}
    >
      {/* Quote Body */}
      <div className="overflow-hidden">
        <FormattedQuoteText text={item.quote} />
      </div>

      {/* Author Strip & Verification Micro-Dock */}
      <div className="flex items-center justify-between gap-2.5 pt-2">
        <div className="flex min-w-0 items-center gap-3">
          {/* Concentric Squircle Avatar */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-background font-heading text-xs font-semibold text-foreground select-none dark:bg-card">
            {item.initials}
          </div>

          {/* Identity & Context */}
          <div className="min-w-0 flex-1">
            <div className="truncate font-heading text-xs font-semibold tracking-tight text-foreground sm:text-sm">
              {item.name}
            </div>
            <div className="truncate font-sans text-[11px] text-muted-foreground">
              {item.role} · {item.company}
            </div>
          </div>
        </div>

        {/* Dedicated Source Verification Dock */}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isClone ? -1 : undefined}
            aria-label={`View original post by ${item.name} on ${item.platform?.toUpperCase() ?? "web"}`}
            className={cn(
              "group/source flex h-7 shrink-0 items-center gap-1 rounded-[8px] px-2",
              "bg-background text-muted-foreground transition-all duration-200 select-none hover:text-foreground dark:bg-secondary dark:hover:text-foreground",
              "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            )}
          >
            <PlatformIcon platform={item.platform} />
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              className="size-2.5 opacity-55 transition-transform duration-200 group-hover/source:translate-x-0.5 group-hover/source:-translate-y-0.5 group-hover/source:opacity-100"
            />
          </a>
        )}
      </div>
    </div>
  )
})

/**
 * ============================================================================
 * ROOT TESTIMONIALS SECTION
 * ============================================================================
 */
export interface TestimonialsProps extends React.ComponentProps<"section"> {
  className?: string
  children?: React.ReactNode
}

export function Testimonials({
  className,
  children,
  ...props
}: TestimonialsProps) {
  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className={cn(
        "relative mx-auto flex w-full max-w-6xl flex-col items-center px-0 select-none sm:px-6",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

/**
 * ============================================================================
 * TESTIMONIALS HEADER
 * ============================================================================
 */
export interface TestimonialsHeaderProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function TestimonialsHeader({
  className,
  children,
  ...props
}: TestimonialsHeaderProps) {
  return (
    <div
      className={cn("flex flex-col items-center text-center", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TestimonialsEyebrowProps extends React.ComponentProps<"span"> {
  className?: string
  children?: React.ReactNode
}

export function TestimonialsEyebrow({
  className,
  children,
  ...props
}: TestimonialsEyebrowProps) {
  return (
    <span
      className={cn(
        "font-sans text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export interface TestimonialsTitleProps extends React.ComponentProps<"h2"> {
  className?: string
  children?: React.ReactNode
}

export function TestimonialsTitle({
  className,
  children,
  ...props
}: TestimonialsTitleProps) {
  return (
    <h2
      className={cn(
        "mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export interface TestimonialsDescriptionProps extends React.ComponentProps<"p"> {
  className?: string
  children?: React.ReactNode
}

export function TestimonialsDescription({
  className,
  children,
  ...props
}: TestimonialsDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-2 max-w-md font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * ============================================================================
 * KINETIC VELOCITY TRACK (HORIZONTAL)
 * ============================================================================
 */
export interface TestimonialsVelocityTrackProps {
  items: TestimonialItem[]
  baseVelocity?: number
  className?: string
}

export function TestimonialsVelocityTrack({
  items,
  baseVelocity = -0.7,
  className,
}: TestimonialsVelocityTrackProps) {
  const initialX = baseVelocity > 0 ? -25 : 0
  const baseX = useMotionValue(initialX)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, SPRING.fluid)

  const [isHovered, setIsHovered] = React.useState(false)
  const hoverMultiplier = React.useRef(1.0)
  const prefersReducedMotion = useReducedMotion()

  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    const timer = setTimeout(() => setHasMounted(true), 350)
    return () => clearTimeout(timer)
  }, [])

  const defaultSign = baseVelocity < 0 ? -1 : 1
  const targetDirection = React.useRef(defaultSign)
  const currentDirection = React.useRef(defaultSign)

  useAnimationFrame((_t, delta) => {
    if (prefersReducedMotion) return

    const safeDelta = Math.min(delta, 64)
    const cruiseSpeed = Math.abs(baseVelocity) * 0.9
    const rawVel = hasMounted ? smoothVelocity.get() : 0

    if (rawVel > 30) {
      targetDirection.current = defaultSign
    } else if (rawVel < -30) {
      targetDirection.current = -defaultSign
    }

    currentDirection.current +=
      (targetDirection.current - currentDirection.current) *
      Math.min(1, (safeDelta / 1000) * 4)

    const maxBoost = 6.5
    const s = Math.abs(rawVel) * 0.0035
    const boost = maxBoost * Math.tanh(s / maxBoost)
    let netVelocity = (cruiseSpeed + boost) * currentDirection.current

    const targetDamp = isHovered ? 0.2 : 1.0
    hoverMultiplier.current +=
      (targetDamp - hoverMultiplier.current) *
      Math.min(1, (safeDelta / 1000) * 8)
    netVelocity *= hoverMultiplier.current

    const moveBy = netVelocity * (safeDelta / 1000)
    baseX.set(baseX.get() + moveBy)
  })

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)

  return (
    <div
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={cn("flex w-full overflow-hidden select-none", className)}
    >
      <motion.div
        style={{ x }}
        className="flex shrink-0 transform-gpu items-center will-change-transform"
      >
        {[0, 1, 2, 3].map((setIndex) => (
          <div
            key={setIndex}
            className="flex shrink-0 items-center gap-2.5 pr-2.5 sm:gap-3 sm:pr-3"
            aria-hidden={setIndex > 0 ? "true" : undefined}
          >
            {items.map((item) => (
              <TestimonialCard
                key={`${setIndex}-${item.id}`}
                item={item}
                variant="fixed"
                isClone={setIndex > 0}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/**
 * ============================================================================
 * HORIZONTAL MARQUEE WRAPPER (With Linear Alpha Fade Mask)
 * ============================================================================
 */
export interface TestimonialsMarqueeProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function TestimonialsMarquee({
  className,
  children,
  ...props
}: TestimonialsMarqueeProps) {
  return (
    <div
      className={cn(
        "relative mt-10 w-full space-y-2.5 overflow-hidden sm:mt-12 sm:space-y-3",
        className
      )}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black clamp(24px, 5vw, 64px), black calc(100% - clamp(24px, 5vw, 64px)), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black clamp(24px, 5vw, 64px), black calc(100% - clamp(24px, 5vw, 64px)), transparent 100%)",
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ============================================================================
 * KINETIC MASONRY COLUMN (VERTICAL)
 * ============================================================================
 */
export interface TestimonialsMasonryColumnProps {
  items: TestimonialItem[]
  baseVelocity?: number
  className?: string
}

export function TestimonialsMasonryColumn({
  items,
  baseVelocity = -0.5,
  className,
}: TestimonialsMasonryColumnProps) {
  const initialY = baseVelocity > 0 ? -50 : 0
  const baseY = useMotionValue(initialY)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, SPRING.fluid)

  const [isHovered, setIsHovered] = React.useState(false)
  const hoverMultiplier = React.useRef(1.0)
  const prefersReducedMotion = useReducedMotion()

  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    const timer = setTimeout(() => setHasMounted(true), 350)
    return () => clearTimeout(timer)
  }, [])

  const defaultSign = baseVelocity < 0 ? -1 : 1
  const targetDirection = React.useRef(defaultSign)
  const currentDirection = React.useRef(defaultSign)

  useAnimationFrame((_t, delta) => {
    if (prefersReducedMotion) return

    const safeDelta = Math.min(delta, 64)
    const cruiseSpeed = Math.abs(baseVelocity) * 0.9
    const rawVel = hasMounted ? smoothVelocity.get() : 0

    if (rawVel > 30) {
      targetDirection.current = defaultSign
    } else if (rawVel < -30) {
      targetDirection.current = -defaultSign
    }

    currentDirection.current +=
      (targetDirection.current - currentDirection.current) *
      Math.min(1, (safeDelta / 1000) * 4)

    const maxBoost = 10.0
    const s = Math.abs(rawVel) * 0.0055
    const boost = maxBoost * Math.tanh(s / maxBoost)
    let netVelocity = (cruiseSpeed + boost) * currentDirection.current

    const targetDamp = isHovered ? 0.15 : 1.0
    hoverMultiplier.current +=
      (targetDamp - hoverMultiplier.current) *
      Math.min(1, (safeDelta / 1000) * 8)
    netVelocity *= hoverMultiplier.current

    const moveBy = netVelocity * (safeDelta / 1000)
    baseY.set(baseY.get() + moveBy)
  })

  const y = useTransform(baseY, (v) => `${wrap(-50, 0, v)}%`)

  return (
    <div
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={cn("flex flex-col overflow-hidden select-none", className)}
    >
      <motion.div
        style={{ y }}
        className="flex transform-gpu flex-col will-change-transform"
      >
        {/* Set 1: Primary */}
        <div className="flex flex-col gap-2.5 pb-2.5 sm:gap-3 sm:pb-3">
          {items.map((item) => (
            <TestimonialCard
              key={`s0-${item.id}`}
              item={item}
              variant="fluid"
            />
          ))}
        </div>

        {/* Set 2: Identical Clone with matching trailing padding */}
        <div
          className="flex flex-col gap-2.5 pb-2.5 sm:gap-3 sm:pb-3"
          aria-hidden="true"
        >
          {items.map((item) => (
            <TestimonialCard
              key={`s1-${item.id}`}
              item={item}
              variant="fluid"
              isClone
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/**
 * ============================================================================
 * VERTICAL MASONRY STAGE (With Top/Bottom Gradient Alpha Mask)
 * ============================================================================
 */
export interface TestimonialsMasonryProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function TestimonialsMasonry({
  className,
  children,
  ...props
}: TestimonialsMasonryProps) {
  return (
    <div
      className={cn(
        "relative mt-10 grid h-[580px] w-full grid-cols-1 gap-2.5 overflow-hidden sm:mt-12 sm:h-[640px] sm:grid-cols-2 sm:gap-3 lg:h-[700px] lg:grid-cols-3",
        className
      )}
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black clamp(32px, 8vw, 84px), black calc(100% - clamp(32px, 8vw, 84px)), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black clamp(32px, 8vw, 84px), black calc(100% - clamp(32px, 8vw, 84px)), transparent 100%)",
      }}
      {...props}
    >
      {children}
    </div>
  )
}
