"use client"

import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"
import { useCommandStore } from "@/store/use-command-store"
import type * as PageTree from "fumadocs-core/page-tree"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import * as React from "react"
import { logger } from "@/lib/logger"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowMoveDownLeftIcon,
  ArrowRight01Icon,
  Clock02Icon,
  CommandIcon,
  ComponentIcon,
  File02Icon,
  FolderCodeIcon,
  Github01Icon,
  GridViewIcon,
  HashtagIcon,
  LaptopIcon,
  LaptopVideoIcon,
  Layers01Icon,
  Layout01Icon,
  Link01Icon,
  Loading03Icon,
  MoonSlowWindIcon,
  Search01Icon,
  Sun02Icon,
  TextAlignLeftIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { PROJECT } from "@/lib/social-links"

type ApiSearchResult = {
  id: string
  title?: string
  description?: string
  url: string
  type: "page" | "heading" | "text"
  content: string
}

type StaticItem = {
  id: string
  title: React.ReactNode
  searchString: string
  subtitle?: string
  group: string
  icon: React.ReactNode
  url?: string
  action?: () => void
  aliases?: string[]
  shortcut?: string
}

const searchPurify = (html: string) =>
  html.replace(/<(?!\/?mark\b)[^>]+>/gi, "")

function getContextualIcon(name: string) {
  const lower = name.toLowerCase()
  if (lower.includes("component"))
    return (
      <HugeiconsIcon
        icon={ComponentIcon}
        className="mr-3 size-4 text-primary"
      />
    )
  if (lower.includes("block"))
    return (
      <HugeiconsIcon icon={GridViewIcon} className="mr-3 size-4 text-primary" />
    )
  if (lower.includes("template"))
    return (
      <HugeiconsIcon icon={Layout01Icon} className="mr-3 size-4 text-primary" />
    )
  if (lower.includes("category"))
    return (
      <HugeiconsIcon icon={Layers01Icon} className="mr-3 size-4 text-primary" />
    )
  return (
    <HugeiconsIcon
      icon={FolderCodeIcon}
      className="mr-3 size-4 text-muted-foreground"
    />
  )
}

export interface CommandMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "icon"
}

/**
 * 🌟 THE UNIVERSAL TRIGGER BUTTON
 */
export const CommandMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  CommandMenuTriggerProps
>(({ className, variant = "default", onClick, ...props }, ref) => {
  const { setIsOpen } = useCommandStore()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(true)
    onClick?.(e)
  }

  if (variant === "icon") {
    return (
      <button
        ref={ref}
        aria-label="Open command menu"
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <HugeiconsIcon icon={Search01Icon} className="size-4" />
      </button>
    )
  }

  return (
    <button
      ref={ref}
      aria-label="Open command menu"
      className={cn(
        "group flex w-full items-center gap-2 rounded-[12px] bg-background px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <HugeiconsIcon icon={Search01Icon} className="size-4 shrink-0" />
      <span className="flex-1 truncate text-left">Search Anything...</span>
      <kbd className="pointer-events-none inline-flex h-5 shrink-0 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  )
})
CommandMenuTrigger.displayName = "CommandMenuTrigger"

/**
 * 🌟 THE GLOBAL DIALOG
 */
export function CommandMenuDialog({ docsTree }: { docsTree?: PageTree.Root }) {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { isOpen, setIsOpen } = useCommandStore()

  const [query, setQuery] = React.useState("")
  const [apiResults, setApiResults] = React.useState<ApiSearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [, setActiveValue] = React.useState("")
  const [modifier, setModifier] = React.useState<"none" | "meta" | "shift">(
    "none"
  )
  const [recentIds, setRecentIds] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const stored = window.localStorage.getItem("satis-recent-searches")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const saveRecent = React.useCallback((id: string) => {
    if (id.startsWith("action-") || id.startsWith("theme-")) return
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 5)
      try {
        localStorage.setItem("satis-recent-searches", JSON.stringify(next))
      } catch (e) {
        logger.error("Failed to save recent search", e)
      }
      return next
    })
  }, [])

  // 🌍 Global Keyboard Listener
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target as HTMLElement).isContentEditable ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        )
          return
        e.preventDefault()
        setIsOpen(true)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setIsOpen])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) setModifier("meta")
      else if (e.shiftKey) setModifier("shift")
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey && !e.shiftKey) setModifier("none")
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.addEventListener("keyup", handleKeyUp)
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
      setModifier("none")
    }
  }, [isOpen])

  const isSearching = isLoading && query.trim().length > 0

  React.useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      return
    }

    const controller = new AbortController()

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        )
        if (res.ok) {
          const data = await res.json()
          setApiResults(data)

          if (data.length === 0) {
            trackEvent("search_zero_results", { query: trimmed.toLowerCase() })
          }
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }
        logger.error("Search failed", error)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, 200)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const staticItems = React.useMemo<StaticItem[]>(() => {
    const items: StaticItem[] = []

    if (docsTree) {
      function traverseTree(
        node: PageTree.Node,
        currentGroup: string,
        path: string[]
      ) {
        if (node.type === "page") {
          const pageNode = node as PageTree.Item
          const safeNameStr =
            typeof pageNode.name === "string"
              ? pageNode.name
              : pageNode.url
                  .split("/")
                  .filter(Boolean)
                  .pop()
                  ?.replace(/-/g, " ") || "Page"

          items.push({
            id: pageNode.url,
            title: pageNode.name,
            searchString: safeNameStr,
            subtitle:
              path.length > 0 ? `Docs ➔ ${path.join(" ➔ ")}` : "Documentation",
            group: currentGroup,
            url: pageNode.url,
            icon: getContextualIcon(currentGroup),
            aliases: [currentGroup.toLowerCase()],
          })
        } else if (node.type === "folder") {
          const folderNode = node as PageTree.Folder
          const safeNameStr =
            typeof folderNode.name === "string" ? folderNode.name : "Folder"
          const groupNameStr = safeNameStr
          const newPath = [...path, groupNameStr]

          if (folderNode.index) {
            const indexNode = folderNode.index as PageTree.Item
            items.push({
              id: indexNode.url,
              title: folderNode.name ? `${safeNameStr} Overview` : "Overview",
              searchString: `${safeNameStr} Overview`,
              subtitle:
                path.length > 0
                  ? `Docs ➔ ${path.join(" ➔ ")}`
                  : "Documentation",
              group: groupNameStr,
              url: indexNode.url,
              icon: (
                <HugeiconsIcon
                  icon={LaptopVideoIcon}
                  className="mr-3 size-4 text-muted-foreground"
                />
              ),
              aliases: ["index", "overview"],
            })
          }
          folderNode.children.forEach((child) =>
            traverseTree(child, groupNameStr, newPath)
          )
        }
      }
      docsTree.children.forEach((child) =>
        traverseTree(child, "General Docs", [])
      )
    }

    const systemItems: StaticItem[] = [
      {
        id: "action-copy-url",
        title: "Copy Current URL",
        searchString: "Copy Current URL",
        group: "Actions",
        subtitle: "System Utility",
        icon: (
          <HugeiconsIcon
            icon={Link01Icon}
            className="mr-3 size-4 text-muted-foreground"
          />
        ),
        action: () => navigator.clipboard.writeText(window.location.href),
        shortcut: "⇧ ↵",
      },
      {
        id: "action-github",
        title: "GitHub Repository",
        searchString: "GitHub Repository",
        group: "Actions",
        url: PROJECT.github,
        subtitle: "External Link",
        icon: (
          <HugeiconsIcon
            icon={Github01Icon}
            className="mr-3 size-4 text-muted-foreground"
          />
        ),
        shortcut: "⌘ ↵",
      },
      {
        id: "theme-light",
        title: "Light Theme",
        searchString: "Light Theme",
        group: "Theme",
        icon: (
          <HugeiconsIcon
            icon={Sun02Icon}
            className="mr-3 size-4 text-muted-foreground"
          />
        ),
        action: () => setTheme("light"),
        aliases: ["mode"],
      },
      {
        id: "theme-dark",
        title: "Dark Theme",
        searchString: "Dark Theme",
        group: "Theme",
        icon: (
          <HugeiconsIcon
            icon={MoonSlowWindIcon}
            className="mr-3 size-4 text-muted-foreground"
          />
        ),
        action: () => setTheme("dark"),
        aliases: ["mode"],
      },
      {
        id: "theme-system",
        title: "System Theme",
        searchString: "System Theme",
        group: "Theme",
        icon: (
          <HugeiconsIcon
            icon={LaptopIcon}
            className="mr-3 size-4 text-muted-foreground"
          />
        ),
        action: () => setTheme("system"),
        aliases: ["mode"],
      },
    ]

    return [...items, ...systemItems]
  }, [docsTree, setTheme])

  const handleSelect = React.useCallback(
    (id: string, url?: string, action?: () => void) => {
      saveRecent(id)
      setIsOpen(false)

      trackEvent("search_result_clicked", { targetId: id, url: url })

      if (action) {
        action()
        return
      }
      if (url) {
        if (modifier === "meta") window.open(url, "_blank")
        else if (modifier === "shift")
          navigator.clipboard.writeText(window.location.origin + url)
        else router.push(url)
      }
      setQuery("")
    },
    [modifier, router, saveRecent, setIsOpen]
  )

  const getApiIcon = (type: ApiSearchResult["type"]) => {
    if (type === "heading")
      return (
        <HugeiconsIcon
          icon={HashtagIcon}
          className="mr-3 size-4 text-muted-foreground"
        />
      )
    if (type === "text")
      return (
        <HugeiconsIcon
          icon={TextAlignLeftIcon}
          className="mr-3 size-4 text-muted-foreground"
        />
      )
    return (
      <HugeiconsIcon icon={File02Icon} className="mr-3 size-4 text-primary" />
    )
  }

  const groupedStaticItems = React.useMemo(() => {
    return staticItems.reduce(
      (acc, item) => {
        if (!acc[item.group]) acc[item.group] = []
        acc[item.group].push(item)
        return acc
      },
      {} as Record<string, StaticItem[]>
    )
  }, [staticItems])

  const recentStaticItems = React.useMemo(() => {
    return recentIds
      .map((id) => staticItems.find((item) => item.id === id))
      .filter((item): item is StaticItem => item !== undefined)
  }, [recentIds, staticItems])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-hidden rounded-3xl bg-muted p-1 sm:max-w-[640px]">
        <DialogTitle className="sr-only">Command Menu</DialogTitle>
        <Command
          className="flex h-full w-full flex-col gap-2 bg-muted"
          onValueChange={setActiveValue}
          filter={(value, search) => {
            // Strip any internal prefix before finding the item in static items
            const cleanId = value.replace(/^(recent-|api-)/, "")
            const item = staticItems.find((i) => i.id === cleanId)

            // If not found in static items (e.g. backend API search result), don't filter out
            if (!item) return 1

            const searchLower = search.toLowerCase()
            if (item.searchString.toLowerCase().includes(searchLower)) return 1
            if (
              item.aliases?.some((a) => a.toLowerCase().includes(searchLower))
            )
              return 1
            return 0
          }}
        >
          <CommandInput
            placeholder="Search components, categories, or actions..."
            value={query}
            onValueChange={setQuery}
            className="rounded-2xl border-none text-base focus:ring-0"
          />
          <div className="rounded-2xl bg-background p-2">
            <CommandList className="max-h-[55vh] scroll-py-2">
              <CommandEmpty className="py-12 text-center text-sm text-muted-foreground">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="size-5 animate-spin text-primary"
                    />
                    <span>Searching knowledge base...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="size-6 text-muted-foreground"
                    />
                    <span>No results found.</span>
                  </div>
                )}
              </CommandEmpty>

              {/* 🕒 RECENTLY VISITED: Prefixed value avoids key navigation collision */}
              {!query && recentStaticItems.length > 0 && (
                <CommandGroup heading="Recently Visited">
                  {recentStaticItems.map((item) => (
                    <CommandItem
                      key={`recent-${item.id}`}
                      value={`recent-${item.id}`}
                      onSelect={() =>
                        handleSelect(item.id, item.url, item.action)
                      }
                      className="flex w-full items-center px-4 py-2.5 aria-selected:bg-secondary aria-selected:text-primary"
                    >
                      <HugeiconsIcon
                        icon={Clock02Icon}
                        className="mr-3 size-4 text-muted-foreground"
                      />
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="flex items-center gap-2 font-medium">
                          {item.title}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                  <CommandSeparator className="my-2" />
                </CommandGroup>
              )}

              {/* 🔍 API RESULTS: Prefixed value ensures unique cmdk identification */}
              {query.trim().length > 0 && apiResults.length > 0 && (
                <CommandGroup heading="Deep Search Results (Content)">
                  {apiResults.map((result) => {
                    const baseUrl = result.url.split("#")[0]
                    const parentPage = staticItems.find(
                      (item) => item.url === baseUrl
                    )

                    let displayTitle = result.title || ""
                    let displayContent = result.description || ""

                    if (!displayTitle) {
                      if (result.type === "page") {
                        displayTitle = result.content
                      } else if (result.type === "heading") {
                        displayTitle = result.content
                        displayContent = parentPage
                          ? `In ${parentPage.searchString}`
                          : ""
                      } else {
                        displayTitle = parentPage
                          ? parentPage.searchString
                          : "Snippet"
                        displayContent = result.content
                      }
                    } else if (
                      result.type === "text" ||
                      result.type === "heading"
                    ) {
                      displayContent = result.content
                    }

                    const safeTitle = searchPurify(displayTitle)
                    const safeContent = searchPurify(displayContent)

                    return (
                      <CommandItem
                        key={`api-${result.id}`}
                        value={`api-${result.id}`}
                        onSelect={() => handleSelect(result.id, result.url)}
                        className="flex flex-col items-start gap-1 px-4 py-3 aria-selected:bg-secondary aria-selected:text-primary"
                      >
                        <div className="flex w-full items-center">
                          {getApiIcon(result.type)}
                          <span
                            className="font-heading text-sm font-medium [&_mark]:rounded-[12px] [&_mark]:bg-secondary [&_mark]:px-1 [&_mark]:text-primary"
                            dangerouslySetInnerHTML={{ __html: safeTitle }}
                          />
                        </div>
                        {safeContent && (
                          <span
                            className="ml-7 line-clamp-1 font-body text-xs text-muted-foreground [&_mark]:rounded-[12px] [&_mark]:bg-secondary [&_mark]:px-1 [&_mark]:font-semibold [&_mark]:text-primary"
                            dangerouslySetInnerHTML={{ __html: safeContent }}
                          />
                        )}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}

              {/* 📚 STATIC CATALOG & ACTIONS */}
              {Object.entries(groupedStaticItems).map(([group, items]) => (
                <CommandGroup key={group} heading={group}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      keywords={item.aliases}
                      onSelect={() =>
                        handleSelect(item.id, item.url, item.action)
                      }
                      className="flex w-full items-center px-4 py-2.5 aria-selected:bg-secondary aria-selected:text-primary"
                    >
                      {item.icon}
                      <div className="flex min-w-0 flex-col items-start gap-0.5">
                        <span className="flex items-center gap-2 truncate font-medium">
                          {item.title}
                        </span>
                      </div>
                      {item.shortcut && (
                        <span className="ml-auto font-mono text-[10px] tracking-widest text-muted-foreground">
                          {item.shortcut}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </div>

          {/* FLIPPED FOOTER LAYOUT */}
          <div className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3 text-xs text-muted-foreground backdrop-blur-xl">
            {/* LEFT SIDE: Clean ⌘K Indicator */}
            <div className="flex items-center">
              <kbd className="inline-flex h-5 shrink-0 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            {/* RIGHT SIDE: Action State & Icon */}
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">
                {modifier === "meta"
                  ? "Open in New Tab"
                  : modifier === "shift"
                    ? "Copy Target URL"
                    : "Select"}
              </span>

              {/* Dynamic Action Icons */}
              {modifier === "meta" ? (
                <HugeiconsIcon
                  icon={CommandIcon}
                  className="size-3.5 text-primary"
                />
              ) : modifier === "shift" ? (
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-3.5 -rotate-90 text-primary"
                />
              ) : (
                <HugeiconsIcon
                  icon={ArrowMoveDownLeftIcon}
                  className="size-3.5 text-foreground"
                />
              )}
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
