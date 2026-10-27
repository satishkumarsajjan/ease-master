"use client"

import * as React from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Cadence, Audience } from "@/lib/pricing"

/**
 * ============================================================================
 * PRICING CONTEXT & PROVIDER
 * ============================================================================
 */
export interface PricingContextValue {
  cadence: Cadence
  setCadence: (cadence: Cadence) => void
  audience: Audience
  setAudience: (audience: Audience) => void
  seats: number
  setSeats: (seats: number) => void
}

const PricingContext = React.createContext<PricingContextValue | null>(null)

export function usePricing() {
  const context = React.useContext(PricingContext)
  return context
}

export interface PricingProviderProps {
  defaultCadence?: Cadence
  defaultAudience?: Audience
  defaultSeats?: number
  children?: React.ReactNode
}

export function PricingProvider({
  defaultCadence = "lifetime",
  defaultAudience = "individual",
  defaultSeats = 5,
  children,
}: PricingProviderProps) {
  const [cadence, setCadence] = React.useState<Cadence>(defaultCadence)
  const [audience, setAudience] = React.useState<Audience>(defaultAudience)
  const [seats, setSeats] = React.useState<number>(defaultSeats)

  const value = React.useMemo(
    () => ({
      cadence,
      setCadence,
      audience,
      setAudience,
      seats,
      setSeats,
    }),
    [cadence, audience, seats]
  )

  return (
    <PricingContext.Provider value={value}>{children}</PricingContext.Provider>
  )
}

/**
 * ============================================================================
 * PRICING ROOT CONTAINER
 * ============================================================================
 */
export interface PricingProps extends React.ComponentProps<"section"> {
  className?: string
  children?: React.ReactNode
}

export function Pricing({ className, children, ...props }: PricingProps) {
  return (
    <section
      id="pricing"
      aria-label="Pricing and licensing"
      className={cn(
        "relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 select-none sm:px-6",
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
 * PRICING HEADER
 * ============================================================================
 */
export interface PricingHeaderProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function PricingHeader({
  className,
  children,
  ...props
}: PricingHeaderProps) {
  return (
    <div
      className={cn("mx-auto mb-10 max-w-xl text-center sm:mb-12", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ============================================================================
 * PRICING EYEBROW
 * ============================================================================
 */
export interface PricingEyebrowProps extends React.ComponentProps<"p"> {
  className?: string
  children?: React.ReactNode
}

export function PricingEyebrow({
  className,
  children,
  ...props
}: PricingEyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase sm:text-xs",
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
 * PRICING TITLE
 * ============================================================================
 */
export interface PricingTitleProps extends React.ComponentProps<"h2"> {
  className?: string
  children?: React.ReactNode
}

export function PricingTitle({
  className,
  children,
  ...props
}: PricingTitleProps) {
  return (
    <h2
      className={cn(
        "text-center font-heading text-xl font-medium tracking-tight text-foreground sm:text-2xl",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

/**
 * ============================================================================
 * PRICING DESCRIPTION
 * ============================================================================
 */
export interface PricingDescriptionProps extends React.ComponentProps<"p"> {
  className?: string
  children?: React.ReactNode
}

export function PricingDescription({
  className,
  children,
  ...props
}: PricingDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-2 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm",
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
 * PRICING CADENCE TOGGLE
 * ============================================================================
 */
export interface PricingCadenceToggleProps {
  value?: Cadence
  onValueChange?: (value: Cadence) => void
  showLifetime?: boolean
  className?: string
}

export function PricingCadenceToggle({
  value: controlledValue,
  onValueChange: controlledOnChange,
  showLifetime = true,
  className,
}: PricingCadenceToggleProps) {
  const context = usePricing()
  const value = controlledValue ?? context?.cadence ?? "lifetime"
  const onValueChange = controlledOnChange ?? context?.setCadence ?? (() => {})

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-muted p-1",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onValueChange("monthly")}
        className={cn(
          "rounded-full px-3.5 py-1.5 font-sans text-xs font-medium transition-colors select-none focus-visible:outline-none sm:text-sm",
          value === "monthly"
            ? "bg-background text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Monthly
      </button>

      <button
        type="button"
        onClick={() => onValueChange("annual")}
        className={cn(
          "rounded-full px-3.5 py-1.5 font-sans text-xs font-medium transition-colors select-none focus-visible:outline-none sm:text-sm",
          value === "annual"
            ? "bg-background text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Annual{" "}
        <span className="ml-1 text-[11px] font-semibold text-primary">
          Save 20%
        </span>
      </button>

      {showLifetime && (
        <button
          type="button"
          onClick={() => onValueChange("lifetime")}
          className={cn(
            "rounded-full px-3.5 py-1.5 font-sans text-xs font-medium transition-colors select-none focus-visible:outline-none sm:text-sm",
            value === "lifetime"
              ? "bg-background text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Lifetime
        </button>
      )}
    </div>
  )
}

/**
 * ============================================================================
 * PRICING AUDIENCE TOGGLE
 * ============================================================================
 */
export interface PricingAudienceToggleProps {
  value?: Audience
  onValueChange?: (value: Audience) => void
  className?: string
}

export function PricingAudienceToggle({
  value: controlledValue,
  onValueChange: controlledOnChange,
  className,
}: PricingAudienceToggleProps) {
  const context = usePricing()
  const value = controlledValue ?? context?.audience ?? "individual"
  const onValueChange = controlledOnChange ?? context?.setAudience ?? (() => {})

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-muted p-1",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onValueChange("individual")}
        className={cn(
          "rounded-full px-4 py-1.5 font-sans text-xs font-medium transition-colors select-none focus-visible:outline-none sm:text-sm",
          value === "individual"
            ? "bg-background text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Individual
      </button>

      <button
        type="button"
        onClick={() => onValueChange("team")}
        className={cn(
          "rounded-full px-4 py-1.5 font-sans text-xs font-medium transition-colors select-none focus-visible:outline-none sm:text-sm",
          value === "team"
            ? "bg-background text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Team
      </button>
    </div>
  )
}

/**
 * ============================================================================
 * PRICING GRID: Responsive Card Layout
 * ============================================================================
 */
export interface PricingGridProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function PricingGrid({
  className,
  children,
  ...props
}: PricingGridProps) {
  return (
    <div
      className={cn(
        "mt-8 grid w-full grid-cols-1 items-stretch gap-6 sm:mt-10 md:grid-cols-2 lg:grid-cols-3",
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
 * PRICING CARD: Physical Tier Container
 * ============================================================================
 */
export interface PricingCardProps extends React.ComponentProps<"div"> {
  isHero?: boolean
  className?: string
  children?: React.ReactNode
}

export function PricingCard({
  isHero = false,
  className,
  children,
  ...props
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-[20px] p-6 transition-all duration-300 sm:rounded-[24px] sm:p-7 md:p-8",
        isHero ? "bg-secondary" : "bg-muted hover:bg-secondary",
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
 * PRICING CARD HEADER
 * ============================================================================
 */
export interface PricingCardHeaderProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  title?: React.ReactNode
  tagline?: React.ReactNode
  index?: string
  badge?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function PricingCardHeader({
  title,
  tagline,
  index,
  badge,
  className,
  children,
  ...props
}: PricingCardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {children ?? (
        <>
          <div className="flex items-center justify-between">
            {index && (
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                {index}
              </span>
            )}
            {badge && (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-primary uppercase">
                {badge}
              </span>
            )}
          </div>

          {title && (
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {title}
            </h3>
          )}

          {tagline && (
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {tagline}
            </p>
          )}
        </>
      )}
    </div>
  )
}

/**
 * ============================================================================
 * PRICING CARD PRICE
 * ============================================================================
 */
export interface PricingCardPriceProps extends React.ComponentProps<"div"> {
  amount?: number | string
  currency?: string
  frequency?: string
  footnote?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function PricingCardPrice({
  amount,
  currency = "$",
  frequency = "/mo",
  footnote,
  className,
  children,
  ...props
}: PricingCardPriceProps) {
  return (
    <div className={cn("my-6 flex flex-col gap-1", className)} {...props}>
      {children ?? (
        <>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {currency}
            </span>
            <span className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {amount}
            </span>
            {frequency && (
              <span className="font-mono text-xs text-muted-foreground">
                {frequency}
              </span>
            )}
          </div>
          {footnote && (
            <span className="font-sans text-[11px] text-muted-foreground">
              {footnote}
            </span>
          )}
        </>
      )}
    </div>
  )
}

/**
 * ============================================================================
 * PRICING CARD FEATURES
 * ============================================================================
 */
export interface PricingCardFeaturesProps extends React.ComponentProps<"ul"> {
  className?: string
  children?: React.ReactNode
}

export function PricingCardFeatures({
  className,
  children,
  ...props
}: PricingCardFeaturesProps) {
  return (
    <ul
      className={cn("flex flex-1 flex-col gap-2.5 py-4", className)}
      {...props}
    >
      {children}
    </ul>
  )
}

/**
 * ============================================================================
 * PRICING CARD FEATURE
 * ============================================================================
 */
export interface PricingCardFeatureProps extends React.ComponentProps<"li"> {
  icon?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function PricingCardFeature({
  icon,
  className,
  children,
  ...props
}: PricingCardFeatureProps) {
  return (
    <li
      className={cn(
        "flex items-start gap-2.5 font-sans text-xs text-foreground sm:text-sm",
        className
      )}
      {...props}
    >
      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
        {icon ?? <Check className="h-2.5 w-2.5 stroke-[2.5]" />}
      </div>
      <span className="leading-snug">{children}</span>
    </li>
  )
}

/**
 * ============================================================================
 * PRICING CARD ACTION
 * ============================================================================
 */
export interface PricingCardActionProps extends React.ComponentProps<"div"> {
  href?: string
  isHero?: boolean
  className?: string
  children?: React.ReactNode
}

export function PricingCardAction({
  href,
  isHero = false,
  className,
  children,
  ...props
}: PricingCardActionProps) {
  const buttonClasses = cn(
    "inline-flex h-10 w-full items-center justify-center rounded-[12px] px-5 font-sans text-xs font-medium transition-all focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98] sm:text-sm",
    isHero
      ? "bg-primary text-primary-foreground hover:bg-primary"
      : "bg-muted text-foreground hover:bg-secondary",
    className
  )

  if (href) {
    return (
      <div className="mt-6 pt-2" {...props}>
        <Link href={href} className={buttonClasses}>
          {children ?? "Get Started"}
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-6 pt-2" {...props}>
      <button type="button" className={buttonClasses}>
        {children ?? "Get Started"}
      </button>
    </div>
  )
}

/**
 * ============================================================================
 * PRICING ENTERPRISE SLAB
 * ============================================================================
 */
export interface PricingEnterpriseProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function PricingEnterprise({
  className,
  children,
  ...props
}: PricingEnterpriseProps) {
  return (
    <div
      className={cn(
        "mt-10 w-full rounded-[24px] bg-muted p-1.5 transition-colors sm:mt-14 sm:p-1.5",
        className
      )}
      {...props}
    >
      <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12 lg:gap-6">
        {children}
      </div>
    </div>
  )
}

export interface PricingEnterpriseCardProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function PricingEnterpriseCard({
  className,
  children,
  ...props
}: PricingEnterpriseCardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between rounded-[18px] bg-background p-6 sm:p-7 lg:col-span-5 dark:bg-secondary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface PricingEnterpriseFeaturesProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function PricingEnterpriseFeatures({
  className,
  children,
  ...props
}: PricingEnterpriseFeaturesProps) {
  return (
    <div className={cn("p-5 sm:p-7 lg:col-span-7", className)} {...props}>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
        {children}
      </ul>
    </div>
  )
}

export interface PricingEnterpriseFeatureProps extends React.ComponentProps<"li"> {
  icon?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function PricingEnterpriseFeature({
  icon,
  className,
  children,
  ...props
}: PricingEnterpriseFeatureProps) {
  return (
    <li
      className={cn(
        "flex items-start gap-3 font-sans text-xs leading-normal sm:text-[13px]",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>
      )}
      <div>{children}</div>
    </li>
  )
}

/**
 * ============================================================================
 * PRICING FAQ SECTION
 * ============================================================================
 */
export interface PricingFaqProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function PricingFaq({ className, children, ...props }: PricingFaqProps) {
  return (
    <div className={cn("mt-12 w-full sm:mt-16", className)} {...props}>
      {children}
    </div>
  )
}

export interface PricingFaqHeaderProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function PricingFaqHeader({
  className,
  children,
  ...props
}: PricingFaqHeaderProps) {
  return (
    <div className={cn("text-center", className)} {...props}>
      {children}
    </div>
  )
}

export interface PricingFaqTitleProps extends React.ComponentProps<"h3"> {
  className?: string
  children?: React.ReactNode
}

export function PricingFaqTitle({
  className,
  children,
  ...props
}: PricingFaqTitleProps) {
  return (
    <h3
      className={cn(
        "font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export interface PricingFaqDescriptionProps extends React.ComponentProps<"p"> {
  className?: string
  children?: React.ReactNode
}

export function PricingFaqDescription({
  className,
  children,
  ...props
}: PricingFaqDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-1 font-sans text-xs text-muted-foreground sm:text-sm",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export interface PricingFaqListProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function PricingFaqList({
  className,
  children,
  ...props
}: PricingFaqListProps) {
  return (
    <div className={cn("mt-6 space-y-3", className)} {...props}>
      {children}
    </div>
  )
}

export interface PricingFaqItemProps extends React.ComponentProps<"div"> {
  open?: boolean
  onToggle?: () => void
  question: string
  answer: React.ReactNode
  className?: string
}

export function PricingFaqItem({
  open: controlledOpen,
  onToggle,
  question,
  answer,
  className,
  ...props
}: PricingFaqItemProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const toggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalOpen(!internalOpen)
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[16px] bg-muted transition-colors",
        className
      )}
      {...props}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-4.5 text-left font-sans text-xs font-medium text-foreground transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none sm:px-6 sm:py-4.5 sm:text-sm"
      >
        <span>{question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180 text-foreground"
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4.5 pt-1.5 pb-5 font-sans text-xs leading-relaxed text-muted-foreground sm:px-6 sm:pb-5.5">
          {answer}
        </div>
      )}
    </div>
  )
}
