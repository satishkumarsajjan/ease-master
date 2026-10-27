import { NextResponse } from "next/server"

import { features } from "@/lib/env"

export const dynamic = "force-dynamic"

/** Liveness + which optional integrations are live. Never exposes secret values. */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
    features,
  })
}
