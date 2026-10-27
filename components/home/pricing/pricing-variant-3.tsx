"use client"

import * as React from "react"
import Link from "next/link"
import NumberFlow, { NumberFlowGroup } from "@number-flow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import {
  type Audience,
  type Cadence,
  type PricingTier,
  type EnterpriseInfo,
  DEFAULT_CURRENT_TOOL_TIER,
  DEFAULT_SUITE_ACCESS_TIER,
  DEFAULT_ENTERPRISE_INFO,
} from "@/lib/pricing"
import { CADENCE_ORDER, SlidingSuffix } from "./pricing-shared"
import {
  PricingV1Controls,
  PricingV1Enterprise,
  PricingV1Faq,
} from "./pricing-variant-1"

export interface MatrixRow {
  name: string
  description?: string
  toolValue: string | boolean
  suiteValue: string | boolean
}

export interface MatrixCategory {
  index: string
  title: string
  rows: MatrixRow[]
}

/**
 * Swiss Architectural Matrix Specifications:
 * Comprehensive, honest, developer-first deliverables.
 */
export const MATRIX_CATEGORIES: MatrixCategory[] = [
  {
    index: "01",
    title: "Codebase & Architecture",
    rows: [
      {
        name: "Full TypeScript Source Code",
        description:
          "Zero obfuscated bundles; complete component kit & app shell.",
        toolValue: true,
        suiteValue: true,
      },
      {
        name: "Next.js 16 (Turbopack) Engine",
        description:
          "Built for Turbopack with App Router and server-component routing.",
        toolValue: true,
        suiteValue: true,
      },
      {
        name: "100% OKLCH Token Design System",
        description:
          "Zero hardcoded colors; accessible light/dark palette scales.",
        toolValue: true,
        suiteValue: true,
      },
      {
        name: "Zero-Key Boot Architecture",
        description:
          "Boots, builds, and passes tests with an empty .env.local file.",
        toolValue: true,
        suiteValue: true,
      },
      {
        name: "Fumadocs Spatial MDX Engine",
        description:
          "Three-pane MDX docs with liquid scroll-spy and code sandboxes.",
        toolValue: true,
        suiteValue: true,
      },
    ],
  },
  {
    index: "02",
    title: "Licensing & Commercial Scope",
    rows: [
      {
        name: "Developer License Seats",
        description:
          "Seats authorized to develop, build, and deploy the source code.",
        toolValue: "1 developer seat",
        suiteValue: "1 seat (Unlimited for Team)",
      },
      {
        name: "Commercial Client Deployments",
        description:
          "Deploy client websites and customer applications with zero royalties.",
        toolValue: "Unlimited client projects",
        suiteValue: "Unlimited client projects",
      },
      {
        name: "SaaS Product Rights",
        description: "Build revenue-generating commercial software products.",
        toolValue: "1 commercial SaaS product",
        suiteValue: "Unlimited SaaS products",
      },
      {
        name: "Perpetual Fallback License",
        description:
          "Keep and ship with downloaded versions forever even after cancellation.",
        toolValue: true,
        suiteValue: true,
      },
    ],
  },
  {
    index: "03",
    title: "Ecosystem & Private Registry",
    rows: [
      {
        name: "Software Scope",
        description: "Included templates, web apps, and component libraries.",
        toolValue: "This tool only",
        suiteValue: "All 12+ current & future tools",
      },
      {
        name: "Private CLI Registry Token",
        description:
          "Token for shadcn CLI upstream mirroring and package sync.",
        toolValue: "This tool package token",
        suiteValue: "Full umbrella access token",
      },
      {
        name: "Automated Upstream Component Sync",
        description:
          "One-command sync with new component releases and bug fixes.",
        toolValue: "Manual / CLI pull",
        suiteValue: true,
      },
      {
        name: "Figma & Penpot Token Kits",
        description: "Complete design kit matching production code tokens.",
        toolValue: "Optional add-on",
        suiteValue: true,
      },
    ],
  },
  {
    index: "04",
    title: "Support, Upgrades & Escrow",
    rows: [
      {
        name: "Release & Updates Policy",
        description: "Continuous version upgrades, maintenance, and bug fixes.",
        toolValue: "Lifetime updates for this app",
        suiteValue: "Lifetime updates for all apps",
      },
      {
        name: "Community Discord Support",
        description: "Access to private Discord developer community.",
        toolValue: true,
        suiteValue: true,
      },
      {
        name: "Private Dedicated Slack Channel",
        description:
          "Direct real-time communication with Satisium core engineers.",
        toolValue: false,
        suiteValue: true,
      },
      {
        name: "Architecture & Code Review",
        description:
          "Hands-on architectural review of your application implementation.",
        toolValue: false,
        suiteValue: "Priority review",
      },
    ],
  },
]

/**
 * Helper to render cell values: Checkmark, Em-Dash, or Typographic Text
 */
export function PricingV3SpecCell({
  value,
  isHero = false,
}: {
  value: string | boolean
  isHero?: boolean
}) {
  if (value === true) {
    return (
      <span className="inline-flex items-center">
        <HugeiconsIcon
          icon={Tick02Icon}
          className={cn(
            "size-4 shrink-0",
            isHero ? "text-primary" : "text-muted-foreground"
          )}
        />
      </span>
    )
  }

  if (value === false) {
    return (
      <span className="font-mono text-xs text-muted-foreground select-none">
        —
      </span>
    )
  }

  return (
    <span
      className={cn(
        "font-sans text-xs leading-snug sm:text-[13px]",
        isHero ? "font-medium text-foreground" : "text-muted-foreground"
      )}
    >
      {value}
    </span>
  )
}

/**
 * ============================================================================
 * PRICING V3 DUAL PURCHASE LEDGE CARDS
 * ============================================================================
 */
export interface PricingV3DualCardsProps extends React.ComponentProps<"div"> {
  toolPlan: PricingTier
  suitePlan: PricingTier
  toolPrice: number
  suitePrice: number
  audience: Audience
  cadence: Cadence
  direction?: number
  className?: string
}

export function PricingV3DualCards({
  toolPlan,
  suitePlan,
  toolPrice,
  suitePrice,
  audience,
  cadence,
  direction = 1,
  className,
  ...props
}: PricingV3DualCardsProps) {
  const suffix =
    cadence === "monthly"
      ? "/ Month"
      : cadence === "annual"
        ? "/ Year"
        : "one-time"

  return (
    <NumberFlowGroup>
      <div
        className={cn(
          "mt-8 grid w-full grid-cols-1 gap-5 sm:mt-10 sm:gap-6 md:mt-14 md:grid-cols-2 lg:mt-14",
          className
        )}
        {...props}
      >
        {/* Ledge Bay 1: Single Tool */}
        <article className="relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-muted p-1.5 text-card-foreground transition-all sm:p-1.5">
          <div className="flex flex-1 flex-col">
            <div className="rounded-[18px] bg-background px-6 py-4.5 transition-all sm:px-7 sm:py-5 dark:bg-secondary">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {toolPlan.name}
                </h3>
                <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[10px] font-semibold tracking-wide text-muted-foreground">
                  Single Tool
                </span>
              </div>
              <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                {toolPlan.tagline}
              </p>
            </div>

            <div className="flex flex-1 flex-col justify-between px-6 pt-7 pb-7 sm:px-7 sm:pt-8 sm:pb-8">
              <div>
                <div className="flex items-baseline gap-2">
                  <NumberFlow
                    value={toolPrice}
                    format={{
                      style: "currency",
                      currency: "USD",
                      trailingZeroDisplay: "stripIfInteger",
                    }}
                    className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-[44px]"
                  />
                  <SlidingSuffix
                    text={suffix}
                    direction={direction}
                    className="text-muted-foreground"
                  />
                </div>
                <p className="mt-1.5 font-sans text-xs text-muted-foreground">
                  {audience === "individual"
                    ? "1 developer seat · Personal & commercial rights"
                    : "Up to 10 team seats (~$35/seat) · Team license"}
                </p>
                {/* Fixed height spacer for baseline parity with suite card */}
                <p className="invisible mt-1 min-h-[17px] font-sans text-[11px] font-medium">
                  Placeholder
                </p>
              </div>

              <div className="mt-5 sm:mt-6">
                <Link
                  href={toolPlan.cta.href}
                  className="inline-flex h-10 w-full items-center justify-center rounded-[12px] bg-background font-sans text-xs font-medium text-foreground transition-all hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98] sm:text-sm dark:bg-secondary dark:text-foreground dark:hover:bg-muted"
                >
                  {toolPlan.cta.text}
                </Link>
                <p className="mt-2 text-center font-sans text-[11px] text-muted-foreground select-none">
                  {cadence === "lifetime"
                    ? "Pay once, own forever · 14-day refund guarantee"
                    : "7-day free trial · Cancel anytime with 1 click"}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Ledge Bay 2: All-Access Suite (Wrapped in Overgrown Primary Cradle) */}
        <div className="relative flex flex-col md:-mx-[2px] md:-mt-[30px] md:-mb-[2px]">
          <div className="relative flex flex-1 flex-col overflow-hidden rounded-[26px] bg-primary p-[2px] text-primary-foreground drop-shadow-2xl">
            {/* Overgrown Top Crown */}
            <div className="flex h-[30px] items-center justify-between px-3 font-heading text-[11px] font-semibold tracking-wide text-primary-foreground select-none">
              <span className="flex items-center gap-1.5">
                <span>✦</span>
                <span>Best Value</span>
              </span>
              <span className="font-sans text-[10.5px] font-medium text-primary-foreground">
                Suite Access
              </span>
            </div>

            {/* Inner Card (Identical in size, structure and alignment to sibling card) */}
            <article className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[24px] bg-muted p-1.5 text-card-foreground transition-all sm:p-1.5">
              <div className="flex flex-1 flex-col">
                <div className="rounded-[18px] bg-background px-6 py-4.5 transition-all sm:px-7 sm:py-5 dark:bg-secondary">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                      {suitePlan.name}
                    </h3>
                  </div>
                  <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                    Unlocks this tool plus all 12+ current & upcoming Satisium
                    products forever.
                  </p>
                </div>

                <div className="flex flex-1 flex-col justify-between px-6 pt-7 pb-7 sm:px-7 sm:pt-8 sm:pb-8">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <NumberFlow
                        value={suitePrice}
                        format={{
                          style: "currency",
                          currency: "USD",
                          trailingZeroDisplay: "stripIfInteger",
                        }}
                        className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-[44px]"
                      />
                      <SlidingSuffix
                        text={suffix}
                        direction={direction}
                        className="text-muted-foreground"
                      />
                    </div>
                    <p className="mt-1.5 font-sans text-xs text-muted-foreground">
                      {audience === "individual"
                        ? "1 developer seat · Personal & commercial rights"
                        : "Unlimited organization seats · Enterprise license"}
                    </p>
                    <p
                      className={cn(
                        "mt-1 min-h-[17px] font-sans text-[11px] font-medium",
                        cadence === "lifetime" ? "text-primary" : "invisible"
                      )}
                    >
                      Save 75% vs. buying individually
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <Link
                      href={suitePlan.cta.href}
                      className="inline-flex h-10 w-full items-center justify-center rounded-[12px] bg-primary font-sans text-xs font-medium text-primary-foreground transition-all hover:bg-primary focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98] sm:text-sm"
                    >
                      {suitePlan.cta.text}
                    </Link>
                    <p className="mt-2 text-center font-sans text-[11px] text-muted-foreground select-none">
                      {cadence === "lifetime"
                        ? "Pay once, own forever · 14-day refund guarantee"
                        : "7-day free trial · Cancel anytime with 1 click"}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </NumberFlowGroup>
  )
}

/**
 * ============================================================================
 * PRICING V3 MATRIX COMPARISON TABLE
 * ============================================================================
 */
export interface PricingV3MatrixTableProps extends React.ComponentProps<"div"> {
  toolPlanName: string
  suitePlanName: string
  categories?: MatrixCategory[]
  className?: string
}

export function PricingV3MatrixTable({
  toolPlanName,
  suitePlanName,
  categories = MATRIX_CATEGORIES,
  className,
  ...props
}: PricingV3MatrixTableProps) {
  return (
    <div className={cn("mt-14 w-full sm:mt-20", className)} {...props}>
      {/* Editorial Spec Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-sans text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase">
            FULL TECHNICAL SPECIFICATION
          </span>
          <h3 className="mt-1 font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Side-by-side feature comparison
          </h3>
        </div>
        <p className="font-sans text-xs text-muted-foreground sm:text-right">
          Granular capability breakdown across individual and suite licenses.
        </p>
      </div>

      {/* Satisium Squircle Spec Frame */}
      <div className="mt-6 w-full overflow-hidden rounded-[24px] bg-muted p-1.5 transition-colors sm:p-1.5">
        <div className="overflow-x-auto rounded-[18px] bg-background dark:bg-secondary">
          <table className="w-full min-w-[580px] border-separate border-spacing-0 text-left sm:min-w-full">
            <thead>
              <tr className="bg-background dark:bg-secondary">
                <th
                  scope="col"
                  className="rounded-tl-[18px] border-b border-border px-5 py-4 font-sans text-xs font-medium text-muted-foreground sm:px-6"
                >
                  Capability / Spec
                </th>
                <th
                  scope="col"
                  className="w-[180px] border-b border-border px-5 py-4 font-sans text-xs font-semibold text-foreground sm:w-[220px] sm:px-6"
                >
                  {toolPlanName}
                </th>
                <th
                  scope="col"
                  className="w-[200px] rounded-tr-[18px] border-b border-border px-5 py-4 font-sans sm:w-[240px] sm:px-6"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {suitePlanName}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-[6px] bg-primary px-2 py-0.5 font-sans text-[10px] font-semibold text-primary-foreground select-none">
                      <span>✦</span>
                      <span>Suite</span>
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category, catIdx) => (
                <React.Fragment key={category.index}>
                  {/* Refined Typographic Category Eyebrow - Zero Zebra Striping */}
                  <tr>
                    <td
                      colSpan={3}
                      className={cn(
                        "px-5 pb-3 sm:px-6",
                        catIdx === 0 ? "pt-6 sm:pt-7" : "pt-8 sm:pt-9"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[10.5px] font-semibold text-muted-foreground select-none dark:bg-muted">
                          {category.index}
                        </span>
                        <span className="font-heading text-xs font-semibold tracking-wider text-foreground uppercase sm:text-[13px]">
                          {category.title}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Feature Rows */}
                  {category.rows.map((row, rIdx) => {
                    const isLastRow =
                      catIdx === categories.length - 1 &&
                      rIdx === category.rows.length - 1

                    return (
                      <tr
                        key={rIdx}
                        className="group transition-colors hover:bg-muted dark:hover:bg-muted"
                      >
                        <td
                          className={cn(
                            "px-5 py-3.5 sm:px-6 sm:py-4",
                            isLastRow && "rounded-bl-[18px]"
                          )}
                        >
                          <div className="font-sans text-xs font-medium text-foreground sm:text-[13px]">
                            {row.name}
                          </div>
                          {row.description && (
                            <p className="mt-0.5 font-sans text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                              {row.description}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 align-middle sm:px-6 sm:py-4">
                          <PricingV3SpecCell
                            value={row.toolValue}
                            isHero={false}
                          />
                        </td>
                        <td
                          className={cn(
                            "px-5 py-3.5 align-middle sm:px-6 sm:py-4",
                            isLastRow && "rounded-br-[18px]"
                          )}
                        >
                          <PricingV3SpecCell
                            value={row.suiteValue}
                            isHero={true}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/**
 * ============================================================================
 * PRICING VARIANT 3 PRESET: Swiss Spec Matrix & Comparative Table
 * ============================================================================
 */
export interface PricingVariant3Props extends React.ComponentProps<"section"> {
  className?: string
  heading?: string
  description?: string
  toolPlan?: PricingTier
  suitePlan?: PricingTier
  enterpriseInfo?: EnterpriseInfo
  showEnterprise?: boolean
  showFaq?: boolean
}

export function PricingVariant3({
  className,
  heading = "Simple, transparent pricing.",
  description = "Get started with this tool or unlock lifetime access to the complete suite.",
  toolPlan = DEFAULT_CURRENT_TOOL_TIER,
  suitePlan = DEFAULT_SUITE_ACCESS_TIER,
  enterpriseInfo = DEFAULT_ENTERPRISE_INFO,
  showEnterprise = true,
  showFaq = true,
  ...props
}: PricingVariant3Props) {
  const [audience, setAudience] = React.useState<Audience>("individual")
  const [cadence, setCadence] = React.useState<Cadence>("lifetime")
  const [direction, setDirection] = React.useState<number>(1)

  const handleCadenceChange = React.useCallback((newCadence: Cadence) => {
    setCadence((current) => {
      if (newCadence === current) return current
      const prevOrder = CADENCE_ORDER[current]
      const newOrder = CADENCE_ORDER[newCadence]
      setDirection(newOrder >= prevOrder ? 1 : -1)
      return newCadence
    })
  }, [])

  const getPrice = (tier: PricingTier) => {
    const priceMap = tier.prices[audience]
    return priceMap[cadence] ?? priceMap.lifetime ?? 0
  }

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className={cn(
        "relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 select-none sm:px-6",
        className
      )}
      {...props}
    >
      {/* 1. Typographic Header */}
      {heading && (
        <h2 className="text-center font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {heading}
        </h2>
      )}

      {description && (
        <p className="mt-2 max-w-md text-center font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {description}
        </p>
      )}

      {/* 2. Controls */}
      <PricingV1Controls
        audience={audience}
        onAudienceChange={setAudience}
        cadence={cadence}
        onCadenceChange={handleCadenceChange}
      />

      {/* 3. Dual Purchase Ledge Cards */}
      <PricingV3DualCards
        toolPlan={toolPlan}
        suitePlan={suitePlan}
        toolPrice={getPrice(toolPlan)}
        suitePrice={getPrice(suitePlan)}
        audience={audience}
        cadence={cadence}
        direction={direction}
      />

      {/* 4. Swiss Spec Matrix Comparison Table */}
      <PricingV3MatrixTable
        toolPlanName={toolPlan.name}
        suitePlanName={suitePlan.name}
      />

      {/* 5. Enterprise Foundation Slab */}
      {showEnterprise && enterpriseInfo && (
        <PricingV1Enterprise enterpriseInfo={enterpriseInfo} />
      )}

      {/* 6. Pre-purchase FAQ */}
      {showFaq && <PricingV1Faq />}
    </section>
  )
}
