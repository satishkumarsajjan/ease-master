"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/routes"
import {
  Features,
  FeaturesHeader,
  FeaturesHeading,
  FeaturesDescription,
  type FeaturesProps,
} from "./features"

export interface QuadrantItem {
  id: string
  label: string
  index: string
  title: string
  summary: string
  href: string
  linkText: string
  specs: { property: string; value: string }[]
}

export const DEFAULT_QUADRANTS: QuadrantItem[] = [
  {
    id: "workstation",
    label: "Workstation",
    index: "01",
    title: "The application canvas.",
    summary:
      "A focused workspace designed for building tools and canvas utilities, with a collapsible spatial rail and reactive layout stores.",
    href: ROUTES.app,
    linkText: "Open /app →",
    specs: [
      { property: "Route", value: "/app" },
      { property: "Shell", value: "app-shell.tsx" },
      { property: "Store", value: "Zustand" },
    ],
  },
  {
    id: "docs",
    label: "Documentation",
    index: "02",
    title: "Dual-layout docs engine.",
    summary:
      "Fumadocs MDX engine with interchangeable Spatial and Three-Pane reading modes and liquid scroll-spy navigation.",
    href: ROUTES.docs,
    linkText: "Explore /docs →",
    specs: [
      { property: "Route", value: "/docs" },
      { property: "Engine", value: "Fumadocs MDX" },
      { property: "TOC", value: "Scroll-spy" },
    ],
  },
  {
    id: "primitives",
    label: "Primitives",
    index: "03",
    title: "Token-driven component kit.",
    summary:
      "Every primitive is built strictly from OKLCH design tokens with zero raw hex colors and named physical spring constants.",
    href: ROUTES.docsComponents,
    linkText: "Browse /docs/components →",
    specs: [
      { property: "Tokens", value: "OKLCH C=0" },
      { property: "Motion", value: "lib/motion.ts" },
      { property: "CLI", value: "shadcn registry" },
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    index: "04",
    title: "The zero-key guarantee.",
    summary:
      "Boots, builds, and passes all tests with an empty .env.local. All routes are strictly typed in lib/routes.ts.",
    href: ROUTES.docsStructure,
    linkText: "Read /docs/project-structure →",
    specs: [
      { property: "Boot Keys", value: "0 required" },
      { property: "Routes", value: "100% typed" },
      { property: "Checks", value: "13 doctor rules" },
    ],
  },
]

/**
 * ============================================================================
 * FEATURE MATRIX: 2x2 Swiss Architectural Crosshair Chassis
 * ============================================================================
 */
export interface FeatureMatrixProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function FeatureMatrix({
  className,
  children,
  ...props
}: FeatureMatrixProps) {
  return (
    <div
      className={cn(
        "relative mt-8 w-full overflow-hidden rounded-[20px] bg-muted p-1 sm:mt-10 sm:rounded-[24px] sm:p-1.5",
        className
      )}
      {...props}
    >
      <div className="relative w-full overflow-hidden rounded-[16px] bg-background sm:rounded-[18px]">
        <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-y-0">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * ============================================================================
 * FEATURE MATRIX CARD: Single Swiss Cell
 * ============================================================================
 */
export interface FeatureMatrixCardProps extends Omit<
  React.ComponentProps<"article">,
  "title"
> {
  index?: string
  label?: string
  title?: React.ReactNode
  summary?: React.ReactNode
  href?: string
  linkText?: React.ReactNode
  specs?: { property: string; value: string }[]
  borderRight?: boolean
  borderBottom?: boolean
  className?: string
  children?: React.ReactNode
}

export function FeatureMatrixCard({
  index,
  label,
  title,
  summary,
  href,
  linkText,
  specs,
  borderRight,
  borderBottom,
  className,
  children,
  ...props
}: FeatureMatrixCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between p-4 transition-colors duration-200 focus-within:bg-accent hover:bg-accent sm:p-7 md:p-8",
        borderRight && "md:border-r md:border-border",
        borderBottom && "md:border-b md:border-border",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {/* Top Chapter Header & Narrative */}
          <div>
            {(index || label) && (
              <div className="flex items-center gap-2">
                {index && (
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {index}
                  </span>
                )}
                {index && label && (
                  <span className="font-mono text-xs text-muted-foreground">
                    /
                  </span>
                )}
                {label && (
                  <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    {label}
                  </span>
                )}
              </div>
            )}

            {title && (
              <h3 className="mt-3.5 font-heading text-lg font-medium tracking-tight text-foreground sm:mt-4 sm:text-xl">
                {title}
              </h3>
            )}

            {summary && (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {summary}
              </p>
            )}
          </div>

          {/* Bottom Spec Sheet & Action Link */}
          <div className="mt-6">
            {specs && specs.length > 0 && (
              <div className="space-y-1.5">
                {specs.map((spec) => (
                  <div
                    key={spec.property}
                    className="flex items-baseline justify-between gap-4 py-1 font-mono text-xs"
                  >
                    <span className="shrink-0 text-muted-foreground">
                      {spec.property}
                    </span>
                    <span className="truncate text-right font-medium text-foreground">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {href && linkText && (
              <div className="mt-5 pt-1">
                <Link
                  href={href}
                  className="inline-flex items-center gap-1 rounded-xs font-mono text-xs font-medium text-primary transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {linkText}
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </article>
  )
}

/**
 * ============================================================================
 * FEATURES VARIANT 3: Preset Wrapper
 * ============================================================================
 */
export interface FeaturesVariant3Props extends FeaturesProps {
  heading?: React.ReactNode
  description?: React.ReactNode
  quadrants?: QuadrantItem[]
}

export function FeaturesVariant3({
  className,
  heading = "Built for scale. Refined for speed.",
  description = "Everything you need to craft high-velocity web applications with docs that stay in sync.",
  quadrants = DEFAULT_QUADRANTS,
  children,
  ...props
}: FeaturesVariant3Props) {
  return (
    <Features className={className} {...props}>
      {children ?? (
        <>
          {(heading || description) && (
            <FeaturesHeader>
              {heading && <FeaturesHeading>{heading}</FeaturesHeading>}
              {description && (
                <FeaturesDescription>{description}</FeaturesDescription>
              )}
            </FeaturesHeader>
          )}

          <FeatureMatrix>
            {quadrants.map((quad, idx) => (
              <FeatureMatrixCard
                key={quad.id}
                index={quad.index}
                label={quad.label}
                title={quad.title}
                summary={quad.summary}
                href={quad.href}
                linkText={quad.linkText}
                specs={quad.specs}
                borderRight={idx % 2 === 0}
                borderBottom={idx < 2}
              />
            ))}
          </FeatureMatrix>
        </>
      )}
    </Features>
  )
}
