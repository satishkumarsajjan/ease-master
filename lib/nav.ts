import {
  Book02Icon,
  BlocksIcon,
  CommandIcon,
  Home01Icon,
  Legal02Icon,
  Moon02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"

import { HOTKEYS } from "@/lib/hotkeys"
import { ROUTES } from "@/lib/routes"
import { PROJECT, AUTHOR } from "@/lib/social-links"

export interface NavItem {
  label: string
  href: string
  /** Hugeicons export name — rendered by AppNav/SiteHeader via HugeiconsIcon. */
  icon?: unknown
  description?: string
  badge?: string
  external?: boolean
  keywords?: string[]
}

/** Primary app navigation — order is the render order. */
export const APP_NAV: NavItem[] = [
  { label: "Home", href: ROUTES.home, icon: Home01Icon, keywords: ["landing"] },
  {
    label: "App",
    href: ROUTES.app,
    icon: SparklesIcon,
    description: "The workspace",
    keywords: ["tool", "canvas"],
  },
  {
    label: "Docs",
    href: ROUTES.docs,
    icon: Book02Icon,
    description: "Guides and reference",
    keywords: ["documentation", "guide"],
  },
  {
    label: "Components",
    href: ROUTES.docsComponents,
    icon: BlocksIcon,
    description: "Live previews + CLI installs",
    keywords: ["registry", "preview"],
  },
]

/** Marketing footer columns (4-column balanced categorical matrix). */
export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Product",
    items: [
      { label: "App Workspace", href: ROUTES.app },
      { label: "Component Kit", href: ROUTES.docsComponents },
      { label: "Interactive Stage", href: ROUTES.stage },
      { label: "Changelog", href: ROUTES.changelog },
    ],
  },
  {
    title: "Documentation",
    items: [
      { label: "Quickstart Installation", href: ROUTES.docsInstall },
      { label: "Project Anatomy", href: ROUTES.docsStructure },
      { label: "Component Registry", href: ROUTES.docsComponents },
      { label: "Architecture Docs", href: ROUTES.docs },
    ],
  },
  {
    title: "Ecosystem",
    items: [
      { label: "GitHub Repository", href: PROJECT.github, external: true },
      { label: "Discord Community", href: PROJECT.discord, external: true },
      {
        label: "Releases & Tags",
        href: `${PROJECT.github}/releases`,
        external: true,
      },
      { label: "Creator Profile", href: AUTHOR.x, external: true },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: ROUTES.privacy, icon: Legal02Icon },
      { label: "Terms of Service", href: ROUTES.terms },
      { label: "Cookie Settings", href: ROUTES.cookies },
    ],
  },
]

/**
 * Quick actions surfaced in the ⌘K palette alongside docs results.
 * Passing this to <CommandMenuDialog extraItems={…} /> is what makes ⌘K cover
 * the whole app instead of docs only.
 */
export const QUICK_ACTIONS: NavItem[] = [
  ...APP_NAV,
  {
    label: "Toggle theme",
    href: "#theme",
    icon: Moon02Icon,
    keywords: ["dark", "light", "system"],
  },
  {
    label: "Keyboard shortcuts",
    href: "#shortcuts",
    icon: CommandIcon,
    keywords: HOTKEYS.map((h) => h.keys),
  },
  { label: "Source code", href: PROJECT.github, external: true },
]
