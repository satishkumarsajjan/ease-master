# 📋 Satisium Product Specification Template (`PRODUCT_SPEC.md`)

> ### 🔒 THE FOUNDER ↔ AGENT ↔ TEMPLATE CONTRACT
>
> 1. **The Zero-Assumption Invariant:**  
>    All values in this template and across the markdown documentation are **illustrative references only**. An AI agent must **NEVER** assume or hallucinate product names, domains, taglines, or descriptions. The agent must explicitly interview the Founder (Satishkumar) or read an approved `PRODUCT_SPEC.md` before touching code.
>
> 2. **The Kit Preservation Invariant (Zero Deletions During Build):**  
>    During spin-up and active feature development, **ZERO template files may be deleted**. All section variants (Hero 1/2, Deck-box 1/2), docs layouts (`spatial`/`three-pane`), and UI primitives remain 100% intact so the Founder can freely choose, test, and swap options.
>
> 3. **The Pre-Deployment Pruning Protocol:**  
>    Dead-code elimination and the removal of unreferenced files is strictly reserved for the final Pre-Deployment phase using `pnpm knip`. It must **never** occur during initial template spin-up.

---

## 1. Product Identity & Ecosystem Taxonomy

| Field                              | Description                                                                                                                          | Product Value               |
| :--------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- | :-------------------------- |
| **Product Name**                   | Full official product brand name                                                                                                     | `Type Studio`               |
| **Short Name**                     | Compact 1-2 word identifier                                                                                                          | `Type`                      |
| **Slug (`app_id`)**                | Canonical kebab-case identifier                                                                                                      | `type-studio`               |
| **Ecosystem**                      | Parent holding identity (Strictly `satisium`)                                                                                        | `satisium`                  |
| **Holding Company / Parent Brand** | Master entity                                                                                                                        | `SATISIUM`                  |
| **Pillar**                         | Macro branch (`design` or `labs`)                                                                                                    | `design`                    |
| **Cluster**                        | Functional group (e.g. `visual-primitives`, `management`, `engagement`)                                                              | `visual-primitives`         |
| **Product Type**                   | Nature of the tool (`studio`, `saas`, `library`, `cli`, `marketplace`)                                                               | `studio`                    |
| **Target Domain**                  | Part I Design: `https://<slug>.satisium.com`<br>Parts II & III Venture SaaS: Independent domain (e.g. `mosaic.app`, `kudosboard.io`) | `https://type.satisium.com` |
| **Application Category**           | Schema.org category (`DeveloperApplication`, `DesignApplication`, etc.)                                                              | `DeveloperApplication`      |

---

## 2. Search & Answer Engine Optimization (SEO & AEO)

### Title & Meta Snippet Guardrails

- **Title Template:** `%s | Type Studio`
- **Default Page Title (≤ 60 chars):**  
  `Type Studio — Fluid Clamp Typography Calculator | Satisium` _(59 chars)_
- **Meta Description (120–155 chars):**  
  `Calculate responsive fluid CSS clamp() font scaling without media queries. Generate and export mathematical typography scales directly into Tailwind CSS v4.` _(152 chars)_
- **Keywords:** `fluid typography, css clamp generator, typography scale, tailwind v4 typography, satisium`

### Sitelinks Candidates (Google Expanded SERP Grid)

_Define the top 4 navigational destinations for `SiteNavigationElement` JSON-LD:_

1. **Candidate 1:**
   - **Name:** `Workstation`
   - **Description:** `Interactive fluid typography canvas and curve visualizer.`
   - **Path:** `/app`
2. **Candidate 2:**
   - **Name:** `Preset Scales`
   - **Description:** `Curated typographic modular scales from Golden Ratio to Perfect Fourth.`
   - **Path:** `/docs/scales`
3. **Candidate 3:**
   - **Name:** `Tailwind Integration`
   - **Description:** `Drop-in configuration for Tailwind CSS v4 @theme inline utilities.`
   - **Path:** `/docs/installation`
4. **Candidate 4:**
   - **Name:** `Mathematical Formulas`
   - **Description:** `Technical documentation of the linear interpolation clamp equation.`
   - **Path:** `/docs/math`

### Direct-Answer FAQ Accordions (AEO / Perplexity Citations)

_Define 2–3 explicit question/answer pairs following the 45-Word Extractive Answer Rule:_

#### Question 1: How does fluid clamp typography work?

> **45-Word Answer:**  
> Fluid clamp typography uses the CSS clamp(min, preferred, max) function combined with viewport width (vw) units to smoothly scale font sizes between mobile and desktop viewports without relying on discrete media query breakpoints.

#### Question 2: How do you integrate Type Studio clamps into Tailwind CSS v4?

> **45-Word Answer:**  
> In Tailwind CSS v4, add the exported fluid font tokens directly to your main CSS file inside the @theme block using the --font-size-* namespace, making them immediately available across all utility classes.

---

## 3. Telemetry & North-Star Milestones (Analytics)

Refer to [`ANALYTICS_MANUAL.md`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/ANALYTICS_MANUAL.md) for event naming conventions.

| Metric Type                          | Event Name                 | Payload Properties                              | Business Meaning           |
| :----------------------------------- | :------------------------- | :---------------------------------------------- | :------------------------- |
| **Primary Value Event (North Star)** | `studio_export_downloaded` | `format: "css" \| "tailwind"`, `scale_name`     | User received core utility |
| **Secondary Activation Event**       | `studio_param_changed`     | `param: "min_size" \| "max_size" \| "viewport"` | User engaged with canvas   |
| **Docs Engagement Event**            | `docs_code_copied`         | `snippet_id`, `path`                            | User copied code snippet   |
| **Social / Share Event**             | `studio_shared`            | `platform: "twitter" \| "clipboard"`            | Virality / Referral        |

---

## 4. Workstation Architecture & Features

- **Primary Route:** `/app` (Interactive Workstation Canvas)
- **Docs Engine:** Fumadocs at `/docs` (Markdown/MDX content)
- **Preset Configuration:** `spatial` or `three-pane` layout in `config/site.ts`
- **Export Formats Supported:** CSS Variables, Tailwind v4 `@theme`, JSON Design Tokens

---

## 5. Variant & Layout Selection Matrix

The starter template ships with multiple pre-built section and layout variants. Selection is made via configuration (`config/site.ts`, environment variables, or page props).

> ⚠️ **Invariant:** Never delete unchosen variants during spin-up or development. All variant implementations must remain intact in the repository so the Founder can freely swap, test, and preview options. Pruning occurs strictly pre-deployment.

| Surface              | Config / Prop Setting                 | Available Options                                                                                             | Default / Chosen   |
| :------------------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------------ | :----------------- |
| **Docs Shell**       | `process.env.NEXT_PUBLIC_DOCS_LAYOUT` | `"spatial"` (signature card-shift) \| `"three-pane"` (borderless 3-column)                                    | `"spatial"`        |
| **Landing Hero**     | `<LandingHero variant="..." />`       | `"hero-variant-1"` (interactive visual) \| `"hero-variant-2"` (command preview)                               | `"hero-variant-1"` |
| **Landing Features** | `<Features variant="..." />`          | `1` (cards) \| `2` (grid) \| `3` (compact) \| `4` (tactile bento)                                             | `4`                |
| **Footer Deck**      | `<Footer variant="..." />`            | `"deck-box-1"` (minimal grid) \| `"deck-box-2"` (rich multi-deck) \| `"footer-variant-3"` (minimal tool line) | `"deck-box-2"`     |
