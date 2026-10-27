"use client"

import * as React from "react"
import { Folder01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BASE_PADDING, DEPTH_OFFSET } from "@/components/code-block/constants"
import { getIconForFile } from "@/components/code-block/sidebar"
import { buildTree } from "@/components/code-block/tree-utils"
import type { TreeNode } from "@/components/code-block/types"
import { cn } from "@/lib/utils"

export interface FileTreeProps {
  /** Path → optional comment. Nested folders are inferred from "/". */
  files: Record<string, string | undefined>
  className?: string
}

function FileTreeNode({
  node,
  depth,
  files,
}: {
  node: TreeNode
  depth: number
  files: Record<string, string | undefined>
}) {
  const paddingLeft = `${BASE_PADDING + depth * DEPTH_OFFSET}px`

  if (node.type === "folder") {
    return (
      <div className="flex flex-col">
        <div
          className="flex items-center gap-2 py-1 text-sm font-medium text-foreground select-none"
          style={{ paddingLeft }}
        >
          <HugeiconsIcon
            icon={Folder01Icon}
            className="size-4 shrink-0 text-muted-foreground"
          />
          <span className="font-mono text-[13px]">{node.name}</span>
        </div>
        {node.children.map((child) => (
          <FileTreeNode
            key={child.path}
            node={child}
            depth={depth + 1}
            files={files}
          />
        ))}
      </div>
    )
  }

  const comment = files[node.path]

  return (
    <div
      className="flex items-center justify-between gap-4 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      style={{ paddingLeft }}
    >
      <div className="flex min-w-0 items-center gap-2">
        {getIconForFile(node.name, false)}
        <span className="truncate font-mono text-[13px] text-foreground">
          {node.name}
        </span>
      </div>
      {comment ? (
        <span className="shrink-0 truncate pr-4 font-sans text-xs text-muted-foreground">
          {comment}
        </span>
      ) : null}
    </div>
  )
}

export function FileTree({ files, className }: FileTreeProps) {
  const tree = React.useMemo(() => (files ? buildTree(files) : []), [files])

  return (
    <div
      className={cn(
        "my-6 overflow-x-auto rounded-3xl border border-border bg-card p-4 shadow-sm",
        className
      )}
    >
      <div className="flex min-w-max flex-col py-1">
        {tree.map((node) => (
          <FileTreeNode key={node.path} node={node} depth={0} files={files} />
        ))}
      </div>
    </div>
  )
}
