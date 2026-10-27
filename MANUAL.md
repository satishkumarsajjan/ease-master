# Satisium Starter — Personal Operator's Manual & Architecture Playbook

> [!IMPORTANT]
> **Internal Satisium Document**  
> This template and manual are engineered exclusively for **Satishkumar's personal use** across products, web applications, developer utilities, and UI registries built under **The Satisium Umbrella**.

---

## Table of Contents

1. [Foundational Philosophy & Invariants](#1-foundational-philosophy--invariants)
2. [Presets Architecture & Landing Pages](#2-presets-architecture--landing-pages)
3. [The Negative Spacing & Layout Engine](#3-the-negative-spacing--layout-engine)
4. [New Project Kickoff: The 5-Minute Spin-Up Playbook](#4-new-project-kickoff-the-5-minute-spin-up-playbook)
5. [Dual-Shell Development Guide (App vs. Docs)](#5-dual-shell-development-guide-app-vs-docs)
6. [Component Registry Pipeline](#6-component-registry-pipeline)
7. [Verification, Quality & Command Cheat Sheet](#7-verification-quality--command-cheat-sheet)

---

## 1. Foundational Philosophy & Invariants

Every product created from this starter inherits the Satisium Design Contract. These rules are non-negotiable across every project:

### The Non-Negotiable Invariants

| Standard                   | Rule                                                                                                                                                                                                                          | Rationale                                                                                                                        |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **Zero-Key Rule**          | The repository MUST boot, build, and test cleanly with an empty `.env.local`.                                                                                                                                                 | Eliminates dependency on external secret providers for local iteration and CI.                                                   |
| **Tokens Only**            | No raw hex codes (`#123456`), rgb, or generic Tailwind colors (`text-gray-500`). Use semantic tokens only (`bg-background`, `text-muted-foreground`, `bg-card`).                                                              | Guarantees fluid, high-contrast dark/light mode parity and OKLCH color ramp consistency.                                         |
| **Zero Opacity Modifiers** | Never use Tailwind color opacity hacks (e.g. `bg-secondary/70`, `text-muted-foreground/80`, `bg-foreground/20`).                                                                                                              | Prevents substrate bleed, luminosity shifts, and color mismatches. Use discrete semantic variables (`bg-secondary`, `bg-muted`). |
| **Motion Tokens Only**     | Never inline stiffness or damping numbers. Always import from [`lib/motion.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/lib/motion.ts) (`SPRING.fluid`, `SPRING.card`, `EASE.cinematic`). | Keeps physics consistent across all animated interactions and micro-gestures.                                                    |
| **Centralized Routing**    | Never write literal string paths like `href="/docs"`. All routes MUST come from [`lib/routes.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/lib/routes.ts).                                 | Makes path refactoring instantaneous across headers, menus, decks, and documentation.                                            |
| **Centralized Navigation** | Header, mobile sheet, spatial rail, and ⌘K search bar read exclusively from [`lib/nav.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/lib/nav.ts).                                           | Eliminates duplicate navigation lists and keeps menus synchronized.                                                              |
| **Strict Type Safety**     | Zero `any`, zero `as unknown as`, zero `console.log` in production code (use [`lib/logger.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/lib/logger.ts)).                                   | Catches bugs during compilation rather than in browser runtime.                                                                  |

---

## 2. Presets Architecture & Landing Pages

Landing pages in Satisium are **pure React compositions** housed in [`components/home/presets/`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/presets/). They never delete template files, registries, or documentation engines.

### Available Presets

```
components/home/presets/
├── index.ts                   # Clean barrel exports
├── ui-landing-page.tsx        # UI / Design System Preset
├── tool-landing-page.tsx      # Interactive Tool / App Preset
└── showcase-landing-page.tsx  # Master Variant Gallery (10 Marketing Stages)
```

#### 1. [`UiLandingPage`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/presets/ui-landing-page.tsx)

- **Target:** Component registries, UI kits, design systems, and open-source libraries (e.g. `ui.satisium.com`).
- **Narrative Flow:**
  1. `HeroVariant1` — Typewriter canvas with interactive annotations, explore action, and video preview.
  2. `LogoCloudVariant1` — Continuous marquee ticker with technology names (social proof).
  3. `DescriptionScrub` — 200vh sticky kinetic scroll manifesto with word illumination.
  4. `FeaturesVariant4` — 4-card interactive Bento Grid with tactile keycaps, spatial rails, and code snippets.
  5. `FaqVariant2` — Minimalist single-column centered accordion (Essential 5 questions).
  6. `FooterVariant2` — Fullscreen terminal footer stage with Inverted Monolith CTA and 2-island UI directory deck.

#### 2. [`ToolLandingPage`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/presets/tool-landing-page.tsx)

- **Target:** Interactive web applications, canvas editors, compilers, and precision utilities (e.g. `tool.satisium.com`).
- **Narrative Flow:**
  1. `HeroVariant2` — Catalyst typewriter hero with embedded 16:9 scroll video demo stage.
  2. `DescriptionScrub` — Kinetic scroll manifesto.
  3. `FeaturesVariant4` — 4-card bento grid.
  4. `ShowcaseStage` — Embedded live interactive sandbox iframe (`/stage`).
  5. `FaqVariant2` — Centered accordion.
  6. `CtaVariant1` — Minimalist Inverted Monolith Call to Action.
  7. `DeckBox1Variant1` — 3-column tool directory deck (Product, Resources, Legal) inside Box 1 footer.

#### 3. [`ShowcaseLandingPage`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/presets/showcase-landing-page.tsx)

- **Target:** Design drafting, variant exploration, and live review of all 10 marketing stages:
  - Hero (Variant 2)
  - Logos (Variants 1, 2, 3)
  - Manifesto (DescriptionScrub)
  - Features (Variants 1, 2, 3, 4)
  - Live Showcase (`/stage`)
  - Pricing (Variants 1, 2, 3, 4)
  - Testimonials (Variants 1, 2)
  - FAQ (Variants 1, 2)
  - CTA (Variants 1, 2, 3, 4)
  - Directory Deck (Variants 1, 2)

### How to Select or Compose a Preset

To switch presets, edit a single line in [`app/page.tsx`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/app/page.tsx):

```tsx
import { UiLandingPage } from "@/components/home/presets"

export default function LandingPage() {
  return <UiLandingPage />
}
```

Or compose a bespoke narrative flow:

```tsx
import {
  LandingBox,
  LandingBoxContent,
  LandingBoxFooter,
} from "@/components/home/landing-box"
import { HeroVariant2 } from "@/components/home/hero"
import { FeaturesVariant1 } from "@/components/home/features"
import { PricingVariant2 } from "@/components/home/pricing"
import { FooterVariant2 } from "@/components/home/footer"

export default function LandingPage() {
  return (
    <LandingBox>
      <LandingBoxContent className="flex flex-col gap-28 pb-0 sm:gap-40 sm:pb-0 md:gap-52 md:pb-0 lg:gap-60 lg:pb-0">
        <HeroVariant2 />
        <FeaturesVariant1 />
        <PricingVariant2 />
      </LandingBoxContent>
      <LandingBoxFooter className="pt-24 sm:pt-36 md:pt-48 lg:pt-52">
        <FooterVariant2 ctaVariant={1} deckVariant={1} />
      </LandingBoxFooter>
    </LandingBox>
  )
}
```

---

## 3. The Negative Spacing & Layout Engine

### The 2-Layer Monolith Chassis ([`LandingBox`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/landing-box.tsx))

All Satisium landing pages are mounted inside the brand chassis:

```
┌─────────────────────────────────────────────────────────────┐
│ BOX 2: Stationary Bedrock (Behind)                          │
│   • Directory Deck (Navigation matrix)                      │
│   • Atmospheric SATISIUM Wordmark Lens Blur                 │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ BOX 1: Sliding Product Monolith (z-10)              │   │
│   │   • <LandingBoxContent>                             │   │
│   │       - Hero -> Logos -> Manifesto -> Features      │   │
│   │   • <LandingBoxFooter>                              │   │
│   │       - Terminal Stage / Directory Deck             │   │
│   │                                                     │   │
│   │   [ A product by Satisium ]  <- Architectural Tab   │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

- **Rest-State Optimization:** When `LandingBox` is at rest, its CSS `transform` is strictly set to `none`. This guarantees 100% native browser sticky scrolling performance for `DescriptionScrub` and sticky headers.
- **Architectural Folded Tab:** Clicking the folded tab at the bottom right smoothly lifts Box 1 up by ~85% of the viewport (or 92% on mobile) using `EASE.cinematic`, unveiling Box 2 behind it.

### The Macro Negative Spacing Scale

To prevent the page from feeling cluttered, spacing between major sections is governed by the layout container rather than arbitrary internal component paddings.

```css
/* Satisium Macro Spacing Scale */
className="flex flex-col gap-28 pb-0 sm:gap-40 sm:pb-0 md:gap-52 md:pb-0 lg:gap-60 lg:pb-0"
```

| Viewport                   | Tailwind Token | Pixel Distance | Visual Purpose                                            |
| :------------------------- | :------------- | :------------- | :-------------------------------------------------------- |
| **Mobile (<640px)**        | `gap-28`       | **112px**      | Clean breathing space without excessive finger scrolling  |
| **Tablet (640px–768px)**   | `sm:gap-40`    | **160px**      | Clear separation between card grids and text              |
| **Desktop (768px–1024px)** | `md:gap-52`    | **208px**      | Chapter isolation; previous section exits viewport        |
| **Wide Desktop (1024px+)** | `lg:gap-60`    | **240px**      | Full cinematic negative space; one section per focal view |

> [!TIP]
> **Zero Compound Leaks:** Section roots (`LogoCloud`, `Features`, `Faq`, `Cta`) must maintain `py-0`. If a component adds internal vertical padding, it compounds with the container gap (e.g. 240px + 64px = 304px), breaking the vertical rhythm.

---

## 4. New Project Kickoff: The 5-Minute Spin-Up Playbook

When creating a new application or utility under Satisium:

### Step 1: Copy Template

```bash
cp -r starter-template ../my-new-tool
cd ../my-new-tool
pnpm install
```

### Step 2: Configure Branding & Identity

Open [`config/site.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/config/site.ts) (which feeds [`lib/config.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/lib/config.ts)):

```ts
export const PRODUCT = {
  name: "Satisium Canvas",
  shortName: "Canvas",
  titleTemplate: "%s | Satisium Canvas",
  defaultTitle: "Satisium Canvas — Vector Engineering for Web",
  description: "Precision web canvas for modern frontend engineering.",
  applicationCategory: "DesignApplication",
} as const

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://canvas.satisium.com"
```

### Step 3: Configure Routes & Navigation

1. **Routes:** Update [`lib/routes.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/lib/routes.ts) with paths specific to your tool.
2. **Navigation:** Update [`lib/nav.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/lib/nav.ts) to define the items in `APP_NAV` and `FOOTER_NAV`.

### Step 4: Pick Landing Page Preset

In [`app/page.tsx`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/app/page.tsx), import either `ToolLandingPage` or `UiLandingPage`.

### Step 5: Run Health Check

```bash
pnpm doctor
pnpm typecheck
```

---

## 5. Dual-Shell Development Guide (App vs. Docs)

The template provides two distinct production-grade shells:

### 1. The App Shell (`/app`)

Located in [`app/app/`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/app/app/):

- Mounts the workstation layout with the spatial rail navigation and top command bar.
- **Keyboard Shortcuts:** Register new hotkeys in [`lib/hotkeys.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/lib/hotkeys.ts) and attach them in components with `useHotkey("mod+k", callback)`.
- **Command Menu:** ⌘K modal automatically indexes routes and actions defined in [`lib/nav.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/lib/nav.ts).

### 2. The Docs Shell (`/docs`)

Located in [`app/docs/`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/app/docs/) and powered by **Fumadocs**:

- **Content Source:** MDX files live in [`content/docs/`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/content/docs/).
- **Dual Layout Engine:** Switch between Satisium's signature `spatial` card-shift layout and the traditional `three-pane` layout in `.env.local`:
  ```bash
  NEXT_PUBLIC_DOCS_LAYOUT="spatial" # or "three-pane"
  ```
- **Interactive Component Previewers:** Use the `<ComponentPreview name="pulse-card" />` shortcode in MDX to render live registry previews with source code inspection and one-click copy commands.

---

## 6. Component Registry Pipeline

If the tool includes reusable UI primitives that you want to publish or consume via shadcn CLI:

### The 4-File Registry Contract

To add a component named `data-slider`:

1. **Primitive:** [`registry/ui/data-slider.tsx`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/registry/ui/)
2. **Live Demo:** [`registry/demos/components/data-slider/data-slider-demo.tsx`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/registry/demos/components/) (default export)
3. **Strings Manifest:** [`registry/strings/data-slider.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/registry/strings/)
4. **Registry Entry:** Register in [`registry/index.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/registry/index.ts).

### Compiling Registry Payloads

Run the compilation scripts to generate static JSON payloads into `public/r/`:

```bash
pnpm build:registry:meta
pnpm registry:public
```

Once compiled, components can be installed in any shadcn project using:

```bash
npx shadcn@latest add http://localhost:3000/r/data-slider.json
```

---

## 7. Verification, Quality & Command Cheat Sheet

### Everyday Commands

| Task                        | Command                                            | Description                                                   |
| :-------------------------- | :------------------------------------------------- | :------------------------------------------------------------ |
| **Dev Server**              | `pnpm dev`                                         | Starts Turbo dev server at `http://localhost:3000`.           |
| **Diagnostic Health Check** | `pnpm doctor`                                      | Runs 13-point automated check across env, routes, and tokens. |
| **Full Pre-Commit Gate**    | `pnpm verify`                                      | Runs lint + typecheck + Vitest test suite + Next.js build.    |
| **Type Check**              | `pnpm typecheck`                                   | Validates TypeScript with zero errors.                        |
| **Linting**                 | `pnpm lint`                                        | Validates ESLint token discipline and import rules.           |
| **Unit Tests**              | `pnpm test`                                        | Runs Vitest in JSDOM environment.                             |
| **New Docs Page**           | `pnpm make:doc <slug> [section]`                   | Scaffolds a new MDX page in `content/docs/`.                  |
| **Add shadcn Primitive**    | `pnpm dlx shadcn@latest add <name>`                | Adds upstream shadcn primitive into `components/ui/`.         |
| **Compile Registry**        | `pnpm build:registry:meta && pnpm registry:public` | Generates public JSON payloads in `public/r/`.                |
| **Update LLM Artifacts**    | `pnpm llm`                                         | Generates fresh `llms.txt` and `llms-full.txt` docs.          |

---

## Definition of Done (Satisium Standard)

Before shipping or committing changes to any Satisium tool:

1. `pnpm doctor` reports **13 passed, 0 problems**.
2. `pnpm typecheck` and `pnpm lint` pass with **0 errors and 0 warnings**.
3. All section transitions maintain the **240px negative spacing macro rhythm**.
4. Zero literal route strings (`href="/..."`) — all paths sourced from [`lib/routes.ts`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/lib/routes.ts).
5. The app boots cleanly with an empty `.env.local` (**Zero-Key Rule**).
