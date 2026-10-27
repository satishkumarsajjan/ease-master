/**
 * lib/csp.mjs — single source of truth for the Content-Security-Policy header.
 *
 * Adding an integration? Add its origins here (and note it in §22),
 * never by patching a raw string inside next.config.mjs.
 */
export function buildCsp({ extraConnect = [], extraScript = [], extraFrame = [] } = {}) {
  const analytics = Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN)
  const errorTracking = Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN)

  const connect = [
    "'self'",
    "https://api.github.com",
    "https://cdn.jsdelivr.net",
    ...(analytics ? ["https://us.i.posthog.com", "https://us-assets.i.posthog.com"] : []),
    ...(errorTracking ? ["https://*.ingest.sentry.io", "https://*.ingest.us.sentry.io"] : []),
    ...extraConnect,
  ]

  return [
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
}
