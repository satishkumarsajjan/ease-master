"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"
import { ROUTES } from "@/lib/routes"
import {
  Features,
  FeaturesHeader,
  FeaturesHeading,
  FeaturesDescription,
  type FeaturesProps,
} from "./features"

export type TabKey =
  "workstation" | "docs" | "primitives" | "architecture" | string

export interface TabItem {
  id: TabKey
  label: string
  shortLabel?: string
  index: string
  title: string
  summary: string
  href: string
  linkText: string
  specs: { property: string; value: string }[]
}

export const DEFAULT_TABS: TabItem[] = [
  {
    id: "workstation",
    label: "Workstation",
    shortLabel: "App",
    index: "01",
    title: "The application canvas.",
    summary:
      "A focused workspace designed for building tools, SaaS products, and canvas utilities. Includes a collapsible spatial navigation rail, reactive layout stores, and persistent workspace state.",
    href: ROUTES.app,
    linkText: "Open /app →",
    specs: [
      { property: "Route", value: "/app" },
      { property: "Shell", value: "components/layout/app-shell.tsx" },
      { property: "State", value: "Zustand with localStorage hydration" },
      { property: "Command Menu", value: "Pre-indexed ⌘K palette" },
    ],
  },
  {
    id: "docs",
    label: "Documentation",
    shortLabel: "Docs",
    index: "02",
    title: "Dual-layout docs engine.",
    summary:
      "Built on Fumadocs MDX with two interchangeable reading modes: a distraction-free Spatial reading view and a dense Three-Pane layout with liquid scroll-spy navigation.",
    href: ROUTES.docs,
    linkText: "Explore /docs →",
    specs: [
      { property: "Route", value: "/docs" },
      { property: "Engine", value: "Fumadocs MDX with Shiki" },
      { property: "Layouts", value: "Spatial & Three-Pane modes" },
      { property: "TOC", value: "Liquid scroll-spy with spring lag" },
    ],
  },
  {
    id: "primitives",
    label: "Primitives",
    shortLabel: "Kit",
    index: "03",
    title: "Token-driven component kit.",
    summary:
      "Every primitive is built strictly from OKLCH design tokens with zero raw hex colors. Motion is governed by named spring constants with real physical mass, damping, and rest deltas.",
    href: ROUTES.docsComponents,
    linkText: "Browse /docs/components →",
    specs: [
      { property: "Tokens", value: "OKLCH with C=0 neutral grays" },
      { property: "Motion", value: "Named springs via lib/motion.ts" },
      { property: "Distribution", value: "shadcn CLI registry payloads" },
      { property: "Dependencies", value: "Zero bloat, zero runtime styling" },
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    shortLabel: "Core",
    index: "04",
    title: "The zero-key guarantee.",
    summary:
      "A fresh clone boots, builds, and passes all tests with an empty .env.local. All routes are strictly typed in lib/routes.ts, and automated doctor checks verify repo integrity on every commit.",
    href: ROUTES.docsStructure,
    linkText: "Read /docs/project-structure →",
    specs: [
      { property: "Environment", value: "0 required keys to boot" },
      { property: "Routes", value: "100% typed in lib/routes.ts" },
      { property: "Verification", value: "pnpm verify & pnpm doctor" },
      { property: "Standards", value: "No any, no uncommitted config" },
    ],
  },
]

export interface FolderTabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
  tabIds: string[]
  registerTab: (id: string) => void
}

const FolderTabsContext = React.createContext<FolderTabsContextValue | null>(
  null
)

export function useFolderTabs() {
  const context = React.useContext(FolderTabsContext)
  if (!context) {
    throw new Error(
      "FolderTabs subcomponents must be used within <FolderTabs>."
    )
  }
  return context
}

/**
 * ============================================================================
 * FOLDER TABS: Root Chassis for Tactile Folder System
 * ============================================================================
 */
export interface FolderTabsProps extends React.ComponentProps<"div"> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children?: React.ReactNode
}

export function FolderTabs({
  defaultValue = "workstation",
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: FolderTabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [tabIds, setTabIds] = React.useState<string[]>([])

  const activeTab = controlledValue ?? uncontrolledValue

  const setActiveTab = React.useCallback(
    (newVal: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(newVal)
      }
      onValueChange?.(newVal)
    },
    [controlledValue, onValueChange]
  )

  const registerTab = React.useCallback((id: string) => {
    setTabIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const contextValue = React.useMemo<FolderTabsContextValue>(
    () => ({
      activeTab,
      setActiveTab,
      tabIds,
      registerTab,
    }),
    [activeTab, setActiveTab, tabIds, registerTab]
  )

  return (
    <FolderTabsContext.Provider value={contextValue}>
      <div
        className={cn(
          "relative mt-8 w-full overflow-hidden rounded-[20px] bg-muted p-1 sm:mt-10 sm:rounded-[24px] sm:p-1.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </FolderTabsContext.Provider>
  )
}

/**
 * ============================================================================
 * FOLDER TAB LIST: Tab Navigation Bar
 * ============================================================================
 */
export interface FolderTabListProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function FolderTabList({
  className,
  children,
  ...props
}: FolderTabListProps) {
  return (
    <div
      role="tablist"
      aria-label="Features navigation"
      className={cn("relative flex items-end px-2 pt-1 sm:px-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ============================================================================
 * FOLDER TAB: Physical Tab Ear with Continuous Inverse Fillets
 * ============================================================================
 */
export interface FolderTabProps extends React.ComponentProps<"button"> {
  value: string
  shortLabel?: string
  className?: string
  children?: React.ReactNode
}

export function FolderTab({
  value,
  shortLabel,
  className,
  children,
  ...props
}: FolderTabProps) {
  const { activeTab, setActiveTab, registerTab } = useFolderTabs()
  const isActive = activeTab === value

  React.useEffect(() => {
    registerTab(value)
  }, [value, registerTab])

  return (
    <button
      role="tab"
      id={`tab-${value}`}
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative px-3 py-1.5 font-sans text-xs transition-colors focus-visible:outline-none sm:px-5 sm:py-2 sm:text-sm",
        isActive
          ? "font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId="active-folder-tab-notch"
          transition={{
            duration: 0.45,
            ease: EASE.outExpo,
          }}
          className="absolute inset-0 -bottom-[1px] rounded-t-[14px] bg-background sm:rounded-t-[16px]"
        >
          {/* Left Concave Inverse Fillet */}
          <svg
            className="pointer-events-none absolute right-full bottom-0 h-2.5 w-2.5 sm:h-3 sm:w-3"
            viewBox="0 0 12 12"
            fill="none"
            style={{ fill: "var(--background)" }}
            aria-hidden="true"
          >
            <path d="M0 12 A 12 12 0 0 0 12 0 L 12 12 Z" />
          </svg>

          {/* Right Concave Inverse Fillet */}
          <svg
            className="pointer-events-none absolute bottom-0 left-full h-2.5 w-2.5 sm:h-3 sm:w-3"
            viewBox="0 0 12 12"
            fill="none"
            style={{ fill: "var(--background)" }}
            aria-hidden="true"
          >
            <path d="M12 12 A 12 12 0 0 1 0 0 L 0 12 Z" />
          </svg>
        </motion.div>
      )}

      <span className="relative z-10 whitespace-nowrap">
        {shortLabel && <span className="inline sm:hidden">{shortLabel}</span>}
        <span className={shortLabel ? "hidden sm:inline" : undefined}>
          {children}
        </span>
      </span>
    </button>
  )
}

/**
 * ============================================================================
 * FOLDER TAB PANELS: Sliding Motion Container
 * ============================================================================
 */
export interface FolderTabPanelsProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function FolderTabPanels({
  className,
  children,
  ...props
}: FolderTabPanelsProps) {
  const { activeTab, tabIds } = useFolderTabs()
  const activeIndex = Math.max(0, tabIds.indexOf(activeTab))

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-t-none rounded-b-[16px] bg-background sm:rounded-b-[18px]",
        className
      )}
      {...props}
    >
      <motion.div
        animate={{ x: `-${activeIndex * 100}%` }}
        transition={{
          duration: 0.45,
          ease: EASE.outExpo,
        }}
        className="flex w-full items-start"
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * ============================================================================
 * FOLDER TAB CONTENT: Single Feature Tab Panel
 * ============================================================================
 */
export interface FolderTabContentProps extends React.ComponentProps<"div"> {
  value: string
  className?: string
  children?: React.ReactNode
}

export function FolderTabContent({
  value,
  className,
  children,
  ...props
}: FolderTabContentProps) {
  const { activeTab, registerTab } = useFolderTabs()
  const isCurrent = activeTab === value

  React.useEffect(() => {
    registerTab(value)
  }, [value, registerTab])

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      aria-hidden={!isCurrent}
      tabIndex={isCurrent ? 0 : -1}
      className={cn(
        "grid w-full shrink-0 grid-cols-1 items-start gap-6 p-3.5 sm:gap-8 sm:p-7 md:grid-cols-12 md:gap-10 md:p-8",
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
 * FOLDER TAB NARRATIVE: Left Column (Index, Title, Summary, Action Link)
 * ============================================================================
 */
export interface FolderTabNarrativeProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  index?: string
  title?: React.ReactNode
  summary?: React.ReactNode
  href?: string
  linkText?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function FolderTabNarrative({
  index,
  title,
  summary,
  href,
  linkText,
  className,
  children,
  ...props
}: FolderTabNarrativeProps) {
  return (
    <div
      className={cn("flex flex-col justify-between md:col-span-6", className)}
      {...props}
    >
      {children ?? (
        <>
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
        </>
      )}
    </div>
  )
}

/**
 * ============================================================================
 * FOLDER TAB SPECS: Right Column Tabular Specifications Sheet
 * ============================================================================
 */
export interface FolderTabSpecsProps extends React.ComponentProps<"div"> {
  specs?: { property: string; value: string }[]
  className?: string
  children?: React.ReactNode
}

export function FolderTabSpecs({
  specs,
  className,
  children,
  ...props
}: FolderTabSpecsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 pt-4 md:col-span-6 md:pt-0 md:pl-8 lg:pl-10",
        className
      )}
      {...props}
    >
      {children ??
        specs?.map((spec) => (
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
  )
}

/**
 * ============================================================================
 * FEATURES VARIANT 1: Preset Wrapper
 * ============================================================================
 */
export interface FeaturesVariant1Props extends FeaturesProps {
  heading?: React.ReactNode
  description?: React.ReactNode
  tabs?: TabItem[]
}

export function FeaturesVariant1({
  className,
  heading = "Built for scale. Refined for speed.",
  description = "Everything you need to craft high-velocity web applications with docs that stay in sync.",
  tabs = DEFAULT_TABS,
  children,
  ...props
}: FeaturesVariant1Props) {
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

          <FolderTabs defaultValue={tabs[0]?.id}>
            <FolderTabList>
              {tabs.map((tab) => (
                <FolderTab
                  key={tab.id}
                  value={tab.id}
                  shortLabel={tab.shortLabel}
                >
                  {tab.label}
                </FolderTab>
              ))}
            </FolderTabList>

            <FolderTabPanels>
              {tabs.map((tab) => (
                <FolderTabContent key={tab.id} value={tab.id}>
                  <FolderTabNarrative
                    index={tab.index}
                    title={tab.title}
                    summary={tab.summary}
                    href={tab.href}
                    linkText={tab.linkText}
                  />
                  <FolderTabSpecs specs={tab.specs} />
                </FolderTabContent>
              ))}
            </FolderTabPanels>
          </FolderTabs>
        </>
      )}
    </Features>
  )
}
