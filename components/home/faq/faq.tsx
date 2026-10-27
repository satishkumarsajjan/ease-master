"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { SPRING } from "@/lib/motion"
import { cn } from "@/lib/utils"

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */

export type FaqCategory =
  "all" | "architecture" | "docs-registry" | "licensing" | "integrations"

export interface FaqItem {
  id: string
  category: "architecture" | "docs-registry" | "licensing" | "integrations"
  categoryLabel: string
  question: string
  answer: string
  codeSnippet?: string
}

export interface MinimalFaqItem {
  id: string
  question: string
  answer: string
}

export interface FaqCategoryTabItem {
  id: FaqCategory
  label: string
}

/* ==========================================================================
   CANONICAL DATASETS
   ========================================================================== */

export const FAQ_ITEMS: FaqItem[] = [
  // 1. ARCHITECTURE & TECH STACK
  {
    id: "zero-key-boot",
    category: "architecture",
    categoryLabel: "Architecture",
    question: "What exactly is the Zero-Key Boot Guarantee?",
    answer:
      "Satisium is strictly architected to boot, build, and pass all typechecks and unit tests with a completely empty `.env.local` file. You clone the repository, run `pnpm dev`, and the entire app canvas (`/app`), dual-layout Fumadocs documentation (`/docs`), and component registry render immediately without configuring external API keys, auth providers, or third-party database credentials.",
    codeSnippet: "git clone <repo> && pnpm install && pnpm dev",
  },
  {
    id: "oklch-tokens",
    category: "architecture",
    categoryLabel: "Architecture",
    question: "Why use 100% OKLCH color tokens instead of standard hex or RGB?",
    answer:
      "OKLCH is a mathematically perceptually uniform color space. Unlike sRGB or HSL, equal adjustments in lightness produce identical perceptual contrast across all hues. This completely eliminates washed-out, murky dark mode grays and guarantees that text and borders pass WCAG AAA contrast standards automatically across all themes.",
  },
  {
    id: "nextjs-app-router",
    category: "architecture",
    categoryLabel: "Architecture",
    question:
      "How is the Next.js App Router and React Server Component architecture organized?",
    answer:
      "Every route adheres to strict Server/Client boundary discipline. All heavy computations, metadata generation, and MDX processing run on the server. Interactive elements are isolated into lightweight client islands (`use client`) with memoized callbacks to prevent unnecessary re-renders. Every route link is strictly derived from a centralized route graph in `lib/routes.ts`.",
    codeSnippet: "import { ROUTES } from '@/lib/routes'",
  },

  // 2. DOCUMENTATION & COMPONENT REGISTRY
  {
    id: "dual-layout-fumadocs",
    category: "docs-registry",
    categoryLabel: "Docs & Registry",
    question:
      "How does the dual-layout Fumadocs MDX documentation engine work?",
    answer:
      "The documentation space ships with two production-grade layouts: `SpatialLayout` (Satisium's signature card-shift spatial shell) and `ThreePaneLayout` (a clean, borderless three-pane architecture featuring sidebar, article canvas, and dynamic table of contents). You select your preferred layout globally with a single configuration flag in `lib/config.ts`.",
  },
  {
    id: "shadcn-registry-cli",
    category: "docs-registry",
    categoryLabel: "Docs & Registry",
    question:
      "Can I distribute components via the `npx shadcn@latest add` CLI?",
    answer:
      "Yes. Satisium features an automated component registry pipeline. Place any component in `registry/ui/`, define its demo in `registry/demos/`, and run `pnpm build:registry:meta && pnpm registry:public`. It compiles native, consumable JSON registry manifests (`public/r/*.json`) that any developer can install into their own project with `pnpm dlx shadcn@latest add <url>`.",
    codeSnippet: "pnpm build:registry:meta && pnpm registry:public",
  },
  {
    id: "ai-llm-indexing",
    category: "docs-registry",
    categoryLabel: "Docs & Registry",
    question: "Is Satisium optimized for AI agents and LLM code generation?",
    answer:
      "Yes. Satisium includes pre-configured `llms.txt` and `llms-full.txt` discovery manifests, automated raw Markdown extractors, and LLM `<link rel='alternate'>` headers in `<head>`. AI tools like Antigravity, Cursor, and Claude can parse your entire component kit and documentation hierarchy with zero hallucination.",
  },

  // 3. LICENSING & COMMERCIAL RIGHTS
  {
    id: "commercial-rights",
    category: "licensing",
    categoryLabel: "Licensing",
    question:
      "Can I use Satisium to build commercial SaaS products and client apps?",
    answer:
      "Yes. All Satisium licenses grant full commercial rights to build and deploy unlimited commercial SaaS applications, internal enterprise platforms, and client deliverables. You keep 100% of your revenue with zero recurring royalties or attribution requirements.",
  },
  {
    id: "team-seat-reallocation",
    category: "licensing",
    categoryLabel: "Licensing",
    question: "How do Team Seat licenses work, and can seats be reallocated?",
    answer:
      "Team licenses cover the number of active developers contributing code to projects built on Satisium. If an engineer transitions off your project or leaves your organization, their seat can be immediately transferred to a new team member with zero administrative friction.",
  },

  // 4. INTEGRATIONS & EXTENSIBILITY
  {
    id: "database-auth-integration",
    category: "integrations",
    categoryLabel: "Integrations",
    question:
      "How do I connect databases (Supabase, Prisma) or authentication (Auth.js, Clerk)?",
    answer:
      "Because Satisium is intentionally unopinionated and free of hardcoded database or auth spaghetti, you can connect your preferred stack in under 10 minutes. Follow the step-by-step guides in `content/docs/` to drop in Supabase, Clerk, Auth.js, or Prisma without needing to rip out conflicting boilerplate code.",
  },
  {
    id: "doctor-checks-ci",
    category: "integrations",
    categoryLabel: "Integrations",
    question:
      "How do the automated doctor scripts and CI verification checks work?",
    answer:
      "Satisium includes a specialized diagnostic toolchain (`pnpm doctor` and `pnpm verify`). Before any code is committed, it runs automated health audits across environment variables, TypeScript strictness (enforcing zero `any` types), dead code elimination (`pnpm knip`), ESLint tokens, and Vitest test suites.",
    codeSnippet: "pnpm doctor && pnpm verify",
  },
]

export const ESSENTIAL_FAQS: MinimalFaqItem[] = [
  {
    id: "essential-difference",
    question: "What makes Satisium different from generic boilerplates?",
    answer:
      "The **Zero-Key Boot Guarantee** is our signature: clone the repo, run `pnpm dev`, and the entire app, documentation engine, and component registry render instantly without touching `.env.local`. There are zero pre-configured database dependencies or forced third-party lock-ins you have to rip out.",
  },
  {
    id: "essential-commercial",
    question: "Can I build and sell commercial SaaS products with this?",
    answer:
      "Yes, 100%. Every license grants full commercial rights to build and deploy unlimited commercial SaaS applications, client projects, and internal tools. You keep **100% of your revenue** with zero recurring royalties or attribution requirements.",
  },
  {
    id: "essential-docs",
    question: "How does the dual-layout Fumadocs documentation engine work?",
    answer:
      "Satisium includes two production documentation shells: **SpatialLayout** (our signature card-shift experience) and **ThreePaneLayout** (a borderless sidebar, article, and table-of-contents rail). You toggle between them globally with a single config flag in `lib/config.ts`.",
  },
  {
    id: "essential-integrations",
    question: "How do I add my own database or authentication provider?",
    answer:
      "Because Satisium is completely unopinionated and free of hardcoded database schemas, you can connect **Supabase, Clerk, Auth.js, or Prisma in under 10 minutes** without fighting conflicting boilerplate code.",
  },
  {
    id: "essential-licenses",
    question: "How do team seat licenses and upstream updates work?",
    answer:
      "Team licenses cover active developers contributing code to Satisium repositories, and seats can be **reallocated immediately** when team members change. Upstream template improvements and bug fixes are maintained cleanly via Changesets for seamless Git rebasing.",
  },
]

export const FAQ_CATEGORY_TABS: FaqCategoryTabItem[] = [
  { id: "all", label: "All Questions" },
  { id: "architecture", label: "Architecture" },
  { id: "docs-registry", label: "Docs & Registry" },
  { id: "licensing", label: "Licensing" },
  { id: "integrations", label: "Integrations" },
]

/* ==========================================================================
   SEO UTILITIES
   ========================================================================== */

export function generateFaqJsonLd(
  items: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/\*\*|`/g, ""),
      },
    })),
  }
}

/* ==========================================================================
   FORMATTED ANSWER HELPER
   Renders bold text (**bold**) and inline code (`code`) cleanly.
   ========================================================================== */

export const FormattedFaqAnswer = React.memo(function FormattedFaqAnswer({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const parts = React.useMemo(() => text.split(/(\*\*.*?\*\*|`.*?`)/g), [text])

  return (
    <p
      className={cn(
        "font-sans text-xs leading-relaxed text-muted-foreground sm:text-[13px] sm:leading-relaxed",
        className
      )}
    >
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded-[6px] bg-background px-1.5 py-0.5 font-mono text-[11px] text-foreground dark:bg-muted"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </p>
  )
})

/* ==========================================================================
   CONTEXTS
   ========================================================================== */

interface FaqContextValue {
  selectedCategory: FaqCategory
  setSelectedCategory: (cat: FaqCategory) => void
  openIds: Set<string>
  toggleItem: (id: string) => void
  isMulti: boolean
}

const FaqContext = React.createContext<FaqContextValue | null>(null)

export function useFaq() {
  const context = React.useContext(FaqContext)
  if (!context) {
    throw new Error("useFaq must be used within a <Faq> component.")
  }
  return context
}

interface FaqItemContextValue {
  id: string
  isOpen: boolean
  toggle: () => void
  category?: string
  categoryLabel?: string
}

const FaqItemContext = React.createContext<FaqItemContextValue | null>(null)

export function useFaqItem() {
  const context = React.useContext(FaqItemContext)
  if (!context) {
    throw new Error("useFaqItem must be used within a <FaqItem> component.")
  }
  return context
}

/* ==========================================================================
   COMPOUND ROOT: <Faq>
   ========================================================================== */

export interface FaqProps extends React.ComponentProps<"section"> {
  type?: "single" | "multiple"
  allowMultiple?: boolean
  defaultOpenId?: string | string[]
  openIds?: string[]
  onOpenIdsChange?: (openIds: string[]) => void
  defaultCategory?: FaqCategory
  category?: FaqCategory
  onCategoryChange?: (category: FaqCategory) => void
  includeJsonLd?: boolean
  jsonLdItems?: Array<{ question: string; answer: string }>
}

export function Faq({
  type = "single",
  allowMultiple,
  defaultOpenId = "zero-key-boot",
  openIds: controlledOpenIds,
  onOpenIdsChange,
  defaultCategory = "all",
  category: controlledCategory,
  onCategoryChange,
  includeJsonLd = true,
  jsonLdItems = FAQ_ITEMS,
  className,
  children,
  ...props
}: FaqProps) {
  const isMulti = type === "multiple" || allowMultiple === true

  const [internalOpenIds, setInternalOpenIds] = React.useState<Set<string>>(
    () => {
      if (Array.isArray(defaultOpenId)) return new Set(defaultOpenId)
      return defaultOpenId ? new Set([defaultOpenId]) : new Set()
    }
  )

  const [internalCategory, setInternalCategory] =
    React.useState<FaqCategory>(defaultCategory)

  const activeCategory = controlledCategory ?? internalCategory
  const handleCategoryChange = React.useCallback(
    (newCat: FaqCategory) => {
      if (controlledCategory === undefined) {
        setInternalCategory(newCat)
      }
      onCategoryChange?.(newCat)
    },
    [controlledCategory, onCategoryChange]
  )

  const activeOpenIds = React.useMemo(() => {
    if (controlledOpenIds !== undefined) return new Set(controlledOpenIds)
    return internalOpenIds
  }, [controlledOpenIds, internalOpenIds])

  const toggleItem = React.useCallback(
    (id: string) => {
      const next = new Set(activeOpenIds)
      if (isMulti) {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      } else {
        if (next.has(id)) next.clear()
        else {
          next.clear()
          next.add(id)
        }
      }

      if (controlledOpenIds === undefined) {
        setInternalOpenIds(next)
      }
      onOpenIdsChange?.(Array.from(next))
    },
    [activeOpenIds, isMulti, controlledOpenIds, onOpenIdsChange]
  )

  const jsonLdSchema = React.useMemo(
    () => generateFaqJsonLd(jsonLdItems),
    [jsonLdItems]
  )

  const contextValue = React.useMemo<FaqContextValue>(
    () => ({
      selectedCategory: activeCategory,
      setSelectedCategory: handleCategoryChange,
      openIds: activeOpenIds,
      toggleItem,
      isMulti,
    }),
    [activeCategory, handleCategoryChange, activeOpenIds, toggleItem, isMulti]
  )

  return (
    <FaqContext.Provider value={contextValue}>
      <section
        id="faq"
        aria-label="Frequently Asked Questions"
        className={cn(
          "relative mx-auto flex w-full max-w-6xl flex-col px-0 select-none sm:px-6",
          className
        )}
        {...props}
      >
        {includeJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
          />
        )}
        {children}
      </section>
    </FaqContext.Provider>
  )
}

/* ==========================================================================
   COMPOUND HEADER PRIMITIVES
   ========================================================================== */

export interface FaqHeaderProps extends React.ComponentProps<"div"> {
  align?: "left" | "center"
}

export function FaqHeader({
  align = "left",
  className,
  children,
  ...props
}: FaqHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" && "items-center text-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function FaqEyebrow({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-sans text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function FaqTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export const FaqHeading = FaqTitle

export function FaqDescription({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mt-2.5 font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/* ==========================================================================
   COMPOUND CATEGORY SELECTOR TABS
   ========================================================================== */

export interface FaqCategoryTabsProps extends React.ComponentProps<"div"> {
  categories?: FaqCategoryTabItem[]
  layoutId?: string
}

export function FaqCategoryTabs({
  categories = FAQ_CATEGORY_TABS,
  layoutId = "faq-category-active-indicator",
  className,
  ...props
}: FaqCategoryTabsProps) {
  const { selectedCategory, setSelectedCategory } = useFaq()

  return (
    <div
      className={cn("flex flex-wrap gap-1.5 lg:flex-col lg:gap-1", className)}
      {...props}
    >
      {categories.map((tab) => {
        const isSelected = selectedCategory === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={cn(
              "group relative flex h-8 items-center rounded-[10px] px-3 font-sans text-xs font-medium select-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              isSelected
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 z-0 rounded-[10px] bg-foreground"
                transition={SPRING.pill}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ==========================================================================
   COMPOUND CONTACT MICRO-DOCK
   ========================================================================== */

export interface FaqContactDockProps extends React.ComponentProps<"div"> {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function FaqContactDock({
  title = "Have a specific edge case?",
  description = "Our engineering team is active daily on GitHub and Discord to answer architectural inquiries.",
  actionLabel = "Ask on GitHub Discussions",
  actionHref = "https://github.com",
  className,
  children,
  ...props
}: FaqContactDockProps) {
  return (
    <div
      className={cn("rounded-[16px] bg-secondary p-4.5", className)}
      {...props}
    >
      {children ?? (
        <>
          <div className="font-heading text-xs font-semibold text-foreground">
            {title}
          </div>
          <p className="mt-1 font-sans text-[11px] leading-relaxed text-muted-foreground">
            {description}
          </p>
          <a
            href={actionHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 font-sans text-xs font-semibold text-foreground hover:underline"
          >
            <span>{actionLabel}</span>
            <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-3" />
          </a>
        </>
      )}
    </div>
  )
}

/* ==========================================================================
   COMPOUND ACCORDION PRIMITIVES
   ========================================================================== */

export interface FaqListProps extends React.ComponentProps<"div"> {
  animateLayout?: boolean
}

export function FaqList({
  animateLayout = false,
  className,
  children,
  ...props
}: FaqListProps) {
  return (
    <div
      className={cn("relative flex flex-col space-y-3", className)}
      {...props}
    >
      {animateLayout ? (
        <AnimatePresence mode="popLayout" initial={false}>
          {children}
        </AnimatePresence>
      ) : (
        children
      )}
    </div>
  )
}

export const FaqAccordion = FaqList

export interface FaqItemProps extends React.ComponentProps<"div"> {
  value: string
  category?: string
  categoryLabel?: string
}

export function FaqItem({
  value,
  category,
  categoryLabel,
  className,
  children,
  ...props
}: FaqItemProps) {
  const { openIds, toggleItem } = useFaq()
  const isOpen = openIds.has(value)

  const handleToggle = React.useCallback(() => {
    toggleItem(value)
  }, [toggleItem, value])

  const itemContextValue = React.useMemo<FaqItemContextValue>(
    () => ({
      id: value,
      isOpen,
      toggle: handleToggle,
      category,
      categoryLabel,
    }),
    [value, isOpen, handleToggle, category, categoryLabel]
  )

  return (
    <FaqItemContext.Provider value={itemContextValue}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-[18px] transition-colors duration-200 select-none",
          "bg-muted hover:bg-secondary",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </FaqItemContext.Provider>
  )
}

export interface FaqTriggerProps extends React.ComponentProps<"button"> {
  question?: string
  categoryLabel?: string
}

export function FaqTrigger({
  question,
  categoryLabel: directCategoryLabel,
  className,
  children,
  ...props
}: FaqTriggerProps) {
  const { id, isOpen, toggle, categoryLabel: ctxCategoryLabel } = useFaqItem()
  const label = directCategoryLabel ?? ctxCategoryLabel
  const contentId = `faq-content-${id}`
  const buttonId = `faq-button-${id}`

  return (
    <button
      id={buttonId}
      type="button"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls={contentId}
      className={cn(
        "flex w-full items-start justify-between gap-4 p-5 text-left focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none sm:p-6",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5 pr-2">
        {label && (
          <span className="font-sans text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            {label}
          </span>
        )}
        {children ?? (
          <span className="font-heading text-sm font-semibold tracking-tight text-foreground sm:text-[15px]">
            {question}
          </span>
        )}
      </div>

      <div className="flex size-7 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover/faq:text-foreground sm:size-8">
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={SPRING.snappy}
          className="flex items-center justify-center"
        >
          <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />
        </motion.div>
      </div>
    </button>
  )
}

export interface FaqContentProps extends React.ComponentProps<"div"> {
  answer?: string
  codeSnippet?: string
}

export function FaqContent({
  answer,
  codeSnippet,
  className,
  children,
  ...props
}: FaqContentProps) {
  const { id, isOpen } = useFaqItem()
  const contentId = `faq-content-${id}`
  const buttonId = `faq-button-${id}`

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={contentId}
          role="region"
          aria-labelledby={buttonId}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={SPRING.card}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "px-5 pt-1 pb-6 font-sans text-xs leading-relaxed text-muted-foreground sm:px-6 sm:pb-7 sm:text-[13px] sm:leading-relaxed",
              className
            )}
            {...props}
          >
            {children ?? (
              <>
                {answer && <p className="text-foreground">{answer}</p>}
                {codeSnippet && <FaqCodeSnippet snippet={codeSnippet} />}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function FaqCodeSnippet({
  snippet,
  className,
  ...props
}: React.ComponentProps<"div"> & { snippet: string }) {
  return (
    <div
      className={cn(
        "mt-3 flex items-center gap-2 rounded-[10px] bg-background px-3.5 py-2 font-mono text-[11px] text-foreground select-all dark:bg-secondary",
        className
      )}
      {...props}
    >
      <span className="text-muted-foreground">$</span>
      <span>{snippet}</span>
    </div>
  )
}
