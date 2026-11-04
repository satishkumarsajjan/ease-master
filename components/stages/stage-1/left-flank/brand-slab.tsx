"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  BookOpen01Icon,
  Sun02Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { SatisiumLogo } from "@/components/satisium-logo"
import { CommandMenuTrigger } from "@/components/layout/command-menu"
import { useMounted } from "@/hooks/use-mounted"
import { ROUTES } from "@/lib/routes"
import { PROJECT } from "@/lib/social-links"

export function BrandSlab() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header
      aria-label="Block 1: Brand and Quick Actions"
      className="flex shrink-0 flex-col gap-2 select-none"
    >
      {/* BRAND CHASSIS: DUAL-BOX (BOX-IN-BOX) WITH CONCAVE INVERSE FILLETS */}
      <div className="flex flex-col items-end">
        {/* The Outer Box Chassis: Ultra-thin subtle brand razor bezel */}
        <div className="flex w-full flex-col rounded-[14px] bg-brand p-0.5 transition-colors">
          {/* The Inner Box Slab: Elevated height with prominent brand lockup */}
          <div className="flex h-12 w-full items-center justify-between rounded-[12px] bg-background px-3.5 transition-colors">
            <div className="flex items-center gap-2.5">
              <SatisiumLogo size={28} className="shrink-0" />
              <span className="font-heading text-base font-semibold tracking-tight text-foreground">
                Ease
              </span>
            </div>
            <span className="font-sans text-[11px] font-normal text-muted-foreground">
              v1.0
            </span>
          </div>
        </div>

        {/* Satisium Folded Architectural Index Tab with Continuous Inverse Fillets */}
        <div className="relative -mt-px mr-3.5 inline-flex h-6 items-center justify-center rounded-b-[7px] bg-brand px-3 text-brand-foreground select-none">
          {/* Left Concave Inverse Fillet */}
          <svg
            className="pointer-events-none absolute top-0 right-full h-2 w-2"
            viewBox="0 0 8 8"
            fill="none"
            style={{ fill: "var(--brand)" }}
            aria-hidden="true"
          >
            <path d="M0 0 A 8 8 0 0 1 8 8 L 8 0 Z" />
          </svg>

          {/* Right Concave Inverse Fillet */}
          <svg
            className="pointer-events-none absolute top-0 left-full h-2 w-2"
            viewBox="0 0 8 8"
            fill="none"
            style={{ fill: "var(--brand)" }}
            aria-hidden="true"
          >
            <path d="M0 8 A 8 8 0 0 1 8 0 L 0 0 Z" />
          </svg>

          <span className="font-sans text-[10px] leading-none tracking-tight">
            <span className="font-normal opacity-90">A tool by </span>
            <span className="font-bold tracking-normal">Satisium</span>
          </span>
        </div>
      </div>

      {/* ACTION ROW: COMMAND MENU TRIGGER + 3 CLEAN SQUIRCLES */}
      <div className="mt-1 flex items-center gap-1.5">
        {/* Command Menu Trigger (Default Wide Variant) */}
        <CommandMenuTrigger className="h-9 w-auto min-w-0 flex-1 rounded-[10px] bg-background px-3 text-xs text-muted-foreground shadow-none transition-colors hover:bg-secondary hover:text-foreground" />

        {/* 1. Github Squircle */}
        <a
          href={PROJECT.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
          title="GitHub Repository"
          className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <SiGithub className="size-3.5 fill-current" />
        </a>

        {/* 2. Docs Squircle */}
        <Link
          href={ROUTES.docs}
          aria-label="Documentation"
          title="Documentation (/docs)"
          className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <HugeiconsIcon icon={BookOpen01Icon} className="size-4" />
        </Link>

        {/* 3. Theme Toggle Squircle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Color Theme"
          title="Toggle Color Theme"
          className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <HugeiconsIcon
            icon={mounted && theme === "dark" ? Sun02Icon : Moon02Icon}
            className="size-4"
          />
        </button>
      </div>
    </header>
  )
}
