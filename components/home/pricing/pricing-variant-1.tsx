"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence, LayoutGroup } from "motion/react"
import NumberFlow, { NumberFlowGroup } from "@number-flow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { SPRING } from "@/lib/motion"
import {
  type Audience,
  type Cadence,
  type PricingTier,
  type EnterpriseInfo,
  DEFAULT_CURRENT_TOOL_TIER,
  DEFAULT_SUITE_ACCESS_TIER,
  DEFAULT_TOOL_TEAM_TIER,
  DEFAULT_ENTERPRISE_INFO,
} from "@/lib/pricing"
import {
  PRICING_FAQS,
  CADENCE_ORDER,
  FeatureIcon,
  FormattedFeatureText,
  SlidingSuffix,
  parseFeature,
} from "./pricing-shared"

/**
 * ============================================================================
 * PRICING V1 CONTROLS: Concentric Squircle Slabs (Audience + Cadence Switcher)
 * ============================================================================
 */
export interface PricingV1ControlsProps {
  audience: Audience
  onAudienceChange: (audience: Audience) => void
  cadence: Cadence
  onCadenceChange: (cadence: Cadence) => void
  className?: string
}

export function PricingV1Controls({
  audience,
  onAudienceChange,
  cadence,
  onCadenceChange,
  className,
}: PricingV1ControlsProps) {
  const layoutIdPrefix = React.useId()

  return (
    <LayoutGroup id={layoutIdPrefix}>
      <div
        className={cn(
          "mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:mt-10",
          className
        )}
      >
        {/* Audience Selector: Individual vs. Team */}
        <div
          role="radiogroup"
          aria-label="Select audience"
          className="relative inline-flex items-center rounded-[14px] bg-muted p-1"
        >
          <button
            type="button"
            role="radio"
            aria-checked={audience === "individual"}
            onClick={() => onAudienceChange("individual")}
            className={cn(
              "relative rounded-[10px] px-3.5 py-1.5 font-sans text-xs transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              audience === "individual"
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {audience === "individual" && (
              <motion.div
                layoutId={`${layoutIdPrefix}-audience-slab`}
                initial={false}
                transition={SPRING.pill}
                className="absolute inset-0 rounded-[10px] bg-background dark:bg-secondary"
              />
            )}
            <span className="relative z-10">Individual</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={audience === "team"}
            onClick={() => onAudienceChange("team")}
            className={cn(
              "relative rounded-[10px] px-3.5 py-1.5 font-sans text-xs transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              audience === "team"
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {audience === "team" && (
              <motion.div
                layoutId={`${layoutIdPrefix}-audience-slab`}
                initial={false}
                transition={SPRING.pill}
                className="absolute inset-0 rounded-[10px] bg-background dark:bg-secondary"
              />
            )}
            <span className="relative z-10">Team</span>
          </button>
        </div>

        {/* Cadence Selector: Monthly vs. Yearly (-20%) vs. Lifetime */}
        <div
          role="radiogroup"
          aria-label="Select billing cadence"
          className="relative inline-flex items-center rounded-[14px] bg-muted p-1"
        >
          <button
            type="button"
            role="radio"
            aria-checked={cadence === "monthly"}
            onClick={() => onCadenceChange("monthly")}
            className={cn(
              "relative rounded-[10px] px-3.5 py-1.5 font-sans text-xs transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              cadence === "monthly"
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cadence === "monthly" && (
              <motion.div
                layoutId={`${layoutIdPrefix}-cadence-slab`}
                initial={false}
                transition={SPRING.pill}
                className="absolute inset-0 rounded-[10px] bg-background dark:bg-secondary"
              />
            )}
            <span className="relative z-10">Monthly</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={cadence === "annual"}
            onClick={() => onCadenceChange("annual")}
            className={cn(
              "relative rounded-[10px] px-3.5 py-1.5 font-sans text-xs transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              cadence === "annual"
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cadence === "annual" && (
              <motion.div
                layoutId={`${layoutIdPrefix}-cadence-slab`}
                initial={false}
                transition={SPRING.pill}
                className="absolute inset-0 rounded-[10px] bg-background dark:bg-secondary"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Yearly</span>
              <span className="py-0.2 rounded-[6px] bg-secondary px-1.5 font-sans text-[10px] font-semibold text-primary">
                -20%
              </span>
            </span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={cadence === "lifetime"}
            onClick={() => onCadenceChange("lifetime")}
            className={cn(
              "relative rounded-[10px] px-3.5 py-1.5 font-sans text-xs transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              cadence === "lifetime"
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cadence === "lifetime" && (
              <motion.div
                layoutId={`${layoutIdPrefix}-cadence-slab`}
                initial={false}
                transition={SPRING.pill}
                className="absolute inset-0 rounded-[10px] bg-background dark:bg-secondary"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Lifetime</span>
              <span className="py-0.2 rounded-[6px] bg-secondary px-1.5 font-sans text-[10px] font-semibold text-primary">
                Best Value
              </span>
            </span>
          </button>
        </div>
      </div>
    </LayoutGroup>
  )
}

/**
 * ============================================================================
 * PRICING V1 CARD GRID
 * ============================================================================
 */
export interface PricingV1CardGridProps extends React.ComponentProps<"div"> {
  columns?: 2 | 3
  className?: string
  children?: React.ReactNode
}

export function PricingV1CardGrid({
  columns = 3,
  className,
  children,
  ...props
}: PricingV1CardGridProps) {
  return (
    <NumberFlowGroup>
      <div
        className={cn(
          "mt-8 grid w-full gap-4 sm:mt-10 sm:gap-6 lg:mt-14",
          columns === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
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
 * PRICING V1 CARD: Dual-Surface Squircle Architecture + Overgrown Cradle
 * ============================================================================
 */
export interface PricingV1CardProps extends React.ComponentProps<"article"> {
  tier: PricingTier
  price: number
  audience: Audience
  cadence: Cadence
  direction?: number
  className?: string
}

export function PricingV1Card({
  tier,
  price,
  audience,
  cadence,
  direction = 1,
  className,
  ...props
}: PricingV1CardProps) {
  const isHero = Boolean(tier.isHero)
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
      <div className="rounded-[18px] bg-background px-5 py-4 transition-all sm:px-6 sm:py-4.5 dark:bg-secondary">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {tier.name}
          </h3>
        </div>

        <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
          {tier.tagline}
        </p>
      </div>

      {/* Lower Body Deck */}
      <div className="flex flex-1 flex-col justify-between px-5 pt-7 pb-7 sm:px-6 sm:pt-8 sm:pb-8">
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
            {tier.featuresHeader ?? "PLAN INCLUDES:"}
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
        "relative flex flex-col lg:-mx-[2px] lg:-mt-[30px] lg:-mb-[2px]",
        className
      )}
    >
      {/* Overgrown Primary Cradle (Box-Inside-Box Architecture) */}
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

        {/* Inner Card (Identical in size, structure and alignment to sibling cards) */}
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
 * PRICING V1 ENTERPRISE SLAB
 * ============================================================================
 */
export interface PricingV1EnterpriseProps extends React.ComponentProps<"div"> {
  enterpriseInfo: EnterpriseInfo
  className?: string
}

export function PricingV1Enterprise({
  enterpriseInfo,
  className,
  ...props
}: PricingV1EnterpriseProps) {
  return (
    <div
      className={cn(
        "mt-10 w-full rounded-[24px] bg-muted p-1.5 transition-colors sm:mt-14 sm:p-1.5",
        className
      )}
      {...props}
    >
      <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12 lg:gap-6">
        {/* Left Column: Floating Squircle Box */}
        <div className="flex h-full flex-col justify-between rounded-[18px] bg-background p-6 sm:p-7 lg:col-span-5 dark:bg-secondary">
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {enterpriseInfo.name}
            </h3>
            <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
              {enterpriseInfo.tagline}
            </p>
          </div>
          <div className="mt-6">
            <Link
              href={enterpriseInfo.cta.href}
              className="inline-flex h-9.5 w-fit items-center justify-center rounded-[12px] bg-foreground px-5 font-sans text-xs font-medium text-background transition-colors hover:bg-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none sm:text-sm"
            >
              {enterpriseInfo.cta.text}
            </Link>
          </div>
        </div>

        {/* Right Column: Multi-Column Specs */}
        <div className="p-5 sm:p-7 lg:col-span-7">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {enterpriseInfo.features.map(parseFeature).map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 font-sans text-xs leading-normal sm:text-[13px]"
              >
                <FeatureIcon
                  name={feat.icon}
                  className="mt-0.5 text-muted-foreground"
                />
                <FormattedFeatureText text={feat.text} isHero={false} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * ============================================================================
 * PRICING V1 FAQ ACCORDION
 * ============================================================================
 */
export interface PricingV1FaqProps extends React.ComponentProps<"div"> {
  items?: readonly { question: string; answer: string }[]
  className?: string
}

export function PricingV1Faq({
  items = PRICING_FAQS,
  className,
  ...props
}: PricingV1FaqProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  return (
    <div className={cn("mt-10 w-full sm:mt-14", className)} {...props}>
      <div className="text-center">
        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          Frequently asked questions
        </h3>
        <p className="mt-1 font-sans text-xs text-muted-foreground sm:text-sm">
          Everything you need to know about licensing, updates, and commercial
          usage.
        </p>
      </div>

      <div className="mt-6 space-y-2.5">
        {items.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={idx}
              className="overflow-hidden rounded-[16px] bg-muted transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 p-4.5 text-left font-sans text-xs font-medium text-foreground transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none sm:px-6 sm:py-4.5 sm:text-sm"
              >
                <span>{faq.question}</span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180 text-foreground"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={SPRING.snappy}
                  >
                    <div className="px-4.5 pt-1.5 pb-5 font-sans text-xs leading-relaxed text-muted-foreground sm:px-6 sm:pb-5.5">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * ============================================================================
 * PRICING VARIANT 1 PRESET
 * ============================================================================
 */
export interface PricingVariant1Props extends React.ComponentProps<"section"> {
  className?: string
  heading?: string
  description?: string
  showSuiteAccess?: boolean
  toolPlan?: PricingTier
  suitePlan?: PricingTier
  toolTeamPlan?: PricingTier
  enterpriseInfo?: EnterpriseInfo
  showEnterprise?: boolean
  showFaq?: boolean
  tiers?: PricingTier[]
}

export function PricingVariant1({
  className,
  heading = "Simple, transparent pricing.",
  description = "Deploy standalone or get lifetime access to the complete suite.",
  showSuiteAccess = true,
  toolPlan = DEFAULT_CURRENT_TOOL_TIER,
  suitePlan = DEFAULT_SUITE_ACCESS_TIER,
  toolTeamPlan = DEFAULT_TOOL_TEAM_TIER,
  enterpriseInfo = DEFAULT_ENTERPRISE_INFO,
  showEnterprise = true,
  showFaq = true,
  tiers,
  ...props
}: PricingVariant1Props) {
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

  const activeTiers = React.useMemo(() => {
    if (tiers && tiers.length > 0) return tiers
    if (showSuiteAccess) {
      return [toolPlan, suitePlan, toolTeamPlan]
    }
    return [toolPlan, toolTeamPlan]
  }, [tiers, showSuiteAccess, toolPlan, suitePlan, toolTeamPlan])

  const getPrice = (tier: PricingTier) => {
    const priceMap = tier.prices[audience]
    return priceMap[cadence] ?? priceMap.lifetime ?? 0
  }

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className={cn(
        "relative mx-auto flex w-full flex-col items-center px-4 select-none sm:px-6",
        activeTiers.length > 2 ? "max-w-6xl" : "max-w-5xl",
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

      {/* 3. Cards Grid */}
      <PricingV1CardGrid columns={activeTiers.length === 2 ? 2 : 3}>
        {activeTiers.map((tier) => (
          <PricingV1Card
            key={tier.id}
            tier={tier}
            price={getPrice(tier)}
            audience={audience}
            cadence={cadence}
            direction={direction}
          />
        ))}
      </PricingV1CardGrid>

      {/* 4. Enterprise Slab */}
      {showEnterprise && enterpriseInfo && (
        <PricingV1Enterprise enterpriseInfo={enterpriseInfo} />
      )}

      {/* 5. Pre-purchase FAQ */}
      {showFaq && <PricingV1Faq />}
    </section>
  )
}
