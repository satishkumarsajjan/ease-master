"use client"

import {
  LaptopIcon,
  MoonSlowWindIcon,
  NewTwitterIcon,
  Sun02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useState, useSyncExternalStore } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { switchThemeWithTransition } from "@/lib/theme-transition"
import { AUTHOR } from "@/lib/social-links"
import { SPRING } from "@/lib/motion"
import { cn } from "@/lib/utils"

export const SidebarFooter = () => {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex-1">
        <ThemeSwitcher />
      </div>

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={AUTHOR.x}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-background text-muted-foreground transition-all hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <HugeiconsIcon
                icon={NewTwitterIcon}
                className="size-3.5 fill-current transition-transform duration-300 group-hover:scale-110"
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={12} className="text-xs">
            Connect with me on X
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!mounted) {
    return <div className="h-10 w-full rounded-[12px] bg-background" />
  }

  const options = [
    { value: "light", icon: Sun02Icon, label: "Light" },
    { value: "system", icon: LaptopIcon, label: "System" },
    { value: "dark", icon: MoonSlowWindIcon, label: "Dark" },
  ]

  const handleThemeChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    newTheme: string
  ) => {
    if (theme === newTheme) return

    // ✨ Execute transition starting exactly from the user's mouse click
    switchThemeWithTransition(setTheme, newTheme, e, "fade")
  }

  return (
    <LayoutGroup id="theme-switcher-group">
      <div
        className="relative flex h-10 w-full items-center justify-center gap-1 rounded-[12px] bg-background p-1"
        onMouseLeave={() => setHoveredTheme(null)}
      >
        {options.map((opt) => {
          const isActive = theme === opt.value
          const isHovered = hoveredTheme === opt.value

          return (
            <button
              key={opt.value}
              onClick={(e) => handleThemeChange(e, opt.value)}
              onMouseEnter={() => setHoveredTheme(opt.value)}
              aria-label={`Switch to ${opt.label} theme`}
              title={`${opt.label} theme`}
              aria-pressed={isActive}
              className={cn(
                "relative flex h-full flex-1 items-center justify-center rounded-[8px] transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                isActive
                  ? "text-background"
                  : isHovered
                    ? "text-foreground"
                    : "text-muted-foreground"
              )}
            >
              {/* Gliding hover indicator (sits at z-[1] behind active indicator) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    layoutId="theme-hover-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[1] rounded-[8px] bg-muted dark:bg-accent"
                    transition={SPRING.pill}
                  />
                )}
              </AnimatePresence>

              {/* Active indicator (sits at z-[2] on top of hover pill) */}
              {isActive && (
                <motion.div
                  layoutId="theme-active-indicator"
                  className="absolute inset-0 z-[2] rounded-[8px] bg-foreground"
                  transition={SPRING.pill}
                />
              )}

              <HugeiconsIcon
                icon={opt.icon}
                className="relative z-10 size-3.5 transition-transform duration-200"
              />
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
