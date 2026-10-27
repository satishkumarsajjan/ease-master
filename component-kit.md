# Satisium Starter — Template Component Kit

> **Companion to `starter-template.md`.** That document builds the _shell_ (brand, docs engine,
> registry, SEO, tooling). This document defines the **template library** — the components,
> hooks and `lib` modules the app and docs surfaces are assembled _from_.
>
> **Read all three, in this order.** `BUILD.md` (how to run the build — sessions, prompts,
> checkpoints) → `starter-template.md` §0–§24 (the shell and the build order) → this file (the
> inventory, and the source for every file marked `[KIT]`).

---

## 1. Two libraries — never confuse them

|                    | **Registry library**                                      | **Template library**                                       |
| :----------------- | :-------------------------------------------------------- | :--------------------------------------------------------- |
| **What**           | Components you _distribute_ to users (free or paid)       | Components the _app itself_ is built from                  |
| **Lives in**       | `registry/ui/*`, `registry/demos/*`, `registry/strings/*` | `components/**`, `hooks/**`, `lib/**`                      |
| **Ships to users** | Yes — `public/r/*.json` + `shadcn add`                    | No — it _is_ the app                                       |
| **Styled by**      | Satisium tokens (must work standalone)                    | Satisium tokens **and** app context (nav, routing, stores) |
| **Tested by**      | Registry smoke tests + `/preview` screenshots             | Route matrix e2e + unit tests                              |
| **Spec**           | `starter-template.md` §11                                 | **this file**                                              |

A registry component must work when pasted into a stranger's project.
A template component may assume our shell, our tokens, our stores, and our conventions.

---

## 2. Conventions (non-negotiable)

### 2.1 Placement

| Kind                    | Path                                                        | Example                               |
| :---------------------- | :---------------------------------------------------------- | :------------------------------------ |
| App chrome & shell      | `components/layout/`                                        | `app-shell.tsx`, `site-header.tsx`    |
| Docs chrome             | `components/layout/` (same folder — docs are a surface too) | `sidebar-content.tsx`, `toc.tsx`      |
| Reusable UI primitives  | `components/ui/`                                            | `kbd.tsx`, `empty-state.tsx`          |
| Marketing sections      | `components/marketing/`                                     | `feature-grid.tsx`, `cta-section.tsx` |
| MDX-only components     | `components/mdx/`                                           | `steps.tsx`, `prompt-block.tsx`       |
| Brand assets            | `components/` (root)                                        | `satisium-logo.tsx`, `icons.tsx`      |
| Hooks                   | `hooks/`                                                    | `use-hotkey.ts`                       |
| Framework-free helpers  | `lib/`                                                      | `env.ts`, `nav.ts`, `motion.ts`       |
| Stores                  | `store/`                                                    | `use-sidebar-store.ts`                |
| Generated / distributed | `registry/`                                                 | `registry/ui/pulse-card.tsx`          |

### 2.2 Component rules

1. **Files are kebab-case**, exports are PascalCase: `page-header.tsx` → `PageHeader`.
2. **`"use client"` is opt-in.** Server components by default. Add the directive only when the
   file uses state, effects, event handlers, refs, or browser APIs. Never add it to a `page.tsx`
   that only composes.
3. **Props are explicit.** Either `interface XProps extends React.ComponentProps<"div">` or a
   hand-written `interface XProps`. Always accept `className?: string` and merge it **last**
   with `cn()` so callers can override.
4. **No `any`.** Use `unknown` + narrowing, or a generic. `as` is allowed only at library
   boundaries (Shiki, GSAP, Radix `Slot`).
5. **Variants via CVA**, never boolean-prop explosions. Two variants max, plus `size`.
6. **Forward refs only when a parent needs the DOM node** (`React.forwardRef`), otherwise plain
   function components (React 19 allows ref as a prop).
7. **Server/client payload discipline.** Never pass functions, class instances, or
   non-serialisable nodes across the boundary. This is why `lib/source.tsx` stores only
   primitives (`_badge`, `_comingSoon`) on page-tree nodes — do the same everywhere.

### 2.3 Styling rules

1. **Tokens only.** No hex, no `rgb()`, no `text-gray-500`. Use `bg-background`,
   `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`.
2. **`cn()` for every conditional class.**
3. **Radius:** cards/surfaces `rounded-3xl`; controls `rounded-[12px]`; pills `rounded-full`;
   the docs card `rounded-[32px]`. Never `rounded-lg` on a surface.
4. **Typography:** headings use `font-heading` (Plus Jakarta Sans) with the `text-h1…h6` scale;
   body is Inter via the base layer; code/mono is IBM Plex Mono; handwriting is `font-caveat`
   (reserved for `Annotation` and docs asides). Display type uses `.text-display*` utilities.
5. **Motion values come from `lib/motion.ts`** — never inline `stiffness: 380`. The JS constants
   mirror the CSS `--duration-*` / `--ease-*` tokens so the two never drift.
6. **Focus rings are mandatory:** `focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none`.
7. **Dark mode is the default assumption.** Design tokens first, then verify light — the brand
   is dark-first but must be flawless in both (see `starter-template.md` §16.2).
8. **Zero opacity modifier rule.** Never play with color opacity modifiers (`/70`, `/80`, `/50`, `/20`, etc.). Always use discrete semantic variables directly (`bg-secondary`, `bg-muted`, `text-muted-foreground`, `bg-card`). Alpha transparency causes unpredictable blending with underlying elements, leading to color banding, optical shifts, and contrast failures.

### 2.4 Accessibility contract

| Requirement          | Rule                                                                         |
| :------------------- | :--------------------------------------------------------------------------- |
| Icon-only controls   | **Must** have `aria-label` + a `title` tooltip                               |
| Interactive elements | Real `<button>` / `<a>`, never a clickable `<div>`                           |
| Toggles              | `aria-pressed` (buttons) or `aria-expanded` (disclosures)                    |
| Live updates         | Toasts use `sonner` (announced); inline updates use `role="status"`          |
| Focus order          | DOM order must match visual order; no `tabIndex` > 0                         |
| Motion               | Respect `prefers-reduced-motion` (§21.1 of the main spec)                    |
| Contrast             | Never place `text-muted-foreground` on `bg-muted` — use `text-foreground/70` |

### 2.5 The zero-key rule

**A fresh clone with an empty `.env.local` must boot, build and pass tests.**
Every integration degrades to a no-op or a dev stub:
analytics → silent, email → console log, rate limit → in-memory, error tracking → `console.error`.
Any component that breaks this rule is a bug, not a feature.

### 2.6 Docs for the kit itself

Every component in this kit gets a page under `content/docs/kit/` (same Fumadocs pipeline).
That folder doubles as the visual QA surface: if the kit renders correctly there, it renders
correctly everywhere.

---

## 3. Inventory — the complete template library

**Status key:** ✅ copy from the reference · ⚠️ extract/refactor an existing pattern · 🆕 write it (code in this file) · 📦 `shadcn add` · 📝 contract only

### 3.1 `lib/` foundations

| Module                                                                                             | Status        | Purpose                                               |
| :------------------------------------------------------------------------------------------------- | :------------ | :---------------------------------------------------- |
| `lib/config.ts`                                                                                    | ✅ v1 §6.1    | `SITE_URL`, `isDevelopment`, `PRODUCT`, `DOCS_LAYOUT` |
| `lib/social-links.ts`                                                                              | ✅ v1 §6.2    | `PROJECT`, `AUTHOR`, `REPO`, social groups            |
| `lib/utils.ts` (`cn`)                                                                              | ✅ v1 §6.3    | class merge                                           |
| `lib/logger.ts`                                                                                    | ✅ v1 §6.4    | dev-only tagged logging                               |
| `lib/routes.ts`                                                                                    | 🆕 §4.1       | **typed route map** — kills hardcoded hrefs           |
| `lib/nav.ts`                                                                                       | 🆕 §4.2       | **nav registry** driving header, rail, footer, ⌘K     |
| `lib/env.ts`                                                                                       | 🆕 §4.3       | zod-validated env + zero-key rule                     |
| `lib/metadata.ts`                                                                                  | 🆕 §4.4       | `buildMetadata()` for non-docs routes                 |
| `lib/motion.ts`                                                                                    | 🆕 §4.5       | shared springs/easings mirroring the CSS tokens       |
| `lib/hotkeys.ts`                                                                                   | 🆕 §4.6       | the keyboard-shortcut registry                        |
| `lib/toast.ts`                                                                                     | 🆕 §4.7       | brand toast helpers                                   |
| `lib/format.ts`                                                                                    | 📝 §4.8       | dates, numbers, bytes, relative time                  |
| `lib/validators.ts`                                                                                | 📝 §4.8       | shared zod schemas (client + server)                  |
| `lib/csp.mjs`                                                                                      | 🆕 main §21.5 | composes the CSP from integrations                    |
| `lib/analytics.ts`, `lib/consent.tsx`, `lib/consent-utils.ts`, `lib/rate-limit.ts`, `lib/redis.ts` | ✅ v1 §18     | analytics + consent + fail-open limiter               |
| `lib/source.tsx`, `lib/docs-page.tsx`, `lib/theme-transition.ts`                                   | ✅ v1 §5/§9   | docs engine helpers                                   |

### 3.2 Hooks

| Hook                        | Status  | Purpose                                                        |
| :-------------------------- | :------ | :------------------------------------------------------------- |
| `use-scroll-spy`            | ✅      | docs TOC                                                       |
| `use-track-event`           | ✅      | analytics event hook                                           |
| `use-hotkey` / `useHotkeys` | 🆕 §5.1 | register + fire shortcuts, typing-target safe                  |
| `use-media-query`           | ⚠️ §5.2 | extracted from `component-preview.tsx` (it lives inline today) |
| `use-mounted`               | 🆕 §5.3 | SSR-safe mount flag (used by every theme control)              |
| `use-copy`                  | 🆕 §5.4 | clipboard + "copied" state (today hand-rolled in 4 files)      |
| `use-local-storage`         | 📝 §5.5 | JSON-persisted state with SSR guard                            |
| `use-debounce`              | 📝 §5.5 | input debouncing                                               |
| `use-in-view`               | 📝 §5.5 | scroll-triggered reveals                                       |
| `use-event-listener`        | 📝 §5.5 | typed window/document listener                                 |

### 3.3 Layout & shell

| Component                    | Status  | Purpose                                                                |
| :--------------------------- | :------ | :--------------------------------------------------------------------- |
| `Container`                  | 🆕 §6.1 | the one horizontal rhythm (replaces ad-hoc `container mx-auto px-8 …`) |
| `Surface`                    | 🆕 §6.2 | the repeated `rounded-3xl border bg-card` recipe                       |
| `PageHeader`                 | 🆕 §6.3 | title · description · badge · breadcrumbs · actions                    |
| `Section` / `SectionHeading` | 🆕 §6.4 | vertical rhythm + anchorable headings                                  |
| `AppNav`                     | 🆕 §6.5 | nav list from `lib/nav.ts` with the liquid active pill                 |
| `AppShell`                   | 🆕 §6.6 | header + optional rail + content                                       |
| `SiteHeader`                 | 🆕 §7.1 | marketing/app top bar + mobile drawer                                  |
| `MobileNav`                  | 🆕 §7.1 | 📦 `sheet` based                                                       |
| `WorkbenchShell`             | 🆕 §7.2 | 3-pane resizable tool shell (Tweak/Typeset pattern)                    |
| `StickyAside`                | 📝 §7.3 | the sticky right column currently inline in the docs page              |
| `DocsHeader` / `DocsPager`   | ⚠️ §12  | extract the inline docs-page chrome                                    |

### 3.4 States & feedback

| Component                 | Status     | Purpose                                  |
| :------------------------ | :--------- | :--------------------------------------- |
| `EmptyState`              | 🆕 §8.1    | no data / nothing selected / coming soon |
| `LoadingState` + skeleton | 🆕 §8.2    | 📦 `skeleton`; used by `loading.tsx`     |
| `ErrorState`              | 🆕 §8.3    | reusable error block with reset          |
| `ErrorBoundary`           | 🆕 §8.4    | protects previews and product subtrees   |
| `Toaster` + `lib/toast`   | 🆕 §8.5    | 📦 `sonner`, brand-styled                |
| `Kbd` / `KbdShortcut`     | 🆕 §8.6    | hotkey chips (the ⌘K affordance)         |
| `Alert`                   | 📦 §8.7    | inline warnings/errors                   |
| `Progress`                | 📦 §8.7    | determinate progress                     |
| `Callout`                 | ✅ v1 §9.6 | docs callouts                            |

### 3.5 Data display

| Component                                                                     | Status  | Purpose                                  |
| :---------------------------------------------------------------------------- | :------ | :--------------------------------------- |
| `DescriptionList`                                                             | 🆕 §9.1 | key/value details (settings, metadata)   |
| `StatCard`                                                                    | 🆕 §9.2 | metric tile (`--chart-*` aware)          |
| `DataTable`                                                                   | 📝 §9.3 | 📦 `table` + sorting/pagination contract |
| `Timeline`                                                                    | 📝 §9.4 | changelog / activity feed                |
| `Pagination`                                                                  | 📦 §9.5 | list navigation                          |
| `Avatar` `Badge` `Separator` `ScrollArea` `Tabs` `Tooltip` `Dialog` `Command` | ✅      | already in `components/ui`               |

### 3.6 MDX components

| Component                                    | Status   | Purpose                        |
| :------------------------------------------- | :------- | :----------------------------- |
| `Steps` / `Step`                             | 🆕 §10.1 | numbered walkthroughs          |
| `PromptBlock`                                | 🆕 §10.2 | copy-ready agent prompt        |
| `Tabs` (re-export)                           | ✅ §10.3 | reuse `components/ui/tabs`     |
| `Accordion`                                  | 📦 §10.3 | FAQ / advanced sections        |
| `FileTree`                                   | 📝 §10.4 | reuses `code-block/tree-utils` |
| `CodeBlock` `Callout` `CommandBlock` `Badge` | ✅       | from v1                        |

### 3.7 Marketing blocks

| Component                                 | Status    | Purpose                              |
| :---------------------------------------- | :-------- | :----------------------------------- |
| `LandingHero` `Launchpad` `SiteFooter`    | ✅ v1 §12 | landing                              |
| `FeatureGrid`                             | 📝 §11.1  | 3–6 value props                      |
| `FaqSection`                              | 📝 §11.1  | 📦 `accordion`                       |
| `CtaSection`                              | 📝 §11.1  | closing call to action               |
| `LogoCloud` `Testimonials` `PricingTable` | 📝 §11.1  | add when a product needs them        |
| `WaitlistForm`                            | 📝 §11.2  | email capture → module backlog (§22) |

### 3.8 Docs-side (non-registry)

✅ from v1: `SidebarContent`, `SidebarFooter`, `TableOfContents`, `PageBreadcrumbs`,
`CommandMenuDialog/Trigger`, the 6-file code block, the 7-file previewer, `CopyMdxButton`.
🆕/⚠️ additions: `EditOnGitHub` (§12.2), `DocsFeedback` (§12.3), `VersionSwitcher` 📝 (§12.4),
`DocsHeader`/`DocsPager` extraction (§12.1).

### 3.9 Scope rule

If a component is **only** useful to a distributed library (catalog grids, `component-card`),
it belongs in `registry/`, not here. If the app itself needs it, it belongs here and gets a
page under `content/docs/kit/`. When in doubt: does a SaaS/product page use it? → here.

### 3.10 Overlays & forms — required now vs. later

| Primitive                                                                | Status          | Needed by                          |
| :----------------------------------------------------------------------- | :-------------- | :--------------------------------- |
| `sheet`                                                                  | **required**    | `SiteHeader` mobile nav (kit §7.1) |
| `sonner`                                                                 | **required**    | `Toaster` (kit §8.5)               |
| `skeleton`                                                               | **required**    | `LoadingState` (kit §8.2)          |
| `accordion`                                                              | **required**    | MDX components (kit §10.3)         |
| `alert`, `progress`                                                      | **required**    | states (kit §8.7)                  |
| `popover`, `dropdown-menu`, `context-menu`, `hover-card`, `alert-dialog` | add when needed | menus + destructive confirms       |
| `label`, `checkbox`, `switch`, `slider`, `radio-group`, `toggle-group`   | add when needed | product forms                      |
| `table`, `pagination`                                                    | add when needed | `DataTable` (kit §9.3)             |

Commands for all three groups: main spec **§3.5**.

**Forms policy** (recorded once, so it is not re-litigated per product): native `<form>` +
`lib/validators.ts` (zod) + inline errors is the default. Do **not** add `react-hook-form` until a
product needs field arrays, async validation or multi-step wizards — and when it does, that is a
§22 module entry, not a base change.

---

## 4. Foundations (`lib/`)

These carry no UI, which is exactly why they matter: they remove hardcoded strings and magic
numbers from every component in §5–§11.

### 4.1 `lib/routes.ts` — the typed route map

```ts
export const ROUTES = {
  home: "/",
  app: "/app",
  docs: "/docs",
  docsInstall: "/docs/getting-started/installation",
  docsStructure: "/docs/getting-started/project-structure",
  docsComponents: "/docs/components",
  docsSample: "/docs/components/sample-component",
  changelog: "/docs/changelog",
  privacy: "/privacy",
  terms: "/terms",
  cookies: "/cookies",
} as const

export type RouteKey = keyof typeof ROUTES
export type Route = (typeof ROUTES)[RouteKey]

/** Preview/embed helpers — keep the URL shape in exactly one place. */
export const previewFor = (registryKey: string) => `/preview/${registryKey}`
export const embedFor = (registryKey: string) => `/embed/${registryKey}`
export const registryJsonFor = (name: string) => `/r/${name}.json`
```

Rules: **no component may contain a literal route string.** Footer, header, ⌘K, sitemap and
`middleware`/`proxy` all read from here, so a route rename is a one-line change and TypeScript
catches every stale link.

### 4.2 `lib/nav.ts` — the navigation registry

Today the footer hardcodes docs paths, the ⌘K palette only knows about docs pages, and the
sidebar is generated from Fumadocs. This file gives the _app_ the same single-source-of-truth
treatment.

```ts
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
import { PROJECT } from "@/lib/social-links"

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

/** Marketing footer columns. */
export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Product",
    items: [
      { label: "App", href: ROUTES.app },
      { label: "Documentation", href: ROUTES.docs },
      { label: "Components", href: ROUTES.docsComponents },
      { label: "Changelog", href: ROUTES.changelog },
    ],
  },
  {
    title: "Getting started",
    items: [
      { label: "Installation", href: ROUTES.docsInstall },
      { label: "Project structure", href: ROUTES.docsStructure },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: ROUTES.privacy, icon: Legal02Icon },
      { label: "Terms", href: ROUTES.terms },
      { label: "Cookies", href: ROUTES.cookies },
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
```

Wiring (three touch points, all covered in the main spec):

1. `<CommandMenuDialog docsTree={…} extraItems={QUICK_ACTIONS} />` in `app/layout.tsx` (§5.2).
2. `AppNav`/`SiteHeader` render `APP_NAV` (kit §6.5, §7.1).
3. `SiteFooter` renders `FOOTER_NAV` instead of hardcoded links (main spec §12.1).

> `#theme` / `#shortcuts` are handled by the palette's `onSelect`: hash actions call the hotkey
> handler or open the shortcuts group instead of navigating.

### 4.3 `lib/env.ts` — validated env + the zero-key rule

```ts
import { z } from "zod"

/**
 * Zero-key rule (component-kit §2.5): EVERY variable is optional.
 * A fresh clone with an empty .env.local must boot, build and pass tests.
 * If you ever need to make one required, that is a product decision — not a starter one.
 */

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_DOCS_LAYOUT: z.enum(["spatial", "three-pane"]).default("spatial"),
  NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z
    .string()
    .url()
    .default("https://us.i.posthog.com"),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_BING_SITE_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
})

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  GIT_TOKEN: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
})

// Static property access only. Next.js inlines NEXT_PUBLIC_* at build time and cannot
// see values read through dynamic indexing (process.env[key]).
const clientRaw = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_DOCS_LAYOUT: process.env.NEXT_PUBLIC_DOCS_LAYOUT,
  NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN:
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_BING_SITE_VERIFICATION:
    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
}

function parse<T extends z.ZodTypeAny>(
  schema: T,
  raw: unknown,
  scope: string
): z.infer<T> {
  const result = schema.safeParse(raw)
  if (result.success) return result.data

  const issues = result.error.issues
    .map((issue) => `  • ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n")
  const message = `Invalid ${scope} environment variables:\n${issues}\n\nSee .env.example — every variable is optional; only malformed values fail.`

  if (process.env.NODE_ENV === "production") {
    // Never crash a deploy over an analytics key — log and fall back to defaults.
    console.error(message)
    return schema.parse({}) as z.infer<T>
  }

  throw new Error(message)
}

export const env = {
  ...parse(clientSchema, clientRaw, "client"),
  ...(typeof window === "undefined"
    ? parse(
        serverSchema,
        {
          NODE_ENV: process.env.NODE_ENV,
          GIT_TOKEN: process.env.GIT_TOKEN,
          UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
          UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
          SENTRY_DSN: process.env.SENTRY_DSN,
        },
        "server"
      )
    : {}),
}

/** Feature switches — never gate UI on raw process.env. */
export const features = {
  analytics: Boolean(env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN),
  ga: Boolean(env.NEXT_PUBLIC_GA_ID),
  telemetryStore: Boolean(
    env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  ),
  errorTracking: Boolean(env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN),
  lastModified: Boolean(env.GIT_TOKEN),
} as const
```

Rules:

- **Server keys are `undefined` on the client by design.** Never read `env.GIT_TOKEN` in a
  client component; TypeScript will let you, the browser will hand you `undefined`.
- `lib/config.ts` (v1 §6.1) keeps `SITE_URL` for backwards compatibility but should now read
  `env.NEXT_PUBLIC_SITE_URL` so there is exactly one source of truth.
- Add a variable in **three places**: `clientSchema`/`serverSchema` here, `.env.example`, and
  `scripts/doctor.mjs` (§19.8 of the main spec) which asserts the two lists match.

### 4.4 `lib/metadata.ts` — SEO for non-docs routes

Docs pages get canonical URLs, OG images and `article:*` metadata from the docs route (§9.5 of
the main spec). **Nothing else does** — so every app page would hand-roll `Metadata`. This file
fixes that.

```ts
import type { Metadata } from "next"

import { PRODUCT, SITE_URL } from "@/lib/config"

export interface BuildMetadataInput {
  title: string
  description?: string
  /** Absolute path starting with "/" — becomes the canonical URL. */
  path?: string
  /** Override the generated OG image. */
  image?: string
  /** Right-hand eyebrow on the OG card (docs pages pass the section). */
  label?: string
  noIndex?: boolean
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  label,
  noIndex,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
}: BuildMetadataInput): Metadata {
  const canonical = `${SITE_URL}${path === "/" ? "" : path}`
  const desc = description ?? PRODUCT.description
  const ogImage =
    image ??
    `/api/og?title=${encodeURIComponent(title)}${label ? `&label=${encodeURIComponent(label)}` : ""}`

  return {
    title,
    description: desc,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      title,
      description: desc,
      url: canonical,
      siteName: PRODUCT.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(tags?.length ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
  }
}
```

Usage in any app route:

```ts
export const metadata = buildMetadata({
  title: "Settings",
  description: "Manage your workspace preferences.",
  path: "/app/settings",
  noIndex: true,
})
```

### 4.5 `lib/motion.ts` — one source of truth for springs

The reference repeats raw spring objects in at least five files
(`{ type: "spring", stiffness: 380, damping: 38, mass: 0.8 }` in the docs card and rail,
`{ stiffness: 500, damping: 30 }` in `ActionButton`, `{ 350, 30 }` in two pill indicators).
Copying those verbatim is correct for fidelity, but **new** components must import them.

```ts
import type { Transition, Variants } from "motion/react"

/** Mirrors the CSS tokens in globals.css (--duration-*). Change both together. */
export const DURATION = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
  display: 0.6,
} as const

/** Mirrors --ease-* (as cubic-bezier tuples for Motion/GSAP). */
export const EASE: Record<
  "outExpo" | "inOut" | "snap" | "springOut",
  [number, number, number, number]
> = {
  outExpo: [0.16, 1, 0.3, 1],
  inOut: [0.4, 0, 0.2, 1],
  snap: [0.2, 1, 0.2, 1],
  springOut: [0.3, 1.5, 0.5, 1],
}

/** Named springs. Never inline these numbers in a component. */
export const SPRING: Record<"card" | "snappy" | "pill" | "soft", Transition> = {
  /** Docs card + rail — the signature spatial motion. */
  card: { type: "spring", stiffness: 380, damping: 38, mass: 0.8 },
  /** ActionButton success swap, toolbars. */
  snappy: { type: "spring", stiffness: 500, damping: 30 },
  /** Active indicators (`layoutId` pills). */
  pill: { type: "spring", stiffness: 350, damping: 30 },
  /** Gentle entrances. */
  soft: { type: "spring", stiffness: 260, damping: 30 },
}

/** Standard presets. Reduced motion is handled globally by <MotionConfig reducedMotion="user">
 *  (main spec §21.1), so components never branch on the OS setting themselves. */
export const FADE_IN: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const SLIDE_UP: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
}

/** Parent for staggered lists: <motion.ul variants={{ transition: { staggerChildren: 0.03 } }}> */
export const STAGGER_CHILDREN = 0.03
```

### 4.6 `lib/hotkeys.ts` — the shortcut registry

The starter has three global shortcuts (`⌘K`, `D`, `M`) and no register of them, which is
how conflicts start. This file is the register; `hooks/use-hotkey.ts` (§5.1) is the engine.

`M` is the **only** navigation shortcut — it toggles the docs sidebar in both docs layouts. There is
deliberately no `⌘B`: one key for the menu, never two that mean the same thing.

```ts
export type HotkeyScope = "global" | "docs" | "app"

export interface Hotkey {
  id: string
  /** "mod+k", "d", "shift+/" — "mod" = ⌘ on Apple, Ctrl elsewhere. */
  keys: string
  description: string
  scope: HotkeyScope
  /** Call preventDefault (needed for "/" and "mod+k"). */
  preventDefault?: boolean
}

export const HOTKEYS: Hotkey[] = [
  {
    id: "command",
    keys: "mod+k",
    description: "Open the command menu",
    scope: "global",
    preventDefault: true,
  },
  {
    id: "theme",
    keys: "d",
    description: "Toggle light / dark",
    scope: "global",
  },
  {
    id: "docs-sidebar",
    keys: "m",
    description: "Toggle the documentation sidebar",
    scope: "docs",
  },
  {
    id: "search",
    keys: "/",
    description: "Search",
    scope: "app",
    preventDefault: true,
  },
  {
    id: "dismiss",
    keys: "escape",
    description: "Close the top overlay",
    scope: "global",
  },
]

export const isApplePlatform = () =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)

/** "mod+k" → "⌘K" on Apple, "Ctrl K" elsewhere. Used by <KbdShortcut /> and the docs page. */
export function formatHotkey(keys: string, apple = isApplePlatform()): string {
  const parts = keys.split("+").map((part) => {
    switch (part.toLowerCase()) {
      case "mod":
        return apple ? "⌘" : "Ctrl"
      case "shift":
        return apple ? "⇧" : "Shift"
      case "alt":
        return apple ? "⌥" : "Alt"
      case "escape":
        return "Esc"
      default:
        return part.length === 1 ? part.toUpperCase() : part
    }
  })
  return parts.join(apple ? "" : " ")
}

export const hotkeyById = (id: string) =>
  HOTKEYS.find((hotkey) => hotkey.id === id)
```

**Rules:** every new shortcut is added here first (id + description + scope), then bound with
`useHotkey("mod+k", handler)`. The ⌘K palette renders this list under "Keyboard shortcuts", and
`content/docs/kit/keyboard.mdx` prints it, so the documentation cannot drift.

### 4.7 `lib/toast.ts` — brand toasts

```ts
"use client"

import { toast } from "sonner"

/**
 * Brand-consistent toasts. Product code calls `notify.*`, never `toast.*` directly,
 * so copy and styling stay uniform (and can be re-branded in one place).
 */
export const notify = {
  copied: (what = "Copied") =>
    toast(what, { description: "In your clipboard." }),
  saved: (what = "Saved") => toast.success(what),
  created: (what: string) => toast.success(`${what} created`),
  deleted: (what: string) => toast.success(`${what} deleted`),
  info: (message: string) => toast(message),
  loading: (message: string) => toast.loading(message),
  invalid: (message: string) =>
    toast.error("That didn't work", { description: message }),
  failed: (message: string) =>
    toast.error("Something went wrong", { description: message }),
  dismiss: toast.dismiss,
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => toast.promise(promise, messages),
}
```

### 4.8 Contracted modules

| Module              | API                                                                                                                                       | Notes                                                                                                 |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| `lib/format.ts`     | `formatDate(date, locale?)`, `formatRelativeTime(date)`, `formatNumber(n)`, `formatBytes(n)`, `formatCompact(n)`                          | Keep `Intl.*` inside; components must never call `Intl` directly, so locale strategy stays changeable |
| `lib/validators.ts` | zod schemas shared by client forms and route handlers: `emailSchema`, `slugSchema`, `urlSchema`, `paginationSchema`, plus product schemas | One schema, two consumers — this is why `zod` is already a dependency (Fumadocs)                      |
| `lib/csp.mjs`       | `buildCsp({ extraConnect?, extraScript?, extraFrame? })`                                                                                  | Main spec §21.5                                                                                       |
| `lib/string.ts`     | `slugify`, `truncate`, `initials`                                                                                                         | Optional; add when a product needs it                                                                 |

---

## 5. Hooks

### 5.1 `hooks/use-hotkey.ts` — the engine for `lib/hotkeys.ts`

```ts
"use client"

import { useEffect } from "react"

function parseCombo(keys: string) {
  const parts = keys
    .toLowerCase()
    .split("+")
    .map((part) => part.trim())
  return {
    key: parts[parts.length - 1],
    mod: parts.includes("mod"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
  }
}

/** Shared guard: never hijack keys while the user is typing. */
export function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

export interface UseHotkeyOptions {
  enabled?: boolean
  /** Call event.preventDefault() — required for "/" and "mod+k". */
  preventDefault?: boolean
}

/**
 * Bind a single shortcut, e.g. useHotkey("mod+k", () => setOpen(true)).
 * Keys are registered in lib/hotkeys.ts first so documentation cannot drift.
 */
export function useHotkey(
  keys: string,
  handler: (event: KeyboardEvent) => void,
  options: UseHotkeyOptions = {}
) {
  const { enabled = true, preventDefault = false } = options

  useEffect(() => {
    if (!enabled) return

    const combo = parseCombo(keys)

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (isTypingTarget(event.target)) return
      if (combo.mod !== (event.metaKey || event.ctrlKey)) return
      if (combo.shift !== event.shiftKey) return
      if (combo.alt !== event.altKey) return
      if (event.key.toLowerCase() !== combo.key) return

      if (preventDefault) event.preventDefault()
      handler(event)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [keys, handler, enabled, preventDefault])
}
```

> The reference implements these same guards three times (in `theme-provider.tsx`,
> `spatial-layout.tsx` and `command-menu.tsx`). **Do not rewrite them** — they are `[COPY]`
> fidelity. New shortcuts use this hook, and when you touch an old one, migrate it here.
>
> Both docs layouts bind `M` through this hook. Neither may add a raw `keydown` listener, and
> there is no `⌘B` — one key for the menu, never two that mean the same thing.
> See `components/docs/dispatch.tsx` and `components/docs/layouts/*`.

### 5.2 `hooks/use-media-query.ts` — extract the inline copy

```ts
"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)")
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)")
/** True on devices with a real pointer — the MinimalThemeSwitcher already probes this inline. */
export const useCanHover = () => useMediaQuery("(hover: hover)")
```

⚠️ `components/previewer/component-preview.tsx` exports its own `useMediaQuery`. That file is
otherwise `[COPY]` — this is the single allowed edit: delete the local implementation and
import this hook instead (keeps one behaviour for the whole app).

### 5.3 `hooks/use-mounted.ts`

```ts
"use client"

import { useEffect, useState } from "react"

/** SSR-safe mount flag. Every theme-dependent control needs this to avoid hydration drift. */
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
```

### 5.4 `hooks/use-copy.ts` — dedupe four hand-rolled implementations

```ts
"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { notify } from "@/lib/toast"

export interface UseCopyOptions {
  resetAfter?: number
  /** Fire the brand toast on success. */
  toast?: boolean
  label?: string
}

/** Clipboard + "copied" state (CommandBlock, CodeBlock, CopyMdxButton all roll their own today). */
export function useCopy({
  resetAfter = 2000,
  toast = false,
  label = "Copied",
}: UseCopyOptions = {}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  const copy = useCallback(
    async (text: string) => {
      if (!text) return false
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        return false
      }
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), resetAfter)
      if (toast) notify.copied(label)
      return true
    },
    [resetAfter, toast, label]
  )

  return { copied, copy }
}
```

### 5.5 Contracted hooks

| Hook                 | Signature                                                                                                                            | Notes                                                                                                                                |
| :------------------- | :----------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `use-local-storage`  | `useLocalStorage<T>(key: string, initial: T) => [T, (v: T \| ((p: T) => T)) => void]`                                                | JSON-serialised, `"use client"`, read inside `useEffect` (never during render) to stay SSR-safe. Prefix keys with the product slug.  |
| `use-debounce`       | `useDebounce<T>(value: T, delay = 300) => T`                                                                                         | For search inputs and autosave. Pair with `use-copy`-style cleanup.                                                                  |
| `use-in-view`        | `useInView<T extends Element>(options?: IntersectionObserverInit) => [ref, inView]`                                                  | Scroll reveals. **Must** no-op when `prefers-reduced-motion` is set — check via `useMediaQuery("(prefers-reduced-motion: reduce)")`. |
| `use-event-listener` | `useEventListener<K extends keyof WindowEventMap>(type: K, handler: (e: WindowEventMap[K]) => void, target?: Window \| HTMLElement)` | Typed wrapper; use instead of raw `addEventListener` in components.                                                                  |

---

## 6. Layout primitives

### 6.1 `components/layout/container.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const SIZES = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[1440px]",
  full: "max-w-none",
} as const

export interface ContainerProps extends React.ComponentProps<"div"> {
  size?: keyof typeof SIZES
}

/** The one horizontal rhythm. Replaces ad-hoc `container mx-auto px-8 lg:px-16 xl:px-64`. */
export function Container({
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-16",
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

### 6.2 `components/layout/surface.tsx`

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const surfaceVariants = cva("rounded-3xl border border-border", {
  variants: {
    variant: {
      solid: "bg-card",
      muted: "bg-muted",
      glass: "bg-background/70 backdrop-blur",
      dashed: "border-dashed bg-transparent",
    },
    padding: { none: "", sm: "p-4", md: "p-6", lg: "p-8" },
    interactive: {
      true: "transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
      false: "",
    },
  },
  defaultVariants: { variant: "solid", padding: "md", interactive: false },
})

export interface SurfaceProps
  extends React.ComponentProps<"div">, VariantProps<typeof surfaceVariants> {}

/** The repeated `rounded-3xl border bg-card` recipe, as a component. */
export function Surface({
  variant,
  padding,
  interactive,
  className,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        surfaceVariants({ variant, padding, interactive }),
        className
      )}
      {...props}
    />
  )
}

export { surfaceVariants }
```

### 6.3 `components/layout/page-header.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export interface PageHeaderProps {
  title: string
  description?: string
  /** Breadcrumbs or an eyebrow line rendered above the title. */
  above?: React.ReactNode
  /** Status pill / badge next to the title. */
  badge?: React.ReactNode
  /** Buttons on the right (ActionButton, CommandMenuTrigger, …). */
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  above,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      {above}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-h2 font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {badge}
          </div>
          {description ? (
            <p className="max-w-2xl text-balance text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  )
}
```

### 6.4 `components/layout/section.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("flex flex-col gap-6 py-12 md:py-16", className)}
      {...props}
    >
      {children}
    </section>
  )
}

export interface SectionHeadingProps extends React.ComponentProps<"h2"> {
  description?: string
  /** Anchor id — also used by the docs TOC when a section appears in MDX. */
  id?: string
}

export function SectionHeading({
  id,
  title,
  description,
  className,
  children,
  ...props
}: SectionHeadingProps & { title?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2
        id={id}
        className={cn(
          "scroll-m-20 font-heading text-h4 font-bold text-foreground",
          className
        )}
        {...props}
      >
        {children ?? title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
```

### 6.5 `components/layout/app-nav.tsx`

```tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"

import type { NavItem } from "@/lib/nav"
import { SPRING } from "@/lib/motion"
import { cn } from "@/lib/utils"

export interface AppNavProps {
  items: NavItem[]
  orientation?: "vertical" | "horizontal"
  /** Close the mobile drawer after navigating. */
  onNavigate?: () => void
  className?: string
}

type IconProp = React.ComponentProps<typeof HugeiconsIcon>["icon"]

export function AppNav({
  items,
  orientation = "vertical",
  onNavigate,
  className,
}: AppNavProps) {
  const pathname = usePathname()
  const isVertical = orientation === "vertical"

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex gap-1",
        isVertical ? "flex-col" : "flex-row items-center",
        className
      )}
    >
      {items.map((item) => {
        const isActive =
          !item.external &&
          (pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href)))

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-2 rounded-[12px] px-3 py-2 text-sm font-medium transition-colors",
              "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive ? (
              <motion.span
                layoutId={`app-nav-active-${orientation}`}
                className="absolute inset-0 -z-10 rounded-[12px] bg-muted"
                transition={SPRING.pill}
              />
            ) : null}

            {item.icon ? (
              <HugeiconsIcon
                icon={item.icon as IconProp}
                className="size-4 shrink-0"
              />
            ) : null}
            <span className="truncate">{item.label}</span>

            {item.badge ? (
              <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                {item.badge}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
```

> `layoutId` is per-orientation so a product can render the rail **and** the mobile drawer at
> the same time without the pill flying between them.

### 6.6 `components/layout/app-shell.tsx`

The shell every product page lives in: sticky header, optional collapsible rail, content.
It is deliberately **not** the docs shell — docs keep `SpatialLayout`/`StandardLayout` (v1 §8).

```tsx
"use client"

import * as React from "react"
import { motion } from "motion/react"

import { Container } from "@/components/layout/container"
import { useHotkey } from "@/hooks/use-hotkey"
import { useIsDesktop } from "@/hooks/use-media-query"
import { SPRING } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/store/use-sidebar-store"

export interface AppShellProps {
  children: React.ReactNode
  /** Top bar — pass <SiteHeader /> or a product-specific bar. */
  header?: React.ReactNode
  /** Left rail — usually <AppNav items={APP_NAV} />. */
  rail?: React.ReactNode
  railWidth?: number
  size?: "narrow" | "default" | "wide" | "full"
  /** Wrap children in <Container>. Set false when the child owns its own layout (tools). */
  contained?: boolean
  className?: string
}

export function AppShell({
  children,
  header,
  rail,
  railWidth = 280,
  size = "default",
  contained = true,
  className,
}: AppShellProps) {
  const { isOpen, toggleSidebar } = useSidebarStore()
  const isDesktop = useIsDesktop()
  const hasRail = Boolean(rail)

  const offset = hasRail && isDesktop && isOpen ? railWidth : 0

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col bg-background",
        className
      )}
    >
      {header}

      <div className="flex flex-1">
        {hasRail ? (
          <>
            {/* Desktop rail — GPU transform only, same spring as the docs card */}
            <motion.aside
              initial={false}
              animate={{ x: isOpen ? 0 : -railWidth }}
              transition={SPRING.card}
              style={{ willChange: "transform", width: railWidth }}
              data-rail-open={isOpen}
              className="fixed inset-y-16 left-0 z-30 hidden shrink-0 overflow-y-auto border-r border-border bg-background p-4 lg:block"
            >
              {rail}
            </motion.aside>

            {/* Mobile drawer + scrim */}
            <div
              onClick={() => isOpen && toggleSidebar()}
              aria-hidden="true"
              className={cn(
                "fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm transition-opacity lg:hidden",
                isOpen ? "opacity-100" : "pointer-events-none opacity-0"
              )}
            />
            <motion.aside
              initial={false}
              animate={{ x: isOpen ? 0 : -railWidth }}
              transition={SPRING.card}
              style={{ width: railWidth }}
              data-rail-open={isOpen}
              className="fixed inset-y-0 left-0 z-40 overflow-y-auto border-r border-border bg-background p-4 lg:hidden"
            >
              {rail}
            </motion.aside>
          </>
        ) : null}

        <main
          className="min-w-0 flex-1 transition-[padding] duration-300 ease-out"
          style={{ paddingLeft: offset }}
        >
          {contained ? (
            <Container size={size} className="py-8">
              {children}
            </Container>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
```

Notes:

- The rail reuses `useSidebarStore` and the same spring as the docs card, so the whole family
  feels identical. `data-rail-open` is there for tests and for CSS that needs to react to state.
- `useIsDesktop()` (not a media-query class) decides the content offset, because inline padding
  cannot be expressed responsively in Tailwind. It resolves on mount, so there is no layout jump
  after hydration — but do not use `AppShell` for above-the-fold hero content that must be
  perfectly static in SSR HTML.
- For a tool that owns the viewport (Tweak, Typeset), pass `contained={false}` + `WorkbenchShell`.

---

## 7. Shells & panels

### 7.1 `components/layout/site-header.tsx` (+ mobile nav)

```bash
pnpm dlx shadcn@latest add sheet   # required by the mobile drawer below (main spec §3.5)
```

```tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useState } from "react"
import { Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { MinimalThemeSwitcher } from "@/components/home/minimal-theme-switcher"
import { AppNav } from "@/components/layout/app-nav"
import { CommandMenuTrigger } from "@/components/layout/command-menu"
import { SatisiumLogo } from "@/components/satisium-logo"
import { ActionButton } from "@/components/ui/action-button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PRODUCT } from "@/lib/config"
import { APP_NAV } from "@/lib/nav"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

export interface SiteHeaderProps {
  sticky?: boolean
  /** Right-hand call to action; set null to hide. */
  cta?: React.ReactNode
  className?: string
}

export function SiteHeader({ sticky = true, cta, className }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        "z-40 flex h-16 w-full shrink-0 items-center border-b border-border bg-background/80 backdrop-blur",
        sticky && "sticky top-0",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3 px-6 sm:px-8 lg:px-16">
        {/* Brand */}
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
        >
          <span className="flex size-7 items-center justify-center">
            <SatisiumLogo size="100%" />
          </span>
          <span className="font-heading text-base font-bold tracking-tight text-foreground">
            {PRODUCT.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <AppNav
          items={APP_NAV}
          orientation="horizontal"
          className="ml-4 hidden lg:flex"
        />

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2">
          <CommandMenuTrigger />
          <MinimalThemeSwitcher />
          {cta ?? (
            <ActionButton
              label="Open app"
              href={ROUTES.app}
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            />
          )}

          {/* Mobile drawer */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open navigation"
              className="flex size-10 items-center justify-center rounded-[14px] text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none lg:hidden"
            >
              <HugeiconsIcon icon={Menu01Icon} className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left">{PRODUCT.name}</SheetTitle>
              </SheetHeader>
              <AppNav items={APP_NAV} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
```

### 7.2 `components/layout/workbench-shell.tsx` — the tool layout

Tweak, Typeset and any inspector-style product need the same three panes. The reference ships
`react-resizable-panels` **for the previewer only**; this generalises it.

```tsx
"use client"

import * as React from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { cn } from "@/lib/utils"

export interface WorkbenchShellProps {
  /** The canvas / tool itself. */
  children: React.ReactNode
  controls?: React.ReactNode
  inspector?: React.ReactNode
  /** Layout id persisted by react-resizable-panels (`autoSaveId`). */
  storageKey?: string
  defaultControlsSize?: number
  defaultInspectorSize?: number
  className?: string
  canvasClassName?: string
}

export function WorkbenchShell({
  children,
  controls,
  inspector,
  storageKey = "workbench-layout",
  defaultControlsSize = 22,
  defaultInspectorSize = 24,
  className,
  canvasClassName,
}: WorkbenchShellProps) {
  const canvasSize =
    controls && inspector
      ? 100 - defaultControlsSize - defaultInspectorSize
      : 60

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      id={storageKey}
      className={cn(
        "h-[calc(100vh-4rem)] w-full border-t border-border",
        className
      )}
    >
      {controls ? (
        <>
          <ResizablePanel
            defaultSize={defaultControlsSize}
            minSize={16}
            maxSize={36}
            className="min-w-0"
          >
            <div className="h-full overflow-y-auto border-r border-border p-4">
              {controls}
            </div>
          </ResizablePanel>
          <ResizableHandle />
        </>
      ) : null}

      <ResizablePanel
        defaultSize={canvasSize}
        minSize={30}
        className={cn("min-w-0", canvasClassName)}
      >
        <div className="h-full overflow-auto">{children}</div>
      </ResizablePanel>

      {inspector ? (
        <>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={defaultInspectorSize}
            minSize={16}
            maxSize={40}
            className="min-w-0"
          >
            <div className="h-full overflow-y-auto border-l border-border p-4">
              {inspector}
            </div>
          </ResizablePanel>
        </>
      ) : null}
    </ResizablePanelGroup>
  )
}
```

Notes:

- `autoSaveId` gives you the reference's persisted-layout behaviour for free (panel sizes survive
  reloads, exactly like `satisium-preview-width` does for the previewer).
- Both side panels are optional; with only `inspector` the canvas takes 60%.
- Composing this with `AppShell` (header + rail + `contained={false}` + `WorkbenchShell`)
  produces the full Tweak/Typeset workspace.
- Verify your shadcn `resizable` export names — some versions expose `ResizableHandle` with an
  optional grip (`withHandle`); use it if present for a visible drag affordance.

### 7.3 `components/layout/sticky-aside.tsx`

Extracted from the docs page, which currently inlines this exact wrapper
(`sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar lg:block`):

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

/** Sticky right column (docs TOC, table of contents of a blog post, inspector summary). */
export function StickyAside({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <aside
      className={cn(
        "sticky top-24 no-scrollbar hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block",
        className
      )}
    >
      {children}
    </aside>
  )
}
```

---

## 8. States & feedback

### 8.1 `components/ui/empty-state.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  secondaryAction?: React.ReactNode
  /** "dashed" is the canvas placeholder look used at /app and in previews. */
  variant?: "plain" | "dashed"
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "plain",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
        variant === "dashed" &&
          "rounded-3xl border border-dashed border-border",
        className
      )}
    >
      {icon ? (
        <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground [&_svg]:size-5">
          {icon}
        </span>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading text-h6 font-bold text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="max-w-sm text-sm text-balance text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {action || secondaryAction ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  )
}
```

Use three ways: **no data yet** (`EmptyState` + a primary ActionButton), **nothing selected**
(in the inspector of a tool), **not built yet** (replaces `components/coming-soon.tsx` on
catalog pages that are still empty).

### 8.2 `components/ui/loading-state.tsx` + `Spinner`

```tsx
import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/** Composes the shadcn skeleton (`pnpm dlx shadcn@latest add skeleton`). */
export function LoadingState({
  rows = 3,
  label = "Loading",
  className,
}: {
  rows?: number
  label?: string
  className?: string
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex w-full flex-col gap-3", className)}
    >
      <Skeleton className="h-8 w-1/3 rounded-2xl" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full rounded-full" />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-border border-t-primary motion-reduce:animate-none",
        className
      )}
    />
  )
}
```

`motion-reduce:animate-none` is deliberate — see `starter-template.md` §21.1.

### 8.3 `components/ui/error-state.tsx`

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface ErrorStateProps {
  title?: string
  description?: string
  /** Next.js error boundaries hand you `reset` — pass it straight through. */
  reset?: () => void
  actions?: React.ReactNode
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description,
  reset,
  actions,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading text-h6 font-bold text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="max-w-md text-sm text-balance text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {reset ? (
          <button
            onClick={reset}
            className="rounded-[12px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
          >
            Try again
          </button>
        ) : null}
        {actions}
      </div>
    </div>
  )
}
```

### 8.4 `components/error-boundary.tsx`

**Why this matters more than it looks:** a single broken registry component currently takes down
the whole docs page. Wrap every `ComponentPreviewer` demo (and any product subtree) in this.

```tsx
"use client"

import * as React from "react"

import { ErrorState } from "@/components/ui/error-state"
import { logger } from "@/lib/logger"

interface ErrorBoundaryProps {
  children: React.ReactNode
  /** Label appears in the log line, e.g. "preview:pulse-card". */
  label?: string
  fallback?: (error: Error, reset: () => void) => React.ReactNode
  onError?: (error: Error, info: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error(
      `[ErrorBoundary${this.props.label ? `:${this.props.label}` : ""}]`,
      error,
      info.componentStack
    )
    this.props.onError?.(error, info)
  }

  private reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    if (this.props.fallback) return this.props.fallback(error, this.reset)

    return (
      <ErrorState
        title="This section failed to render"
        description={error.message}
        reset={this.reset}
      />
    )
  }
}
```

### 8.5 `components/ui/toaster.tsx` + `lib/toast.ts`

```bash
pnpm dlx shadcn@latest add sonner
```

```tsx
"use client"

import { Toaster as Sonner } from "@/components/ui/sonner"

/** Mounted once in app/layout.tsx (§5.2). Brand-styled so toasts match the family. */
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-border bg-card text-foreground shadow-lg",
          description: "text-muted-foreground",
          actionButton: "rounded-[10px] bg-primary text-primary-foreground",
          cancelButton: "rounded-[10px] bg-muted text-muted-foreground",
        },
      }}
    />
  )
}
```

Product code calls `notify.saved()`, `notify.copied()`, `notify.failed(msg)` (kit §4.7).

> The reference hand-rolls "Copied!" states in `CommandBlock`, `CodeBlock`, `CopyMdxButton` and
> the previewer. **Keep those** (they are part of the feel) and use toasts for everything
> _new_: saves, deletes, exports, background jobs.

### 8.6 `components/ui/kbd.tsx`

```tsx
import * as React from "react"

import { formatHotkey, isApplePlatform } from "@/lib/hotkeys"
import { cn } from "@/lib/utils"

export function Kbd({
  className,
  children,
  ...props
}: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[6px] border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}

/** <KbdShortcut keys="mod+k" /> → ⌘K (Apple) / Ctrl K (elsewhere). */
export function KbdShortcut({
  keys,
  className,
}: {
  keys: string
  className?: string
}) {
  const apple = React.useMemo(() => isApplePlatform(), [])
  return <Kbd className={className}>{formatHotkey(keys, apple)}</Kbd>
}
```

### 8.7 Remaining state components (registry adds)

```bash
pnpm dlx shadcn@latest add alert progress
```

| Component            | Use it for                                                    |
| :------------------- | :------------------------------------------------------------ |
| `Alert`              | Inline, non-blocking warnings ("your draft is not published") |
| `Progress`           | Determinate jobs (uploads, exports)                           |
| `Spinner` (kit §8.2) | Indeterminate, inside buttons                                 |
| `LoadingState`       | Page/section level, paired with `loading.tsx`                 |

---

## 9. Data display

### 9.1 `components/ui/description-list.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export interface DescriptionItem {
  term: React.ReactNode
  description: React.ReactNode
}

/** Key/value details — settings summaries, build info, component metadata. */
export function DescriptionList({
  items,
  className,
}: {
  items: DescriptionItem[]
  className?: string
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-8 gap-y-4 sm:grid-cols-[minmax(0,180px)_1fr]",
        className
      )}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <dt className="text-sm font-medium text-muted-foreground">
            {item.term}
          </dt>
          <dd className="min-w-0 text-sm text-foreground">
            {item.description}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  )
}
```

### 9.2 `components/ui/stat-card.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export interface StatCardProps {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  trend?: { value: number; label?: string }
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  hint,
  trend,
  icon,
  className,
}: StatCardProps) {
  const isUp = (trend?.value ?? 0) >= 0

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3xl border border-border bg-card p-6",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-caption font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        {icon}
      </div>

      <div className="flex items-end gap-2">
        <span className="font-heading text-h3 font-bold text-foreground">
          {value}
        </span>
        {trend ? (
          <span
            className={cn(
              "pb-1 text-caption font-medium",
              isUp ? "text-emerald-500" : "text-rose-500"
            )}
          >
            {isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
            {trend.label ? ` ${trend.label}` : ""}
          </span>
        ) : null}
      </div>

      {hint ? (
        <span className="text-caption text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  )
}
```

### 9.3–9.5 Contracted components

| Component    | Adds needed                                              | Contract                                                                                                                                                                                                                                            |
| :----------- | :------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DataTable`  | `shadcn add table` + `@tanstack/react-table` when needed | Keep the shadcn `Table` primitives as the base; add sorting/pagination _in the product_, not the starter. Server components render rows; interactive headers live in a small client wrapper. Empty result → `EmptyState`; loading → `LoadingState`. |
| `Timeline`   | none                                                     | `items: { date: string; title: string; description?: string; badge?: string }[]`; renders a vertical rail with `border-l border-border` and dots. Used by `/docs/changelog` (feeds from `CHANGELOG.md`, main spec §14.4).                           |
| `Pagination` | `shadcn add pagination`                                  | `page`, `pageCount`, `onPageChange` or `hrefFor(page)`. Prefer real links (crawlable) over buttons.                                                                                                                                                 |
| Charts       | `recharts` or `visx` (product decision)                  | Tokens `--chart-1…5` already exist and are brand-tuned. **Do not** add a chart library to the starter until a product needs one (§22 backlog).                                                                                                      |

---

## 10. MDX components

Register everything here in `components/mdx-components.tsx` (v1 §9.6) so any docs page can use it.

### 10.1 `components/mdx/steps.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export function Steps({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "mt-6 mb-8 flex flex-col gap-6 [counter-reset:step]",
        className
      )}
    >
      {children}
    </div>
  )
}

export function Step({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "relative flex gap-4 [counter-increment:step] [&:last-child_.connector]:hidden",
        className
      )}
    >
      <div className="flex flex-col items-center">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-mono text-[11px] font-bold text-foreground before:content-[counter(step)]" />
        <span
          aria-hidden="true"
          className="connector mt-2 w-px flex-1 bg-border"
        />
      </div>

      <div className="min-w-0 flex-1 pb-2">
        <p className="font-heading font-bold text-foreground">{title}</p>
        {children ? (
          <div className="mt-1 text-muted-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}
```

### 10.2 `components/mdx/prompt-block.tsx`

The family is built with AI agents — a copy-ready prompt block is a first-class docs primitive
("paste this into your agent").

```tsx
"use client"

import * as React from "react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useCopy } from "@/hooks/use-copy"
import { cn } from "@/lib/utils"

export function PromptBlock({
  title = "Prompt",
  prompt,
  className,
}: {
  title?: string
  prompt: string
  className?: string
}) {
  const { copied, copy } = useCopy()

  return (
    <div
      className={cn(
        "mt-6 overflow-hidden rounded-3xl border border-border bg-muted",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <span className="font-mono text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
          {title}
        </span>
        <button
          onClick={() => copy(prompt)}
          aria-label="Copy prompt"
          className="flex size-7 items-center justify-center rounded-[8px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            className="size-3.5"
          />
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-foreground">
        {prompt}
      </pre>
    </div>
  )
}
```

Usage: `<PromptBlock title="Refactor prompt" prompt="Read component-kit.md §2 …" />`

### 10.3 Tabs + Accordion

```bash
pnpm dlx shadcn@latest add accordion
```

Then extend the export list in `components/mdx-components.tsx`:

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Steps, Step } from "./mdx/steps"
import { PromptBlock } from "./mdx/prompt-block"
import { FileTree } from "./mdx/file-tree"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// …inside defaultMdxComponents, next to CodeBlock / CommandBlock / Callout:
  Steps, Step, PromptBlock, FileTree,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
```

`Tabs` reuses the existing `components/ui/tabs.tsx` (`[COPY]` from the reference) — no new code.

### 10.4 `components/mdx/file-tree.tsx` — contract

```tsx
export interface FileTreeProps {
  /** Path → optional comment. Nested folders are inferred from "/". */
  files: Record<string, string | undefined>
  className?: string
}
export function FileTree({ files, className }: FileTreeProps) {
  /* … */
}
```

Implementation notes: reuse `buildTree()` from `components/code-block/tree-utils.ts` and
`getIconForFile()` from `components/code-block/sidebar.tsx` — do **not** write a second tree
renderer. Render as a flat list with `BASE_PADDING`/`DEPTH_OFFSET` indentation (the same
constants the code block uses) so a folder in MDX looks identical to a folder in a code block.

---

## 11. Marketing blocks

Contracts only — build them when a product needs them, but agree the API up front so the
landing page never becomes a one-off.

| Component      | Path                                     | Props                                                                                                    | Notes                                                                        |
| :------------- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `FeatureGrid`  | `components/marketing/feature-grid.tsx`  | `{ items: { icon?: ReactNode; title: string; description: string; href?: string }[]; columns?: 2 \| 3 }` | Cards are `Surface interactive`; icons are Hugeicons                         |
| `FaqSection`   | `components/marketing/faq-section.tsx`   | `{ items: { question: string; answer: ReactNode }[] }`                                                   | Wraps the shadcn `Accordion`; emit `FAQPage` JSON-LD                         |
| `CtaSection`   | `components/marketing/cta-section.tsx`   | `{ title: string; description?: string; primary: { label: string; href: string }; secondary?: … }`       | Uses `ActionButton`, never a raw button                                      |
| `LogoCloud`    | `components/marketing/logo-cloud.tsx`    | `{ logos: { src: string; alt: string; href?: string }[] }`                                               | Greyscale + hover-to-color                                                   |
| `Testimonials` | `components/marketing/testimonials.tsx`  | `{ items: { quote: string; name: string; role?: string; avatar?: string }[] }`                           | `font-caveat` for the quote is on-brand; keep it to short quotes             |
| `PricingTable` | `components/marketing/pricing-table.tsx` | `{ tiers: Tier[]; highlight?: string }`                                                                  | Data-only: **no** billing integration (backlog §22)                          |
| `WaitlistForm` | `components/marketing/waitlist-form.tsx` | `{ action: (email: string) => Promise<void> }`                                                           | Client component + `zod` email schema; success/error via `notify` (kit §4.7) |

All marketing sections use `<Section>` + `<Container>` (kit §6) and are server components by
default — only the forms take `"use client"`.

---

## 12. Docs-side additions

### 12.1 Extractions (`⚠️ refactor`)

The docs page (`app/docs/[[...slug]]/page.tsx`) currently inlines three things that belong in
the kit — extract **after** v1 §9.5 is working, in one commit:

| Extract       | From (docs page)                                  | Becomes                             |
| :------------ | :------------------------------------------------ | :---------------------------------- |
| Title block   | `<h1>` + badge pill + description + last-modified | `components/layout/docs-header.tsx` |
| Prev/next nav | the `findNeighbour` `<nav>`                       | `components/layout/docs-pager.tsx`  |
| Right column  | the sticky `<aside>`                              | `StickyAside` (kit §7.3)            |

Keep the page's `generateMetadata`, `Promise.all` data loading, `ComponentPreviewer` mount, JSON-LD
and grid switch exactly as v1 specifies — extraction must be a pure refactor with no visual diff.

### 12.2 `components/layout/edit-on-github.tsx`

**Verified missing from the reference** (no `blob/main` reference anywhere), and every docs site
needs it.

```tsx
import { Link04Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { REPO } from "@/lib/social-links"
import { cn } from "@/lib/utils"

/** `path` is the MDX path inside content/docs, e.g. "getting-started/installation.mdx". */
export function EditOnGitHub({
  path,
  className,
}: {
  path: string
  className?: string
}) {
  const href = `https://github.com/${REPO}/blob/main/content/docs/${path}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 text-caption text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none",
        className
      )}
    >
      <HugeiconsIcon icon={Link04Icon} className="size-3.5" />
      Edit this page on GitHub
    </a>
  )
}
```

Mount it in `docs-header.tsx` next to the last-modified line. It requires a public repo — if the
product repo is private, keep it (visitors without access get GitHub's 404, which is acceptable)
or gate it on an env flag.

### 12.3–12.4 Contracted

| Component         | Props                                                              | Notes                                                                                                                                                           |
| :---------------- | :----------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocsFeedback`    | `{ pageId: string; onVote: (v: "up" \| "down") => Promise<void> }` | "Was this helpful?" — fires `doc_feedback` (§18.6). Ship it only when you have somewhere to read the data (PostHog is enough)                                   |
| `VersionSwitcher` | `{ versions: { label: string; href: string }[]; current: string }` | Only for versioned docs. Versioning strategy: `content/docs/v1/**` + a rewrite in `next.config.mjs`. Do **not** build it before a product has two live versions |

---

## 13. Build order for this kit

Do not build the whole kit up front. Four batches, each ending in a green `pnpm verify`:

| Batch                  | Contents                                                                                                                          | Unblocks                                                           |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| **A — Foundations**    | `lib/routes.ts`, `lib/nav.ts`, `lib/env.ts`, `lib/metadata.ts`, `lib/motion.ts`, `lib/hotkeys.ts`, `lib/toast.ts`, hooks §5.1–5.4 | Everything else; also removes hardcoded hrefs from v1's landing    |
| **B — Shell**          | `Container`, `Surface`, `PageHeader`, `Section`, `AppNav`, `AppShell`, `SiteHeader`, `WorkbenchShell`, `StickyAside`              | Any product page; Tweak/Typeset can start                          |
| **C — States**         | `EmptyState`, `LoadingState`, `Spinner`, `ErrorState`, `ErrorBoundary`, `Toaster`, `Kbd`, `Alert`, `Progress`, `Skeleton`         | Loading/error UX everywhere; previews can no longer crash the docs |
| **D — Content & data** | MDX §10 (Steps, PromptBlock, Tabs, Accordion, FileTree), `DescriptionList`, `StatCard`, `EditOnGitHub`, docs extractions §12.1    | Docs polish and catalogue pages                                    |

Marketing blocks (§11) and `DataTable`/`Timeline`/`Pagination` (§9.3–9.5) stay in the backlog
until a product pulls them in — that is the whole point of the split.
