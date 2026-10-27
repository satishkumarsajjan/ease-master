"use client"

import * as React from "react"
import Link from "next/link"
import { useState } from "react"
import { Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { MinimalThemeSwitcher } from "@/components/home/minimal-theme-switcher"
import { AppNav } from "@/components/layout/app-nav"
import { CommandMenuTrigger } from "@/components/layout/command-menu"
import { SatisiumLogo } from "@/components/satisium-logo"
import { ActionButton } from "@/components/ui/action-button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PRODUCT } from "@/lib/config"
import { APP_NAV } from "@/lib/nav"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

export interface SiteHeaderProps {
  sticky?: boolean
  /** Right-hand call to action; set null to hide. */
  cta?: React.ReactNode
  className?: string
}

export function SiteHeader({ sticky = true, cta, className }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        "z-40 flex h-16 w-full shrink-0 items-center border-b border-border bg-background backdrop-blur",
        sticky && "sticky top-0",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3 px-6 sm:px-8 lg:px-16">
        {/* Brand */}
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="flex size-7 items-center justify-center">
            <SatisiumLogo size="100%" />
          </span>
          <span className="font-heading text-base font-bold tracking-tight text-foreground">
            {PRODUCT.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <AppNav
          items={APP_NAV}
          orientation="horizontal"
          className="ml-4 hidden lg:flex"
        />

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2">
          <CommandMenuTrigger />
          <MinimalThemeSwitcher />
          {cta ?? (
            <ActionButton
              label="Open app"
              href={ROUTES.app}
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            />
          )}

          {/* Mobile drawer */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open navigation"
              className="flex size-10 items-center justify-center rounded-[14px] text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
            >
              <HugeiconsIcon icon={Menu01Icon} className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left">{PRODUCT.name}</SheetTitle>
              </SheetHeader>
              <AppNav items={APP_NAV} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
