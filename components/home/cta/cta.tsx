"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

/* ==========================================================================
   COMPOUND ROOT: <Cta>
   ========================================================================== */

export interface CtaProps extends React.ComponentProps<"section"> {
  className?: string
  children?: React.ReactNode
}

export function Cta({
  id = "cta",
  "aria-label": ariaLabel = "Call to Action",
  className,
  children,
  ...props
}: CtaProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn("relative mx-auto w-full select-none", className)}
      {...props}
    >
      {children}
    </section>
  )
}

/* ==========================================================================
   COMPOUND TYPOGRAPHY PRIMITIVES
   ========================================================================== */

export interface CtaHeaderProps extends React.ComponentProps<"div"> {
  align?: "left" | "center"
}

export function CtaHeader({
  align = "center",
  className,
  children,
  ...props
}: CtaHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CtaEyebrow({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-sans text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function CtaTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "mt-2.5 font-heading text-2xl font-semibold tracking-tight text-foreground sm:mt-3 sm:text-3xl",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export const CtaHeading = CtaTitle

export function CtaDescription({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mt-3.5 max-w-md font-sans text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:text-sm sm:leading-[1.7]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/* ==========================================================================
   COMPOUND ACTION PRIMITIVES
   ========================================================================== */

export interface CtaActionsProps extends React.ComponentProps<"div"> {
  align?: "left" | "center"
}

export function CtaActions({
  align = "center",
  className,
  children,
  ...props
}: CtaActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 sm:flex-row sm:gap-6",
        align === "left" && "items-start justify-start",
        align === "center" && "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface CtaActionProps {
  href?: string
  variant?: "primary" | "secondary"
  external?: boolean
  icon?: React.ReactNode
  showIcon?: boolean
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export function CtaAction({
  href,
  variant = "primary",
  external = false,
  icon,
  showIcon = true,
  className,
  children,
  onClick,
}: CtaActionProps) {
  const isPrimary = variant === "primary"

  const defaultIcon = isPrimary ? (
    <HugeiconsIcon
      icon={ArrowRight01Icon}
      className="size-3.5 transition-transform group-hover:translate-x-0.5"
    />
  ) : (
    <HugeiconsIcon
      icon={external ? ArrowUpRight01Icon : ArrowRight01Icon}
      className="size-3.5 transition-transform group-hover:translate-x-0.5"
    />
  )

  const content = (
    <>
      <span>{children}</span>
      {showIcon && (icon ?? defaultIcon)}
    </>
  )

  const combinedClassName = cn(
    "group inline-flex items-center justify-center font-sans font-medium transition-all",
    isPrimary
      ? "h-9.5 gap-2 rounded-[12px] bg-foreground px-5 text-xs text-background hover:bg-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98] sm:h-10 sm:text-sm"
      : "gap-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none sm:text-sm",
    className
  )

  if (href) {
    if (external || href.startsWith("http")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClassName}
          onClick={onClick}
        >
          {content}
        </a>
      )
    }
    return (
      <Link href={href} className={combinedClassName} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={combinedClassName} onClick={onClick}>
      {content}
    </button>
  )
}

/* ==========================================================================
   COMPOUND CHASSIS & CARD PRIMITIVES
   ========================================================================== */

export function CtaChassis({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] bg-muted p-1 sm:rounded-[24px] sm:p-1.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CtaCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col justify-between rounded-[16px] bg-background p-4 sm:rounded-[18px] sm:p-8 md:p-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ==========================================================================
   COMPOUND PORTAL TRIGGER PRIMITIVE (Circular direction portal for Variant 3)
   ========================================================================== */

export interface CtaPortalTriggerProps {
  href: string
  label?: string
  inverted?: boolean
  className?: string
  icon?: React.ReactNode
}

export function CtaPortalTrigger({
  href,
  label = "Get Started",
  inverted = false,
  className,
  icon,
}: CtaPortalTriggerProps) {
  return (
    <div className="flex shrink-0 flex-col items-start gap-2.5 md:items-end">
      {label && (
        <span
          className={cn(
            "font-mono text-[11px] font-medium tracking-wide uppercase",
            inverted ? "text-background" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      )}

      <Link
        href={href}
        aria-label={label}
        className={cn(
          "group relative flex size-12 items-center justify-center rounded-full sm:size-14 md:size-16",
          "transition-all duration-300 hover:scale-105 active:scale-95",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          inverted
            ? "bg-background text-foreground"
            : "bg-foreground text-background",
          className
        )}
      >
        {icon ?? (
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-5 transition-transform group-hover:translate-x-0.5 sm:size-6"
          />
        )}
      </Link>
    </div>
  )
}
