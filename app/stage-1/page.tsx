import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Stage1Audition } from "@/components/stages/Stage1Audition"

export const metadata: Metadata = {
  title: "Stage 1: Audition | Ease Studio",
  description:
    "Pure spatial block layout for Stage 1 (The Audition Stage): Zero-friction real UI component canvas, preset discovery, and motion laws.",
}

export default async function Stage1Page() {
  const cookieStore = await cookies()
  const isTimelineOpen = cookieStore.get("ease_timeline_open")?.value === "true"
  return <Stage1Audition initialTimelineOpen={isTimelineOpen} />
}
