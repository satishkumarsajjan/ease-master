"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { useCopy } from "@/hooks/use-copy"
import { useTrackEvent } from "@/hooks/use-track-event"
import { PackageManager, usePackageManager } from "@/store"
import {
  ArrowDown01Icon,
  CheckmarkBadge03Icon,
  Copy01Icon,
  ComputerTerminal01Icon, // ✨ IMPORT A FALLBACK ICON (or any generic icon you like)
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { BunIcon, NpmIcon, PnpmIcon, YarnIcon } from "./icons"

interface CommandBlockProps {
  title?: string
  pkg?: string
  cli?: string
  command?: string // ✨ NEW: Accepts any raw command string
  commands?: Partial<Record<PackageManager, string>>
  className?: string
}

const PM_CONFIG = {
  npm: { icon: NpmIcon, label: "npm" },
  pnpm: { icon: PnpmIcon, label: "pnpm" },
  yarn: { icon: YarnIcon, label: "yarn" },
  bun: { icon: BunIcon, label: "bun" },
} as const

// ✨ The Premium Mac-style Scrollbar
const scrollbarClasses = cn(
  "[scrollbar-width:thin][scrollbar-color:var(--border)_transparent]",
  "[&::-webkit-scrollbar]:h-2.5",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:min-w-[40px]",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb]:border-[3px]",
  "[&::-webkit-scrollbar-thumb]:border-solid",
  "[&::-webkit-scrollbar-thumb]:border-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-clip-padding",
  "[&::-webkit-scrollbar-thumb]:bg-border",
  "hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground"
)

// ✨ NEW: Auto-Translator Engine for generic npm commands
function transformCommand(baseCmd: string, manager: PackageManager): string {
  // If it's not an npm/npx command, leave it exactly as the user typed it (e.g., "git clone")
  if (!baseCmd.startsWith("npm ") && !baseCmd.startsWith("npx ")) return baseCmd
  if (manager === "npm") return baseCmd

  // Handle npx translations
  if (baseCmd.startsWith("npx ")) {
    if (manager === "pnpm") return baseCmd.replace(/^npx /, "pnpm dlx ")
    if (manager === "yarn") return baseCmd.replace(/^npx /, "yarn dlx ")
    if (manager === "bun") return baseCmd.replace(/^npx /, "bunx ")
  }

  // Handle npm install translations
  if (baseCmd.startsWith("npm install ") || baseCmd.startsWith("npm i ")) {
    const rest = baseCmd.replace(/^npm (install|i) /, "")
    if (manager === "pnpm") return `pnpm add ${rest}`
    if (manager === "yarn") return `yarn add ${rest}`
    if (manager === "bun") return `bun add ${rest}`
  }

  // Handle npm run translations
  if (baseCmd.startsWith("npm run ")) {
    const rest = baseCmd.replace(/^npm run /, "")
    if (manager === "pnpm") return `pnpm ${rest}` // pnpm run is also fine, but pnpm <script> is standard
    if (manager === "yarn") return `yarn ${rest}`
    if (manager === "bun") return `bun run ${rest}`
  }

  return baseCmd
}

export function CommandBlock({
  title = "CLI Install",
  pkg,
  cli,
  command,
  commands,
  className,
}: CommandBlockProps) {
  const { manager, setManager } = usePackageManager()
  const { copied, copy } = useCopy()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const trackCopy = useTrackEvent()

  useEffect(() => {
    if (!isDropdownOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDropdownOpen])

  const getCommand = () => {
    if (commands && commands[manager]) return commands[manager]!

    // 1. Legacy support: Package Installs
    if (pkg) {
      switch (manager) {
        case "npm":
          return `npm install ${pkg}`
        case "yarn":
          return `yarn add ${pkg}`
        case "pnpm":
          return `pnpm add ${pkg}`
        case "bun":
          return `bun add ${pkg}`
      }
    }

    // 2. Legacy support: Component Installs
    if (cli) {
      switch (manager) {
        case "npm":
          return `npx shadcn@latest add ${cli}`
        case "yarn":
          return `yarn dlx shadcn@latest add ${cli}`
        case "pnpm":
          return `pnpm dlx shadcn@latest add ${cli}`
        case "bun":
          return `bunx shadcn@latest add ${cli}`
      }
    }

    // 3. ✨ NEW: Generic Command Parsing
    if (command) {
      return transformCommand(command, manager)
    }

    return "echo 'No command specified'"
  }

  const commandString = getCommand()

  // ✨ NEW: Smart Detection. Does this command actually use a package manager?
  const isPMCommand =
    !!pkg ||
    !!cli ||
    !!commands ||
    /^(npm|npx|yarn|pnpm|bun|bunx)\b/.test(commandString)

  const handleCopy = () => {
    copy(commandString)

    trackCopy(
      "cli_command_copied",
      {
        command: commandString,
        manager: isPMCommand ? manager : "none",
        package: pkg || cli || "custom",
      },
      "web_copy"
    )
  }

  const SelectedIcon = PM_CONFIG[manager].icon

  // ✨ Auto-Tokenizer Engine updated slightly for generic bash commands
  const renderHighlightedCommand = (cmd: string) => {
    const parts = cmd.split(" ")
    return parts.map((part, idx) => {
      if (idx === 0) {
        return (
          <span key={idx} className="font-semibold text-primary">
            {part}{" "}
          </span>
        )
      }
      if (part.startsWith("-")) {
        return (
          <span key={idx} className="text-muted-foreground">
            {part}{" "}
          </span>
        )
      }
      if (["install", "add", "remove", "dlx", "create", "run"].includes(part)) {
        return (
          <span key={idx} className="text-muted-foreground">
            {part}{" "}
          </span>
        )
      }
      return (
        <span key={idx} className="text-foreground">
          {part}{" "}
        </span>
      )
    })
  }

  return (
    <div className={cn("w-full max-w-3xl rounded-3xl bg-muted p-2", className)}>
      <div className="flex items-center justify-between px-3 pt-1 pb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>

        <div className="flex items-center gap-1.5">
          {/* ✨ CONDITIONAL RENDER: Only show dropdown if it's a PM command */}
          {isPMCommand ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Select package manager"
                aria-expanded={isDropdownOpen}
                className="flex items-center gap-1.5 rounded-lg bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <SelectedIcon className="h-3.5 w-3.5" />
                <span className="hidden capitalize sm:inline-block">
                  {manager}
                </span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className={cn(
                    "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                    isDropdownOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute top-full right-0 z-50 mt-1.5 w-32 overflow-hidden rounded-md bg-popover p-2 backdrop-blur-md"
                  >
                    {(Object.keys(PM_CONFIG) as PackageManager[]).map((pm) => {
                      const Icon = PM_CONFIG[pm].icon
                      return (
                        <button
                          key={pm}
                          onClick={() => {
                            setManager(pm)
                            setIsDropdownOpen(false)
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                            manager === pm
                              ? "bg-accent font-medium text-accent-foreground"
                              : "text-popover-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="capitalize">{pm}</span>
                          {manager === pm && (
                            <HugeiconsIcon
                              icon={CheckmarkBadge03Icon}
                              className="ml-auto h-3 w-3 shrink-0"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ✨ FALLBACK UI for non-PM commands (e.g., git clone) */
            <div className="flex items-center gap-1.5 rounded-lg bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
              <HugeiconsIcon
                icon={ComputerTerminal01Icon}
                className="h-3.5 w-3.5"
              />
              <span className="hidden sm:inline-block">Bash</span>
            </div>
          )}

          <button
            onClick={handleCopy}
            title="Copy command"
            aria-label="Copy command to clipboard"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
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
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden="true"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <HugeiconsIcon
                    icon={Copy01Icon}
                    className="size-3.5"
                    aria-hidden="true"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "relative flex min-h-12 items-center overflow-x-auto rounded-2xl bg-background px-4 py-3",
          scrollbarClasses
        )}
      >
        <span className="mr-3 shrink-0 font-mono text-[13px] leading-6 text-muted-foreground select-none">
          $
        </span>

        <AnimatePresence mode="wait" initial={false}>
          <motion.code
            key={commandString}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-max flex-1 font-mono text-[13px] leading-6 whitespace-nowrap"
          >
            {renderHighlightedCommand(commandString)}
          </motion.code>
        </AnimatePresence>
      </div>
    </div>
  )
}
