"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowUpRight01Icon,
  Book02Icon,
  BlocksIcon,
  SparklesIcon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ROUTES } from "@/lib/routes"
import { SPRING } from "@/lib/motion"

const HIGHLIGHTS = [
  {
    href: ROUTES.app,
    badge: "Workstation",
    title: "The Product Canvas",
    description:
      "A ready-to-scale interactive application workspace. Responsive navigation rail, state persistence, and instant command menu integration.",
    icon: SparklesIcon,
    subPills: ["AppShell", "Responsive Rail", "Active State"],
    featured: true,
  },
  {
    href: ROUTES.docs,
    badge: "Documentation",
    title: "Dual Docs Architecture",
    description: `Signature Spatial & Three-Pane shells built on Fumadocs. Zero borders, balanced 45-75 char measure, and live MDX previews.`,
    icon: Book02Icon,
    subPills: ["Spatial Layout", "Three-Pane", "Fumadocs"],
    featured: true,
  },
  {
    href: ROUTES.docsSample,
    badge: "Component Kit",
    title: "Token-Driven Primitives",
    description:
      "Handcrafted UI components powered by OKLCH color ramps and spring physics. Install any primitive via the shadcn CLI.",
    icon: BlocksIcon,
    subPills: ["100% Tokens", "Spring Physics", "CLI Ready"],
    featured: false,
  },
  {
    href: ROUTES.docsStructure,
    badge: "Engineering",
    title: "Doctor-Verified Quality",
    description:
      "Built to the highest engineering contract. Zero-key boot rule, 13 automated health checks, and strict route safety.",
    icon: SecurityCheckIcon,
    subPills: ["Zero-Key Boot", "13 Doctor Checks", "Strict Routes"],
    featured: false,
  },
]

export function Launchpad() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-24">
      {/* Section Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
          Architecture & Foundation
        </span>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Engineered for production from day one.
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          Everything you need to craft high-velocity web applications with docs
          that stay perfectly in sync.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {HIGHLIGHTS.map(
          ({ href, badge, title, description, icon, subPills }) => (
            <motion.div
              key={href}
              whileHover={{ y: -3 }}
              transition={SPRING.card}
            >
              <Link
                href={href}
                className="group relative flex h-full flex-col justify-between rounded-3xl bg-secondary p-6 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:p-7"
              >
                <div>
                  {/* Header row with Icon and Badge */}
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <HugeiconsIcon icon={icon} className="size-5" />
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      {badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 flex items-center gap-1 font-heading text-lg font-bold text-foreground">
                    {title}
                    <HugeiconsIcon
                      icon={ArrowUpRight01Icon}
                      className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>

                {/* Sub-pills footer */}
                <div className="mt-6 flex flex-wrap items-center gap-1.5 pt-2">
                  {subPills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-lg bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          )
        )}
      </div>
    </section>
  )
}
