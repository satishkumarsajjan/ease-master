"use client"

import {
  LaptopIcon,
  MoonSlowWindIcon,
  Sun02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { useEffect, useState, useRef } from "react"
import { switchThemeWithTransition } from "@/lib/theme-transition"
import { useMounted } from "@/hooks/use-mounted"

export const MinimalThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()
  const [isHovered, setIsHovered] = useState(false)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  if (!mounted) {
    // SSR Fallback matches the exact resting state (naked 32x32 button, no bg)
    return <div className="h-8 w-8 rounded-[10px] bg-transparent" />
  }

  const options = [
    { value: "light", icon: Sun02Icon, label: "Light" },
    { value: "system", icon: LaptopIcon, label: "System" },
    { value: "dark", icon: MoonSlowWindIcon, label: "Dark" },
  ]

  const activeOption = options.find((o) => o.value === theme) || options[1]
  const inactiveOptions = options.filter((o) => o.value !== theme)

  const handleMouseEnter = () => {
    if (window.matchMedia("(hover: hover)").matches) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false)
    }, 500)
  }

  const cycleTheme = (e: React.MouseEvent) => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
    switchThemeWithTransition(setTheme, nextTheme, e, "fade")
  }

  const selectTheme = (e: React.MouseEvent, newTheme: string) => {
    if (theme === newTheme) return
    switchThemeWithTransition(setTheme, newTheme, e, "fade")
  }

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Animate container width and internal paddings/gaps dynamically
      animate={{
        width: isHovered ? "max-content" : 32,
        paddingLeft: isHovered ? 4 : 0,
        paddingRight: isHovered ? 4 : 0,
        gap: isHovered ? 3 : 0,
      }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
      // No background or borders on the wrapper itself
      className="relative flex h-8 items-center gap-0 overflow-hidden rounded-[10px]"
    >
      {/* 
        THE BACKGROUND LAYER
        Fades in purely on hover to create the "expanded container" illusion.
      */}
      <motion.div
        className="absolute inset-0 z-0 rounded-[10px] bg-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* 1. THE ACTIVE ICON (The Morphing Squircle) */}
      <motion.button
        onClick={cycleTheme}
        aria-label="Cycle theme"
        // Morphs from 32x32 (radius 10) to 24x24 (radius 6) perfectly
        animate={{
          width: isHovered ? 24 : 32,
          height: isHovered ? 24 : 32,
          borderRadius: isHovered ? 6 : 10,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        className="relative z-10 flex shrink-0 items-center justify-center bg-foreground text-background transition-transform focus-visible:outline-none active:scale-95"
      >
        <HugeiconsIcon icon={activeOption.icon} className="size-3.5" />
      </motion.button>

      {/* 2. THE INACTIVE ICONS */}
      {inactiveOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={(e) => selectTheme(e, opt.value)}
          aria-label={`Switch to ${opt.label} theme`}
          className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-[6px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none"
        >
          <HugeiconsIcon icon={opt.icon} className="size-3.5" />
        </button>
      ))}

      {/* 3. THE KEYBOARD HINT */}
      <div className="relative z-10 ml-0.5 flex shrink-0 items-center pr-1 pl-0.5">
        <span className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground">
          d
        </span>
      </div>
    </motion.div>
  )
}
