"use client"

import * as React from "react"
import Link from "next/link"
import NumberFlow, { NumberFlowGroup } from "@number-flow/react"
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
import {
  CADENCE_ORDER,
  FeatureIcon,
  FormattedFeatureText,
  SlidingSuffix,
  parseFeature,
} from "./pricing-shared"
import {
  PricingV1Controls,
  PricingV1Enterprise,
  PricingV1Faq,
} from "./pricing-variant-1"

/**
 * ============================================================================
 * PRICING V2 COMPARE GRID: 2-Column Side-by-Side Comparative Layout
 * ============================================================================
 */
export interface PricingV2CompareGridProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function PricingV2CompareGrid({
  className,
  children,
  ...props
}: PricingV2CompareGridProps) {
  return (
    <NumberFlowGroup>
      <div
        className={cn(
          "mt-8 grid w-full grid-cols-1 gap-5 sm:mt-10 sm:gap-6 md:mt-14 md:grid-cols-2 lg:mt-14",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </NumberFlowGroup>
  )
}

/**
 * ============================================================================
 * PRICING V2 COMPARE CARD: Side-by-Side Dual-Surface Squircle Architecture
 * ============================================================================
 */
export interface PricingV2CompareCardProps extends React.ComponentProps<"article"> {
  tier: PricingTier
  price: number
  audience: Audience
  cadence: Cadence
  isHero?: boolean
  badge?: React.ReactNode
  tagline?: React.ReactNode
  featuresHeader?: string
  anchorText?: React.ReactNode
  direction?: number
  className?: string
}

export function PricingV2CompareCard({
  tier,
  price,
  audience,
  cadence,
  isHero = false,
  badge,
  tagline,
  featuresHeader,
  anchorText,
  direction = 1,
  className,
  ...props
}: PricingV2CompareCardProps) {
  const rawFeatures =
    tier.features?.[audience] ??
    tier.specs[audience].map((spec) => ({
      text: `**${spec.value}** ${spec.property.toLowerCase()}`,
    }))
  const features = rawFeatures.map(parseFeature)

  const suffix =
    cadence === "monthly"
      ? "/ Month"
      : cadence === "annual"
        ? "/ Year"
        : "one-time"

  const cardContent = (
    <div className="flex flex-1 flex-col">
      {/* Floating Header Squircle Bay */}
      <div className="rounded-[18px] bg-background px-6 py-4.5 transition-all sm:px-7 sm:py-5 dark:bg-secondary">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {tier.name}
          </h3>
          {badge && !isHero && (
            <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[10px] font-semibold tracking-wide text-muted-foreground">
              {badge}
            </span>
          )}
        </div>

        <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
          {tagline ?? tier.tagline}
        </p>
      </div>

      {/* Lower Body Deck */}
      <div className="flex flex-1 flex-col justify-between px-6 pt-7 pb-7 sm:px-7 sm:pt-8 sm:pb-8">
        <div>
          {/* Price Metric */}
          <div className="flex items-baseline gap-2">
            <NumberFlow
              value={price}
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

          {/* Audience Economics */}
          <p className="mt-1.5 font-sans text-xs leading-normal text-muted-foreground">
            {audience === "individual"
              ? "1 developer seat · Personal & commercial rights"
              : "Up to 10 team seats (~$35/seat) · Team license"}
          </p>

          {/* Optional Anchor Value Callout - Locked height for identical cross-card vertical baseline */}
          <p
            className={cn(
              "mt-1 min-h-[17px] font-sans text-[11px] font-medium",
              anchorText ? "text-primary" : "invisible"
            )}
          >
            {anchorText ?? "Placeholder"}
          </p>

          {/* Upfront CTA Button */}
          <div className="mt-5 sm:mt-6">
            <Link
              href={tier.cta.href}
              className={cn(
                "inline-flex h-10 w-full items-center justify-center rounded-[12px] font-sans text-xs font-medium transition-all focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98] sm:text-sm",
                isHero
                  ? "bg-primary text-primary-foreground hover:bg-primary"
                  : "bg-background text-foreground hover:bg-muted dark:bg-secondary dark:text-foreground dark:hover:bg-muted"
              )}
            >
              {tier.cta.text}
            </Link>
          </div>

          {/* Reassurance Micro-Copy */}
          <p className="mt-2 text-center font-sans text-[11px] leading-tight text-muted-foreground select-none">
            {cadence === "lifetime"
              ? "Pay once, own forever · 14-day refund guarantee"
              : "7-day free trial · Cancel anytime with 1 click"}
          </p>

          {/* Features Subheading - Pure vertical whitespace instead of hairline separator */}
          <span className="mt-8 block font-sans text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase sm:mt-9">
            {featuresHeader ?? "PLAN INCLUDES:"}
          </span>

          {/* Features List */}
          <ul className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3.5 py-0.5 font-sans text-xs leading-relaxed sm:text-[13px]"
              >
                <FeatureIcon
                  name={feature.icon}
                  className="mt-0.5 text-muted-foreground"
                />
                <FormattedFeatureText text={feature.text} isHero={false} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )

  if (!isHero) {
    return (
      <article
        className={cn(
          "relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-muted p-1.5 text-card-foreground transition-all sm:p-1.5",
          className
        )}
        {...props}
      >
        {cardContent}
      </article>
    )
  }

  return (
    <div
      className={cn(
        "relative flex flex-col md:-mx-[2px] md:-mt-[30px] md:-mb-[2px]",
        className
      )}
    >
      {/* Overgrown Primary Cradle (Box-Inside-Box Architecture) */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[26px] bg-primary p-[2px] text-primary-foreground drop-shadow-2xl">
        {/* Overgrown Top Crown */}
        <div className="flex h-[30px] items-center justify-between px-3 font-heading text-[11px] font-semibold tracking-wide text-primary-foreground select-none">
          <span className="flex items-center gap-1.5">
            <span>✦</span>
            <span>
              {badge ? String(badge).replace(/^✦\s*/, "") : "Best Value"}
            </span>
          </span>
          <span className="font-sans text-[10.5px] font-medium text-primary-foreground">
            Suite Access
          </span>
        </div>

        {/* Inner Card (Identical in size, structure and alignment to sibling card) */}
        <article
          className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[24px] bg-muted p-1.5 text-card-foreground transition-all sm:p-1.5"
          {...props}
        >
          {cardContent}
        </article>
      </div>
    </div>
  )
}

/**
 * ============================================================================
 * PRICING VARIANT 2 PRESET: 2-Column Comparative Standalone
 * ============================================================================
 */
export interface PricingVariant2Props extends React.ComponentProps<"section"> {
  className?: string
  heading?: string
  description?: string
  toolPlan?: PricingTier
  suitePlan?: PricingTier
  enterpriseInfo?: EnterpriseInfo
  showEnterprise?: boolean
  showFaq?: boolean
}

export function PricingVariant2({
  className,
  heading = "Simple, transparent pricing.",
  description = "Get started with this tool or unlock lifetime access to the complete suite.",
  toolPlan = DEFAULT_CURRENT_TOOL_TIER,
  suitePlan = DEFAULT_SUITE_ACCESS_TIER,
  enterpriseInfo = DEFAULT_ENTERPRISE_INFO,
  showEnterprise = true,
  showFaq = true,
  ...props
}: PricingVariant2Props) {
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

  const cards = [
    {
      tier: toolPlan,
      isHero: false,
      badge: "Single Tool",
      tagline: toolPlan.tagline,
      featuresHeader: "INCLUDES WITH THIS TOOL:",
      anchorText: null,
    },
    {
      tier: suitePlan,
      isHero: true,
      badge: "✦ Best Value",
      tagline:
        "Unlocks this tool plus all 12+ current & upcoming Satisium products forever.",
      featuresHeader: "EVERYTHING IN THIS TOOL, PLUS:",
      anchorText:
        cadence === "lifetime" ? "Save 75% vs. buying individually" : null,
    },
  ]

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

      {/* 3. Comparative Cards */}
      <PricingV2CompareGrid>
        {cards.map((card) => (
          <PricingV2CompareCard
            key={card.tier.id}
            tier={card.tier}
            price={getPrice(card.tier)}
            audience={audience}
            cadence={cadence}
            isHero={card.isHero}
            badge={card.badge}
            tagline={card.tagline}
            featuresHeader={card.featuresHeader}
            anchorText={card.anchorText}
            direction={direction}
          />
        ))}
      </PricingV2CompareGrid>

      {/* 4. Enterprise Slab */}
      {showEnterprise && enterpriseInfo && (
        <PricingV1Enterprise enterpriseInfo={enterpriseInfo} />
      )}

      {/* 5. Pre-purchase FAQ */}
      {showFaq && <PricingV1Faq />}
    </section>
  )
}
