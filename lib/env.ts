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
