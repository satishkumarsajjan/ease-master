import type { Metadata } from "next"
import { Stage1Audition } from "@/components/stages/Stage1Audition"

export const metadata: Metadata = {
  title: "Stage 1: Audition | Ease Studio",
  description:
    "Pure spatial block layout for Stage 1 (The Audition Stage): Zero-friction real UI component canvas, preset discovery, and motion laws.",
}

export default function Stage1Page() {
  return <Stage1Audition />
}
