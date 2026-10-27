"use client"

import { cn } from "@/lib/utils"
import { ArrowRight01Icon, Folder01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { DefaultFileIcon, ReactIcon, TSIcon } from "../icons"
import { BASE_PADDING, DEPTH_OFFSET } from "./constants"
import { FolderNode, TreeNode } from "./types"

export interface SidebarProps {
  nodes: TreeNode[]
  depth?: number
  activeFile: string
  onSelectFile: (path: string) => void
  layoutIdPrefix: string
}

export const getIconForFile = (filename: string, isActive: boolean) => {
  const ext = filename.split(".").pop()?.toLowerCase()
  const baseClasses = "h-4 w-4 shrink-0 transition-colors duration-200"
  switch (ext) {
    case "tsx":
    case "jsx":
      return (
        <ReactIcon
          className={cn(
            baseClasses,
            isActive ? "text-[#61DAFB]" : "text-muted-foreground"
          )}
        />
      )
    case "ts":
      return (
        <TSIcon
          className={cn(
            baseClasses,
            isActive ? "text-[#3178C6]" : "text-muted-foreground"
          )}
        />
      )
    default:
      return (
        <DefaultFileIcon
          className={cn(
            baseClasses,
            isActive ? "text-background" : "text-muted-foreground"
          )}
        />
      )
  }
}

export const SidebarTree = ({
  nodes,
  depth = 0,
  activeFile,
  onSelectFile,
  layoutIdPrefix,
}: SidebarProps) => (
  <div className="flex w-full min-w-max flex-col pr-3">
    {nodes.map((node) => {
      if (node.type === "folder") {
        return (
          <SidebarFolder
            key={node.path}
            node={node}
            depth={depth}
            activeFile={activeFile}
            onSelectFile={onSelectFile}
            layoutIdPrefix={layoutIdPrefix}
          />
        )
      }

      const isActive = activeFile === node.path
      return (
        <button
          key={node.path}
          onClick={() => onSelectFile(node.path)}
          className={cn(
            "group relative flex w-full items-center gap-2 py-0.5 text-left text-sm transition-colors",
            isActive
              ? "font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          style={{ paddingLeft: `${BASE_PADDING + depth * DEPTH_OFFSET}px` }}
        >
          <span className="relative flex w-full items-center gap-2 rounded-md px-2 py-1.5">
            {isActive && (
              <motion.div
                layoutId={`${layoutIdPrefix}-active-file`}
                className="absolute inset-0 -inset-x-2 z-0 ml-5 rounded-[8px] bg-foreground drop-shadow-2xl dark:drop-shadow-none"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
              <div className="h-3.5 w-3.5 shrink-0" />
              {getIconForFile(node.name, isActive)}
              <span
                className={cn(
                  "whitespace-nowrap",
                  isActive && "text-background"
                )}
              >
                {node.name}
              </span>
            </div>
          </span>
        </button>
      )
    })}
  </div>
)

const SidebarFolder = ({
  node,
  depth,
  activeFile,
  onSelectFile,
  layoutIdPrefix,
}: {
  node: FolderNode
  depth: number
  activeFile: string
  onSelectFile: (path: string) => void
  layoutIdPrefix: string
}) => {
  const isChildActive = activeFile.startsWith(node.path + "/")
  const [isOpen, setIsOpen] = useState(isChildActive)

  return (
    <div className="relative flex w-full min-w-max flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative flex w-full items-center gap-2 py-0.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
        )}
        style={{ paddingLeft: `${BASE_PADDING + depth * DEPTH_OFFSET}px` }}
      >
        <span className="relative flex w-fit items-center gap-2 rounded-md px-2 py-1.5">
          <div className="absolute inset-0 z-0 rounded-md bg-background opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative z-10 flex items-center gap-2">
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className={cn(
                "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                isOpen && "rotate-90"
              )}
            />
            <HugeiconsIcon icon={Folder01Icon} className="size-3.5 shrink-0" />
            <span className="whitespace-nowrap">{node.name}</span>
          </div>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative flex w-full min-w-max flex-col overflow-hidden"
          >
            <div
              className="absolute top-0 bottom-0 w-px bg-border"
              style={{ left: `${BASE_PADDING + depth * DEPTH_OFFSET + 7}px` }}
            />
            <SidebarTree
              nodes={node.children}
              depth={depth + 1}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
              layoutIdPrefix={layoutIdPrefix}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
