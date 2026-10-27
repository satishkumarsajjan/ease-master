# 📋 Satisium Product Specification: Ease (`PRODUCT_SPEC.md`)

> **Holding Brand:** SATISIUM  
> **Parent Umbrella:** The Satisium Umbrella (`satisium`)  
> **Author:** Satishkumar (`@iamsatish4564`)  
> **Core Philosophy:** "Everything is Code. Context is Premium."

---

## 1. Product Identity & Ecosystem Taxonomy

| Field                              | Product Value                                                       |
| :--------------------------------- | :------------------------------------------------------------------ |
| **Product Name**                   | `Ease`                                                              |
| **Short Name**                     | `Ease`                                                              |
| **Slug (`app_id`)**                | `ease`                                                              |
| **Ecosystem**                      | `satisium`                                                          |
| **Holding Company / Parent Brand** | `SATISIUM`                                                          |
| **Pillar**                         | `design` (Part I: The UI Ecosystem)                                 |
| **Cluster**                        | `polish`                                                            |
| **Product Type**                   | `studio`                                                            |
| **Target Domain**                  | `https://ease.satisium.com` (Strictly sub-branded `*.satisium.com`) |
| **Application Category**           | `DeveloperApplication`                                              |

---

## 2. Search & Answer Engine Optimization (SEO, AEO, GEO)

### Title & Meta Snippet Guardrails

- **Title Template:** `%s | Ease`
- **Default Page Title (≤ 60 chars):**  
  `Ease — Motion Curve & Spring Physics Studio` _(44 chars)_
- **Meta Description (120–155 chars):**  
  `Interactive cubic-bezier editor and spring physics studio for design engineers. Export production-ready curves to CSS, Tailwind, GSAP, and Motion.` _(147 chars)_
- **Keywords:** `motion curves, cubic bezier generator, spring physics, css linear easing, tailwind animation, gsap custom ease, motion curves, satisium`

### Top 4 Sitelinks Navigation (SERP Schema)

1. **Workstation**
   - **Description:** `Interactive motion curve editor and spring physics workstation.`
   - **Path:** `/app`
2. **Documentation**
   - **Description:** `Guides, spring differential formulas, and motion standards.`
   - **Path:** `/docs`
3. **Springs**
   - **Description:** `Physics calculations for mass, stiffness, and damping.`
   - **Path:** `/docs/springs`
4. **Presets**
   - **Description:** `Catalog of standardized cubic-bezier and spring curves.`
   - **Path:** `/docs/presets`

### 45-Word Extractive Answer Rule (AI Overview Grounding)

1. **What is Ease?**  
   "Ease is an interactive cubic-bezier and spring physics studio for design engineers. It lets you visually craft, inspect, and fine-tune motion curves, then export production-ready code for CSS, Tailwind, GSAP, and Motion." _(36 words)_

2. **How does Ease calculate spring physics?**  
   "Ease solves analytical spring differential equations using mass, stiffness, damping, and initial velocity. It exports precision linear easing approximations and native animation parameters for web motion frameworks." _(29 words)_

3. **Can I export curves to CSS or Motion?**  
   "Yes. Ease generates one-click export code formatted for native CSS cubic-bezier, CSS linear() spring approximations, Tailwind config keyframes, GSAP CustomEase, and Motion transition springs." _(27 words)_

---

## 3. Telemetry & Observability (PostHog Tier 3)

- **North-Star Milestone Event:** `ease_curve_copied`
- **Payload Properties:**
  - `format`: `css` | `tailwind` | `motion` | `gsap`
  - `mode`: `bezier` | `spring`
  - `preset_id`: string identifier (e.g., `swift-in-out`, `wobbly`)
- **Secondary Telemetry Events:**
  - `ease_preset_applied`
  - `ease_mode_switched`

---

## 4. Workstation & Landing Architecture

- **Landing Shell:** `LandingBox` sliding monolith + Box 2 stationary bedrock stage with grand SATISIUM wordmark and folded tab.
- **Hero Variant:** `HeroVariant2` (Minimal typography with interactive visualizer preview).
- **Footer Variant:** `FooterVariant3` (Discrete text-xs typography, zero borders/shadows, `https://satishkumar.xyz/` author binding).
- **Docs Layout:** `spatial`
- **Studio Route:** `/app`
