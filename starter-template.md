# Satisium Starter — Master Build Specification

> **What this document is**
> The single source of truth for creating the **Satisium Starter** — a brand-aligned,
> general-purpose **App + Docs** starter template for the Satisium family
> (Satisium Pro UI, Tweak, Typeset, and any future internal tool or SaaS product).
>
> **How to use it**
>
> 1. Create an **empty, brand-new repository** (working name: `starter-template`). Never build inside the reference repo.
> 2. Open the new repo with an AI coding agent and say:
>    _"Read starter-template.md and build this project phase by phase, in order. Do not skip phases."_
> 3. Build **Phase 0 → Phase 16**. Each phase lists its files, exact sources, and a validation step.
> 4. Finish with the acceptance checklist in §16, then the phase validations in §18–§21.
>
> **Three documents, three jobs.**
>
> - `BUILD.md` — the **execution runbook**: session protocol, copy-paste prompts, checkpoints
>   (C1–C6), human-only tasks and troubleshooting. Read it first, then load only the spec sections
>   your current session needs.
> - `starter-template.md` (this file) — the shell: build order (Phases 0–16), configs, brand layer,
>   docs engine, registry, SEO, analytics, consent, tooling, testing, quality, module contract and
>   presets.
> - `component-kit.md` — the **template component library**: the ~55 components, ~10 hooks and
>   ~15 `lib` modules the app itself is assembled from, with full source.
>
> A complete build needs all three.
>
> **Reference implementation (READ-ONLY):** `/home/satishkumar/Desktop/ui-satis`
> Every `[COPY]` instruction points into that folder. **Never modify it.**

---

## 0. Tags used in this document

| Tag              | Meaning                                                               |
| :--------------- | :-------------------------------------------------------------------- |
| `[COPY]`         | Copy the file **verbatim** from the reference repo.                   |
| `[COPY + ADAPT]` | Copy, then apply only the listed edits (brand strings, URLs, config). |
| `[NEW]`          | Write from scratch following the code/spec in this document.          |
| `[OPTIONAL]`     | Not required for the base template; documented for later extension.   |
| `[EXCLUDE]`      | Deliberately **not** part of the starter.                             |

---

## 1. Mandate

### 1.1 What the Satisium Starter is

A general-purpose, on-brand **App + Docs** starter. Clone it, run `pnpm dev`, and you can immediately build:

- Internal tools
- SaaS web apps
- Design-engineer tools (e.g. **Tweak** — a Tweakpane-style control panel for shadcn; **Typeset** — a type-scale system builder for shadcn + MDX)
- Paid asset platforms (e.g. **Satisium Pro UI** — paid components, blocks, templates)

### 1.2 What ships in it

1. **Exact Satisium identity** — OKLCH tokens, the 4-font system, `SatisiumLogo`, `ActionButton`, `MinimalThemeSwitcher`, `Annotation`, and view-transition theme switching.
2. **App space** — Minimalist Hero + Launchpad at `/`, plus a clean tool canvas at `/app`.
3. **Docs space** — Fumadocs MDX with **two layouts**: `SpatialLayout` (the signature card-shift shell) and `ThreePaneLayout` (borderless sidebar | article | optional rail). The developer picks one; visitors cannot switch it.
4. **Registry + Previewer engine** — direct/iframe rendering, resizable playground, fullscreen preview, and a `shadcn` CLI distribution pipeline (`public/r/*.json`).
5. **AI/LLM discovery** — `llms.txt`, `llms-full.txt`, Copy-MD button, LLM `<link>` rels in `<head>`.
6. **SEO** — dynamic OG images (`next/og`), `sitemap.ts`, `robots.ts`, `manifest.ts`, JSON-LD.
7. **Release tooling** — Changesets, scaffolding scripts, security headers via `proxy.ts`.

### 1.3 Non-goals (deliberately excluded)

- ❌ No authentication, no database, no user accounts.
- ❌ No design-canvas / inspector kit (scrubbable numeric inputs, canvas grids, snap guides).
- ❌ No tool-state history engine (undo/redo), no export/share engine, and no product-specific Zustand stores beyond `use-sidebar-store` / `use-command-store`.
- ❌ No library-specific assets: the 54 motion registry components, `component-card/*` grids, `kinetic-halo-ring`, teaser-video CTA, `mobile-restriction-warning`, `viewport-blocker`.
- ❌ No heavy 3D dependency (`three`, `@react-three/*`) and no analytics/telemetry stack in the base build. Analytics is `[OPTIONAL]` (§15).

### 1.4 Two hard rules

1. **Every file stays general.** No copy may reference "Satisium UI" as a component library, the 54-component count, or `ui.satisium.com` install commands. All brand strings come from `lib/config.ts` and `lib/social-links.ts`.
2. **One place to configure everything.** Site name, tagline, URLs, socials, docs layout choice, and feature flags live in `lib/config.ts` + `lib/social-links.ts`.

---

## 2. Final Directory Blueprint

```
starter-template/
├─ app/
│  ├─ app/page.tsx                     [NEW]        Tool canvas host (route: /app)
│  ├─ docs/
│  │  ├─ layout.tsx                    [COPY+ADAPT] Picks ThreePaneLayout | SpatialLayout
│  │  └─ [[...slug]]/page.tsx          [COPY+ADAPT] Dynamic MDX doc renderer
│  ├─ embed/[registryKey]/page.tsx     [COPY]       Isolated iframe renderer
│  ├─ preview/[registryKey]/page.tsx   [COPY+ADAPT] Fullscreen standalone preview
│  ├─ api/
│  │  ├─ og/route.tsx                  [COPY+ADAPT] Dynamic OG image (next/og)
│  │  └─ search/route.ts               [COPY+ADAPT] Fumadocs search endpoint
│  ├─ globals.css                      [COPY+ADAPT] Exact OKLCH tokens + typography
│  ├─ layout.tsx                       [COPY+ADAPT] Fonts, ThemeProvider, Metadata
│  ├─ page.tsx                         [NEW]        Minimalist Hero + Launchpad
│  ├─ error.tsx / global-error.tsx     [COPY+ADAPT]
│  ├─ not-found.tsx                    [COPY+ADAPT]
│  ├─ sitemap.ts / robots.ts           [COPY+ADAPT]
│  ├─ manifest.ts                      [COPY+ADAPT]
│  ├─ icon.svg / apple-icon.png / favicon.ico   [REPLACE]  Satisium marks
├─ components/
│  ├─ satisium-logo.tsx                [COPY]
│  ├─ icons.tsx                        [COPY]       npm/pnpm/yarn/bun/GitHub marks
│  ├─ command-block.tsx                [COPY+ADAPT] PM-tabbed CLI box
│  ├─ coming-soon.tsx                  [COPY+ADAPT]
│  ├─ theme-provider.tsx               [COPY]
│  ├─ mdx-components.tsx               [COPY+ADAPT]
│  ├─ layout/
│  │  ├─ docs/                                      Docs shell: contract, dispatch, layouts
│  │  ├─ sidebar-content.tsx           [COPY+ADAPT] Page-tree nav + badges
│  │  ├─ sidebar-footer.tsx            [COPY+ADAPT] Theme switcher + socials
│  │  ├─ toc.tsx                       [COPY]       Liquid scroll-spy TOC
│  │  ├─ page-breadcrumbs.tsx          [COPY]
│  │  └─ command-menu.tsx              [COPY+ADAPT] ⌘K palette
│  ├─ code-block/                      [COPY ×6]    code-block, code-display, sidebar,
│  │                                                 tree-utils, constants, types
│  ├─ previewer/                       [COPY ×7]    component-preview, resizable-playground,
│  │                                                 preview-toolbox, preview-background,
│  │                                                 fullscreen-toolbox, fullscreen-code-dialog,
│  │                                                 iframe-bridge-provider
│  ├─ home/
│  │  ├─ minimal-theme-switcher.tsx    [COPY]
│  │  ├─ annotation.tsx                [COPY]
│  │  ├─ explore-action-group.tsx      [COPY+ADAPT]
│  │  ├─ site-footer.tsx               [COPY+ADAPT]
│  │  └─ piano-typewriter.tsx          [COPY]       (optional hero headline)
│  └─ ui/                              [MIXED]      shadcn primitives + 2 custom (§4.3)
├─ content/docs/                       [NEW]        Starter docs tree
├─ registry/                           [NEW+PRUNE]  1–2 sample items (§10)
├─ hooks/use-scroll-spy.ts             [COPY]
├─ lib/                                [COPY+ADAPT]  config, social-links, utils, logger,
│                                                   theme-transition, source, docs-page
├─ store/                              [COPY]        index, use-command-store, use-sidebar-store
├─ scripts/                            [COPY+ADAPT] build-llms, build-registry-meta, create-doc
├─ public/                             [MIXED]      llms.txt, llms-full.txt, r/, fonts, OG assets
├─ .changeset/                         [NEW]        config.json + README.md
├─ components.json / next.config.mjs / source.config.ts / postcss.config.mjs /
│  eslint.config.mjs / tsconfig.json / .prettierrc / .prettierignore /
│  .env.example / .gitignore           [COPY+ADAPT] (§3, §4)
└─ proxy.ts                            [COPY+ADAPT] Security headers middleware
```

### 2.1 Route map

| Route                    | Purpose                                                         |
| :----------------------- | :-------------------------------------------------------------- |
| `/`                      | Minimalist Hero + Launchpad → links to the tool and the docs    |
| `/app`                   | The tool/canvas surface you build your product in               |
| `/docs` → `/docs/...`    | Fumadocs MDX documentation (Spatial _or_ Standard layout)       |
| `/preview/[registryKey]` | Fullscreen, chrome-free render of a registry item               |
| `/embed/[registryKey]`   | Isolated iframe render (auto theme sync via postMessage)        |
| `/api/og`                | Dynamic Open Graph image                                        |
| `/api/search`            | Fumadocs search endpoint                                        |
| `/r/[name].json`         | Static shadcn CLI registry payloads (generated into `public/r`) |

---

## 3. Tech Stack & Locked Dependencies

### 3.1 Create the repo

```bash
# from ~/Desktop (sibling of ui-satis, never inside it)
pnpm create next-app@latest starter-template \
  --ts --tailwind --eslint --app --no-src-dir \
  --import-alias "@/*" --use-pnpm
cd starter-template
```

Then **overwrite** the generated `package.json` / `tsconfig.json` / `components.json` /
`next.config.mjs` with §3.3 and §4 below, and run `pnpm install`.

### 3.2 package.json (final, verbatim)

```json
{
  "name": "starter-template",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "node scripts/build-llms.mjs && next build",
    "start": "next start",
    "analyze": "ANALYZE=true pnpm build",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx}\"",
    "registry:public": "npx shadcn build",
    "build:registry:meta": "node scripts/build-registry-meta.mjs",
    "make:doc": "node scripts/create-doc.mjs",
    "llm": "node scripts/build-llms.mjs",
    "changeset": "npx changeset",
    "release": "changeset version",
    "beta:enter": "changeset pre enter beta",
    "beta:exit": "changeset pre exit"
  },
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "@hugeicons/core-free-icons": "^4.1.1",
    "@hugeicons/react": "^1.1.6",
    "@next/third-parties": "^16.3.2",
    "@tailwindcss/typography": "^0.5.20",
    "@upstash/redis": "^1.37.0",
    "@vercel/analytics": "^2.0.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "fumadocs-core": "^16.7.10",
    "fumadocs-mdx": "^14.2.11",
    "gsap": "^3.15.0",
    "lucide-react": "^1.8.0",
    "motion": "^12.38.0",
    "next": "16.3.0",
    "next-themes": "^0.4.6",
    "posthog-js": "^1.404.1",
    "radix-ui": "^1.4.3",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-resizable-panels": "^4.9.0",
    "shadcn": "^4.1.2",
    "shiki": "^4.0.2",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0",
    "zod": "^4.3.6",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@changesets/cli": "^2.31.1",
    "@next/bundle-analyzer": "^16.3.0",
    "@tailwindcss/postcss": "^4.3.3",
    "@types/node": "^25.5.0",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.4",
    "eslint": "10.8.0",
    "eslint-config-next": "16.3.0",
    "postcss": "^8",
    "prettier": "^3.9.5",
    "prettier-plugin-tailwindcss": "^0.8.1",
    "tailwindcss": "^4.3.3",
    "typescript": "^5.9.3"
  },
  "packageManager": "pnpm@10.12.4",
  "pnpm": {
    "overrides": {
      "@types/react": "19.2.18",
      "@types/react-dom": "19.2.4"
    }
  }
}
```

> These versions are lifted **exactly** from the reference repo's `package.json`
> (Satisium UI `3.0.0-beta.62`) so the starter renders pixel-identically.

### 3.3 What each dependency is for

| Dependency                                                                 | Used by                                                                          |
| :------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| `next` / `react` / `react-dom`                                             | Framework (Next 16 App Router, React 19)                                         |
| `tailwindcss` + `@tailwindcss/postcss` + `tw-animate-css`                  | Tailwind v4 CSS-first styling & animation utilities                              |
| `@tailwindcss/typography`                                                  | `prose` styles inside MDX (CodeBlock sidebar docs)                               |
| `fumadocs-core`, `fumadocs-mdx`, `zod`                                     | Docs engine: `source.config.ts` schema, `pageTree`, search                       |
| `shiki`                                                                    | Syntax highlighting in `components/code-block`                                   |
| `radix-ui`, `cmdk`, `lucide-react`                                         | shadcn/Radix primitives, ⌘K palette, shadcn's default icons                      |
| `@hugeicons/react`, `@hugeicons/core-free-icons`                           | The Satisium icon set (used across every custom component)                       |
| `motion`, `gsap`, `@gsap/react`                                            | Animations (layout/enter transitions, scroll effects)                            |
| `zustand`                                                                  | `use-sidebar-store`, `use-command-store`                                         |
| `next-themes`                                                              | Dark/light/system with view-transition switching                                 |
| `react-resizable-panels`                                                   | Resizable preview playground splitters                                           |
| `class-variance-authority`, `clsx`, `tailwind-merge`                       | `cn()` + component variants                                                      |
| `shadcn` (CLI, installed)                                                  | `pnpm registry:public` → builds `public/r/*.json`                                |
| `posthog-js`, `@next/third-parties`, `@vercel/analytics`, `@upstash/redis` | Analytics + consent, GA4, web vitals, telemetry counters and rate limiting (§18) |
| `@changesets/cli`                                                          | Versioning + `CHANGELOG.md` generation                                           |
| `@next/bundle-analyzer`                                                    | `pnpm analyze`                                                                   |
| `eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss`  | Lint + format (Tailwind class sorting)                                           |

### 3.4 Deliberately NOT installed (vs. the reference repo)

| Package                                                            | Why excluded                                                                 |
| :----------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` | Only the (excluded) 3D registry components need them. Add per-product later. |
| `dompurify`                                                        | Not referenced anywhere in the reference repo — a leftover, not a feature.   |
| `rough-notation`                                                   | Used only by the excluded landing `intro-section` hand-drawn underline.      |
| `@eslint/eslintrc`                                                 | Unused with flat config.                                                     |

### 3.5 shadcn primitives — the exact commands

Run these **after Phase 0** (they need `components.json`, which Phase 0 writes).

```bash
# 1. Base primitives used by the brand layer and the previewer (§7, §10, §11)
pnpm dlx shadcn@latest add avatar badge button card command dialog input \
  input-group resizable scroll-area select separator tabs textarea tooltip

# 2. Additions the template kit requires (component-kit.md)
#    sheet     -> SiteHeader mobile nav (kit §7.1)
#    sonner    -> Toaster (kit §8.5)
#    skeleton  -> LoadingState (kit §8.2)
#    accordion -> MDX components (kit §10.3)
#    alert, progress -> states (kit §8.7)
pnpm dlx shadcn@latest add sheet sonner skeleton accordion alert progress

# 3. Optional — add only when a product needs them (kit §3.10, §9.3, §9.5)
# pnpm dlx shadcn@latest add table pagination popover dropdown-menu alert-dialog \
#   hover-card context-menu label checkbox switch slider radio-group toggle-group
```

**Rules**

- `components.json` pins `style: "radix-maia"` + `iconLibrary: "hugeicons"`, so every generated
  primitive imports from the unified `radix-ui` package (matching the reference). Never generate
  without those two settings.
- The CLI needs network (it fetches from the shadcn registry) and must write into
  `components/ui/` — §4.2 adapts that alias.
- Group 2 is **required**: `components/layout/site-header.tsx` (kit §7.1) will not compile without
  `sheet`, and `Toaster`/`LoadingState` need `sonner`/`skeleton`.
- Two files are **not** from the registry and must be copied from the reference:
  `components/ui/action-button.tsx` `[COPY]` and `components/ui/copy-mdx-button.tsx` `[COPY]`.

### 3.6 Dependency install (one shot, matching §3.2 exactly)

```bash
pnpm install
```

---

## 4. Phase 0 — Repository & Configuration

**Goal:** a clean, typed, lintable repo whose configs are byte-for-byte the reference's
(adapted only for brand strings). No UI yet.

### 4.0 File map

| Target                           | Tag                 | Reference source                                   |
| :------------------------------- | :------------------ | :------------------------------------------------- |
| `package.json`                   | see §3.2            | `package.json`                                     |
| `tsconfig.json`                  | `[COPY]`            | `/home/satishkumar/Desktop/ui-satis/tsconfig.json` |
| `components.json`                | `[COPY + ADAPT]`    | `.../components.json`                              |
| `next.config.mjs`                | `[COPY + ADAPT]`    | `.../next.config.mjs`                              |
| `postcss.config.mjs`             | `[COPY]`            | `.../postcss.config.mjs`                           |
| `eslint.config.mjs`              | `[COPY]`            | `.../eslint.config.mjs`                            |
| `.prettierrc`, `.prettierignore` | `[COPY]`            | `.../.prettierrc`, `.../.prettierignore`           |
| `.gitignore`                     | `[COPY]`            | `.../.gitignore`                                   |
| `.env.example`                   | `[COPY + ADAPT]`    | `.../.env.example`                                 |
| `LICENSE`                        | `[COPY or REPLACE]` | `.../LICENSE`                                      |
| `README.md`                      | `[NEW]`             | — (skeleton in §4.11)                              |

### 4.1 tsconfig.json `[COPY]`

```bash
cp /home/satishkumar/Desktop/ui-satis/tsconfig.json ./
```

The three `paths` entries are **load-bearing** — do not drop them:
`collections/*` → `./.source/*` (Fumadocs), `@/*` → `./*`, `@/__registry__` → `./__registry__/index.tsx` (Previewer).

### 4.2 components.json `[COPY + ADAPT]`

```bash
cp /home/satishkumar/Desktop/ui-satis/components.json ./
```

**Adapt:** change the `ui` alias from `@/components/satisium-ui` to `@/components/ui`.
The reference points `ui` at `components/satisium-ui` because it _publishes_ a library;
a general starter should use the conventional folder. Final content:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-maia",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "hugeicons",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

> `style: "radix-maia"` and `iconLibrary: "hugeicons"` are what produce the Satisium look
> when you `shadcn add` new primitives — keep both.

### 4.3 next.config.mjs `[COPY + ADAPT]`

```bash
cp /home/satishkumar/Desktop/ui-satis/next.config.mjs ./
```

**Adapt (4 edits):**

1. **Keep** the `async rewrites()` block — those are the PostHog ingest proxies and analytics
   ships ON by default (§18). They are inert without a token.
2. **Keep** the CSP `connect-src` PostHog hosts for now, but move the whole header value into
   `lib/csp.mjs` (§21.5) so future integrations (Sentry, Stripe, Supabase) compose instead of
   silently breaking the app.
3. Change the `/changelog` redirect destination from
   `/docs/getting-started/changelog` → `/docs/changelog` (the starter's docs tree, §9).
4. **Delete `unoptimized: true`** from `images` and keep `remotePatterns`. The reference is a
   library serving CDN media; an app wants the Next image optimiser (§21.4).

Everything else — `reactStrictMode`, `images.remotePatterns`,
all security headers, `X-Robots-Tag: noindex` on `/api`, `/test`, `/embed`, `/preview`,
the bundle-analyzer wrapper and `createMDX({})` — stays **exactly** as in the reference.

> ⚠️ **Scaffold leftovers.** `create-next-app` may generate its own `next.config.ts` and
> `eslint.config.mjs`. The `[COPY]` in this section replaces the ESLint config, but if **both**
> `next.config.ts` and `next.config.mjs` exist, Next.js refuses to boot — delete the `.ts` one.
> `tsconfig.json` is overwritten here and `app/globals.css` in Phase 1, so leave those alone.

### 4.4 postcss.config.mjs `[COPY]` and eslint.config.mjs `[COPY]`

```bash
cp /home/satishkumar/Desktop/ui-satis/postcss.config.mjs ./
cp /home/satishkumar/Desktop/ui-satis/eslint.config.mjs ./
```

`postcss.config.mjs` = `{ plugins: { "@tailwindcss/postcss": {} } }`.
`eslint.config.mjs` = flat config spreading `eslint-config-next/core-web-vitals` + `/typescript`, with `settings: { react: { version: "19.2.8" } }` (fixes `eslint-plugin-react` under ESLint 10), `rules: { "@typescript-eslint/no-explicit-any": "warn", "react-hooks/set-state-in-effect": "warn" }`, and `.kilo/**`, `.source/**` in `globalIgnores`.

### 4.5 Prettier `[COPY]`

```bash
cp /home/satishkumar/Desktop/ui-satis/.prettierrc ./
cp /home/satishkumar/Desktop/ui-satis/.prettierignore ./
```

Key settings: no semicolons, double quotes, `printWidth: 80`, and
`prettier-plugin-tailwindcss` pointed at `app/globals.css` with `tailwindFunctions: ["cn", "cva"]`.

### 4.6 .gitignore `[COPY]`

```bash
cp /home/satishkumar/Desktop/ui-satis/.gitignore ./
```

Note it ignores `/.source` and `next-env.d.ts` (both generated) — keep that.

### 4.7 .env.example `[COPY + ADAPT]`

Write this (reference file minus the analytics vars, plus `NEXT_PUBLIC_SITE_URL`,
which `lib/config.ts` reads but the reference neglected to document):

```bash
# ==========================================
# SATISIUM STARTER - LOCAL ENVIRONMENT SETUP
# ==========================================
# Copy this file to '.env.local' and fill in the values.

# --- SITE ---
# Public origin used for canonical URLs, OG images, sitemap and llms.txt
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# --- ANALYTICS (all optional: omit them and the app stays silent) ---
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=""
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
NEXT_PUBLIC_GA_ID=""

# --- TELEMETRY COUNTERS + RATE LIMITING (optional; in-memory fallback) ---
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# --- ERROR TRACKING (optional) ---
SENTRY_DSN=""
NEXT_PUBLIC_SENTRY_DSN=""

# --- GITHUB (last-modified dates on docs) ---
# Fine-grained, read-only Personal Access Token (Developer Settings)
GIT_TOKEN="github_pat_your_token_here"

# --- SEARCH ENGINE VERIFICATION (optional) ---
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=""
NEXT_PUBLIC_BING_SITE_VERIFICATION=""
```

**Zero-key rule:** every variable above is optional. With an empty `.env.local` the app boots,
builds and passes tests — analytics is silent, telemetry falls back to memory, rate limiting
returns `true`, and error tracking logs to the console (§18.2, §21.2).

### 4.8 pnpm-workspace.yaml — keep the file, fix its values

Both the scaffold and the reference ship this file, and both are half-finished — the scaffold
writes `false` for the packages we actually need built:

```yaml
# what create-next-app (pnpm 12.x) writes today
allowBuilds:
  sharp: false
  unrs-resolver: false
```

**Do not delete it, and do not invent a third key.** The schema follows your pnpm version:

| pnpm                 | Key                     | Shape                                           |
| :------------------- | :---------------------- | :---------------------------------------------- |
| 10.x                 | `onlyBuiltDependencies` | `onlyBuiltDependencies: [sharp, unrs-resolver]` |
| 11+/12.x             | `allowBuilds`           | `allowBuilds:                                   |
| sharp: true          |
| unrs-resolver: true` |

Both packages must be **allowed**: `sharp` powers image optimisation (§21.4) and
`unrs-resolver` is a lint dependency. Verify with `pnpm install` — if pnpm prints
`Ignored build scripts: sharp`, the file is still wrong. Full list: §19.4.

### 4.9 LICENSE `[COPY or REPLACE]`

```bash
cp /home/satishkumar/Desktop/ui-satis/LICENSE ./
```

Keep it if the starter inherits the same licence; otherwise drop in your own.

### 4.10 .vscode/settings.json `[OPTIONAL]`

```bash
mkdir -p .vscode && cp /home/satishkumar/Desktop/ui-satis/.vscode/settings.json .vscode/
```

### 4.11 README.md `[NEW]` (skeleton — fill in per product)

```md
# Satisium Starter

Brand-aligned **App + Docs** starter for Satisium products.

## Stack

Next 16 · React 19 · Tailwind v4 · Fumadocs MDX · shadcn registry · Zustand · Motion · GSAP

## Quick start

\`\`\`bash
pnpm install
pnpm dev # http://localhost:3000
\`\`\`

| Command                                        | What it does                           |
| :--------------------------------------------- | :------------------------------------- |
| `pnpm dev`                                     | Turbo dev server                       |
| `pnpm build`                                   | `build-llms.mjs` → `next build`        |
| `pnpm typecheck` / `pnpm lint` / `pnpm format` | Quality gates                          |
| `pnpm registry:public`                         | Rebuild `public/r/*.json` (shadcn CLI) |
| `pnpm build:registry:meta`                     | Rebuild `registry/meta.ts`             |
| `pnpm make:doc`                                | Scaffold a new docs page               |
| `pnpm changeset` / `pnpm release`              | Version + changelog                    |

## Structure

- `app/` — routes (`/`, `/app`, `/docs`, `/preview`, `/embed`, `/api`)
- `content/docs/` — MDX documentation
- `registry/` — distributable components (source of `public/r/*.json`)
- `components/` — app UI (brand, layout, code-block, previewer)
- `lib/` — config, source, helpers
```

### 4.12 Phase 0 validation

```bash
pnpm install            # must succeed with no peer warnings
pnpm exec next typegen  # generates .next/types route globals (LayoutProps) the scaffold's app/layout.tsx uses
pnpm typecheck          # must pass
```

> ⚠️ **Phases 1–4 cannot pass `pnpm typecheck` or boot `pnpm dev`.** `app/layout.tsx` imports
> `@/lib/source` (Phase 5), `CommandMenuDialog` (Phase 4) and `@/lib/config` (Phase 2), and
> `next.config.mjs` calls `createMDX({})`, which needs `source.config.ts` + `content/docs/`
> (Phase 5). That is expected: use `pnpm lint` and file review until Phase 5, where the full
> smoke test in §9.8 runs. If you want an earlier boot, create `source.config.ts` + a one-line
> `content/docs/index.mdx` now and move Phase 5's validation rule earlier.
>
> `pnpm exec next typegen` writes `.next/types/` and exits 0 even in Phase 0; until Phase 5 adds
> `source.config.ts` it also prints `The entry point "source.config.ts" cannot be marked as external`
> — that warning is expected.

**Done when:** the repo installs, type-checks, and `git status` shows only the files listed in §4.0
plus the generated `pnpm-lock.yaml` (commit it — CI installs with `--frozen-lockfile`).

## 5. Phase 1 — Design System (Tokens, Fonts, Theme)

**Goal:** the exact Satisium look — OKLCH tokens (light + dark), the 4-font system,
and animated theme switching — with zero UI built yet.

### 5.1 app/globals.css `[COPY + ADAPT]`

```bash
cp /home/satishkumar/Desktop/ui-satis/app/globals.css app/globals.css
```

#### Anatomy (do not remove any block)

| Lines   | Block                                                                                                                         | What it provides                                                                                                                                                                                                                                                                                                                                                                                        |
| :------ | :---------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1–6     | `@import "tailwindcss"`, `tw-animate-css`, `shadcn/tailwind.css`, `@plugin "@tailwindcss/typography"`, `@custom-variant dark` | Tailwind v4 entry + dark variant. **`shadcn/tailwind.css` is why the `shadcn` package is a runtime dependency.**                                                                                                                                                                                                                                                                                        |
| 11–82   | `:root` (light)                                                                                                               | Structural grays with **C=0** (`--background: oklch(1 0 0)`, `--foreground: oklch(0.14 0 0)`, `--muted: oklch(0.96 0 0)`, `--border: oklch(0.92 0 0)`); primary orange `oklch(0.6404 0.2153 35.9003)`; sidebar + 5 chart tokens; `--radius: 1.4rem`; `--spacing: 0.25rem`; the full shadow ramp                                                                                                         |
| 84–131  | `.dark`                                                                                                                       | `--background: oklch(0.14 0 0)` (off-black, deliberately not pure black), `--muted: oklch(0.1684 0 0)`, `--border: oklch(0.22 0 0)`; primary stays identical                                                                                                                                                                                                                                            |
| 133–217 | `@theme inline`                                                                                                               | Maps every token to a Tailwind utility (`--color-*`), the **font vars** (`--font-display/-heading/-body/-code/-caveat`, plus aliases `--font-sans`/`--font-mono`), the **modular type scale** (`--text-caption` .79rem → `--text-display-lg` 2.887rem), radius ramp, shadows, and **motion vars**: `--duration-fast/normal/slow/display`, `--ease-spring/in-out/out-expo/snap`, `--animate-in/slide-up` |
| 219–235 | `@keyframes fade-in`, `slide-up`                                                                                              | Referenced by the motion vars above                                                                                                                                                                                                                                                                                                                                                                     |
| 237–306 | `@layer base`                                                                                                                 | `@apply border-border outline-ring/50`; body = `--font-body` @ 1rem/1.6 with antialiasing; headings = `--font-heading` @ 700; per-element type scale; `small`, `caption`, `code/pre/kbd` rules                                                                                                                                                                                                          |
| 308–379 | `@layer utilities`                                                                                                            | `.font-crop` and `.text-display-lg/.text-display/.text-display-sm` (cap-height cropping via `text-box-trim`), `.no-scrollbar`                                                                                                                                                                                                                                                                           |
| 381–407 | `@layer base` scrollbars                                                                                                      | 6px thumb tinted with `--border`, hover `--muted-foreground`                                                                                                                                                                                                                                                                                                                                            |

#### Adaptation notes

1. **🐞 Fix a latent bug in the reference.** `@theme inline` declares
   `--font-display: var(--font-display), ui-sans-serif, system-ui;` but `app/layout.tsx`
   never defines `--font-display` (it only sets `--font-heading`, `--font-body`,
   `--font-code`, `--font-caveat`). Result: `.text-display*` silently falls back to the
   system sans. **Change that line to:**
   ```css
   --font-display: var(--font-heading), ui-sans-serif, system-ui;
   ```
   …so display type renders in Plus Jakarta Sans. (Alternative: add a fifth `next/font`
   loader that sets `--font-display`.)
2. **Rebranding (optional).** The Satisium orange is one hue used in 5 places. To change it,
   replace `oklch(0.6404 0.2153 35.9003)` **everywhere** it appears (`--primary`, `--ring`,
   `--sidebar-primary`, `--sidebar-ring`, `--chart-1`, in **both** `:root` and `.dark`).
   Keep `L=0.6404`, `C=0.2153` and only move the hue for the same perceived punch
   (e.g. `H 258` violet, `H 150` green). **For every Satisium product, keep the orange.**
3. Keep `--radius: 1.4rem` — the soft, oversized radius is the signature geometry.
4. Never delete the `--text-*` scale or the `--ease-*`/`--duration-*` vars; layout
   components, `toc.tsx`, `preview-toolbox.tsx` and all brand components read them.

### 5.2 app/layout.tsx `[COPY + ADAPT]` — the font system

```bash
cp /home/satishkumar/Desktop/ui-satis/app/layout.tsx app/layout.tsx
```

**The four loaders (keep exactly):**

```tsx
import {
  Plus_Jakarta_Sans,
  Inter,
  IBM_Plex_Mono,
  Caveat,
} from "next/font/google"

const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})
const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})
const fontCode = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
})
const fontCaveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["500", "600"],
})
```

| Font                  | Variable                            | Role                                   |
| :-------------------- | :---------------------------------- | :------------------------------------- |
| **Plus Jakarta Sans** | `--font-heading` (`--font-display`) | All headings + `.text-display*`        |
| **Inter**             | `--font-body` (`--font-sans`)       | Body copy                              |
| **IBM Plex Mono**     | `--font-code` (`--font-mono`)       | Code, kbd, tree views                  |
| **Caveat**            | `--font-caveat` (`font-caveat`)     | Handwritten annotations (`Annotation`) |

And the `<html>` tag must carry all four variables:

```tsx
<html lang="en" suppressHydrationWarning
      className={cn(fontHeading.variable, fontBody.variable, fontCode.variable, fontCaveat.variable)}>
```

#### Adaptations (5 edits)

1. **Keep the telemetry stack; drop only the mobile gate.** Analytics ships ON by default (§18)
   and is zero-key safe — `CSPostHogProvider` only initialises when
   `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` exists, `trackEvent()` returns early without consent, and
   the rate limiter fails open. So keep `CSPostHogProvider`, `ConsentProvider`, `ConsentBanner`,
   `PostHogPageView`, `WebVitals`, `Analytics` (`@vercel/analytics/next`) and `GoogleAnalytics`.
   **Delete only `<ViewportBlocker />`** (the desktop-only gate, §15.3), and change
   `app_name` in `components/analytics-provider.tsx` from `"satisium-ui"` to your product slug
   — the reference literally comments _"Change this string in your future apps!"_.
2. **Final body shape** — providers, children, then the two global overlays
   (`<Toaster />` is from the template kit — `component-kit.md` §8.5; `MotionConfig` is the
   reduced-motion switch — §21.1):

   ```tsx
   <body>
     <ConsentProvider>
       <CSPostHogProvider>
         <Suspense fallback={null}>
           <PostHogPageView />
           <WebVitals />
         </Suspense>
         <Analytics />
         <GoogleAnalytics />
         <ThemeProvider>
           <MotionConfig reducedMotion="user">
             {children}
             <CommandMenuDialog
               docsTree={source.pageTree}
               extraItems={QUICK_ACTIONS}
             />
           </MotionConfig>
           <Toaster />
         </ThemeProvider>
         <ConsentBanner />
       </CSPostHogProvider>
     </ConsentProvider>
   </body>
   ```

3. **Delete the two redundant Google-hosted font stylesheets.** The reference preloads
   IBM Plex Mono and Caveat from `fonts.googleapis.com` even though `next/font` already
   self-hosts them (a double download). Remove both `<link rel="preload" as="style" …>`
   tags; keep the rest of the `<head>`.
4. **Re-brand the metadata** (all copy): `title.template` `"%s | <Product>"`,
   `title.default`, `description`, `keywords`, `openGraph.siteName`, the OG/Twitter image
   `alt`/`title` values, and the JSON-LD `name`/`description` fields. Keep the structure:
   `metadataBase` from `SITE_URL`, `alternates.canonical` + `alternates.types` (the two
   `llms.txt` entries), search-engine `verification`, OG + Twitter cards, and the four
   JSON-LD scripts (`WebSite`, `Organization`, `SoftwareApplication`, `WebPage`).
5. **JSON-LD trim:** for a non-product site, delete the `SoftwareApplication` script
   (and the `offers` block). Keep `WebSite` + `Organization` — they drive the sitelinks
   search box and brand knowledge panel.

### 5.3 components/theme-provider.tsx `[COPY]`

```bash
cp /home/satishkumar/Desktop/ui-satis/components/theme-provider.tsx components/theme-provider.tsx
```

Why it is not just `next-themes`:

- Wraps `NextThemesProvider` with `attribute="class"`, `defaultTheme="system"`,
  `enableSystem`, `disableTransitionOnChange`.
- Injects the CSS that makes the theme sweep work without breaking page transitions:

  ```css
  .satisium-theme-transition::view-transition-old(root),
  .satisium-theme-transition::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }
  .satisium-theme-transition::view-transition-new(root) {
    z-index: 9999;
  }
  ```

- Registers a **global `D` hotkey** (`ThemeHotkey`) that flips light/dark through
  `switchThemeWithTransition(..., "fade")`. It bails out on `metaKey/ctrlKey/altKey`,
  `event.repeat`, and when the event target is an `input`/`textarea`/`select`/contenteditable.

> To change the hotkey, edit `event.key.toLowerCase() !== "d"`. To disable it, delete
> `<ThemeHotkey />` from the provider.

### 5.4 lib/theme-transition.ts `[COPY]`

```bash
cp /home/satishkumar/Desktop/ui-satis/lib/theme-transition.ts lib/theme-transition.ts
```

Dependency-free helper exporting `switchThemeWithTransition(setTheme, theme, event, mode)`.
It feature-detects `document.startViewTransition`, adds the `satisium-theme-transition`
class for the duration, and sweeps from the click coordinates (`mode` = `"fade"` | `"circle"`).
When the API is missing it applies the theme instantly. Copy verbatim.

### 5.5 Phase 1 validation

```bash
pnpm typecheck     # must pass
```

Visual proof comes with Phase 3's smoke test (`pnpm dev` → the themed shell).
**Done when:** `globals.css`, `layout.tsx`, `theme-provider.tsx`, `theme-transition.ts`
exist, `--font-display` points at `--font-heading`, and no analytics import remains.

---

## 6. Phase 2 — Foundation: `lib`, `store`, `hooks`

**Goal:** the small, shared modules every later phase imports.

### 6.0 File map

| Target                       | Tag              | Reference source                 |
| :--------------------------- | :--------------- | :------------------------------- |
| `lib/config.ts`              | `[COPY + ADAPT]` | `.../lib/config.ts`              |
| `lib/social-links.ts`        | `[COPY + ADAPT]` | `.../lib/social-links.ts`        |
| `lib/utils.ts`               | `[COPY]`         | `.../lib/utils.ts`               |
| `lib/logger.ts`              | `[COPY + ADAPT]` | `.../lib/logger.ts`              |
| `store/index.ts`             | `[COPY]`         | `.../store/index.ts`             |
| `store/use-command-store.ts` | `[COPY]`         | `.../store/use-command-store.ts` |
| `store/use-sidebar-store.ts` | `[COPY]`         | `.../store/use-sidebar-store.ts` |
| `hooks/use-scroll-spy.ts`    | `[COPY]`         | `.../hooks/use-scroll-spy.ts`    |
| `hooks/use-track-event.ts`   | `[EXCLUDE]`      | analytics-only                   |

### 6.1 lib/config.ts `[COPY + ADAPT]`

```bash
cp /home/satishkumar/Desktop/ui-satis/lib/config.ts lib/config.ts
```

Final content (the `PRODUCT` block is the starter's brand single-source-of-truth — it is new):

```ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://your-domain.com")

export const isDevelopment = process.env.NODE_ENV === "development"

/** Single source of truth for product branding. */
export const PRODUCT = {
  name: "Satisium Starter",
  shortName: "Starter",
  titleTemplate: "%s | Satisium Starter",
  defaultTitle: "Satisium Starter — App + Docs template",
  description:
    "A brand-aligned App + Docs starter built with Next.js, Tailwind v4 and Fumadocs.",
  applicationCategory: "DeveloperApplication",
} as const
```

> Every hardcoded product string in later phases must reference `PRODUCT` (or
> `PROJECT` from `lib/social-links.ts`) instead of a literal. The complete list of
> literals to replace is in §7.4.

### 6.2 lib/social-links.ts `[COPY + ADAPT]`

```bash
cp /home/satishkumar/Desktop/ui-satis/lib/social-links.ts lib/social-links.ts
```

This file is the **contract** for the footer, the command menu and the `Organization`
JSON-LD. Keep every export name; change only the values. Final content:

```ts
export type SocialPlatform =
  "x" | "github" | "discord" | "instagram" | "youtube" | "linkedin"

export interface SocialLink {
  platform: SocialPlatform
  href: string
  label: string
  ariaLabel: string
}

export const PROJECT = {
  name: "Satisium Starter",
  x: "https://x.com/satisium",
  github: "https://github.com/satisium/starter",
  discord: "https://discord.gg/xQ5cPHmT7",
  instagram: "https://www.instagram.com/satisium/",
} as const

export const AUTHOR = {
  name: "Satishkumar",
  x: "https://x.com/iamsatish4564",
  github: "https://github.com/satishkumarsajjan",
  instagram: "https://instagram.com/iamsatish4564",
} as const

/**
 * owner/repo in "owner/name" form.
 * Wire this into lib/docs-page.tsx (§9.4) so GitHub last-modified lookups and
 * "Edit on GitHub" links stay authoritative — the reference hardcodes them.
 */
export const REPO = "satisium/starter"

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
  PROJECT.github,
  AUTHOR.x.replace("x.com", "twitter.com"),
] as const
```

> Improvement over the reference: `ariaLabel`s are built from `PROJECT.name` / `AUTHOR.name`
> so rebranding is a one-line change.

### 6.3 lib/utils.ts `[COPY]`

```bash
cp /home/satishkumar/Desktop/ui-satis/lib/utils.ts lib/utils.ts
```

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 6.4 lib/logger.ts `[COPY + ADAPT]`

```bash
cp /home/satishkumar/Desktop/ui-satis/lib/logger.ts lib/logger.ts
```

Dev-only, prefix-tagged `error/warn/info`. **Adapt:** change the `"[Satisium UI]"`
tag to `"[Satisium Starter]"` (3 occurrences) or to a `PRODUCT`-derived constant.

### 6.5 store/ `[COPY ×3]`

```bash
cp /home/satishkumar/Desktop/ui-satis/store/index.ts store/index.ts
cp /home/satishkumar/Desktop/ui-satis/store/use-command-store.ts store/use-command-store.ts
cp /home/satishkumar/Desktop/ui-satis/store/use-sidebar-store.ts store/use-sidebar-store.ts
```

| File                         | Export                                     | Shape                                                                                                                                           | Consumed by                                        |
| :--------------------------- | :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| `store/index.ts`             | `usePackageManager`, `type PackageManager` | `{ manager: "npm"\|"pnpm"\|"yarn"\|"bun"; setManager() }` — **persisted** in `localStorage` under `satisium-ui-pm-preference`, default `"pnpm"` | `components/command-block.tsx` tabs                |
| `store/use-command-store.ts` | `useCommandStore`                          | `{ isOpen, setIsOpen, toggle }`                                                                                                                 | ⌘K palette (open state shared by every trigger)    |
| `store/use-sidebar-store.ts` | `useSidebarStore`                          | `{ isOpen, toggleSidebar, openSidebar, closeSidebar }`                                                                                          | Docs sidebar (`ThreePaneLayout` / `SpatialLayout`) |

> Optional: rename the persisted key to `your-product-pm-preference`. Keep `"pnpm"` as
> the default so `CommandBlock` matches the rest of our docs.

### 6.6 hooks/use-scroll-spy.ts `[COPY]`

```bash
cp /home/satishkumar/Desktop/ui-satis/hooks/use-scroll-spy.ts hooks/use-scroll-spy.ts
```

Powers the active-heading highlight in `components/layout/toc.tsx` (Phase 4). Pure
browser API — no dependency, no config. `use-track-event.ts` is analytics-only: `[EXCLUDE]`.

### 6.7 Phase 2 validation

```bash
pnpm typecheck    # must pass
```

**Done when:** `lib/{config,social-links,utils,logger}.ts`, the three store files and
`hooks/use-scroll-spy.ts` exist, and `grep -ri "satisium ui" lib store` returns nothing
user-visible.

---

## 7. Phase 3 — Brand Layer & UI Primitives

**Goal:** the components that make a Satisium product _look_ like a Satisium product.

### 7.0 File map

| Target                                       | Tag              | Reference source                                 | Purpose                                                                                                                              |
| :------------------------------------------- | :--------------- | :----------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `components/satisium-logo.tsx`               | `[COPY]`         | `.../components/satisium-logo.tsx`               | The brand sigil                                                                                                                      |
| `components/icons.tsx`                       | `[COPY]`         | `.../components/icons.tsx`                       | npm/pnpm/yarn/bun + GitHub marks                                                                                                     |
| `components/ui/action-button.tsx`            | `[COPY]`         | `.../components/ui/action-button.tsx`            | Signature morphing button                                                                                                            |
| `components/ui/copy-mdx-button.tsx`          | `[COPY]`         | `.../components/ui/copy-mdx-button.tsx`          | "Copy MD" over `ActionButton`                                                                                                        |
| `components/command-block.tsx`               | `[COPY + ADAPT]` | `.../components/command-block.tsx`               | Terminal-style install box                                                                                                           |
| `components/home/minimal-theme-switcher.tsx` | `[COPY]`         | `.../components/home/minimal-theme-switcher.tsx` | Light/dark pill switcher                                                                                                             |
| `components/home/annotation.tsx`             | `[COPY]`         | `.../components/home/annotation.tsx`             | Caveat handwritten annotations                                                                                                       |
| `components/coming-soon.tsx`                 | `[COPY + ADAPT]` | `.../components/coming-soon.tsx`                 | Placeholder for unbuilt sections                                                                                                     |
| `components/ui/*` (13)                       | shadcn           | §3.5                                             | avatar, badge, button, card, command, dialog, input, input-group, resizable, scroll-area, select, separator, tabs, textarea, tooltip |

### 7.1 Copy the five verbatim components

```bash
cp /home/satishkumar/Desktop/ui-satis/components/satisium-logo.tsx components/satisium-logo.tsx
cp /home/satishkumar/Desktop/ui-satis/components/icons.tsx components/icons.tsx
cp /home/satishkumar/Desktop/ui-satis/components/ui/action-button.tsx components/ui/action-button.tsx
cp /home/satishkumar/Desktop/ui-satis/components/ui/copy-mdx-button.tsx components/ui/copy-mdx-button.tsx
cp /home/satishkumar/Desktop/ui-satis/components/home/minimal-theme-switcher.tsx components/home/minimal-theme-switcher.tsx
cp /home/satishkumar/Desktop/ui-satis/components/home/annotation.tsx components/home/annotation.tsx
```

Why each matters (and what **not** to change):

- **`satisium-logo.tsx`** — the Satisium mark. Accepts a `size` prop and is rendered as
  `<SatisiumLogo size="100%" />` in the docs sidebar (§8.3). Keep it: every Satisium
  product (Pro UI, Tweak, Typeset) wears the same mark.
- **`icons.tsx`** — the package-manager and GitHub marks consumed by `CommandBlock`
  and the command menu. Do not add a PM here unless you also add it to
  `PackageManager` in `store/index.ts`.
- **`action-button.tsx`** — the signature button: icon ⇄ label morph, press/scale
  physics, success state. **Treat its props as a public API**
  (`label`, `icon`, `successLabel`, `successIcon`, `onClick`, `disabled`, `variant`, `size`, `className`) —
  `CopyMdxButton` and the docs header depend on `variant="outline"` + `size="sm"`.
- **`copy-mdx-button.tsx`** — thin wrapper: `navigator.clipboard.writeText(rawMdx)`,
  disabled when `rawMdx` is empty, label "Copy MD" → "Copied!".
- **`minimal-theme-switcher.tsx`** — the pill switcher used in the hero, the sidebar
  footer and the docs header. It calls `switchThemeWithTransition` (§5.4), so theme
  switching stays animated everywhere it appears.
- **`annotation.tsx`** — Caveat-font, SVG-based handwritten marks. This is a big part of
  the "made by a design engineer" feel; used on the landing page and in docs callouts.

### 7.2 components/command-block.tsx `[COPY + ADAPT]`

```bash
cp /home/satishkumar/Desktop/ui-satis/components/command-block.tsx components/command-block.tsx
```

Terminal-chrome card that renders one shell command **per package manager**, with animated
tab switching driven by `usePackageManager` and the marks from `icons.tsx`.

**Adapt:**

1. Keep the prop signature and internal structure untouched.
2. Update the commands you feed it (docs will pass things like
   `npx shadcn@latest add @your-scope/component`).
3. The component contains **no** hardcoded product string (verified), so no copy edits needed.

### 7.3 components/coming-soon.tsx `[COPY + ADAPT]`

```bash
cp /home/satishkumar/Desktop/ui-satis/components/coming-soon.tsx components/coming-soon.tsx
```

Final content (already general after the copy edit):

```tsx
import { PROJECT } from "@/lib/social-links"
import { NewTwitterIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function ComingSoon({ type }: { type: string }) {
  return (
    <div className="mt-8 flex flex-col gap-6">
      <p className="max-w-2xl font-sans text-[15px] leading-relaxed text-muted-foreground">
        The {type.toLowerCase()} collection is currently in active development.
      </p>

      <a
        href={PROJECT.x}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-fit items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
      >
        <HugeiconsIcon
          icon={NewTwitterIcon}
          className="size-4 text-foreground/80 transition-colors group-hover:text-foreground"
        />
        <span>Follow for release updates ↗</span>
      </a>
    </div>
  )
}
```

**Adapt:** widen the `type` union to your own sections (reference used
`"Blocks" | "Templates"`; `string` keeps it general).

### 7.4 Brand-string checklist (the only literals that need replacing)

Grep of the whole reference repo shows `satisium` in exactly these **user-visible** places:

| File                                    | Occurrences | Action                                       |
| :-------------------------------------- | :---------- | :------------------------------------------- |
| `app/layout.tsx`                        | 13          | Phase 1 §5.2 edit 4                          |
| `lib/social-links.ts`                   | 9           | Phase 2 §6.2                                 |
| `app/docs/layout.tsx`                   | 5           | Phase 5 metadata copy (metadata only)        |
| `app/docs/[[...slug]]/layout.tsx`       | —           | Phase 4 — resolves the page (§8.6)           |
| `app/docs/[[...slug]]/page.tsx`         | 2           | title template → `PRODUCT.titleTemplate`     |
| `app/manifest.ts`                       | 2           | `name` / `short_name` → `PRODUCT.name`       |
| `app/api/og/route.tsx`                  | 3           | logo `src`, `alt`, headline → `PRODUCT.name` |
| `components/layout/sidebar-content.tsx` | 1           | the `Satisium UI` label next to the logo     |
| `components/home/site-footer.tsx`       | 1           | footer wordmark                              |
| `lib/docs-page.tsx`                     | 1           | `owner = "satisium"` → your GitHub owner     |
| `lib/logger.ts`                         | 3           | Phase 2 §6.4                                 |
| `scripts/build-llms.mjs`                | 8           | Phase 11                                     |
| `scripts/create-doc.mjs`                | 6           | Phase 11                                     |

**Keep as-is (internal identifiers, not user-visible):**
`satisium-theme-transition` (CSS class), `satisium-active-demo-*`, `satisium-code-open`,
`satisium-preview-width`, `satisium-viewport-mode`, `satisium-iframe-*` (localStorage keys),
`SATISIUM_RELOAD_ANIMATION` (iframe postMessage type), `satisium-ui-pm-preference`.
Renaming these buys nothing and risks breaking state persistence.

### 7.5 Phase 3 validation

```bash
pnpm typecheck && pnpm lint
```

**Done when:** all six brand files exist, the shadcn primitives are installed in
`components/ui/`, and `grep -rn "Satisium UI" components lib` returns only the
intentional, on-brand labels you chose to keep.

---

## 8. Phase 4 — Dual Docs Layouts (Simple + Spatial)

**Goal:** the docs shell. **Exactly two** layouts, chosen by the developer in
`NEXT_PUBLIC_DOCS_LAYOUT` and baked into the build. There is no runtime switch, no query
parameter and no UI control — visitors always get the shell the product ships with.

### 8.0 File map

| Target                                   | Tag              | Reference source                             | Lines (ref) |
| :--------------------------------------- | :--------------- | :------------------------------------------- | :---------- |
| `components/docs/layouts/spatial.tsx`    | `[COPY + ADAPT]` | `.../components/layout/spatial-layout.tsx`   | 112         |
| `components/docs/layouts/three-pane.tsx` | `[NEW]`          | — (architecture in §8.4)                     | —           |
| `components/docs/types.ts`               | `[NEW]`          |
| `components/docs/shell.tsx`              | `[NEW]`          |
| `components/docs/panes/sponsor-rail.tsx` | `[NEW]`          | — (§8.4)                                     | —           |
| `components/docs/shell.tsx`              | `[NEW]`          | — (§8.4)                                     | —           |
| `components/docs/dispatch.tsx`           | `[NEW]`          | — (§8.4)                                     | —           |
| `app/docs/[[...slug]]/layout.tsx`        | `[NEW]`          | — (§8.6)                                     | —           |
| `components/layout/sidebar-content.tsx`  | `[COPY + ADAPT]` | `.../components/layout/sidebar-content.tsx`  | 552         |
| `components/layout/sidebar-footer.tsx`   | `[COPY + ADAPT]` | `.../components/layout/sidebar-footer.tsx`   | 111         |
| `components/layout/toc.tsx`              | `[COPY]`         | `.../components/layout/toc.tsx`              | 494         |
| `components/layout/page-breadcrumbs.tsx` | `[COPY]`         | `.../components/layout/page-breadcrumbs.tsx` | 54          |
| `components/layout/command-menu.tsx`     | `[COPY + ADAPT]` | `.../components/layout/command-menu.tsx`     | 168+        |

### 8.1 Copy

```bash
cd components/layout
for f in sidebar-content sidebar-footer toc page-breadcrumbs command-menu; do
  cp "/home/satishkumar/Desktop/ui-satis/components/layout/$f.tsx" "$f.tsx"
done
```

### 8.2 What each one does (and its public API)

| Component                                  | Export                           | Props                                                         | Notes                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----------------------------------------- | :------------------------------- | :------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SpatialLayout`                            | `SpatialLayout`                  | `{ children, tree }`                                          | The signature shell. 320px sidebar underlayer + a `rounded-[32px]` card that slides `x: 320` and scales to `0.95` on a `spring(380, 38, 0.8)`; a **decoupled shadow layer** that fades in 250 ms after the card (and out in 150 ms immediately); a vertical "MENU" tab button; a click-capture layer that closes the sidebar when you click the dimmed content; the bare **`M`** hotkey                               |
| `SidebarContent`                           | `SidebarContent`                 | `{ tree: PageTree.Root }`                                     | Fully self-contained: brand row (logo + wordmark + `Beta` badge), scroll-faded nav tree with spring-staggered items, a liquid hover pill (`layoutId="sidebar-active-indicator"`), a portal-rendered hover **media preview card** for nodes with `media.video`, and a bottom card containing `CommandMenuTrigger` + `SidebarFooter` + the "Built with ❤ by …" credit. It imports `source` from `@/lib/source` directly |
| `SidebarFooter`                            | `SidebarFooter`                  | —                                                             | 3-way theme pill (Light · System · Dark) using `layoutId="theme-active-indicator"` + `switchThemeWithTransition(..., "fade")`, plus an author link from `AUTHOR.x`                                                                                                                                                                                                                                                    |
| `TableOfContents`                          | `TableOfContents`, `TOCItemType` | `{ items: TOCItemType[] }`                                    | Liquid scroll-spy TOC powered by `hooks/use-scroll-spy.ts`                                                                                                                                                                                                                                                                                                                                                            |
| `PageBreadcrumbs`                          | `PageBreadcrumbs`                | `{ pageUrl, tree }`                                           | Derives the trail from the Fumadocs page tree                                                                                                                                                                                                                                                                                                                                                                         |
| `CommandMenuDialog` / `CommandMenuTrigger` | both                             | `{ docsTree?: PageTree.Root }` / `React.ButtonHTMLAttributes` | ⌘K palette + a reusable trigger (`variant="icon"` is used in the hero and the fullscreen toolbox). The dialog is mounted **once** in `app/layout.tsx`                                                                                                                                                                                                                                                                 |

### 8.3 Adaptations for the copied files

1. **`sidebar-content.tsx`**
   - Replace the visible wordmark `Satisium UI` with `PRODUCT.name`.
   - Keep the `Beta` badge only if your product is pre-1.0; otherwise delete that `Badge`
     (and its import).
   - Update the "Built with ❤ by …" credit link (hardcoded to `https://satishkumar.xyz/`)
     to `AUTHOR.x` from `@/lib/social-links`.
2. **`sidebar-footer.tsx`** — change the tooltip copy "Connect with me on X" to
   something product-appropriate. It already reads `AUTHOR.x`, so no link edits needed.
3. **`command-menu.tsx`** — it imports `trackEvent` from `@/lib/analytics`; the no-op shim
   from §6.8 keeps it working. Adapt the placeholder text/labels if you like, keep the
   ⌘K binding and the page-tree search behaviour.
4. **`toc.tsx` / `page-breadcrumbs.tsx` / `spatial-layout.tsx`** — copy verbatim, then move the
   layout to `components/docs/layouts/spatial.tsx` and adapt it to `DocsShellProps` (§8.4).
   The `spring(380, 38, 0.8)`, `rounded-[32px]` and `top-20 h-24 w-11` values are tuned;
   do not "improve" them.

### 8.4 `[NEW]` components/docs — the layout architecture

Layouts are **arrangements**, not containers. A layout receives three things and decides where
they go; it never fetches data and never knows what is inside the article.

```
components/docs/
├─ types.ts                the contract — the whole surface area
├─ dispatch.tsx            the ONLY place that reads DOCS_LAYOUT
├─ shell.tsx               <DocsScreen> + <DocsPane> — borderless, no shadow
├─ panes/sponsor-rail.tsx  example content for the optional third rail
└─ layouts/
   ├─ spatial.tsx          the signature card shift
   └─ three-pane.tsx       borderless sidebar | article | optional rail
```

**`components/docs/types.ts`** — if a layout needs something that is not in here, it must not reach
for it. That is the rule that keeps layouts swappable:

```ts
export interface DocsPageMeta {
  title: string
  /** Heading tree, or `null` when the page sets `hideToc`. */
  toc: TOCItemType[] | null
  /** True when the page sets `wide` — the article drops its max-width cap. */
  wide: boolean
  /** True when the page sets `hideAside` — this page opts out of the third rail. */
  hideAside: boolean
}

export type DocsAsideBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl"

/** Everything here belongs to the developer, not to the docs engine. */
export interface DocsShellConfig {
  /**
   * Content for the optional third rail. Omit it and the rail does not render.
   * Nullish *is* the switch — there is no `showAside` boolean to keep in sync.
   */
  aside?: React.ReactNode
  /** Breakpoint below which the rail is hidden. Defaults to `2xl` (1536px). */
  asideHideBelow?: DocsAsideBreakpoint
}

export interface DocsShellProps extends DocsShellConfig {
  tree: PageTree.Root
  page: DocsPageMeta
  /** Article body only — chrome, TOC and arrangement belong to the layout. */
  children: React.ReactNode
}
```

**`components/docs/dispatch.tsx`** — one switch, and the only reader of the config flag:

```tsx
export function DocsShell(props: DocsShellProps) {
  switch (DOCS_LAYOUT) {
    case "three-pane":
      return <ThreePaneLayout {...props} />
    case "spatial":
      return <SpatialLayout {...props} />
    default:
      throw new Error(`docs: unknown DOCS_LAYOUT "${DOCS_LAYOUT}"`)
  }
}
```

**A layout is arrangement only.** Both shells compose the same three regions — `SidebarContent`,
the article, `TableOfContents` — so neither re-implements navigation or the scroll spy:

In both shells the TOC is a sub-column _inside_ the article, not a sibling pane:

```tsx
{
  /* DocsPane renders <main id="main-content" tabIndex={-1}> itself */
}
;<DocsPane size="main" scrollRoot={setScrollRoot}>
  <div className="grid lg:grid-cols-[minmax(0,1fr)_var(--docs-toc-w)] lg:gap-12">
    <div className="min-w-0">{children}</div>
    {page.toc && (
      <aside className="sticky top-24">
        <TableOfContents items={page.toc} root={scrollRoot} />
      </aside>
    )}
  </div>
</DocsPane>
```

The third rail is a sibling pane that exists only when `aside` is passed:

```tsx
{
  aside != null && !page.hideAside && (
    <DocsPane
      size="aside"
      aria-label="Sponsors"
      className={hideBelowClass(asideHideBelow)}
    >
      {aside}
    </DocsPane>
  )
}
```

**Props carry content and behaviour; tokens carry geometry.** There is no `asideWidth` prop. A
developer who wants a wider rail edits `--docs-aside-w`, not their component — otherwise the API
grows a `width` prop per CSS value and the design system ends up re-declared in a `.tsx` file.

Four rules, all of them load-bearing:

1. **The page renders article body only.** No chrome, no TOC, no layout decisions. It never imports
   a layout.
2. **Layouts never call `source` for the current page.** Everything arrives in props.
3. **Layouts compose tokens, never redefine them** — colours and radii in `globals.css`, motion in
   `lib/motion.ts`.
4. **Only `dispatch.tsx` reads `DOCS_LAYOUT`.** The moment a layout reads it, the dev-only rule
   leaks and the flag becomes a runtime switch again.

#### `shell.tsx` — the borderless geometry

There is **no frame element.** `DocsScreen` is the `bg-muted` viewport surface and the panes float
directly inside it — two surfaces total, no borders and no shadows (rule 9a):

```
┌─ bg-muted, p = --docs-pane-gap ─────────────────────────┐
│  ┌sidebar┐  ┌──────── article ────────┐  ┌─ aside ──┐   │
│  │ 240-  │  │ ┌─────┐   ┌── toc ──┐  │  │ 200-280 │   │
│  │  320  │  │ │ MDX │   │ 200-260 │  │  │         │   │
│  └───────┘  │ └─────┘   └────────┘  │  └─────────┘   │
└───────────────────────────────────────────────────────┘
             ↑ every gap = --docs-pane-gap, and so is the
               outer margin. Equal margins are what make three
               separate panes read as ONE object.
```

**One token drives both the outer margin and the gutter**, so they cannot drift apart.

`DocsScreen` uses `h-dvh`, never `h-screen`: `100vh` is the _tallest_ viewport, so on iOS the bottom
of the docs hides under the browser chrome.

`DocsPane` bakes in `min-h-0` — without it a flex/grid child refuses to shrink and the pane scrolls
the screen instead of its content — **and its own padding**, per size:

| Pane      | Padding | Why                                                                    |
| :-------- | :------ | :--------------------------------------------------------------------- |
| `sidebar` | `p-2`   | nav items already carry their own `px-2…px-4`; more is double-counting |
| `main`    | none    | the page owns article padding — the article's width is page knowledge  |
| `aside`   | `p-2`   | rail cards carry their own `p-4`; the pane only insets the block       |

Padding lived in a layout wrapper until three-pane shipped the sidebar with _zero_ inset. Owning it
in the pane removes the bug class, not one instance.

Each pane renders the landmark it actually is — `nav` for the sidebar, `main` for the article,
`aside` for the rail. The `main` pane carries `id="main-content"`, the skip link's target.

#### The measure — derive every width from it

Reading comfort is a function of line length: **45–75 characters**, which at 16px body text is ~700px.
`--docs-measure` is that anchor, and the rest of the geometry is solved backwards from it:

```
prose 736 + toc 200 + gap 48 + chrome 16  = 1000  →  TOC at 1000     (lg)
             + sidebar 240                 = 1280  →  sidebar at xl
             + aside 200                   = 1500+ →  aside at 2xl
```

Those land on Tailwind's own `lg` / `xl` / `2xl`. Use those breakpoints, not magic numbers. The ladder
is ordered **by cost** — the TOC is 200px and rides inside the article column, the sidebar is a whole
pane — so the cheapest chrome arrives first and every step is a strict improvement, not a trade.

```css
--docs-pane-gap: 0.25rem;
--docs-sidebar-w: clamp(15rem, 17vw, 20rem); /* 240 → 320 */
--docs-aside-w: clamp(12.5rem, 13vw, 17.5rem); /* 200 → 280 */
--docs-toc-w: clamp(12.5rem, 13vw, 16.25rem); /* 200 → 260 */
--docs-measure: 46rem; /* 736px */
--docs-article-max: calc(
  var(--docs-measure) + var(--docs-toc-w) + var(--docs-article-gap)
);
```

**The rails are `clamp()`, not fixed pixels,** because a fixed rail makes the article
`viewport − constant` — a rubber band. The test is that the article's width must _not_ change as the
window grows: the rails absorb the growth, the article holds still.

The article caps as **one block** (header + prose + TOC), not the prose alone. Capping the prose alone
strands the TOC hundreds of pixels from the text it indexes; capping nothing lets prose reach ~1000px,
past the reading band. Catalog pages (`wide`) opt out — they are galleries, not prose.

`DOCS_SIDEBAR_BREAKPOINT` in `hooks/use-media-query.ts` is deliberately **not** `useIsDesktop`:
at 1024 the sidebar and the TOC both appear and the prose drops to ~430px.

**Assert it.** The measure band is a CI test, not a screenshot — an unasserted design invariant is
just a comment (`e2e/smoke.spec.ts`, "article measure stays readable at 1024/1280/1440/1920").

### 8.5 The layout switch — one value

Add to `lib/config.ts` (§6.1). Resolve by **lookup against the variant list**, never a ternary:
a ternary with two identical branches (`? "simple" : "simple"`) compiles cleanly, passes every
test and silently pins the wrong shell.

```ts
const DOCS_LAYOUT_VARIANTS = ["simple", "spatial"] as const

export type DocsLayoutVariant = (typeof DOCS_LAYOUT_VARIANTS)[number]

export const DOCS_LAYOUT: DocsLayoutVariant =
  DOCS_LAYOUT_VARIANTS.find(
    (variant) => variant === process.env.NEXT_PUBLIC_DOCS_LAYOUT
  ) ?? "spatial"
```

One fallback constant, and an unknown or misspelt value degrades to the default instead of
choosing wrongly.

### 8.6 app/docs/[[...slug]]/layout.tsx `[NEW]`

The shell lives at the **catch-all** segment, one level below `app/docs/layout.tsx`, because that is
the shallowest layout that can see which page it is wrapping. It resolves `params.slug`, reads the
page once, and hands the layout only what `DocsPageMeta` allows.

```tsx
import { DocsShell } from "@/components/docs/dispatch"
import type { DocsPageMeta } from "@/components/docs/types"
import { source } from "@/lib/source"

export default async function DocsRouteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const page = source.getPage(slug)

  const meta: DocsPageMeta = {
    title: page?.data.title ?? "",
    toc: page?.data.hideToc ? null : (page?.data.toc ?? null),
    wide: Boolean(page?.data.wide),
  }

  return (
    <DocsShell tree={source.pageTree} page={meta}>
      {children}
    </DocsShell>
  )
}
```

`app/docs/layout.tsx` keeps **only** the segment `metadata` and returns `children` unchanged.

Consequences worth stating, because they are the whole point of the move:

- The TOC becomes the layout's to place. The docs page stops rendering it.
- `hideToc` is data (`toc: null`), not a branch repeated in every layout.
- **The layout must not cache across slugs.** If the TOC ever goes stale on navigation, that is
  the first thing to suspect.

### 8.7 The scroll-spy root

`spatial.tsx` scrolls a card; `three-pane.tsx` scrolls the article pane. A single `IntersectionObserver`
with no `root` watches the viewport, so in `spatial` the TOC highlights drift — silently, because
the TOC still renders.

`hooks/use-scroll-spy.ts` therefore takes an optional root, `TableOfContents` forwards it, and
`spatial.tsx` passes its own card via a callback ref (a plain `ref` would hand the TOC `null` on
first render):

```tsx
const [scrollRoot, setScrollRoot] = useState<Element | null>(null)
// ...
<div ref={setScrollRoot} className="overflow-y-auto scroll-smooth">
```

No provider, no context, no global. `three-pane.tsx` hands it the article pane.

### 8.8 Phase 4 validation

```bash
pnpm typecheck
```

Still no dev boot until `lib/source.tsx` exists (Phase 5) — `sidebar-content.tsx` imports it.

**Done when:**

```bash
# one reader of the flag, and nothing else
grep -rl "DOCS_LAYOUT" components/          # -> components/docs/dispatch.tsx only

# both shells build and the flag actually switches
NEXT_PUBLIC_DOCS_LAYOUT=three-pane pnpm build  # borderless three-pane renders
NEXT_PUBLIC_DOCS_LAYOUT=spatial   pnpm build  # card-shift renders
NEXT_PUBLIC_DOCS_LAYOUT=bogus   pnpm build  # falls back to spatial, does not throw
```

Both layouts bind **only** the `M` hotkey via `useHotkey("m", …)` — never a hand-rolled `keydown`
listener, and never `⌘B`.

### 8.9 The architecture is enforced, not documented

`scripts/doctor.mjs` turns the four rules above into gates that **exit 1**. Without them they are
conventions that erode; with them they are rules that fail the build:

| Check                                                        | Fails when                                    |
| :----------------------------------------------------------- | :-------------------------------------------- |
| `DOCS_LAYOUT` read only by `components/docs/dispatch.tsx`    | any layout reads the flag                     |
| `app/docs/**\/page.tsx` imports no layout                    | the page couples to a shell                   |
| no file in `components/docs/layouts/` imports `@/lib/source` | a layout fetches instead of receiving         |
| no layout renders `<TableOfContents />`                      | a layout pins the TOC to the top of the route |
| some layout publishes `data-docs-scroll-root`                | the scroll spy would watch the viewport       |
| no `border-*` / `shadow-*` in `components/docs/**`           | chrome reappears (rule 9a)                    |

> The layout read the flag into a file _and_ passed every test — it simply always resolved to the
> same shell. The gates exist because that class of bug is invisible from the outside.

---

## 9. Phase 5 — Fumadocs MDX Docs Engine

**Goal:** `/docs/*` renders MDX from `content/docs` with badges, icons, TOC, breadcrumbs,
Copy-MD, prev/next and search — the whole pipeline, minus library-specific bits.

### 9.0 File map

| Target                          | Tag              | Reference source                    |
| :------------------------------ | :--------------- | :---------------------------------- |
| `source.config.ts`              | `[COPY]`         | `.../source.config.ts`              |
| `lib/source.tsx`                | `[COPY]`         | `.../lib/source.tsx`                |
| `content/docs/**`               | `[NEW]`          | — (§9.3)                            |
| `lib/docs-page.tsx`             | `[COPY + ADAPT]` | `.../lib/docs-page.tsx`             |
| `app/docs/[[...slug]]/page.tsx` | `[COPY + ADAPT]` | `.../app/docs/[[...slug]]/page.tsx` |
| `components/mdx-components.tsx` | `[COPY + ADAPT]` | `.../components/mdx-components.tsx` |
| `app/api/search/route.ts`       | `[COPY + ADAPT]` | `.../app/api/search/route.ts`       |

### 9.1 source.config.ts `[COPY]`

```bash
cp /home/satishkumar/Desktop/ui-satis/source.config.ts source.config.ts
```

```ts
import { pageSchema } from "fumadocs-core/source/schema"
import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { z } from "zod"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      component: z.boolean().default(false),
      hideToc: z.boolean().default(false),
      hideCopy: z.boolean().default(false),
      comingSoon: z.boolean().default(false),
      wide: z.boolean().default(false),
      badge: z.enum(["new", "updated", "beta", "deprecated"]).optional(),
      author: z.string().optional(),
      date: z.string().optional(),
      links: z
        .object({
          preview: z.string().url().optional(),
          github: z.string().url().optional(),
        })
        .optional(),
      registryKeys: z.array(z.string()).optional(),
      media: z
        .object({ image: z.string(), video: z.string().optional() })
        .optional(),
    }),
  },
})

export default defineConfig()
```

**Keep this schema exactly.** Every frontmatter flag below is wired to real behaviour,
and `registryKeys` + `media` are what let a docs page mount a live preview (§10).

| Frontmatter                     | Type                                   | Behaviour                                                                                     |
| :------------------------------ | :------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `title`, `description`          | string                                 | Page header + OG + search index                                                               |
| `component`                     | boolean (false)                        | Marks a page as part of the component catalogue (sidebar grouping)                            |
| `wide`                          | boolean (false)                        | Widens the article to `max-w-[1440px]` — for catalogs/grids                                   |
| `hideToc`                       | boolean (false)                        | Hides the right-hand TOC (and drops the two-column grid)                                      |
| `hideCopy`                      | boolean (false)                        | Hides the "Copy MD" button                                                                    |
| `comingSoon`                    | boolean (false)                        | Injects the primary `SOON` chip into the sidebar entry                                        |
| `badge`                         | `new`\|`updated`\|`beta`\|`deprecated` | Colored status dot (with `animate-ping` for `new`) in the sidebar + a pill in the page header |
| `author`, `date`                | string                                 | Optional byline metadata                                                                      |
| `links.preview`, `links.github` | url                                    | Buttons in the `ComponentPreviewer` header                                                    |
| `registryKeys`                  | string[]                               | Mounts live demos from `registry/index.ts`                                                    |
| `media.image`, `media.video`    | string                                 | Sidebar hover-preview card + media-only demo entries                                          |

### 9.2 lib/source.tsx `[COPY]`

```bash
cp /home/satishkumar/Desktop/ui-satis/lib/source.tsx lib/source.tsx
```

This is the docs brain. Copy it **verbatim** — it, plus the `collections/*` tsconfig path,
is what makes MDX work in this stack. What it does:

1. `import { docs } from "collections/server"` — generated by `fumadocs-mdx` into `.source/`
   (gitignored) and resolved through the `collections/*` → `./.source/*` path alias.
2. Builds the loader with `baseUrl: "/docs"`.
3. Registers `typedPlugin({ transformPageTree: { file, folder } })`, which reads each MDX
   file's `badge` / `comingSoon` frontmatter and **rewrites the page-tree node name** into a
   React fragment: the label plus a primary `SOON` chip, and/or a status dot
   (emerald `animate-ping` for `new`, blue `updated`, amber `beta`, rose `deprecated`),
   with deprecated pages struck through. It deliberately stores only **primitives**
   (`node._badge`, `node._comingSoon`) to keep Server Components serializable.
4. Provides `icon(iconString)`: resolves `icon:` values from `meta.json` against
   `@hugeicons/core-free-icons`, accepting either the exact export (`MagnifyingGlassIcon`)
   or a kebab-case name (`magnifying-glass` → `MagnifyingGlassIcon`), rendered at `size-5`.

> Because it reaches into `allHugeicons`, adding a new icon to a `meta.json` needs no
> code change — just use a valid Hugeicons export name.

### 9.3 content/docs — the starter docs tree `[NEW]`

```
content/docs/
├─ meta.json
├─ index.mdx                     → /docs
├─ changelog.mdx                 → /docs/changelog
├─ getting-started/
│  ├─ meta.json
│  ├─ installation.mdx
│  └─ project-structure.mdx
└─ components/
   ├─ meta.json
   └─ sample-component.mdx       (registryKeys: ["sample-component"])
```

`content/docs/meta.json`:

```json
{
  "title": "Documentation",
  "pages": ["index", "getting-started", "components", "changelog"]
}
```

`content/docs/getting-started/meta.json`:

```json
{ "title": "Getting Started", "pages": ["installation", "project-structure"] }
```

`content/docs/components/meta.json`:

```json
{ "title": "Components", "icon": "BlocksIcon", "pages": ["sample-component"] }
```

`content/docs/index.mdx`:

```mdx
---
title: Introduction
description: What this starter gives you and how it is organised.
---

Welcome. This project is an **App + Docs** starter: a tool surface at `/app` and
MDX documentation at `/docs`, sharing one design system.

## What is included

- OKLCH design tokens, four fonts, animated theme switching
- Two docs layouts (Spatial / Standard) chosen from `lib/config.ts`
- A registry + previewer pipeline for live, copyable component demos
- `llms.txt` / `llms-full.txt` generated on every build

<Callout>Replace this page first — it is the one every visitor reads.</Callout>
```

`content/docs/getting-started/installation.mdx`:

````mdx
---
title: Installation
description: Create a project, install dependencies and run the dev server.
---

<CommandBlock
  commands={{
    pnpm: "pnpm install",
    npm: "npm install",
    yarn: "yarn",
    bun: "bun install",
  }}
/>

Then start the dev server:

```bash
pnpm dev
```
````

The app is at `http://localhost:3000`, the docs at `/docs`.

````

`content/docs/changelog.mdx` — kept minimal; §12 wires changesets into it:

```mdx
---
title: Changelog
description: Release notes for this project.
wide: true
hideToc: true
---

<Badge>v0.1.0</Badge>

Initial release of the Satisium Starter.
````

> Every `title` in a `meta.json` or frontmatter becomes a sidebar label; every `icon`
> must be a valid Hugeicons export (§9.2).

### 9.4 lib/docs-page.tsx `[COPY + ADAPT]`

```bash
cp /home/satishkumar/Desktop/ui-satis/lib/docs-page.tsx lib/docs-page.tsx
```

Four exports, all used by the docs page:

| Export                                                                        | What it does                                                                                                                                                                                             |
| :---------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getLastModifiedTime(pagePath, owner, repo)`                                  | React-`cache`d GitHub last-edit lookup via `getGithubLastEdit`, 5-minute in-process TTL, formatted `en-US` short date. **Returns `null` in development** and on any error. Reads `process.env.GIT_TOKEN` |
| `getDocCopyPayload(pagePath)`                                                 | Powers **Copy MD**: prefers `public/llms/<path>.md` (the LLM build's per-page markdown, §12), falls back to the raw `content/docs/<path>` file, else `""`                                                |
| `resolveDocDemos(page)`                                                       | Maps `registryKeys` → `DemoData[]` for the previewer. Respects `type: "react"                                                                                                                            | "video" | "image"`and`renderMode: "direct" | "iframe"`; pulls file strings from `item.getFiles()`for the code dialog; sets`embedUrl`to`/embed/<key>` for iframes |
| `getDocBreadcrumbSchema(slugPath)` / `getDocEntitySchema(title, description)` | JSON-LD (`BreadcrumbList`, `SoftwareSourceCode`) injected by the docs page                                                                                                                               |

**Adaptations:**

1. Derive the defaults from `REPO` in `lib/social-links.ts` instead of hardcoding them
   (the reference hardcodes `owner = "satisium"`, `repo = "ui"`):

   ```ts
   const [DEFAULT_OWNER, DEFAULT_REPO] = REPO.split("/")

   export const getLastModifiedTime = cache(
     async (
       pagePath: string,
       owner = DEFAULT_OWNER,
       repo = DEFAULT_REPO
     ): Promise<string | null> => {
       /* unchanged */
     }
   )
   ```

2. Leave the cache/ttl/dev-guard logic exactly as written.

### 9.5 app/docs/[[...slug]]/page.tsx `[COPY + ADAPT]`

```bash
mkdir -p "app/docs/[[...slug]]"
cp '/home/satishkumar/Desktop/ui-satis/app/docs/[[...slug]]/page.tsx' 'app/docs/[[...slug]]/page.tsx'
```

Then apply **exactly these five edits** (everything else stays byte-identical):

| #   | Where                | Change                                                                                                                                                                                     |
| :-- | :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | line 1               | Delete `import { DocTracker } from "@/components/doc-tracker"`                                                                                                                             |
| 2   | lines 158–162        | Delete the whole `<DocTracker … />` element (analytics-only)                                                                                                                               |
| 3   | lines 130–148        | Replace the components-catalog logic with one general flag:<br />`const isCatalogPage = Boolean(page.data.wide)` — and delete the `categoryCount` block entirely                           |
| 4   | lines 211–215        | Delete the `{categoryCount !== null && (…)}` JSX fragment                                                                                                                                  |
| 5   | lines 52–53, 87, 100 | Replace the hardcoded Satisium copy: the `genericDescription` fallback → `` `Explore the ${page.data.title} page of the ${PRODUCT.name} documentation.` `` and both `` `${page.data.title} | Satisium UI` `` titles → `` `${page.data.title} | ${PRODUCT.name}` `` (import `PRODUCT`from`@/lib/config`) |

**Keep untouched — these are the engine:** `generateStaticParams()` (`source.generateParams()`),
`generateMetadata()` (canonical URL, `article:published_time/modified_time/section/tag` meta,
`/api/og?title=…&label=…` OG image), `getDocCopyPayload` + `resolveDocDemos` +
`getLastModifiedTime` in one `Promise.all`, `findNeighbour` prev/next pagination, the
`getBadgeStyle` pill map, the `ComponentPreviewer` mount (`resolvedDemos.length > 0` →
`h-screen w-full` section above the article), the `hideToc` grid switch
(`lg:grid-cols-[minmax(0,1fr)_240px]`), the sticky `TableOfContents` aside, and both
JSON-LD scripts.

### 9.6 components/mdx-components.tsx `[COPY + ADAPT]`

```bash
cp /home/satishkumar/Desktop/ui-satis/components/mdx-components.tsx components/mdx-components.tsx
```

**Edit 1 — change the imports (delete `RegistryGrid`, add `Callout`):**

```tsx
import { cn } from "@/lib/utils"
import Link from "next/link"
import * as React from "react"
import { CodeBlock } from "./code-block/code-block"
import { CommandBlock } from "@/components/command-block"
import { Badge } from "@/components/ui/badge"
import { Callout } from "./callout"
```

(and delete `RegistryGrid` from the trailing export list, keeping
`CommandBlock`, `Badge`, `CodeBlock`, `Callout`).

**Edit 2 — keep every element mapping verbatim.** The `h1…h6, p, ul, ol, li, blockquote,
a, strong, code, pre, table, thead, tbody, tr, th, td` overrides _are_ the docs typography
system (table row hover, hairline separation, rounded table shell, primary-tinted inline
code, external-link handling). Do not restyle them individually.

**Edit 3 — add the missing `components/callout.tsx` `[NEW]`** so docs can use callouts
without pulling in `fumadocs-ui`:

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

type CalloutType = "info" | "warn" | "success" | "idea"

const STYLES: Record<CalloutType, string> = {
  info: "border-blue-500/30 bg-blue-500/5 [&_[data-callout-icon]]:text-blue-500",
  warn: "border-amber-500/30 bg-amber-500/5 [&_[data-callout-icon]]:text-amber-500",
  success:
    "border-emerald-500/30 bg-emerald-500/5 [&_[data-callout-icon]]:text-emerald-500",
  idea: "border-primary/30 bg-primary/5 [&_[data-callout-icon]]:text-primary",
}

export function Callout({
  type = "info",
  title,
  children,
  className,
}: {
  type?: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-3xl border p-5 text-sm leading-relaxed text-muted-foreground",
        STYLES[type],
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {title && (
          <p
            data-callout-icon
            className="mb-1 font-heading font-bold text-foreground"
          >
            {title}
          </p>
        )}
        <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  )
}
```

**CommandBlock idiom (fix your sample page from §9.3):** the component takes
`{ title?, pkg?, cli?, command?, commands?, className? }` and resolves them in this exact order
— **`commands[manager]` → `pkg` → `cli` → `command`** — so never pass two of them:

| Prop       | Renders (PNPM)                                | Use for                               |
| :--------- | :-------------------------------------------- | :------------------------------------ |
| `commands` | your string per PM, verbatim                  | full control when the four PMs differ |
| `pkg`      | `pnpm add <pkg>` (PM-aware)                   | dependency installs                   |
| `cli`      | `pnpm dlx shadcn@latest add <cli>` (PM-aware) | registry installs                     |
| `command`  | your command, runner rewritten per PM         | the default — house style             |

The house style is a single raw `command` (the PM dropdown rewrites `npx`/`pnpm dlx`/`yarn dlx`/`bunx` automatically):

```mdx
<div className="mt-6">
  <CommandBlock
    command="npx shadcn@latest add https://your-domain.com/r/sample-component.json"
    title="sample-component"
  />
</div>

**Manual install** — install the peer deps, then paste the source:

<div className="mt-6">
  <CommandBlock pkg="motion clsx tailwind-merge" title="Dependencies" />
</div>
```

Use `commands={{ pnpm: "…", npm: "…", yarn: "…", bun: "…" }}` only when the four PMs
differ in more than the runner prefix.

### 9.7 app/api/search/route.ts `[COPY + ADAPT]`

```bash
mkdir -p app/api/search && cp /home/satishkumar/Desktop/ui-satis/app/api/search/route.ts app/api/search/route.ts
```

The reference wraps the Fumadocs "advanced" search API in an Upstash rate limiter. With
Redis excluded (§3.4), write it without the limiter:

```ts
import { source } from "@/lib/source"
import { createSearchAPI } from "fumadocs-core/search/server"

const searchAPI = createSearchAPI("advanced", {
  indexes: source.getPages().map((page) => ({
    title: page.data.title,
    description: page.data.description,
    structuredData: page.data.structuredData,
    id: page.url,
    url: page.url,
  })),
})

export async function GET(req: Request) {
  return searchAPI.GET(req)
}
```

> Need abuse protection later? Re-add it exactly as the reference does, behind the Upstash
> env vars in §15 — the signature `checkRateLimit(identifier)` stays the same.

### 9.8 Phase 5 validation — first real boot

```bash
pnpm dev
```

Smoke test (this is the first phase where the app must actually run):

| Check                         | Expected                                                                            |
| :---------------------------- | :---------------------------------------------------------------------------------- |
| `http://localhost:3000/docs`  | Introduction page renders inside the **SpatialLayout** card                         |
| Press `M`                     | Sidebar slides in, card scales to 0.95, shadow fades in after the card settles      |
| Press `D`                     | Animated light/dark sweep from the keyboard "click" origin                          |
| `⌘K` / `Ctrl+K`               | Command palette opens and lists your docs pages                                     |
| Sidebar badges                | `band: "new"` shows a pinging emerald dot; `comingSoon: true` shows the `SOON` chip |
| Any page with `hideToc: true` | Full-width single-column article                                                    |
| "Copy MD"                     | Copies the page markdown (from MDX until §12 generates `public/llms/*.md`)          |
| "Last Modified"               | Hidden in dev (GitHub lookup is skipped) — verify it after a prod build             |
| `pnpm typecheck`              | Passes                                                                              |

**Done when:** `/docs` renders with TOC + breadcrumbs + prev/next, and `NEXT_PUBLIC_DOCS_LAYOUT=simple pnpm dev`
renders the same content in the borderless three-pane layout.

---

## 10. Phase 6 — The Code Block Engine

**Goal:** a themed, multi-file, collapsible, copyable code viewer available in MDX and in
the previewer's code dialog.

### 10.0 File map

| Target                                   | Tag          | Lines (ref) |
| :--------------------------------------- | :----------- | :---------- |
| `components/code-block/code-block.tsx`   | `[COPY]`     | 421         |
| `components/code-block/code-display.tsx` | `[COPY]`     | 103         |
| `components/code-block/sidebar.tsx`      | `[COPY]`     | 183         |
| `components/code-block/tree-utils.ts`    | `[COPY]`     | 42          |
| `components/code-block/constants.ts`     | `[COPY]`     | 22          |
| `components/code-block/types.ts`         | `[COPY]`     | 29          |
| `lib/analytics.ts`                       | `[NEW shim]` | —           |
| `hooks/use-track-event.ts`               | `[NEW shim]` | —           |

### 10.1 Copy

```bash
mkdir -p components/code-block
cp /home/satishkumar/Desktop/ui-satis/components/code-block/* components/code-block/
```

### 10.2 Write the two no-op shims (do this **before** copying, so nothing breaks)

The reference calls `useTrackEvent()` from `code-block.tsx` and `command-block.tsx`, and
`trackEvent()` from `command-menu.tsx` and the docs page. **Copy the real implementations**
(`hooks/use-track-event.ts` + `lib/analytics.ts`) — they are zero-key safe (§18.2), so the
starter tracks nothing until a PostHog token is present.

⚠️ **Do not narrow either signature.** `trackEvent(eventName, properties?, incrementPublicCounter?)`
takes **three** parameters, and `useTrackEvent()` returns a `(...args) => void`. The reference
calls `trackCopy("cli_command_copied", { … }, "web_copy")` with all three.

**Only if you decide to ship without analytics at all** do you replace them with the inert
shims below (identical call sites, silent behaviour):

`lib/analytics.ts`:

```ts
/**
 * No-op analytics shim.
 * The reference implementation posts to PostHog + Upstash; the starter ships inert.
 * To enable tracking, replace the body of `trackEvent` (see §15).
 */
export async function trackEvent(..._args: unknown[]): Promise<void> {
  // intentionally empty
}
```

`hooks/use-track-event.ts`:

```ts
"use client"

/**
 * No-op analytics hook. Returns a stable callback so components can call
 * `trackCopy({...})` unconditionally. See §15 to wire a real provider.
 */
export function useTrackEvent() {
  return (..._args: unknown[]) => {
    // intentionally empty
  }
}
```

### 10.3 The contract — components/code-block/types.ts

```ts
export interface CodeFile {
  code: string
  language?: string
  highlightLines?: number[]
  addLines?: number[]
  removeLines?: number[]
  focusOnly?: boolean
}

export interface CodeBlockProps {
  files: Record<string, CodeFile | string>
  defaultFile?: string
  height?: string | number
  expandable?: boolean
  initialExpanded?: boolean
  showLineNumbers?: boolean
  className?: string
}

export type FileNode = { name: string; type: "file"; path: string }
export type FolderNode = {
  name: string
  type: "folder"
  path: string
  children: TreeNode[]
}
export type TreeNode = FileNode | FolderNode
```

`files` keys become the tree paths (`"components/ui/pulse-card.tsx"` produces nested
folders automatically), values are either raw strings or `CodeFile` objects when you want
line decorations.

### 10.4 Tuning constants — components/code-block/constants.ts

| Constant           | Value | Meaning                                            |
| :----------------- | :---- | :------------------------------------------------- |
| `BASE_PADDING`     | `12`  | Left padding of the tree at depth 0 (px)           |
| `DEPTH_OFFSET`     | `22`  | Added per folder level (px)                        |
| `COLLAPSED_HEIGHT` | `380` | Height before the "expand" affordance appears (px) |
| `scrollbarClasses` | —     | The shared thin, border-tinted scrollbar recipe    |

### 10.5 What `code-block.tsx` does (so you can extend it safely)

- **One Shiki highlighter per process.** A module-level `highlighterPromise`
  (`createHighlighter(...)`) is created once and reused — never call `createHighlighter`
  inside a component body.
- **Theme-aware.** It re-highlights when `resolvedTheme` from `next-themes` changes, and
  waits for mount (`mounted`) before rendering highlighted HTML to avoid hydration drift.
- **Multi-file tree.** `buildTree()` + `SidebarTree` + `getIconForFile()` render a file tree
  with per-extension icons; `defaultFile` picks the initial file, otherwise the first key.
- **Collapse / expand.** Honours `height`; when taller than `COLLAPSED_HEIGHT` and
  `expandable`, it clamps and reveals an expand toggle (`initialExpanded` starts open).
- **Line decoration.** `highlightLines`, `addLines`, `removeLines`, `focusOnly` are all
  supported per file.
- **Copy.** A copy button with a success state (`trackCopy(...)` is now inert, see §10.2).
- **Responsive sidebar.** `isDesktopSidebarOpen` (default `true`) and a separate
  `isMobileSidebarOpen` drawer; `showLineNumbers` defaults to `true`.

### 10.6 Using it

**In MDX** — import the generated source strings (see §11.4):

```mdx
import { pulseCardFile, pulseCardDemoFile } from "@/registry/strings/pulse-card"

<CodeBlock
  files={{
    "components/ui/pulse-card.tsx": pulseCardFile,
    "demos/pulse-card-demo.tsx": pulseCardDemoFile,
  }}
  defaultFile="components/ui/pulse-card.tsx"
  expandable
/>
```

**In the previewer** — nothing to wire: `ComponentPreviewer` passes `item.getFiles()`
output straight into the fullscreen code dialog.

### 10.7 Phase 6 validation

```bash
pnpm typecheck && pnpm lint && pnpm dev
```

Open `/docs/getting-started/installation` (it uses `CommandBlock`) and confirm the PM tabs
switch and the copy button flips to "Copied!". Add a temporary `<CodeBlock>` to any MDX
page to confirm highlighting, the file tree and the collapse toggle.

**Done when:** all six code-block files exist, the two shims compile, and no file under
`components/` imports anything from an excluded analytics module.

---

## 11. Phase 7 — Registry & Previewer Engine

**Goal:** live component demos inside docs, a fullscreen playground, isolated iframe renders,
and a `shadcn` CLI distribution pipeline (`/r/<name>.json`).

### 11.0 File map

| Target                                                     | Tag       | Notes                                                          |
| :--------------------------------------------------------- | :-------- | :------------------------------------------------------------- |
| `components/previewer/component-preview.tsx`               | `[COPY]`  | 7-file previewer core                                          |
| `components/previewer/resizable-playground.tsx`            | `[COPY]`  | `ViewportMode = "desktop" \| "tablet" \| "mobile" \| "custom"` |
| `components/previewer/preview-toolbox.tsx`                 | `[COPY]`  | `AnchorPosition` + floating controls                           |
| `components/previewer/preview-background.tsx`              | `[COPY]`  | Checker/grid backdrop                                          |
| `components/previewer/fullscreen-toolbox.tsx`              | `[COPY]`  | Fullscreen chrome (uses `CommandMenuTrigger`)                  |
| `components/previewer/fullscreen-code-dialog.tsx`          | `[COPY]`  | Fullscreen source viewer                                       |
| `components/previewer/iframe-bridge-provider.tsx`          | `[COPY]`  | Theme + reload bridge (`SATISIUM_RELOAD_ANIMATION`)            |
| `registry/index.ts`                                        | `[NEW]`   | 1 sample item (§11.4)                                          |
| `registry/ui/pulse-card.tsx`                               | `[NEW]`   | Sample distributable component                                 |
| `registry/demos/components/pulse-card/pulse-card-demo.tsx` | `[NEW]`   | Default-export demo                                            |
| `registry/strings/pulse-card.ts`                           | `[NEW]`   | Source-as-string exports                                       |
| `registry/meta.ts`                                         | generated | `pnpm build:registry:meta`                                     |
| `registry.json`                                            | `[NEW]`   | Input for `npx shadcn build`                                   |
| `app/embed/[registryKey]/page.tsx`                         | `[COPY]`  |                                                                |
| `app/preview/[registryKey]/page.tsx`                       | `[COPY]`  |                                                                |
| `scripts/build-registry-meta.mjs`                          | `[COPY]`  |                                                                |

### 11.1 Copy the previewer + the meta script

```bash
mkdir -p components/previewer
cp /home/satishkumar/Desktop/ui-satis/components/previewer/* components/previewer/
mkdir -p scripts && cp /home/satishkumar/Desktop/ui-satis/scripts/build-registry-meta.mjs scripts/

mkdir -p 'app/embed/[registryKey]' 'app/preview/[registryKey]'
cp '/home/satishkumar/Desktop/ui-satis/app/embed/[registryKey]/page.tsx' 'app/embed/[registryKey]/page.tsx'
cp '/home/satishkumar/Desktop/ui-satis/app/preview/[registryKey]/page.tsx' 'app/preview/[registryKey]/page.tsx'
```

The previewer **must not be edited** — it is the most finely-tuned part of the system
(persisted widths, viewport modes, iframe messaging, scroll restoration).

### 11.2 How the previewer works

| Piece                                                                       | Role                                                                                                                                                                                                                                                   |
| :-------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ComponentPreviewer({ title, demos, githubUrl, previewUrl, sourceCodeId })` | The orchestrator mounted by the docs page. Renders one demo at a time with a switcher, honours `renderMode`, persists state to `localStorage` under `satisium-active-demo-*`, `satisium-code-open`, `satisium-preview-width`, `satisium-viewport-mode` |
| `renderMode: "direct"`                                                      | The component renders in the page DOM — fastest, best default                                                                                                                                                                                          |
| `renderMode: "iframe"`                                                      | The component renders inside `/embed/<key>`; use this when the component needs **real media queries** or its own viewport, since the docs shell would otherwise constrain it. It receives theme + reload messages through `IframeBridgeProvider`       |
| `ResizablePlayground`                                                       | Drag-to-resize device frame; `ViewportMode` presets desktop/tablet/mobile/custom                                                                                                                                                                       |
| `PreviewToolBox`                                                            | Floating controls anchored per `AnchorPosition`                                                                                                                                                                                                        |
| `FullscreenToolbox` + `FullscreenCodeDialog`                                | `/preview/<key>` chrome (command trigger, theme, code)                                                                                                                                                                                                 |
| `PreviewBackground`                                                         | Optional backdrop for transparent components                                                                                                                                                                                                           |

**The data contract** — `DemoData`, exactly as `resolveDocDemos()` builds it in
`lib/docs-page.tsx` (§9.4):

```ts
{
  key: string
  type: "react" | "video" | "image"
  name: string
  renderMode?: "direct" | "iframe"
  component?: React.ReactNode | null   // direct mode
  embedUrl?: string                    // `/embed/<key>` for iframe mode
  files?: Record<string, CodeFile | string>
  installCommand?: string
  previewUrl?: string
  mediaUrl?: string                    // video/image demos
}
```

### 11.3 The registry contract — registry/index.ts

```ts
import React from "react"
import { CodeFile } from "@/components/code-block/types"
import dynamic from "next/dynamic"

export interface RegistryItem {
  name: string
  type?: "react" | "video" | "image"
  /** "direct" (default) renders in the DOM; "iframe" renders via /embed for responsive layouts */
  renderMode?: "direct" | "iframe"
  component?: React.ComponentType
  installCommand?: string
  getFiles?: () => Promise<Record<string, CodeFile | string>>
  previewUrl?: string
  mediaUrl?: string
}

export const registry: Record<string, RegistryItem> = {
  // …items
}
```

Rules:

- Every `component` must be `dynamic(() => import("…").then((m) => m.default))` — the demos
  are client components and must stay out of the server bundle.
- `getFiles()` is what the fullscreen code dialog renders, and it reads from
  `registry/strings/*` (below).
- Keep `registry/index.ts` syntactically boring: `scripts/build-registry-meta.mjs` parses
  it **textually** (regex over `"slug": {` with brace matching) to emit `registry/meta.ts`.
  No computed keys, no spreads, no template-literal slugs.

### 11.4 The sample item `[NEW]`

**`registry/ui/pulse-card.tsx`**

```tsx
"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export interface PulseCardProps {
  title?: string
  description?: string
  className?: string
}

/**
 * PulseCard — the starter's canonical registry component.
 * Zero internal dependencies beyond `motion` + `cn`, so it installs cleanly via the CLI.
 */
export function PulseCard({
  title = "Pulse Card",
  description = "A minimal, distributable registry component.",
  className,
}: PulseCardProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-6",
        className
      )}
    >
      <motion.span
        aria-hidden="true"
        className="absolute -top-16 -right-16 size-40 rounded-full bg-primary/20 blur-2xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex flex-col gap-2">
        <h3 className="font-heading text-h5 font-bold text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
```

**`registry/demos/components/pulse-card/pulse-card-demo.tsx`**

```tsx
import { PulseCard } from "@/registry/ui/pulse-card"

export default function PulseCardDemo() {
  return (
    <div className="flex min-h-[320px] w-full items-center justify-center p-8">
      <PulseCard
        title="Pulse Card"
        description="Distributed through the registry, rendered by the previewer."
      />
    </div>
  )
}
```

**`registry/strings/pulse-card.ts`** — the sources as exported strings.

```ts
export const pulseCardFile = `/* paste registry/ui/pulse-card.tsx here */`

export const pulseCardDemoFile = `/* paste registry/demos/components/pulse-card/pulse-card-demo.tsx here */`
```

> When pasting into a template literal, escape every backtick and every `${` in the source
> (`\``, `\${`). The reference repo keeps these strings hand-synced; if you prefer, extend
`scripts/create-doc.mjs` (§13) to generate the file for you.

**`registry/index.ts`** — add the item:

```ts
  "pulse-card": {
    name: "Pulse Card",
    type: "react",
    renderMode: "direct",
    previewUrl: "/preview/pulse-card",
    component: dynamic(() =>
      import("@/registry/demos/components/pulse-card/pulse-card-demo").then(
        (m) => m.default
      )
    ),
    installCommand:
      "npx shadcn@latest add https://your-domain.com/r/pulse-card.json",
    getFiles: async () => {
      const mod = await import("@/registry/strings/pulse-card")
      return {
        "registry/ui/pulse-card.tsx": { code: mod.pulseCardFile, language: "tsx" },
        "registry/demos/components/pulse-card/pulse-card-demo.tsx": {
          code: mod.pulseCardDemoFile,
          language: "tsx",
        },
      }
    },
  },
```

Then mount it in `content/docs/components/sample-component.mdx`:

```mdx
---
title: Pulse Card
description: A minimal registry component rendered by the previewer.
component: true
badge: new
registryKeys: ["pulse-card"]
---

## Overview

<CommandBlock
  command="npx shadcn@latest add https://your-domain.com/r/pulse-card.json"
  title="pulse-card"
/>
```

### 11.5 registry.json — the CLI distribution surface `[NEW]`

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "starter-template",
  "homepage": "https://your-domain.com",
  "items": [
    {
      "name": "pulse-card",
      "type": "registry:component",
      "title": "Pulse Card",
      "description": "A minimal animated card used to demonstrate the registry pipeline.",
      "dependencies": ["motion"],
      "files": [
        { "path": "registry/ui/pulse-card.tsx", "type": "registry:component" }
      ]
    }
  ]
}
```

Build the payloads (this is the only reason `shadcn` is a runtime dependency):

```bash
pnpm registry:public      # npx shadcn build → public/r/*.json
pnpm build:registry:meta  # scripts/build-registry-meta.mjs → registry/meta.ts
```

That produces `public/r/pulse-card.json`, which consumers install with:

```bash
npx shadcn@latest add https://your-domain.com/r/pulse-card.json
```

> Ship `public/r/` in git — it is a static asset directory, not a build artifact.
> `registry/meta.ts` **is** generated and committed, so `git diff` shows registry drift.

### 11.6 app/embed — the isolated renderer `[COPY]`

```tsx
import { IframeBridgeProvider } from "@/components/previewer/iframe-bridge-provider"
import { registry } from "@/registry/index"
import { notFound } from "next/navigation"

/** Pre-builds static HTML for all iframe routes to guarantee instant loading. */
export async function generateStaticParams() {
  return Object.keys(registry)
    .filter((key) => registry[key].component)
    .map((registryKey) => ({ registryKey }))
}

export default async function EmbedPreviewPage(props: {
  params: Promise<{ registryKey: string }>
}) {
  const params = await props.params
  const item = registry[params.registryKey]

  if (!item || !item.component) notFound()

  const ComponentToRender = item.component

  return (
    <IframeBridgeProvider>
      <ComponentToRender />
    </IframeBridgeProvider>
  )
}
```

`IframeBridgeProvider` syncs the theme from the parent window and reacts to
`SATISIUM_RELOAD_ANIMATION` postMessages (the toolbox's replay button). It wraps the demo in
its own `ThemeProvider`, so `/embed/*` renders correctly even though the root layout's
providers are bypassed.

### 11.7 app/preview — the fullscreen page `[COPY]`

`/preview/<key>` renders the same registry component chrome-free, plus `FullscreenToolbox`
and the source dialog:

- `generateStaticParams()` over all registry keys with a `component`.
- `notFound()` for unknown keys; if an item has no `component` but does have a `previewUrl`,
  it **redirects** there (used by media entries).
- Resolves `getFiles()` into `Record<string, CodeFile | string>` for the code dialog and
  passes it through.

Both routes are already marked `X-Robots-Tag: noindex` by `next.config.mjs` (§4.3) — keep that.

### 11.8 Phase 7 validation

```bash
pnpm build:registry:meta   # prints "Found N entries" and writes registry/meta.ts
pnpm registry:public       # writes public/r/pulse-card.json
pnpm dev
```

| Check                               | Expected                                                                                        |
| :---------------------------------- | :---------------------------------------------------------------------------------------------- |
| `/docs/components/sample-component` | The previewer mounts above the article with the Pulse Card demo                                 |
| Playground controls                 | Viewport presets (desktop/tablet/mobile/custom) resize the frame; width persists across reloads |
| Code toggle                         | Opens the two-file viewer (tree + Shiki highlighting)                                           |
| `/preview/pulse-card`               | Chrome-free fullscreen render + toolbox                                                         |
| `/embed/pulse-card`                 | Isolated render that follows the parent theme; no site chrome                                   |
| `public/r/pulse-card.json`          | Contains the `files[].content` payload for the CLI                                              |

**Done when:** the sample component installs from the generated JSON in a scratch project
(`npx shadcn@latest add http://localhost:3000/r/pulse-card.json`).

---

## 12. Phase 8 — The App Space (Landing + `/app` canvas)

**Goal:** a minimalist landing page that routes people to the tool and the docs, plus a clean
canvas route to build the product in.

### 12.0 File map

| Target                                                                                                                                                                                       | Tag                | Reference source                                 |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- | :----------------------------------------------- |
| `components/home/minimal-theme-switcher.tsx`                                                                                                                                                 | `[COPY]`           | `.../components/home/minimal-theme-switcher.tsx` |
| `components/home/annotation.tsx`                                                                                                                                                             | `[COPY]`           | `.../components/home/annotation.tsx`             |
| `components/home/piano-typewriter.tsx`                                                                                                                                                       | `[COPY, optional]` | `.../components/home/piano-typewriter.tsx`       |
| `components/home/site-footer.tsx`                                                                                                                                                            | `[COPY + ADAPT]`   | `.../components/home/site-footer.tsx`            |
| `components/home/landing-hero.tsx`                                                                                                                                                           | `[NEW]`            | — (§12.2)                                        |
| `components/home/launchpad.tsx`                                                                                                                                                              | `[NEW]`            | — (§12.3)                                        |
| `app/page.tsx`                                                                                                                                                                               | `[NEW]`            | — (§12.4)                                        |
| `app/app/page.tsx`                                                                                                                                                                           | `[NEW]`            | — (§12.5)                                        |
| `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`                                                                                                                                 | `[COPY + ADAPT]`   | `.../app/*`                                      |
| `components/home/hero-section.tsx`, `intro-section.tsx`, `footer-section.tsx`, `kinetic-halo-ring.tsx`, `video-explore-button.tsx`, `mobile-restriction-warning.tsx`, `viewport-blocker.tsx` | `[EXCLUDE]`        | library-specific                                 |
| `app/test/**`, `app/privacy/**`, `components/component-card/**`, `lib/content-query.ts`                                                                                                      | `[EXCLUDE]`        | library-specific / analytics                     |

### 12.1 Copy the three brand components

```bash
cp /home/satishkumar/Desktop/ui-satis/components/home/minimal-theme-switcher.tsx components/home/minimal-theme-switcher.tsx
cp /home/satishkumar/Desktop/ui-satis/components/home/annotation.tsx components/home/annotation.tsx
cp /home/satishkumar/Desktop/ui-satis/components/home/piano-typewriter.tsx components/home/piano-typewriter.tsx
cp /home/satishkumar/Desktop/ui-satis/components/home/site-footer.tsx components/home/site-footer.tsx
```

| Component              | API                                                                                                                                                                                             | Notes                                                                                                                                                                                             |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `MinimalThemeSwitcher` | `() => JSX`                                                                                                                                                                                     | Naked 40×40 button that blooms into a 3-option pill **on hover** (desktop only) with `layoutId` sliding; SSR fallback matches the resting state exactly. Put it in the hero and the `/app` header |
| `Annotation`           | `{ targetId, path, title?, children?, targetAnchor?, svgAnchor?, size?, drawFrom?, textPosition?, svgRotation?, textClassName?, svgClassName?, strokeWidth?, strokeColor?, delay?, duration? }` | Hand-drawn Caveat label + SVG stroke, drawn on scroll into view. `targetId` is any element `id`; `path` is the SVG line asset                                                                     |
| `PianoTypewriter`      | `React.forwardRef` + `PianoTypewriterProps extends React.HTMLAttributes<HTMLElement>`                                                                                                           | Optional character-by-character headline                                                                                                                                                          |
| `SiteFooter`           | `() => JSX`                                                                                                                                                                                     | Full footer: brand column, link columns, `AUTHOR.x` + `PROJECT.github`                                                                                                                            |

**Adapt `site-footer.tsx`:** replace the `Satisium UI` wordmark with `PROJECT.name`, replace
the marketing paragraph with `PRODUCT.description`, and repoint the hardcoded link columns
from `/docs/getting-started/introduction` to your own docs routes (ours are
`/docs/getting-started/installation` and `/docs/components/sample-component`).

### 12.2 `[NEW]` components/home/landing-hero.tsx

```tsx
import { CommandMenuTrigger } from "@/components/layout/command-menu"
import { CommandBlock } from "@/components/command-block"
import { MinimalThemeSwitcher } from "@/components/home/minimal-theme-switcher"
import { ActionButton } from "@/components/ui/action-button"
import { PRODUCT } from "@/lib/config"
import { ArrowRight01Icon, Book02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function LandingHero() {
  return (
    <section className="relative mx-auto flex min-h-[88vh] w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-24 text-center">
      {/* Eyebrow */}
      <span className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-caption font-medium text-muted-foreground">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-1.5 animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
        </span>
        {PRODUCT.name} · v0.1.0
      </span>

      {/* Headline */}
      <h1 className="max-w-3xl text-display-lg text-balance text-foreground">
        Build the product, ship the docs —{" "}
        <span className="text-primary">from one template.</span>
      </h1>

      <p className="max-w-xl text-balance text-muted-foreground">
        {PRODUCT.description}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ActionButton
          label="Open the app"
          icon={<HugeiconsIcon icon={ArrowRight01Icon} />}
          href="/app"
        />
        <ActionButton
          label="Read the docs"
          icon={<HugeiconsIcon icon={Book02Icon} />}
          variant="outline"
          href="/docs"
        />
        <CommandMenuTrigger />
        <MinimalThemeSwitcher />
      </div>

      {/* The one command a newcomer needs */}
      <div className="w-full max-w-md">
        <CommandBlock
          title="Create from this template"
          command="git clone https://github.com/satisium/starter.git my-product && cd my-product && pnpm install && pnpm dev"
        />
      </div>
    </section>
  )
}
```

**Annotation (optional):** give the headline an `id` (e.g. `id="hero-headline"`) and drop in
an `<Annotation>` with a hand-drawn path, e.g.
`path="M2 12 C 40 2, 90 22, 130 8"`, `drawFrom="start"`, `textPosition="-bottom-14 left-1/2"`.
The `path` is a design asset — replace it with your own stroke.

### 12.3 `[NEW]` components/home/launchpad.tsx

The "Launchpad": four destinations, no marketing fluff.

```tsx
import Link from "next/link"

import { PRODUCT } from "@/lib/config"
import {
  ArrowUpRight01Icon,
  Book02Icon,
  BlocksIcon,
  CodeFolderIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const DESTINATIONS = [
  {
    href: "/app",
    label: "App",
    description: "The tool canvas — build your product here.",
    icon: SparklesIcon,
  },
  {
    href: "/docs",
    label: "Docs",
    description: `Everything about ${PRODUCT.name}, in MDX.`,
    icon: Book02Icon,
  },
  {
    href: "/docs/components/sample-component",
    label: "Components",
    description: "Live previews, source code and CLI installs.",
    icon: BlocksIcon,
  },
  {
    href: "/docs/getting-started/project-structure",
    label: "Structure",
    description: "Where every file lives and why.",
    icon: CodeFolderIcon,
  },
]

export function Launchpad() {
  return (
    <section className="mx-auto grid w-full max-w-5xl gap-4 px-6 pb-24 sm:grid-cols-2">
      {DESTINATIONS.map(({ href, label, description, icon }) => (
        <Link
          key={href}
          href={href}
          className="group relative flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
        >
          <span className="flex size-10 items-center justify-center rounded-2xl bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <HugeiconsIcon icon={icon} className="size-5" />
          </span>
          <span className="flex items-center gap-1 font-heading text-h6 font-bold text-foreground">
            {label}
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
            />
          </span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </Link>
      ))}
    </section>
  )
}
```

### 12.4 `[NEW]` app/page.tsx

```tsx
import { LandingHero } from "@/components/home/landing-hero"
import { Launchpad } from "@/components/home/launchpad"
import { SiteFooter } from "@/components/home/site-footer"
import { SITE_URL } from "@/lib/config"

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-background selection:bg-primary selection:text-primary-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
              },
            ],
          }),
        }}
      />

      <LandingHero />
      <Launchpad />
      <SiteFooter />
    </main>
  )
}
```

### 12.5 `[NEW]` app/app/page.tsx — the tool canvas

This is the surface you actually build the product in. Keep the shell, replace `<Canvas />`.

```tsx
import Link from "next/link"

import { CommandMenuTrigger } from "@/components/layout/command-menu"
import { MinimalThemeSwitcher } from "@/components/home/minimal-theme-switcher"
import { SatisiumLogo } from "@/components/satisium-logo"
import { PRODUCT } from "@/lib/config"

export const metadata = {
  title: "App",
  description: `The ${PRODUCT.name} workspace.`,
}

export default function AppPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/30">
      {/* Shell header */}
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center">
            <SatisiumLogo size="100%" />
          </span>
          <span className="font-heading text-base font-bold tracking-tight">
            {PRODUCT.name}
          </span>
        </Link>

        <span className="mx-2 h-5 w-px bg-border" />

        <CommandMenuTrigger />

        <div className="ml-auto flex items-center gap-2">
          <MinimalThemeSwitcher />
        </div>
      </header>

      {/* Canvas */}
      <main className="flex-1 p-4">
        <div className="flex h-full min-h-[60vh] items-center justify-center rounded-3xl border border-dashed border-border bg-background">
          <div className="flex max-w-md flex-col items-center gap-3 text-center">
            <h1 className="text-display-sm text-foreground">Your canvas</h1>
            <p className="text-sm text-muted-foreground">
              Replace this block with the tool. Keep the shell so navigation,
              the command menu and theme switching stay consistent with the
              docs.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
```

### 12.6 Error & 404 pages `[COPY + ADAPT]`

```bash
cp /home/satishkumar/Desktop/ui-satis/app/error.tsx app/error.tsx
cp /home/satishkumar/Desktop/ui-satis/app/global-error.tsx app/global-error.tsx
cp /home/satishkumar/Desktop/ui-satis/app/not-found.tsx app/not-found.tsx
```

**Required edit:** `app/error.tsx` and `app/global-error.tsx` are in the analytics grep —
delete any `trackEvent` / `@vercel/analytics` import and call; keep the layout, the message
and the reset button. `not-found.tsx` needs no edits.

### 12.7 Phase 8 validation

```bash
pnpm typecheck && pnpm dev
```

| Check             | Expected                                                               |
| :---------------- | :--------------------------------------------------------------------- |
| `/`               | Hero + Launchpad + footer; theme switcher blooms on hover (desktop)    |
| `/app`            | Tool shell with logo, ⌘K trigger, theme switcher and the dashed canvas |
| `/does-not-exist` | Branded 404                                                            |
| `pnpm build`      | No client/server boundary warnings                                     |

**Done when:** `/` and `/app` render, ⌘K works on both, and the footer links resolve to real
routes (no 404s).

---

## 13. Phase 9 — SEO, OG Images & Crawling

**Goal:** every route is shareable, indexable and machine-readable.

### 13.0 File map

| Target                                                                                 | Tag                | Notes                                             |
| :------------------------------------------------------------------------------------- | :----------------- | :------------------------------------------------ |
| `app/api/og/route.tsx`                                                                 | `[COPY + ADAPT]`   | Dynamic OG image (`next/og`)                      |
| `app/sitemap.ts`                                                                       | `[COPY + ADAPT]`   | Docs + landing + `/app`                           |
| `app/robots.ts`                                                                        | `[COPY]`           | Allow llms, disallow `/api`, `/embed`, `/preview` |
| `app/manifest.ts`                                                                      | `[COPY + ADAPT]`   | PWA manifest                                      |
| `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico`                                | `[REPLACE]`        | Satisium marks                                    |
| `public/satisium.png`, `public/og-bg-optimized.jpg`, `public/PlusJakartaSans-Bold.ttf` | `[REPLACE / COPY]` | OG inputs                                         |

### 13.1 app/api/og/route.tsx `[COPY + ADAPT]`

```bash
mkdir -p app/api/og && cp /home/satishkumar/Desktop/ui-satis/app/api/og/route.tsx app/api/og/route.tsx
```

**How it works:** `ImageResponse` from `next/og` (not `@vercel/og`) on the **nodejs**
runtime; it `readFile`s `public/PlusJakartaSans-Bold.ttf` so the image is set in Plus Jakarta
Sans, and it reads two query params — `title` (default "Animated UI Components") and
`label` (default "Open Source"). The colour tokens are hardcoded hex equivalents of the
theme: background `#090909`, foreground `#f8f8f8`, primary `#f2470c`. The composition is a
40px dark void → a `border-radius: 36px` card clipped to `overflow: hidden` → the
`og-bg-optimized.jpg` flame background → a 64px inner padding overlay with the brand lockup
top-left and the title/label bottom-left.

**Adaptations:**

1. Replace `public/satisium.png` (the mark in the lockup) and `public/og-bg-optimized.jpg`
   (the background) with your own 512×512 mark and a ~1200×630 background.
2. Keep `public/PlusJakartaSans-Bold.ttf` — it is the only reason the headline is on-brand.
3. Change the `Satisium UI` wordmark to `PRODUCT.name`; update the two default strings.
4. Do not switch the runtime to `edge`: reading a local font file needs Node.

Docs pages call it as `/api/og?title=<page title>&label=<SECTION>` (§9.5), so the OG image
automatically reflects the page you shared.

### 13.2 app/sitemap.ts `[COPY + ADAPT]`

```ts
import { MetadataRoute } from "next"
import { source } from "@/lib/source"
import { SITE_URL } from "@/lib/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docUrls = source.getPages().map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    // Keep only if the tool is meant to be crawled:
    {
      url: `${SITE_URL}/app`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docUrls,
  ]
}
```

> The reference sitemap lists only `/` + docs pages. The `/app` entry is an addition — delete
> it (and add `/app` to the `robots.ts` disallow list) if the tool is private.

### 13.3 app/robots.ts `[COPY]`

```ts
import { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/llms.txt", "/llms-full.txt", "/llms/"],
      disallow: ["/api/", "/test/", "/embed/", "/preview/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

Note how the disallow list matches the `X-Robots-Tag: noindex` headers in `next.config.mjs`
(§4.3) — two independent layers, both intentional.

### 13.4 app/manifest.ts `[COPY + ADAPT]`

```ts
import { MetadataRoute } from "next"
import { PRODUCT } from "@/lib/config"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PRODUCT.name,
    short_name: PRODUCT.shortName,
    description: PRODUCT.description,
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
```

### 13.5 Assets to place in `public/` and `app/`

| File                                                                     | Where        | Purpose                                                          |
| :----------------------------------------------------------------------- | :----------- | :--------------------------------------------------------------- |
| `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`                  | `[REPLACE]`  | Next auto-wires these into `<head>`                              |
| `public/android-chrome-192x192.png`, `public/android-chrome-512x512.png` | `[REPLACE]`  | Manifest icons                                                   |
| `public/satisium.png`                                                    | `[REPLACE]`  | OG lockup mark                                                   |
| `public/og-bg-optimized.jpg`                                             | `[REPLACE]`  | OG background (keep it lightweight, < 200 KB)                    |
| `public/PlusJakartaSans-Bold.ttf`                                        | `[COPY]`     | OG font — the single most important asset for on-brand OG images |
| `public/github-mark.svg`, `public/github-mark-white.svg`                 | `[COPY]`     | Used by GitHub links/buttons                                     |
| `public/cutting-mat.svg`                                                 | `[OPTIONAL]` | Decorative backdrop from the reference                           |

### 13.6 Metadata recap (already done in Phase 1)

`app/layout.tsx` carries: `metadataBase`, the `%s | <Product>` title template,
`alternates.types` (the `llms.txt` / `llms-full.txt` links), search-engine `verification`,
the OG + Twitter cards pointing at `/api/og`, and four JSON-LD graphs (`WebSite`,
`Organization`, `SoftwareApplication`, `WebPage`).

> ⚠️ The `WebSite` JSON-LD declares a `SearchAction` targeting `/docs/search?q={…}`. The
> reference has no such page (it uses the ⌘K palette instead). Either add a small search
> route/page, or delete the `potentialAction` block to avoid publishing a broken sitelinks
> search box.

### 13.7 Phase 9 validation

```bash
pnpm build && pnpm start
```

| Check      | Command / URL                                                   | Expected                                                                |
| :--------- | :-------------------------------------------------------------- | :---------------------------------------------------------------------- |
| OG image   | `curl -I 'http://localhost:3000/api/og?title=Hello&label=DOCS'` | `200`, `content-type: image/png`                                        |
| Sitemap    | `/sitemap.xml`                                                  | Landing + `/app` + every docs page                                      |
| Robots     | `/robots.txt`                                                   | Allows `/llms.txt`, disallows `/api/`, `/embed/`, `/preview/`           |
| Manifest   | `/manifest.webmanifest`                                         | Your product name + both icons resolve                                  |
| Share card | Paste a docs URL into any OG debugger                           | Title/label render on the flame background                              |
| JSON-LD    | Rich Results test on `/`                                        | `WebSite` + `Organization` valid (drop `SoftwareApplication` if unused) |

**Done when:** all six checks pass against a production build.

---

> 📌 **Section references.** Some earlier sections promise "§14 (acceptance checklist)" and
> "§15 (analytics)". In the final numbering those are **§16** and **§17**. The map is:
> §14 = Phase 10 (LLM pipeline) · §15 = Phase 11 (release & CI) · §16 = Phase 12 +
> acceptance checklist · §17 = optional extensions & per-product adaptation.

## 14. Phase 10 — The LLM / AI Discovery Pipeline

**Goal:** agents and IDEs can read the whole project as markdown, and the Copy-MD button
serves clean per-page markdown instead of raw MDX.

### 14.1 File map

| Target                       | Tag       | Notes                              |
| :--------------------------- | :-------- | :--------------------------------- |
| `scripts/build-llms.mjs`     | `[NEW]`   | Rewritten, general-purpose (below) |
| `scripts/create-doc.mjs`     | `[NEW]`   | Rewritten, general-purpose (below) |
| `scripts/sync-changelog.mjs` | `[NEW]`   | Rewritten, general-purpose (below) |
| `public/llms.txt`            | generated | The index agents read first        |
| `public/llms-full.txt`       | generated | Everything, concatenated           |
| `public/llms/**/*.md`        | generated | Per-page markdown (Copy-MD source) |

> **Why rewrite instead of copy?** The reference scripts are hard-wired to the library's
> taxonomy (`CATEGORY_ORDER = ["carousels", "image-effects", "text-reveals", "mouse-trails"]`,
> blocks, templates, CDN media URLs, `satisium-ui add …`). A general starter needs the same
> _outcome_ with a docs-shaped input. The three scripts below are complete, dependency-free
> and produce the same three artifacts — including the `public/llms/<path>.md` files that
> `getDocCopyPayload()` (§9.4) already looks for.

### 14.2 `[NEW]` scripts/build-llms.mjs

```js
#!/usr/bin/env node
/**
 * Builds the LLM surface from content/docs:
 *   public/llms/<path>.md  — per-page markdown (also the source for "Copy MD")
 *   public/llms-full.txt   — every page concatenated
 *   public/llms.txt        — the index agents read first
 *
 * Runs before every build: `"build": "node scripts/build-llms.mjs && next build"`.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")

const DOCS_DIR = path.join(ROOT, "content/docs")
const OUT_DIR = path.join(ROOT, "public/llms")
const OUTPUT_FULL = path.join(ROOT, "public/llms-full.txt")
const OUTPUT_INDEX = path.join(ROOT, "public/llms.txt")

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"
const PRODUCT_NAME = "Satisium Starter"

/** Recursively collect .md/.mdx files. */
function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, acc)
    else if (/\.mdx?$/.test(entry.name)) acc.push(full)
  }
  return acc
}

/** Minimal, dependency-free frontmatter reader (flat scalar keys only). */
function parseFrontmatter(raw) {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(raw)
  const data = {}
  let body = raw
  if (match) {
    body = raw.slice(match[0].length)
    for (const line of match[1].split("\n")) {
      const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line.trim())
      if (!kv) continue
      data[kv[1]] = kv[2].replace(/^["']|[\"']$/g, "")
    }
  }
  return { data, body }
}

/** Drop MDX-only syntax so the markdown reads cleanly for an LLM. */
function stripMdx(body) {
  return body
    .replace(/^\s*import\s.+$/gm, "")
    .replace(/<CommandBlock[\s\S]*?\/>/g, "")
    .replace(/^\s*<(div|section)[^>]*>\s*$/gm, "")
    .replace(/^\s*<\/(div|section)>\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.log("⚠️  content/docs not found — skipping LLM build.")
    return
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const pages = walk(DOCS_DIR)
    .sort()
    .map((file) => {
      const relative = path.relative(DOCS_DIR, file)
      const slug = relative.replace(/\.mdx?$/, "").replace(/(^|\/)index$/, "")
      const { data, body } = parseFrontmatter(fs.readFileSync(file, "utf-8"))

      return {
        slug,
        title: data.title || slug.split("/").pop() || "Introduction",
        description: data.description || "",
        section: slug.includes("/") ? slug.split("/")[0] : "Docs",
        url: `${SITE_URL}/docs${slug ? `/${slug}` : ""}`,
        markdown: stripMdx(body),
      }
    })

  // 1 — per-page markdown (getDocCopyPayload reads these first)
  for (const page of pages) {
    const target = path.join(
      OUT_DIR,
      page.slug ? `${page.slug}.md` : "index.md"
    )
    fs.mkdirSync(path.dirname(target), { recursive: true })
    const header = `# ${page.title}\n\n${page.description ? `> ${page.description}\n\n` : ""}`
    fs.writeFileSync(target, `${header}${page.markdown}\n`, "utf-8")
  }

  // 2 — llms-full.txt
  const fullHeader =
    `# ${PRODUCT_NAME} — Complete AI Knowledge Base\n\n` +
    `> Source: ${SITE_URL}\n> Generated: ${new Date().toISOString()}\n> Pages: ${pages.length}\n\n`
  const fullBody = pages
    .map(
      (page) =>
        `---\n\n# ${page.title}\n<source>${page.url}</source>\n\n${page.markdown}\n`
    )
    .join("\n")
  fs.writeFileSync(OUTPUT_FULL, fullHeader + fullBody, "utf-8")

  // 3 — llms.txt (grouped by top-level folder)
  const groups = new Map()
  for (const page of pages) {
    if (!groups.has(page.section)) groups.set(page.section, [])
    groups.get(page.section).push(page)
  }

  let index = `# ${PRODUCT_NAME}\n\n> ${SITE_URL}\n\n`
  for (const [section, items] of groups) {
    index += `## ${section}\n\n`
    for (const item of items) {
      index += `- [${item.title}](${item.url})${item.description ? ` — ${item.description}` : ""}\n`
    }
    index += "\n"
  }
  index += `## Optional\n\n- [Complete knowledge base](${SITE_URL}/llms-full.txt)\n`
  fs.writeFileSync(OUTPUT_INDEX, index, "utf-8")

  console.log(
    `✅ LLM build — ${pages.length} pages → public/llms/, llms-full.txt, llms.txt`
  )
}

main()
```

**Contract to preserve:** the per-page filename must equal the MDX path with the extension
swapped to `.md` (e.g. `content/docs/getting-started/installation.mdx` →
`public/llms/getting-started/installation.md`) — that is exactly what
`getDocCopyPayload()` and the `alternates.types` in `app/layout.tsx` expect.

### 14.3 `[NEW]` scripts/create-doc.mjs

```js
#!/usr/bin/env node
/**
 * pnpm make:doc <slug> [section]
 * Creates content/docs/<section>/<slug>.mdx and registers it in that section's meta.json.
 * Default section: getting-started.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const DOCS_DIR = path.join(ROOT, "content/docs")

const [slugArg, sectionArg = "getting-started"] = process.argv.slice(2)

if (!slugArg) {
  console.error("Usage: pnpm make:doc <slug> [section]")
  process.exit(1)
}

const slug = slugArg.toLowerCase().replace(/\s+/g, "-")
const section = sectionArg.toLowerCase().replace(/\s+/g, "-")
const dir = path.join(DOCS_DIR, section)
const file = path.join(dir, `${slug}.mdx`)

if (fs.existsSync(file)) {
  console.error(
    `✖ ${path.relative(ROOT, file)} already exists — nothing written.`
  )
  process.exit(1)
}

fs.mkdirSync(dir, { recursive: true })

const title = slug
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")

const template = `---\ntitle: ${title}\ndescription: TODO — one sentence. Used for SEO, search and the OG image.\n---\n\n## Overview\n\nWrite the page here.\n`

fs.writeFileSync(file, template, "utf-8")

// Keep the sidebar honest: add the slug to the section's meta.json
const metaPath = path.join(dir, "meta.json")
const fallbackTitle = section
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")
const meta = fs.existsSync(metaPath)
  ? JSON.parse(fs.readFileSync(metaPath, "utf-8"))
  : { title: fallbackTitle, pages: [] }

if (!Array.isArray(meta.pages)) meta.pages = []
if (!meta.pages.includes(slug)) meta.pages.push(slug)
fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, "utf-8")

console.log(`✅ Created ${path.relative(ROOT, file)}`)
console.log(`✅ Updated ${path.relative(ROOT, metaPath)}`)
```

### 14.4 `[NEW]` scripts/sync-changelog.mjs

Turns the `CHANGELOG.md` that Changesets maintains into a docs page, so `/docs/changelog`
is always the real, released history.

```js
#!/usr/bin/env node
/**
 * Copies CHANGELOG.md → content/docs/changelog.mdx with Fumadocs frontmatter.
 * Run after `pnpm release` (changeset version).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")

const CHANGELOG = path.join(ROOT, "CHANGELOG.md")
const TARGET = path.join(ROOT, "content/docs/changelog.mdx")

if (!fs.existsSync(CHANGELOG)) {
  console.log(
    "⚠️  No CHANGELOG.md yet — create one with `pnpm changeset` + `pnpm release`."
  )
  return
}

const pkg = JSON.parse(
  fs.readFileSync(path.join(ROOT, "package.json"), "utf-8")
)
const changelog = fs.readFileSync(CHANGELOG, "utf-8")

// Strip the auto-generated "# <package-name>" H1 so it does not clash with the page title
const clean = changelog.replace(new RegExp(`^# ${pkg.name}\\s*\\n+`, "m"), "")
const today = new Date().toISOString().slice(0, 10)

const frontmatter = `---\ntitle: Changelog\ndescription: Release notes for ${pkg.name}.\nwide: true\nhideToc: true\ndate: "${today}"\n---\n\n`

fs.writeFileSync(TARGET, frontmatter + clean, "utf-8")
console.log(`✅ Synced CHANGELOG.md → ${path.relative(ROOT, TARGET)}`)
```

Add the script to `package.json` (not present in the reference):

```json
"sync:changelog": "node scripts/sync-changelog.mjs"
```

### 14.5 Phase 10 validation

```bash
pnpm llm                 # → "✅ LLM build — N pages → public/llms/, llms-full.txt, llms.txt"
pnpm make:doc test-page  # → creates content/docs/getting-started/test-page.mdx + updates meta.json
node scripts/sync-changelog.mjs
```

| Check                                         | Expected                                                                         |
| :-------------------------------------------- | :------------------------------------------------------------------------------- |
| `public/llms.txt`                             | Heading, `> SITE_URL`, one section per top-level docs folder, links to each page |
| `public/llms-full.txt`                        | Every page, separated by `---` and tagged with `<source>` URLs                   |
| `public/llms/getting-started/installation.md` | Exists and is the cleaned markdown                                               |
| "Copy MD" on any docs page                    | Copies the **cleaned markdown** (proves `getDocCopyPayload` found the LLM file)  |
| `/llms.txt`, `/llms-full.txt` in the browser  | Served as static files                                                           |
| `pnpm make:doc`                               | Refuses to overwrite, and inserts the slug into `meta.json`                      |

**Done when:** the three generated artifacts match the docs tree, and Copy-MD returns the
markdown version of a page rather than raw MDX.

---

## 15. Phase 11 — Release, CI & Quality Gates

**Goal:** versioning, changelogs and CI that keep the template honest.

### 15.1 Changesets `[NEW]`

```bash
npx changeset init        # generates .changeset/config.json + .changeset/README.md
```

Then replace `.changeset/config.json` with (identical to the reference):

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.4/schema.json",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

**The flow** (matching the `package.json` scripts in §3.2):

```bash
pnpm changeset          # describe the change; pick patch/minor/major
pnpm release            # changeset version → bumps package.json + writes CHANGELOG.md
pnpm sync:changelog     # §14.4 → refreshes /docs/changelog
```

Optional beta channel (the reference ships `.changeset/pre.json` for `3.0.0-beta.*`):

```bash
pnpm beta:enter         # changeset pre enter beta
# …release as usual…
pnpm beta:exit          # changeset pre exit
```

> For a **starter template** (rather than a published package) you can keep changesets for
> the changelog only and skip version publishing — the value is a disciplined, dated release
> history that ends up on `/docs/changelog`.

### 15.2 `.github/workflows/ci.yml` `[COPY + ADAPT]`

```bash
mkdir -p .github/workflows
cp /home/satishkumar/Desktop/ui-satis/.github/workflows/ci.yml .github/workflows/ci.yml
cp /home/satishkumar/Desktop/ui-satis/.github/workflows/release.yml .github/workflows/release.yml
```

Adaptations for `ci.yml`: trim the branch list to `[main]` (the reference also watches
`beta` and `canary`), and change `paths-ignore` to skip docs-only edits
(`**.md`, `**.mdx`, `content/**`). Final shape:

```yaml
name: CI

on:
  pull_request:
    branches: [main]
    paths-ignore:
      - "**.md"
      - "**.mdx"
      - "content/**"
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
        with:
          version: 10
      - uses: actions/setup-node@v7
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    name: Typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
        with:
          version: 10
      - uses: actions/setup-node@v7
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
        with:
          version: 10
      - uses: actions/setup-node@v7
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          NEXT_PUBLIC_SITE_URL: https://example.com
```

The `env` block matters: `pnpm build` runs `scripts/build-llms.mjs` first, which reads
`NEXT_PUBLIC_SITE_URL` for the llms.txt links.

`release.yml` `[COPY + ADAPT]`: the reference wires `changesets/action` to open/merge a
"Version Packages" PR and tag releases. Keep it, but point the branch at `main` and drop the
`beta`/`canary` workarounds if you do not use them.

### 15.3 proxy.ts — `[EXCLUDE]` (deliberate)

The reference's root `proxy.ts` (Next 16 middleware) **redirects every mobile and tablet
visitor to `/` with `?device=mobile-restricted`** — it is a desktop-only product decision,
paired with `components/viewport-blocker.tsx` and
`components/home/mobile-restriction-warning.tsx`.

A general App + Docs starter must be responsive, so:

- Do **not** copy `proxy.ts`, `viewport-blocker.tsx` or `mobile-restriction-warning.tsx`.
- Do **not** add `MobileRestrictionWarning` to the landing page (§12.4).
- If you later build a tool that genuinely cannot run on phones, re-introduce the reference's
  `proxy.ts` verbatim — it already handles the `/r/*.json` passthrough, so registry installs
  keep working even on redirected devices.

### 15.4 Quality gates

| Gate        | Command          | Enforced by                                                                       |
| :---------- | :--------------- | :-------------------------------------------------------------------------------- |
| Types       | `pnpm typecheck` | CI `typecheck` job                                                                |
| Lint        | `pnpm lint`      | CI `lint` job                                                                     |
| Format      | `pnpm format`    | Prettier + `prettier-plugin-tailwindcss` (Tailwind class order, `cn`/`cva` aware) |
| Build       | `pnpm build`     | CI `build` job                                                                    |
| Bundle size | `pnpm analyze`   | Manual — opens the `@next/bundle-analyzer` report                                 |

There are **no git hooks** in the reference (no husky/lint-staged) — the workflow files are
where quality is enforced. Keep it that way unless you have a reason not to.

### 15.5 Phase 11 validation

- `npx changeset init` produced `.changeset/`; `pnpm changeset` opens the prompt.
- Both workflow files are valid YAML (`npx yaml-lint` or GitHub's editor).
- `pnpm lint && pnpm typecheck && pnpm build` all pass locally.
- A test PR shows three green checks: Lint, Typecheck, Build.

---

## 16. Phase 12 — Verification & Acceptance

### 16.1 Fresh-clone smoke test

```bash
pnpm install
pnpm typecheck && pnpm lint
pnpm build:registry:meta && pnpm registry:public
pnpm llm
pnpm build && pnpm start
```

Then walk the route matrix below against `pnpm start` (`http://localhost:3000`).

### 16.2 Route & feature matrix

| Route / action                            | Expected                                                                                                                                        |
| :---------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                       | Hero (eyebrow pill, display headline, three actions) + Launchpad cards + footer. No console errors                                              |
| `/app`                                    | Tool shell: logo + name, ⌘K trigger, theme switcher, dashed canvas                                                                              |
| `/docs`                                   | Introduction inside the **SpatialLayout** card                                                                                                  |
| `/docs/getting-started/installation`      | `CommandBlock` renders; PM tabs switch; copy → "Copied!"                                                                                        |
| `/docs/components/sample-component`       | `ComponentPreviewer` mounts above the article with the Pulse Card demo                                                                          |
| `/docs/changelog`                         | `wide` + `hideToc` layout (or a placeholder page before the first release)                                                                      |
| `/preview/pulse-card`                     | Chrome-free fullscreen demo + toolbox; `X-Robots-Tag: noindex`                                                                                  |
| `/embed/pulse-card`                       | Isolated render, follows parent theme; `noindex`                                                                                                |
| `/api/og?title=Hello&label=DOCS`          | PNG, 1200×630, Plus Jakarta Sans headline                                                                                                       |
| `/api/search?query=install`               | JSON results from the docs index                                                                                                                |
| `/r/pulse-card.json`                      | CLI payload with `files[].content`                                                                                                              |
| `/llms.txt`, `/llms-full.txt`             | Generated markdown; both allowed in `robots.txt`                                                                                                |
| `/sitemap.xml`                            | Landing + `/app` + every docs page                                                                                                              |
| `/robots.txt`                             | Disallows `/api/`, `/test/`, `/embed/`, `/preview/`                                                                                             |
| `/manifest.webmanifest`                   | Product name + both icons                                                                                                                       |
| `/nope`                                   | Branded 404                                                                                                                                     |
| `⌘K` (on `/`, `/app`, `/docs`)            | Palette opens, searches docs pages                                                                                                              |
| `D`                                       | Theme sweep from the keyboard origin                                                                                                            |
| `M`                                       | Spatial card shift (spatial layout only)                                                                                                        |
| `M` in the simple layout                  | Slides the sidebar rail in/out (both layouts)                                                                                                   |
| `NEXT_PUBLIC_DOCS_LAYOUT=simple pnpm dev` | Same docs content inside the rail layout                                                                                                        |
| `/docs/**` on a 390px viewport            | Readable and navigable via the drawer rail. ⚠️ **Requires the mobile pass in §21.6** — the reference blocks mobile entirely instead of adapting |

### 16.3 Parity ledger — what is identical, adapted, or excluded

| Area                                                                                                                                                          | Status                                                                              |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------- |
| `tsconfig.json`, `postcss`, `eslint`, `.prettierrc`, `.gitignore`                                                                                             | **Identical**                                                                       |
| `components.json`                                                                                                                                             | Identical except `ui` → `@/components/ui`                                           |
| `next.config.mjs`                                                                                                                                             | Identical minus PostHog rewrites + 1 redirect target                                |
| `globals.css`                                                                                                                                                 | Identical **plus** the `--font-display` fix                                         |
| `app/layout.tsx`                                                                                                                                              | Fonts/providers/JSON-LD kept; telemetry removed; 2 duplicate font `<link>`s dropped |
| Brand components (`satisium-logo`, `icons`, `action-button`, `copy-mdx-button`, `minimal-theme-switcher`, `annotation`, `theme-provider`, `theme-transition`) | **Verbatim**                                                                        |
| `command-block`, `coming-soon`, `sidebar-footer`, `site-footer`, `command-menu`, `sidebar-content`, `mdx-components`                                          | Copied + brand strings only                                                         |
| `spatial-layout`, `toc`, `page-breadcrumbs`, stores                                                                                                           | **Verbatim** (adapted to `DocsShellProps`)                                          |
| `use-scroll-spy`                                                                                                                                              | **Adapt** — optional `root` (§8.7)                                                  |
| `three-pane.tsx`                                                                                                                                              | **New** (the second layout)                                                         |
| Docs engine (`source.config`, `lib/source`, docs page, `docs-page.tsx`)                                                                                       | Copied; 5 surgical edits in the page, owner/repo in the helpers                     |
| Code block (6 files)                                                                                                                                          | **Verbatim** + 2 no-op analytics shims                                              |
| Previewer (7 files), `/embed`, `/preview`, `build-registry-meta.mjs`                                                                                          | **Verbatim**                                                                        |
| `sitemap.ts` / `robots.ts` / `manifest.ts` / `api/og`                                                                                                         | Copied + rebrand, sitemap enriched with `/app`                                      |
| Landing (`page.tsx`, hero, launchpad, `/app`)                                                                                                                 | **New**                                                                             |
| LLM + doc + changelog scripts                                                                                                                                 | **Rewritten** general-purpose                                                       |
| Analytics, consent, telemetry, Redis, proxy mobile gate, component-card grids, 54 motion components, canvas kit, test/privacy pages                           | **Excluded** (§17)                                                                  |

### 16.4 Definition of Done

1. `pnpm install && pnpm typecheck && pnpm lint && pnpm build` all succeed on a clean clone.
2. `pnpm dev` boots; `/`, `/app`, `/docs/*` render with correct theme in light **and** dark.
3. `D`, `M`, `⌘K` all work; typing in an input never triggers them. There is no `⌘B` — `M`
   is the only navigation shortcut.
4. Changing `NEXT_PUBLIC_DOCS_LAYOUT` between `simple` and `spatial` changes the docs shell
   without touching any docs content, and the choice is not switchable at runtime.
5. A new docs page can be added with `pnpm make:doc` and appears in the sidebar (with badge/icon support).
6. A new component can be added in four files (component, demo, strings, registry entry), previewed in docs, and installed via `/r/<name>.json`.
7. `pnpm build` regenerates `public/llms.txt`, `public/llms-full.txt` and `public/llms/**`.
8. No file in the repo mentions another product's brand, domain or component counts (except intentional Satisium branding).
9. No import resolves to an excluded module (`@/lib/redis`, `@/lib/consent`, `@/components/analytics-*`, `@/components/component-card/*`, `@/lib/content-query`, `@/components/viewport-blocker`, `@/components/home/hero-section`, `intro-section`, `footer-section`, `kinetic-halo-ring`, `video-explore-button`, `mobile-restriction-warning`).
10. `git status` is clean after a build (generated dirs are gitignored; `public/r`, `public/llms*` and `registry/meta.ts` are committed).

### 16.5 Brand-swap checklist (15 minutes per new product)

| Step | File                                                                                                                 |
| :--- | :------------------------------------------------------------------------------------------------------------------- |
| 1    | `PRODUCT` block in `lib/config.ts`                                                                                   |
| 2    | `PROJECT` / `AUTHOR` / `REPO` / `TWITTER_CREATOR` in `lib/social-links.ts`                                           |
| 3    | `NEXT_PUBLIC_SITE_URL` in `.env.local`                                                                               |
| 4    | `app/manifest.ts` (auto-reads `PRODUCT`)                                                                             |
| 5    | `app/api/og/route.tsx` — logo `src`, background, wordmark, default title/label                                       |
| 6    | `public/satisium.png`, `public/og-bg-optimized.jpg`, `app/icon.svg`, `app/apple-icon.png`, `public/android-chrome-*` |
| 7    | `components/home/site-footer.tsx` link columns                                                                       |
| 8    | `components/layout/sidebar-content.tsx` wordmark + credit link                                                       |
| 9    | `DOCS_LAYOUT` in `lib/config.ts` (`simple` vs `spatial`)                                                             |
| 10   | `registry.json` `name`/`homepage` + every `installCommand` domain                                                    |
| 11   | `scripts/build-llms.mjs` → `PRODUCT_NAME`                                                                            |
| 12   | `package.json` `name` (used by `sync-changelog` to strip the H1)                                                     |

---

## 17. Optional Extensions & Per-Product Adaptation

### 17.1 Analytics, consent & telemetry — **included by default**

These ship in the base template (§18) because every modern web app needs them, and they are
zero-key safe: with an empty `.env.local` the app boots, builds and tracks nothing. Configure
them with the env vars in §4.7 and follow the hardening rules + event taxonomy in §18.6.

The files that come from the reference for this layer: `lib/analytics.ts`,
`lib/consent.tsx`, `lib/consent-utils.ts`, `lib/rate-limit.ts`, `lib/redis.ts`,
`components/analytics-provider.tsx`, `components/posthog-pageview.tsx`,
`components/google-analytics.tsx`, `components/web-vitals.tsx`, `components/doc-tracker.tsx`,
`components/consent-banner.tsx`, `hooks/use-track-event.ts`, `app/api/telemetry/route.ts`.
Because every call site already goes through `trackEvent()` / `useTrackEvent()`, swapping or
adding a provider later still requires zero component changes.

### 17.2 Add 3D (WebGL) capability `[OPTIONAL]`

```bash
pnpm add three @react-three/fiber @react-three/drei && pnpm add -D @types/three
```

Only do this for products that ship 3D components; keep it out of the base bundle.

### 17.3 Porting the reference's motion components

If a product needs them, copy the reference's per-component flow — the starter keeps every
piece it depends on:

1. `registry/ui/<name>.tsx` (or a category folder) from the reference.
2. `registry/demos/components/<category>/<name>/…-demo.tsx` (default export).
3. `registry/strings/<name>.ts` (source-as-string exports).
4. An entry in `registry/index.ts` + `registry.json`, then `pnpm build:registry:meta && pnpm registry:public`.
5. A docs page with `registryKeys: ["<name>"]`, a `CommandBlock` install snippet and `<CodeBlock>` sources.

### 17.4 Deferred by design

- **Canvas / inspector kit** (scrubbable numeric controls, canvas grids, snap guides): build it inside the product that needs it, on top of `components/ui` + `hooks`, not in the starter.
- **Tool history (undo/redo), export/share engines**: domain logic — never belongs in a shared starter.
- **`component-card/*` catalog grids**: only useful to a component library; `lib/content-query.ts` and `components/changelog/registry-grid.tsx` were excluded with them.

### 17.5 Per-product starting points

| Product             | `PRODUCT.name`    | Docs layout | Add on top of the starter                                                                                             |
| :------------------ | :---------------- | :---------- | :-------------------------------------------------------------------------------------------------------------------- |
| **Satisium Pro UI** | `Satisium Pro UI` | `spatial`   | The motion components (§17.3), `component-card` catalog grids, paid-licence docs pages, `registry.json` per paid item |
| **Tweak**           | `Tweak`           | `standard`  | A control-panel/inspector kit (§17.4), a live-preview canvas at `/app`, export-to-code                                |
| **Typeset**         | `Typeset`         | `standard`  | A type-scale engine at `/app`, font-pairing previews, MDX type specimens                                              |

**Always keep:** the OKLCH tokens (same primary hue), the four fonts, the `rounded-3xl`
geometry, `ActionButton`, `MinimalThemeSwitcher`, the ⌘K palette and the `llms.txt` pipeline.
That shared spine is what makes the family recognisable.

> The mechanical side of this table — which paths each product actually keeps and deletes — is the
> preset system in §23.1, driven by `pnpm setup` (§23.2).

### 17.6 Canonical references in the source repo

| Need                                 | Look at                                                            |
| :----------------------------------- | :----------------------------------------------------------------- |
| Exactly how a page mounts demos      | `/home/satishkumar/Desktop/ui-satis/app/docs/[[...slug]]/page.tsx` |
| Exactly how the previewer behaves    | `.../components/previewer/component-preview.tsx`                   |
| Badge / SOON / icon plumbing         | `.../lib/source.tsx`                                               |
| The Spatial motion values            | `.../components/docs/layouts/spatial.tsx`                          |
| Registry entry idioms                | `.../registry/index.ts`                                            |
| LLM output format (library taxonomy) | `.../scripts/build-llms.mjs`                                       |

---

### End of Part I — the brand layer

Everything above (Phases 0–12) is the Satisium _shell_: identity, docs engine, registry, SEO,
LLM discovery and release.

**Part II follows** — the layers that turn that shell into a production app: analytics, consent
and observability (§18), tooling/DX/hygiene (§19), the testing and CI matrix (§20),
quality/security/compliance (§21), the module backlog (§22) and presets + generator (§23).
The template component library lives in the companion file **`component-kit.md`**.

---

## Part II — Product-grade layers

## 18. Phase 13 — Analytics, Consent & Observability

**Goal:** the "must-have in 2026" layer — product analytics, consent, web vitals, telemetry
counters, error tracking and a health endpoint — **on by default and completely inert without
keys**.

### 18.0 File map (all `[COPY]` from the reference unless noted)

| Target                                      | Source                                  | Role                                                          |
| :------------------------------------------ | :-------------------------------------- | :------------------------------------------------------------ |
| `components/analytics-provider.tsx`         | `.../components/analytics-provider.tsx` | PostHog init + consent gate                                   |
| `components/posthog-pageview.tsx`           | same                                    | SPA pageview capture                                          |
| `components/google-analytics.tsx`           | same                                    | GA4 (optional)                                                |
| `components/web-vitals.tsx`                 | same                                    | LCP/CLS/INP reporting                                         |
| `components/consent-banner.tsx`             | same                                    | Cookie/analytics consent UI                                   |
| `components/doc-tracker.tsx`                | same                                    | `doc_view` events                                             |
| `lib/analytics.ts`                          | same                                    | `trackEvent(eventName, properties?, incrementPublicCounter?)` |
| `lib/consent.tsx` + `lib/consent-utils.ts`  | same                                    | consent context + `hasConsent()`                              |
| `lib/rate-limit.ts`                         | same                                    | fail-open limiter                                             |
| `lib/redis.ts`                              | `[COPY + ADAPT]`                        | Upstash client **+ in-memory dev fallback** (§18.4)           |
| `hooks/use-track-event.ts`                  | same                                    | returns a `(...args) => void` tracker                         |
| `app/api/telemetry/route.ts`                | same                                    | public copy counters                                          |
| `app/api/health/route.ts`                   | `[NEW]`                                 | liveness + feature flags (§18.7)                              |
| `instrumentation.ts` + `sentry.*.config.ts` | `[NEW, OPTIONAL]`                       | error tracking (§18.5)                                        |

### 18.1 Why it is ON by default

Every Satisium product needs the same six things on day one: pageviews, an event pipe, consent,
web vitals, a public counter endpoint and error visibility. The reference already contains all of
it — rebuilding it per product is the exact waste this starter exists to remove.

### 18.2 The zero-key guarantee (verified in the reference)

| Guard                        | Evidence                                                                                                   |
| :--------------------------- | :--------------------------------------------------------------------------------------------------------- |
| No init without a token      | `analytics-provider.tsx` wraps `posthog.init(...)` in `if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN)` |
| No capture without consent   | `lib/analytics.ts`: `if (!hasConsent()) return` before `posthog.capture`                                   |
| No capture on the server     | `typeof window !== "undefined"` check                                                                      |
| Limiter never blocks         | `lib/rate-limit.ts` catches everything and `return true`                                                   |
| Telemetry is fire-and-forget | `fetch('/api/telemetry', { keepalive: true })` inside `try/catch`                                          |

So: **an empty `.env.local` means a silent app, never a broken one.** Add a lint-able rule for
yourself: analytics code may never throw, and may never be required for a feature to work.

### 18.3 Wiring (already specified)

- Provider nesting lives in `app/layout.tsx` — see the exact `<body>` in §5.2.
- PostHog ingest proxies + CSP hosts stay in `next.config.mjs` (§4.3).
- **Change `app_name`** in `components/analytics-provider.tsx` (currently `"satisium-ui"`) to the
  product slug — this is how a shared PostHog project separates Satisium Pro UI / Tweak / Typeset.
- `UPSTASH_*`, `SENTRY_*`, `NEXT_PUBLIC_*` keys are documented in §4.7.

### 18.4 `lib/redis.ts` `[COPY + ADAPT]` — add an in-memory fallback

The reference's client throws without Upstash credentials, which would make `checkRateLimit`
depend on env. Add a tiny in-process store so local dev and CI behave like production:

```ts
import { Redis } from "@upstash/redis"
import { env, features } from "@/lib/env"

/** Minimal in-memory stand-in for the two commands we use (incr + expire). */
function createMemoryRedis() {
  const store = new Map<string, { value: number; expiresAt: number | null }>()
  const alive = (key: string) => {
    const entry = store.get(key)
    if (!entry) return null
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      store.delete(key)
      return null
    }
    return entry
  }

  return {
    async incr(key: string) {
      const entry = alive(key) ?? { value: 0, expiresAt: null }
      entry.value += 1
      store.set(key, entry)
      return entry.value
    },
    async expire(key: string, seconds: number) {
      const entry = store.get(key)
      if (entry)
        store.set(key, { ...entry, expiresAt: Date.now() + seconds * 1000 })
      return 1
    },
  }
}

let client: ReturnType<typeof createMemoryRedis> | Redis | null = null

export function getRedis() {
  if (client) return client

  if (features.telemetryStore) {
    client = new Redis({
      url: env.UPSTASH_REDIS_REST_URL as string,
      token: env.UPSTASH_REDIS_REST_TOKEN as string,
    })
  } else {
    // Zero-key path: rate limiting still works, it just does not survive a restart.
    client = createMemoryRedis()
  }

  return client
}
```

> The return type is a union, so `checkRateLimit` only uses `incr`/`expire` — keep it that way and
> TypeScript stays happy. If you need more Redis features, branch on `features.telemetryStore`.

### 18.5 Error tracking `[OPTIONAL, recommended]`

`pnpm add @sentry/nextjs && npx @sentry/wizard@latest -i nextjs` (it writes
`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, wraps
`next.config.mjs` and creates `instrumentation.ts`).

Then:

1. Gate it on `features.errorTracking` (`SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN`) so it is inert
   without keys — same rule as analytics.
2. Add the Sentry ingest host to the CSP `connect-src` in `lib/csp.ts` (§21.5).
3. Send `logger.error(...)` calls and `ErrorBoundary.onError` (kit §8.4) to Sentry — that is the
   single highest-value integration point.
4. `pnpm build` should not fail without a DSN; if the wizard makes it required, remove the
   hard checks it adds to `next.config.mjs`.

### 18.6 Event taxonomy & naming rules

**Rules:** `snake_case`; `noun_verb` or `verb_noun`; ≤ 8 properties; **never** PII (no emails,
names, IPs, file contents); free text only from an explicit search-query event; one `app_name`
registered per product so a shared project stays filterable.

| Event                     | Fired by          | Properties                      |
| :------------------------ | :---------------- | :------------------------------ |
| `page_view`               | `PostHogPageView` | `path`, `route`                 |
| `doc_view`                | `DocTracker`      | `title`, `category`, `badge`    |
| `search_result_clicked`   | ⌘K palette        | `targetId`, `url`               |
| `search_zero_results`     | ⌘K palette        | `query`                         |
| `cli_command_copied`      | `CommandBlock`    | `command`, `manager`, `package` |
| `code_copied`             | `CodeBlock`       | `file`, `component`             |
| `theme_changed`           | theme provider    | `from`, `to`                    |
| `cta_clicked`             | landing / headers | `label`, `href`, `location`     |
| `tool_run` / `tool_reset` | product canvas    | `tool`, `duration_ms`           |
| `export_clicked`          | product           | `format`, `scope`               |

Add new events to this table in the same commit as the code. `content/docs/kit/analytics.mdx`
renders it, and `scripts/doctor.mjs` (§19.8) warns when a `trackEvent(` call is not in the table.

### 18.7 `app/api/health/route.ts` `[NEW]`

```ts
import { NextResponse } from "next/server"

import { features } from "@/lib/env"

export const dynamic = "force-dynamic"

/** Liveness + which optional integrations are live. Never exposes secret values. */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
    features,
  })
}
```

Add `NEXT_PUBLIC_APP_VERSION` to `.env.example` (set it from `package.json` version at deploy
time) and point your uptime monitor (Better Stack, UptimeRobot, Vercel checks) at `/api/health`.

### 18.8 Phase 13 validation

| Check                                  | Expected                                                         |
| :------------------------------------- | :--------------------------------------------------------------- |
| `pnpm dev` with an empty `.env.local`  | Boots; **zero** network calls to PostHog/GA (DevTools → Network) |
| Accept the consent banner, add a token | `page_view` arrives in PostHog with `app_name` = your slug       |
| `curl localhost:3000/api/health`       | `{ status: "ok", features: { analytics: false, … } }`            |
| Spam `/api/search` 40× in a minute     | Still `200` (in-memory limiter, no Redis)                        |
| Throw inside a previewed demo          | `ErrorBoundary` card instead of a blank page (kit §8.4)          |

**Done when:** the app is fully functional with every env var empty, and analytics lights up the
moment you add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`.

---

## 19. Phase 14 — Tooling, DX & Repository Hygiene

**Goal:** a new clone is immediately productive, a commit cannot sneak past quality, and an
agent can find the rules without asking.

### 19.1 Git hooks — husky + lint-staged + commitlint

```bash
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
pnpm exec husky init          # creates .husky/pre-commit, adds "prepare": "husky"
```

`.husky/pre-commit`

```sh
pnpm exec lint-staged
```

`.husky/commit-msg`

```sh
pnpm exec commitlint --edit "$1"
```

`lint-staged.config.mjs`

```js
export default {
  "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
  "*.{json,md,mdx,css}": ["prettier --write"],
}
```

`commitlint.config.mjs`

```js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Changelog bodies legitimately contain long lines and URLs.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
}
```

> The reference has **no** git hooks — this is a deliberate addition. Rationale: a starter is
> cloned by agents as often as by humans, and a pre-commit formatter removes an entire class of
> "the diff is 400 lines of whitespace" review noise.

### 19.2 Conventional Commits (the contract changesets rely on)

| Type                                                | Use for                  | Affects version |
| :-------------------------------------------------- | :----------------------- | :-------------- |
| `feat`                                              | user-visible capability  | minor           |
| `fix`                                               | user-visible bug         | patch           |
| `perf`                                              | performance              | patch           |
| `refactor`, `style`, `test`, `build`, `ci`, `chore` | internal                 | none            |
| `docs`                                              | docs + llms artifacts    | none            |
| `revert`                                            | revert a previous commit | —               |

Scopes to use: `docs`, `registry`, `kit`, `seo`, `analytics`, `tooling`, `release`, `security`.
Breaking changes: `feat!:` or a `BREAKING CHANGE:` footer — this is what makes a template upgrade
a deliberate act (`UPGRADING.md`, §19.10) instead of a surprise.

### 19.3 Root config files

| File                       | Content                                                                                                                                                                                                                  | Why                                       |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------- |
| `.editorconfig`            | `root = true`, `[*]` → `charset = utf-8`, `end_of_line = lf`, `indent_style = space`, `indent_size = 2`, `insert_final_newline = true`, `trim_trailing_whitespace = true`; `[*.md]` → `trim_trailing_whitespace = false` | Editors that are not VS Code (and agents) |
| `.gitattributes`           | `* text=auto eol=lf`                                                                                                                                                                                                     | Kills CRLF churn across platforms         |
| `.nvmrc`                   | `20`                                                                                                                                                                                                                     | Pins the runtime for humans and CI        |
| `.npmrc`                   | `engine-strict=true`                                                                                                                                                                                                     | Fails fast on the wrong Node              |
| `package.json` → `engines` | `{ "node": ">=20.9" }`                                                                                                                                                                                                   | Same, for pnpm                            |

### 19.4 `pnpm-workspace.yaml` — the pnpm 10 build-script gate

The reference's file contains unfinished placeholders (`allowBuilds: core-js: set this to true
or false`) which pnpm ignores — so its dependency build scripts are silently blocked. Replace it
with:

```yaml
onlyBuiltDependencies:
  - core-js
  - esbuild
  - msw
  - sharp
  - unrs-resolver
```

`sharp` is included because enabling image optimisation (§4.3 edit 4) makes Next install it;
without the allowance you get "Ignored build scripts" warnings and slower dev builds.

> ⚠️ **The key depends on your pnpm version.** `create-next-app` with pnpm 12.x writes
> `allowBuilds: { sharp: false, unrs-resolver: false }`; pnpm 10 uses
> `onlyBuiltDependencies: [...]`. Use whichever your pnpm understands (§4.8 shows both shapes).
> Acceptance test either way: a clean `pnpm install` must not print `Ignored build scripts: sharp`.

### 19.5 Dead-code and dependency hygiene — knip

```bash
pnpm add -D knip
```

`knip.json`

```json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "entry": [
    "app/**/{page,layout,route,error,global-error,not-found,loading,manifest,robots,sitemap,icon,apple-icon}.{ts,tsx}",
    "scripts/*.mjs",
    "registry/index.ts",
    "source.config.ts",
    "next.config.mjs",
    "eslint.config.mjs",
    "postcss.config.mjs"
  ],
  "project": ["**/*.{ts,tsx,mjs}"],
  "ignore": [".source/**", "public/**", "content/**", ".next/**"],
  "ignoreDependencies": [
    "tailwindcss",
    "@tailwindcss/postcss",
    "@tailwindcss/typography",
    "tw-animate-css",
    "shadcn",
    "eslint-config-next",
    "prettier-plugin-tailwindcss"
  ],
  "ignoreExportsUsedInFile": true
}
```

Why it matters here specifically: the presets in §23 **delete** modules, and the registry is
consumed via `dynamic()` imports that bundlers cannot see. knip in CI is how you find out that a
pruned module left six orphaned files and two unused dependencies behind.

### 19.6 Editor setup

`.vscode/settings.json` (copy the reference's) plus a new `extensions.json`:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "unifiedjs.vscode-mdx"
  ]
}
```

### 19.7 `AGENTS.md` — append the build contract

⚠️ **`create-next-app` already creates `AGENTS.md`** (plus `CLAUDE.md`, whose entire content is
`@AGENTS.md`). The file starts with a
`<!-- BEGIN:nextjs-agent-rules --> … <!-- END:nextjs-agent-rules -->` block that **`next dev`
regenerates** — deleting it only recreates an uncommitted diff. Therefore:

- **Keep the Next.js block at the top**, commit it with your work, and never edit inside the markers.
- **Append** everything below it (the contract below).
- Leave `CLAUDE.md` exactly as it is.
- If `AGENTS.md` is ever missing, run `pnpm dev` once to regenerate the Next block.

The family is built with AI agents, so the appended section is the build contract:

```md
# Satisium build contract (appended below the Next.js block)

You are working inside a **Satisium product** created from the Satisium Starter.

## Read first (in this order)

1. `starter-template.md` — build order, the shell, tooling.
2. `component-kit.md` — the template component library (components, hooks, lib).
3. `content/docs/**` — user-facing behaviour; the source of truth.

## Non-negotiables

- **Tokens only.** No hex/rgb/`text-gray-500`. Radius, type and motion rules: `component-kit.md` §2.3.
- **Routes:** every path comes from `lib/routes.ts`. Never write a literal `href="/…"`.
- **Navigation:** every entry comes from `lib/nav.ts` (header, rail, footer, ⌘K all read it).
- **Shortcuts:** register in `lib/hotkeys.ts` first, then bind with `hooks/use-hotkey.ts`.
- **Motion:** use `lib/motion.ts` springs/easings. Never inline `stiffness`/`damping` numbers.
- **New component:** place it per `component-kit.md` §2.1, give it an explicit props interface,
  accept `className`, and add a page under `content/docs/kit/`.
- **New registry component:** four files — `registry/ui/<name>.tsx`,
  `registry/demos/components/<name>/<name>-demo.tsx` (default export), `registry/strings/<name>.ts`,
  and an entry in `registry/index.ts` — then `pnpm build:registry:meta && pnpm registry:public`.
- **Analytics:** add events to the taxonomy (`starter-template.md` §18.6) and fire them through
  `trackEvent` / `useTrackEvent`. Analytics may never be required for a feature to work.
- **Zero-key rule:** the app must boot, build and pass tests with an empty `.env.local`.
- **New dependency:** justified in `starter-template.md` §22 first. Prefer existing deps.
- **No `any`**, no `as unknown as`, no commented-out code, no `console.log` (use `lib/logger.ts`).

## Commands

| Task                     | Command                                            |
| :----------------------- | :------------------------------------------------- |
| Dev server               | `pnpm dev`                                         |
| Verify before committing | `pnpm verify` (lint + typecheck + test + build)    |
| Add a shadcn primitive   | `pnpm dlx shadcn@latest add <name>`                |
| New docs page            | `pnpm make:doc <slug> [section]`                   |
| Registry payloads        | `pnpm build:registry:meta && pnpm registry:public` |
| LLM artifacts            | `pnpm llm`                                         |
| Environment check        | `pnpm doctor`                                      |
| Release notes            | `pnpm changeset`                                   |

## Definition of done

1. `pnpm verify` passes, `pnpm doctor` reports no problems.
2. Docs updated when behaviour changed; `pnpm changeset` when the user can see the change.
3. Route or screenshot included in the PR description (templates in `.github/PULL_REQUEST_TEMPLATE/`).
4. Dead code and unused exports removed (`pnpm knip`).

## Layout map

| Area           | Path                                                                                 |
| :------------- | :----------------------------------------------------------------------------------- |
| Brand          | `components/satisium-logo.tsx`, `components/icons.tsx`                               |
| Shell          | `components/layout/{app-shell,site-header,app-nav,command-menu}*`                    |
| Kit primitives | `components/ui/*`                                                                    |
| Docs engine    | `lib/source.tsx`, `app/docs/**`, `components/code-block/*`, `components/previewer/*` |
| Registry       | `registry/**` → `public/r/*.json`                                                    |
| Marketing      | `components/marketing/*`, `components/home/*`                                        |
| Helpers        | `lib/{env,routes,nav,motion,hotkeys,metadata}.ts`                                    |
```

### 19.8 `scripts/doctor.mjs` `[NEW]`

```bash
# package.json
"doctor": "node scripts/doctor.mjs",
"verify": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
```

```js
#!/usr/bin/env node
/**
 * pnpm doctor — pre-flight checks for a Satisium product.
 * Real problems exit 1; warnings never fail the run.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const problems = []
const warnings = []
const passed = []

const abs = (p) => path.join(ROOT, p)
const exists = (p) => fs.existsSync(abs(p))
const read = (p) => fs.readFileSync(abs(p), "utf-8")
const age = (p) => (exists(p) ? fs.statSync(abs(p)).mtimeMs : 0)

// 1 — runtime
const major = Number(process.versions.node.split(".")[0])
if (major >= 20) passed.push(`Node ${process.versions.node}`)
else problems.push(`Node ${process.versions.node} — need >= 20`)

// 2 — env parity: .env.example <-> lib/env.ts
if (!exists(".env.example")) problems.push(".env.example is missing")
else if (!exists("lib/env.ts"))
  warnings.push("lib/env.ts missing — cannot check env parity")
else {
  const exampleKeys = new Set(
    read(".env.example")
      .split("\n")
      .map((line) => line.match(/^([A-Z0-9_]+)=/)?.[1])
      .filter(Boolean)
  )
  const codeKeys = new Set(
    Array.from(
      read("lib/env.ts").matchAll(/([A-Z][A-Z0-9_]{3,})\s*:/g),
      (m) => m[1]
    )
  )
  const onlyExample = [...exampleKeys].filter((key) => !codeKeys.has(key))
  const onlyCode = [...codeKeys].filter((key) => !exampleKeys.has(key))

  if (onlyExample.length)
    warnings.push(
      `In .env.example but not parsed in lib/env.ts: ${onlyExample.join(", ")}`
    )
  if (onlyCode.length)
    warnings.push(
      `Parsed in lib/env.ts but missing from .env.example: ${onlyCode.join(", ")}`
    )
  if (!onlyExample.length && !onlyCode.length)
    passed.push(`env parity (${exampleKeys.size} vars)`)
}

// 3 — required assets
const requiredAssets = [
  "public/PlusJakartaSans-Bold.ttf",
  "public/og-bg-optimized.jpg",
  "app/icon.svg",
  "app/favicon.ico",
]
const missingAssets = requiredAssets.filter((asset) => !exists(asset))
if (missingAssets.length)
  problems.push(`Missing assets: ${missingAssets.join(", ")}`)
else passed.push("brand + OG assets present")

// 4 — registry hygiene
if (!exists("registry/index.ts")) warnings.push("registry/index.ts missing")
else {
  const index = read("registry/index.ts")
  const slugs = [...index.matchAll(/"([a-z0-9-]+)":\s*\{/g)].map((m) => m[1])
  for (const slug of slugs) {
    const block = index.slice(index.indexOf(`"${slug}":`)).slice(0, 600)
    if (!block.includes("name:"))
      warnings.push(`Registry entry "${slug}" has no name`)
    if (!block.includes("installCommand:"))
      warnings.push(`Registry entry "${slug}" has no installCommand`)
  }
  passed.push(`registry entries: ${slugs.length}`)
  if (age("registry/meta.ts") < age("registry/index.ts"))
    problems.push("registry/meta.ts is stale — run `pnpm build:registry:meta`")
}

// 5 — llms artifacts freshness
if (!exists("public/llms.txt"))
  warnings.push("public/llms.txt missing — run `pnpm llm`")
else if (age("public/llms.txt") < age("content/docs"))
  warnings.push("llms artifacts older than content/docs — run `pnpm llm`")
else passed.push("llms artifacts fresh")

// 6 — route discipline: literal hrefs inside components/
const offenders = []
const walk = (dir) => {
  for (const entry of fs.readdirSync(abs(dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`
    if (entry.isDirectory()) walk(rel)
    else if (rel.endsWith(".tsx")) {
      const hits = [...read(rel).matchAll(/href="(\/[a-z0-9-\/\[\]]*)"/g)].map(
        (m) => m[1]
      )
      if (hits.length)
        offenders.push(`${rel}: ${[...new Set(hits)].join(", ")}`)
    }
  }
}
if (exists("components")) walk("components")
if (offenders.length)
  warnings.push(
    `Literal routes in components (use lib/routes.ts):\n    ${offenders.join("\n    ")}`
  )
else passed.push("no literal routes in components")

// 7 — accessibility floor: icon-only buttons carry a label
const unlabelled = []
const scanButtons = (dir) => {
  for (const entry of fs.readdirSync(abs(dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`
    if (entry.isDirectory()) scanButtons(rel)
    else if (rel.endsWith(".tsx")) {
      const source = read(rel)
      const bareIcons = source.match(
        /<button(?![^>]*aria-label)[^>]*>\s*<(HugeiconsIcon|\.\.\.)/g
      )
      if (bareIcons) unlabelled.push(rel)
    }
  }
}
if (exists("components")) scanButtons("components")
if (unlabelled.length)
  warnings.push(`Buttons possibly missing aria-label: ${unlabelled.join(", ")}`)
else passed.push("button labels look good")

// report
console.log("\n🩺  Satisium doctor\n")
for (const line of passed) console.log(`  ✅ ${line}`)
for (const line of warnings) console.log(`  ⚠️  ${line}`)
for (const line of problems) console.log(`  ❌ ${line}`)
console.log(
  `\n  ${passed.length} passed · ${warnings.length} warnings · ${problems.length} problems\n`
)

if (problems.length) process.exit(1)
```

| Check                                             | Fails the run? |
| :------------------------------------------------ | :------------- |
| Node ≥ 20                                         | ✅             |
| `.env.example` ↔ `lib/env.ts` parity              | ❌ (warns)     |
| Required brand/OG assets present                  | ✅             |
| Registry entries have `name` + `installCommand`   | ❌ (warns)     |
| `registry/meta.ts` newer than `registry/index.ts` | ✅             |
| `public/llms*` newer than `content/docs`          | ❌ (warns)     |
| No literal routes inside `components/`            | ❌ (warns)     |
| Icon-only buttons have `aria-label`               | ❌ (warns)     |

### 19.9 Repository hygiene

```bash
mkdir -p .github/ISSUE_TEMPLATE .github/PULL_REQUEST_TEMPLATE
cp -r /home/satishkumar/Desktop/ui-satis/.github/ISSUE_TEMPLATE/* .github/ISSUE_TEMPLATE/
cp /home/satishkumar/Desktop/ui-satis/.github/dependabot.yml .github/dependabot.yml
cp /home/satishkumar/Desktop/ui-satis/.github/PULL_REQUEST_TEMPLATE/bug-fix.md .github/PULL_REQUEST_TEMPLATE/
cp /home/satishkumar/Desktop/ui-satis/.github/PULL_REQUEST_TEMPLATE/docs-and-llm.md .github/PULL_REQUEST_TEMPLATE/
cp /home/satishkumar/Desktop/ui-satis/SECURITY.md ./
cp /home/satishkumar/Desktop/ui-satis/CODE_OF_CONDUCT.md ./
cp /home/satishkumar/Desktop/ui-satis/CONTRIBUTING.md ./
```

The reference ships **4** PR templates (`bug-fix`, `component-addition`, `core-infrastructure`,
`docs-and-llm`) and **3** issue templates — the starter keeps `bug-fix` + `docs-and-llm`, then
adds two of its own:

| New file                                   | Purpose                                                                               |
| :----------------------------------------- | :------------------------------------------------------------------------------------ |
| `.github/PULL_REQUEST_TEMPLATE/feature.md` | A new capability: links the docs page, the `pnpm changeset`, and the route/screenshot |
| `.github/CODEOWNERS`                       | `* @<you>` — required once a repo has more than one contributor                       |

`CHANGELOG.md` and `CONTRIBUTING.md`: adjust the reference's contributing guide to describe
**this** workflow (`pnpm verify`, conventional commits, changesets, the registry's four-file rule).

### 19.10 Template versioning & the upgrade path

Because this template "will be constantly upgraded", products need a way to _receive_ upgrades.

| File              | Content                                                                                                                           |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| `STARTER_VERSION` | Current template version, e.g. `1.0.0`. Bump it with the template's own release, and let `pnpm doctor` print it against `engines` |
| `UPGRADING.md`    | One section per template release: what changed, what to run, what is breaking                                                     |

Workflow for a product (documented in `UPGRADING.md`):

```bash
git remote add starter https://github.com/satisium/starter.git
git fetch starter --tags
git cherry-pick <sha>                 # or, for a file you never modified:
git checkout starter/main -- components/ui/kbd.tsx
```

**Rule that keeps this cheap:** products never edit upstream files in place. If a product needs a
variant, it wraps (`components/product/…`) or extends (`lib/product/…`) instead of patching. Then
every upstream change applies cleanly, and `git fetch starter && git cherry-pick` is the whole
upgrade.

### 19.11 Phase 14 validation

```bash
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional knip
pnpm exec husky init && pnpm install
pnpm doctor
```

| Check                                | Expected                                                      |
| :----------------------------------- | :------------------------------------------------------------ |
| `git commit -m "stuff"`              | Rejected by commitlint                                        |
| `git commit -m "feat(kit): add kbd"` | Passes; pre-commit reformats staged files                     |
| `pnpm doctor`                        | `0 problems`; warnings only for things you have not built yet |
| `pnpm knip`                          | Reports no unused files/deps once the kit is built            |
| `pnpm verify`                        | Exists and runs the four gates                                |

---

## 20. Phase 15 — Testing & CI

**Goal:** a registry you can _sell_ (Satisium Pro UI) cannot be verified by eye. This phase makes
correctness machine-checked: unit → contract → e2e → budget.

### 20.1 Setup

```bash
pnpm add -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom vitest-axe
pnpm add -D @playwright/test @axe-core/playwright
pnpm exec playwright install --with-deps chromium
```

```json
// package.json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage",
"e2e": "playwright test",
"e2e:ui": "playwright test --ui",
"e2e:install": "playwright install --with-deps chromium"
```

`vitest.config.ts`

```ts
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e/**", "registry/strings/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["components/**", "hooks/**", "lib/**", "registry/index.ts"],
      exclude: ["**/*.d.ts", "components/mdx/**"],
    },
  },
})
```

`vitest.setup.ts`

```ts
import "@testing-library/jest-dom/vitest"

import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

afterEach(() => cleanup())

// jsdom has no matchMedia — required by useMediaQuery, MinimalThemeSwitcher,
// consent-utils and the theme provider.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// next/font is a build-time transform — stub it so components can mount.
vi.mock("next/font/google", () => ({
  Plus_Jakarta_Sans: () => ({ variable: "--font-heading" }),
  Inter: () => ({ variable: "--font-body" }),
  IBM_Plex_Mono: () => ({ variable: "--font-code" }),
  Caveat: () => ({ variable: "--font-caveat" }),
}))
```

### 20.2 Unit patterns (three examples worth copying)

```ts
// lib/hotkeys.test.ts
import { describe, expect, it } from "vitest"

import { HOTKEYS, formatHotkey, hotkeyById } from "@/lib/hotkeys"

describe("hotkeys", () => {
  it("has no duplicate ids or keys within a scope", () => {
    const ids = HOTKEYS.map((hotkey) => hotkey.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const scope of ["global", "docs", "app"] as const) {
      const keys = HOTKEYS.filter((hotkey) => hotkey.scope === scope).map(
        (hotkey) => hotkey.keys
      )
      expect(new Set(keys).size, `conflict in ${scope} scope`).toBe(keys.length)
    }
  })

  it("formats per platform", () => {
    expect(formatHotkey("mod+k", true)).toBe("⌘K")
    expect(formatHotkey("mod+k", false)).toBe("Ctrl K")
    expect(formatHotkey("escape", true)).toBe("Esc")
  })

  it("exposes the command palette shortcut", () => {
    expect(hotkeyById("command")?.keys).toBe("mod+k")
  })
})
```

```tsx
// components/ui/empty-state.test.tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { EmptyState } from "@/components/ui/empty-state"

describe("EmptyState", () => {
  it("renders a heading and description", () => {
    render(
      <EmptyState
        title="No projects"
        description="Create one to get started."
      />
    )
    expect(
      screen.getByRole("heading", { name: "No projects" })
    ).toBeInTheDocument()
    expect(screen.getByText("Create one to get started.")).toBeInTheDocument()
  })

  it("has no a11y violations", async () => {
    const { container } = render(<EmptyState title="No projects" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

```ts
// hooks/use-copy.test.ts
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCopy } from "@/hooks/use-copy"

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

describe("useCopy", () => {
  it("copies text and flips the flag", async () => {
    const { result } = renderHook(() => useCopy())
    await act(async () => {
      await result.current.copy("hello")
    })
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello")
    expect(result.current.copied).toBe(true)
  })

  it("ignores empty input", async () => {
    const { result } = renderHook(() => useCopy())
    await act(async () => {
      expect(await result.current.copy("")).toBe(false)
    })
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
  })
})
```

> `vitest-axe` catches structure, roles and labels — **not** colour contrast (jsdom does not
> render). Contrast is Playwright's job (§20.5, axe runs in a real browser).

### 20.3 Registry contract test — the one that protects revenue

```ts
// __tests__/registry.test.ts
import { describe, expect, it } from "vitest"

import { registry } from "@/registry/index"

const keys = Object.keys(registry)

describe("registry contract", () => {
  it("is not empty", () => {
    expect(keys.length).toBeGreaterThan(0)
  })

  it.each(keys)("%s is complete and serialisable", async (key) => {
    const item = registry[key]

    expect(item.name, `${key} needs a name`).toBeTruthy()
    expect(item.installCommand, `${key} needs an installCommand`).toMatch(
      /shadcn/
    )
    expect(item.previewUrl, `${key} previewUrl must match its key`).toBe(
      `/preview/${key}`
    )
    expect(["react", "video", "image"]).toContain(item.type ?? "react")

    if (item.component) {
      const files = item.getFiles ? await item.getFiles() : {}
      expect(
        Object.keys(files).length,
        `${key} getFiles() returned nothing`
      ).toBeGreaterThan(0)

      for (const [name, file] of Object.entries(files)) {
        const code = typeof file === "string" ? file : file.code
        expect(code, `${key}:${name} is empty`).toBeTruthy()
        expect(code).toContain("export")
      }
    } else {
      expect(
        item.mediaUrl,
        `${key} is not react — it needs mediaUrl`
      ).toBeTruthy()
    }
  })
})
```

This is what catches the classic registry failure: a new component ships with a demo but the
`strings` file was never updated, so the code dialog renders empty for a _paying_ customer.

### 20.4 What to test and what not to

| Test                                                                    | Why                                                                          |
| :---------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| Registry contract (§20.3)                                               | Revenue + the code dialog                                                    |
| `lib/*` pure helpers (`env`, `hotkeys`, `routes`, `metadata`, `format`) | Cheap, high-signal, no DOM                                                   |
| `hooks/*`                                                               | Logic that DOM tests cannot see                                              |
| `components/ui/*` render + a11y                                         | Prevents regressions in the branded primitives                               |
| **Not** snapshot-testing the whole kit                                  | Snapshots of styled components (Tailwind classes) generate noise, not safety |
| **Not** testing the docs engine's internals                             | It is `[COPY]` from the reference; e2e covers it                             |

### 20.5 Playwright — route matrix + a real accessibility pass

`playwright.config.ts`

```ts
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? ["github", ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "pnpm build && pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
```

`e2e/smoke.spec.ts`

```ts
import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const ROUTES = [
  "/",
  "/app",
  "/docs",
  "/docs/getting-started/installation",
  "/docs/components/sample-component",
]

for (const route of ROUTES) {
  test(`${route} renders without console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text())
    })

    await page.goto(route)
    await expect(page.locator("h1").first()).toBeVisible()
    expect(errors).toEqual([])
  })
}

test("theme toggle persists across navigation", async ({ page }) => {
  await page.goto("/docs")
  await page.keyboard.press("d")
  const isDark = await page.evaluate(() =>
    document.documentElement.classList.contains("dark")
  )
  await page.goto("/docs/changelog")
  expect(
    await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    )
  ).toBe(isDark)
})

test("command palette opens and finds a docs page", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "palette is desktop-first")
  await page.goto("/docs")
  await page.keyboard.press(
    process.platform === "darwin" ? "Meta+k" : "Control+k"
  )
  await expect(page.getByRole("dialog")).toBeVisible()
})

test("preview route is isolated and indexable-blocked", async ({ page }) => {
  const response = await page.goto("/preview/pulse-card")
  expect(response?.headers()["x-robots-tag"]).toContain("noindex")
})

test("docs have no critical accessibility violations", async ({ page }) => {
  await page.goto("/docs/getting-started/installation")
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze()
  expect(results.violations).toEqual([])
})
```

Add two more once the kit exists: a **mobile smoke** (rail opens, drawer nav works — this is the
§21.6 mobile pass being verified) and **screenshot snapshots** of each `/preview/*`
(`expect(page).toHaveScreenshot()`), which is the only practical regression net for visual work.

### 20.6 Performance budgets — Lighthouse CI

```bash
pnpm add -D @lhci/cli
```

`lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm start",
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/docs",
        "http://localhost:3000/docs/getting-started/installation"
      ],
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

### 20.7 CI — the full matrix

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
        with: { version: 10 }
      - uses: actions/setup-node@v7
        with: { node-version: 20, cache: "pnpm" }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm knip
      - run: pnpm doctor

  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
        with: { version: 10 }
      - uses: actions/setup-node@v7
        with: { node-version: 20, cache: "pnpm" }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test -- --coverage
      - uses: actions/upload-artifact@v5
        if: always()
        with: { name: coverage, path: coverage }

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
        with: { version: 10 }
      - uses: actions/setup-node@v7
        with: { node-version: 20, cache: "pnpm" }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build:registry:meta && pnpm registry:public
      - run: pnpm build
        env:
          NEXT_PUBLIC_SITE_URL: https://example.com
      - uses: actions/upload-artifact@v5
        with: { name: build, path: .next }

  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
        with: { version: 10 }
      - uses: actions/setup-node@v7
        with: { node-version: 20, cache: "pnpm" }
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm e2e
        env:
          NEXT_PUBLIC_SITE_URL: https://example.com
      - uses: actions/upload-artifact@v5
        if: always()
        with: { name: playwright-report, path: playwright-report }
```

> The `e2e` job **must** export `NEXT_PUBLIC_SITE_URL`: `scripts/build-llms.mjs` embeds it into
> `llms.txt`, and metadata/canonical URLs derive from it.

### 20.8 Phase 15 validation

| Check                                | Expected                                                         |
| :----------------------------------- | :--------------------------------------------------------------- |
| `pnpm test`                          | Registry contract + kit tests green                              |
| `pnpm test:coverage`                 | `lib/`, `hooks/`, `components/ui/` above 60% (raise per product) |
| `pnpm e2e`                           | Route matrix + axe pass on desktop; smoke on mobile              |
| `pnpm build` then `npx lhci autorun` | All four Lighthouse categories meet the budgets                  |
| CI on a PR                           | 4 jobs: quality, unit, build, e2e                                |

**Done when:** a broken registry item, a missing `aria-label`, a literal route, a stale
`registry/meta.ts` and a performance regression each fail _something_. That is the bar.

---

## 21. Phase 16 — Quality, Security & Compliance

**Goal:** the things that make an app _feel_ professional and keep it out of trouble: motion that
respects the user, real accessibility, images that are optimised, a CSP that does not break when
you add a service, legal pages, and a mobile pass.

### 21.1 Reduced motion — mandatory for an animation-led brand

**Verified gap:** only `components/home/piano-typewriter.tsx` respects
`prefers-reduced-motion` today. Springs, the theme view-transition, `animate-ping`, liquid pills,
the annotation draw and the previewer resize all ignore it.

Three layers, all required:

1. **Motion** — one provider handles every `motion/react` animation (already in the §5.2 body):

   ```tsx
   import { MotionConfig } from "motion/react"
   // …
   ;<MotionConfig reducedMotion="user">{children}</MotionConfig>
   ```

   With this, every `initial`/`animate`/`exit` in the app automatically becomes a plain
   cross-fade when the OS asks for reduced motion. **No component-level branching needed** — that
   is why `lib/motion.ts` (kit §4.5) can stay presets-only.

2. **GSAP** — use the pattern the reference already uses in `piano-typewriter.tsx`:

   ```ts
   const mm = gsap.matchMedia()
   mm.add("(prefers-reduced-motion: no-preference)", () => {
     /* full animation */
   })
   mm.add("(prefers-reduced-motion: reduce)", () => {
     /* set final state, no timeline */
   })
   return () => mm.revert()
   ```

3. **CSS** — append to `app/globals.css`: CSS keyframes, smooth scrolling and the theme
   view-transition are invisible to Motion/GSAP.
   ```css
   /* =======================================================
      REDUCED MOTION
      Covers everything not driven by Motion/GSAP: CSS
      keyframes, smooth scroll and view transitions.
      ======================================================= */
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }

     ::view-transition-group(*),
     ::view-transition-old(root),
     ::view-transition-new(root) {
       animation: none !important;
     }
   }
   ```

**Engine policy** (so nobody re-litigates it per component):

| Use                                           | Engine                                              |
| :-------------------------------------------- | :-------------------------------------------------- |
| Layout/enter/exit, gestures, `layoutId` pills | **Motion** (with `lib/motion.ts` presets)           |
| Scroll-driven timelines, complex sequencing   | **GSAP** + `@gsap/react` (`useGSAP`) + `matchMedia` |
| Hover/press micro-states, one-shot fades      | **CSS** (`transition-*`, `tw-animate-css`)          |
| Never                                         | Two engines animating the same property             |

Verify in CI: add a Playwright case with `page.emulateMedia({ reducedMotion: "reduce" })` asserting
the docs card does **not** shift (transform stays `none`).

### 21.2 Accessibility baseline

| Requirement        | Rule                                                                                      |
| :----------------- | :---------------------------------------------------------------------------------------- |
| Landmarks          | Every page has exactly one `<main>`; header/nav/footer are real landmarks                 |
| Skip link          | `components/layout/skip-link.tsx` mounted first in the root layout — see below            |
| Headings           | One `h1` per page; never skip levels (docs pages already enforce this via MDX components) |
| Icon-only controls | `aria-label` (+ `title`) — enforced by `pnpm doctor` (§19.8) and axe in e2e (§20.5)       |
| Forms              | Real `<label>` elements (never placeholder-as-label); `aria-describedby` for help text    |
| Errors             | Inline text with `role="alert"`; never colour alone                                       |
| Dialogs/sheets     | Radix handles focus trap + restore — do not re-implement                                  |
| Toasts             | `sonner` announces via a live region — never build a custom toast                         |
| Keyboard           | Everything reachable; Escape closes overlays; **no** `tabIndex > 0`                       |
| Contrast           | Verify with axe in a real browser (jsdom cannot)                                          |

`components/layout/skip-link.tsx`

```tsx
import { cn } from "@/lib/utils"

/** First focusable element on the page. Mount it as the first child of <body>. */
export function SkipLink({ target = "main-content" }: { target?: string }) {
  return (
    <a
      href={`#${target}`}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[12px]",
        "focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground",
        "focus-visible:outline-none"
      )}
    >
      Skip to content
    </a>
  )
}
```

Pair it with `<main id="main-content">` in `AppShell` (kit §6.6), `ThreePaneLayout`, and the articles
rendered by the docs page.

### 21.3 Zod is the validation layer — use it everywhere

`zod` is already a dependency (Fumadocs). That makes it the default validator for **forms, route
handlers, search params and env** — one library, no new decision:

| Surface        | Pattern                                                                                                                           |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| Forms          | `validators.ts` schema → parse on submit → inline errors (no react-hook-form until a product needs field arrays/async validation) |
| Route handlers | `const body = schema.safeParse(await req.json())` → `400` on failure, always                                                      |
| Search params  | parse with `schema.safeParse(Object.fromEntries(searchParams))` — never trust `searchParams.get()`                                |
| Env            | `lib/env.ts` (kit §4.3)                                                                                                           |

Rule: **never** hand-write an `if (!email.includes("@"))` check.

### 21.4 Performance & images

1. **Remove `unoptimized: true`** (§4.3 edit 4) and add formats:
   ```js
   images: {
     formats: ["image/avif", "image/webp"],
     remotePatterns: [ /* keep the reference's list */ ],
   }
   ```
   Keep `sharp` in `onlyBuiltDependencies` (§19.4) or the optimiser falls back to slower paths.
2. **Fonts** are already self-hosted by `next/font`; keep `display: "swap"` and `preload` on
   `--font-heading`/`--font-body`. If your CI has no network access, switch to
   `next/font/local` with the woff2 files in `app/fonts/` — the OG route already proves the
   local-font workflow (`public/PlusJakartaSans-Bold.ttf`).
3. **Streaming:** add `app/docs/loading.tsx` and `app/app/loading.tsx` rendering `LoadingState`
   (kit §8.2), and wrap the previewer in `<Suspense>`; registry demos are already `dynamic()`
   (§11.3), so a heavy demo never blocks the article.
4. **Budget rule:** no new dependency above ~30 KB gzip without an entry in §22. Check with
   `pnpm analyze` before merging.

### 21.5 `lib/csp.mjs` — the CSP composer

Plain `.mjs` on purpose: `next.config.mjs` **cannot import TypeScript**.

```js
/**
 * lib/csp.mjs — single source of truth for the Content-Security-Policy header.
 *
 * Adding an integration? Add its origins here (and note it in §22),
 * never by patching a raw string inside next.config.mjs.
 */
export function buildCsp({
  extraConnect = [],
  extraScript = [],
  extraFrame = [],
} = {}) {
  const analytics = Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN)
  const errorTracking = Boolean(
    process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
  )

  const connect = [
    "'self'",
    "https://api.github.com",
    "https://cdn.jsdelivr.net",
    ...(analytics
      ? ["https://us.i.posthog.com", "https://us-assets.i.posthog.com"]
      : []),
    ...(errorTracking
      ? ["https://*.ingest.sentry.io", "https://*.ingest.us.sentry.io"]
      : []),
    ...extraConnect,
  ]

  return (
    [
      "default-src 'self'",
      `script-src ${["'self'", "'unsafe-inline'", "'unsafe-eval'", ...extraScript].join(" ")}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "media-src 'self' https://cdn.jsdelivr.net",
      `connect-src ${connect.join(" ")}`,
      `frame-src ${["'self'", ...extraFrame].join(" ")}`,
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ") + ";"
  )
}
```

In `next.config.mjs` (replacing the hardcoded value from §4.3):

```js
import { buildCsp } from "./lib/csp.mjs"
// …inside securityHeaders
{ key: "Content-Security-Policy", value: buildCsp() },
```

> `'unsafe-inline'`/`'unsafe-eval'` are required by Next's dev bundle and by inlined JSON-LD.
> Tightening it (nonces) is a per-product hardening task — the composer makes it a one-file change.

### 21.6 The mobile pass (docs shell)

**Verified gap:** the reference blocks mobile entirely (`proxy.ts`, §15.3) and the docs shell is
desktop-only — fixed 320px underlayer + GPU card shift with no responsive branch. The docs
_article_ padding is responsive; the _shell_ is not.

Minimum change, in this order:

1. In `components/docs/dispatch.tsx`, keep the layout switch but make it viewport-aware — the card motion
   is meaningless on a phone:
   ```tsx
   "use client"
   import { useIsDesktop } from "@/hooks/use-media-query"
   // …in the component body
   const isDesktop = useIsDesktop()
   const Layout =
     DOCS_LAYOUT === "three-pane" || !isDesktop
       ? ThreePaneLayout
       : SpatialLayout
   ```
   This makes `ThreePaneLayout` (kit §6.6 uses the same store) the mobile presentation: rail
   collapses to a drawer with a scrim, content is full width.
2. Verify the previewer: under `lg`, `ResizablePlayground` should start in `mobile` viewport mode
   and hide the drag handles.
3. Add the two e2e tests from §20.5 (mobile smoke + rail drawer).
4. Only then delete the `§16.2` warning note.

### 21.7 Legal & trust pages (every web app needs them)

Add a second Fumadocs collection — the same MDX pipeline, same components, same SEO:

```ts
// source.config.ts (addition)
export const legal = defineDocs({ dir: "content/legal" })
```

```tsx
// lib/source.tsx (addition)
import { legal } from "collections/server"
export const legalSource = loader({
  baseUrl: "/",
  source: legal.toFumadocsSource(),
})
```

```
content/legal/privacy.mdx    → /privacy
content/legal/terms.mdx      → /terms
content/legal/cookies.mdx    → /cookies
```

Routes: `app/(legal)/[[...slug]]/page.tsx` renders `defaultMdxComponents` + `buildMetadata`
(kit §4.4) + a `LegalFooter` that prints the `updated` date from `lib/legal.ts`:

```ts
export const LEGAL = {
  company: "Satisium",
  product: "Satisium Starter",
  contactEmail: "legal@your-domain.com",
  jurisdiction: "India",
  updated: "2026-01-01",
} as const
```

The three pages must cover: what data is collected (analytics + consent, §18), cookies
(PostHog/GA/consent storage), third-party processors, contact + deletion requests, and the
jurisdiction. The paths already exist in `lib/routes.ts` (kit §4.1) and in `FOOTER_NAV`.

> This is a template, not legal advice — have a lawyer review the three pages for your entity
> before you launch a paid product.

### 21.8 Security checklist

| Item                         | Where                                                                                                             |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| Secrets server-only          | Never `NEXT_PUBLIC_` a secret; `lib/env.ts` splits client/server schemas (kit §4.3)                               |
| Security headers             | `next.config.mjs` (§4.3) + `lib/csp.mjs` (§21.5)                                                                  |
| `noindex` on internal routes | `/api`, `/embed`, `/preview` (headers + `robots.ts`)                                                              |
| Rate limiting                | `lib/rate-limit.ts` with the in-memory fallback (§18.4) on every public POST                                      |
| Input validation             | zod at every boundary (§21.3)                                                                                     |
| Dependency updates           | `.github/dependabot.yml` (§19.9)                                                                                  |
| Vulnerability reporting      | `SECURITY.md` (§19.9)                                                                                             |
| XSS                          | Never `dangerouslySetInnerHTML` except the JSON-LD blocks and the theme-transition style already in the reference |
| File uploads                 | Out of scope — a module (§22), never a quick patch                                                                |

### 21.9 Phase 16 validation

| Check                                          | Expected                                                             |
| :--------------------------------------------- | :------------------------------------------------------------------- |
| OS reduced motion on                           | No card shift, no sweep, no ping; content fades only                 |
| `Tab` from page load                           | Skip link appears first                                              |
| axe on `/`, `/app`, `/docs` (desktop + mobile) | Zero critical violations                                             |
| `/privacy`, `/terms`, `/cookies`               | Render with metadata + `updated` date, linked from the footer        |
| `pnpm build`                                   | `images.unoptimized` is gone; AVIF/WebP served                       |
| Add a fake integration to `buildCsp`           | App still works; remove it and the CSP tightens again                |
| 390px viewport                                 | Docs usable via the drawer rail; `/app` usable; no horizontal scroll |

---

## 22. Backlog & the Module Contract

**The rule:** nothing enters the base template without an entry in this table. If you feel the
urge to add a dependency for something on this list — stop, wire it as a **module** instead.
The base stays App + Docs (that was your call, and it is the right one for a template that will
be upgraded forever).

### 22.1 Explicitly deferred (with the exact seam each will use)

| Module                | Recommended stack                                    | Plugs into                                                                            | Env                                                                        | CSP origins                                                                      |
| :-------------------- | :--------------------------------------------------- | :------------------------------------------------------------------------------------ | :------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| **Auth**              | Better Auth (self-hosted, Drizzle-friendly) or Clerk | `app/(auth)/**` route group, a real `proxy.ts`, `lib/auth.ts`, protect `app/(app)/**` | provider keys                                                              | provider domains                                                                 |
| **Database + ORM**    | Drizzle + Postgres (Neon/Supabase)                   | `lib/db.ts`, `drizzle/` migrations, `scripts/seed.mjs`                                | `DATABASE_URL`                                                             | none                                                                             |
| **Billing**           | Stripe (Checkout + Customer Portal + webhooks)       | `lib/billing.ts`, `app/api/stripe/webhook/route.ts`, entitlements checked in `(app)`  | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PRICE_*` | `https://api.stripe.com`, `https://js.stripe.com`, `https://checkout.stripe.com` |
| **Email**             | Resend + React Email                                 | `lib/email.ts`, `emails/*.tsx`, dev mode logs instead of sending (zero-key rule)      | `RESEND_API_KEY`                                                           | `https://api.resend.com`                                                         |
| **Waitlist / leads**  | reuses Email                                         | `components/marketing/waitlist-form.tsx` (kit §11) + one route handler                | —                                                                          | —                                                                                |
| **Blog**              | second Fumadocs collection                           | `content/blog/**` + `app/blog/[[...slug]]/page.tsx` + RSS at `app/feed.xml/route.ts`  | —                                                                          | —                                                                                |
| **i18n**              | `next-intl`                                          | `app/[locale]/**`, `messages/*.json`, `lib/i18n.ts`                                   | —                                                                          | —                                                                                |
| **Charts**            | `recharts` (simple) or `visx` (custom)               | `components/charts/*`; tokens `--chart-1…5` already exist                             | —                                                                          | —                                                                                |
| **DataTable**         | `@tanstack/react-table`                              | `components/ui/data-table.tsx` (kit §9.3)                                             | —                                                                          | —                                                                                |
| **Uploads / storage** | Vercel Blob, S3 or Supabase Storage                  | `lib/storage.ts` + a signed-URL route handler                                         | bucket creds                                                               | bucket domain                                                                    |
| **Admin**             | gated route group                                    | `app/(admin)/**` — role check in the layout, no public nav entry                      | —                                                                          | —                                                                                |
| **Feature flags**     | PostHog flags (already installed) or env             | `lib/flags.ts` + `features` (kit §4.3)                                                | —                                                                          | —                                                                                |
| **Search (scale)**    | Postgres FTS / Orama / Algolia                       | replaces `app/api/search/route.ts`; today's local Fumadocs index is fine to ~1k pages | —                                                                          | provider domain                                                                  |
| **Background jobs**   | Inngest / QStash / Vercel cron                       | `app/api/jobs/**` + a queue client in `lib/jobs.ts`                                   | provider keys                                                              | provider domain                                                                  |
| **Observability+**    | OpenTelemetry / log drain (Sentry is already §18.5)  | `lib/otel.ts` + `instrumentation.ts`                                                  | `OTEL_*`                                                                   | collector domain                                                                 |

### 22.2 The module contract (write this before the second module exists)

`lib/modules.ts` — a manifest per module. Its only job is to make **removal** mechanical, because
the failure mode of a growing starter is that deleting a module leaves orphans everywhere.

```ts
export interface ModuleManifest {
  id: string
  name: string
  /** Must be false for anything in the base. True = needs keys to do anything useful. */
  requiresKeys: boolean
  envKeys: string[]
  cspOrigins: { connect?: string[]; script?: string[]; frame?: string[] }
  dependencies: string[]
  /** Every path the module creates — `remove-module` deletes exactly these. */
  files: string[]
  /** Docs pages that ship with it. */
  docs: string[]
  /** Where it touches the shell (must be additive only). */
  integrationPoints: string[]
}

export const MODULES: ModuleManifest[] = [
  {
    id: "billing",
    name: "Stripe billing",
    requiresKeys: true,
    envKeys: [
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "NEXT_PUBLIC_STRIPE_PRICE_PRO",
    ],
    cspOrigins: {
      connect: ["https://api.stripe.com"],
      script: ["https://js.stripe.com"],
      frame: ["https://js.stripe.com", "https://checkout.stripe.com"],
    },
    dependencies: ["stripe", "@stripe/stripe-js"],
    files: [
      "lib/billing.ts",
      "app/api/stripe/webhook/route.ts",
      "components/billing/**",
    ],
    docs: ["content/docs/kit/billing.mdx"],
    integrationPoints: [
      "lib/csp.mjs -> buildCsp({ extraConnect, extraScript, extraFrame })",
      "components/marketing/pricing-table.tsx -> checkout hrefs",
      "app/(app)/layout.tsx -> entitlement gate",
    ],
  },
  // …auth, database, email, i18n, blog, storage, admin, flags
]
```

`scripts/remove-module.mjs` — **dry-run by default**:

```bash
pnpm remove-module billing            # prints the plan: files, deps, env keys, docs, CSP origins
pnpm remove-module billing --write    # deletes files, prunes package.json + .env.example + lib/env.ts
```

Rules for every module, forever:

1. **Additive only.** A module may add files, add env keys, add CSP origins, add a route group.
   It may **never** edit `lib/routes.ts`, `lib/nav.ts` (append-only), or an existing component's
   behaviour. That is what keeps upstream upgrades cherry-pickable.
2. **Zero-key or it is not a module.** If it cannot degrade to a no-op, it belongs in a dedicated
   product, not in the family template.
3. **Docs ship with it.** No module lands without its `content/docs/kit/<id>.mdx` page.
4. **`pnpm doctor` + `pnpm knip` stay clean** after removal — that is the acceptance test.

### 22.3 What is deliberately _never_ in the starter

| Never                                                | Why                                                            |
| :--------------------------------------------------- | :------------------------------------------------------------- |
| Canvas / inspector kit, snap guides                  | Product-specific interaction design (Tweak builds it)          |
| Tool history / undo-redo engine                      | Domain logic, not template logic                               |
| Export / share engines                               | Same                                                           |
| Code-native registry components that need a database | A distributed component must work standalone                   |
| A chart library with no product needing charts       | Weight without purpose                                         |
| A CMS                                                | MDX + git is the CMS                                           |
| Storybook                                            | The docs engine + previewer already are the component explorer |

---

## 23. Presets & the Generator

### 23.1 Presets — one template, four products

| Preset    | Keeps                                                          | Deletes                                                                       | Use for                                     |
| :-------- | :------------------------------------------------------------- | :---------------------------------------------------------------------------- | :------------------------------------------ |
| `library` | everything                                                     | —                                                                             | Satisium Pro UI (docs + registry + landing) |
| `tool`    | app shell, workbench, docs (getting-started), landing, legal   | `registry/**`, `public/r`, `app/preview`, `app/embed`, `components/previewer` | Tweak, Typeset                              |
| `saas`    | app shell, marketing, legal, analytics, docs (getting-started) | registry + previewer + `content/docs/components/**`                           | a product website with a dashboard          |
| `landing` | landing, legal, analytics, SEO                                 | docs + registry + `/app`                                                      | a waitlist / launch page                    |

The preset only decides **what is deleted at init time**. Everything kept is fully wired — there
are no half-disabled features, because a disabled feature is worse than an absent one.

### 23.2 `scripts/init-project.mjs` `[NEW]` — brand + prune in one command

```js
#!/usr/bin/env node
/**
 * pnpm setup — brand and prune this template into a new Satisium product.
 *
 *   pnpm setup
 *   pnpm setup --name "Tweak" --slug tweak --domain https://tweak.app --preset tool
 *
 * Safe by design: refuses to run twice, never touches git, and every edit is asserted
 * (mustReplace throws when a pattern is missing) so a future refactor fails loudly
 * instead of silently branding nothing.
 */
import fs from "fs"
import path from "path"
import readline from "readline/promises"
import { fileURLToPath } from "url"

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

const PRESETS = {
  library: { keepRegistry: true, keepDocs: true },
  tool: { keepRegistry: false, keepDocs: true },
  saas: { keepRegistry: false, keepDocs: true },
  landing: { keepRegistry: false, keepDocs: false },
}

function parseFlags(argv) {
  const flags = {}
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith("--")) continue
    const key = token.slice(2)
    const next = argv[index + 1]
    if (!next || next.startsWith("--")) flags[key] = true
    else {
      flags[key] = next
      index += 1
    }
  }
  return flags
}

const abs = (relative) => path.join(ROOT, relative)
const read = (relative) => fs.readFileSync(abs(relative), "utf-8")
const write = (relative, content) =>
  fs.writeFileSync(abs(relative), content, "utf-8")

function mustReplace(file, pattern, replacement, label) {
  const source = read(file)
  const next = source.replace(pattern, replacement)
  if (next === source)
    throw new Error(`init-project: could not find ${label} in ${file}`)
  write(file, next)
}

function removeIfExists(relative) {
  const target = abs(relative)
  if (!fs.existsSync(target)) return false
  fs.rmSync(target, { recursive: true, force: true })
  return true
}

async function main() {
  if (fs.existsSync(abs(".starter-initialised"))) {
    console.error("✖ Already initialised (.starter-initialised exists).")
    process.exit(1)
  }

  const flags = parseFlags(process.argv.slice(2))
  let { name, slug, domain, preset } = flags

  if (!name || !slug || !domain || !preset) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    name ??= await rl.question("Product name (e.g. Tweak): ")
    slug ??= name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    domain ??= await rl.question("Production origin (https://…): ")
    preset ??=
      (await rl.question("Preset [library|tool|saas|landing] (tool): ")) ||
      "tool"
    rl.close()
  }

  if (!PRESETS[preset]) throw new Error(`Unknown preset "${preset}"`)

  // 1 — branding
  mustReplace(
    "lib/config.ts",
    /name: "Satisium Starter"/,
    `name: "${name}"`,
    "PRODUCT.name"
  )
  mustReplace(
    "lib/config.ts",
    /shortName: "Starter"/,
    `shortName: "${name.split(" ")[0]}"`,
    "PRODUCT.shortName"
  )
  mustReplace(
    "lib/config.ts",
    /defaultTitle: "[^"]*"/,
    `defaultTitle: "${name}"`,
    "PRODUCT.defaultTitle"
  )
  mustReplace(
    "lib/config.ts",
    /titleTemplate: "[^"]*"/,
    `titleTemplate: "%s | ${name}"`,
    "PRODUCT.titleTemplate"
  )
  mustReplace(
    "lib/social-links.ts",
    /name: "Satisium Starter"/,
    `name: "${name}"`,
    "PROJECT.name"
  )
  mustReplace(
    "lib/social-links.ts",
    /export const REPO = "[^"]*"/,
    `export const REPO = "satisium/${slug}"`,
    "REPO"
  )
  mustReplace(
    "lib/logger.ts",
    /\[Satisium Starter\]/g,
    `[${name}]`,
    "logger tag"
  )
  mustReplace(
    "scripts/build-llms.mjs",
    /const PRODUCT_NAME = "[^"]*"/,
    `const PRODUCT_NAME = "${name}"`,
    "PRODUCT_NAME"
  )
  mustReplace(
    "registry.json",
    /"name": "[^"]*"/,
    `"name": "${slug}"`,
    "registry name"
  )
  mustReplace(
    "registry.json",
    /"homepage": "[^"]*"/,
    `"homepage": "${domain}"`,
    "registry homepage"
  )
  mustReplace(
    "registry/index.ts",
    /https:\/\/your-domain\.com/g,
    domain,
    "install commands"
  )

  const pkg = JSON.parse(read("package.json"))
  pkg.name = slug
  write("package.json", `${JSON.stringify(pkg, null, 2)}\n`)

  write(
    ".env.example",
    read(".env.example").replace(
      /NEXT_PUBLIC_SITE_URL=""/,
      `NEXT_PUBLIC_SITE_URL="${domain}"`
    )
  )

  // 2 — preset pruning
  const config = PRESETS[preset]
  const removed = []

  if (!config.keepRegistry) {
    for (const target of [
      "registry/ui",
      "registry/demos",
      "registry/strings",
      "public/r",
      "app/preview",
      "app/embed",
      "components/previewer",
    ]) {
      if (removeIfExists(target)) removed.push(target)
    }
  }

  if (!config.keepDocs) {
    for (const target of ["content/docs", "app/docs", "components/docs"]) {
      if (removeIfExists(target)) removed.push(target)
    }
  }

  // 3 — stamp + hand-off
  write(
    ".starter-initialised",
    `${new Date().toISOString()} · preset=${preset} · ${name}\n`
  )

  console.log(`\n✅ ${name} initialised (preset: ${preset})\n`)
  if (removed.length) console.log(`  removed: ${removed.join(", ")}\n`)
  console.log("  Manual steps the script cannot do:")
  console.log(
    "   1. Brand assets: app/icon.svg, app/apple-icon.png, app/favicon.ico,"
  )
  console.log(
    "      public/satisium.png, public/og-bg-optimized.jpg, public/android-chrome-*.png"
  )
  console.log(
    "   2. app/api/og/route.tsx — logo src, wordmark, default title/label"
  )
  console.log("   3. lib/social-links.ts — AUTHOR + TWITTER_CREATOR")
  console.log("   4. content/docs/index.mdx — write the real introduction")
  console.log("   5. pnpm install && pnpm dev && pnpm doctor\n")
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
```

```json
// package.json
"setup": "node scripts/init-project.mjs",
"remove-module": "node scripts/remove-module.mjs"
```

### 23.3 The 60-second new-product flow

```bash
git clone https://github.com/satisium/starter.git my-product && cd my-product
pnpm install
pnpm setup --name "Tweak" --slug tweak --domain https://tweak.app --preset tool
pnpm dev
```

### 23.4 Post-init checklist (the part automation should not do)

| #   | Task                                 | Where                                         |
| :-- | :----------------------------------- | :-------------------------------------------- |
| 1   | Replace the six brand assets         | `app/*`, `public/*` (§23.2 output)            |
| 2   | OG route: mark, background, wordmark | `app/api/og/route.tsx`                        |
| 3   | Socials + author                     | `lib/social-links.ts`                         |
| 4   | First real docs page                 | `content/docs/index.mdx`                      |
| 5   | Analytics project + `app_name`       | PostHog + `components/analytics-provider.tsx` |
| 6   | Legal pages with real entity details | `content/legal/*.mdx`, `lib/legal.ts`         |
| 7   | Domain + env in the host             | `NEXT_PUBLIC_SITE_URL`, `GIT_TOKEN`           |
| 8   | Remote repo + branch protection + CI | GitHub: `main`, require the 4 CI jobs         |
| 9   | Uptime monitor                       | point at `/api/health`                        |
| 10  | Search Console + Bing verification   | env vars (§4.7)                               |

---

## 24. Handoff — how to run this build

### 24.1 Build order

| Phase | What                                      | Section            |
| :---- | :---------------------------------------- | :----------------- |
| 0     | Repository, configs, dependencies         | §3–§4              |
| 1     | Design system: tokens, fonts, theme       | §5                 |
| 2     | Foundations: `lib`, `store`, `hooks`      | §6                 |
| 3     | Brand layer & UI primitives               | §7                 |
| 4     | Docs layouts (Spatial + Standard)         | §8                 |
| 5     | Fumadocs MDX engine                       | §9                 |
| 6     | Code block engine                         | §10                |
| 7     | Registry & previewer                      | §11                |
| 8     | App space: landing, `/app`, footer        | §12                |
| 9     | SEO, OG, crawling                         | §13                |
| 10    | LLM / AI discovery pipeline               | §14                |
| 11    | Release, CI, quality gates                | §15                |
| 12    | Verification & acceptance                 | §16                |
| 13    | Analytics, consent & observability        | §18                |
| 14    | Tooling, DX & repo hygiene                | §19                |
| 15    | Testing & CI matrix                       | §20                |
| 16    | Quality, security & compliance            | §21                |
| —     | Template library (components, hooks, lib) | `component-kit.md` |
| —     | Presets + generator                       | §23                |
| —     | Backlog & module contract                 | §22                |

### 24.2 The ten rules (put these on a wall)

1. **Zero-key boot.** Empty `.env.local` → app boots, builds, tests pass.
2. **Tokens only.** No hex, no `gray-500`, no inline springs — `lib/motion.ts` exists.
3. **Routes from `lib/routes.ts`; nav from `lib/nav.ts`.** No literal `href`.
4. **Two libraries, never mixed.** `registry/**` is distributed, `components/**` is internal.
5. **Additive modules only.** A module may not edit an upstream file.
6. **Docs ship with the feature.** No capability lands without its `content/docs` page.
7. **Analytics never blocks anything.** Silent without keys, consent-gated, no PII.
8. **Motion respects the user.** `MotionConfig reducedMotion="user"` + the CSS block (§21.1).
9. **Label every icon-only control.** `aria-label` + `title`; axe verifies it in CI.
10. **`pnpm verify` before every commit.** lint · typecheck · test · build.

### 24.3 Maintenance cadence for the template itself

| Cadence                                         | Action                                                                     |
| :---------------------------------------------- | :------------------------------------------------------------------------- |
| Every product bug that is really a template bug | Fix upstream first, then cherry-pick into the product                      |
| Monthly                                         | `pnpm outdated`, Dependabot PRs, `pnpm doctor`, registry contract tests    |
| Per template release                            | Bump `STARTER_VERSION`, add an `UPGRADING.md` section, tag it              |
| When a module graduates from §22                | Add the manifest to `lib/modules.ts`, the docs page, and the removal entry |

---

**End of specification.**

Two documents, one system:

- **`starter-template.md`** (this file) — the shell: brand, docs engine, registry, SEO, analytics,
  tooling, testing, quality and the module contract.
- **`component-kit.md`** — the template library: conventions, inventory, and the full source for
  foundations, hooks, shells, states and MDX components.

Build order recap: Phase 0 configs → 1 tokens → 2 foundations → 3 brand → 4 layouts → 5 docs
engine → 6 code block → 7 registry/previewer → 8 app space → 9 SEO → 10 LLM → 11 release →
12 verification → 13 analytics → 14 tooling → 15 testing → 16 quality. Then brand it with
`pnpm setup` and ship.
