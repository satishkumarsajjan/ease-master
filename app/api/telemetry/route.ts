import { NextResponse } from "next/server"
import { getRedis } from "@/lib/redis"
import { checkRateLimit } from "@/lib/rate-limit"

const ALLOWED_ACTIONS = new Set(["web_copy", "page_view"])

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  if (!(await checkRateLimit(`telemetry:${ip}`))) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded" },
      { status: 429 }
    )
  }

  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { action, component } = body as {
      action?: string
      component?: string
    }

    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      )
    }

    const safeComponent =
      typeof component === "string" && component.length <= 100
        ? component
        : "unknown"

    try {
      const redis = getRedis()
      await redis.incr(`satisium:metrics:${action}`)
      if (safeComponent !== "unknown") {
        await redis.zincrby("satisium:metrics:top_actions", 1, safeComponent)
        await redis.zremrangebyrank("satisium:metrics:top_actions", 0, -501)
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Storage unavailable" },
        { status: 503 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
