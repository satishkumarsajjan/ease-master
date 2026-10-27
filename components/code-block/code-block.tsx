"use client"

import { AnimatePresence, motion } from "motion/react"
import { useTheme } from "next-themes"
import React, { useEffect, useId, useMemo, useRef, useState } from "react"
import { createHighlighter, Highlighter } from "shiki"

import { cn } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"
import { useTrackEvent } from "@/hooks/use-track-event"
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  CheckmarkBadge03Icon,
  Copy01Icon,
  PanelLeftIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { CodeDisplay } from "./code-display"
import { scrollbarClasses } from "./constants"
import { getIconForFile, SidebarTree } from "./sidebar"
import { buildTree } from "./tree-utils"
import { CodeBlockProps, CodeFile } from "./types"

let highlighterPromise: Promise<Highlighter> | null = null

export function CodeBlock({
  files,
  defaultFile,
  height,
  expandable = false,
  initialExpanded = false,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()
  const scrollRef = useRef<HTMLDivElement>(null)

  const fileKeys = useMemo(() => Object.keys(files), [files])
  const tree = useMemo(() => buildTree(files), [files])

  const isMultiFile = fileKeys.length > 1
  const initialActive =
    defaultFile && files[defaultFile] ? defaultFile : fileKeys[0]

  const [activeFileState, setActiveFileState] = useState(initialActive)
  const activeFile = files[activeFileState] ? activeFileState : initialActive

  const [copied, setCopied] = useState(false)
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  const [highlightedFiles, setHighlightedFiles] = useState<
    Record<string, string>
  >({})
  const layoutIdPrefix = useId()
  const trackCopy = useTrackEvent()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [activeFile])

  const handleSelectFile = (path: string) => {
    setActiveFileState(path)
    setIsMobileSidebarOpen(false)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  useEffect(() => {
    if (!mounted) return
    let isCanceled = false

    async function highlightAll() {
      if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
          themes: ["github-light", "github-dark"],
          langs: [
            "typescript",
            "javascript",
            "tsx",
            "jsx",
            "json",
            "css",
            "html",
            "bash",
            "sh",
            "yaml",
          ],
        })
      }
      const highlighter = await highlighterPromise
      const activeTheme =
        resolvedTheme === "dark" ? "github-dark" : "github-light"
      const newHighlighted: Record<string, string> = {}

      for (const path of fileKeys) {
        const fileObj = files[path]
        const codeString = typeof fileObj === "string" ? fileObj : fileObj.code
        const ext = path.split(".").pop() || "tsx"
        const lang = typeof fileObj === "string" ? ext : fileObj.language || ext

        const highlights =
          typeof fileObj === "string" ? [] : fileObj.highlightLines || []
        const adds = typeof fileObj === "string" ? [] : fileObj.addLines || []
        const removes =
          typeof fileObj === "string" ? [] : fileObj.removeLines || []
        const focusOnly =
          typeof fileObj === "string" ? false : fileObj.focusOnly || false

        const isTerminal = ["bash", "sh", "zsh"].includes(lang)

        const html = highlighter.codeToHtml(codeString, {
          lang,
          theme: activeTheme,
          transformers: [
            {
              pre(node) {
                node.properties.style = ""
                if (isTerminal) node.properties["data-terminal"] = "true"
                return node
              },
              line(node, line) {
                const currentClass = node.properties.class || ""
                const classes =
                  typeof currentClass === "string"
                    ? currentClass.split(" ")
                    : Array.isArray(currentClass)
                      ? currentClass
                      : []

                if (!classes.includes("line")) classes.push("line")

                if (highlights.includes(line)) classes.push("is-highlighted")
                if (adds.includes(line)) classes.push("is-added")
                if (removes.includes(line)) classes.push("is-removed")

                if (
                  focusOnly &&
                  highlights.length > 0 &&
                  !highlights.includes(line)
                ) {
                  classes.push("is-blurred")
                }

                node.properties.class = classes.join(" ")
                return node
              },
            },
          ],
        })
        newHighlighted[path] = html
      }

      if (!isCanceled) setHighlightedFiles(newHighlighted)
    }
    highlightAll()

    return () => {
      isCanceled = true
    }
  }, [files, fileKeys, resolvedTheme, mounted])

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const handleCopy = async () => {
    const data = files[activeFile]
    if (!data) return
    const codeString = typeof data === "string" ? data : data.code
    try {
      await navigator.clipboard.writeText(codeString)
      setCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      return
    }

    const activeExt = activeFile.split(".").pop() || ""
    const activeFileObj = files[activeFile]
    const activeLang =
      typeof activeFileObj === "string"
        ? activeExt
        : activeFileObj.language || activeExt

    trackCopy(
      "code_copied",
      {
        file: activeFile,
        language: activeLang,
      },
      "web_copy"
    )
  }

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-full animate-pulse rounded-3xl bg-muted p-2",
          !height && "h-full",
          className // ✨ FIXED: Pass className so skeleton receives flex-1 and doesn't jump in height
        )}
        style={height ? { height } : undefined}
      />
    )
  }

  const activeRawCode = !files[activeFile]
    ? ""
    : typeof files[activeFile] === "string"
      ? files[activeFile]
      : (files[activeFile] as CodeFile).code
  const activeExt = activeFile.split(".").pop() || ""
  const activeFileObj = files[activeFile]
  const activeLang =
    typeof activeFileObj === "string"
      ? activeExt
      : activeFileObj.language || activeExt
  const isTerminalMode = ["bash", "sh", "zsh"].includes(activeLang)

  return (
    <div
      style={height ? { height } : undefined}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-3xl bg-muted p-2 transition-all duration-300",
        !height && "h-full",
        className
      )}
    >
      <div className="flex items-center justify-between px-3 pt-1 pb-2">
        <div className="flex items-center gap-3 overflow-hidden">
          {isMultiFile && (
            <>
              <button
                onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:flex"
              >
                <HugeiconsIcon icon={PanelLeftIcon} className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:hidden"
              >
                <HugeiconsIcon icon={PanelLeftIcon} className="h-4 w-4" />
              </button>
            </>
          )}

          <div className="flex items-center gap-2">
            {!isMultiFile && getIconForFile(activeFile, true)}
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              {!isDesktopSidebarOpen && isMultiFile ? (
                activeFile.split("/").map((part, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span
                      className={cn(
                        "truncate",
                        idx === arr.length - 1
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {part}
                    </span>
                    {idx < arr.length - 1 && (
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="h-3.5 w-3.5 text-border"
                      />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span className="truncate text-foreground">
                  {!isMultiFile ? activeFile : activeFile.split("/").pop()}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleCopy}
          title="Copy code"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-foreground drop-shadow-2xl transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:drop-shadow-none"
        >
          {/* ✨ FIXED: initial={false} to stop scale animation on load */}
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <HugeiconsIcon
                  icon={CheckmarkBadge03Icon}
                  className="h-3.5 w-3.5 text-green-500"
                />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <HugeiconsIcon icon={Copy01Icon} className="h-3.5 w-3.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-start overflow-hidden">
        <motion.div
          initial={false}
          animate={{
            marginLeft: isDesktopSidebarOpen && isMultiFile ? 0 : -240,
            opacity: isDesktopSidebarOpen && isMultiFile ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "z-10 hidden h-full w-60 shrink-0 overflow-auto md:block",
            scrollbarClasses,
            (!isDesktopSidebarOpen || !isMultiFile) && "pointer-events-none"
          )}
        >
          <div className="h-full min-w-max pr-3 pb-2">
            <SidebarTree
              nodes={tree}
              activeFile={activeFile}
              onSelectFile={handleSelectFile}
              layoutIdPrefix={`${layoutIdPrefix}-desktop`}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {isMobileSidebarOpen && isMultiFile && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute inset-0 z-30 rounded-2xl bg-overlay backdrop-blur-sm md:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={cn(
                  "absolute inset-y-0 left-0 z-40 w-full overflow-auto rounded-2xl border-r border-border bg-muted py-2 backdrop-blur-3xl md:hidden",
                  scrollbarClasses
                )}
              >
                <div className="h-full min-w-max pr-3">
                  <SidebarTree
                    nodes={tree}
                    activeFile={activeFile}
                    onSelectFile={handleSelectFile}
                    layoutIdPrefix={`${layoutIdPrefix}-mobile`}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="relative z-0 flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-background">
          <CodeDisplay
            highlightedHtml={highlightedFiles[activeFile]}
            rawCode={activeRawCode as string}
            isTerminalMode={isTerminalMode}
            showLineNumbers={showLineNumbers}
            expandable={expandable}
            isExpanded={isExpanded}
            scrollRef={scrollRef}
          />

          {expandable && !isExpanded && (
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 flex h-32 flex-col items-center justify-end bg-linear-to-t from-background to-transparent pb-4">
              <button
                onClick={() => setIsExpanded(true)}
                className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground drop-shadow-2xl backdrop-blur-md transition-colors hover:bg-accent hover:text-foreground dark:drop-shadow-none"
              >
                <span>Show more</span>
                <HugeiconsIcon icon={ArrowDown01Icon} className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <AnimatePresence>
            {expandable && isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-4 bottom-4 z-10 md:right-6"
              >
                <button
                  onClick={handleCollapse}
                  aria-label="Collapse code block"
                  className="flex items-center gap-1.5 rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md transition-colors hover:bg-accent hover:text-foreground"
                >
                  <HugeiconsIcon icon={ArrowUp01Icon} className="h-3.5 w-3.5" />
                  <span>Collapse</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
