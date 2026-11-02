import type { Metadata } from "next"
import { Stage2Customize } from "@/components/stages/Stage2Customize"

export const metadata: Metadata = {
  title: "Stage 2: Customize | Ease Studio",
  description:
    "Pure spatial block layout for Stage 2 (The Customize Stage): 60/40 center split graph and micro-preview, Git variant tree, and multi-framework code generator.",
}

export default function Stage2Page() {
  return <Stage2Customize />
}
