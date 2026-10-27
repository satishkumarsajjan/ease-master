"use client"

import * as React from "react"
import { motion, AnimatePresence, type Variants } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  Clock01Icon,
  Download01Icon,
  RefreshIcon,
  ServerIcon,
  ComputerIcon,
  ShieldCheckIcon,
  PackageIcon,
  CpuIcon,
  SourceCodeIcon,
  Globe02Icon,
  Link01Icon,
  SparklesIcon,
  UserIcon,
  UserGroupIcon,
  UserCheck01Icon,
  CustomerService01Icon,
  SlidersVerticalIcon,
  ComputerTerminal01Icon,
  InfinityIcon,
  Layers01Icon,
  FireIcon,
  Chart01Icon,
  Message01Icon,
  PuzzleIcon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { SPRING } from "@/lib/motion"
import type { Cadence, FeatureType } from "@/lib/pricing"

/**
 * Common FAQs for pre-purchase objection handling across all pricing tiers.
 */
export const PRICING_FAQS = [
  {
    question:
      "Can I start with This Tool and upgrade to the All-Access Suite later?",
    answer:
      "Yes, absolutely. 100% of your single tool payment is credited toward the Satisium All-Access Suite whenever you decide to upgrade. You only pay the difference.",
  },
  {
    question: "Can I use this code for client and commercial projects?",
    answer:
      "Yes. Every license comes with full commercial rights. You can build, deploy, and ship unlimited client websites, SaaS applications, and commercial products without paying royalties.",
  },
  {
    question: "What happens if I cancel my annual subscription?",
    answer:
      "You receive a perpetual fallback license. You keep and own forever all versions and source code downloaded while your license was active. Your existing applications will never stop working.",
  },
  {
    question: "Do I get access to future tools and UI releases?",
    answer:
      "The Single Tool license includes lifetime updates for this specific application. The All-Access Suite pass includes lifetime access to every new app, component kit, and template released under the Satisium Umbrella.",
  },
] as const

/**
 * Team Pre-Purchase FAQ objection handling.
 */
export const TEAM_FAQS = [
  {
    question: "How does developer seat licensing work?",
    answer:
      "Every developer who writes code or submits pull requests requires an active seat. QA engineers, project managers, and CI/CD automated deployment pipelines do not require developer seats.",
  },
  {
    question: "Can we add or remove seats as our team grows?",
    answer:
      "Yes, seamlessly. You can expand your team seat pool at any time with one click. When you cross volume thresholds (e.g., reaching 6 or 16 seats), your entire seat tier automatically discounts.",
  },
  {
    question: "Are seats floating or assigned to named individuals?",
    answer:
      "Seats are managed centrally by your team administrator and can be reassigned at any time when teammates change roles or leave projects.",
  },
] as const

export const CADENCE_ORDER: Record<Cadence, number> = {
  monthly: 0,
  annual: 1,
  lifetime: 2,
}

/**
 * Resolves semantic icon keywords to clean Hugeicons with consistent stroke.
 */
export const FeatureIcon = React.memo(function FeatureIcon({
  name,
  className,
}: {
  name?: string
  className?: string
}) {
  const iconMap: Record<string, typeof Tick02Icon> = {
    clock: Clock01Icon,
    download: Download01Icon,
    refresh: RefreshIcon,
    server: ServerIcon,
    monitor: ComputerIcon,
    shield: ShieldCheckIcon,
    package: PackageIcon,
    cpu: CpuIcon,
    code: SourceCodeIcon,
    globe: Globe02Icon,
    link: Link01Icon,
    sparkles: SparklesIcon,
    user: UserIcon,
    users: UserGroupIcon,
    "user-check": UserCheck01Icon,
    headphones: CustomerService01Icon,
    sliders: SlidersVerticalIcon,
    terminal: ComputerTerminal01Icon,
    infinity: InfinityIcon,
    layers: Layers01Icon,
    flame: FireIcon,
    chart: Chart01Icon,
    message: Message01Icon,
    puzzle: PuzzleIcon,
    "credit-card": CreditCardIcon,
  }

  const icon = (name && iconMap[name.toLowerCase()]) || Tick02Icon
  return (
    <HugeiconsIcon icon={icon} className={cn("size-4 shrink-0", className)} />
  )
})

/**
 * Parses markdown-style **bold anchors** for rapid, scannable micro-typography.
 */
export const FormattedFeatureText = React.memo(function FormattedFeatureText({
  text,
  isHero = false,
}: {
  text: string
  isHero?: boolean
}) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong
              key={i}
              className={cn(
                "font-semibold",
                isHero
                  ? "text-background dark:text-foreground"
                  : "text-foreground"
              )}
            >
              {part.slice(2, -2)}
            </strong>
          )
        }
        return (
          <span
            key={i}
            className={cn(
              isHero
                ? "text-background dark:text-muted-foreground"
                : "text-muted-foreground"
            )}
          >
            {part}
          </span>
        )
      })}
    </span>
  )
})

/**
 * Motion variants for SlidingSuffix
 */
const suffixVariants: Variants = {
  initial: (dir: number) => ({
    y: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    filter: "blur(2px)",
  }),
  animate: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    y: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    filter: "blur(2px)",
  }),
}

/**
 * Kinetic Sliding Suffix for billing frequency display
 */
export const SlidingSuffix = React.memo(function SlidingSuffix({
  text,
  direction = 1,
  className,
}: {
  text: string
  direction?: number
  className?: string
}) {
  return (
    <motion.div
      layout="position"
      transition={SPRING.pill}
      className="relative inline-flex h-[1.35em] items-baseline [clip-path:inset(0_0_0_0)]"
    >
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.span
          key={text}
          custom={direction}
          variants={suffixVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={SPRING.snappy}
          className={cn(
            "font-sans text-xs leading-none font-medium whitespace-nowrap sm:text-sm",
            className
          )}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  )
})

/**
 * Normalizes string or object feature descriptions.
 */
export function parseFeature(feat: FeatureType | unknown): {
  text: string
  icon?: string
} {
  if (typeof feat === "string") return { text: feat }
  if (typeof feat === "object" && feat !== null && "text" in feat) {
    return feat as { text: string; icon?: string }
  }
  return { text: String(feat) }
}
