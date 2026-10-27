import { ROUTES } from "@/lib/routes"

export type Audience = "individual" | "team"
export type Cadence = "monthly" | "annual" | "lifetime"

export interface PricingPriceMap {
  monthly?: number
  annual?: number
  lifetime?: number
}

export interface PricingSpec {
  property: string
  value: string
}

export interface PricingFeatureItem {
  text: string
  icon?: string
}

export type FeatureType = string | PricingFeatureItem

export interface PricingTier {
  id: string
  name: string
  index: string
  tagline: string
  featuresHeader?: string
  prices: {
    individual: PricingPriceMap
    team: PricingPriceMap
  }
  specs: {
    individual: PricingSpec[]
    team: PricingSpec[]
  }
  features?: {
    individual: FeatureType[]
    team: FeatureType[]
  }
  cta: {
    text: string
    href: string
  }
  isHero?: boolean
}

export interface EnterpriseInfo {
  name: string
  tagline: string
  cta: {
    text: string
    href: string
  }
  features: FeatureType[]
}

/**
 * Tier 1: Standalone Tool (Essential)
 */
export const DEFAULT_CURRENT_TOOL_TIER: PricingTier = {
  id: "current-tool",
  name: "This Tool",
  index: "01",
  tagline: "For solo developers and simple standalone applications.",
  featuresHeader: "ESSENTIAL PLAN INCLUDES:",
  prices: {
    individual: {
      monthly: 19,
      annual: 149,
      lifetime: 129,
    },
    team: {
      monthly: 49,
      annual: 399,
      lifetime: 349,
    },
  },
  specs: {
    individual: [
      { property: "Scope", value: "This tool only" },
      { property: "Seats", value: "1 developer" },
      { property: "License", value: "Commercial & personal" },
      { property: "Updates", value: "Lifetime updates" },
    ],
    team: [
      { property: "Scope", value: "This tool only" },
      { property: "Seats", value: "Up to 10 developers" },
      { property: "License", value: "Commercial & personal" },
      { property: "Updates", value: "Lifetime updates" },
    ],
  },
  features: {
    individual: [
      { text: "**1 developer** license seat", icon: "user" },
      { text: "**Lifetime** free updates for this tool", icon: "refresh" },
      { text: "**Personal & commercial** project rights", icon: "shield" },
      { text: "**Full source** code & components included", icon: "code" },
      { text: "**Windows, Mac & Linux** builds supported", icon: "server" },
      { text: "**Standard** community discord support", icon: "message" },
    ],
    team: [
      { text: "**Up to 10** team developer seats", icon: "users" },
      { text: "**Lifetime** free updates for this tool", icon: "refresh" },
      { text: "**Client & commercial** deployment rights", icon: "shield" },
      { text: "**Full source** code & components included", icon: "code" },
      { text: "**Multi-platform** build servers", icon: "server" },
      { text: "**Priority** team discord support", icon: "message" },
    ],
  },
  cta: {
    text: "Start free trial",
    href: ROUTES.docs,
  },
  isHero: false,
}

/**
 * Tier 2: Satisium Ecosystem All-Access Pass (Performance Hero Monolith)
 */
export const DEFAULT_SUITE_ACCESS_TIER: PricingTier = {
  id: "satisium-suite",
  name: "All-Access Suite",
  index: "02",
  tagline: "For sophisticated products and fast-moving teams.",
  featuresHeader: "EVERYTHING IN THIS TOOL, PLUS:",
  prices: {
    individual: {
      monthly: 39,
      annual: 199,
      lifetime: 299,
    },
    team: {
      monthly: 99,
      annual: 499,
      lifetime: 799,
    },
  },
  specs: {
    individual: [
      { property: "Scope", value: "All tools + future apps" },
      { property: "Seats", value: "1 developer" },
      { property: "License", value: "Commercial & personal" },
      { property: "Future Drops", value: "All releases included" },
    ],
    team: [
      { property: "Scope", value: "All tools + future apps" },
      { property: "Seats", value: "Unlimited organization" },
      { property: "License", value: "Commercial & personal" },
      { property: "Future Drops", value: "All releases included" },
    ],
  },
  features: {
    individual: [
      {
        text: "**All current** UI libraries & component sets",
        icon: "package",
      },
      { text: "**All future** apps released under Satisium", icon: "sparkles" },
      {
        text: "**Private CLI** registry token & automated sync",
        icon: "terminal",
      },
      { text: "**Unlimited** personal & client projects", icon: "infinity" },
      { text: "**Private Slack** channel builder support", icon: "message" },
      { text: "**Figma & Penpot** design tokens included", icon: "layers" },
      { text: "**Auto-update** smoke testing & CI integration", icon: "flame" },
      { text: "**Build & download** telemetry analytics", icon: "chart" },
    ],
    team: [
      {
        text: "**All current** UI libraries & component sets",
        icon: "package",
      },
      { text: "**All future** apps released under Satisium", icon: "sparkles" },
      { text: "**Organization-wide** developer tokens", icon: "terminal" },
      {
        text: "**Unlimited** client & commercial deployments",
        icon: "infinity",
      },
      { text: "**Private dedicated** Slack channel support", icon: "message" },
      { text: "**Team design** tokens and source assets", icon: "layers" },
      { text: "**Auto-update** CI/CD pipeline integration", icon: "flame" },
      { text: "**Full team** usage & download analytics", icon: "chart" },
    ],
  },
  cta: {
    text: "Start free trial",
    href: ROUTES.docs,
  },
  isHero: true,
}

/**
 * Tier 3: Team & Agency Scale (Scale)
 */
export const DEFAULT_TOOL_TEAM_TIER: PricingTier = {
  id: "tool-team",
  name: "Scale",
  index: "03",
  tagline: "For advanced team scaling and dedicated support.",
  featuresHeader: "EVERYTHING IN PERFORMANCE, PLUS:",
  prices: {
    individual: {
      monthly: 99,
      annual: 699,
      lifetime: 599,
    },
    team: {
      monthly: 199,
      annual: 1299,
      lifetime: 999,
    },
  },
  specs: {
    individual: [
      { property: "Scope", value: "This tool only" },
      { property: "Seats", value: "Up to 5 developers" },
      { property: "License", value: "Commercial & personal" },
      { property: "Updates", value: "Lifetime updates" },
    ],
    team: [
      { property: "Scope", value: "This tool only" },
      { property: "Seats", value: "Unlimited developers" },
      { property: "License", value: "Commercial & personal" },
      { property: "Updates", value: "Lifetime updates" },
    ],
  },
  features: {
    individual: [
      { text: "**Support for** staggered team rollouts", icon: "sliders" },
      { text: "**Dedicated** account manager & review", icon: "user-check" },
      {
        text: "**Priority support** & hands-on onboarding",
        icon: "headphones",
      },
      {
        text: "**Direct integration** architecture assistance",
        icon: "puzzle",
      },
      { text: "**Custom registry** upstream mirroring", icon: "server" },
    ],
    team: [
      {
        text: "**Support for** staggered enterprise rollouts",
        icon: "sliders",
      },
      {
        text: "**Dedicated** enterprise account executive",
        icon: "user-check",
      },
      {
        text: "**Priority 24/7** onboarding & builder support",
        icon: "headphones",
      },
      {
        text: "**Custom integration** architecture assistance",
        icon: "puzzle",
      },
      { text: "**Self-hosted registry** upstream mirroring", icon: "server" },
    ],
  },
  cta: {
    text: "Start free trial",
    href: ROUTES.docs,
  },
  isHero: false,
}

/**
 * Default Enterprise Foundation Slab
 */
export const DEFAULT_ENTERPRISE_INFO: EnterpriseInfo = {
  name: "Enterprise",
  tagline:
    "Customised to suit your organization's compliance, infra, and scale.",
  cta: {
    text: "Contact sales",
    href: ROUTES.docs,
  },
  features: [
    { text: "**Unlimited** organization developer seats", icon: "users" },
    { text: "**Custom billing** & formal invoicing", icon: "credit-card" },
    { text: "**Optional self-hosted** private infra", icon: "server" },
    { text: "**Team training** & architecture code reviews", icon: "code" },
    { text: "**Source escrow** & custom commercial terms", icon: "shield" },
    { text: "**Guaranteed 4-hour** response SLA", icon: "clock" },
  ],
}
