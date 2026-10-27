import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"
import { readFile } from "fs/promises"
import path from "path"
import { PRODUCT } from "@/lib/config"
import { logger } from "@/lib/logger"

export const runtime = "nodejs"

async function loadFont() {
  const fontPath = path.join(
    process.cwd(),
    "public",
    "PlusJakartaSans-Bold.ttf"
  )
  return await readFile(fontPath)
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Dynamic Context
    const title = searchParams.get("title") || PRODUCT.name
    const label = searchParams.get("label") || "Docs"
    const fontData = await loadFont()

    const bgBuffer = await readFile(
      path.join(process.cwd(), "public", "og-bg-optimized.jpg")
    )
    const bgSrc = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`

    const logoBuffer = await readFile(
      path.join(process.cwd(), "public", "satisium.png")
    )
    const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`

    // PERFECTED THEME TOKENS
    const COLOR_BACKGROUND = "#090909"
    const COLOR_FOREGROUND = "#f8f8f8"
    const COLOR_PRIMARY = "#f2470c"

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: COLOR_BACKGROUND,
          padding: "40px",
          fontFamily: '"Plus Jakarta Sans"',
        }}
      >
        {/* INNER CARD (ROUNDED WITH BACKGROUND IMAGE) */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            borderRadius: "36px",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
          }}
        >
          {/* 1. THE OPTIMIZED FLAME BACKGROUND */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgSrc}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="Gradient Background"
          />

          {/* 2. THE TEXT CONTENT OVERLAY */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              padding: "64px",
            }}
          >
            {/* Top Left: The Anchor Brand Lockup */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                width={64}
                height={64}
                alt={`${PRODUCT.name} Logo`}
                style={{ borderRadius: "16px" }}
              />
              <span
                style={{
                  color: COLOR_FOREGROUND,
                  fontSize: 36,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {PRODUCT.name}
              </span>
            </div>

            {/* Bottom Left: Context & Value */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
              }}
            >
              <span
                style={{
                  color: COLOR_PRIMARY,
                  fontSize: 16,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  color: COLOR_FOREGROUND,
                  fontSize: 72,
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  wordWrap: "break-word",
                }}
              >
                {title}
              </span>
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Plus Jakarta Sans",
            data: fontData,
            style: "normal",
            weight: 700,
          },
        ],
      }
    )
  } catch (e) {
    logger.error("Failed to generate OG image", e)
    return new Response("Failed to generate image", { status: 500 })
  }
}
