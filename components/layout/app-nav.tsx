"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"

import type { NavItem } from "@/lib/nav"
import { SPRING } from "@/lib/motion"
import { cn } from "@/lib/utils"

export interface AppNavProps {
  items: NavItem[]
  orientation?: "vertical" | "horizontal"
  /** Close the mobile drawer after navigating. */
  onNavigate?: () => void
  className?: string
}

type IconProp = React.ComponentProps<typeof HugeiconsIcon>["icon"]

export function AppNav({
  items,
  orientation = "vertical",
  onNavigate,
  className,
}: AppNavProps) {
  const pathname = usePathname()
  const isVertical = orientation === "vertical"

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex gap-1",
        isVertical ? "flex-col" : "flex-row items-center",
        className
      )}
    >
      {items.map((item) => {
        const isActive =
          !item.external &&
          (pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href)))

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-2 rounded-[12px] px-3 py-2 text-sm font-medium transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive ? (
              <motion.span
                layoutId={`app-nav-active-${orientation}`}
                className="absolute inset-0 -z-10 rounded-[12px] bg-muted"
                transition={SPRING.pill}
              />
            ) : null}

            {item.icon ? (
              <HugeiconsIcon
                icon={item.icon as IconProp}
                className="size-4 shrink-0"
              />
            ) : null}
            <span className="truncate">{item.label}</span>

            {item.badge ? (
              <span className="ml-auto rounded-[6px] bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                {item.badge}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
