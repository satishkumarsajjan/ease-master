# Satisium Presets — Architecture, Purpose, and Specifications

> **Status:** Canonical Specification  
> **Authority:** Satisium Architecture & Brand Standards  
> **Audience:** Developers, Contributors, and AI Coding Agents  
> **Last Updated:** October 2026

---

## 1. What is a Preset?

In the Satisium ecosystem, a **Preset** is a **curated, production-grade landing page composition** specifically tuned to a distinct product persona.

It defines:

- Which section variants appear on the root landing page (`app/page.tsx`).
- The marketing narrative, hero posture, and feature highlighting strategy.
- Which primary Call-to-Action (CTA) is emphasized (e.g., launching an in-browser canvas vs. copying a CLI installation command).
- Which Box 1 Directory Deck is displayed in the footer (`Tool Deck` vs. `UI Deck`).

---

## 2. What are we trying to achieve with the Preset concept?

Satisium products primarily fall into two distinct software archetypes:

1. **Interactive Tools & Apps (`tool`):**  
   Precision web utilities, canvas editors, simulators, and creative workstations (e.g. _Tweak_, _Ease_, _Typeset_).
2. **Component Libraries & Design Systems (`ui`):**  
   Reusable UI primitives, open registries, and design tokens (e.g. _Satisium UI_).

### The Problems Presets Solve:

- **Eliminates Prototype Bloat:** Prevents landing pages from stacking multiple redundant variants of features, FAQs, and CTAs on top of each other.
- **Eliminates Setup Friction:** A single declarative configuration instantly equips a new product with an optimized, battle-tested marketing narrative.
- **Maintains Brand Consistency:** Every product presents a polished, unified visual standard with zero guesswork.

---

## 3. The Non-Negotiable Invariants: What Presets ARE vs What Presets ARE NOT

To prevent recurring misunderstandings and accidental regressions, all developers and AI agents must strictly follow these invariants:

### ✅ What Presets ARE:

1. **Landing Page Configurations Only:** Presets dictate the layout, sequence, and component choices inside `app/page.tsx`.
2. **Declarative & Reversible:** Switching between presets is as simple as updating a configuration variable (`PRESET = "tool" | "ui"`).
3. **Additive, Not Destructive:** Both presets co-exist harmoniously in the same codebase.

### ❌ What Presets ARE NOT:

1. **NEVER Destructive File Deletion:**  
   Presets do **NOT** delete files, prune directories, or strip modules from the repository.
   - The Shadcn registry (`registry/`, `public/r/`) **stays intact**.
   - The component previewer (`components/previewer/`) **stays intact**.
   - The product documentation engine (`content/docs/`) **stays intact**.
   - The product workstation canvas (`/app`) **stays intact**.  
     _Rationale:_ Interactive tools often need registries to distribute presets, themes, or plugins, and component libraries often need interactive canvases. Everything remains available in the codebase.
2. **NEVER Touch or Remove the `LandingBox`:**  
   The `LandingBox` (sliding monolith Box 1 + stationary bedrock Box 2 with the folded tab `"A product by Satisium"`) is the hallmark brand signature of Satisium products. It is never bypassed, dismantled, or removed in any preset.

---

## 4. The Two Production Presets in Detail

### Preset 1: `tool` (Interactive Tools & Apps)

Built for precision web tools, editors, and canvas utilities (e.g. _Tweak_, _Ease_, _Typeset_).

- **Target Audience:** Design engineers, frontend developers, and solo founders looking for focused, high-speed utilities.
- **Core Value Proposition:** Real-time feedback, tactile controls, instant export (CSS, TSX, JSON), keyboard shortcuts (⌘K), and local-first execution.
- **Commercial Model:** Free and open-source by default. (No pricing tables; paid tiers are added only in future iterations when explicitly required).
- **Landing Page Composition:**
  1. **Hero Stage:** [`HeroVariant2`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/hero/hero-variant-2/hero-variant-2.tsx) (interactive typewriter headline + scroll video preview stage + quick theme switcher).
  2. **Manifesto Stage:** [`DescriptionScrub`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/description/description-scrub.tsx) (kinetic sticky scroll-scrubbed typography).
  3. **Features Stage:** [`FeaturesVariant4`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/features/features-variant-4.tsx) (4-card Bento Grid featuring keycaps, miniature spatial rail, and visual artifacts).
  4. **Sandbox Stage:** [`ShowcaseStage`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/showcase/showcase-stage.tsx) (embedded live interactive tool preview).
  5. **FAQ Stage:** [`FaqVariant2`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/faq/faq-variant-2.tsx) (clean single-column centered accordion covering essential inquiries).
  6. **CTA Stage:** [`CtaVariant1`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/cta/cta-variant-1.tsx) (Inverted Monolith Stage with "Explore Documentation" & "Launch Workstation").
  7. **Footer Deck:** [`DeckBox1Variant1`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/footer/deck-box-1/deck-box-1-variant-1.tsx) (3-Column Tool Directory Deck: _Product_, _Resources_, _Legal_ with social dock and baseline).
- **Specific Exclusions for `tool`:**
  - **No Logo Cloud** (omitted to maintain focused, utility-first aesthetics).
  - **No Pricing Tables** (omitted for free OSS tools).
  - **No Full-Screen Footer** (`FooterVariant2` drawer omitted; `DeckBox1Variant1` anchors naturally to the base of Box 1).

---

### Preset 2: `ui` (Component Libraries & Design Systems)

Built for distributable component kits and design systems (e.g. _Satisium UI_).

- **Target Audience:** Engineering teams and design systems engineers seeking accessible, beautifully styled primitives.
- **Core Value Proposition:** Zero opacity hacks, pure OKLCH luminance tokens, copy-paste shadcn CLI commands, and accessible keyboard navigation.
  -* **Landing Page Composition:**
  1. **Hero Stage:** [`HeroVariant1`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/hero/hero-variant-1/hero-variant-1.tsx) (UI Typewriter Canvas + Explore Components action + Video Preview button).
  2. **Social Proof Stage:** [`LogoCloudVariant1`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/logos/logos-variant-1.tsx) (Continuous Marquee with Names).
  3. **Manifesto Stage:** [`DescriptionScrub`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/description/description-scrub.tsx) (Kinetic Sticky Scroll Manifesto).
  4. **Features Stage:** [`FeaturesVariant4`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/features/features-variant-4.tsx) (4-card Bento Grid featuring keycaps, miniature spatial rail, and visual artifacts).
  5. **FAQ Stage:** [`FaqVariant2`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/faq/faq-variant-2.tsx) (Centered Minimalist Essential Accordion).
  6. **Climax & Terminal Footer:** [`FooterVariant2`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/footer/footer-variant-2.tsx) (`ctaVariant={1}` Inverted Monolith CTA + `deckVariant={2}` 3-Column UI Directory Deck: _Components_, _Getting Started_, _Legal_).

---

## 5. Universal Elements Across ALL Presets

Regardless of which preset is selected, the following core brand architecture is **always shared and preserved**:

1. **The `LandingBox` Container:**
   - **Box 1 (The Sliding Monolith):** Hosts the active preset content and the corresponding Box 1 Footer Deck.
   - **Box 2 (The Stationary Bedrock):** Hosts the umbrella brand deck ([`deck-box-2-variant-1.tsx`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/components/home/footer/deck-box-2/deck-box-2-variant-1.tsx)), creator bookends, and the untouchable `"SATISIUM"` optical wordmark.
   - **Folded Index Tab:** The sleek `"A product by Satisium"` tab that toggles Box 1 reveal.
2. **Design Language & Quality Contract:**
   - **Tokens Only:** Strictly OKLCH semantic tokens (`bg-background`, `bg-muted`, `bg-card`, etc.).
   - **Zero Opacity Modifiers:** Never use Tailwind opacity modifiers on colors (e.g. no `/80`, `/50`).
   - **Routes & Navigation:** All routes sourced from `lib/routes.ts` and navigation trees from `lib/nav.ts`.
   - **The Zero-Key Rule:** The product boots, builds, and passes tests with an empty `.env.local`.

---

## 6. Implementation Architecture

To ensure presets are modular, clean, and maintainable, the codebase organizes them as follows:

```
components/home/presets/
├── tool-preset.tsx        # Pure composition of the 'tool' marketing landing page
├── ui-preset.tsx          # Pure composition of the 'ui' marketing landing page
└── index.ts               # Clean barrel exports
```

### 1. Configuration in `config/site.ts`

```ts
/**
 * Active Marketing Preset:
 * - "tool": Interactive tools, editors, and canvas utilities (e.g. Tweak, Typeset)
 * - "ui":   Component libraries, design systems, and registries (e.g. Satisium UI)
 */
export const PRESET: "tool" | "ui" = "tool"
```

### 2. Page Assembly in `app/page.tsx`

```tsx
import { PRESET } from "@/config/site"
import { ToolPreset, UiPreset } from "@/components/home/presets"

export default function LandingPage() {
  return PRESET === "ui" ? <UiPreset /> : <ToolPreset />
}
```

### 3. Role of `pnpm setup`

When a developer runs `pnpm setup`:

- It asks for the **Product Name**, **Slug**, and **Production Domain**.
- It asks for the **Preset Choice** (`tool` or `ui`).
- It updates `config/site.ts` with the chosen brand strings and sets `PRESET = "tool"` (or `"ui"`).
- **It does NOT delete any files or code.** All files remain available in the repository.
