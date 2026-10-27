"use client"

import * as React from "react"
import Link from "next/link"
import {
  SiX,
  SiGithub,
  SiDiscord,
  SiInstagram,
} from "@icons-pack/react-simple-icons"

import { SatisiumLogo } from "@/components/satisium-logo"
import { PRODUCT, LEGAL } from "@/config/site"
import { FOOTER_NAV, type NavItem } from "@/lib/nav"
import { ROUTES } from "@/lib/routes"
import { AUTHOR, FOOTER_SOCIALS, type SocialLink } from "@/lib/social-links"
import { cn } from "@/lib/utils"

/* ==========================================================================
   COMPOUND ROOT: <Footer>
   ========================================================================== */

export interface FooterProps extends React.ComponentProps<"footer"> {
  className?: string
  children?: React.ReactNode
}

export function Footer({
  id = "site-footer",
  "aria-label": ariaLabel = "Site Footer",
  className,
  children,
  ...props
}: FooterProps) {
  return (
    <footer
      id={id}
      aria-label={ariaLabel}
      className={cn("relative flex w-full flex-col select-none", className)}
      {...props}
    >
      {children}
    </footer>
  )
}

/* ==========================================================================
   SOCIAL ICONS & DOCK PRIMITIVES
   ========================================================================== */

export function FooterSocialIcon({
  platform,
  className,
}: {
  platform: string
  className?: string
}) {
  const iconClass = cn("size-3.5 fill-current", className)
  switch (platform) {
    case "x":
      return <SiX className={iconClass} />
    case "github":
      return <SiGithub className={iconClass} />
    case "discord":
      return <SiDiscord className={iconClass} />
    case "instagram":
      return <SiInstagram className={iconClass} />
    default:
      return null
  }
}

export interface FooterSocialDockProps extends React.ComponentProps<"div"> {
  socials?: SocialLink[]
  buttonClassName?: string
}

export function FooterSocialDock({
  socials = FOOTER_SOCIALS,
  className,
  buttonClassName,
  ...props
}: FooterSocialDockProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {socials.map((social) => (
        <a
          key={social.platform}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          aria-label={social.ariaLabel}
          className={cn(
            "group flex size-8 items-center justify-center rounded-[10px] bg-muted",
            "text-muted-foreground transition-colors duration-150",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
            buttonClassName
          )}
        >
          <FooterSocialIcon platform={social.platform} />
        </a>
      ))}
    </div>
  )
}

/* ==========================================================================
   BRAND ISLAND PRIMITIVE
   ========================================================================== */

export interface FooterBrandIslandProps extends React.ComponentProps<"div"> {
  productName?: string
  description?: string
  socials?: SocialLink[]
}

export function FooterBrandIsland({
  productName = PRODUCT.name,
  description = "The architectural foundation for next-generation web craftsmanship.",
  socials = FOOTER_SOCIALS,
  className,
  children,
  ...props
}: FooterBrandIslandProps) {
  return (
    <div
      className={cn("flex shrink-0 flex-col items-start gap-4", className)}
      {...props}
    >
      {children ?? (
        <>
          {/* Brand Identity */}
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2 font-heading text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="flex size-5 shrink-0 items-center justify-center">
              <SatisiumLogo size="100%" />
            </span>
            <span>{productName}</span>
          </Link>

          {/* Architectural Description */}
          {description && (
            <p className="max-w-xs font-sans text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}

          {/* Social Dock */}
          {socials && <FooterSocialDock socials={socials} />}
        </>
      )}
    </div>
  )
}

/* ==========================================================================
   DIRECTORY MATRIX PRIMITIVES
   ========================================================================== */

export interface FooterNavColumnProps {
  title: string
  items: NavItem[]
  className?: string
}

export function FooterNavColumn({
  title,
  items,
  className,
}: FooterNavColumnProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h3 className="font-heading text-xs font-semibold tracking-wider text-foreground uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => {
          const isExternal = item.external || item.href.startsWith("http")
          return (
            <li key={item.label}>
              {isExternal ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="font-sans text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export interface FooterNavMatrixProps extends React.ComponentProps<"div"> {
  navigation?: typeof FOOTER_NAV
}

export function FooterNavMatrix({
  navigation = FOOTER_NAV,
  className,
  ...props
}: FooterNavMatrixProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-8 gap-y-8 sm:flex sm:justify-between sm:gap-6 lg:gap-8",
        className
      )}
      {...props}
    >
      {navigation.map((column) => (
        <FooterNavColumn
          key={column.title}
          title={column.title}
          items={column.items}
        />
      ))}
    </div>
  )
}

/* ==========================================================================
   BASELINE & LEGAL ATTRIBUTION
   ========================================================================== */

export interface FooterBaselineProps extends React.ComponentProps<"div"> {
  companyName?: string
  authorName?: string
  authorHref?: string
}

export function FooterBaseline({
  companyName = LEGAL.company,
  authorName = AUTHOR.name,
  authorHref = AUTHOR.website,
  className,
  children,
  ...props
}: FooterBaselineProps) {
  return (
    <div
      className={cn(
        "mt-8 flex flex-col gap-3 font-sans text-xs text-muted-foreground sm:mt-10 sm:flex-row sm:items-center sm:justify-between lg:mt-12",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <div>
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with precision by</span>
            <a
              href={authorHref}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline-offset-4 transition-colors hover:underline focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            >
              {authorName}
            </a>
          </div>
        </>
      )}
    </div>
  )
}
