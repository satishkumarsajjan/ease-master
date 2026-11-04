<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Satisium build contract (appended below the Next.js block)

You are working inside a **Satisium product** created from the Satisium Starter.

## 🔒 Satisium Immutable Truths (NEVER Hallucinate or Assume)

- **Holding Company / Parent Brand:** `SATISIUM` | Parent Umbrella: The Satisium Umbrella (`satisium`).
- **Core Philosophy:** "Everything is Code. Context is Premium."
- **Author:** Satishkumar (`@iamsatish4564`).
- **Domain & Branding Architecture Isolation (Strictly Enforced):**
  - **Part I: Satisium Design (The UI Ecosystem):** ALL tools, studios, and libraries live strictly on subdomains of the master brand: **`*.satisium.com`** (e.g., `type.satisium.com`, `ui.satisium.com`, `board.satisium.com`, `ship.satisium.com`). Never use `.dev`, `.io`, or `.app` for Satisium-branded developer tools.
  - **Parts II & III: Satisium Labs (Venture Portfolio & Moonshots):** ALL consumer and B2B SaaS apps have completely independent, isolated domain names (e.g., `mosaic.app`, `kudosboard.io`, `signal.co`, `sprintui.com`, `spatialcinema.com`). They will **never** carry the `.satisium.com` URL to protect developer brand purity and ensure standalone acquirability.
- **Config Truth:** All product identity, taxonomy, and metadata must be read from and written to `config/site.ts`.

## Read first (in this order)

1. `FEATURE_WORKFLOW.md` — feature branching, zero-autonomous-git protocol, and Founder QA gating.
2. `PRODUCT_SPEC.template.md` — the product intake blueprint (metadata, taxonomy, sitelinks, FAQs).
3. `SEO_AEO_STRATEGY.md` — 3-engine discovery strategy (SEO, AEO, GEO), SERP sitelinks, and schema graph.
4. `ANALYTICS_MANUAL.md` — 4-tier telemetry architecture, $0 stack, and event taxonomy.
5. `starter-template.md` — build order, the shell, tooling.
6. `component-kit.md` — the template component library (components, hooks, lib).
7. `content/docs/**` — user-facing behaviour; the source of truth.

## Product Generation Protocol (Building a Satisium Tool)

When instructing or acting as an AI agent to build a specific app, studio, or SaaS platform from this template (e.g. Type Studio, ShipOS, Mosaic):

### Phase 1: Intake Specification & Configuration

1. **Mandatory Intake Interview Rule (Zero Assumption):**
   - The agent must **NEVER assume or hallucinate** product names, domains, taglines, or descriptions from blueprint tables or markdown files. All existing values in the documentation are directional fillers and temporary placeholders.
   - If `PRODUCT_SPEC.md` does not already exist with approved values, the agent must **explicitly interview the Founder (Satishkumar)** before modifying any code by asking the **5 Foundational Questions**:
     1. **Tool Identity & Slug:** Exact product name, short name, and slug (strictly `<slug>.satisium.com` for Design tools; custom isolated domain for Labs).
     2. **Value Proposition:** Concise defaultTitle (≤ 60 chars) and meta description (120–155 chars).
     3. **North-Star Milestone:** Primary value telemetry event name and payload properties.
     4. **Top 4 Sitelinks Navigation:** Primary navigational destinations for SERP schema (`/app`, `/docs/...`).
     5. **Variant Selections:** Initial docs shell (`spatial` vs `three-pane`), hero (`hero-variant-1` vs `2`), and footer (`deck-box-1` vs `2`).
2. Copy `PRODUCT_SPEC.template.md` to `PRODUCT_SPEC.md` and populate it with the confirmed answers.
3. Update `config/site.ts`:
   - Set `PRODUCT.name`, `PRODUCT.shortName`, `PRODUCT.slug`.
   - Set `PRODUCT.pillar` (`design` or `labs`), `PRODUCT.cluster`, and `PRODUCT.type`.
   - Set `PRODUCT.defaultTitle` (≤ 60 chars) and `PRODUCT.description` (120–155 chars).
   - Set `PRODUCT.sitelinks` (top 4 navigational routes).
   - Set `PRODUCT.faqs` (top 2–3 extractive question/answer pairs).
   - Set `SITE_URL`:
     - If Part I (Design): `https://<slug>.satisium.com` (Never `.dev`, `.io`, or `.app`).
     - If Part II/III (Venture SaaS / Moonshot): the product's independent domain (e.g. `https://mosaic.app`, `https://kudosboard.io`).

### Phase 2: Discovery & SEO Calibration

1. Follow [`SEO_AEO_STRATEGY.md`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/SEO_AEO_STRATEGY.md):
   - Verify `app/layout.tsx` dynamically evaluates and renders the JSON-LD schemas (`WebSite`, `Organization`, `WebApplication`, `SiteNavigationElement`, `FAQPage`) using `PRODUCT` and `SITE_URL`. Zero hardcoding in code.
   - Frame landing page section headers as direct user questions and apply the **45-Word Extractive Answer Rule** for Perplexity, Google AI Overviews, and Apple Intelligence citations.
   - Run `pnpm llm` to generate machine-readable markdown surfaces at `/llms.txt` and `/llms-full.txt`.

### Phase 3: Observability & Telemetry Calibration

1. Follow [`ANALYTICS_MANUAL.md`](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/starter-template/ANALYTICS_MANUAL.md):
   - Verify `components/analytics-provider.tsx` automatically injects `ecosystem`, `pillar`, `cluster`, `product_type`, `app_id`, and `app_name` into PostHog super-properties.
   - Define and fire product-specific milestone events (e.g., `studio_export_downloaded`, `saas_canvas_created`) using `trackEvent()` from `@/lib/analytics`.
   - Honor the **Zero-Key Rule**: The app must boot, build, and pass all tests with an empty `.env.local`.

### Phase 4: UI & Workstation Implementation

1. Construct the tool workstation at `/app` and documentation at `/docs` using primitives from `components/ui/*`.
2. Strictly follow the Non-negotiables: tokens only, zero opacity modifiers, routes via `lib/routes.ts`, navigation via `lib/nav.ts`.
3. **Preserve the Full Kit:** Do NOT delete unused section variants or documentation shells. The starter template is a living parts catalog.

### Phase 5: Verification & Quality Gate

1. Run `pnpm doctor` (all 15 checks must pass with 0 warnings, 0 problems).
2. Run `pnpm verify` (lint + typecheck + test + build).

### Phase 6: Pre-Deployment Pruning (Final Shipping Phase Only)

1. Dead-code elimination and pruning of unreferenced variant files occurs **strictly and exclusively** during final pre-deployment preparation.
2. Run `pnpm knip` to detect unused exports and files after the product is fully built and ready to deploy.
3. Re-run `pnpm doctor` and `pnpm verify` to confirm a clean, lean shipping bundle.

## Non-negotiables

- **Zero autonomous git actions:** strictly follow `FEATURE_WORKFLOW.md`. Never run `git commit`, `git push`, or `gh pr create` without an explicit instruction from the Founder. Always pause in the working tree for interactive browser QA.
- **Tokens only.** No hex/rgb/`text-gray-500`. Radius, type and motion rules: `component-kit.md` §2.3.
- **Zero opacity modifiers.** Never use Tailwind opacity modifiers on colors (e.g. `bg-secondary/70`, `text-muted-foreground/80`, `bg-foreground/20`). Always use discrete semantic variables and surface tokens directly (`bg-secondary`, `bg-muted`, `text-muted-foreground`, `bg-card`). Opacity hacking causes unpredictable substrate bleed, luminosity shifts, and color mismatches.
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
- **Kit preservation:** never delete template files, alternate section variants (`hero-variant-*`, `deck-box-*`, `features-variant-*`), docs layouts (`spatial`/`three-pane`), or UI primitives during spin-up or feature development. Keep all catalog options intact. Pruning unused files (`pnpm knip`) is strictly reserved for the pre-deployment phase.
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
