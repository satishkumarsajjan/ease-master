"use client"

import * as React from "react"
import { ComponentPreviewer } from "@/components/previewer/component-preview"
import type { DemoData } from "@/lib/docs-page"

interface DocDemoRendererProps {
  title: string
  demos: DemoData[]
  githubUrl?: string
  previewUrl?: string
}

export function DocDemoRenderer({
  title,
  demos,
  githubUrl,
  previewUrl,
}: DocDemoRendererProps) {
  if (!demos || demos.length === 0) return null

  return (
    <section className="h-[calc(100dvh-var(--docs-pane-gap)*2)] w-full sm:h-[calc(100dvh-var(--docs-pane-gap)*4)]">
      <div className="h-full w-full">
        <ComponentPreviewer
          title={title}
          demos={demos}
          githubUrl={githubUrl}
          previewUrl={previewUrl}
          sourceCodeId="installation"
        />
      </div>
    </section>
  )
}
