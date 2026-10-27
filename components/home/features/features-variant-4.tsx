"use client"

import * as React from "react"
import Link from "next/link"
import { Check, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/routes"
import {
  Features,
  FeaturesHeader,
  FeaturesHeading,
  FeaturesDescription,
  type FeaturesProps,
} from "./features"

export interface FeatureItem {
  id: string
  title: string
  summary: string
  href: string
  renderArtifact: () => React.ReactNode
}

/**
 * 1. WORKSTATION ARTIFACT
 * Grounded 3D keycaps [ ⌘ ] [ K ] beside a miniature spatial rail
 */
export function WorkstationArtifact({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex items-center justify-center gap-3 py-2",
        className
      )}
    >
      {/* Miniature Spatial Rail */}
      <div className="flex h-20 w-8 flex-col items-center justify-between rounded-[12px] bg-background py-2">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <div className="h-1.5 w-1.5 rounded-full bg-muted" />
        <div className="h-1.5 w-1.5 rounded-full bg-muted" />
        <div className="h-1.5 w-1.5 rounded-full bg-muted" />
      </div>

      {/* Keycaps */}
      <div className="flex items-center gap-1.5">
        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-background font-mono text-sm font-semibold text-foreground sm:h-12 sm:w-12 sm:text-base">
          ⌘
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-background font-mono text-sm font-semibold text-foreground sm:h-12 sm:w-12 sm:text-base">
          K
        </div>
      </div>
    </div>
  )
}

/**
 * 2. DUAL-LAYOUT DOCS ARTIFACT
 * Segmented reading pill over an abstract MDX prose wireframe with scroll-spy rail
 */
export function DocsArtifact({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 py-2",
        className
      )}
    >
      {/* Mode Switcher Pill */}
      <div className="inline-flex items-center rounded-full bg-background p-1">
        <span className="rounded-full bg-primary px-3 py-1 font-sans text-[11px] font-medium text-primary-foreground">
          Spatial
        </span>
        <span className="px-3 py-1 font-sans text-[11px] font-medium text-muted-foreground">
          Three-Pane
        </span>
      </div>

      {/* Abstract Prose Wireframe with Scroll-Spy */}
      <div className="flex w-44 items-center justify-between rounded-[10px] bg-background p-2.5">
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-24 rounded-full bg-muted" />
          <div className="h-1.5 w-32 rounded-full bg-muted" />
          <div className="h-1.5 w-16 rounded-full bg-muted" />
        </div>
        <div className="flex flex-col items-center gap-1 pl-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <div className="h-1 w-1 rounded-full bg-muted" />
          <div className="h-1 w-1 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  )
}

/**
 * 3. TOKEN ARCHITECTURE ARTIFACT
 * OKLCH color token swatch pills in harmonic 2x2 cluster
 */
export function TokensArtifact({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex items-center justify-center py-2",
        className
      )}
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 rounded-[9px] bg-primary px-3 py-1.5 text-primary-foreground">
          <div className="h-2 w-2 rounded-full bg-primary-foreground" />
          <span className="font-mono text-[11px] font-medium">primary</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-[9px] bg-background px-3 py-1.5 text-foreground">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-mono text-[11px] font-medium">background</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-[9px] bg-accent px-3 py-1.5 text-accent-foreground">
          <div className="h-2 w-2 rounded-full bg-accent-foreground" />
          <span className="font-mono text-[11px] font-medium">accent</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-[9px] bg-card px-3 py-1.5 text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-muted-foreground" />
          <span className="font-mono text-[11px] font-medium">muted</span>
        </div>
      </div>
    </div>
  )
}

/**
 * 4. ZERO-KEY GUARANTEE ARTIFACT
 * Compact terminal console pill verifying empty .env.local boot
 */
export function ZeroKeyArtifact({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex items-center justify-center py-2",
        className
      )}
    >
      <div className="flex w-52 flex-col gap-2 rounded-[14px] bg-background p-3">
        {/* Terminal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-muted" />
            <div className="h-2 w-2 rounded-full bg-muted" />
            <div className="h-2 w-2 rounded-full bg-muted" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            zsh
          </span>
        </div>

        {/* Command */}
        <div className="font-mono text-xs text-foreground">
          <span className="text-muted-foreground">$ </span>
          <span>pnpm dev</span>
        </div>

        {/* Status Line */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>0 keys needed · 78ms</span>
        </div>
      </div>
    </div>
  )
}

/**
 * 5. CALIBRATED PHYSICS ARTIFACT
 * Kinetic spring curve visualization showing Satisium's signature outExpo curve
 */
export function PhysicsArtifact({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex flex-col items-center justify-center gap-2.5 py-2",
        className
      )}
    >
      <div className="flex flex-col items-center rounded-[14px] bg-background px-4 py-3">
        {/* Spring Bezier Curve Graphic */}
        <svg
          className="h-10 w-28 text-primary"
          viewBox="0 0 100 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Guide baseline */}
          <line
            x1="0"
            y1="34"
            x2="100"
            y2="34"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeDasharray="2 2"
          />
          {/* outExpo Bezier Curve */}
          <path
            d="M 4 34 C 16 34, 12 4, 96 4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Moving Inertia Resting Dot */}
          <circle cx="96" cy="4" r="3.5" className="fill-primary" />
        </svg>

        {/* Easing Token Tag */}
        <div className="mt-1 flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-muted-foreground">
          <Sparkles className="h-2.5 w-2.5 text-primary" />
          <span>EASE.outExpo</span>
        </div>
      </div>
    </div>
  )
}

/**
 * 6. TYPED ROUTE GRAPH ARTIFACT
 * Clean code chip pill with compile-time route safety verification
 */
export function RoutesArtifact({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex items-center justify-center py-2",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 rounded-[14px] bg-background px-3.5 py-2.5 font-mono text-xs">
          <span className="font-semibold text-primary">ROUTES.app</span>
          <span className="text-muted-foreground">→</span>
          <span className="rounded-[6px] bg-muted px-1.5 py-0.5 text-foreground">
            &quot;/app&quot;
          </span>
        </div>

        {/* TypeScript strict badge */}
        <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] font-medium text-primary">
          TypeScript · strict
        </span>
      </div>
    </div>
  )
}

export const DEFAULT_ARTIFACT_ITEMS: FeatureItem[] = [
  {
    id: "workstation",
    title: "Spatial Workstation",
    summary: "Collapsible rail with persistent canvas layout stores.",
    href: ROUTES.app,
    renderArtifact: () => <WorkstationArtifact />,
  },
  {
    id: "docs",
    title: "Dual-Layout Docs",
    summary: "Fumadocs MDX engine with instant reading mode switch.",
    href: ROUTES.docs,
    renderArtifact: () => <DocsArtifact />,
  },
  {
    id: "tokens",
    title: "Token Architecture",
    summary: "Strict OKLCH color palettes with zero raw hex values.",
    href: ROUTES.docsComponents,
    renderArtifact: () => <TokensArtifact />,
  },
  {
    id: "zero-key",
    title: "Zero-Key Guarantee",
    summary: "Boots, builds, and tests with an empty .env.local.",
    href: ROUTES.docsStructure,
    renderArtifact: () => <ZeroKeyArtifact />,
  },
  {
    id: "physics",
    title: "Calibrated Physics",
    summary: "Named springs and easings, zero arbitrary numbers.",
    href: ROUTES.docsComponents,
    renderArtifact: () => <PhysicsArtifact />,
  },
  {
    id: "routes",
    title: "Typed Route Graph",
    summary: "Every path is typed and guaranteed at compile time.",
    href: ROUTES.home,
    renderArtifact: () => <RoutesArtifact />,
  },
]

/**
 * ============================================================================
 * ARTIFACT GRID: 3-Column Minimalist Matrix
 * ============================================================================
 */
export interface ArtifactGridProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function ArtifactGrid({
  className,
  children,
  ...props
}: ArtifactGridProps) {
  return (
    <div
      className={cn(
        "mt-8 grid w-full grid-cols-1 gap-2.5 sm:mt-10 sm:gap-3 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ============================================================================
 * ARTIFACT CARD: Physical Micro-UI Card
 * ============================================================================
 */
export interface ArtifactCardProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  href?: string
  title?: React.ReactNode
  summary?: React.ReactNode
  visual?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function ArtifactCard({
  href,
  title,
  summary,
  visual,
  className,
  children,
  ...props
}: ArtifactCardProps) {
  const cardContent = children ?? (
    <>
      {/* Top Stage: Physical Micro-UI Metaphor (~68% height) */}
      {visual && (
        <div className="relative flex flex-1 items-center justify-center py-2 sm:py-3">
          {visual}
        </div>
      )}

      {/* Bottom Zone: Radical 2-Line Text Brevity (~32% height) */}
      {(title || summary) && (
        <div className="flex flex-col gap-1 pt-1.5">
          {title && (
            <h3 className="font-heading text-base font-semibold tracking-tight text-foreground sm:text-lg">
              {title}
            </h3>
          )}
          {summary && (
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {summary}
            </p>
          )}
        </div>
      )}
    </>
  )

  const cardClasses = cn(
    "group relative flex min-h-[285px] flex-col justify-between overflow-hidden rounded-[18px] bg-muted p-4 transition-colors duration-300 ease-out hover:bg-secondary focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none sm:min-h-[305px] sm:rounded-[20px] sm:p-5.5",
    className
  )

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {cardContent}
      </Link>
    )
  }

  return (
    <div className={cardClasses} {...props}>
      {cardContent}
    </div>
  )
}

/**
 * ============================================================================
 * FEATURES VARIANT 4: Preset Wrapper
 * ============================================================================
 */
export interface FeaturesVariant4Props extends FeaturesProps {
  heading?: React.ReactNode
  description?: React.ReactNode
  items?: FeatureItem[]
}

export function FeaturesVariant4({
  className,
  heading = "Architectural primitives. Production-grade speed.",
  description = "Every capability engineered to stay out of your way.",
  items = DEFAULT_ARTIFACT_ITEMS,
  children,
  ...props
}: FeaturesVariant4Props) {
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

          <ArtifactGrid>
            {items.map((item) => (
              <ArtifactCard
                key={item.id}
                href={item.href}
                title={item.title}
                summary={item.summary}
                visual={item.renderArtifact()}
              />
            ))}
          </ArtifactGrid>
        </>
      )}
    </Features>
  )
}
