# Analytics & Telemetry

> How to track custom product events, enforce cookie consent, and configure analytics providers.

Satisium Starter features a unified telemetry architecture that routes events to PostHog, Google Analytics, and an optional Upstash Redis counter in a single call.

## The Unified `trackEvent` Facade

Import `trackEvent` from `lib/analytics.ts`:

```tsx
export function ExportButton() {
  const handleExport = () => {
    trackEvent("export_artifact", {
      format: "svg",
      elementsCount: 42,
    })
  }

  return <button onClick={handleExport}>Export SVG</button>
}
```

### What Happens Behind the Scenes:

1. **Cookie Consent Check:** If the visitor has not accepted cookies, the event is silently ignored or logged in dev mode.
2. **PostHog:** Automatically dispatches via `posthog.capture(eventName, properties)`.
3. **Google Analytics:** Automatically dispatches via `window.gtag("event", eventName, properties)`.
4. **Public Counter (Optional):** If the third argument is passed (e.g. `trackEvent(..., ..., "page_view")`), it calls `/api/telemetry` to increment a rate-limited Redis metric.

---

## Activating Analytics Providers

The starter operates under the **zero-key rule**: if no keys are provided, analytics silently degrade to no-ops without throwing errors.

To activate analytics in production, add keys to `.env.local`:

```bash
# PostHog Product Analytics
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN="phc_your_token_here"
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"

# Google Analytics (GA4)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Upstash Redis Telemetry Counter (Optional)
UPSTASH_REDIS_REST_URL="https://...upstash.io"
UPSTASH_REDIS_REST_TOKEN="..."
```

---

## Core Web Vitals (CWV)

The template automatically streams Core Web Vitals (`LCP`, `INP`, `CLS`, `FID`, `TTFB`) from `next/web-vitals` to your PostHog analytics dashboard whenever consent is granted.
