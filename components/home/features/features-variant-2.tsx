"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { DEFAULT_TABS, type TabItem } from "./features-variant-1"
import {
  Features,
  FeaturesHeader,
  FeaturesHeading,
  FeaturesDescription,
  type FeaturesProps,
} from "./features"

export interface FeatureAccordionContextValue {
  activeItem: string
  setActiveItem: (id: string) => void
}

const FeatureAccordionContext =
  React.createContext<FeatureAccordionContextValue | null>(null)

export function useFeatureAccordion() {
  const context = React.useContext(FeatureAccordionContext)
  if (!context) {
    throw new Error(
      "FeatureAccordion subcomponents must be used within <FeatureAccordion>."
    )
  }
  return context
}

/**
 * ============================================================================
 * FEATURE ACCORDION: Root Kinetic Chassis
 * ============================================================================
 */
export interface FeatureAccordionProps extends React.ComponentProps<"div"> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children?: React.ReactNode
}

export function FeatureAccordion({
  defaultValue = "workstation",
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: FeatureAccordionProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const activeItem = controlledValue ?? uncontrolledValue

  const setActiveItem = React.useCallback(
    (newVal: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(newVal)
      }
      onValueChange?.(newVal)
    },
    [controlledValue, onValueChange]
  )

  const contextValue = React.useMemo<FeatureAccordionContextValue>(
    () => ({
      activeItem,
      setActiveItem,
    }),
    [activeItem, setActiveItem]
  )

  return (
    <FeatureAccordionContext.Provider value={contextValue}>
      <div
        className={cn(
          "relative mt-8 flex w-full flex-col gap-1 overflow-hidden rounded-[20px] bg-muted p-1 sm:mt-10 sm:gap-1.5 sm:rounded-[24px] sm:p-1.5 md:h-[420px] md:flex-row",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </FeatureAccordionContext.Provider>
  )
}

/**
 * ============================================================================
 * FEATURE ACCORDION ITEM: Kinetic Flex Expanding Column
 * ============================================================================
 */
export interface FeatureAccordionItemProps extends React.ComponentProps<"div"> {
  value: string
  label?: string
  shortLabel?: string
  index?: string
  className?: string
  children?: React.ReactNode
}

export function FeatureAccordionItem({
  value,
  label,
  shortLabel,
  index,
  className,
  children,
  ...props
}: FeatureAccordionItemProps) {
  const { activeItem, setActiveItem } = useFeatureAccordion()
  const isActive = activeItem === value

  return (
    <div
      onClick={() => setActiveItem(value)}
      role="tab"
      id={`accordion-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`accordion-panel-${value}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setActiveItem(value)
        }
      }}
      style={{
        transition:
          "flex 0.45s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease",
      }}
      className={cn(
        "group relative flex cursor-pointer overflow-hidden rounded-[16px] transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none sm:rounded-[18px]",
        isActive
          ? "cursor-default flex-col bg-background md:flex-[5.5]"
          : "flex-col bg-card hover:bg-accent md:flex-[1]",
        className
      )}
      {...props}
    >
      {/* DESKTOP COLLAPSED SPINE: Vertical Ribbon (md: and above) */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 hidden h-full w-full flex-col items-center justify-between py-6 transition-opacity duration-300 md:flex",
          isActive ? "opacity-0" : "opacity-100"
        )}
        aria-hidden={isActive}
      >
        {index && (
          <span className="font-mono text-xs font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
            {index}
          </span>
        )}

        {label && (
          <div className="flex flex-1 items-center justify-center py-6">
            <span
              className="font-sans text-xs font-medium tracking-widest whitespace-nowrap text-muted-foreground uppercase transition-colors select-none group-hover:text-foreground"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {label}
            </span>
          </div>
        )}

        {shortLabel && (
          <span className="max-w-[64px] truncate text-center font-mono text-[10px] text-muted-foreground transition-colors group-hover:text-foreground">
            {shortLabel}
          </span>
        )}
      </div>

      {/* MOBILE COLLAPSED HEADER STRIP (< md) */}
      <div
        className={cn(
          "flex items-center justify-between px-3.5 py-3 transition-colors md:hidden",
          isActive ? "bg-background" : "hover:bg-accent"
        )}
      >
        <div className="flex items-center gap-3">
          {index && (
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {index}
            </span>
          )}
          {label && (
            <span
              className={cn(
                "font-sans text-xs tracking-wider uppercase transition-colors",
                isActive
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          )}
        </div>
        <span
          className={cn(
            "font-mono text-xs text-muted-foreground transition-transform duration-300 select-none",
            isActive
              ? "rotate-90 text-foreground"
              : "rotate-0 text-muted-foreground"
          )}
          aria-hidden="true"
        >
          →
        </span>
      </div>

      {/* MOBILE EXPANDED ACCORDION BODY (< md) */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden",
          isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-3.5 pt-1 pb-5 sm:px-7 sm:pb-7">{children}</div>
        </div>
      </div>

      {/* DESKTOP EXPANDED BODY (md: and above) */}
      <div
        className={cn(
          "hidden h-full w-full flex-col justify-between overflow-hidden p-6 transition-opacity duration-300 sm:p-7 md:flex md:p-8",
          isActive ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!isActive}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * ============================================================================
 * FEATURE ACCORDION CONTENT: Standard 2-Column Accordion Details
 * ============================================================================
 */
export interface FeatureAccordionContentProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  index?: string
  title?: React.ReactNode
  summary?: React.ReactNode
  href?: string
  linkText?: React.ReactNode
  specs?: { property: string; value: string }[]
  className?: string
  children?: React.ReactNode
}

export function FeatureAccordionContent({
  index,
  title,
  summary,
  href,
  linkText,
  specs,
  className,
  children,
  ...props
}: FeatureAccordionContentProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 items-start gap-6 md:grid-cols-12 md:gap-8",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {/* Left Column: Narrative */}
          <div className="flex flex-col justify-between md:col-span-6">
            <div>
              {index && (
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  {index}
                </span>
              )}
              {title && (
                <h3 className="mt-1.5 font-heading text-lg font-medium tracking-tight text-foreground sm:text-xl">
                  {title}
                </h3>
              )}
              {summary && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {summary}
                </p>
              )}
            </div>

            {href && linkText && (
              <div className="mt-6 pt-1">
                <Link
                  href={href}
                  className="inline-flex items-center gap-1 rounded-xs font-mono text-xs font-medium text-primary transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {linkText}
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Spec Sheet */}
          {specs && specs.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-4 md:col-span-6 md:pt-0 md:pl-8 lg:pl-10">
              {specs.map((spec) => (
                <div
                  key={spec.property}
                  className="flex items-baseline justify-between gap-4 py-1.5 font-mono text-xs"
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
        </>
      )}
    </div>
  )
}

/**
 * ============================================================================
 * FEATURES VARIANT 2: Preset Wrapper
 * ============================================================================
 */
export interface FeaturesVariant2Props extends FeaturesProps {
  heading?: React.ReactNode
  description?: React.ReactNode
  tabs?: TabItem[]
}

export function FeaturesVariant2({
  className,
  heading = "Built for scale. Refined for speed.",
  description = "Everything you need to craft high-velocity web applications with docs that stay in sync.",
  tabs = DEFAULT_TABS,
  children,
  ...props
}: FeaturesVariant2Props) {
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

          <FeatureAccordion defaultValue={tabs[0]?.id}>
            {tabs.map((tab) => (
              <FeatureAccordionItem
                key={tab.id}
                value={tab.id}
                label={tab.label}
                shortLabel={tab.shortLabel}
                index={tab.index}
              >
                <FeatureAccordionContent
                  index={tab.index}
                  title={tab.title}
                  summary={tab.summary}
                  href={tab.href}
                  linkText={tab.linkText}
                  specs={tab.specs}
                />
              </FeatureAccordionItem>
            ))}
          </FeatureAccordion>
        </>
      )}
    </Features>
  )
}
