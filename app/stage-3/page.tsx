import type { Metadata } from "next"
import { Stage3Compare } from "@/components/stages/Stage3Compare"

export const metadata: Metadata = {
  title: "Stage 3: Compare | Ease Studio",
  description:
    "Pure spatial block layout for Stage 3 (The Compare Stage): Multi-tile benchmark duel, synchronized spacebar trigger, and collapsed 48px side rails.",
}

export default function Stage3Page() {
  return <Stage3Compare />
}
