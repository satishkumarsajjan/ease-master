import React from "react"
import { CodeFile } from "@/components/code-block/types"
import dynamic from "next/dynamic"

export interface RegistryItem {
  name: string
  type?: "react" | "video" | "image"
  /** "direct" (default) renders in the DOM; "iframe" renders via /embed for responsive layouts */
  renderMode?: "direct" | "iframe"
  component?: React.ComponentType
  installCommand?: string
  getFiles?: () => Promise<Record<string, CodeFile | string>>
  previewUrl?: string
  mediaUrl?: string
}

export const registry: Record<string, RegistryItem> = {
  "pulse-card": {
    name: "Pulse Card",
    type: "react",
    renderMode: "direct",
    previewUrl: "/preview/pulse-card",
    component: dynamic(() =>
      import("@/registry/demos/components/pulse-card/pulse-card-demo").then(
        (m) => m.default
      )
    ),
    installCommand:
      "npx shadcn@latest add https://your-domain.com/r/pulse-card.json",
    getFiles: async () => {
      const mod = await import("@/registry/strings/pulse-card")
      return {
        "registry/ui/pulse-card.tsx": {
          code: mod.pulseCardFile,
          language: "tsx",
        },
        "registry/demos/components/pulse-card/pulse-card-demo.tsx": {
          code: mod.pulseCardDemoFile,
          language: "tsx",
        },
      }
    },
  },
}
