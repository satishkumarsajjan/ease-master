"use client"

import { motion } from "motion/react"
import Image from "next/image"
import React, { useRef, useState } from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ComputerTerminal01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { CodeBlock } from "../code-block/code-block"
import { CodeFile } from "../code-block/types"
import { CommandBlock } from "../command-block"
import { PreviewToolBox } from "./preview-toolbox"
import { ResizablePlayground, ViewportMode } from "./resizable-playground"
import { logger } from "@/lib/logger"
import { PreviewBackground } from "./preview-background" // ✨ IMPORTED
import { useMediaQuery } from "@/hooks/use-media-query"
import { useMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"

export interface DemoData {
  key: string
  name: string
  type?: "react" | "video" | "image"
  renderMode?: "direct" | "iframe"
  embedUrl?: string
  component?: React.ReactNode
  files?: Record<string, CodeFile | string>
  installCommand?: string
  previewUrl?: string
  mediaUrl?: string
}

interface PreviewerProps {
  title: string
  demos: DemoData[]
  githubUrl?: string
  previewUrl?: string
  sourceCodeId?: string
}

function usePersistentState<T>(key: string, initialValue: T) {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) callback()
      }
      window.addEventListener("storage", onStorage)
      return () => window.removeEventListener("storage", onStorage)
    },
    [key]
  )

  const getSnapshot = React.useCallback(() => {
    if (typeof window === "undefined") return JSON.stringify(initialValue)
    try {
      return window.localStorage.getItem(key) ?? JSON.stringify(initialValue)
    } catch {
      return JSON.stringify(initialValue)
    }
  }, [key, initialValue])

  const raw = React.useSyncExternalStore(subscribe, getSnapshot, () =>
    JSON.stringify(initialValue)
  )

  const state = React.useMemo(() => {
    try {
      return JSON.parse(raw) as T
    } catch {
      return initialValue
    }
  }, [raw, initialValue])

  const setValue = React.useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const currentRaw = getSnapshot()
        let currentParsed: T
        try {
          currentParsed = JSON.parse(currentRaw) as T
        } catch {
          currentParsed = initialValue
        }
        const nextValue =
          value instanceof Function ? value(currentParsed) : value
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(nextValue))
          window.dispatchEvent(new StorageEvent("storage", { key }))
        }
      } catch (e) {
        logger.error("Failed to write to localStorage", e)
      }
    },
    [key, getSnapshot, initialValue]
  )

  return [state, setValue] as const
}

export function ComponentPreviewer({
  title,
  demos,
  githubUrl,
  previewUrl,
  sourceCodeId,
}: PreviewerProps) {
  const mounted = useMounted()
  const containerRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const componentKey =
    title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "default"

  const [activeDemoIndex, setActiveDemoIndex] = usePersistentState<number>(
    `satisium-active-demo-${componentKey}`,
    0
  )

  const [isCodeOpen, setIsCodeOpen] = usePersistentState<boolean>(
    "satisium-code-open",
    false
  )
  const [previewWidth, setPreviewWidth] = usePersistentState<number | string>(
    "satisium-preview-width",
    "100%"
  )
  const [viewportMode, setViewportMode] = usePersistentState<ViewportMode>(
    "satisium-viewport-mode",
    "desktop"
  )
  const [reloadKey, setReloadKey] = useState<number>(0)

  const safeActiveDemoIndex =
    activeDemoIndex >= 0 && activeDemoIndex < demos.length ? activeDemoIndex : 0

  const activeDemo = demos[safeActiveDemoIndex] || demos[0]

  const handleViewportChange = (mode: ViewportMode) => {
    setViewportMode(mode)
    if (mode === "desktop") setPreviewWidth("100%")
    if (mode === "tablet") setPreviewWidth(768)
    if (mode === "mobile") setPreviewWidth(375)
  }

  const handleReload = () => {
    if (activeDemo.renderMode === "iframe") {
      const iframe = (document.getElementById(
        `satis-iframe-${activeDemo.key}`
      ) ||
        document.getElementById(
          `satisium-iframe-${activeDemo.key}`
        )) as HTMLIFrameElement | null

      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: "SATISIUM_RELOAD_ANIMATION" },
          "*"
        )
      }
    } else {
      setReloadKey((prev) => prev + 1)
    }
  }

  const handleScrollToSource = () => {
    if (sourceCodeId) {
      const cleanId = sourceCodeId.replace(/^#/, "")
      const el = document.getElementById(cleanId)

      if (el) {
        window.history.pushState(null, "", `#${cleanId}`)
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  if (!mounted) return <div className="h-full w-full animate-pulse bg-muted" />
  if (!activeDemo) return null

  const activeType = activeDemo.type || "react"

  return (
    <TooltipProvider delayDuration={150}>
      <div
        ref={containerRef}
        className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-background p-2 text-foreground [--preview-panel-w:clamp(300px,38%,600px)]"
      >
        <div className="relative flex h-full w-full overflow-hidden rounded-3xl">
          <div className="pointer-events-auto absolute top-0 right-0 flex h-full w-full flex-col rounded-2xl rounded-l-3xl lg:w-(--preview-panel-w)">
            <div
              key={activeDemo.key}
              className={cn(
                "flex h-full flex-col gap-3 overflow-hidden pt-1.5 pb-0",
                isDesktop ? "pr-0 pl-3" : "px-0"
              )}
            >
              <div className="mb-1 flex flex-col gap-1.5 px-1">
                <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-foreground">
                  <HugeiconsIcon
                    icon={ComputerTerminal01Icon}
                    className="size-4 text-muted-foreground"
                  />
                  <span>Installation</span>
                </h2>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Run the command below to add the{" "}
                  <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
                    {activeDemo.name}
                  </span>{" "}
                  demo to your project.
                </p>
              </div>
              <CommandBlock command={activeDemo.installCommand || ""} />
              <CodeBlock
                files={activeDemo.files || {}}
                className="min-h-0 flex-1"
              />
            </div>
          </div>

          <motion.div
            className="absolute top-0 left-0 z-10 flex h-full overflow-hidden rounded-3xl bg-muted p-2"
            initial={false}
            animate={{
              // Derived from the same token as the panel above. These were two
              // independent `600px` literals that had to agree; inside an ~800px
              // pane the stage collapsed to 200px and could not be dragged
              // anywhere, because the drag floor was 320px.
              width:
                isCodeOpen && isDesktop
                  ? "calc(100% - var(--preview-panel-w))"
                  : "100%",
              x: isCodeOpen && !isDesktop ? "-100%" : "0%",
              opacity: isCodeOpen && !isDesktop ? 0 : 1,
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          >
            {/* ✨ NEW COMPONENT HERE ✨ */}
            <PreviewBackground />

            {activeType === "video" && activeDemo.mediaUrl ? (
              <div className="relative flex h-full w-full items-center justify-center">
                <video
                  src={activeDemo.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full rounded-2xl bg-background object-cover"
                />
              </div>
            ) : activeType === "image" && activeDemo.mediaUrl ? (
              <div className="relative flex h-full w-full items-center justify-center">
                <Image
                  src={activeDemo.mediaUrl}
                  alt={activeDemo.name}
                  fill
                  unoptimized
                  className="rounded-2xl bg-background object-cover"
                />
              </div>
            ) : (
              <ResizablePlayground
                demos={demos}
                activeDemoIndex={safeActiveDemoIndex}
                previewWidth={previewWidth}
                setPreviewWidth={setPreviewWidth}
                setViewportMode={setViewportMode}
                reloadKey={reloadKey}
              />
            )}
          </motion.div>

          <PreviewToolBox
            demos={demos}
            activeDemoIndex={safeActiveDemoIndex}
            setActiveDemoIndex={setActiveDemoIndex}
            isCodeOpen={isCodeOpen}
            setIsCodeOpen={setIsCodeOpen}
            viewportMode={viewportMode}
            onViewportChange={handleViewportChange}
            onReload={handleReload}
            onScrollToSource={handleScrollToSource}
            githubUrl={githubUrl}
            previewUrl={activeDemo.previewUrl || previewUrl}
            hasSourceCodeId={!!sourceCodeId}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}
