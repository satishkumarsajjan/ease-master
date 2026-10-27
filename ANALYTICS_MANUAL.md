# 🌌 Satisium Ecosystem Analytics & Observability Manual

> **Personal Operator's Playbook & Technical Architecture Specification**  
> **Author:** Satishkumar (`@iamsatish4564`) | **Holding Company / Parent Brand:** SATISIUM  
> **Core Philosophy:** _"Everything is Code. Context is Premium."_  
> **Target Scope:** Developer Ecosystem (`*.satisium.com`) + Acquirable Venture SaaS Portfolio (Independent Domains)  
> **The Strict Financial Rule:** **$0.00 / month forever across all services.**

---

## 1. Executive Summary & Core Invariants

Building a micro-tool studio and SaaS holding company requires tracking at two distinct altitudes:

1. **The Macro Holding Cockpit (The Umbrella View):** Total ecosystem reach, cross-product traffic flow, multi-tool retention, and top-of-funnel acquisition engines.
2. **The Micro Product Cockpit (The Tool Engine Room):** In-depth feature usage, preset selection, code export volume, and conversion funnels for a specific studio or SaaS product.

This manual documents the **Federated Super-Property Architecture** used across all Satisium products. Every product cloned from this starter template automatically connects to this unified telemetry fabric.

### The Non-Negotiable Invariants

1. **The Zero-Dollar Invariant ($0.00 Forever):** All chosen services operate on perpetual generous free tiers with configured hard billing limits ($0.00). No credit card overages under any circumstance.
2. **The First-Party Stealth Invariant (`/ingest`):** All telemetry must route through the Next.js reverse proxy (`api_host: "/ingest"`). This prevents browser ad-blockers (Brave, uBlock Origin) from discarding legitimate user telemetry and ensures cookies remain first-party.
3. **The Zero-Key Bootstrap Rule:** The application must build, boot, test, and run cleanly without any analytics keys in `.env.local`. Missing keys gracefully degrade to silent no-ops.
4. **The Milestone-Only Telemetry Rule:** Never track high-frequency continuous inputs (mouse drags, color slider scrubs, canvas panning). Only track milestones (export clicked, preset loaded, project created) to safeguard free event quotas.

---

## 2. The 4-Layer $0.00 Observability Stack

No single tool can observe an entire ecosystem. Satisium utilizes a specialized **4-layer stack**, where each layer is best-in-class and costs zero dollars:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE SATISIUM OBSERVABILITY STACK                     │
├───────────────────────┬────────────────────────────────────────────────┤
│ 1. PRODUCT & BEHAVIOR │ PostHog Cloud (Clicks, funnels, replays)      │
├───────────────────────┼────────────────────────────────────────────────┤
│ 2. SEO & ACQUISITION  │ Google Search Console + GA4 (Keywords & UTMs)  │
├───────────────────────┼────────────────────────────────────────────────┤
│ 3. ERROR & STABILITY  │ Sentry (Crash stack traces, failed renders)   │
├───────────────────────┼────────────────────────────────────────────────┤
│ 4. EDGE / NETWORK     │ Cloudflare Web Analytics (Raw DNS/bot traffic) │
├───────────────────────┼────────────────────────────────────────────────┤
│ 5. DEMAND DISCOVERY   │ ⌘K Zero-Results Telemetry (Feature signals)    │
└───────────────────────┴────────────────────────────────────────────────┘
```

### Layer 1: Product & Behavioral Telemetry — **PostHog Cloud**

- **Role:** Product funnels, feature adoption, session recordings, cross-subdomain identity stitching.
- **Free Quota:** **1,000,000 events / month** + **5,000 session recordings / month** forever.
- **Safety Setting:** Hard spending limit set to `$0.00 / month` in PostHog Project Settings.

### Layer 2: Organic Search & Acquisition — **Google Search Console (GSC) + GA4**

- **Role:** Keyword discovery (what queries people type on Google to find Type Studio or Color Studio), organic click-through rates (CTR), and macro web traffic streams.
- **Free Quota:** **100% Free Forever, Unlimited Volume.**
- **Setup:** One DNS-level domain property in Google Search Console for `satisium.com` (covers all Design subdomains automatically). Venture apps use dedicated properties.

### Layer 3: Error & Crash Observability — **Sentry**

- **Role:** Capturing unhandled JavaScript crashes, WebGL shader compilation failures, and React Error Boundaries before users report them.
- **Free Quota:** **5,000 errors / month** forever on the Developer Free Tier.
- **Integration:** Direct bridge to `logger.error(...)` and `ErrorBoundary` in `lib/logger.ts`.

### Layer 4: Edge & Infrastructure Ground Truth — **Cloudflare Web Analytics**

- **Role:** Zero-JS, privacy-friendly DNS/CDN traffic monitoring. Accurately tracks visitors who disable JavaScript or use hardened privacy browsers.
- **Free Quota:** **100% Free Forever, Unlimited Domains.**

### Layer 5: Demand Discovery — **⌘K Zero-Results Telemetry**

- **Role:** Listening to what users type in the global command palette that yields zero results (`search_zero_results`). This acts as an automated product roadmap generator.

---

## 3. The 4-Tier Ecosystem Taxonomy

Every product in SATISIUM belongs to a structured 4-tier semantic hierarchy:

```
                 HOLDING COMPANY / PARENT BRAND: SATISIUM
             Core Philosophy: "Everything is Code. Context is Premium."
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          ▼                                                         ▼
PART I: SATISIUM DESIGN                      PART II: SATISIUM LABS         PART III: HORIZON 3
(The UI Ecosystem)                           (The Venture Portfolio)        (The Legacy Moonshot)
Domain: *.satisium.com                       Domain: Independent Domains    Domain: Independent Luxury
          │                                                         │
          ├─ Core Infrastructure (ui, pro, cli)                     ├─ Real-Time Engagement (mosaic.app,
          ├─ Brain & Economy (board, compiler, compute,                kudosboard.io, quizmarket.com)
          │    market, jobs, talent)                                ├─ Collaboration (signal.co,
          ├─ Management (ship.satisium.com)                            sprintui.com)
          ├─ Visual Primitives (type, color, shape, space, state)   └─ Moonshot (spatialcinema.com)
          ├─ Polish Studios (ease, path, shadow, bg)
          ├─ Layout Studios (bento, form, chart, ai-builder)
          └─ Ship & Market Studios (meta, perf, launch, video, editor)
```

### Satisium Product Inventory Master Taxonomy Matrix

| Pillar   | Cluster             | Product Name              | Slug (`app_id`)    | Type          | Target Domain Strategy              |
| :------- | :------------------ | :------------------------ | :----------------- | :------------ | :---------------------------------- |
| `design` | `infrastructure`    | Satisium UI (Atoms)       | `satisium-ui`      | `library`     | `ui.satisium.com`                   |
| `design` | `infrastructure`    | Satisium UI Pro           | `satisium-ui-pro`  | `saas`        | `pro.satisium.com`                  |
| `design` | `infrastructure`    | Satisium CLI              | `satisium-cli`     | `cli`         | `cli.satisium.com`                  |
| `design` | `brain-economy`     | Mooderboard               | `mooderboard`      | `studio`      | `board.satisium.com`                |
| `design` | `brain-economy`     | The Context Compiler      | `context-compiler` | `studio`      | `compiler.satisium.com`             |
| `design` | `brain-economy`     | Satis Compute             | `satis-compute`    | `saas`        | `compute.satisium.com`              |
| `design` | `brain-economy`     | Satisium Marketplace      | `marketplace`      | `marketplace` | `market.satisium.com`               |
| `design` | `brain-economy`     | Satisium Jobs             | `jobs`             | `saas`        | `jobs.satisium.com`                 |
| `design` | `brain-economy`     | Talent Collective         | `talent`           | `saas`        | `talent.satisium.com`               |
| `design` | `management`        | ShipOS (Builder Pipeline) | `ship-os`          | `saas`        | `ship.satisium.com`                 |
| `design` | `visual-primitives` | Type Studio               | `type-studio`      | `studio`      | `type.satisium.com`                 |
| `design` | `visual-primitives` | Color Studio              | `color-studio`     | `studio`      | `color.satisium.com`                |
| `design` | `visual-primitives` | Shape Studio              | `shape-studio`     | `studio`      | `shape.satisium.com`                |
| `design` | `visual-primitives` | Space Studio              | `space-studio`     | `studio`      | `space.satisium.com`                |
| `design` | `visual-primitives` | State Studio              | `state-studio`     | `studio`      | `state.satisium.com`                |
| `design` | `polish`            | Ease Studio               | `ease-studio`      | `studio`      | `ease.satisium.com`                 |
| `design` | `polish`            | Path Studio               | `path-studio`      | `studio`      | `path.satisium.com`                 |
| `design` | `polish`            | Shadow Studio             | `shadow-studio`    | `studio`      | `shadow.satisium.com`               |
| `design` | `polish`            | BG Studio                 | `bg-studio`        | `studio`      | `bg.satisium.com`                   |
| `design` | `layout`            | Bento Studio              | `bento-studio`     | `studio`      | `bento.satisium.com`                |
| `design` | `layout`            | Form Studio               | `form-studio`      | `studio`      | `form.satisium.com`                 |
| `design` | `layout`            | Chart Studio              | `chart-studio`     | `studio`      | `chart.satisium.com`                |
| `design` | `layout`            | Satisium AI Builder       | `ai-builder`       | `saas`        | `builder.satisium.com`              |
| `design` | `ship`              | Meta Studio               | `meta-studio`      | `studio`      | `meta.satisium.com`                 |
| `design` | `ship`              | Perf Studio               | `perf-studio`      | `studio`      | `perf.satisium.com`                 |
| `design` | `ship`              | Launch Studio             | `launch-studio`    | `studio`      | `launch.satisium.com`               |
| `design` | `ship`              | Satisium Video UI         | `video-ui`         | `library`     | `video.satisium.com`                |
| `design` | `ship`              | Satisium Video Editor     | `video-editor`     | `studio`      | `editor.satisium.com`               |
| `labs`   | `engagement`        | Mosaic (Live Canvas)      | `mosaic`           | `saas`        | `mosaic.app` _(Independent)_        |
| `labs`   | `engagement`        | KudosBoard (Cards)        | `kudosboard`       | `saas`        | `kudosboard.io` _(Independent)_     |
| `labs`   | `engagement`        | Quiz Marketplace          | `quiz-market`      | `marketplace` | `quizmarket.com` _(Independent)_    |
| `labs`   | `collaboration`     | Signal / Taste            | `signal`           | `saas`        | `signal.co` _(Independent)_         |
| `labs`   | `collaboration`     | SprintUI (Review)         | `sprint-ui`        | `saas`        | `sprintui.com` _(Independent)_      |
| `labs`   | `moonshots`         | Spatial Cinema            | `spatial-cinema`   | `saas`        | `spatialcinema.com` _(Independent)_ |

---

## 4. Multi-Tool Grouping Across All Services

Because every event is injected with this 4-tier taxonomy, grouping and filtering work seamlessly across all platforms:

### 1. In PostHog

- **Cluster Dashboard:** Create a dashboard and apply a global filter: `WHERE cluster = 'visual-primitives'`. All charts now aggregate metrics for Type, Color, Shape, Space, and State studios combined.
- **Pillar Comparison:** Create a Trend insight, set event to `page_view`, and choose **Breakdown by:** `pillar`. See **Design** vs. **Labs** traffic side-by-side.
- **Studio Leaderboard:** Create a Bar chart, set event to `studio_export_downloaded`, and choose **Breakdown by:** `app_id`. Instantly see which studio produces the most value.

### 2. In Google Search Console

- **Domain Property Filtering:** Use Regex to create search performance views for specific clusters:
  - Primitives Studios: `^(type|color|shape|space|state)\.satisium\.com`
  - Polish Studios: `^(ease|path|shadow|bg)\.satisium\.com`
  - Labs SaaS: `^(mosaic|kudos|signal|sprint)\.satisium\.com`

### 3. In Google Analytics 4 (GA4)

- Configure `pillar`, `cluster`, and `app_id` as **Custom Event Dimensions**.
- Create Exploration Reports grouped by `cluster` to analyze acquisition channels per tool family.

### 4. In Sentry

- Set global tags in your Sentry initialization:
  ```ts
  Sentry.setTag("pillar", PRODUCT.pillar)
  Sentry.setTag("cluster", PRODUCT.cluster)
  Sentry.setTag("app_id", PRODUCT.slug)
  ```
- Filter issues in Sentry UI: `cluster:polish` to inspect WebGL or SVG animation errors across all polish studios.

---

## 5. The 3-Minute Cloning Recipe

Whenever you clone `starter-template` to create a new Studio or SaaS product, follow these three steps:

### Step 1: Configure `config/site.ts`

Open `config/site.ts` and update the `PRODUCT` object:

```ts
export const PRODUCT = {
  name: "Color Studio",
  shortName: "Color",
  slug: "color-studio",
  titleTemplate: "%s | Satisium Color Studio",
  defaultTitle: "Color Studio — Mathematical Palette & WCAG Contrast Engine",
  description:
    "Generate WCAG-compliant accessible OKLCH and HSL variable matrices.",
  applicationCategory: "DesignApplication",

  // Satisium Ecosystem Taxonomy
  pillar: "design", // "design" | "labs"
  cluster: "visual-primitives", // from taxonomy matrix
  type: "studio", // "studio" | "library" | "saas" | "marketplace" | "cli"
  ecosystem: "satisium",
} as const
```

### Step 2: Configure Master Keys in `.env.local`

Paste the master Satisium project tokens into `.env.local` (all products share the same master tokens):

```bash
# Shared PostHog Master Token
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN="phc_satisium_master_token_here"
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"

# Shared GA4 Master Measurement ID
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Optional Upstash Redis Telemetry
UPSTASH_REDIS_REST_URL="https://...upstash.io"
UPSTASH_REDIS_REST_TOKEN="..."
```

### Step 3: Verify Cross-Subdomain Identity

Ensure `cross_subdomain_cookie: true` is set in `components/analytics-provider.tsx`.  
When deployed to `*.satisium.com`, users will be recognized across all apps automatically.

---

## 6. Event Taxonomy & Quota Protection Rules

To prevent 25+ studios from exhausting the 1,000,000 monthly event quota, follow the **Milestone-Only Rule**.

### ❌ What You Must NEVER Track (Quota Burners)

- Do **NOT** track continuous input drags (e.g., `color_slider_moved`, `bezier_point_dragged`).
- Do **NOT** track canvas panning or zooming (`canvas_panned`).
- Do **NOT** track individual keystrokes in code editors.
- Do **NOT** track continuous scroll positions.

### ✅ What You MUST Track (Milestones & Deliveries)

#### 1. Common System Events

| Event Name              | Fired By              | Properties                  | Description               |
| :---------------------- | :-------------------- | :-------------------------- | :------------------------ |
| `page_view`             | `PostHogPageView`     | `path`, `route`             | Page navigation           |
| `cta_clicked`           | Landing Hero / Header | `label`, `href`, `location` | Main conversion actions   |
| `search_result_clicked` | ⌘K Palette            | `targetId`, `url`, `query`  | Command palette selection |
| `search_zero_results`   | ⌘K Palette            | `query`                     | Unmet demand detection    |

#### 2. Satisium Design Events (Studios & Tools)

| Event Name                 | Fired By                 | Properties                                    | Description                   |
| :------------------------- | :----------------------- | :-------------------------------------------- | :---------------------------- |
| `studio_preset_loaded`     | Studio presets bar       | `preset_name`, `category`                     | User loads an existing preset |
| `studio_code_copied`       | Code Block / Copy button | `format` (`css`, `tailwind`, `svg`)           | Code copied to clipboard      |
| `studio_export_downloaded` | Export dialog            | `format` (`svg`, `json`, `png`), `size_kb`    | File downloaded to disk       |
| `studio_context_compiled`  | Context Compiler / Hub   | `token_count`, `target` (`cursorrules`, `ai`) | Design context generated      |

#### 3. Satisium Labs Events (SaaS Products)

| Event Name             | Fired By                | Properties                | Description                |
| :--------------------- | :---------------------- | :------------------------ | :------------------------- |
| `saas_project_created` | Project creation wizard | `template`, `visibility`  | New board/canvas initiated |
| `saas_qr_scanned`      | Mosaic live display     | `canvas_id`, `guest_id`   | Mobile attendee joins      |
| `saas_card_submitted`  | KudosBoard canvas       | `card_type`, `media_type` | User leaves a greeting     |
| `saas_invite_sent`     | Team / Event settings   | `role`, `method`          | Collaboration invitation   |

#### 4. Ecosystem Cross-Pollination Events

| Event Name     | Fired By            | Properties                             | Description                         |
| :------------- | :------------------ | :------------------------------------- | :---------------------------------- |
| `umbrella_hop` | Header / Footer nav | `source_app`, `target_app`, `location` | User jumps from one tool to another |

---

## 7. The Flywheel & Identity Merging

How an anonymous visitor becomes a recognized customer across the entire umbrella:

```
[Anonymous Visitor on color.satisium.com]
  │  • PostHog assigns distinct_id: "anon_abc123"
  │  • Fires: studio_code_copied
  │
  ▼
[Navigates to pro.satisium.com via header]
  │  • Cookie persists on .satisium.com
  │  • Still recognized as "anon_abc123"
  │
  ▼
[Signs in or purchases Satisium UI Pro with email]
  │  • Calls: posthog.identify(user.id, { email: "alex@example.com" })
  │
  ▼
[PostHog Identity Engine Merges History]
  • All past anonymous events are retroactively attached to Alex's profile.
  • You now know Alex discovered Satisium via Color Studio 14 days before buying Pro!
```

---

## 8. Revenue & Stripe Telemetry

For paid products (Satisium UI Pro, Satisium Marketplace, Mosaic, KudosBoard), track money server-side via Stripe Webhooks:

```ts
// app/api/stripe/webhook/route.ts
import { trackServerEvent } from "@/lib/analytics-server"

export async function POST(req: Request) {
  const event = await stripe.webhooks.constructEvent(...)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    await trackServerEvent(session.client_reference_id || session.customer_email, "payment_succeeded", {
      amount_usd: session.amount_total / 100,
      product_id: session.metadata.product_slug, // e.g. "satisium-ui-pro"
      pillar: session.metadata.pillar,           // e.g. "design"
      cluster: session.metadata.cluster,         // e.g. "infrastructure"
      plan_type: session.metadata.plan_type,     // e.g. "lifetime" | "subscription"
    })
  }
}
```

---

## 9. Satisium CLI Telemetry Protocol (`npx satisium add`)

The CLI tracks component installations back to the same master PostHog project without a browser.

### The CLI HTTP Payload

When a developer runs `npx satisium add button`, the CLI makes a silent, non-blocking HTTP POST:

```ts
await fetch("https://us.i.posthog.com/capture/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: process.env.POSTHOG_TOKEN,
    event: "cli_component_added",
    properties: {
      distinct_id: machineId,
      component: "button",
      app_id: "satisium-cli",
      pillar: "design",
      cluster: "infrastructure",
      os: process.platform,
      node_version: process.version,
    },
  }),
})
```

This allows your PostHog dashboard to compare **Web Component Copies vs. CLI Installs** on the exact same chart.

---

## 10. Satisium Labs: Spin-Off & Acquisition Protocol

Because Satisium Labs products are standalone and acquirable, follow this procedure when spinning off or selling a product (e.g. Mosaic or SprintUI):

### Step 1: Historical Data Export

1. In PostHog, open **HogQL / SQL Explorer**.
2. Run an export query:
   ```sql
   SELECT * FROM events WHERE properties.app_id = 'mosaic'
   ```
3. Export as CSV / JSON for the acquirer or audit room.

### Step 2: Token Isolation (60-Second Cutover)

1. In PostHog, create a dedicated new project: `Mosaic Standalone`.
2. In Mosaic's deployment environment (Vercel / Coolify), update the environment variable:
   ```bash
   # Replace master token with dedicated Mosaic token:
   NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN="phc_mosaic_standalone_token"
   ```
3. Redeploy. All future telemetry immediately routes to the buyer's project with zero code refactoring.

---

## 11. Localhost Isolation & Data Hygiene

To keep your analytics pristine, development activity on `localhost:3000` must never pollute production charts:

1. **Auto-Tagging:** All events fired in development automatically carry `environment: "development"`.
2. **Production Filters:** All master dashboards in PostHog should include the global filter: `WHERE environment != 'development'`.
3. **Optional Opt-Out:** In `components/analytics-provider.tsx`, development tracking can be silenced completely by setting `NEXT_PUBLIC_DISABLE_DEV_ANALYTICS=true` in `.env.local`.

---

## 12. Verification & Health Check

To verify analytics are working correctly before launching any new tool:

| Test Case                | How to Test                                           | Expected Result                                                                                    |
| :----------------------- | :---------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **Zero-Key Boot**        | Empty `.env.local` → `pnpm build && pnpm dev`         | App boots cleanly; zero errors; zero outgoing analytics network requests.                          |
| **Reverse Proxy Check**  | Add PostHog token → Open browser DevTools Network tab | Outgoing requests route to `http://localhost:3000/ingest/...` (status 200), not direct to PostHog. |
| **Super-Property Check** | Inspect request payload in PostHog Live Events tab    | Event contains `ecosystem: "satisium"`, correct `pillar`, `cluster`, and `app_id`.                 |
| **Consent Banner Check** | Reject cookie consent banner                          | All tracking ceases immediately (`opt_out_capturing()` active).                                    |
