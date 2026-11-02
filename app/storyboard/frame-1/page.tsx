import { Metadata } from "next"
import { Frame1Landing } from "@/components/storyboard/Frame1Landing"

export const metadata: Metadata = {
  title: "Storyboard • Frame 01: Landing | Ease Studio",
  description:
    "Interactive testbed for Frame 01 of the Ease UI Storyboard: The Zero-Friction Landing.",
}

export default function Frame1Page() {
  return <Frame1Landing />
}
