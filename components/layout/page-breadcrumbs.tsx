"use client"

import * as React from "react"
import Link from "next/link"
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb"
import type * as PageTree from "fumadocs-core/page-tree"

import { cn } from "@/lib/utils"

interface PageBreadcrumbsProps {
  pageUrl: string
  tree: PageTree.Root
  className?: string
}

function extractBreadcrumbText(node: React.ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (!node) return ""
  if (Array.isArray(node)) {
    return node.map(extractBreadcrumbText).join("")
  }
  if (React.isValidElement(node)) {
    const children = (node.props as { children?: React.ReactNode }).children
    if (Array.isArray(children)) {
      return extractBreadcrumbText(children[0])
    }
    return extractBreadcrumbText(children)
  }
  return ""
}

export function PageBreadcrumbs({
  pageUrl,
  tree,
  className,
}: PageBreadcrumbsProps) {
  const items = getBreadcrumbItems(pageUrl, tree, {
    includePage: true,
    includeRoot: false,
  })

  if (items.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const rawText = extractBreadcrumbText(item.name)
          const label =
            rawText ||
            (typeof item.name === "string"
              ? item.name
              : item.url
                ? (item.url.split("/").pop()?.replace(/-/g, " ") ?? "")
                : "")

          return (
            <li
              key={item.url ?? index}
              className="inline-flex min-w-0 items-center gap-2"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="text-[11px] text-muted-foreground select-none"
                >
                  ›
                </span>
              )}
              {isLast || !item.url ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "truncate capitalize",
                    isLast
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="truncate capitalize transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
