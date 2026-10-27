/**
 * Centralized Site and Brand Configuration
 *
 * Single source of truth for product branding, author information,
 * repository links, social profiles, and legal metadata.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://ease.satisium.com")

export const isDevelopment = process.env.NODE_ENV === "development"

export type EcosystemPillar = "design" | "labs"

export type ProductCluster =
  | "infrastructure"
  | "brain-economy"
  | "management"
  | "visual-primitives"
  | "polish"
  | "layout"
  | "ship"
  | "engagement"
  | "collaboration"
  | "moonshots"

export type ProductType = "library" | "saas" | "studio" | "cli" | "marketplace"

export interface SitelinkItem {
  name: string
  description: string
  path: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ProductConfig {
  name: string
  shortName: string
  slug: string
  ecosystem: "satisium"
  pillar: EcosystemPillar
  cluster: ProductCluster
  type: ProductType
  titleTemplate: string
  defaultTitle: string
  description: string
  applicationCategory: string
  sitelinks?: readonly SitelinkItem[]
  faqs?: readonly FAQItem[]
}

/** Single source of truth for product branding & taxonomy. */
export const PRODUCT: ProductConfig = {
  name: "Ease",
  shortName: "Ease",
  slug: "ease",
  ecosystem: "satisium",
  pillar: "design",
  cluster: "polish",
  type: "studio",
  titleTemplate: "%s | Ease",
  defaultTitle: "Ease — Motion Curve & Spring Physics Studio",
  description:
    "Interactive cubic-bezier editor and spring physics studio for design engineers. Export production-ready curves to CSS, Tailwind, GSAP, and Motion.",
  applicationCategory: "DeveloperApplication",
  sitelinks: [
    {
      name: "Workstation",
      description:
        "Interactive motion curve editor and spring physics workstation.",
      path: "/app",
    },
    {
      name: "Documentation",
      description:
        "Guides, spring differential formulas, and motion standards.",
      path: "/docs",
    },
    {
      name: "Springs",
      description: "Physics calculations for mass, stiffness, and damping.",
      path: "/docs/springs",
    },
    {
      name: "Presets",
      description: "Catalog of standardized cubic-bezier and spring curves.",
      path: "/docs/presets",
    },
  ],
  faqs: [
    {
      question: "What is Ease?",
      answer:
        "Ease is an interactive cubic-bezier and spring physics studio for design engineers. It lets you visually craft, inspect, and fine-tune motion curves, then export production-ready code for CSS, Tailwind, GSAP, and Motion.",
    },
    {
      question: "How does Ease calculate spring physics?",
      answer:
        "Ease solves analytical spring differential equations using mass, stiffness, damping, and initial velocity. It exports precision linear easing approximations and native animation parameters for web motion frameworks.",
    },
    {
      question: "Can I export curves to CSS or Motion?",
      answer:
        "Yes. Ease generates one-click export code formatted for native CSS cubic-bezier, CSS linear() spring approximations, Tailwind config keyframes, GSAP CustomEase, and Motion transition springs.",
    },
  ],
}

/**
 * The two docs shells:
 *   spatial    — the signature Satisium card-shift layout
 *   three-pane — borderless sidebar | article | optional third rail
 */
export const DOCS_LAYOUT_VARIANTS = ["spatial", "three-pane"] as const

export type DocsLayoutVariant = (typeof DOCS_LAYOUT_VARIANTS)[number]

/**
 * Which docs shell to render. Set NEXT_PUBLIC_DOCS_LAYOUT in `.env.local`.
 */
export const DOCS_LAYOUT: DocsLayoutVariant =
  DOCS_LAYOUT_VARIANTS.find(
    (variant) => variant === process.env.NEXT_PUBLIC_DOCS_LAYOUT
  ) ?? "spatial"

export type SocialPlatform =
  "x" | "github" | "discord" | "instagram" | "youtube" | "linkedin" | "website"

export interface SocialLink {
  platform: SocialPlatform
  href: string
  label: string
  ariaLabel: string
}

export const PROJECT = {
  name: "Ease",
  x: "https://x.com/satisium",
  github: "https://github.com/satishkumarsajjan/ease-master",
  discord: "https://discord.gg/xQ5cPHmT7",
  instagram: "https://www.instagram.com/satisium/",
} as const

export const AUTHOR = {
  name: "Satishkumar",
  x: "https://x.com/iamsatish4564",
  github: "https://github.com/satishkumarsajjan",
  website: "https://satishkumar.xyz/",
} as const

/**
 * owner/repo in "owner/name" form.
 */
export const REPO = "satishkumarsajjan/ease-master"

export const FOOTER_SOCIALS: SocialLink[] = [
  {
    platform: "x",
    href: PROJECT.x,
    label: "X",
    ariaLabel: `${PROJECT.name} on X`,
  },
  {
    platform: "instagram",
    href: PROJECT.instagram,
    label: "Instagram",
    ariaLabel: `${PROJECT.name} on Instagram`,
  },
  {
    platform: "github",
    href: PROJECT.github,
    label: "GitHub",
    ariaLabel: `${PROJECT.name} on GitHub`,
  },
  {
    platform: "discord",
    href: PROJECT.discord,
    label: "Discord",
    ariaLabel: `${PROJECT.name} Discord`,
  },
]

export const AUTHOR_SOCIALS: SocialLink[] = [
  {
    platform: "x",
    href: AUTHOR.x,
    label: "X",
    ariaLabel: `${AUTHOR.name} on X`,
  },
  {
    platform: "github",
    href: AUTHOR.github,
    label: "GitHub",
    ariaLabel: `${AUTHOR.name} on GitHub`,
  },
]

export const TWITTER_CREATOR = "@iamsatish4564"

export const ORGANIZATION_SAME_AS = [
  PROJECT.x,
  PROJECT.instagram,
  PROJECT.github,
  PROJECT.discord,
  AUTHOR.x,
  AUTHOR.website,
] as const

export const LEGAL = {
  company: "SATISIUM",
  product: "Ease",
  contactEmail: "legal@satisium.com",
  jurisdiction: "India",
  updated: "2026-10-28",
} as const
